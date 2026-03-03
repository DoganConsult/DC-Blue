import { Router } from 'express';
import { logAudit } from './admin-audit.js';

/**
 * Admin Settings API — CRUD for platform settings (language, timezone, notifications).
 * Settings stored in admin_settings table as key-value pairs.
 */
export default function adminSettingsRouter(pool, portalAuth, adminOnly) {
  const router = Router();

  /** GET /admin/settings — Load all platform settings */
  router.get('/admin/settings', portalAuth, adminOnly, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT setting_key, setting_value FROM admin_settings WHERE setting_key LIKE 'platform_%'`
      );
      const settings = {};
      for (const row of result.rows) {
        try {
          settings[row.setting_key] = JSON.parse(row.setting_value);
        } catch {
          settings[row.setting_key] = row.setting_value;
        }
      }
      res.json({ ok: true, settings });
    } catch (e) {
      console.error('Admin settings load error:', e.message);
      res.status(500).json({ error: 'Failed to load settings' });
    }
  });

  /** PUT /admin/settings — Save platform settings */
  router.put('/admin/settings', portalAuth, adminOnly, async (req, res) => {
    try {
      const { language, timezone, notify_new_leads, notify_pipeline, notify_partner_activity } = req.body || {};

      const pairs = [
        ['platform_language', language || 'en'],
        ['platform_timezone', timezone || 'AST'],
        ['platform_notify_new_leads', notify_new_leads !== false],
        ['platform_notify_pipeline', notify_pipeline !== false],
        ['platform_notify_partner_activity', notify_partner_activity || false],
      ];

      for (const [key, value] of pairs) {
        await pool.query(
          `INSERT INTO admin_settings (setting_key, setting_value, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_at = NOW()`,
          [key, JSON.stringify(value)]
        );
      }

      logAudit(pool, { userEmail: req.user?.email, action: 'settings_update', entityType: 'admin_settings', newValues: req.body, ipAddress: req.ip });

      res.json({ ok: true });
    } catch (e) {
      console.error('Admin settings save error:', e.message);
      res.status(500).json({ error: 'Failed to save settings' });
    }
  });

  return router;
}
