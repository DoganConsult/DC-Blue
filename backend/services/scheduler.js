import cron from 'node-cron';
import { sendEmail, sendInternalAlert } from './email.js';

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

  console.log('[SCHEDULER] Cron jobs started (SLA breach 2h, exclusivity daily 8am, overdue 9:30am)');
}
