import { Router } from 'express';

/**
 * Partner Training & Resources API.
 * Public routes for partners to read courses/resources.
 * Admin routes for managing content.
 */
export default function partnerTrainingRouter(pool, portalAuth, adminOnly) {
  const router = Router();

  // ── TRAINING COURSES ──────────────────────────────────

  /** GET /partner/training — List active training courses */
  router.get('/partner/training', portalAuth, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, title, description, category, difficulty, duration_minutes, thumbnail_url, content_url, sort_order
         FROM partner_training_courses WHERE is_active = true ORDER BY sort_order, title`
      );
      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load training courses' });
    }
  });

  /** POST /admin/training — Create training course (admin) */
  router.post('/admin/training', portalAuth, adminOnly, async (req, res) => {
    try {
      const { title, description, category, difficulty, duration_minutes, thumbnail_url, content_url, sort_order } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const result = await pool.query(
        `INSERT INTO partner_training_courses (title, description, category, difficulty, duration_minutes, thumbnail_url, content_url, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [title, description || null, category || 'platform', difficulty || 'beginner', duration_minutes || 30, thumbnail_url || null, content_url || null, sort_order || 0]
      );
      res.status(201).json({ ok: true, course: result.rows[0] });
    } catch (e) {
      res.status(500).json({ error: 'Failed to create course' });
    }
  });

  /** PATCH /admin/training/:id — Update training course (admin) */
  router.patch('/admin/training/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const fields = ['title', 'description', 'category', 'difficulty', 'duration_minutes', 'thumbnail_url', 'content_url', 'sort_order', 'is_active'];
      const updates = [];
      const params = [];
      let idx = 1;
      for (const f of fields) {
        if (req.body[f] !== undefined) {
          updates.push(`${f} = $${idx++}`);
          params.push(req.body[f]);
        }
      }
      if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
      updates.push(`updated_at = NOW()`);
      params.push(req.params.id);

      const result = await pool.query(
        `UPDATE partner_training_courses SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
        params
      );
      if (!result.rows.length) return res.status(404).json({ error: 'Course not found' });
      res.json({ ok: true, course: result.rows[0] });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update course' });
    }
  });

  /** DELETE /admin/training/:id — Soft-delete training course (admin) */
  router.delete('/admin/training/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      await pool.query('UPDATE partner_training_courses SET is_active = false WHERE id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete course' });
    }
  });

  // ── RESOURCES ─────────────────────────────────────────

  /** GET /partner/resources — List active resources */
  router.get('/partner/resources', portalAuth, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, title, description, category, file_type, file_url, file_size_bytes, sort_order
         FROM partner_resources WHERE is_active = true ORDER BY sort_order, title`
      );
      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load resources' });
    }
  });

  /** POST /admin/resources — Create resource (admin) */
  router.post('/admin/resources', portalAuth, adminOnly, async (req, res) => {
    try {
      const { title, description, category, file_type, file_url, file_size_bytes, sort_order } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const result = await pool.query(
        `INSERT INTO partner_resources (title, description, category, file_type, file_url, file_size_bytes, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, description || null, category || 'general', file_type || 'PDF', file_url || null, file_size_bytes || null, sort_order || 0]
      );
      res.status(201).json({ ok: true, resource: result.rows[0] });
    } catch (e) {
      res.status(500).json({ error: 'Failed to create resource' });
    }
  });

  /** PATCH /admin/resources/:id — Update resource (admin) */
  router.patch('/admin/resources/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const fields = ['title', 'description', 'category', 'file_type', 'file_url', 'file_size_bytes', 'sort_order', 'is_active'];
      const updates = [];
      const params = [];
      let idx = 1;
      for (const f of fields) {
        if (req.body[f] !== undefined) {
          updates.push(`${f} = $${idx++}`);
          params.push(req.body[f]);
        }
      }
      if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
      updates.push(`updated_at = NOW()`);
      params.push(req.params.id);

      const result = await pool.query(
        `UPDATE partner_resources SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
        params
      );
      if (!result.rows.length) return res.status(404).json({ error: 'Resource not found' });
      res.json({ ok: true, resource: result.rows[0] });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update resource' });
    }
  });

  /** DELETE /admin/resources/:id — Soft-delete resource (admin) */
  router.delete('/admin/resources/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      await pool.query('UPDATE partner_resources SET is_active = false WHERE id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete resource' });
    }
  });

  return router;
}
