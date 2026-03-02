/**
 * Admin API for site_settings, public_content, legal_pages.
 * GET/PUT under /api/v1/admin/* (portalAuth, adminOnly).
 */

import { Router } from 'express';

export default function adminContentRouter(pool, portalAuth, adminOnly) {
  const router = Router();

  /** GET /api/v1/admin/site-settings */
  router.get('/admin/site-settings', portalAuth, adminOnly, async (_req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, contact_email, contact_phone, whatsapp_number, address_en, address_ar, cr_number, linkedin_url, twitter_url, locale, updated_at, updated_by FROM site_settings WHERE id = 1 LIMIT 1'
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Site settings not found' });
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Site settings unavailable' });
    }
  });

  /** PUT /api/v1/admin/site-settings */
  router.put('/admin/site-settings', portalAuth, adminOnly, async (req, res) => {
    try {
      const b = req.body || {};
      const by = req.portalUser?.email || req.portalUser?.id || 'admin';
      await pool.query(
        `UPDATE site_settings SET
          contact_email = COALESCE($1, contact_email),
          contact_phone = COALESCE($2, contact_phone),
          whatsapp_number = COALESCE($3, whatsapp_number),
          address_en = COALESCE($4, address_en),
          address_ar = COALESCE($5, address_ar),
          cr_number = COALESCE($6, cr_number),
          linkedin_url = COALESCE($7, linkedin_url),
          twitter_url = COALESCE($8, twitter_url),
          locale = COALESCE($9, locale),
          updated_at = now(),
          updated_by = $10
        WHERE id = 1`,
        [
          b.contact_email,
          b.contact_phone,
          b.whatsapp_number,
          b.address_en,
          b.address_ar,
          b.cr_number,
          b.linkedin_url,
          b.twitter_url,
          b.locale,
          by,
        ]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update site settings' });
    }
  });

  /** GET /api/v1/admin/content/:page */
  router.get('/admin/content/:page', portalAuth, adminOnly, async (req, res) => {
    const page = (req.params.page || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!page) return res.status(400).json({ error: 'Invalid page' });
    try {
      const result = await pool.query('SELECT page, content, updated_at, updated_by FROM public_content WHERE page = $1 LIMIT 1', [page]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Content not found' });
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Content unavailable' });
    }
  });

  /** PUT /api/v1/admin/content/:page */
  router.put('/admin/content/:page', portalAuth, adminOnly, async (req, res) => {
    const page = (req.params.page || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!page) return res.status(400).json({ error: 'Invalid page' });
    try {
      const content = req.body?.content != null ? req.body.content : req.body;
      const by = req.portalUser?.email || req.portalUser?.id || 'admin';
      await pool.query(
        `INSERT INTO public_content (page, content, updated_at, updated_by)
         VALUES ($1, $2::jsonb, now(), $3)
         ON CONFLICT (page) DO UPDATE SET content = $2::jsonb, updated_at = now(), updated_by = $3`,
        [page, JSON.stringify(content), by]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update content' });
    }
  });

  /** GET /api/v1/admin/legal/:key */
  router.get('/admin/legal/:key', portalAuth, adminOnly, async (req, res) => {
    const key = (req.params.key || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!key) return res.status(400).json({ error: 'Invalid key' });
    try {
      const result = await pool.query(
        'SELECT key, title_en, title_ar, body_en, body_ar, updated_at, updated_by FROM legal_pages WHERE key = $1 LIMIT 1',
        [key]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Legal page not found' });
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Legal page unavailable' });
    }
  });

  /** PUT /api/v1/admin/legal/:key */
  router.put('/admin/legal/:key', portalAuth, adminOnly, async (req, res) => {
    const key = (req.params.key || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!key) return res.status(400).json({ error: 'Invalid key' });
    try {
      const b = req.body || {};
      const by = req.portalUser?.email || req.portalUser?.id || 'admin';
      await pool.query(
        `INSERT INTO legal_pages (key, title_en, title_ar, body_en, body_ar, updated_at, updated_by)
         VALUES ($1, $2, $3, $4, $5, now(), $6)
         ON CONFLICT (key) DO UPDATE SET
          title_en = COALESCE($2, legal_pages.title_en),
          title_ar = COALESCE($3, legal_pages.title_ar),
          body_en = COALESCE($4, legal_pages.body_en),
          body_ar = COALESCE($5, legal_pages.body_ar),
          updated_at = now(),
          updated_by = $6`,
        [key, b.title_en ?? null, b.title_ar ?? null, b.body_en ?? null, b.body_ar ?? null, by]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update legal page' });
    }
  });

  return router;
}
