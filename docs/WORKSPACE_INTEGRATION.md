# Workspace — DB, API & Frontend Integration

**URL:** https://doganconsult.com/workspace (or `/workspace` with auth)

This document describes how the **Client Workspace** is wired end-to-end: database, backend API, and Angular frontend.

---

## 1. Route & access

| Item | Value |
|------|--------|
| **Frontend route** | `/workspace` |
| **Guard** | `authGuard` |
| **Allowed roles** | `customer`, `partner`, `admin` (see `app.routes.ts` `data.roles`) |
| **Redirect** | `/dashboard` redirects to `/workspace` |

After login, portal users (customer/partner) are sent to `/workspace`. Tab is synced to the URL as `?tab=<key>` (e.g. `/workspace?tab=messages`).

---

## 2. Backend API (DB ↔ Express)

**Base path:** `/api/v1/client/*`  
**Router:** `backend/routes/client.js`  
**Auth:** JWT via `portalAuth`; `clientOnly` ensures role is customer/partner/admin.  
**User scope:** All queries use `req.portalUser.id` (no tenant id in URL).

| Endpoint | Method | Purpose | Main DB tables |
|----------|--------|---------|----------------|
| `/client/dashboard` | GET | KPI counts (inquiries, opportunities, projects, contracts, demos, tenders, messages, notifications) | lead_intakes, opportunities, projects, contracts, demos, tenders, client_messages, client_notifications |
| `/client/notifications` | GET | Paginated notifications | client_notifications |
| `/client/notifications/:id/read` | PUT | Mark one read | client_notifications |
| `/client/notifications/read-all` | PUT | Mark all read | client_notifications |
| `/client/pipeline` | GET | Client-visible opportunities | opportunities, lead_intakes |
| `/client/pipeline/:id` | GET | Opportunity detail + activities + gates | opportunities, lead_intakes, lead_activities, gate_checklist_items |
| `/client/inquiries` | GET | Paginated lead intakes | lead_intakes |
| `/client/inquiries/:id` | GET | Lead detail + activities + files | lead_intakes, lead_activities, file_uploads |
| `/client/tenders` | GET | Tenders for user | tenders, opportunities, lead_intakes |
| `/client/tenders/:id` | GET | Tender + solutions | tenders, solutions |
| `/client/demos` | GET | Demos/POC for user | demos, opportunities, lead_intakes |
| `/client/demos/:id` | GET | Demo detail | demos |
| `/client/projects` | GET | Projects for user | projects, opportunities |
| `/client/projects/:id` | GET | Project + milestones + tasks | projects, milestones, tasks |
| `/client/contracts` | GET | Contracts for user | contracts, opportunities |
| `/client/contracts/:id` | GET | Contract + licenses | contracts, licenses |
| `/client/licenses` | GET | All licenses for user | licenses, contracts |
| `/client/messages` | GET | Messages (optional filter by opportunity_id) | client_messages |
| `/client/messages` | POST | Send message (body, opportunity_id) | client_messages |
| `/client/files` | GET | Files linked to user’s lead intakes | file_uploads, lead_intakes |
| `/client/export/pipeline` | GET | CSV export of pipeline | opportunities, lead_intakes |

**Database:** PostgreSQL. Schema for workspace entities is created/updated by:

- `backend/scripts/unified-workspace-migration.sql` (tenders, solutions, projects, contracts, licenses, demos, client_messages, client_notifications, gate_definitions, gate_checklist_items, engagements, etc.)

---

## 3. Frontend (Angular ↔ API)

**Page:** `frontend/src/app/pages/workspace/client-workspace.page.ts`  
**API client:** `frontend/src/app/core/services/client-api.service.ts`  
**Models:** `frontend/src/app/core/models/client.models.ts`

**Auth:** `ClientApiService` sends `Authorization: Bearer <token>` using `localStorage.getItem('dc_user_token')`.  
**Base URL:** Relative `/api/v1/...`; in dev the Angular proxy (`proxy.conf.json`) forwards `/api` to `http://localhost:4000`. In production, the same host (or reverse proxy) must serve the API at `/api`.

| Tab | Component | Service methods used |
|-----|-----------|----------------------|
| Overview | `WorkspaceOverviewComponent` | `getDashboard()` |
| Pipeline | `WorkspacePipelineComponent` | `getPipeline()`, `getPipelineDetail(id)`, `exportPipeline()` |
| Inquiries | `WorkspaceInquiriesComponent` | `getInquiries({ page, limit })` |
| Tenders | `WorkspaceTendersComponent` | `getTenders()` |
| Demos & POC | `WorkspaceDemosComponent` | `getDemos()` |
| Projects | `WorkspaceProjectsComponent` | `getProjects()`, `getProject(id)` |
| Contracts | `WorkspaceContractsComponent` | `getContracts()`, `getContract(id)`, `getLicenses()` |
| Messages | `WorkspaceMessagesComponent` | `getMessages()`, `sendMessage(body, opportunityId?)` |
| Settings | `WorkspaceSettingsComponent` | Profile from `localStorage`; MFA via `/api/v1/public/auth/toggle-mfa` |

All workspace data (overview, pipeline, inquiries, tenders, demos, projects, contracts, messages) is loaded from the backend; there is no mock data for these tabs.

---

## 4. Checklist for “workspace complete and integrated”

- [x] **DB:** `unified-workspace-migration.sql` (and any dependent migrations) applied.
- [x] **API:** `backend/routes/client.js` mounted under `/api/v1` (e.g. in `server.js`: `app.use('/api/v1', clientWorkspaceRouter(pool, portalAuth))`).
- [x] **Auth:** Portal JWT issued at login and stored (`dc_user_token`); `ClientApiService` sends it on every request.
- [x] **Frontend:** All tabs use `ClientApiService` and hit the endpoints above.
- [x] **Route:** `/workspace` protected by `authGuard` and role check.
- [x] **Deep links:** Tab stored in URL as `?tab=...` and read on init.

---

## 5. Production (doganconsult.com)

- **API base:** Ensure the same origin (or reverse proxy) serves the Node API so that `/api/v1/client/*` resolves to the backend (e.g. `https://doganconsult.com/api/v1/client/dashboard`).
- **CORS:** If the frontend is on a different origin, the backend must allow that origin for `/api/v1`.
- **Cookies/Storage:** `dc_user_token` and `dc_user` are in `localStorage`; ensure login flow sets them and logout clears them (as in the workspace header “Sign Out”).

---

*Last updated: workspace wiring verified; inquiries first-load vs load-more fixed; tab synced to query param.*
