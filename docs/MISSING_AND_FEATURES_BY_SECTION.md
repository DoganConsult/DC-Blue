# Missing & Features by Section (per “Why We Built the App”)

**Reference:** [WHY_WE_BUILT_THE_APP.md](./WHY_WE_BUILT_THE_APP.md)  
**Purpose:** For each section, list what we have and what’s missing so we can serve customers, partners, and the full organization.

---

## 1. Company presence (public site)

**Why:** Show who Dogan Consult is — ICT infrastructure & telecommunications consulting, KSA/GCC, critical digital infrastructure, compliance (NCA, CITC).

### Features we have

- Landing page (`/`) with hero (ICT), social proof, problem, services, why choose, contact.
- Standalone pages: `/services`, `/about`, `/case-studies`, `/insights`.
- Bilingual EN/AR, RTL, theme (light/dark).
- Nav, footer, cookie consent, scroll-to-top.
- 38 section components in codebase (many not used on landing yet): trust, ROI, FAQ, pricing, industries, integrations, certifications, case studies, leadership, etc.
- Public content API: `/api/v1/public/content/:page`, `/api/v1/public/legal/:key`, `/api/v1/public/landing`, site-settings.

### Missing / gaps

- **Trust & compliance** — Trust section (NCA, KSA data residency badges) not on main landing; standards/certifications sections exist but not wired on `/`.
- **Sector clarity** — Industries section exists; not clearly surfaced on landing for “who we serve” (telco, government, etc.).
- **Case studies / proof** — Case studies page and section exist; link/prominence from landing could be stronger.
- **About / team** — About page exists; leadership/executive sections in bank not necessarily used.
- **Consistent content source** — Some copy still in components; not all driven from CMS/admin content.
- **SEO / meta** — Per-page title/description and OG tags may be incomplete for services, about, case-studies, insights.

---

## 2. Lead generation (inquiry, thanks, track)

**Why:** Capture inquiries and project requests; store in DB for the internal team to qualify and work.

### Features we have

- Inquiry page (`/inquiry`) and form.
- Thanks page (`/thanks`) after submit.
- Track page (`/track/:ticket`) for status by ticket.
- Backend: `POST /api/v1/public/inquiries` (optionalAuth), `GET /api/v1/public/track/:ticket`; lead intake and storage.
- Contact form: `POST /api/v1/public/contact` → lead_intakes.
- Register (`/register`), login, forgot/reset/change password.

### Missing / gaps

- **Inquiry form** — Product/service dropdown or structured “what do you need” may be minimal; no clear link to sectors/services from WHY.
- **Post-submit** — No “next step” (e.g. “we’ll contact you in 24h”) or optional calendar link on thanks.
- **Track experience** — Track page may show limited status; no timeline or “what happens next” copy.
- **Lead source** — Clear tagging (website_inquiry vs contact_form) and routing to right team/owner.
- **Duplicate prevention** — No obvious “already submitted?” or idempotency for same email/session.
- **Public registration** — Register exists; unclear if it’s for customers, partners, or both; partner has separate `/partner/register`.

---

## 3. Customer & partner access (portals)

**Why:** Customers get one place for their inquiries, projects, pipeline, messages, account. Partners get submit leads, commissions, pipeline; internal team approves and serves partner business.

### 3a. Customer portal (workspace)

**Features we have**

- Workspace at `/workspace` (auth), tabs: Overview, Pipeline, Inquiries, Tenders, Demos & POC, Projects, Contracts, Messages, Settings.
- Client API: dashboard, notifications, pipeline, inquiries, tenders, demos, projects, contracts, licenses, messages (get/send), files, export pipeline.
- Workspace components use ClientApiService; overview shows KPIs and summaries.

**Missing / gaps**

- **Customer dashboard page** — `CustomerDashboardPage` exists but is not routed; `/dashboard` redirects to `/workspace`. Either remove dead page or define a distinct “dashboard” view (e.g. summary-only).
- **Workspace tabs vs API** — All tabs exist; confirm each tab has full read (and where needed write) from backend (e.g. messages send, settings save).
- **Documents / files** — Client has `getFiles`; no clear “Documents” or “Files” tab in workspace; may be embedded elsewhere.
- **Notifications in workspace** — Notifications API exists; ensure workspace UI shows and marks read.
- **Settings** — Profile, password, preferences (language, theme); ensure persisted via API.
- **Onboarding** — First-time customer: no clear “getting started” or guided tour in workspace.
- **Mobile** — Tabs and tables may need responsive improvements for small screens.

### 3b. Partner portal

**Features we have**

- Partner register (`/partner/register`), dashboard (`/partner`), submit lead (`/partner/submit`).
- Partner dashboard tabs: overview, commissions, pipeline, activity, messages, analytics, resources, training, settings (and components: notifications, SLA, profile, tier, insights, feedback, forecast, onboarding, achievements).
- Backend: partner registration, resend access, partner leads (submit, list), approve/reject by admin, partner messages (admin summary, get/post by partnerId).
- PartnerApiService, PartnerSseService; auth (API key / session).

**Missing / gaps**

