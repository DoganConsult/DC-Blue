import { Router } from 'express';

function customerOnly(req, res, next) {
  if (req.portalUser && ['customer', 'admin'].includes(req.portalUser.role)) return next();
  return res.status(403).json({ error: 'Forbidden' });
}

function csvEscape(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function customerRouter(pool, portalAuth) {
  const router = Router();

  // GET /customer/stats — dashboard summary for logged-in customer
  router.get('/customer/stats', portalAuth, customerOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;

      const totalRes = await pool.query(
        'SELECT COUNT(*)::int AS total FROM lead_intakes WHERE user_id = $1',
        [userId]
      );

      const byStatusRes = await pool.query(
        'SELECT status, COUNT(*)::int AS count FROM lead_intakes WHERE user_id = $1 GROUP BY status ORDER BY count DESC',
        [userId]
      );

      const recentRes = await pool.query(
        'SELECT COUNT(*)::int AS count FROM lead_intakes WHERE user_id = $1 AND created_at > now() - interval \'30 days\'',
        [userId]
      );

      res.json({
        total: totalRes.rows[0].total,
        by_status: byStatusRes.rows,
        recent_count: recentRes.rows[0].count,
      });
    } catch (e) {
      console.error('Customer stats error:', e.message);
      res.status(500).json({ error: 'Failed to load stats' });
    }
  });

  // GET /customer/inquiries — paginated list of customer's own inquiries
  router.get('/customer/inquiries', portalAuth, customerOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
      const offset = (page - 1) * limit;
      const status = req.query.status || null;

      const conditions = ['user_id = $1'];
      const params = [userId];
      let idx = 2;

      if (status) {
        conditions.push(`status = $${idx++}`);
        params.push(status);
      }

      const where = conditions.join(' AND ');

      const countRes = await pool.query(
        `SELECT COUNT(*)::int AS total FROM lead_intakes WHERE ${where}`,
        params
      );

      const dataRes = await pool.query(
        `SELECT id, ticket_number, status, company_name, contact_name, product_line, vertical, score, budget_range, city, created_at, updated_at
         FROM lead_intakes WHERE ${where}
         ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, limit, offset]
      );

      res.json({
        total: countRes.rows[0].total,
        page,
        limit,
        data: dataRes.rows,
      });
    } catch (e) {
      console.error('Customer inquiries error:', e.message);
      res.status(500).json({ error: 'Failed to load inquiries' });
    }
  });

  // GET /customer/inquiries/:id — single inquiry detail (ownership check)
  router.get('/customer/inquiries/:id', portalAuth, customerOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;

      const leadRes = await pool.query(
        `SELECT * FROM lead_intakes WHERE id = $1 AND user_id = $2`,
        [req.params.id, userId]
      );

      if (leadRes.rows.length === 0) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      const lead = leadRes.rows[0];

      // Fetch activities (customer-visible)
      let activities = [];
      try {
        const actRes = await pool.query(
          `SELECT id, type, body, created_by, created_at FROM lead_activities
           WHERE lead_intake_id = $1 ORDER BY created_at DESC LIMIT 50`,
          [lead.id]
        );
        activities = actRes.rows;
      } catch (e) { /* lead_activities may not exist */ }

      // Fetch files
      let files = [];
      try {
        const fileRes = await pool.query(
          `SELECT id, filename, original_name, mime_type, size_bytes, created_at FROM file_uploads
           WHERE entity_type = 'lead_intakes' AND entity_id = $1 ORDER BY created_at DESC`,
          [lead.id]
        );
        files = fileRes.rows;
      } catch (e) { /* file_uploads may not exist */ }

      res.json({ lead, activities, files });
    } catch (e) {
      console.error('Customer inquiry detail error:', e.message);
      res.status(500).json({ error: 'Failed to load inquiry' });
    }
  });

  // GET /customer/export/inquiries — CSV export of customer's own inquiries
  router.get('/customer/export/inquiries', portalAuth, customerOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;

      const result = await pool.query(
        `SELECT ticket_number, contact_name, contact_email, company_name, product_line, vertical,
                status, score, budget_range, city, created_at
         FROM lead_intakes WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
      );

      const headers = ['Ticket', 'Contact Name', 'Email', 'Company', 'Product Line', 'Vertical', 'Status', 'Score', 'Budget', 'City', 'Created'];
      const csvRows = [headers.join(',')];
      for (const row of result.rows) {
        csvRows.push([
          row.ticket_number, csvEscape(row.contact_name), csvEscape(row.contact_email),
          csvEscape(row.company_name), csvEscape(row.product_line), csvEscape(row.vertical),
          row.status, row.score,
          csvEscape(row.budget_range), csvEscape(row.city),
          row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : '',
        ].join(','));
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=my-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
      res.send(csvRows.join('\n'));
    } catch (e) {
      console.error('Customer export error:', e.message);
      res.status(500).json({ error: 'Failed to export inquiries' });
    }
  });

  return router;
}
