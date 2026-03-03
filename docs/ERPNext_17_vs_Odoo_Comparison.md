# ERPNext 17 vs Odoo Open Source — Comparison for Dogan Consult Integration

Comparison for use by the Dogan Consult team, based on the existing ERP bridge and blueprint requirements.

**Quick links:** [Context](#context-what-dogan-consult-needs) · [ERPNext 17](#1-erpnext-17) · [Odoo](#2-odoo-community--open-source) · [Side-by-side](#3-side-by-side-dogan-consult-team--integration) · [Recommendation](#4-recommendation-for-dogan-consult-team-use) · [Future: Odoo adapter](#5-future-phase-odoo-adapter-optional) · **[Integration with Node.js and Angular 18](#7-integration-with-nodejs-and-angular-18-free-versions)** · [Deep comparison list](#6-deep-comparison-list-all-dimensions)

---

## Context: What Dogan Consult Needs

The codebase already integrates with an ERP via [backend/services/erp-sync.js](../backend/services/erp-sync.js) and [backend/routes/erp-bridge.js](../backend/routes/erp-bridge.js). Required entities:

| Entity        | ERP concept used today | Blueprint use case                          |
|---------------|-------------------------|---------------------------------------------|
| Leads         | Lead                    | Contact form → lead_intakes → ERP           |
| Opportunities | Opportunity            | Sales pipeline, quotations                 |
| Projects      | Project                 | Delivery, Gate 3, DoganHub                 |
| Contracts     | Contract                | Terms, value, dates                         |
| Tenders/RFQs  | Request for Quotation   | RFP handling                                |
| Customers     | Customer                | Push customer (SBG/checkout flow)           |
| Sales orders  | Sales Order             | Gate 3, invoicing, provisioning            |

Auth: token (`api_key:api_secret`) or cookie login. API style: REST resource CRUD (`/api/resource/{Doctype}`, `/api/method/...`).

---

## 1. ERPNext 17

**Licensing & cost**

- 100% open source (GPLv3). No per-user or per-module licence.
- Cost = hosting only (e.g. Frappe Cloud ~$25/month, or self-host at `/opt/erpnext` as in [backend/scripts/start-erpnext.sh](../backend/scripts/start-erpnext.sh)).

**API & integration**

- Frappe REST API: `GET/POST/PUT/DELETE /api/resource/{DocType}`, `POST /api/method/{method}`.
- Auth: `Authorization: token api_key:api_secret` or cookie via `/api/method/login`.
- DocTypes map directly to current `ENTITY_MAP`: Lead, Opportunity, Project, Contract, Request for Quotation, Customer, Sales Order.
- **Fit:** Existing [erp-sync.js](../backend/services/erp-sync.js) is built for this (v15 API; v17 is compatible). No rewrite.

**Team use**

- Web UI: functional, form-based; learning curve for non-technical users.
- Roles/permissions: built-in; suitable for internal team (sales, delivery, admin).
- Hosting: single bench at `/opt/erpnext` or Frappe Cloud; one instance can serve the whole team.

**Pros for Dogan Consult**

- Zero licence cost; predictable TCO.
- Current integration works as-is (only point at ERPNext 17).
- All required entities exist; field/status maps already in code.
- Full source access; no vendor lock-in.

**Cons**

- UI less "modern" than Odoo; more configuration than no-code.
- Ecosystem smaller than Odoo (fewer ready-made apps).

---

## 2. Odoo (Community / Open Source)

**Licensing & cost**

- Open Core: Community Edition (CE) is free and open source (LGPL).
- Enterprise: paid per user/month; many advanced features (e.g. Studio, advanced accounting) only in Enterprise.
- External API: XML-RPC/JSON-RPC are being deprecated in Odoo 20 (planned ~2026); new "External JSON-2 API" may require a Custom/paid plan for full external access.

**API & integration**

- Current external API: JSON-RPC/XML-RPC (e.g. `execute_kw('object', 'method', args, kwargs)`), not REST-by-resource.
- Model names differ: e.g. `crm.lead`, `sale.order`, `project.project`, `res.partner` (customer), `account.move` (invoices).
- **Fit:** Would require a new client and mapping layer: different endpoints, auth, and field names. [erp-sync.js](../backend/services/erp-sync.js) and [erp-bridge.js](../backend/routes/erp-bridge.js) are ERPNext-shaped; an "Odoo adapter" would be a separate implementation (second ERP type or replacement).

**Team use**

- Web UI: modern, app-style; generally easier for end-users.
- Community: many apps; Studio (no-code) is Enterprise-only.
- Hosting: self-host CE or Odoo.sh / cloud; one instance can serve the whole team.

**Pros for Dogan Consult**

- Polished UX; large ecosystem.
- Strong in e-commerce and web if SBG/storefront is in scope.
- CE is free; good for internal team if CE feature set is enough.

**Cons**

- Integration: different API paradigm; deprecation of current RPC in Odoo 20; possible cost for new External API.
- Entity mapping: new work (crm.lead ↔ lead_intakes, sale.order ↔ opportunities/SO, etc.).
- Risk of needing Enterprise or Custom plan for robust, long-term external integration.

---

## 3. Side-by-Side (Dogan Consult team + integration)

| Criteria                 | ERPNext 17                    | Odoo (CE / open source)           |
|--------------------------|-------------------------------|-----------------------------------|
| **Integration effort**   | None; existing code fits      | New adapter + mapping; API shift  |
| **Licence cost**         | $0                            | $0 (CE); paid if Enterprise/API   |
| **API style**            | REST (resource + method)      | RPC today; REST/JSON-2 later     |
| **Lead/Opp/Project/SO**  | Native DocTypes, already used | Models exist; need mapping       |
| **Customer / Sales Order** | Native; in blueprint        | res.partner, sale.order          |
| **Hosting**              | Bench at /opt or cloud        | Self-host or Odoo.sh             |
| **UI for team**          | Functional, steeper learning  | Modern, easier for many users    |
| **KSA / on-prem**        | Self-host possible            | Self-host possible (CE)           |
| **Long-term API**        | Stable REST                   | RPC deprecated; new API TBD     |

---

## 4. Recommendation (for Dogan Consult team use)

- **If the goal is minimal change and guaranteed fit with current Dogan stack:**  
  **Use ERPNext 17.** The existing bridge and entity map already target this model; you only need to run ERPNext 17 (e.g. at `/opt/erpnext`) and point env/config (e.g. `ERP_URL`, `ERP_API_KEY`, `ERP_API_SECRET`) at it.

- **If the priority is best-in-class UX and app ecosystem and you accept a new integration:**  
  **Evaluate Odoo CE** with a dedicated Odoo adapter (new service or refactor of erp-bridge to support "provider: erpnext | odoo"). Plan for Odoo 20 API changes and possible Enterprise/External API cost if you need guaranteed long-term external access.

**Practical path:** Stay on ERPNext 17 for integration and team use; optionally implement an "Odoo adapter" as a future phase if you later want to support or migrate to Odoo (see below).

---

## 5. Future phase: Odoo adapter (optional)

If the team later decides to support Odoo (e.g. for SBG or a specific tenant), implement as follows without breaking the current ERPNext integration:

1. **Provider abstraction in erp-bridge**
   - Add config: `erp_provider: 'erpnext' | 'odoo'`.
   - Keep [backend/routes/erp-bridge.js](../backend/routes/erp-bridge.js) as the single API surface; internally call either `ERPNextClient` or a new `OdooClient`.

2. **New Odoo client**
   - New module: `backend/services/odoo-client.js` (or `erp-odoo.js`).
   - Use JSON-RPC (pre–Odoo 20) or the new External JSON-2 API when available.
   - Auth: Odoo session or API key per Odoo docs.

3. **Entity mapping for Odoo**
   - Define `ODOO_ENTITY_MAP` analogous to `ENTITY_MAP` in [backend/services/erp-sync.js](../backend/services/erp-sync.js):
     - `lead_intakes` ↔ `crm.lead`
     - `opportunities` ↔ `sale.order` (or pipeline stage)
     - `projects` ↔ `project.project`
     - `contracts` ↔ `contract` or custom model
     - Customers ↔ `res.partner`
     - Sales orders ↔ `sale.order`
   - Implement `pushToOdoo`, `pullFromOdoo`, and sync status for these entities.

4. **Routing in erp-bridge**
   - `getERPClient()` returns `ERPNextClient` or `OdooClient` based on `erp_provider`.
   - Sync endpoints (`/erp/sync/push`, `/erp/sync/pull`) delegate to the active client and its mapping.

5. **Documentation and config**
   - Document Odoo env vars (e.g. `ODOO_URL`, `ODOO_DB`, `ODOO_USER`, `ODOO_API_KEY`).
   - Update admin UI ([admin-erp-integration.component.ts](../frontend/src/app/pages/admin/components/admin-erp-integration.component.ts)) to allow selecting provider and entering Odoo config when provider is `odoo`.

This keeps a single "ERP integration" surface for the rest of the app while allowing a second backend (Odoo) to be added when needed.

---

## 6. Deep comparison list (all dimensions)

Exhaustive side-by-side list so no material comparison is overlooked. Use for procurement, architecture, or team decisions.

### 6.1 Licensing and cost

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Licence model | 100% open source (GPLv3) | Open Core: CE free (LGPL), Enterprise paid |
| Per-user fee | None | CE: $0; Enterprise: ~$25–35/user/month |
| Per-module fee | None | Many advanced modules Enterprise-only |
| Hosting cost | Self-host or Frappe Cloud ~$25/month (instance) | Self-host or Odoo.sh (per-user or plan) |
| Implementation / partner cost | Often developer-led; no licence uplift | Partner rates ~$80–150/hr; Enterprise adds licence |
| Long-term TCO | Predictable (hosting + labour) | Can grow with user count and Enterprise modules |
| Vendor lock-in | None; full source | CE: low; Enterprise: contract and upgrades |

### 6.2 Core modules and features

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Accounting | Full double-entry, GL, AP/AR, multi-currency, tax; manual setup | CE: basic; Enterprise: banking sync, AI, advanced |
| CRM | Lead, opportunity, pipeline, standard | Strong; sales forecasting, marketing automation (some EE) |
| Sales / quotations | Quotations, SO, integrated | Quotations, SO; e-commerce stronger in Odoo |
| Purchasing / procurement | PO, RFQ, supplier management | PO, RFQ; some features EE |
| Inventory / warehouse | Strong; batch/serial, multi-warehouse, real-time | Good; some advanced features EE |
| Manufacturing | BOM, work orders, job cards, capacity, subcontracting | Best-in-class PLM/shop floor; many features EE |
| Projects | Tasks, timesheets, profitability | Project app; tasks, timesheets |
| HR & payroll | Deep by default; attendance, leave, payroll, expenses | CE: basic; payroll/localization often EE or apps |
| E-commerce / website | Basic store | Full website builder and e-commerce (Odoo strength) |
| Invoicing | Sales/purchase invoices, linked to accounting | Invoices; advanced automation in EE |
| Contracts | Contract DocType | Contract or custom; may need app |
| Tenders / RFQ | Request for Quotation DocType | Purchasing RFQ; naming differs |
| Fixed assets | Available | Available (EE or app) |
| Helpdesk / support | Basic or app | Helpdesk app |
| All modules in one edition | Yes | No; CE vs EE split |

### 6.3 API and integration (Dogan stack)

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| API style | REST: `/api/resource/{DocType}`, `/api/method/` | JSON-RPC/XML-RPC; External JSON-2 in Odoo 20 |
| Auth | Token (api_key:secret) or cookie login | Session / API key; External API may need paid plan |
| Fit with existing [erp-sync.js] | Direct; no rewrite | New client + entity mapping required |
| DocType / model naming | Lead, Opportunity, Project, Customer, Sales Order, etc. | crm.lead, sale.order, project.project, res.partner |
| Webhooks / events | Custom or Frappe hooks | Odoo has event system; integration pattern differs |
| Rate limits / throttling | Configurable | Depends on deployment |
| API stability | Stable REST; v15/v17 compatible | RPC deprecated in Odoo 20; new API TBD |
| External API cost (future) | N/A | External JSON-2 API may require Custom/paid plan |

### 6.4 User experience and UI

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| UI style | Form-based, functional, utilitarian | Modern, app-style, Material-influenced |
| Learning curve | Steeper for non-technical users | Generally easier for end-users |
| Mobile experience | Responsive; dedicated mobile improving | Good; mobile apps available |
| Dashboards / reports | Built-in; configurable | Strong; AI/analytics in EE |
| No-code customization | Limited; more config than no-code | Studio (EE): drag-and-drop |
| Accessibility | Varies | Often better in Odoo (modern stack) |
| RTL / Arabic UI | Supported | Supported; may need locale tuning |

### 6.5 Localization and language

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Multi-language | 30+ languages built-in | Multi-language; locale apps |
| Arabic | Supported | Supported |
| Saudi / GCC | ZATCA (VAT, e-invoicing) in recent releases | Possible with config/apps; more custom work |
| Currency | Multi-currency | Multi-currency |
| Date/number formats | Localized | Localized |
| Translation management | Frappe translation tool | Odoo translation interface |

### 6.6 Reporting and analytics

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Financial reports | Detailed, customizable; manual setup | Strong; automated reconciliation in EE |
| Custom reports | Report Builder, scripts | Dashboards, pivot; BI in EE |
| Export (PDF, Excel) | Yes | Yes |
| Real-time data | Yes across modules | Yes; real-time in EE |
| AI / predictive | Limited out of box | EE: AI features, forecasting |

### 6.7 Security and compliance

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Authentication | Login, API token, cookie | Login, API key; EE: LDAP, OAuth, etc. |
| Roles and permissions | Built-in RBAC, per DocType | Fine-grained; EE: more options |
| Audit trail | Versioning, doc history | Tracking; EE: advanced audit |
| Data isolation | Tenant/site in Frappe | Company; multi-company |
| Encryption (rest/transit) | Deployment-dependent | Deployment-dependent |
| Compliance (e.g. GDPR) | Implement with policies | EE: some compliance tooling |
| KSA / ZATCA | Native ZATCA support | Custom/config |

### 6.8 Deployment and operations

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Stack | Python (Frappe), MariaDB/Postgres, Redis | Python, Postgres, Redis |
| Self-hosted | Yes; bench at e.g. `/opt/erpnext` | Yes |
| Managed cloud | Frappe Cloud | Odoo.sh, partners |
| Docker / K8s | Community images, bench | Official images, Odoo.sh |
| Backup / restore | Bench backup, DB dump | Standard DB backup; version-specific |
| Multi-tenant | Multi-site (bench) | Multi-database or multi-company |
| Resource requirements | Can be heavy for small setups | Varies; EE cloud often smoother |

### 6.9 Scalability and performance

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Small team (1–10 users) | Works; can feel heavy | CE fits well |
| Mid-size (10–100 users) | Good fit | Good; EE scales with support |
| Large / enterprise | Possible; tune DB and cache | 5000+ employees cited; large partner network |
| Database | MariaDB or Postgres | Postgres |
| Caching | Redis | Redis |
| Background jobs | Frappe queue, scheduler | Odoo queue, cron |
| Benchmarks | Depends on workload | Often better documented for Odoo.sh |

### 6.10 Community and support

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Forums | discuss.frappe.io, discuss.erpnext.com | Odoo community forums |
| Documentation | docs.frappe.io, ERPNext docs, admin guide | Odoo official docs |
| Version migration guides | GitHub wiki (e.g. v15 migration) | Odoo upgrade/migration guides |
| Commercial support | Frappe Technologies, partners | Odoo S.A., 2000+ partners |
| Core team size | ~40 (Frappe) | Larger; Odoo S.A. + ecosystem |
| Release cadence | Major versions periodically | Annual major (e.g. 18, 19, 20) |
| Long-term support | Community-driven | EE: official LTS patterns |

### 6.11 Customization and extensibility

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Custom fields | Yes; no code in core | Yes; Studio in EE |
| Custom DocTypes / models | Frappe framework; Python/JS | New models, views; Python/XML |
| Workflows | Workflow engine | Automation (EE), server actions |
| Scripts / server actions | Frappe server scripts, API | Python, cron, actions |
| Breaking core upgrades | Customizations can break on major upgrade | Same; version upgrades need testing |
| App store / marketplace | Fewer apps | 30,000+ apps (Odoo Apps) |
| Developer experience | Frappe is consistent; REST auto-generated | Python ORM; RPC; learning curve |

### 6.12 Mobile and access

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Mobile web | Responsive | Responsive |
| Native mobile app | Frappe mobile (evolving) | Odoo has mobile apps |
| Offline | Limited | Limited unless custom |
| Tablet | Usable | Good |

### 6.13 Industry and verticals

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Generic ERP | Strong | Strong |
| Manufacturing | Strong; BOM, work orders | Best-in-class (EE) |
| Distribution / retail | Good | Good; e-commerce strength |
| Services / consulting | Projects, timesheets, contracts | Projects, sales, invoicing |
| Non-profit | Possible | Apps available |
| Healthcare | Custom/build | Apps |
| Education | Custom/build | Apps |
| Public sector | Self-host, no licence cost | CE possible; EE for support |

### 6.14 Upgrade and migration

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| In-place upgrade | `bench update`, `bench migrate` | Odoo upgrade procedures |
| Major version upgrade | Test in staging; custom apps may need updates | Same; module compatibility matrix |
| Data migration from other ERP | ETL, scripts, or tools | Import tools, partners |
| Odoo → ERPNext | Possible; data mapping and ETL | N/A |
| ERPNext → Odoo | Possible; data mapping and ETL | N/A |

### 6.15 Dogan Consult–specific (KSA, integration, team)

| Dimension | ERPNext 17 | Odoo (CE / open source) |
|-----------|------------|--------------------------|
| Existing bridge [erp-bridge.js] | Works as-is | New adapter needed |
| Lead → ERP | ENTITY_MAP already maps lead_intakes → Lead | Map to crm.lead |
| Customer / SO (SBG, Gate 3) | Customer, Sales Order native | res.partner, sale.order |
| Arabic / EN for team | Supported | Supported |
| KSA / ZATCA / on-prem | ZATCA in product; self-host in KSA | Self-host OK; ZATCA custom |
| Single team instance | One bench / site | One database or company |
| Admin-only ERP config | Current UI is ERPNext-oriented | Would need provider + Odoo config UI |

---

## 7. Integration with Node.js and Angular 18 (free versions)

You will use the **free** editions of both: **ERPNext 17** (100% open source) and **Odoo Community Edition (CE)**. Below is how both integrate with the existing **Node.js (Express)** backend and **Angular 18** frontend.

### 7.1 Architecture overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Angular 18 (Admin dashboard)                                            │
│  - Admin ERP Integration component                                       │
│  - Calls /api/v1/erp/* only (same API for both ERPs)                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Node.js (Express) — backend/server.js                                   │
│  - Mounts erp-bridge at /api/v1                                          │
│  - erp-bridge.js: reads erp_provider from config → picks client          │
└─────────────────────────────────────────────────────────────────────────┘
                    │                                    │
        ┌───────────┴───────────┐            ┌───────────┴───────────┐
        ▼                       ▼            ▼                       ▼
┌───────────────┐     ┌───────────────┐  ┌───────────────┐   ┌───────────────┐
│ erp-sync.js   │     │ odoo-client.js│  │ ERPNext 17    │   │ Odoo CE       │
│ ERPNextClient │     │ OdooClient    │  │ (free, self-  │   │ (free, self-  │
│ REST API      │     │ JSON-RPC      │  │ host or cloud)│   │ host)         │
└───────────────┘     └───────────────┘  └───────────────┘   └───────────────┘
```

- **Single API surface:** All ERP operations go through `/api/v1/erp/*`. The frontend does not care which ERP is behind it.
- **Provider in config:** `erp_provider: 'erpnext' | 'odoo'` (stored in `admin_settings` with `erp_config`). Node.js uses it to instantiate the correct client and mapping.

### 7.2 Node.js integration

| Layer | ERPNext (free) | Odoo CE (free) |
|-------|----------------|----------------|
| **Client module** | [backend/services/erp-sync.js](../backend/services/erp-sync.js) — `ERPNextClient` | New `backend/services/odoo-client.js` — `OdooClient` (JSON-RPC to `/jsonrpc` or `/xmlrpc/2`) |
| **Auth** | Token `api_key:api_secret` or cookie login to `/api/method/login` | Session: call `common.authenticate(db, user, password)` then pass `uid` + context; or use API key if available in your Odoo version |
| **CRUD** | REST: `GET/POST/PUT/DELETE /api/resource/{DocType}` | RPC: `execute_kw(db, uid, password, model, method, args, kwargs)` e.g. `search_read`, `create`, `write` |
| **Entity mapping** | `ENTITY_MAP` in erp-sync.js (lead_intakes→Lead, opportunities→Opportunity, etc.) | New `ODOO_ENTITY_MAP`: lead_intakes→`crm.lead`, opportunities→`sale.order` (or pipeline), Customer→`res.partner`, Sales Order→`sale.order`, Project→`project.project` |
| **Config storage** | Same `admin_settings` table, key `erp_config`. Fields: `url`, `user`, `pass`, `api_key`, `api_secret` | Extend `erp_config` with `provider: 'odoo'`, `odoo_db`, and optionally `odoo_api_key` if used |
| **Router** | [backend/routes/erp-bridge.js](../backend/routes/erp-bridge.js) | Same router: `getERPClient()` returns `ERPNextClient` or `OdooClient` based on `provider`; sync endpoints call `pushToERP`/`pullFromERP` which delegate to the correct client and mapping |

**Node.js flow (both ERPs):**

1. Admin sets **Provider** (ERPNext or Odoo) and the relevant URL/credentials in the UI.
2. Frontend sends `PUT /api/v1/erp/config` with `provider`, `url`, `user`, `pass`, and for Odoo optionally `db`.
3. Backend saves JSON to `admin_settings` and, on next request, `getERPClient()` reads `provider` and builds either `ERPNextClient` or `OdooClient`.
4. **Status:** `GET /api/v1/erp/status` → backend calls `client.healthCheck()` (each client implements it).
5. **Sync:** `POST /api/v1/erp/sync/push` and `pull` → backend use the same `entity_type` (e.g. `lead_intakes`); the active client maps it to ERPNext DocType or Odoo model and performs the request.
6. **Proxy (optional):** `GET /api/v1/erp/resource/:doctype` — for ERPNext the path is DocType; for Odoo the router can translate `doctype` to an Odoo model name and call `execute_kw(..., 'search_read', ...)` so the Angular app can still list records without knowing the ERP.

**New/updated files (for Odoo CE):**

- `backend/services/odoo-client.js` — connect, authenticate, `search_read`, `create`, `write`, `healthCheck`; same interface as needed by the bridge (e.g. `listResource`, `getResource`, `createResource`, `updateResource` implemented via RPC).
- `backend/services/erp-sync.js` or a small `erp-odoo-mapping.js` — `ODOO_ENTITY_MAP` and `pushToOdoo` / `pullFromOdoo` (or a unified `pushToERP` that branches on provider and calls pushToOdoo when provider is Odoo).
- `backend/routes/erp-bridge.js` — read `provider` from config; if `odoo`, create `OdooClient` and use Odoo mapping for sync; keep all route paths unchanged so Angular does not change.

### 7.3 Angular 18 integration

| Area | Current (ERPNext only) | With both (ERPNext + Odoo CE) |
|------|-------------------------|-------------------------------|
| **API calls** | [admin-erp-integration.component.ts](../frontend/src/app/pages/admin/components/admin-erp-integration.component.ts) calls `GET /api/v1/erp/status`, `GET /api/v1/erp/config`, `PUT /api/v1/erp/config`, `POST /api/v1/erp/sync/bulk-push`, `GET /api/v1/erp/mappings` | No change: same endpoints. Backend returns `provider` in config/status so UI can show “Connected to ERPNext” or “Connected to Odoo”. |
| **Config form** | Fields: URL, Username, Password, API Key, API Secret | Add **Provider** dropdown: “ERPNext” | “Odoo CE”. When “Odoo CE”: show URL, Database (optional), Username, Password (and hide or repurpose API Key/Secret unless Odoo exposes one). When “ERPNext”: keep current fields. |
| **Status / connection** | Shows “ERPNext is running and accessible” | Show “ERPNext is running…” or “Odoo is running…” based on `status().provider` or `config().provider`. |
| **Quick links** | “Open ERPNext Dashboard”, “Leads”, “Opportunities”, “Projects” with ERPNext app paths | If provider is Odoo: “Open Odoo” → base URL; “Leads” → `/web#model=crm.lead`; “Opportunities” / “Sales” → `/web#model=sale.order`; “Projects” → `/web#model=project.project`. If ERPNext: keep current links. |
| **Sync status / mappings** | Same table and “Push All” per entity type | Same. Backend already returns sync counts and mappings; for Odoo the mappings come from `ODOO_ENTITY_MAP` (e.g. display “lead_intakes → crm.lead”). |
| **Auth** | Angular sends `Authorization: Bearer <token>` (portal auth). No ERP credentials in frontend. | Same: only backend has ERP credentials; Angular only sends portal JWT. |

**Summary for Angular 18:**

- **One component** (Admin ERP Integration) continues to drive both ERPs.
- **One set of APIs:** ` /api/v1/erp/*`; no duplicate endpoints for Odoo.
- **Minimal UI changes:** provider dropdown, conditional config fields, and provider-aware labels/quick links. All sync, status, and mapping behaviour stay the same from the frontend’s perspective.

### 7.4 Env and config (free versions)

**ERPNext 17 (free):**

- `ERP_URL` (e.g. `http://localhost:8080` or Frappe Cloud site)
- `ERP_USER` / `ERP_PASS` or `ERP_API_KEY` / `ERP_API_SECRET`
- Config can override via admin UI and be stored in `admin_settings`.

**Odoo CE (free):**

- `ODOO_URL` (e.g. `http://localhost:8069`)
- `ODOO_DB` (database name; optional if single DB)
- `ODOO_USER` / `ODOO_PASS`
- Config override in admin UI when provider is Odoo; same `admin_settings` key with `provider: 'odoo'` and the above fields.

### 7.5 Summary

- **Node.js:** One bridge router; two clients (ERPNext REST, Odoo JSON-RPC) and two entity maps; provider in config decides which client is used. Sync and proxy routes stay unchanged; only the implementation behind them changes.
- **Angular 18:** Same admin component and same `/api/v1/erp/*` calls; add provider selection and Odoo-specific config fields and quick links so both free ERPNext 17 and free Odoo CE are supported without a second app or duplicate screens.
