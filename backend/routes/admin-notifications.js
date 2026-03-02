import { Router } from 'express';

export default function adminNotificationsRouter(pool, portalAuth) {
  const router = Router();

  // Get notifications for the authenticated user
  router.get('/admin/notifications', portalAuth, async (req, res) => {
    try {
      const userId = req.portalUser?.id;
      const { unread_only, limit = 50, offset = 0 } = req.query;
      let where = userId ? `WHERE user_id = $1 OR user_id IS NULL` : `WHERE user_id IS NULL`;
      const params = userId ? [userId] : [];
      if (unread_only === 'true') {
        where += ` AND read = false`;
      }
      const idx = params.length + 1;
      params.push(+limit, +offset);
      const rows = await pool.query(
        `SELECT * FROM admin_notifications ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
        params
      );
      const countQ = await pool.query(
        `SELECT count(*) FILTER (WHERE read = false) AS unread_count FROM admin_notifications ${userId ? 'WHERE user_id = $1 OR user_id IS NULL' : 'WHERE user_id IS NULL'}`,
        userId ? [userId] : []
      );
      res.json({ data: rows.rows, unread_count: +countQ.rows[0].unread_count });
    } catch (e) {
      console.error('Get admin notifications error:', e.message);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  // Mark single notification as read
  router.put('/admin/notifications/:id/read', portalAuth, async (req, res) => {
    try {
      await pool.query('UPDATE admin_notifications SET read = true WHERE id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  // Mark all as read
  router.put('/admin/notifications/read-all', portalAuth, async (req, res) => {
    try {
      const userId = req.portalUser?.id;
      if (userId) {
        await pool.query('UPDATE admin_notifications SET read = true WHERE (user_id = $1 OR user_id IS NULL) AND read = false', [userId]);
      } else {
        await pool.query('UPDATE admin_notifications SET read = true WHERE read = false');
      }
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to mark all as read' });
    }
  });

  // Create notification (internal use / admin-triggered)
  router.post('/admin/notifications', portalAuth, async (req, res) => {
    try {
      const { user_id, type, title, body, link } = req.body;
      if (!title) return res.status(400).json({ error: 'title required' });
      const result = await pool.query(
        `INSERT INTO admin_notifications (user_id, type, title, body, link) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [user_id || null, type || 'info', title, body || null, link || null]
      );
      res.status(201).json({ ok: true, notification: result.rows[0] });
    } catch (e) {
      res.status(500).json({ error: 'Failed to create notification' });
    }
  });

  return router;
}
