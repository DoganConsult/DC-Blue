import cron from 'node-cron';
import { sendEmail, sendInternalAlert, sendRawEmail } from './email.js';

export function startScheduler(pool) {
  cron.schedule('0 */2 * * *', async () => {
    try {
      const stale = await pool.query(
        `SELECT id, ticket_number, company_name, contact_name, contact_email, status, assigned_to, created_at,
                EXTRACT(EPOCH FROM (now() - created_at)) / 3600 AS hours_since
         FROM lead_intakes
         WHERE status = 'new' AND created_at < now() - interval '24 hours'
         ORDER BY created_at ASC LIMIT 20`
      );

      for (const lead of stale.rows) {
        await sendInternalAlert(pool, 'sla_breach_warning', {
          ticket_number: lead.ticket_number,
          company_name: lead.company_name,
          status: lead.status,
          assigned_to: lead.assigned_to || 'Unassigned',
          hours: Math.round(lead.hours_since),
          admin_url: `${process.env.APP_URL || 'https://www.doganconsult.com'}/admin/leads/${lead.id}`,
        });
      }

      if (stale.rows.length > 0) {
        await pool.query(
          `INSERT INTO scheduled_tasks_log (task_name, status, details)
           VALUES ('sla_breach_check', 'completed', $1)`,
          [`Flagged ${stale.rows.length} stale leads`]
        );
      }
    } catch (e) {
      console.error('SLA breach check error:', e.message);
    }
  });

  cron.schedule('0 8 * * 1-5', async () => {
    try {
      const expiring = await pool.query(
        `SELECT pl.id, pl.partner_id, pl.lead_intake_id, pl.exclusivity_start_at,
                li.ticket_number, li.company_name,
                p.contact_email AS partner_email
         FROM partner_leads pl
         JOIN lead_intakes li ON li.id = pl.lead_intake_id
         JOIN partners p ON p.id = pl.partner_id
         WHERE pl.status = 'approved'
           AND pl.exclusivity_start_at IS NOT NULL
           AND pl.exclusivity_start_at < now() - interval '80 days'
           AND pl.exclusivity_start_at > now() - interval '91 days'`
      );

      for (const row of expiring.rows) {
        await sendEmail(pool, 'stage_update', {
          company_name: row.company_name,
          ticket_number: row.ticket_number,
          new_stage: 'Exclusivity expiring in ~10 days',
        }, row.partner_email, 'en');
      }

      if (expiring.rows.length > 0) {
        await pool.query(
          `INSERT INTO scheduled_tasks_log (task_name, status, details)
           VALUES ('exclusivity_expiry_check', 'completed', $1)`,
          [`Notified ${expiring.rows.length} partners`]
        );
      }
    } catch (e) {
      console.error('Exclusivity check error:', e.message);
    }
  });

  cron.schedule('30 9 * * 1-5', async () => {
    try {
      const overdue = await pool.query(
        `SELECT o.id, o.title, o.stage, o.owner, o.next_action, o.next_action_at,
                li.ticket_number, li.company_name, li.contact_email
         FROM opportunities o
         LEFT JOIN lead_intakes li ON li.id = o.lead_intake_id
         WHERE o.next_action_at IS NOT NULL
           AND o.next_action_at < now()
           AND o.stage NOT IN ('closed_won', 'closed_lost')
         ORDER BY o.next_action_at ASC LIMIT 20`
      );

      for (const opp of overdue.rows) {
        await sendInternalAlert(pool, 'sla_breach_warning', {
          ticket_number: opp.ticket_number || opp.id,
          company_name: opp.company_name || opp.title,
          status: `${opp.stage} — overdue action: ${opp.next_action}`,
          assigned_to: opp.owner || 'Unassigned',
          hours: Math.round((Date.now() - new Date(opp.next_action_at).getTime()) / 3600000),
          admin_url: `${process.env.APP_URL || 'https://www.doganconsult.com'}/admin`,
        });
      }
    } catch (e) {
      console.error('Overdue actions check error:', e.message);
    }
  });

  // Weekly partner digest — every Monday at 9 AM
  cron.schedule('0 9 * * 1', async () => {
    try {
      // Get partners who opted in to weekly digest
      const partners = await pool.query(
        `SELECT p.id, p.contact_name, p.contact_email, p.company_name, p.tier
         FROM partners p
         LEFT JOIN partner_email_preferences ep ON ep.partner_id = p.id
         WHERE p.status = 'approved'
           AND (ep.weekly_digest IS NULL OR ep.weekly_digest = TRUE)`
      );

      for (const partner of partners.rows) {
        // Get last 7 days stats
        const [leads, commissions, pipeline] = await Promise.all([
          pool.query(
            `SELECT COUNT(*) AS new_leads,
                    COUNT(*) FILTER (WHERE o.stage = 'closed_won') AS won
             FROM partner_leads pl
             JOIN lead_intakes li ON li.id = pl.lead_intake_id
             LEFT JOIN LATERAL (SELECT stage FROM opportunities WHERE lead_intake_id = li.id ORDER BY updated_at DESC LIMIT 1) o ON true
             WHERE pl.partner_id = $1 AND pl.created_at > NOW() - INTERVAL '7 days'`,
            [partner.id]
          ),
          pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS weekly_total
             FROM commissions WHERE partner_id = $1 AND created_at > NOW() - INTERVAL '7 days'`,
            [partner.id]
          ),
          pool.query(
            `SELECT COUNT(*) AS active_deals
             FROM opportunities o
             JOIN partner_leads pl ON pl.lead_intake_id = o.lead_intake_id
             WHERE pl.partner_id = $1 AND o.stage NOT IN ('closed_won', 'closed_lost')`,
            [partner.id]
          ),
        ]);

        const ls = leads.rows[0];
        const cs = commissions.rows[0];
        const ps = pipeline.rows[0];

        const html = `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
            <h2 style="color:#E3B76B;">Weekly Partner Digest</h2>
            <p>Hi ${partner.contact_name || 'Partner'},</p>
            <p>Here's your week in review for <strong>${partner.company_name}</strong>:</p>
            <div style="background:rgba(255,255,255,0.1);padding:16px;border-radius:8px;margin:16px 0;">
              <p><strong>New leads this week:</strong> ${ls.new_leads}</p>
              <p><strong>Deals won:</strong> ${ls.won}</p>
              <p><strong>Commission earned:</strong> SAR ${(+cs.weekly_total).toLocaleString()}</p>
              <p><strong>Active pipeline deals:</strong> ${ps.active_deals}</p>
            </div>
            <p><a href="${process.env.APP_URL || 'https://www.doganconsult.com'}/partner" style="display:inline-block;background:#E3B76B;color:#0A3C6B;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Dashboard</a></p>
            <hr style="border-color:rgba(255,255,255,0.2);"/>
            <p style="font-size:11px;color:rgba(255,255,255,0.5);">You can disable weekly digests in your Partner Portal settings.</p>
          </div>`;

        await sendRawEmail(pool, partner.contact_email, `Weekly Digest — ${partner.company_name}`, html).catch(() => {});
      }

      if (partners.rows.length > 0) {
        await pool.query(
          `INSERT INTO scheduled_tasks_log (task_name, status, details) VALUES ('partner_weekly_digest', 'completed', $1)`,
          [`Sent to ${partners.rows.length} partners`]
        );
      }
    } catch (e) {
      console.error('Weekly digest error:', e.message);
    }
  });

  // Monthly partner report — 1st of each month at 10 AM
  cron.schedule('0 10 1 * *', async () => {
    try {
      const partners = await pool.query(
        `SELECT p.id, p.contact_name, p.contact_email, p.company_name, p.tier
         FROM partners p
         LEFT JOIN partner_email_preferences ep ON ep.partner_id = p.id
         WHERE p.status = 'approved'
           AND (ep.monthly_report IS NULL OR ep.monthly_report = TRUE)`
      );

      for (const partner of partners.rows) {
        const [leads, commissions] = await Promise.all([
          pool.query(
            `SELECT COUNT(*) AS total,
                    COUNT(*) FILTER (WHERE o.stage = 'closed_won') AS won,
                    COUNT(*) FILTER (WHERE o.stage = 'closed_lost') AS lost
             FROM partner_leads pl
             JOIN lead_intakes li ON li.id = pl.lead_intake_id
             LEFT JOIN LATERAL (SELECT stage FROM opportunities WHERE lead_intake_id = li.id ORDER BY updated_at DESC LIMIT 1) o ON true
             WHERE pl.partner_id = $1 AND pl.created_at > DATE_TRUNC('month', NOW() - INTERVAL '1 month')
               AND pl.created_at < DATE_TRUNC('month', NOW())`,
            [partner.id]
          ),
          pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
             FROM commissions WHERE partner_id = $1
               AND created_at > DATE_TRUNC('month', NOW() - INTERVAL '1 month')
               AND created_at < DATE_TRUNC('month', NOW())`,
            [partner.id]
          ),
        ]);

        const ls = leads.rows[0];
        const cs = commissions.rows[0];
        const convRate = +ls.total > 0 ? Math.round((+ls.won / +ls.total) * 100) : 0;

        const html = `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
            <h2 style="color:#E3B76B;">Monthly Partner Report</h2>
            <p>Hi ${partner.contact_name || 'Partner'},</p>
            <p>Here's your monthly summary for <strong>${partner.company_name}</strong>:</p>
            <div style="background:rgba(255,255,255,0.1);padding:16px;border-radius:8px;margin:16px 0;">
              <p><strong>Leads submitted:</strong> ${ls.total}</p>
              <p><strong>Deals won:</strong> ${ls.won} | <strong>Lost:</strong> ${ls.lost}</p>
              <p><strong>Conversion rate:</strong> ${convRate}%</p>
              <p><strong>Commission earned:</strong> SAR ${(+cs.total).toLocaleString()} (${cs.count} payouts)</p>
              <p><strong>Current tier:</strong> ${partner.tier}</p>
            </div>
            <p><a href="${process.env.APP_URL || 'https://www.doganconsult.com'}/partner" style="display:inline-block;background:#E3B76B;color:#0A3C6B;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Full Analytics</a></p>
            <hr style="border-color:rgba(255,255,255,0.2);"/>
            <p style="font-size:11px;color:rgba(255,255,255,0.5);">You can disable monthly reports in your Partner Portal settings.</p>
          </div>`;

        await sendRawEmail(pool, partner.contact_email, `Monthly Report — ${partner.company_name}`, html).catch(() => {});
      }

      if (partners.rows.length > 0) {
        await pool.query(
          `INSERT INTO scheduled_tasks_log (task_name, status, details) VALUES ('partner_monthly_report', 'completed', $1)`,
          [`Sent to ${partners.rows.length} partners`]
        );
      }
    } catch (e) {
      console.error('Monthly report error:', e.message);
    }
  });

  // ERP auto-sync — every 4 hours, sync unsynced records
  cron.schedule('0 */4 * * *', async () => {
    try {
      const { ERPNextClient, ENTITY_MAP, pushToERP } = await import('./erp-sync.js');

      // Load ERP config
      let config = {};
      try {
        const r = await pool.query(
          `SELECT setting_value FROM admin_settings WHERE setting_key = 'erp_config' LIMIT 1`
        );
        if (r.rows.length) config = JSON.parse(r.rows[0].setting_value);
      } catch (_) {}

      const erpUrl = config.url || process.env.ERP_URL;
      if (!erpUrl) return; // ERP not configured, skip

      const client = new ERPNextClient({
        url: erpUrl,
        apiKey: config.api_key || process.env.ERP_API_KEY || '',
        apiSecret: config.api_secret || process.env.ERP_API_SECRET || '',
        user: config.user || process.env.ERP_USER || 'Administrator',
        pass: config.pass || process.env.ERP_PASS || '',
      });

      let totalPushed = 0;
      for (const entityType of Object.keys(ENTITY_MAP)) {
        try {
          const unsynced = await pool.query(
            `SELECT id FROM ${entityType} WHERE erp_sync_id IS NULL ORDER BY created_at ASC LIMIT 10`
          ).catch(() => ({ rows: [] }));

          for (const row of unsynced.rows) {
            try {
              await pushToERP(client, pool, entityType, row.id);
              totalPushed++;
            } catch (_) {}
          }
        } catch (_) {}
      }

      if (totalPushed > 0) {
        await pool.query(
          `INSERT INTO scheduled_tasks_log (task_name, status, details) VALUES ('erp_auto_sync', 'completed', $1)`,
          [`Pushed ${totalPushed} records to ERPNext`]
        ).catch(() => {});
      }
    } catch (e) {
      console.error('ERP auto-sync error:', e.message);
    }
  });

  console.log('[SCHEDULER] Cron jobs started (SLA 2h, exclusivity 8am, overdue 9:30am, partner weekly Mon 9am, partner monthly 1st 10am, ERP sync 4h)');
}
