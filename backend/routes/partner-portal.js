import { Router } from 'express';
import { chatWithAI } from '../services/ai.js';
import { notifyPartner, broadcastToPartner } from '../services/notifications.js';
import { sendInternalAlert } from '../services/email.js';

/**
 * Reusable partner auth middleware — validates x-api-key header
 * and attaches partner info to req.partner
 */
export function partnerAuth(pool) {
  return async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    if (!apiKey) return res.status(401).json({ error: 'API key required' });
    try {
      const result = await pool.query(
        `SELECT id, company_name, contact_name, contact_email, tier, commission_rate, status
         FROM partners WHERE api_key = $1`,
        [apiKey]
      );
      if (!result.rows.length) return res.status(403).json({ error: 'Invalid API key' });
      if (result.rows[0].status !== 'approved') {
        return res.status(403).json({ error: 'Partner account not yet approved' });
      }
      req.partner = result.rows[0];
      next();
    } catch (e) {
      console.error('Partner auth error:', e.message);
      res.status(500).json({ error: 'Authentication failed' });
    }
  };
}

export default function partnerPortalRouter(pool) {
  const router = Router();
  const auth = partnerAuth(pool);

  /* ── Dashboard: aggregated stats ──────────────────────── */
  router.get('/partners/dashboard', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;

      const [leadStats, commissionStats, pipelineStats] = await Promise.all([
        // Lead counts by status
        pool.query(
          `SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE li.status = 'new' OR pl.status = 'submitted') AS submitted,
            COUNT(*) FILTER (WHERE li.status IN ('qualified','contacted','open') OR pl.status = 'approved') AS approved,
            COUNT(*) FILTER (WHERE o.id IS NOT NULL AND o.stage NOT IN ('closed_won','closed_lost')) AS in_pipeline,
            COUNT(*) FILTER (WHERE o.stage = 'closed_won') AS closed_won,
            COUNT(*) FILTER (WHERE o.stage = 'closed_lost') AS closed_lost
           FROM partner_leads pl
           JOIN lead_intakes li ON li.id = pl.lead_intake_id
           LEFT JOIN LATERAL (SELECT id, stage FROM opportunities WHERE lead_intake_id = li.id ORDER BY updated_at DESC LIMIT 1) o ON true
           WHERE pl.partner_id = $1`,
          [partnerId]
        ),
        // Commission totals by status
        pool.query(
          `SELECT
            COALESCE(SUM(amount), 0) AS total_earned,
            COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) AS pending,
            COALESCE(SUM(amount) FILTER (WHERE status = 'approved'), 0) AS approved,
            COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) AS paid
           FROM commissions WHERE partner_id = $1`,
          [partnerId]
        ),
        // Pipeline value (open opportunities only)
        pool.query(
          `SELECT
            COALESCE(SUM(o.estimated_value), 0) AS total_value,
            COALESCE(SUM(o.estimated_value * o.probability / 100.0), 0) AS weighted_value
           FROM opportunities o
           JOIN partner_leads pl ON pl.lead_intake_id = o.lead_intake_id
           WHERE pl.partner_id = $1 AND o.stage NOT IN ('closed_won', 'closed_lost')`,
          [partnerId]
        ),
      ]);

      const ls = leadStats.rows[0];
      const cs = commissionStats.rows[0];
      const ps = pipelineStats.rows[0];

      res.json({
        partner: {
          id: req.partner.id,
          company_name: req.partner.company_name,
          contact_name: req.partner.contact_name,
          tier: req.partner.tier,
          commission_rate: +req.partner.commission_rate,
        },
        leads: {
          total: +ls.total,
          submitted: +ls.submitted,
          approved: +ls.approved,
          in_pipeline: +ls.in_pipeline,
          closed_won: +ls.closed_won,
          closed_lost: +ls.closed_lost,
        },
        commissions: {
          total_earned: +cs.total_earned,
          pending: +cs.pending,
          approved: +cs.approved,
          paid: +cs.paid,
          currency: 'SAR',
        },
        pipeline: {
          total_value: +ps.total_value,
          weighted_value: +ps.weighted_value,
          currency: 'SAR',
        },
      });
    } catch (e) {
      console.error('Partner dashboard error:', e.message);
      res.status(500).json({ error: 'Failed to load dashboard' });
    }
  });

  /* ── Commissions: list + summary ──────────────────────── */
  router.get('/partners/commissions', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;
      const { status, page = 1, limit = 20 } = req.query;
      const offset = (Math.max(1, +page) - 1) * +limit;

      let where = ['c.partner_id = $1'];
      let params = [partnerId];
      let idx = 2;

      if (status && ['pending', 'approved', 'paid'].includes(status)) {
        where.push(`c.status = $${idx++}`);
        params.push(status);
      }

      const clause = 'WHERE ' + where.join(' AND ');

      const [countQ, rows, summary] = await Promise.all([
        pool.query(`SELECT count(*) FROM commissions c ${clause}`, params),
        pool.query(
          `SELECT c.id, c.amount, c.currency, c.status, c.paid_at, c.created_at,
                  o.title AS opportunity_title, o.estimated_value, o.stage AS opportunity_stage,
                  li.company_name AS client_company, li.ticket_number, li.product_line
           FROM commissions c
           LEFT JOIN opportunities o ON o.id = c.opportunity_id
           LEFT JOIN lead_intakes li ON li.id = o.lead_intake_id
           ${clause}
           ORDER BY c.created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
          [...params, +limit, offset]
        ),
        pool.query(
          `SELECT
            COALESCE(SUM(amount), 0) AS total_earned,
            COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) AS pending,
            COALESCE(SUM(amount) FILTER (WHERE status = 'approved'), 0) AS approved,
            COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) AS paid
           FROM commissions WHERE partner_id = $1`,
          [partnerId]
        ),
      ]);

      const s = summary.rows[0];
      res.json({
        total: +countQ.rows[0].count,
        page: +page,
        data: rows.rows,
        summary: {
          total_earned: +s.total_earned,
          pending: +s.pending,
          approved: +s.approved,
          paid: +s.paid,
          currency: 'SAR',
        },
      });
    } catch (e) {
      console.error('Partner commissions error:', e.message);
      res.status(500).json({ error: 'Failed to fetch commissions' });
    }
  });

  /* ── Pipeline: opportunities grouped by stage ─────────── */
  router.get('/partners/pipeline', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;

      const rows = await pool.query(
        `SELECT o.id AS opportunity_id, o.lead_intake_id, o.title, o.stage,
                o.estimated_value, o.currency, o.probability, o.updated_at, o.closed_at,
                li.company_name AS client_company, li.contact_name, li.ticket_number, li.product_line
         FROM opportunities o
         JOIN partner_leads pl ON pl.lead_intake_id = o.lead_intake_id
         JOIN lead_intakes li ON li.id = o.lead_intake_id
         WHERE pl.partner_id = $1
         ORDER BY o.updated_at DESC`,
        [partnerId]
      );

      const stageOrder = ['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
      const stages = {};
      for (const s of stageOrder) stages[s] = [];
      for (const row of rows.rows) {
        const s = row.stage || 'discovery';
        if (!stages[s]) stages[s] = [];
        stages[s].push(row);
      }

      const byStage = {};
      let totalValue = 0;
      let weightedValue = 0;
      let totalOpportunities = 0;

      for (const s of stageOrder) {
        const items = stages[s] || [];
        const value = items.reduce((sum, o) => sum + (+o.estimated_value || 0), 0);
        byStage[s] = { count: items.length, value };
        totalOpportunities += items.length;
        if (s !== 'closed_won' && s !== 'closed_lost') {
          totalValue += value;
          weightedValue += items.reduce((sum, o) => sum + ((+o.estimated_value || 0) * (+o.probability || 0) / 100), 0);
        }
      }

      res.json({
        stages,
        summary: {
          total_opportunities: totalOpportunities,
          total_value: totalValue,
          weighted_value: Math.round(weightedValue),
          currency: 'SAR',
          by_stage: byStage,
        },
      });
    } catch (e) {
      console.error('Partner pipeline error:', e.message);
      res.status(500).json({ error: 'Failed to fetch pipeline' });
    }
  });

  /* ── P1: Notifications ─────────────────────────────────── */
  router.get('/partners/notifications', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;
      const { unread_only } = req.query;

      let query = `SELECT id, type, title, body, link, read, created_at
                   FROM partner_notifications WHERE partner_id = $1`;
      const params = [partnerId];
      if (unread_only === 'true') {
        query += ' AND read = FALSE';
      }
      query += ' ORDER BY created_at DESC LIMIT 50';

      const [rows, countQ] = await Promise.all([
        pool.query(query, params),
        pool.query('SELECT COUNT(*) FROM partner_notifications WHERE partner_id = $1 AND read = FALSE', [partnerId]),
      ]);

      res.json({ data: rows.rows, unread_count: +countQ.rows[0].count });
    } catch (e) {
      console.error('Partner notifications error:', e.message);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  router.put('/partners/notifications/:id/read', auth, async (req, res) => {
    try {
      await pool.query(
        'UPDATE partner_notifications SET read = TRUE WHERE id = $1 AND partner_id = $2',
        [req.params.id, req.partner.id]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  router.put('/partners/notifications/read-all', auth, async (req, res) => {
    try {
      await pool.query(
        'UPDATE partner_notifications SET read = TRUE WHERE partner_id = $1 AND read = FALSE',
        [req.partner.id]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to mark all as read' });
    }
  });

  /* ── P1: Activity Timeline ──────────────────────────────── */
  router.get('/partners/activity', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;
      const { page = 1, limit = 30 } = req.query;
      const offset = (Math.max(1, +page) - 1) * +limit;

      const rows = await pool.query(
        `SELECT la.id, la.type, la.body, la.created_by, la.created_at,
                li.ticket_number, li.company_name, li.contact_name
         FROM lead_activities la
         JOIN lead_intakes li ON li.id = la.lead_intake_id
         JOIN partner_leads pl ON pl.lead_intake_id = li.id
         WHERE pl.partner_id = $1 AND COALESCE(la.visibility, 'internal') = 'partner'
         ORDER BY la.created_at DESC
         LIMIT $2 OFFSET $3`,
        [partnerId, +limit, offset]
      );

      const countQ = await pool.query(
        `SELECT COUNT(*) FROM lead_activities la
         JOIN partner_leads pl ON pl.lead_intake_id = la.lead_intake_id
         WHERE pl.partner_id = $1 AND COALESCE(la.visibility, 'internal') = 'partner'`,
        [partnerId]
      );

      res.json({ data: rows.rows, total: +countQ.rows[0].count, page: +page });
    } catch (e) {
      console.error('Partner activity error:', e.message);
      res.status(500).json({ error: 'Failed to fetch activity' });
    }
  });

  /* ── P1: SLA Tracker ────────────────────────────────────── */
  router.get('/partners/sla', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;

      const rows = await pool.query(
        `SELECT pl.id, pl.created_at AS submitted_at, pl.status,
                pl.approved_at, pl.exclusivity_start_at,
                li.ticket_number, li.company_name, li.contact_name, li.status AS lead_status,
                o.stage AS opportunity_stage, o.updated_at AS stage_updated_at,
                EXTRACT(EPOCH FROM (COALESCE(pl.approved_at, NOW()) - pl.created_at))/3600 AS hours_to_review,
                CASE
                  WHEN pl.status = 'submitted' AND NOW() - pl.created_at > INTERVAL '48 hours' THEN 'breached'
                  WHEN pl.status = 'submitted' AND NOW() - pl.created_at > INTERVAL '24 hours' THEN 'at_risk'
                  ELSE 'on_track'
                END AS sla_status
         FROM partner_leads pl
         JOIN lead_intakes li ON li.id = pl.lead_intake_id
         LEFT JOIN LATERAL (SELECT stage, updated_at FROM opportunities WHERE lead_intake_id = li.id ORDER BY updated_at DESC LIMIT 1) o ON true
         WHERE pl.partner_id = $1
         ORDER BY pl.created_at DESC`,
        [partnerId]
      );

      const summary = {
        total: rows.rows.length,
        on_track: rows.rows.filter(r => r.sla_status === 'on_track').length,
        at_risk: rows.rows.filter(r => r.sla_status === 'at_risk').length,
        breached: rows.rows.filter(r => r.sla_status === 'breached').length,
        avg_review_hours: rows.rows.length > 0
          ? Math.round(rows.rows.reduce((s, r) => s + (+r.hours_to_review || 0), 0) / rows.rows.length)
          : 0,
      };

      res.json({ data: rows.rows, summary });
    } catch (e) {
      console.error('Partner SLA error:', e.message);
      res.status(500).json({ error: 'Failed to fetch SLA data' });
    }
  });

  /* ── P2: Partner Profile ────────────────────────────────── */
  router.get('/partners/profile', auth, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, company_name, contact_name, contact_email, contact_phone,
                tier, commission_rate, status, company_website, partner_type,
                bio, logo_url, city, country, address_line, specializations,
                onboarding_completed, onboarding_step, created_at
         FROM partners WHERE id = $1`,
        [req.partner.id]
      );
      if (!result.rows.length) return res.status(404).json({ error: 'Partner not found' });
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  router.put('/partners/profile', auth, async (req, res) => {
    try {
      const { contact_name, contact_phone, company_website, bio, city, country, address_line, specializations } = req.body;
      await pool.query(
        `UPDATE partners SET
          contact_name = COALESCE($2, contact_name),
          contact_phone = COALESCE($3, contact_phone),
          company_website = COALESCE($4, company_website),
          bio = COALESCE($5, bio),
          city = COALESCE($6, city),
          country = COALESCE($7, country),
          address_line = COALESCE($8, address_line),
          specializations = COALESCE($9, specializations),
          updated_at = NOW()
         WHERE id = $1`,
        [req.partner.id, contact_name, contact_phone, company_website, bio, city, country, address_line, specializations || null]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  /* ── P2: Onboarding ─────────────────────────────────────── */
  router.put('/partners/onboarding', auth, async (req, res) => {
    try {
      const { step, completed } = req.body;
      const updates = [];
      const params = [req.partner.id];
      let idx = 2;

      if (typeof step === 'number') {
        updates.push(`onboarding_step = $${idx++}`);
        params.push(step);
      }
      if (typeof completed === 'boolean') {
        updates.push(`onboarding_completed = $${idx++}`);
        params.push(completed);
      }
      updates.push('updated_at = NOW()');

      await pool.query(`UPDATE partners SET ${updates.join(', ')} WHERE id = $1`, params);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update onboarding' });
    }
  });

  /* ── P2: Analytics ──────────────────────────────────────── */
  router.get('/partners/analytics', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;

      const [monthly, conversionFunnel, productMix, topClients] = await Promise.all([
        // Monthly lead + commission trends (last 12 months)
        pool.query(
          `SELECT TO_CHAR(d.month, 'YYYY-MM') AS month,
                  COALESCE(l.lead_count, 0) AS leads,
                  COALESCE(c.commission_total, 0) AS commissions,
                  COALESCE(w.won_count, 0) AS won
           FROM generate_series(
             DATE_TRUNC('month', NOW() - INTERVAL '11 months'),
             DATE_TRUNC('month', NOW()),
             '1 month'
           ) AS d(month)
           LEFT JOIN LATERAL (
             SELECT COUNT(*) AS lead_count FROM partner_leads
             WHERE partner_id = $1 AND DATE_TRUNC('month', created_at) = d.month
           ) l ON true
           LEFT JOIN LATERAL (
             SELECT COALESCE(SUM(amount), 0) AS commission_total FROM commissions
             WHERE partner_id = $1 AND DATE_TRUNC('month', created_at) = d.month
           ) c ON true
           LEFT JOIN LATERAL (
             SELECT COUNT(*) AS won_count FROM partner_leads pl
             JOIN lead_intakes li ON li.id = pl.lead_intake_id
             JOIN opportunities o ON o.lead_intake_id = li.id
             WHERE pl.partner_id = $1 AND o.stage = 'closed_won'
               AND DATE_TRUNC('month', o.closed_at) = d.month
           ) w ON true
           ORDER BY d.month`,
          [partnerId]
        ),
        // Conversion funnel
        pool.query(
          `SELECT
            COUNT(*) AS total_leads,
            COUNT(*) FILTER (WHERE pl.status IN ('accepted','converted') OR li.status NOT IN ('new','spam','duplicate')) AS qualified,
            COUNT(*) FILTER (WHERE o.id IS NOT NULL) AS in_pipeline,
            COUNT(*) FILTER (WHERE o.stage = 'closed_won') AS won
           FROM partner_leads pl
           JOIN lead_intakes li ON li.id = pl.lead_intake_id
           LEFT JOIN LATERAL (SELECT id, stage FROM opportunities WHERE lead_intake_id = li.id ORDER BY updated_at DESC LIMIT 1) o ON true
           WHERE pl.partner_id = $1`,
          [partnerId]
        ),
        // Product mix
        pool.query(
          `SELECT li.product_line, COUNT(*) AS count
           FROM partner_leads pl
           JOIN lead_intakes li ON li.id = pl.lead_intake_id
           WHERE pl.partner_id = $1 AND li.product_line IS NOT NULL AND li.product_line != ''
           GROUP BY li.product_line ORDER BY count DESC LIMIT 10`,
          [partnerId]
        ),
        // Top clients by deal value
        pool.query(
          `SELECT li.company_name, COALESCE(SUM(o.estimated_value), 0) AS total_value, COUNT(*) AS deals
           FROM partner_leads pl
           JOIN lead_intakes li ON li.id = pl.lead_intake_id
           LEFT JOIN opportunities o ON o.lead_intake_id = li.id
           WHERE pl.partner_id = $1
           GROUP BY li.company_name ORDER BY total_value DESC LIMIT 5`,
          [partnerId]
        ),
      ]);

      const funnel = conversionFunnel.rows[0];
      res.json({
        monthly: monthly.rows,
        funnel: {
          total_leads: +funnel.total_leads,
          qualified: +funnel.qualified,
          in_pipeline: +funnel.in_pipeline,
          won: +funnel.won,
        },
        product_mix: productMix.rows,
        top_clients: topClients.rows,
      });
    } catch (e) {
      console.error('Partner analytics error:', e.message);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  /* ── P2: Email Preferences ──────────────────────────────── */
  router.get('/partners/email-preferences', auth, async (req, res) => {
    try {
      let result = await pool.query(
        'SELECT * FROM partner_email_preferences WHERE partner_id = $1',
        [req.partner.id]
      );
      if (!result.rows.length) {
        await pool.query(
          'INSERT INTO partner_email_preferences (partner_id) VALUES ($1) ON CONFLICT DO NOTHING',
          [req.partner.id]
        );
        result = await pool.query(
          'SELECT * FROM partner_email_preferences WHERE partner_id = $1',
          [req.partner.id]
        );
      }
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch preferences' });
    }
  });

  router.put('/partners/email-preferences', auth, async (req, res) => {
    try {
      const { weekly_digest, monthly_report, commission_alerts, pipeline_updates, sla_warnings, marketing_emails } = req.body;
      await pool.query(
        `INSERT INTO partner_email_preferences (partner_id, weekly_digest, monthly_report, commission_alerts, pipeline_updates, sla_warnings, marketing_emails, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         ON CONFLICT (partner_id) DO UPDATE SET
           weekly_digest = COALESCE($2, partner_email_preferences.weekly_digest),
           monthly_report = COALESCE($3, partner_email_preferences.monthly_report),
           commission_alerts = COALESCE($4, partner_email_preferences.commission_alerts),
           pipeline_updates = COALESCE($5, partner_email_preferences.pipeline_updates),
           sla_warnings = COALESCE($6, partner_email_preferences.sla_warnings),
           marketing_emails = COALESCE($7, partner_email_preferences.marketing_emails),
           updated_at = NOW()`,
        [req.partner.id, weekly_digest, monthly_report, commission_alerts, pipeline_updates, sla_warnings, marketing_emails]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  });

  /* ── P3: Tier System ────────────────────────────────────── */
  router.get('/partners/tier', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;
      const [stats, partner] = await Promise.all([
        pool.query(
          `SELECT
            (SELECT COUNT(*) FROM partner_leads WHERE partner_id = $1) AS total_leads,
            (SELECT COUNT(*) FROM partner_leads pl
             JOIN lead_intakes li ON li.id = pl.lead_intake_id
             JOIN opportunities o ON o.lead_intake_id = li.id
             WHERE pl.partner_id = $1 AND o.stage = 'closed_won') AS total_won,
            (SELECT COALESCE(SUM(amount), 0) FROM commissions WHERE partner_id = $1 AND status = 'paid') AS total_revenue`,
          [partnerId]
        ),
        pool.query('SELECT tier, created_at FROM partners WHERE id = $1', [partnerId]),
      ]);

      const s = stats.rows[0];
      const currentTier = partner.rows[0].tier;
      const memberSince = partner.rows[0].created_at;

      // Tier thresholds
      const tiers = [
        { key: 'registered', label: { en: 'Registered', ar: 'مسجل' }, minLeads: 0, minWon: 0, minRevenue: 0, color: '#6b7280' },
        { key: 'silver', label: { en: 'Silver', ar: 'فضي' }, minLeads: 5, minWon: 2, minRevenue: 10000, color: '#9ca3af' },
        { key: 'gold', label: { en: 'Gold', ar: 'ذهبي' }, minLeads: 15, minWon: 5, minRevenue: 50000, color: '#f59e0b' },
        { key: 'platinum', label: { en: 'Platinum', ar: 'بلاتيني' }, minLeads: 30, minWon: 15, minRevenue: 200000, color: '#6366f1' },
      ];

      const currentIdx = tiers.findIndex(t => t.key === currentTier);
      const nextTier = currentIdx < tiers.length - 1 ? tiers[currentIdx + 1] : null;

      let progress = {};
      if (nextTier) {
        progress = {
          leads: { current: +s.total_leads, required: nextTier.minLeads, pct: Math.min(100, Math.round((+s.total_leads / nextTier.minLeads) * 100)) },
          won: { current: +s.total_won, required: nextTier.minWon, pct: Math.min(100, Math.round((+s.total_won / nextTier.minWon) * 100)) },
          revenue: { current: +s.total_revenue, required: nextTier.minRevenue, pct: Math.min(100, Math.round((+s.total_revenue / nextTier.minRevenue) * 100)) },
        };
      }

      res.json({
        current_tier: currentTier,
        tiers,
        next_tier: nextTier,
        progress,
        stats: { total_leads: +s.total_leads, total_won: +s.total_won, total_revenue: +s.total_revenue },
        member_since: memberSince,
      });
    } catch (e) {
      console.error('Partner tier error:', e.message);
      res.status(500).json({ error: 'Failed to fetch tier data' });
    }
  });

  /* ── P3: AI Insights ────────────────────────────────────── */
  router.get('/partners/insights', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;

      const [leadData, commData, pipelineData] = await Promise.all([
        pool.query(
          `SELECT li.product_line, li.city, li.status, pl.created_at
           FROM partner_leads pl JOIN lead_intakes li ON li.id = pl.lead_intake_id
           WHERE pl.partner_id = $1 ORDER BY pl.created_at DESC LIMIT 100`,
          [partnerId]
        ),
        pool.query(
          `SELECT amount, status, created_at FROM commissions WHERE partner_id = $1 ORDER BY created_at DESC LIMIT 50`,
          [partnerId]
        ),
        pool.query(
          `SELECT o.stage, o.probability, o.estimated_value, o.updated_at
           FROM opportunities o JOIN partner_leads pl ON pl.lead_intake_id = o.lead_intake_id
           WHERE pl.partner_id = $1 ORDER BY o.updated_at DESC LIMIT 50`,
          [partnerId]
        ),
      ]);

      const leads = leadData.rows;
      const comms = commData.rows;
      const pipeline = pipelineData.rows;

      // Try AI-powered insights first, fall back to rule-based
      let insights = [];
      const useAI = process.env.ANTHROPIC_API_KEY && leads.length > 0;

      if (useAI) {
        try {
          const contextData = {
            total_leads: leads.length,
            product_lines: {},
            cities: {},
            pipeline_count: pipeline.length,
            stale_deals: 0,
            active_stages: {},
            total_commission_pending: 0,
            total_commission_paid: 0,
            partner_tier: req.partner.tier,
          };

          leads.forEach(l => {
            if (l.product_line) contextData.product_lines[l.product_line] = (contextData.product_lines[l.product_line] || 0) + 1;
            if (l.city) contextData.cities[l.city] = (contextData.cities[l.city] || 0) + 1;
          });
          pipeline.forEach(o => {
            contextData.active_stages[o.stage] = (contextData.active_stages[o.stage] || 0) + 1;
            const days = (Date.now() - new Date(o.updated_at).getTime()) / 86400000;
            if (days > 14 && o.stage !== 'closed_won' && o.stage !== 'closed_lost') contextData.stale_deals++;
          });
          comms.forEach(c => {
            if (c.status === 'pending') contextData.total_commission_pending += +c.amount;
            if (c.status === 'paid') contextData.total_commission_paid += +c.amount;
          });

          const aiResponse = await chatWithAI([{
            role: 'user',
            content: `Analyze this partner's performance data and generate 3-5 actionable insights. Return ONLY a JSON array of insight objects with fields: type (opportunity|warning|info|success|tip), title (object with en and ar keys), body (object with en and ar keys), priority (high|medium|low).

Partner data: ${JSON.stringify(contextData)}

Focus on: opportunities to increase revenue, pipeline health warnings, performance trends, and strategic recommendations for the KSA ICT market. Be specific with numbers. Keep each insight body under 2 sentences.`
          }]);

          // Parse AI response — extract JSON array
          const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed) && parsed.length > 0) {
              insights = parsed;
            }
          }
        } catch (aiErr) {
          console.warn('AI insights fallback to rules:', aiErr.message);
        }
      }

      // Rule-based fallback if AI didn't produce results
      if (insights.length === 0) {
        // Top-performing product line
        const productCounts = {};
        leads.forEach(l => { if (l.product_line) productCounts[l.product_line] = (productCounts[l.product_line] || 0) + 1; });
        const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
        if (topProduct) {
          insights.push({
            type: 'opportunity',
            title: { en: 'Top Product Line', ar: 'خط المنتجات الأعلى' },
            body: { en: `Your leads in "${topProduct[0]}" perform best with ${topProduct[1]} submissions. Consider focusing more here.`, ar: `عملاؤك في "${topProduct[0]}" يحققون أفضل أداء مع ${topProduct[1]} إحالات. فكر في التركيز أكثر هنا.` },
            priority: 'high',
          });
        }

        // Pipeline health
        const stalePipeline = pipeline.filter(o => {
          if (o.stage === 'closed_won' || o.stage === 'closed_lost') return false;
          const daysSinceUpdate = (Date.now() - new Date(o.updated_at).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceUpdate > 14;
        });
        if (stalePipeline.length > 0) {
          insights.push({
            type: 'warning',
            title: { en: 'Stale Pipeline Deals', ar: 'صفقات متوقفة' },
            body: { en: `${stalePipeline.length} deal(s) haven't been updated in 14+ days. Follow up with your contacts to keep momentum.`, ar: `${stalePipeline.length} صفقة لم يتم تحديثها منذ أكثر من 14 يوماً. تابع مع جهات الاتصال للحفاظ على الزخم.` },
            priority: 'medium',
          });
        }

        // Commission opportunity
        const pendingComms = comms.filter(c => c.status === 'pending');
        if (pendingComms.length > 0) {
          const pendingTotal = pendingComms.reduce((s, c) => s + (+c.amount || 0), 0);
          insights.push({
            type: 'info',
            title: { en: 'Pending Commissions', ar: 'عمولات معلقة' },
            body: { en: `SAR ${pendingTotal.toLocaleString()} in commissions are pending approval. These typically process within 5 business days.`, ar: `${pendingTotal.toLocaleString()} ريال سعودي من العمولات في انتظار الموافقة. عادة تتم المعالجة خلال 5 أيام عمل.` },
            priority: 'low',
          });
        }

        // Conversion rate insight
        const wonCount = leads.filter(l => l.status === 'won').length;
        const convRate = leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0;
        if (leads.length >= 5) {
          insights.push({
            type: convRate >= 30 ? 'success' : 'tip',
            title: { en: 'Conversion Rate', ar: 'معدل التحويل' },
            body: { en: `Your conversion rate is ${convRate}%. ${convRate >= 30 ? 'Great performance!' : 'Focus on qualified leads to improve conversions.'}`, ar: `معدل التحويل الخاص بك هو ${convRate}%. ${convRate >= 30 ? 'أداء ممتاز!' : 'ركز على العملاء المؤهلين لتحسين التحويلات.'}` },
            priority: convRate >= 30 ? 'low' : 'medium',
          });
        }

        // Geographic spread
        const cityCounts = {};
        leads.forEach(l => { if (l.city) cityCounts[l.city] = (cityCounts[l.city] || 0) + 1; });
        const cities = Object.keys(cityCounts);
        if (cities.length >= 3) {
          insights.push({
            type: 'success',
            title: { en: 'Geographic Diversity', ar: 'التنوع الجغرافي' },
            body: { en: `Active leads from ${cities.length} cities — strong regional coverage!`, ar: `عملاء نشطون من ${cities.length} مدن — تغطية إقليمية قوية!` },
            priority: 'low',
          });
        }
      }

      res.json({ insights, ai_powered: useAI && insights.length > 0 });
    } catch (e) {
      console.error('Partner insights error:', e.message);
      res.status(500).json({ error: 'Failed to generate insights' });
    }
  });

  /* ── P3: Resource Library ───────────────────────────────── */
  router.get('/partners/resources', auth, async (req, res) => {
    try {
      const partnerTier = req.partner.tier;
      const tierRank = { registered: 0, silver: 1, gold: 2, platinum: 3 };
      const rank = tierRank[partnerTier] || 0;

      const tiers = Object.entries(tierRank).filter(([, r]) => r <= rank).map(([k]) => k);

      const result = await pool.query(
        `SELECT id, title, description, category, url, file_type, tier_required, sort_order, created_at
         FROM partner_resources
         WHERE is_active = TRUE AND tier_required = ANY($1)
         ORDER BY category, sort_order, created_at DESC`,
        [tiers]
      );

      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  });

  /* ── P3: Feedback ───────────────────────────────────────── */
  router.post('/partners/feedback', auth, async (req, res) => {
    try {
      const { rating, category, message } = req.body;
      if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

      await pool.query(
        'INSERT INTO partner_feedback (partner_id, rating, category, message) VALUES ($1, $2, $3, $4)',
        [req.partner.id, rating, category || 'general', message || null]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to submit feedback' });
    }
  });

  /* ── P4: Revenue Forecast ───────────────────────────────── */
  router.get('/partners/forecast', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;

      const [pipelineQ, historyQ] = await Promise.all([
        // Current pipeline weighted forecast
        pool.query(
          `SELECT o.stage, o.estimated_value, o.probability,
                  o.estimated_value * o.probability / 100.0 AS weighted_value
           FROM opportunities o
           JOIN partner_leads pl ON pl.lead_intake_id = o.lead_intake_id
           WHERE pl.partner_id = $1 AND o.stage NOT IN ('closed_won', 'closed_lost')
           ORDER BY o.estimated_value DESC`,
          [partnerId]
        ),
        // Historical monthly commission
        pool.query(
          `SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
                  SUM(amount) AS total
           FROM commissions WHERE partner_id = $1 AND status = 'paid'
           GROUP BY DATE_TRUNC('month', created_at) ORDER BY month DESC LIMIT 12`,
          [partnerId]
        ),
      ]);

      const pipelineDeals = pipelineQ.rows;
      const totalPipeline = pipelineDeals.reduce((s, d) => s + (+d.estimated_value || 0), 0);
      const weightedPipeline = pipelineDeals.reduce((s, d) => s + (+d.weighted_value || 0), 0);
      const commissionRate = +req.partner.commission_rate || 10;
      const projectedCommission = Math.round(weightedPipeline * commissionRate / 100);

      const history = historyQ.rows;
      const avgMonthly = history.length > 0
        ? Math.round(history.reduce((s, h) => s + (+h.total || 0), 0) / history.length)
        : 0;

      // Project next 3 months
      const forecast = [];
      const now = new Date();
      for (let i = 1; i <= 3; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        forecast.push({
          month: d.toISOString().slice(0, 7),
          projected_revenue: Math.round(avgMonthly + projectedCommission / 3),
          confidence: history.length >= 6 ? 'high' : history.length >= 3 ? 'medium' : 'low',
        });
      }

      res.json({
        pipeline: { total_value: totalPipeline, weighted_value: Math.round(weightedPipeline), deals: pipelineDeals.length },
        projected_commission: projectedCommission,
        commission_rate: commissionRate,
        history,
        avg_monthly: avgMonthly,
        forecast,
      });
    } catch (e) {
      console.error('Partner forecast error:', e.message);
      res.status(500).json({ error: 'Failed to generate forecast' });
    }
  });

  /* ── P4: Messaging ──────────────────────────────────────── */
  router.get('/partners/messages', auth, async (req, res) => {
    try {
      const rows = await pool.query(
        `SELECT id, sender, sender_name, body, read, created_at
         FROM partner_messages WHERE partner_id = $1
         ORDER BY created_at DESC LIMIT 100`,
        [req.partner.id]
      );
      const unreadQ = await pool.query(
        'SELECT COUNT(*) FROM partner_messages WHERE partner_id = $1 AND read = FALSE AND sender = $2',
        [req.partner.id, 'manager']
      );
      res.json({ data: rows.rows, unread_count: +unreadQ.rows[0].count });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  router.post('/partners/messages', auth, async (req, res) => {
    try {
      const { body } = req.body;
      if (!body?.trim()) return res.status(400).json({ error: 'Message body required' });

      await pool.query(
        'INSERT INTO partner_messages (partner_id, sender, sender_name, body) VALUES ($1, $2, $3, $4)',
        [req.partner.id, 'partner', req.partner.contact_name || req.partner.company_name, body.trim()]
      );

      // Alert admin about new partner message
      sendInternalAlert(pool, 'internal_new_lead', {
        ticket_number: `MSG-${req.partner.company_name}`,
        company_name: req.partner.company_name,
        contact_name: req.partner.contact_name || '',
        contact_email: req.partner.contact_email || '',
        product_line: 'Partner Message',
        score: '',
        assigned_to: 'Account Manager',
        admin_url: `${process.env.APP_URL || 'https://www.doganconsult.com'}/admin`,
      }).catch(() => {});

      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  /* ── Partner: add comment on own lead ──────────────────── */
  router.post('/partners/leads/:leadId/comments', auth, async (req, res) => {
    try {
      const { body } = req.body || {};
      if (!body?.trim()) return res.status(400).json({ error: 'Comment body required' });

      // Verify this lead belongs to the partner
      const check = await pool.query(
        'SELECT pl.id FROM partner_leads pl WHERE pl.lead_intake_id = $1 AND pl.partner_id = $2',
        [req.params.leadId, req.partner.id]
      );
      if (!check.rows.length) return res.status(404).json({ error: 'Lead not found' });

      await pool.query(
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by, visibility)
         VALUES ($1, 'note', $2, $3, 'partner')`,
        [req.params.leadId, body.trim(), req.partner.contact_name || req.partner.company_name]
      );

      // Alert admin about new partner comment
      sendInternalAlert(pool, 'internal_new_lead', {
        ticket_number: 'COMMENT',
        company_name: req.partner.company_name,
        contact_name: req.partner.contact_name || '',
        contact_email: req.partner.contact_email || '',
        product_line: 'Partner Comment on Lead',
        score: '',
        assigned_to: 'Review',
        admin_url: `${process.env.APP_URL || 'https://www.doganconsult.com'}/admin/leads/${req.params.leadId}`,
      }).catch(() => {});

      res.status(201).json({ ok: true });
    } catch (e) {
      console.error('Partner comment error:', e.message);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  });

  /* ── SSE: real-time partner event stream ────────────── */
  router.get('/partners/events', auth, (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const partnerId = req.partner.id;

    // Register this SSE connection
    if (!global._partnerSSEClients) global._partnerSSEClients = new Map();
    if (!global._partnerSSEClients.has(partnerId)) {
      global._partnerSSEClients.set(partnerId, new Set());
    }
    global._partnerSSEClients.get(partnerId).add(res);

    // Send initial connected event
    res.write(`event: connected\ndata: ${JSON.stringify({ partnerId })}\n\n`);

    // Heartbeat every 30s to keep connection alive
    const heartbeat = setInterval(() => {
      try { res.write(': heartbeat\n\n'); } catch (_) {}
    }, 30000);

    req.on('close', () => {
      clearInterval(heartbeat);
      global._partnerSSEClients.get(partnerId)?.delete(res);
      if (global._partnerSSEClients.get(partnerId)?.size === 0) {
        global._partnerSSEClients.delete(partnerId);
      }
    });
  });

  /* ── P4: Achievements / Milestones ──────────────────────── */
  router.get('/partners/achievements', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;

      // Check and auto-unlock achievements
      const [leadCount, wonCount, commTotal] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM partner_leads WHERE partner_id = $1', [partnerId]),
        pool.query(
          `SELECT COUNT(*) FROM partner_leads pl
           JOIN lead_intakes li ON li.id = pl.lead_intake_id
           JOIN opportunities o ON o.lead_intake_id = li.id
           WHERE pl.partner_id = $1 AND o.stage = 'closed_won'`,
          [partnerId]
        ),
        pool.query('SELECT COALESCE(SUM(amount), 0) AS total FROM commissions WHERE partner_id = $1 AND status = $2', [partnerId, 'paid']),
      ]);

      const lc = +leadCount.rows[0].count;
      const wc = +wonCount.rows[0].count;
      const ct = +commTotal.rows[0].total;

      // Achievement definitions
      const allAchievements = [
        { key: 'first_lead', title: 'First Lead', description: 'Submitted your first lead referral', icon: '🚀', condition: lc >= 1 },
        { key: '5_leads', title: '5 Leads Club', description: 'Submitted 5 lead referrals', icon: '📊', condition: lc >= 5 },
        { key: '10_leads', title: 'Lead Machine', description: 'Submitted 10 lead referrals', icon: '⚡', condition: lc >= 10 },
        { key: '25_leads', title: 'Power Referrer', description: 'Submitted 25 lead referrals', icon: '💪', condition: lc >= 25 },
        { key: 'first_win', title: 'First Win', description: 'Your first lead closed as won', icon: '🏆', condition: wc >= 1 },
        { key: '5_wins', title: 'Winning Streak', description: '5 leads closed as won', icon: '🔥', condition: wc >= 5 },
        { key: '10_wins', title: 'Deal Closer', description: '10 leads closed as won', icon: '🎯', condition: wc >= 10 },
        { key: 'first_payout', title: 'First Payout', description: 'Received your first commission payment', icon: '💰', condition: ct > 0 },
        { key: '10k_earned', title: '10K Earned', description: 'Earned SAR 10,000+ in commissions', icon: '💎', condition: ct >= 10000 },
        { key: '50k_earned', title: '50K Earned', description: 'Earned SAR 50,000+ in commissions', icon: '👑', condition: ct >= 50000 },
        { key: '100k_earned', title: 'Top Earner', description: 'Earned SAR 100,000+ in commissions', icon: '🏅', condition: ct >= 100000 },
      ];

      // Auto-unlock achievements that are met
      for (const a of allAchievements) {
        if (a.condition) {
          await pool.query(
            `INSERT INTO partner_achievements (partner_id, achievement_key, title, description, icon)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (partner_id, achievement_key) DO NOTHING`,
            [partnerId, a.key, a.title, a.description, a.icon]
          ).catch(() => {}); // Ignore if table doesn't exist yet
        }
      }

      // Fetch all partner achievements
      const result = await pool.query(
        'SELECT achievement_key, title, description, icon, unlocked_at FROM partner_achievements WHERE partner_id = $1 ORDER BY unlocked_at',
        [partnerId]
      );
      const unlockedKeys = new Set(result.rows.map(r => r.achievement_key));

      const achievements = allAchievements.map(a => ({
        key: a.key,
        title: a.title,
        description: a.description,
        icon: a.icon,
        unlocked: unlockedKeys.has(a.key),
        unlocked_at: result.rows.find(r => r.achievement_key === a.key)?.unlocked_at || null,
      }));

      res.json({
        achievements,
        unlocked_count: result.rows.length,
        total_count: allAchievements.length,
      });
    } catch (e) {
      console.error('Partner achievements error:', e.message);
      res.status(500).json({ error: 'Failed to fetch achievements' });
    }
  });

  /* ── Training Portal ──────────────────────────────────── */
  router.get('/partners/training', auth, async (req, res) => {
    try {
      const partnerId = req.partner.id;
      const partnerTier = req.partner.tier;
      const tierRank = { registered: 0, silver: 1, gold: 2, platinum: 3 };
      const rank = tierRank[partnerTier] || 0;
      const tiers = Object.entries(tierRank).filter(([, r]) => r <= rank).map(([k]) => k);

      const [courses, progress] = await Promise.all([
        pool.query(
          `SELECT id, title, description, category, duration_minutes, difficulty, thumbnail_url, content_url, sort_order
           FROM partner_training_courses
           WHERE is_active = TRUE AND tier_required = ANY($1)
           ORDER BY sort_order, id`,
          [tiers]
        ),
        pool.query(
          `SELECT course_id, status, progress_pct, completed_at
           FROM partner_training_progress WHERE partner_id = $1`,
          [partnerId]
        ),
      ]);

      res.json({ courses: courses.rows, progress: progress.rows });
    } catch (e) {
      console.error('Partner training error:', e.message);
      res.status(500).json({ error: 'Failed to fetch training data' });
    }
  });

  router.put('/partners/training/:courseId/progress', auth, async (req, res) => {
    try {
      const { status, progress_pct } = req.body;
      const courseId = req.params.courseId;
      const completedAt = status === 'completed' ? 'NOW()' : 'NULL';

      await pool.query(
        `INSERT INTO partner_training_progress (partner_id, course_id, status, progress_pct, completed_at, updated_at)
         VALUES ($1, $2, $3, $4, ${status === 'completed' ? 'NOW()' : 'NULL'}, NOW())
         ON CONFLICT (partner_id, course_id) DO UPDATE SET
           status = $3, progress_pct = $4,
           completed_at = ${status === 'completed' ? 'NOW()' : 'partner_training_progress.completed_at'},
           updated_at = NOW()`,
        [req.partner.id, courseId, status || 'in_progress', progress_pct || 0]
      );
      res.json({ ok: true });
    } catch (e) {
      console.error('Partner training progress error:', e.message);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  });

  return router;
}
