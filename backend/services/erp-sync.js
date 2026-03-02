/**
 * ERPNext Integration Service
 * Handles authentication, CRUD operations, and entity sync with ERPNext.
 * Supports ERPNext v15 REST API (api/resource, api/method).
 */

const DEFAULT_ERP_URL = process.env.ERP_URL || 'http://localhost:8080';
const DEFAULT_ERP_KEY = process.env.ERP_API_KEY || '';
const DEFAULT_ERP_SECRET = process.env.ERP_API_SECRET || '';

// Cookie-based auth fallback
const DEFAULT_ERP_USER = process.env.ERP_USER || 'Administrator';
const DEFAULT_ERP_PASS = process.env.ERP_PASS || 'admin123';

class ERPNextClient {
  constructor(opts = {}) {
    this.baseUrl = opts.url || DEFAULT_ERP_URL;
    this.apiKey = opts.apiKey || DEFAULT_ERP_KEY;
    this.apiSecret = opts.apiSecret || DEFAULT_ERP_SECRET;
    this.user = opts.user || DEFAULT_ERP_USER;
    this.pass = opts.pass || DEFAULT_ERP_PASS;
    this.cookies = '';
    this.authenticated = false;
  }

  /** Build auth headers — token-based or cookie-based */
  async getHeaders() {
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

    if (this.apiKey && this.apiSecret) {
      headers['Authorization'] = `token ${this.apiKey}:${this.apiSecret}`;
    } else {
      if (!this.authenticated) await this.login();
      if (this.cookies) headers['Cookie'] = this.cookies;
    }
    return headers;
  }

