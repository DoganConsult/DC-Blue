import { Router } from 'express';
import { sendEmail } from '../services/email.js';
import { logAudit } from './admin-audit.js';

export default function commissionsRouter(pool, portalAuth, adminOnly) {
  const router = Router();

  router.get('/commissions', portalAuth, async (req, res) => {
    try {
      const { status, partner_id, page = 1, limit = 50 } = req.query;
      const offset = (Math.max(1, +page) - 1) * +limit;
      let where = [];
      let params = [];
      let idx = 1;
      if (status) { where.push(`c.status = $${idx++}`); params.push(status); }
      if (partner_id) { where.push(`c.partner_id = $${idx++}`); params.push(partner_id); }
      const clause = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const countQ = await pool.query(`SELECT count(*) FROM commissions c ${clause}`, params);
      params.push(+limit, offset);
      const rows = await pool.query(
        `SELECT c.*, p.company_name AS partner_company, p.contact_email AS partner_email,
                o.title AS opportunity_title, li.company_name AS client_company, li.ticket_number
         FROM commissions c
         JOIN partners p ON p.id = c.partner_id
         LEFT JOIN opportunities o ON o.id = c.opportunity_id
         LEFT JOIN lead_intakes li ON li.id = o.lead_intake_id
         ${clause}
         ORDER BY c.created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
        params
      );
      res.json({ total: +countQ.rows[0].count, page: +page, data: rows.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch commissions' });
    }
  });

  router.get('/commissions/:id', portalAuth, async (req, res) => {
    try {
      const r = await pool.query(
        `SELECT c.*, p.company_name AS partner_company_name, p.contact_name AS partner_name, p.contact_email AS partner_email,
                o.title AS opportunity_title
         FROM commissions c
         JOIN partners p ON p.id = c.partner_id
         LEFT JOIN opportunities o ON o.id = c.opportunity_id
         WHERE c.id = $1`,
        [req.params.id]
      );
      if (!r.rows.length) return res.status(404).json({ error: 'Commission not found' });
      res.json({ commission: r.rows[0] });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch commission' });
    }
  });

  router.patch('/commissions/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const { status } = req.body;
      if (!['pending', 'approved', 'paid'].includes(status)) {
        return res.status(400).json({ error: 'Status must be pending, approved, or paid' });
      }
      const sets = ['status = $1', 'updated_at = now()'];
      const params = [status];
      if (status === 'paid') {
        sets.push('paid_at = now()');
      }
      params.push(req.params.id);
      const r = await pool.query(
        `UPDATE commissions SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
        params
      );
      if (!r.rows.length) return res.status(404).json({ error: 'Commission not found' });

      if (status === 'approved' || status === 'paid') {
        try {
          const comm = r.rows[0];
          const partner = await pool.query('SELECT contact_email, company_name FROM partners WHERE id = $1', [comm.partner_id]);
          if (partner.rows.length) {
            const opp = await pool.query(
              `SELECT li.company_name FROM opportunities o JOIN lead_intakes li ON li.id = o.lead_intake_id WHERE o.id = $1`,
              [comm.opportunity_id]
            );
            await sendEmail(pool, 'commission_created', {
              company_name: opp.rows[0]?.company_name || 'Client',
              amount: comm.amount,
              currency: comm.currency,
            }, partner.rows[0].contact_email, 'en');
          }
        } catch (_) {}
      }

      logAudit(pool, { userEmail: req.user?.email, action: 'commission_status_change', entityType: 'commission', entityId: req.params.id, newValues: { status }, ipAddress: req.ip });

      res.json({ ok: true, commission: r.rows[0] });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update commission' });
    }
  });

  /** POST /commissions/:id/request-payout — Partner requests payout for an approved commission */
  router.post('/commissions/:id/request-payout', portalAuth, async (req, res) => {
    try {
      const commRes = await pool.query(
        'SELECT * FROM commissions WHERE id = $1', [req.params.id]
      );
      if (!commRes.rows.length) return res.status(404).json({ error: 'Commission not found' });

      const comm = commRes.rows[0];
      if (comm.status !== 'approved') {
        return res.status(400).json({ error: 'Only approved commissions can request payout' });
      }

      // Mark as payout_requested
      await pool.query(
        `UPDATE commissions SET payout_requested = true, payout_requested_at = NOW(), updated_at = NOW() WHERE id = $1`,
        [req.params.id]
      );

      // Notify admin
      try {
        const partner = await pool.query('SELECT company_name FROM partners WHERE id = $1', [comm.partner_id]);
        await pool.query(
          `INSERT INTO admin_notifications (user_id, type, title, body, link)
           SELECT id, 'commission', $1, $2, '/admin?tab=commissions'
           FROM users WHERE role = 'admin'`,
          [
            `Payout requested: ${comm.amount} ${comm.currency}`,
            `${partner.rows[0]?.company_name || 'Partner'} requested payout for commission #${req.params.id}`,
          ]
        );
      } catch (_) {}

      res.json({ ok: true, message: 'Payout request submitted' });
    } catch (e) {
      console.error('Payout request error:', e.message);
      res.status(500).json({ error: 'Failed to request payout' });
    }
  });

  router.get('/commissions/summary', portalAuth, async (req, res) => {
    try {
      const [total, pending, approved, paid] = await Promise.all([
        pool.query('SELECT COALESCE(SUM(amount), 0) AS total FROM commissions'),
        pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM commissions WHERE status = 'pending'"),
        pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM commissions WHERE status = 'approved'"),
        pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM commissions WHERE status = 'paid'"),
      ]);
      res.json({
        total: +total.rows[0].total,
        pending: +pending.rows[0].total,
        approved: +approved.rows[0].total,
        paid: +paid.rows[0].total,
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch commission summary' });
    }
  });

  return router;
}
