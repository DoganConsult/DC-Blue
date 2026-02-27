import { Router } from 'express';
import { portalAuth, adminOnly } from './leads.js';
import { chatWithAI, summarizeLead, draftProposal, draftEmail, analyzeCompliance } from '../services/ai.js';

export default function aiRouter(pool) {
  const router = Router();

  /* ── GET /ai/status — check if AI is configured ─────── */
  router.get('/ai/status', portalAuth, (req, res) => {
    res.json({
      configured: !!process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
    });
  });

  /* ── POST /ai/chat — general assistant ──────────────── */
  router.post('/ai/chat', portalAuth, async (req, res) => {
    try {
      const { messages, context } = req.body || {};
      if (!messages?.length) return res.status(400).json({ error: 'messages required' });

      let contextText = context || '';

      const reply = await chatWithAI(messages, contextText);
      res.json({ ok: true, reply });
    } catch (e) {
      console.error('AI chat error:', e.message);
      res.status(500).json({ error: e.message.includes('API_KEY') ? 'AI not configured' : 'AI error: ' + e.message });
    }
  });

  /* ── POST /ai/lead-summary/:id ───────────────────────── */
  router.post('/ai/lead-summary/:id', portalAuth, async (req, res) => {
    try {
      const leadId = req.params.id;
      const lead = await pool.query(
        `SELECT l.*, p.company_name AS partner_company
         FROM lead_intakes l
         LEFT JOIN partners p ON p.id = l.partner_id
         WHERE l.id = $1 LIMIT 1`,
        [leadId]
      );
      if (!lead.rows.length) return res.status(404).json({ error: 'Lead not found' });

      const summary = await summarizeLead(lead.rows[0]);
      res.json({ ok: true, summary });
    } catch (e) {
      console.error('AI lead summary error:', e.message);
      res.status(500).json({ error: e.message.includes('API_KEY') ? 'AI not configured' : 'AI error: ' + e.message });
    }
  });

  /* ── POST /ai/opportunity-summary/:id ───────────────── */
  router.post('/ai/opportunity-summary/:id', portalAuth, async (req, res) => {
    try {
      const opp = await pool.query(
        `SELECT o.*, p.company_name AS partner_company
         FROM opportunities o
         LEFT JOIN partners p ON p.id = o.partner_id
         WHERE o.id = $1 LIMIT 1`,
        [req.params.id]
      );
      if (!opp.rows.length) return res.status(404).json({ error: 'Opportunity not found' });

      const summary = await summarizeLead(opp.rows[0]);
      res.json({ ok: true, summary });
    } catch (e) {
      console.error('AI opp summary error:', e.message);
      res.status(500).json({ error: e.message.includes('API_KEY') ? 'AI not configured' : 'AI error: ' + e.message });
    }
  });

  /* ── POST /ai/draft-proposal ─────────────────────────── */
  router.post('/ai/draft-proposal', portalAuth, async (req, res) => {
    try {
      const params = req.body || {};
      if (!params.company_name && !params.service) {
        return res.status(400).json({ error: 'company_name or service required' });
      }
      const draft = await draftProposal(params);
      res.json({ ok: true, draft });
    } catch (e) {
      console.error('AI draft proposal error:', e.message);
      res.status(500).json({ error: e.message.includes('API_KEY') ? 'AI not configured' : 'AI error: ' + e.message });
    }
  });

  /* ── POST /ai/draft-proposal-from-lead/:id ───────────── */
  router.post('/ai/draft-proposal-from-lead/:id', portalAuth, async (req, res) => {
    try {
      const lead = await pool.query(
        `SELECT l.*, p.company_name AS partner_company
         FROM lead_intakes l
         LEFT JOIN partners p ON p.id = l.partner_id
         WHERE l.id = $1 LIMIT 1`,
        [req.params.id]
      );
      if (!lead.rows.length) return res.status(404).json({ error: 'Lead not found' });

      const r = lead.rows[0];
      const draft = await draftProposal({
        company_name: r.company_name,
        service: r.product_line || r.service_interest,
        budget_range: r.budget_range,
        timeline: r.timeline,
        country: r.country || 'Saudi Arabia',
        notes: r.message || r.notes,
        partner_name: r.partner_company,
      });
      res.json({ ok: true, draft });
    } catch (e) {
      console.error('AI draft proposal from lead error:', e.message);
      res.status(500).json({ error: e.message.includes('API_KEY') ? 'AI not configured' : 'AI error: ' + e.message });
    }
  });

  /* ── POST /ai/draft-email ────────────────────────────── */
  router.post('/ai/draft-email', portalAuth, async (req, res) => {
    try {
      const params = req.body || {};
      if (!params.purpose) return res.status(400).json({ error: 'purpose required' });
      const email = await draftEmail(params);
      res.json({ ok: true, email });
    } catch (e) {
      console.error('AI draft email error:', e.message);
      res.status(500).json({ error: e.message.includes('API_KEY') ? 'AI not configured' : 'AI error: ' + e.message });
    }
  });

  /* ── POST /ai/compliance-check ───────────────────────── */
  router.post('/ai/compliance-check', portalAuth, async (req, res) => {
    try {
      const params = req.body || {};
      const result = await analyzeCompliance(params);
      res.json({ ok: true, result });
    } catch (e) {
      console.error('AI compliance check error:', e.message);
      res.status(500).json({ error: e.message.includes('API_KEY') ? 'AI not configured' : 'AI error: ' + e.message });
    }
  });

  /* ── POST /ai/partner-chat — partner-facing assistant ── */
  router.post('/ai/partner-chat', async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ error: 'API key required' });

    try {
      const partner = await pool.query(
        `SELECT id, company_name, contact_name FROM partners WHERE api_key = $1 AND status = 'approved' LIMIT 1`,
        [apiKey]
      );
      if (!partner.rows.length) return res.status(403).json({ error: 'Invalid or unapproved partner key' });

      const p = partner.rows[0];
      const { messages } = req.body || {};
      if (!messages?.length) return res.status(400).json({ error: 'messages required' });

      const contextText = `The user is ${p.contact_name || 'a partner'} from ${p.company_name}, a registered partner of Dogan Consult.
They are using the Partner Portal. Help them with their leads, commissions, and ICT consulting queries.`;

      const reply = await chatWithAI(messages, contextText);
      res.json({ ok: true, reply });
    } catch (e) {
      console.error('AI partner chat error:', e.message);
      res.status(500).json({ error: e.message.includes('API_KEY') ? 'AI not configured' : 'AI error: ' + e.message });
    }
  });

  /* ── GET /ai/leads-overview — AI pipeline summary ─────── */
  router.get('/ai/leads-overview', portalAuth, adminOnly, async (req, res) => {
    try {
      const [leads, opps] = await Promise.all([
        pool.query(`SELECT status, COUNT(*) AS count FROM lead_intakes GROUP BY status ORDER BY count DESC LIMIT 10`),
        pool.query(`SELECT stage, COUNT(*) AS count, SUM(estimated_value) AS total_sar FROM opportunities GROUP BY stage ORDER BY count DESC`),
      ]);

      const context = `Current pipeline snapshot:
Leads by status: ${leads.rows.map(r => `${r.status}: ${r.count}`).join(', ')}
Opportunities by stage: ${opps.rows.map(r => `${r.stage}: ${r.count} deals, SAR ${Number(r.total_sar || 0).toLocaleString()}`).join(', ')}`;

      const summary = await chatWithAI([
        {
          role: 'user',
          content: 'Based on the pipeline data, give me a 3-paragraph executive briefing: current state, top priorities, and recommended focus for this week.',
        },
      ], context);

      res.json({ ok: true, summary, data: { leads: leads.rows, opportunities: opps.rows } });
    } catch (e) {
      console.error('AI leads overview error:', e.message);
      res.status(500).json({ error: e.message.includes('API_KEY') ? 'AI not configured' : 'AI error: ' + e.message });
    }
  });

  return router;
}
