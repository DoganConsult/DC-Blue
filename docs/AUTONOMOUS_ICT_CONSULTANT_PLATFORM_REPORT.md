# Autonomous ICT Consultant Engineer Platform — Report

**Purpose:** What we have, what’s missing, what must be connected, and what must be integrated to reach an **autonomous ICT consultant engineering platform**.

---

## 1. What Is an “Autonomous ICT Consultant Engineer Platform”?

An **autonomous ICT consultant engineering platform** runs the full consulting lifecycle with minimal human intervention. Humans approve and decide; the platform executes and notifies.

| Phase | Autonomous behavior |
|-------|----------------------|
| **Intake** | Capture inquiry/partner lead → dedupe → score → assign → notify customer + internal |
| **Qualify** | Gate checklists per stage; move only when conditions met (or manual override) |
| **Propose** | Generate proposal/annex from regulatory matrix; send; track |
| **Contract** | Generate contract/NDA/SOW from matrix; e-sign flow (or manual) |
| **Delivery** | Engagement lifecycle with matrix-driven checklist; evidence upload; sign-off |
| **Invoice / Commission** | Invoice tracking → first payment → commission status → payout notification |

**Formula:**  
**AUTONOMOUS = Intake + Qualify + Score + Assign + Gate + Propose + Contract + Deliver + Invoice + Commission**  
— each step automated or rule-driven where possible.

---

## 2. What We HAVE (Current State)

### 2.1 Built and wired (in use)

| Component | Location | Status |
|-----------|----------|--------|
| **Landing + inquiry (DLI)** | `POST /api/v1/public/inquiries` | ✅ Dedupe, auto-assign, ticket, activity |
| **Partner registration** | `POST /api/v1/public/partners/register` | ✅ API key, partner row |
| **Partner lead submit (PLRP)** | `POST /api/v1/partners/leads` | ✅ Creates lead + partner_leads |
| **Admin lead list/detail** | `GET/PATCH /api/v1/leads`, `GET /leads/:id` | ✅ Activities, convert |
| **Opportunity CRUD** | `GET/PATCH /api/v1/opportunities` | ✅ Pipeline backend; commission row on closed_won |
| **Partner lead approve/reject** | `POST /api/v1/partners/leads/:id/approve`, `reject` | ✅ Status + exclusivity fields |
| **Partner dashboard** | Frontend + `GET /partners/leads` | ✅ Leads + opportunity stage (LEFT JOIN) |
| **Ticket tracking** | `GET /api/v1/public/track/:ticket` | ✅ Public status |
| **Portal auth** | JWT + X-Admin-Token, `portalAuth` | ✅ Admin/employee |
| **Admin partners** | List, approve/reject/suspend | ✅ |
| **KSA CR activities** | 17 codes, EN/AR, API | ✅ |
| **Service regulatory matrix (frontend)** | `service-regulatory-matrix.model.ts`, `.ksa.ts` | ✅ Lead detail uses it; 3 activities in legacy KSA seed |
| **Regulatory matrix (backend)** | `services/regulatory-matrix.js`, 17 KSA activities | ✅ Full server-side matrix |
| **Matrix API** | `GET /api/v1/public/service-regulatory-matrix?country=&activity=` | ✅ Implemented in `routes/matrix-api.js` |

### 2.2 Built and NOW wired in `server.js`

These routes and services exist and are now **mounted/started**, so they are available at runtime:

| Component | File | Intended route | Status |
|-----------|------|----------------|--------|
| **Engagements** | `routes/engagements.js` | `/api/v1/engagements` | ✅ Mounted |
| **Gates** | `routes/gates.js` | `/api/v1/opportunities/:id/gates`, `/gate-definitions` | ✅ Mounted |
| **File uploads** | `routes/files.js` | `/api/v1/files/upload`, `/files/:entityType/:entityId` | ✅ Mounted |
| **Matrix API** | `routes/matrix-api.js` | `/api/v1/public/service-regulatory-matrix` | ✅ Mounted |
| **Commissions** | `routes/commissions.js` | `/api/v1/commissions`, PATCH, summary | ✅ Mounted |
| **Scheduler** | `services/scheduler.js` | N/A (startScheduler(pool)) | ✅ Started |

### 2.3 Backend logic now connected in main flows

| Item | Location | Used in leads.js? |
|------|----------|--------------------|
| **Email service** | `services/email.js` | ✅ Inquiry confirmation + internal alerts + partner lead notifications |
| **Scoring** | `services/scoring.js` (`calculateLeadScore`) | ✅ Inquiry + partner lead inserts persist calculated score |
| **Commission email** | `commissions.js` sends on PATCH commission | ✅ Router mounted; also notified on closed_won commission creation |