  /** Cookie-based login */
  async login() {
    try {
      const res = await fetch(`${this.baseUrl}/api/method/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usr: this.user, pwd: this.pass }),
      });
      if (!res.ok) throw new Error(`Login failed: ${res.status}`);
      // Extract cookies
      const setCookies = res.headers.getSetCookie?.() || [];
      this.cookies = setCookies.map(c => c.split(';')[0]).join('; ');
      this.authenticated = true;
      return true;
    } catch (e) {
      console.error('[erp-sync] Login error:', e.message);
      this.authenticated = false;
      return false;
    }
  }

  /** Generic API call */
  async request(method, path, body = null) {
    const headers = await this.getHeaders();
    const opts = { method, headers };
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(`${this.baseUrl}${path}`, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(`ERP API ${method} ${path} → ${res.status}: ${JSON.stringify(data).substring(0, 200)}`);
    }
    return data;
  }

  // ─── Resource CRUD ───────────────────────────────

  async getResource(doctype, name) {
    return this.request('GET', `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
  }

  async listResource(doctype, filters = {}, fields = [], limit = 20, offset = 0, orderBy = '') {
    const params = new URLSearchParams();
    if (Object.keys(filters).length) params.set('filters', JSON.stringify(filters));
    if (fields.length) params.set('fields', JSON.stringify(fields));
    params.set('limit_page_length', String(limit));
    params.set('limit_start', String(offset));
    if (orderBy) params.set('order_by', orderBy);
    return this.request('GET', `/api/resource/${encodeURIComponent(doctype)}?${params}`);
  }

  async createResource(doctype, data) {
    return this.request('POST', `/api/resource/${encodeURIComponent(doctype)}`, data);
  }

  async updateResource(doctype, name, data) {
    return this.request('PUT', `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, data);
  }

  async deleteResource(doctype, name) {
    return this.request('DELETE', `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
  }

  // ─── Method calls ────────────────────────────────

  async callMethod(method, args = {}) {
    return this.request('POST', `/api/method/${method}`, args);
  }

  // ─── Convenience: DocType list ───────────────────

  async getDocTypes() {
    return this.listResource('DocType', { istable: 0, issingle: 0 }, ['name', 'module'], 0);
  }

  // ─── Health check ────────────────────────────────

  async healthCheck() {
    try {
      const res = await fetch(`${this.baseUrl}/api/method/frappe.client.get_count`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ doctype: 'User' }),
      });
      return { ok: res.ok, status: res.status };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
}

// ─── Entity Mapping: Our DB ↔ ERPNext ─────────────

const ENTITY_MAP = {
  lead_intakes: {
    erpDoctype: 'Lead',
    fieldMap: {
      contact_name: 'lead_name',
      contact_email: 'email_id',
      company_name: 'company_name',
      phone: 'phone',
      city: 'city',
      budget_range: 'annual_revenue',
      status: 'status',
    },
    statusMap: {
      new: 'Lead', open: 'Open', contacted: 'Replied',
      qualified: 'Interested', converted: 'Converted',
      closed: 'Do Not Contact',
    },
  },
  opportunities: {
    erpDoctype: 'Opportunity',
    fieldMap: {
      title: 'opportunity_from',
      stage: 'sales_stage',
      estimated_value: 'opportunity_amount',
      currency: 'currency',
      probability: 'probability',
      owner: 'opportunity_owner',
    },
    statusMap: {
      discovery: 'Open', qualified: 'Quotation',
      proposal: 'Quotation', negotiation: 'Negotiation',
      closed_won: 'Converted', closed_lost: 'Lost',
    },
  },
  projects: {
    erpDoctype: 'Project',
    fieldMap: {
      title: 'project_name',
      project_code: 'name',
      status: 'status',
      start_date: 'expected_start_date',
      end_date: 'expected_end_date',
      progress_pct: 'percent_complete',
      notes: 'notes',
    },
    statusMap: {
      planning: 'Open', active: 'Open',
      on_hold: 'Open', completed: 'Completed',
      cancelled: 'Cancelled',
    },
  },
  contracts: {
    erpDoctype: 'Contract',
    fieldMap: {
      title: 'contract_terms',
      contract_number: 'name',
      start_date: 'start_date',
      end_date: 'end_date',
      value: 'contract_value',
    },
  },
  tenders: {
    erpDoctype: 'Request for Quotation',
    fieldMap: {
      title: 'transaction_date',
      rfp_number: 'name',
      submission_deadline: 'schedule_date',
    },
  },
};

// ─── Sync Functions ────────────────────────────────

/**
 * Push an entity from our DB to ERPNext
 */
async function pushToERP(client, pool, entityType, entityId) {
  const mapping = ENTITY_MAP[entityType];
  if (!mapping) throw new Error(`No ERP mapping for: ${entityType}`);

  // Get local record
  const res = await pool.query(`SELECT * FROM ${entityType} WHERE id = $1`, [entityId]);
  if (!res.rows.length) throw new Error(`${entityType} ${entityId} not found`);
  const local = res.rows[0];

  // Check if already synced
  const syncRes = await pool.query(
    `SELECT erp_sync_id FROM ${entityType} WHERE id = $1`, [entityId]
  ).catch(() => ({ rows: [{}] }));
  const existingSyncId = syncRes.rows[0]?.erp_sync_id;

  // Map fields
  const erpData = {};
  for (const [ourField, erpField] of Object.entries(mapping.fieldMap)) {
    if (local[ourField] !== undefined && local[ourField] !== null) {
      // Apply status mapping if applicable
      if (ourField === 'status' && mapping.statusMap) {
        erpData[erpField] = mapping.statusMap[local[ourField]] || local[ourField];
      } else {
        erpData[erpField] = local[ourField];
      }
    }
  }

  let result;
  if (existingSyncId) {
    // Update existing
    result = await client.updateResource(mapping.erpDoctype, existingSyncId, erpData);
  } else {
    // Create new
    result = await client.createResource(mapping.erpDoctype, erpData);
    // Store sync ID
    await pool.query(
      `UPDATE ${entityType} SET erp_sync_id = $1, erp_sync_at = NOW() WHERE id = $2`,
      [result.data?.name || result.name, entityId]
    ).catch(() => {});
  }

  return result;
}

/**
 * Pull an entity from ERPNext into our DB
 */
async function pullFromERP(client, pool, entityType, erpName) {
  const mapping = ENTITY_MAP[entityType];
  if (!mapping) throw new Error(`No ERP mapping for: ${entityType}`);

  const erpDoc = await client.getResource(mapping.erpDoctype, erpName);
  const data = erpDoc.data || erpDoc;

  // Reverse map
  const updates = {};
  for (const [ourField, erpField] of Object.entries(mapping.fieldMap)) {
    if (data[erpField] !== undefined) {
      // Reverse status mapping
      if (ourField === 'status' && mapping.statusMap) {
        const reverseMap = Object.fromEntries(
          Object.entries(mapping.statusMap).map(([k, v]) => [v, k])
        );
        updates[ourField] = reverseMap[data[erpField]] || data[erpField];
      } else {
        updates[ourField] = data[erpField];
      }
    }
  }

  return updates;
}

/**
 * Sync status: check what's in sync and what's stale
 */
async function getSyncStatus(pool) {
  const tables = Object.keys(ENTITY_MAP);
  const status = {};

  for (const table of tables) {
    try {
      const totalRes = await pool.query(`SELECT COUNT(*)::int AS total FROM ${table}`);
      const syncedRes = await pool.query(
        `SELECT COUNT(*)::int AS synced FROM ${table} WHERE erp_sync_id IS NOT NULL`
      ).catch(() => ({ rows: [{ synced: 0 }] }));
      const staleRes = await pool.query(
        `SELECT COUNT(*)::int AS stale FROM ${table} WHERE erp_sync_id IS NOT NULL AND erp_sync_at < updated_at`
      ).catch(() => ({ rows: [{ stale: 0 }] }));

      status[table] = {
        total: totalRes.rows[0].total,
        synced: syncedRes.rows[0].synced,
        stale: staleRes.rows[0].stale,
        unsynced: totalRes.rows[0].total - syncedRes.rows[0].synced,
      };
    } catch (e) {
      status[table] = { error: e.message };
    }
  }
  return status;
}

export { ERPNextClient, ENTITY_MAP, pushToERP, pullFromERP, getSyncStatus };
export default ERPNextClient;
