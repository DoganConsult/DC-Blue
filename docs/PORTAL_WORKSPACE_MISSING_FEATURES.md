# Missing Features — Partner Portal, Customer Portal & Workspace

Quick reference for what’s **missing or incomplete** in each portal.  
See [MISSING_AND_FEATURES_BY_SECTION.md](./MISSING_AND_FEATURES_BY_SECTION.md) for full context.

---

## 1. Customer portal & workspace (`/workspace`)

**Shared experience:** Both **customers** and **partners** (and admin) use the **same** `/workspace` (Client Workspace). It’s fully wired to `/api/v1/client/*` and DB.

| Area | Missing / gaps |
|------|----------------|
| **Customer dashboard page** | `CustomerDashboardPage` exists and uses `CustomerApiService` (`/api/v1/customer/*`) but is **not routed**. `/dashboard` redirects to `/workspace`. Either remove the dead page or give it a route and clear purpose (e.g. summary-only). |
| **Files / Documents tab** | Backend has `GET /api/v1/client/files`; workspace has **no Files/Documents tab**. Files are only used in inquiry detail (if you add inquiry detail view). Add a **Documents** tab or surface files in one place. |
| **Notifications in workspace** | API exists (`getNotifications`, `markNotificationRead`, `markAllNotificationsRead`). Workspace **does not show a notifications dropdown/badge** in the header; no clear “mark read” UX. |
| **Settings persistence** | Settings tab uses `localStorage` for profile; MFA calls `/api/v1/public/auth/toggle-mfa`. **Profile edit** (name, email, password, language, theme) may not be persisted via API — confirm and add PATCH profile endpoint if needed. |
| **First-time onboarding** | No “getting started” or guided tour when a customer first lands in workspace. |
| **Mobile / responsive** | Tabs and tables may need tuning for small screens (overflow, touch targets). |
| **Inquiry detail view** | Inquiries tab lists rows; no drill-down to **inquiry detail** (activities, files). Backend has `GET /client/inquiries/:id`. Add route or modal for inquiry detail. |

---

## 2. Partner portal (`/partner`, `/partner/register`, `/partner/submit`)

**Auth:** API key (stored as `dc_partner_key`). Partner API: `/api/v1/partners/*`.

| Area | Missing / gaps |
|------|----------------|
| **Tab deep-links** | Partner dashboard **reads** `?tab=...` from URL (e.g. from notification links) but **does not write** it when user switches tabs. So `/partner?tab=messages` works if opened directly, but changing tab doesn’t update the URL (unlike workspace). Add URL sync on tab change (like workspace `setTab()`). |
| **Commission detail & payouts** | Commissions tab shows list/summary; **status, history, and “request payout”** (if desired) may be incomplete. Confirm backend supports payout request and that partner sees status (e.g. pending/approved/paid). |
| **Pipeline alignment** | Partner pipeline vs internal gate pipeline: ensure partner sees **their** opportunities and stages in a consistent way with admin view. |
| **Training / Resources** | Training and Resources components exist; **content** and **access control** (who sees what by tier) may be incomplete. |
| **Partner onboarding flow** | Onboarding component exists; flow from **registration → approved → first login** and “what to do next” could be clearer. |
| **API key management & docs** | No clear **API key** display/rotate in partner portal; no in-portal **API docs** for partners who integrate (e.g. submit lead via API). |
| **SLA visibility** | Partner SLA component exists; ensure it reflects **real SLA rules and targets** from backend (not static copy). |
| **Single login model** | Partner uses **API key** only (no JWT from main login). Customers use **JWT** (`dc_user_token`). A partner who also has a portal user account gets workspace at `/workspace` but partner dashboard at `/partner` with API key. Consider unified login or clear messaging. |

---

## 3. Workspace only (shared customer/partner)

| Area | Missing / gaps |
|------|----------------|
| **Role-specific content** | Workspace shows same tabs to customer and partner. If some tabs (e.g. Pipeline, Contracts) are irrelevant to one role, consider hiding or tailoring (or keep as-is if both should see same set). |
| **Export / reports** | Pipeline export (CSV) exists. **Inquiries export**, **contracts/projects summary export** may be missing or partial. |
| **Help / support** | No in-app **help** or “contact support” link from workspace (or partner dashboard). |

---

## 4. Summary table

| Portal | Main gaps |
|--------|-----------|
| **Customer / Workspace** | Dead customer-dashboard page; no Files tab; notifications not in header; settings persistence; onboarding; inquiry detail; mobile. |
| **Partner** | Tab URL sync on change; commission detail/payout; pipeline alignment; training/resources content; onboarding flow; API key + docs; SLA from backend. |
| **Shared** | Role-specific tailoring (optional); more exports; in-app help. |

---

## 5. Backend vs frontend

- **Workspace** → **Client API** (`/api/v1/client/*`) — implemented and used by all workspace tabs.
- **Partner dashboard** → **Partner API** (`/api/v1/partners/*`) — implemented; auth is API key.
- **Customer dashboard (unused)** → **Customer API** (`/api/v1/customer/stats`, `inquiries`, `export`) — backend may exist; frontend page is not in routes.

Use this list to prioritize: fix items that block “serve customer needs” or “serve partner business” first.