### 2.4 Database

- **Main schema:** `lead_intakes`, `opportunities`, `lead_activities`, `lead_assign_rules`, `partners`, `partner_leads`, `commissions`, `portal_users` — in use.
- **Autonomous migration:** `scripts/autonomous-platform-migration.sql` defines `gate_definitions`, `gate_checklist_items`, `engagements`, `engagement_checklist_items`, `file_uploads`, `email_log`, `scheduled_tasks_log` and seeds gates. **Must be applied** if not already; tables are required by the unmounted routes.

### 2.5 Frontend

- **Admin:** `admin-dashboard.page.ts`, `admin-lead-detail.page.ts` — exist.
- **Pipeline UI:** No `admin-pipeline.page.ts`; pipeline is backend-only (list opportunities by stage).

---

## 3. What’s MISSING (Gaps)

| # | Gap | Impact |
|---|-----|--------|
| 1 | **Email not triggered** | No confirmation to customer on inquiry; no internal new-lead alert; no partner approve/reject emails |
| 2 | **Lead score always 0** | No auto-score on intake; no routing or prioritization by score |
| 3 | **Scheduler not started** | No SLA breach checks; no exclusivity-expiry reminders; no overdue next_action alerts |
| 4 | **Engagements/gates/files/matrix/commissions not mounted** | Engagements, gate checklists, file uploads, matrix API, and commission list/PATCH/summary are unreachable |
| 5 | **No admin pipeline UI** | No Kanban/list by stage; admins cannot visually move opportunities |
| 6 | **No document generation** | No proposal, contract, NDA, or SOW generation from matrix (no PDF/docx/puppeteer) |
| 7 | **No gate enforcement** | Stage changes are free-form; no checklist blocking move to next stage |
| 8 | **Commission payout flow** | Row created on closed_won; no invoice tracking, “first payment received”, or payout workflow |
| 9 | **No tests** | No Jest/Vitest/Karma or e2e tests |
| 10 | **No Docker** | No Dockerfile or docker-compose for deploy |

---

## 4. What MUST Be CONNECTED (Wiring)

These are **internal** connections: mount routes and call existing services so that existing code runs in production.

### 4.1 Server: mount routers and start scheduler

**File:** `backend/server.js`

- Mount after `leadsRouter`:
  - `engagementsRouter(pool, portalAuth)` → `/api/v1`
  - `gatesRouter(pool, portalAuth)` → `/api/v1`
  - `filesRouter(pool, portalAuth)` → `/api/v1`
  - `matrixApiRouter()` → `/api/v1` (no pool needed)
  - `commissionsRouter(pool, portalAuth, adminOnly)` → `/api/v1`
- After pool creation, call `startScheduler(pool)` (import from `services/scheduler.js`).

So: **wire engagements, gates, files, matrix API, commissions, and scheduler in `server.js`.**

### 4.2 Lead intake: scoring + email

**File:** `backend/routes/leads.js`

- In `POST /public/inquiries`:
  - Import `calculateLeadScore` from `services/scoring.js`; compute score from request body; use it in INSERT instead of `0`.
  - After successful INSERT, import `sendEmail` and `sendInternalAlert` from `services/email.js`; send `inquiry_confirmation` to `contact_email` and `internal_new_lead` to internal.
- In partner lead `POST /partners/leads`: after success, send `partner_submitted` to partner contact (if you have it) and/or internal.
- In `POST /partners/leads/:id/approve` and `reject`: after DB update, send `partner_approved` or `partner_rejected` to partner email.

So: **connect scoring and email to inquiry and partner lead flows.**

### 4.3 Commission created email on closed_won

**File:** `backend/routes/leads.js`

- In `PATCH /opportunities/:id`, when `newStage === 'closed_won'` and you insert into `commissions`, after the insert get partner contact_email and call `sendEmail(pool, 'commission_created', { ... }, partnerEmail)` so partner is notified even before commissions router is used.

Optional: when commissions router is mounted, keep the email in `commissions.js` on PATCH to approved/paid as well.

### 4.4 Apply autonomous migration

- Ensure `backend/scripts/autonomous-platform-migration.sql` has been run on the target database so that `gate_definitions`, `gate_checklist_items`, `engagements`, `engagement_checklist_items`, `file_uploads`, `email_log`, `scheduled_tasks_log` exist and gate definitions are seeded.

