import { Router } from 'express';
import { ERPNextClient, ENTITY_MAP, pushToERP, pullFromERP, getSyncStatus } from '../services/erp-sync.js';

/**
 * ERP Bridge API — admin-only endpoints for ERPNext integration.
 * Provides proxy access, sync operations, and configuration.
 */
export default function erpBridgeRouter(pool, portalAuth, adminOnly) {
  const router = Router();

  /** Get or create ERP client from config */
  async function getERPClient() {
    // Try to load config from DB (admin_settings or env)
    let config = {};
    try {
      const res = await pool.query(
        `SELECT setting_value FROM admin_settings WHERE setting_key = 'erp_config' LIMIT 1`
      );
      if (res.rows.length) config = JSON.parse(res.rows[0].setting_value);
    } catch (_) {}

    return new ERPNextClient({
      url: config.url || process.env.ERP_URL || 'http://localhost:8080',
      apiKey: config.api_key || process.env.ERP_API_KEY || '',
      apiSecret: config.api_secret || process.env.ERP_API_SECRET || '',
      user: config.user || process.env.ERP_USER || 'Administrator',
      pass: config.pass || process.env.ERP_PASS || 'admin123',
    });
  }

  // ──────────────────────────────────────────────────────
  // HEALTH & STATUS
  // ──────────────────────────────────────────────────────

  /** GET /erp/status — Check ERPNext connection */
  router.get('/erp/status', portalAuth, adminOnly, async (req, res) => {
    try {
      const client = await getERPClient();
      const health = await client.healthCheck();
      const syncStatus = await getSyncStatus(pool);
      res.json({ connected: health.ok, erp_url: client.baseUrl, health, sync: syncStatus });
    } catch (e) {
      res.json({ connected: false, error: e.message });
    }
  });

  // ──────────────────────────────────────────────────────
  // CONFIGURATION
  // ──────────────────────────────────────────────────────

  /** GET /erp/config — Get current ERP config (redacted) */
  router.get('/erp/config', portalAuth, adminOnly, async (req, res) => {
    try {
      let config = {};
      try {
        const r = await pool.query(
          `SELECT setting_value FROM admin_settings WHERE setting_key = 'erp_config' LIMIT 1`
        );
        if (r.rows.length) config = JSON.parse(r.rows[0].setting_value);
      } catch (_) {}

      res.json({
        url: config.url || process.env.ERP_URL || 'http://localhost:8080',
        user: config.user || process.env.ERP_USER || 'Administrator',
        has_api_key: !!(config.api_key || process.env.ERP_API_KEY),
        has_api_secret: !!(config.api_secret || process.env.ERP_API_SECRET),
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  /** PUT /erp/config — Update ERP config */
  router.put('/erp/config', portalAuth, adminOnly, async (req, res) => {
    try {
      const { url, user, pass, api_key, api_secret } = req.body || {};
      const config = { url, user, pass, api_key, api_secret };

      // Ensure admin_settings table exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admin_settings (
          setting_key VARCHAR(100) PRIMARY KEY,
          setting_value TEXT,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);

      await pool.query(
        `INSERT INTO admin_settings (setting_key, setting_value, updated_at)
         VALUES ('erp_config', $1, NOW())
         ON CONFLICT (setting_key) DO UPDATE SET setting_value = $1, updated_at = NOW()`,
        [JSON.stringify(config)]
      );

      // Test connection
      const client = new ERPNextClient(config);
      const health = await client.healthCheck();

      res.json({ ok: true, connected: health.ok });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // ──────────────────────────────────────────────────────
  // PROXY — Access ERPNext resources from admin dashboard
  // ──────────────────────────────────────────────────────

  /** GET /erp/resource/:doctype — List ERPNext resources */
  router.get('/erp/resource/:doctype', portalAuth, adminOnly, async (req, res) => {
    try {
      const client = await getERPClient();
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
      const fields = req.query.fields ? JSON.parse(req.query.fields) : [];
      const orderBy = req.query.order_by || '';

      const result = await client.listResource(req.params.doctype, filters, fields, limit, offset, orderBy);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  /** GET /erp/resource/:doctype/:name — Get single ERPNext resource */
  router.get('/erp/resource/:doctype/:name', portalAuth, adminOnly, async (req, res) => {
    try {
      const client = await getERPClient();
      const result = await client.getResource(req.params.doctype, req.params.name);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  /** POST /erp/resource/:doctype — Create ERPNext resource */
  router.post('/erp/resource/:doctype', portalAuth, adminOnly, async (req, res) => {
    try {
      const client = await getERPClient();
      const result = await client.createResource(req.params.doctype, req.body);
      res.status(201).json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  /** PUT /erp/resource/:doctype/:name — Update ERPNext resource */
  router.put('/erp/resource/:doctype/:name', portalAuth, adminOnly, async (req, res) => {
    try {
      const client = await getERPClient();
      const result = await client.updateResource(req.params.doctype, req.params.name, req.body);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // ──────────────────────────────────────────────────────
  // SYNC — Push/Pull entities between our DB and ERPNext
  // ──────────────────────────────────────────────────────

  /** GET /erp/sync/status — Overall sync status */
  router.get('/erp/sync/status', portalAuth, adminOnly, async (req, res) => {
    try {
      const status = await getSyncStatus(pool);
      res.json(status);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  /** POST /erp/sync/push — Push an entity to ERPNext */
  router.post('/erp/sync/push', portalAuth, adminOnly, async (req, res) => {
    try {
      const { entity_type, entity_id } = req.body;
      if (!entity_type || !entity_id) return res.status(400).json({ error: 'entity_type and entity_id required' });
      if (!ENTITY_MAP[entity_type]) return res.status(400).json({ error: `Unknown entity type: ${entity_type}. Supported: ${Object.keys(ENTITY_MAP).join(', ')}` });

      const client = await getERPClient();
      const result = await pushToERP(client, pool, entity_type, entity_id);
      res.json({ ok: true, erp_name: result.data?.name || result.name, result });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  /** POST /erp/sync/pull — Pull an entity from ERPNext */
  router.post('/erp/sync/pull', portalAuth, adminOnly, async (req, res) => {
    try {
      const { entity_type, erp_name } = req.body;
      if (!entity_type || !erp_name) return res.status(400).json({ error: 'entity_type and erp_name required' });

      const client = await getERPClient();
      const updates = await pullFromERP(client, pool, entity_type, erp_name);
      res.json({ ok: true, updates });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  /** POST /erp/sync/bulk-push — Push all unsynced entities of a type */
  router.post('/erp/sync/bulk-push', portalAuth, adminOnly, async (req, res) => {
    try {
      const { entity_type } = req.body;
      if (!entity_type || !ENTITY_MAP[entity_type]) {
        return res.status(400).json({ error: `Supported types: ${Object.keys(ENTITY_MAP).join(', ')}` });
      }

      const client = await getERPClient();
      const unsyncedRes = await pool.query(
        `SELECT id FROM ${entity_type} WHERE erp_sync_id IS NULL LIMIT 50`
      ).catch(() => ({ rows: [] }));

      const results = { pushed: 0, failed: 0, errors: [] };
      for (const row of unsyncedRes.rows) {
        try {
          await pushToERP(client, pool, entity_type, row.id);
          results.pushed++;
        } catch (e) {
          results.failed++;
          results.errors.push({ id: row.id, error: e.message });
        }
      }
      res.json(results);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // ──────────────────────────────────────────────────────
  // ENTITY MAPPING — View the configured field mappings
  // ──────────────────────────────────────────────────────

  router.get('/erp/mappings', portalAuth, adminOnly, (req, res) => {
    const mappings = {};
    for (const [key, val] of Object.entries(ENTITY_MAP)) {
      mappings[key] = {
        erpDoctype: val.erpDoctype,
        fields: val.fieldMap,
        statusMap: val.statusMap || null,
      };
    }
    res.json(mappings);
  });

  // ──────────────────────────────────────────────────────
  // DOCTYPES — List available ERPNext doctypes
  // ──────────────────────────────────────────────────────

  router.get('/erp/doctypes', portalAuth, adminOnly, async (req, res) => {
    try {
      const client = await getERPClient();
      const module = req.query.module || '';
      const filters = module ? { module } : {};
      const result = await client.listResource('DocType', filters, ['name', 'module'], 0);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