- **Partner-specific routes** — Only `/partner`, `/partner/register`, `/partner/submit`. No dedicated `/partner/commissions`, `/partner/pipeline`, etc.; everything is tabs on dashboard (OK) but deep-links to tab may be missing.
- **Commission detail** — Commission approval and payouts: backend has commissions routes; partner UI must show status, history, and any “request payout” flow if desired.
- **Pipeline alignment** — Partner pipeline vs internal gate pipeline: ensure partner sees “their” opportunities and status in a consistent way.
- **Training / resources** — Training and resources components exist; content and access control (who sees what) may be incomplete.
- **Partner onboarding** — Onboarding component exists; flow from registration → approved → first login and “what to do next” could be clearer.
- **API key / docs** — If partners integrate via API, no clear “API key” management and docs in partner portal.
- **SLA visibility** — Partner SLA component; ensure it reflects real SLA rules and targets from backend.

---

## 4. Internal team (full organization working together)

**Why:** One place for the full Dogan Consult organization to work together: manage leads, pipeline, engagements, commissions, and operations — to serve customer needs and partner business.

### Features we have

- Admin dashboard (`/admin`) with tabs: leads, partners, pipeline, engagements, commissions, gates, team, analytics, audit, files, mail, ERP, settings, structure, AI.
- Admin lead detail (`/admin/leads/:id`) for single lead.
- Backend: leads (list, get, patch, activities, convert), opportunities, dashboard stats, partners (list, patch, approve/reject partner leads), partner messages, tenders/demos/projects/contracts/milestones/tasks/licenses (CRUD), client messages, registrations (approve/reject), users (list, create, patch, reset password), commissions, gates, engagements, files, audit, analytics, notifications, ERP bridge, AI/copilot, admin content, theme.
- Auth: login, MFA verify/resend for admin.

**Missing / gaps**

- **Dedicated admin routes** — Only `/admin` and `/admin/leads/:id`. No `/admin/partners/:id`, `/admin/opportunities/:id`, `/admin/engagements/:id`, etc.; everything is tabs. Deep-links and bookmarks for specific resources would help.
- **Leads → opportunities** — Lead conversion and opportunity creation flow: ensure it’s clear and that pipeline tab shows same data as gate pipeline.
- **Gate pipeline** — Gates exist in backend; admin gate pipeline tab must show stages, move opportunities, and reflect commission gates where relevant.
- **Engagements** — Engagement manager tab: ensure it’s wired to engagements API and that engagements are visible per customer/opportunity.
- **Commissions** — Commission approval workflow: list pending, approve/reject, and link to partner and opportunity.
- **Team management** — Add/edit/disable users, roles (admin, employee); reset password; ensure roles align with “internal team” (not just “admin”).
- **Audit log** — Audit log tab: ensure all important actions (lead change, opportunity move, partner approve, commission approve) are logged and visible.
- **Files** — File browser: ensure it’s scoped (e.g. per opportunity or global) and that upload/delete permissions are correct.
- **Mail** — Email client: ensure it’s wired to real mail or mail queue and that replies are tracked.
- **ERP** — ERP integration: config and sync status exist; ensure UI supports “serve customer/partner” workflows (e.g. sync project to ERP).
- **AI assistant** — Copilot: ensure context (e.g. current lead, opportunity) is available so the team can use it while serving customers/partners.
- **Notifications** — Internal team notifications: ensure they get alerts for new leads, partner submissions, commission requests, and SLA risks.
- **Analytics** — Dashboards for “how we’re serving customers/partners” (e.g. lead conversion, partner revenue, pipeline health); ensure analytics tab shows these.
- **Settings / structure** — Org structure, pipeline stages, gate rules, commission rules: ensure editable and consistent with backend.
- **Customer context** — When working a lead or opportunity, quick link to “customer workspace” view (read-only) to see what the customer sees.
- **Partner context** — When working a partner, quick link to “partner view” (e.g. their pipeline, commissions) to serve partner business.

---

## 5. Cross-cutting

### Features we have

- Auth guard and role-based access (customer, partner, admin, employee).
- Bilingual (EN/AR), theme, design tokens and shared components.
- API under `/api/v1` with portal auth and admin-only where needed.

### Missing / gaps

- **Role clarity** — “Internal team” = admin + employee; ensure all internal tabs are available to appropriate roles (not only “admin”).
- **Consistent error and empty states** — 403/404 and “no data” messages consistent across public, customer, partner, and admin.
- **Loading states** — Skeleton or spinner everywhere data is fetched.
- **Auditability** — Key actions (lead update, opportunity move, partner approve, commission approve) logged with who/when; visible in audit tab.
- **Help / support** — No in-app help or “contact internal team” for customers/partners (e.g. from workspace or partner dashboard).

---

## 6. Summary table (by section)

| Section | Purpose (why we built it) | Main gaps |
|--------|----------------------------|-----------|
| **1. Company presence** | Show who we are, trust, compliance | Trust/sector content on landing; content from CMS; SEO |
| **2. Lead generation** | Capture inquiries for team to work | Richer inquiry form; track UX; lead routing/source |
| **3a. Customer portal** | Serve customer needs (workspace) | Dead customer-dashboard; files tab; onboarding; settings persistence |
| **3b. Partner portal** | Serve partner business | Commission detail; pipeline alignment; training/resources; API key; deep-links |
| **4. Internal team** | Full org works together | Deep-links; lead→opportunity; gates; commissions; team; audit; mail; ERP; AI context; customer/partner context |
| **5. Cross-cutting** | One platform, roles, quality | Role clarity; errors/empty/loading; audit; in-app help |

Use this list to prioritize backlog: fix missing items that block “serve customer needs,” “serve partner business,” or “full organization working together.”
