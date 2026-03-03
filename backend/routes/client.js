import { Router } from 'express';

/**
 * Client Workspace API — unified endpoints for customer + partner roles.
 * All endpoints require JWT auth (portalAuth). Access: customer, partner, admin.
 */
function clientOnly(req, res, next) {
  if (req.portalUser && ['customer', 'partner', 'admin'].includes(req.portalUser.role)) return next();
  return res.status(403).json({ error: 'Forbidden' });
}

function csvEscape(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function clientRouter(pool, portalAuth) {
  const router = Router();

  // ──────────────────────────────────────────────────────
  // DASHBOARD — KPI stats
  // ──────────────────────────────────────────────────────
  router.get('/client/dashboard', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;

      // Inquiries count
      const inqRes = await pool.query(
        'SELECT COUNT(*)::int AS total FROM lead_intakes WHERE user_id = $1', [userId]
      );

      // Opportunities count + value
      const oppRes = await pool.query(
        `SELECT COUNT(*)::int AS total,
                COALESCE(SUM(o.estimated_value), 0)::numeric AS total_value,
                COUNT(*) FILTER (WHERE o.stage NOT IN ('closed_won', 'closed_lost'))::int AS active
         FROM opportunities o
         JOIN lead_intakes li ON o.lead_intake_id = li.id
         WHERE li.user_id = $1`, [userId]
      );

      // Active projects
      const projRes = await pool.query(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE p.status = 'active')::int AS active
         FROM projects p WHERE p.user_id = $1`, [userId]
      );

      // Contracts
      const contRes = await pool.query(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE c.status = 'active')::int AS active,
                COUNT(*) FILTER (WHERE c.end_date <= CURRENT_DATE + interval '30 days' AND c.status = 'active')::int AS expiring_soon
         FROM contracts c WHERE c.user_id = $1`, [userId]
      );

      // Upcoming demos
      const demoRes = await pool.query(
        `SELECT COUNT(*)::int AS upcoming
         FROM demos d WHERE d.user_id = $1 AND d.status = 'scheduled' AND d.scheduled_date > NOW()`, [userId]
      );

      // Pending tenders
      const tendRes = await pool.query(
        `SELECT COUNT(*)::int AS active
         FROM tenders t WHERE t.user_id = $1 AND t.status NOT IN ('awarded', 'lost', 'cancelled')`, [userId]
      );

      // Unread messages
      const msgRes = await pool.query(
        `SELECT COUNT(*)::int AS unread FROM client_messages WHERE user_id = $1 AND sender = 'team' AND read = false`, [userId]
      );

      // Unread notifications
      const notifRes = await pool.query(
        `SELECT COUNT(*)::int AS unread FROM client_notifications WHERE user_id = $1 AND read = false`, [userId]
      );

      res.json({
        inquiries: inqRes.rows[0].total,
        opportunities: { total: oppRes.rows[0].total, active: oppRes.rows[0].active, total_value: oppRes.rows[0].total_value },
        projects: { total: projRes.rows[0].total, active: projRes.rows[0].active },
        contracts: { total: contRes.rows[0].total, active: contRes.rows[0].active, expiring_soon: contRes.rows[0].expiring_soon },
        demos_upcoming: demoRes.rows[0].upcoming,
        tenders_active: tendRes.rows[0].active,
        unread_messages: msgRes.rows[0].unread,
        unread_notifications: notifRes.rows[0].unread,
      });
    } catch (e) {
      console.error('Client dashboard error:', e.message);
      res.status(500).json({ error: 'Failed to load dashboard' });
    }
  });

  // ──────────────────────────────────────────────────────
  // NOTIFICATIONS
  // ──────────────────────────────────────────────────────
  router.get('/client/notifications', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const limit = Math.min(50, parseInt(req.query.limit) || 20);
      const offset = parseInt(req.query.offset) || 0;

      const result = await pool.query(
        `SELECT id, type, title, body, link, read, created_at
         FROM client_notifications WHERE user_id = $1
         ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      const countRes = await pool.query(
        'SELECT COUNT(*)::int AS total FROM client_notifications WHERE user_id = $1', [userId]
      );

      res.json({ data: result.rows, total: countRes.rows[0].total });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load notifications' });
    }
  });

  router.put('/client/notifications/:id/read', portalAuth, clientOnly, async (req, res) => {
    try {
      await pool.query(
        'UPDATE client_notifications SET read = true WHERE id = $1 AND user_id = $2',
        [req.params.id, req.portalUser.id]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to mark notification' });
    }
  });

  router.put('/client/notifications/read-all', portalAuth, clientOnly, async (req, res) => {
    try {
      await pool.query(
        'UPDATE client_notifications SET read = true WHERE user_id = $1 AND read = false',
        [req.portalUser.id]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to mark all read' });
    }
  });

  // ──────────────────────────────────────────────────────
  // PIPELINE — Client's opportunities
  // ──────────────────────────────────────────────────────
  router.get('/client/pipeline', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const result = await pool.query(
        `SELECT o.id, o.lead_intake_id, o.title,
                COALESCE(o.extended_stage, o.stage) AS display_stage,
                o.stage, o.extended_stage,
                o.estimated_value, o.currency, o.probability,
                o.owner, o.next_action_at,
                o.client_visible,
                li.company_name AS client_company, li.ticket_number, li.product_line,
                o.created_at, o.closed_at
         FROM opportunities o
         JOIN lead_intakes li ON o.lead_intake_id = li.id
         WHERE li.user_id = $1 AND o.client_visible = true
         ORDER BY o.created_at DESC`,
        [userId]
      );
      res.json({ data: result.rows });
    } catch (e) {
      console.error('Client pipeline error:', e.message);
      res.status(500).json({ error: 'Failed to load pipeline' });
    }
  });

  router.get('/client/pipeline/:id', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const oppRes = await pool.query(
        `SELECT o.*, li.company_name, li.ticket_number, li.product_line, li.contact_name
         FROM opportunities o
         JOIN lead_intakes li ON o.lead_intake_id = li.id
         WHERE o.id = $1 AND li.user_id = $2 AND o.client_visible = true`,
        [req.params.id, userId]
      );
      if (!oppRes.rows.length) return res.status(404).json({ error: 'Not found' });

      // Activities (partner-visible)
      let activities = [];
      try {
        const actRes = await pool.query(
          `SELECT id, type, body, created_by, created_at FROM lead_activities
           WHERE lead_intake_id = $1 AND (visibility IS NULL OR visibility != 'internal')
           ORDER BY created_at DESC LIMIT 50`,
          [oppRes.rows[0].lead_intake_id]
        );
        activities = actRes.rows;
      } catch (_) {}

      // Gates
      let gates = [];
      try {
        const gRes = await pool.query(
          `SELECT id, stage, item_key, label, checked, checked_at FROM gate_checklist_items
           WHERE opportunity_id = $1 ORDER BY stage, created_at`,
          [req.params.id]
        );
        gates = gRes.rows;
      } catch (_) {}

      res.json({ opportunity: oppRes.rows[0], activities, gates });
    } catch (e) {
      console.error('Client pipeline detail error:', e.message);
      res.status(500).json({ error: 'Failed to load opportunity' });
    }
  });

  // ──────────────────────────────────────────────────────
  // INQUIRIES
  // ──────────────────────────────────────────────────────
  router.get('/client/inquiries', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
      const offset = (page - 1) * limit;

      const countRes = await pool.query(
        'SELECT COUNT(*)::int AS total FROM lead_intakes WHERE user_id = $1', [userId]
      );
      const dataRes = await pool.query(
        `SELECT id, ticket_number, status, company_name, contact_name, product_line, vertical, score, budget_range, city, created_at
         FROM lead_intakes WHERE user_id = $1
         ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      res.json({ total: countRes.rows[0].total, page, limit, data: dataRes.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load inquiries' });
    }
  });

  router.get('/client/inquiries/:id', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const leadRes = await pool.query(
        'SELECT * FROM lead_intakes WHERE id = $1 AND user_id = $2', [req.params.id, userId]
      );
      if (!leadRes.rows.length) return res.status(404).json({ error: 'Not found' });

      let activities = [];
      try {
        const actRes = await pool.query(
          `SELECT id, type, body, created_by, created_at FROM lead_activities
           WHERE lead_intake_id = $1 ORDER BY created_at DESC LIMIT 50`,
          [req.params.id]
        );
        activities = actRes.rows;
      } catch (_) {}

      let files = [];
      try {
        const fileRes = await pool.query(
          `SELECT id, filename, original_name, mime_type, size_bytes, created_at FROM file_uploads
           WHERE entity_type = 'lead_intakes' AND entity_id = $1 ORDER BY created_at DESC`,
          [req.params.id]
        );
        files = fileRes.rows;
      } catch (_) {}

      res.json({ lead: leadRes.rows[0], activities, files });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load inquiry' });
    }
  });

  // ──────────────────────────────────────────────────────
  // TENDERS
  // ──────────────────────────────────────────────────────
  router.get('/client/tenders', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const result = await pool.query(
        `SELECT t.*, o.title AS opportunity_name, li.company_name
         FROM tenders t
         LEFT JOIN opportunities o ON t.opportunity_id = o.id
         LEFT JOIN lead_intakes li ON t.lead_intake_id = li.id
         WHERE t.user_id = $1
         ORDER BY t.created_at DESC`,
        [userId]
      );
      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load tenders' });
    }
  });

  router.get('/client/tenders/:id', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const result = await pool.query(
        `SELECT t.*, o.title AS opportunity_name
         FROM tenders t LEFT JOIN opportunities o ON t.opportunity_id = o.id
         WHERE t.id = $1 AND t.user_id = $2`,
        [req.params.id, userId]
      );
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });

      // Related solutions
      let solutions = [];
      try {
        const solRes = await pool.query(
          `SELECT id, title, version, architecture_type, status, estimated_cost, currency, created_at
           FROM solutions WHERE tender_id = $1 ORDER BY version DESC`,
          [req.params.id]
        );
        solutions = solRes.rows;
      } catch (_) {}

      res.json({ tender: result.rows[0], solutions });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load tender' });
    }
  });

  // ──────────────────────────────────────────────────────
  // DEMOS & POC
  // ──────────────────────────────────────────────────────
  router.get('/client/demos', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const result = await pool.query(
        `SELECT d.*, o.title AS opportunity_name, li.company_name
         FROM demos d
         LEFT JOIN opportunities o ON d.opportunity_id = o.id
         LEFT JOIN lead_intakes li ON d.lead_intake_id = li.id
         WHERE d.user_id = $1
         ORDER BY d.scheduled_date DESC NULLS LAST, d.created_at DESC`,
        [userId]
      );
      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load demos' });
    }
  });

  router.get('/client/demos/:id', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const result = await pool.query(
        `SELECT d.*, o.title AS opportunity_name
         FROM demos d LEFT JOIN opportunities o ON d.opportunity_id = o.id
         WHERE d.id = $1 AND d.user_id = $2`,
        [req.params.id, userId]
      );
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json({ demo: result.rows[0] });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load demo' });
    }
  });

  // ──────────────────────────────────────────────────────
  // PROJECTS (PMO)
  // ──────────────────────────────────────────────────────
  router.get('/client/projects', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const result = await pool.query(
        `SELECT p.*, o.title AS opportunity_name
         FROM projects p
         LEFT JOIN opportunities o ON p.opportunity_id = o.id
         WHERE p.user_id = $1
         ORDER BY p.created_at DESC`,
        [userId]
      );
      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load projects' });
    }
  });

  router.get('/client/projects/:id', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const projRes = await pool.query(
        `SELECT p.*, o.title AS opportunity_name
         FROM projects p LEFT JOIN opportunities o ON p.opportunity_id = o.id
         WHERE p.id = $1 AND p.user_id = $2`,
        [req.params.id, userId]
      );
      if (!projRes.rows.length) return res.status(404).json({ error: 'Not found' });

      const milestonesRes = await pool.query(
        'SELECT * FROM milestones WHERE project_id = $1 ORDER BY sort_order, due_date',
        [req.params.id]
      );
      const tasksRes = await pool.query(
        'SELECT * FROM tasks WHERE project_id = $1 ORDER BY sort_order, created_at',
        [req.params.id]
      );

      res.json({
        project: projRes.rows[0],
        milestones: milestonesRes.rows,
        tasks: tasksRes.rows,
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load project' });
    }
  });

  // ──────────────────────────────────────────────────────
  // CONTRACTS & RENEWALS
  // ──────────────────────────────────────────────────────
  router.get('/client/contracts', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const result = await pool.query(
        `SELECT c.*, o.title AS opportunity_name
         FROM contracts c LEFT JOIN opportunities o ON c.opportunity_id = o.id
         WHERE c.user_id = $1
         ORDER BY c.end_date ASC NULLS LAST`,
        [userId]
      );
      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load contracts' });
    }
  });

  router.get('/client/contracts/:id', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const contRes = await pool.query(
        'SELECT * FROM contracts WHERE id = $1 AND user_id = $2',
        [req.params.id, userId]
      );
      if (!contRes.rows.length) return res.status(404).json({ error: 'Not found' });

      const licRes = await pool.query(
        'SELECT * FROM licenses WHERE contract_id = $1 ORDER BY expiry_date ASC NULLS LAST',
        [req.params.id]
      );

      res.json({ contract: contRes.rows[0], licenses: licRes.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load contract' });
    }
  });

  // ──────────────────────────────────────────────────────
  // LICENSES
  // ──────────────────────────────────────────────────────
  router.get('/client/licenses', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const result = await pool.query(
        `SELECT l.*, c.title AS contract_title, c.contract_number
         FROM licenses l LEFT JOIN contracts c ON l.contract_id = c.id
         WHERE l.user_id = $1
         ORDER BY l.expiry_date ASC NULLS LAST`,
        [userId]
      );
      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load licenses' });
    }
  });

  // ──────────────────────────────────────────────────────
  // MESSAGES
  // ──────────────────────────────────────────────────────
  router.get('/client/messages', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const oppId = req.query.opportunity_id || null;
      const limit = Math.min(100, parseInt(req.query.limit) || 50);
      const offset = parseInt(req.query.offset) || 0;

      let where = 'user_id = $1';
      const params = [userId];
      let idx = 2;

      if (oppId) {
        where += ` AND opportunity_id = $${idx++}`;
        params.push(oppId);
      }

      const result = await pool.query(
        `SELECT id, opportunity_id, sender, sender_name, body, read, created_at
         FROM client_messages WHERE ${where}
         ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, limit, offset]
      );

      // Mark team messages as read
      await pool.query(
        `UPDATE client_messages SET read = true WHERE user_id = $1 AND sender = 'team' AND read = false`,
        [userId]
      );

      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load messages' });
    }
  });

  router.post('/client/messages', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const { body, opportunity_id } = req.body || {};
      if (!body || !body.trim()) return res.status(400).json({ error: 'Message body required' });

      // Get user name
      const userRes = await pool.query('SELECT full_name, email FROM users WHERE id = $1', [userId]);
      const senderName = userRes.rows[0]?.full_name || userRes.rows[0]?.email || 'Client';

      const result = await pool.query(
        `INSERT INTO client_messages (user_id, opportunity_id, sender, sender_name, body)
         VALUES ($1, $2, 'client', $3, $4)
         RETURNING id, user_id, opportunity_id, sender, sender_name, body, read, created_at`,
        [userId, opportunity_id || null, senderName, body.trim()]
      );

      // Create admin notification
      try {
        await pool.query(
          `INSERT INTO admin_notifications (user_id, type, title, body, link)
           SELECT id, 'message', $1, $2, $3 FROM users WHERE role = 'admin'`,
          [
            `New message from ${senderName}`,
            body.trim().substring(0, 200),
            '/admin?tab=messages',
          ]
        );
      } catch (_) {}

      res.status(201).json(result.rows[0]);
    } catch (e) {
      console.error('Client message error:', e.message);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // ──────────────────────────────────────────────────────
  // PROFILE — update portal user name/email (optional)
  // ──────────────────────────────────────────────────────
  router.patch('/client/profile', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const { full_name, email } = req.body || {};
      const updates = [];
      const params = [];
      let idx = 1;
      if (typeof full_name === 'string' && full_name.trim()) {
        updates.push(`full_name = $${idx++}`);
        params.push(full_name.trim());
      }
      if (typeof email === 'string' && email.trim()) {
        const normalized = email.trim().toLowerCase();
        const existing = await pool.query(
          'SELECT id FROM users WHERE LOWER(email) = $1 AND id != $2',
          [normalized, userId]
        );
        if (existing.rows.length) return res.status(400).json({ error: 'Email already in use' });
        updates.push(`email = $${idx++}`);
        params.push(normalized);
      }
      if (updates.length === 0) return res.status(400).json({ error: 'Provide full_name and/or email to update' });
      params.push(userId);
      await pool.query(
        `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx}`,
        params
      );
      res.json({ ok: true });
    } catch (e) {
      console.error('Client profile update error:', e.message);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // ──────────────────────────────────────────────────────
  // FILES — client's files across all entities
  // ──────────────────────────────────────────────────────
  router.get('/client/files', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      // Get files from lead_intakes owned by user
      const result = await pool.query(
        `SELECT f.id, f.entity_type, f.entity_id, f.filename, f.original_name, f.mime_type, f.size_bytes, f.created_at
         FROM file_uploads f
         JOIN lead_intakes li ON f.entity_type = 'lead_intakes' AND f.entity_id = li.id
         WHERE li.user_id = $1
         ORDER BY f.created_at DESC LIMIT 100`,
        [userId]
      );
      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load files' });
    }
  });

  // ──────────────────────────────────────────────────────
  // EXPORT — CSV
  // ──────────────────────────────────────────────────────
  router.get('/client/export/pipeline', portalAuth, clientOnly, async (req, res) => {
    try {
      const userId = req.portalUser.id;
      const result = await pool.query(
        `SELECT o.title, COALESCE(o.extended_stage, o.stage) AS stage,
                o.estimated_value, o.currency, o.probability, o.next_action_at,
                li.company_name, li.ticket_number, o.created_at
         FROM opportunities o
         JOIN lead_intakes li ON o.lead_intake_id = li.id
         WHERE li.user_id = $1 AND o.client_visible = true
         ORDER BY o.created_at DESC`,
        [userId]
      );

      const headers = ['Name', 'Stage', 'Value', 'Currency', 'Probability', 'Expected Close', 'Company', 'Ticket', 'Created'];
      const csvRows = [headers.join(',')];
      for (const row of result.rows) {
        csvRows.push([
          csvEscape(row.title), row.stage, row.estimated_value, row.currency, row.probability,
          row.next_action_at ? new Date(row.next_action_at).toISOString().slice(0, 10) : '',
          csvEscape(row.company_name), row.ticket_number,
          row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : '',
        ].join(','));
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=my-pipeline-${new Date().toISOString().slice(0, 10)}.csv`);
      res.send(csvRows.join('\n'));
    } catch (e) {
      res.status(500).json({ error: 'Failed to export' });
    }
  });

  return router;
}