### 4.5 Frontend: pipeline page

- Add `admin-pipeline.page.ts` (e.g. Kanban or list by stage) that:
  - Calls `GET /api/v1/opportunities?stage=...` (and optionally owner),
  - Displays opportunities by stage,
  - Allows PATCH to change stage (and optionally gate checklist from `GET /api/v1/opportunities/:id/gates`).
- Add route and nav link so admins can open the pipeline view.

---

## 5. What MUST Be INTEGRATED (New or External)

These go beyond “wiring”: they require new features or external systems.

### 5.1 Document generation (proposal, contract, NDA, SOW)

- **Need:** Templates that pull from regulatory matrix (activity + country) and opportunity/lead data; output PDF or docx.
- **Options:** Puppeteer/PDFKit for PDF; docx lib for Word; or external service. Matrix already exists server-side; integration = “generate document from template + matrix entry + lead/opportunity”.

### 5.2 Gate enforcement (optional but recommended)

- **Need:** Before allowing stage change (e.g. discovery → proposal), require gate checklist for current stage to be complete (or admin override).
- **Where:** In `PATCH /opportunities/:id` or in gates router: check `gate_checklist_items` for current stage; if required items unchecked, return 400 with message, or allow only if `portalUser.role === 'admin'`.

### 5.3 Commission payout lifecycle

- **Need:** Status flow: pending → approved → paid; optional: link to “first invoice paid” (e.g. from ERPNext or manual flag); notify partner on approved/paid.
- **Current:** Commission row created on closed_won; commissions router (once mounted) allows PATCH to approved/paid and sends email. Integration = ensure router is mounted and add any “first payment received” or ERP sync if required.

### 5.4 DoganOS / ERPNext / Shahin AI (from Master Blueprint)

- **DoganOS:** Central identity/tenant/governance; “no website talks directly; everything goes through DoganOS” — requires API/auth integration.
- **ERPNext:** Customer sync, quotation, sales order, invoice, payment — for invoicing and commission trigger.
- **Shahin AI:** GRC pre-check on leads, compliance assessment, evidence vault — for regulatory intelligence.

These are **external** integrations and depend on your chosen architecture (single platform vs multi-product).

### 5.5 RBAC beyond admin/employee

- **Need:** Roles such as sales manager, delivery lead, partner manager, finance — and permission checks per route. Today only admin/employee and `adminOnly` on some routes. Integration = role table + middleware or Casbin/custom policy.

### 5.6 Docker + CI/CD

- **Need:** Dockerfile for backend (and optionally frontend serve), docker-compose for local/prod, and CI pipeline for test + build + deploy.

---

## 6. Summary Scorecard (After Wiring)

| Capability | Now | After wiring |
|------------|-----|---------------|
| Lead capture + dedupe + assign | ✅ | ✅ |
| Notifications (email) | ❌ | ✅ (inquiry, partner, internal, commission) |
| Lead scoring | ❌ | ✅ |
| Gate checklists (API) | ❌ (unmounted) | ✅ |
| Pipeline view (API) | ✅ | ✅ |
| Pipeline view (UI) | ❌ | ✅ (if pipeline page added) |
| Engagements (delivery) | ❌ (unmounted) | ✅ |
| File uploads | ❌ (unmounted) | ✅ |
| Matrix API (public) | ❌ (unmounted) | ✅ |
| Commissions list/PATCH/summary | ❌ (unmounted) | ✅ |
| Scheduler (SLA, exclusivity, overdue) | ❌ | ✅ |
| Document generation | ❌ | ❌ (separate integration) |
| Gate enforcement (block move) | ❌ | Optional (integration) |
| Commission payout flow | Partial | ✅ (with router mounted) |
| DoganOS/ERPNext/Shahin | ❌ | ❌ (roadmap) |

---

## 7. Recommended Order of Work

1. **Apply** `autonomous-platform-migration.sql` if not already.
2. **Wire** in `server.js`: engagements, gates, files, matrix API, commissions, and `startScheduler(pool)`.
3. **Connect** in `leads.js`: scoring on inquiry insert; email on inquiry success and internal alert; email on partner submit/approve/reject; optional commission email on closed_won.
4. **Add** admin pipeline page and route.
5. **Optionally** enforce gates on stage change in backend or frontend.
6. **Then** proceed to document generation, RBAC, and DoganOS/ERPNext/Shahin per roadmap.

---

*Report generated from codebase inspection. Server mount and lead-flow wiring are the critical path to an autonomous ICT consultant platform.*
