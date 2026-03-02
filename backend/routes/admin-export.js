import { Router } from 'express';

export default function adminExportRouter(pool, portalAuth, adminOnly) {
  const router = Router();

  // Export leads as CSV
  router.get('/admin/export/leads', portalAuth, adminOnly, async (req, res) => {
    try {
      const { status, from_date, to_date } = req.query;
      const conditions = [];
      const params = [];
      let idx = 1;

      if (status) { conditions.push(`status = $${idx++}`); params.push(status); }
      if (from_date) { conditions.push(`created_at >= $${idx++}`); params.push(from_date); }
      if (to_date) { conditions.push(`created_at <= $${idx++}::date + interval '1 day'`); params.push(to_date); }

      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
      const result = await pool.query(
        `SELECT ticket_number, contact_name, contact_email, company_name, product_line, vertical,
                status, score, assigned_to, source, budget_range, city, created_at
         FROM lead_intakes ${where} ORDER BY created_at DESC`,
        params
      );

      const headers = ['Ticket', 'Contact Name', 'Email', 'Company', 'Product Line', 'Vertical', 'Status', 'Score', 'Assigned To', 'Source', 'Budget', 'City', 'Created'];
      const csvRows = [headers.join(',')];
      for (const row of result.rows) {
        csvRows.push([
          row.ticket_number, csvEscape(row.contact_name), csvEscape(row.contact_email),
          csvEscape(row.company_name), csvEscape(row.product_line), csvEscape(row.vertical),
          row.status, row.score, csvEscape(row.assigned_to), csvEscape(row.source),
          csvEscape(row.budget_range), csvEscape(row.city),
          row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : '',
        ].join(','));
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=leads-export-${new Date().toISOString().slice(0, 10)}.csv`);
      res.send(csvRows.join('\n'));
    } catch (e) {
      console.error('Export leads error:', e.message);
      res.status(500).json({ error: 'Failed to export leads' });
    }
  });

  // Bulk update lead status
  router.post('/admin/bulk/leads/status', portalAuth, adminOnly, async (req, res) => {
    try {
      const { ids, status } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });
      if (!status) return res.status(400).json({ error: 'status required' });

      const validStatuses = ['new', 'qualified', 'contacted', 'proposal', 'won', 'lost', 'duplicate', 'spam'];
      if (!validStatuses.includes(status)) return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });

      // Limit to 100 at a time
      const batchIds = ids.slice(0, 100);
      const placeholders = batchIds.map((_, i) => `$${i + 2}`).join(',');
      const result = await pool.query(
        `UPDATE lead_intakes SET status = $1, updated_at = now() WHERE id IN (${placeholders}) RETURNING id`,
        [status, ...batchIds]
      );

      res.json({ ok: true, updated: result.rowCount });
    } catch (e) {
      console.error('Bulk update error:', e.message);
      res.status(500).json({ error: 'Failed to bulk update' });
    }
  });

  return router;
}

function csvEscape(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
