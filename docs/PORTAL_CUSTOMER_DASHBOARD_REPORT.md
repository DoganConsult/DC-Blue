# Portal Customer Dashboard — Report

**Date:** 2025-03-03  
**Scope:** Frontend portal customer dashboard structure, routing, theme tokens (props), and identified problems.

---

## 1. What Exists Today

### 1.1 Two “customer” surfaces

| Item | Location | Purpose |
|------|----------|---------|
| **CustomerDashboardPage** | `frontend/src/app/pages/dashboard/customer-dashboard.page.ts` | Standalone customer portal: stats, inquiries table, quick actions, account sidebar, MFA toggle, CSV export. |
| **ClientWorkspacePage** | `frontend/src/app/pages/workspace/client-workspace.page.ts` | Tabbed workspace: Overview, Pipeline, Inquiries, Tenders, Demos, Projects, Contracts, Messages, Settings. |

### 1.2 Routing (app.routes.ts)

- `path: 'dashboard'` → **redirects to** `workspace` (no component load for dashboard).
- `path: 'workspace'` → loads **ClientWorkspacePage**, `canActivate: [authGuard]`, `roles: ['customer', 'partner', 'admin']`.

**Result:** **CustomerDashboardPage is never used.** Customers always see the workspace, not the standalone customer dashboard.

---

## 2. Theme Tokens (Dashboard “Props”)

All portal dashboards use the same Tailwind theme tokens (backed by CSS variables in the design system).

### 2.1 Tailwind config (tailwind.config.js)

| Token | CSS variable | Typical use |
|-------|----------------|-------------|
| `th-bg` | `--bg-primary` | Main page background |
| `th-bg-alt` | `--bg-secondary` | Alternate sections |
| `th-bg-tert` | `--bg-tertiary` | Inputs, tab bg |
| `th-card` | `--card-bg` | Cards, nav, modals |
| `th-text` | `--text-primary` | Primary text |
| `th-text-2` | `--text-secondary` | Secondary text |
| `th-text-3` | `--text-muted` | Muted text |
| `th-border` | `--border-default` | Borders |
| `th-border-lt` | `--border-light` | Light borders |
| `th-border-dk` | `--border-dark` | Dark borders |
| `primary` | `--color-primary` | Brand/primary actions |

### 2.2 Usage by dashboard

- **CustomerDashboardPage (unused):** `bg-th-bg-alt`, `bg-th-card`, `text-th-text`, `text-th-text-3`, `border-th-border`, `border-th-border-lt`.
- **ClientWorkspacePage:** `bg-th-bg`, `bg-th-card`, `text-th-text`, `text-th-text-3`, `border-th-border`.
- **PartnerDashboardPage:** `bg-th-bg-alt`, same token set.
- **AdminDashboardPage:** `bg-th-bg`, `bg-th-card`, `th-bg-tert`, `th-border-dk`, `text-gold` for accent.

No missing or wrong “props” were found; tokens are consistent. Only difference is customer dashboard uses `th-bg-alt` vs workspace `th-bg` for the main container.

---

## 3. API Usage

| Page | Service | Endpoints |
|------|---------|-----------|
| **CustomerDashboardPage** | CustomerApiService | `GET /api/v1/customer/stats`, `GET /api/v1/customer/inquiries`, `GET /api/v1/customer/export/inquiries`, `POST /api/v1/public/auth/toggle-mfa` |
| **Workspace (Overview)** | ClientApiService | `GET /api/v1/client/dashboard` |

So there are two different backend surfaces for “customer” data: **customer** (stats/inquiries) vs **client** (dashboard aggregate). If both UIs are kept, backend must support both.

---

## 4. Problems Identified

### 4.1 Critical: Customer dashboard is dead code

- **CustomerDashboardPage** is never mounted: no route points to it.
- `/dashboard` redirects to `/workspace`, so users never see the standalone customer dashboard.

**Recommendation:** Either:

- Add a route that loads **CustomerDashboardPage** (e.g. `path: 'portal'` or `path: 'customer-dashboard'`), and decide when to send customers to workspace vs this page, or  
- Remove **CustomerDashboardPage** (and optionally fold any unique behavior into workspace) to avoid duplicate UIs and confusion.

### 4.2 Duplicate “customer” experience

- One flow: inquiries, stats, account, MFA (CustomerDashboardPage).
- Other flow: workspace with Overview (client dashboard), Inquiries tab, Settings, etc.

Having two different “customer home” UIs can confuse which is the single place for customers to land.

### 4.3 Minor: Inconsistent main background

- Customer dashboard: `min-h-screen bg-th-bg-alt`
- Workspace: `min-h-screen bg-th-bg`

If both are kept and should feel the same, align to one token (e.g. both `th-bg` or both `th-bg-alt`).

### 4.4 Backend alignment

- **CustomerApiService** and **ClientApiService** hit different APIs. Ensure backend implements and maintains both if both UIs stay, or consolidate to one API and one UI.

---

## 5. Summary Table

| Issue | Severity | Action |
|-------|----------|--------|
| CustomerDashboardPage not routed | High | Add route or remove component |
| Two customer home UIs (dashboard vs workspace) | Medium | Choose one primary entry and document |
| Different APIs (customer vs client) | Medium | Align backend and frontend to one story |
| th-bg vs th-bg-alt on main container | Low | Optional: unify for consistency |

---

## 6. Files Referenced

- `frontend/src/app/app.routes.ts` — routing
- `frontend/src/app/pages/dashboard/customer-dashboard.page.ts` — standalone customer dashboard (unused)
- `frontend/src/app/pages/workspace/client-workspace.page.ts` — workspace (actual customer portal)
- `frontend/src/app/pages/workspace/components/workspace-overview.component.ts` — workspace overview (uses ClientApiService)
- `frontend/src/app/core/services/customer-api.service.ts` — customer stats/inquiries API
- `frontend/src/app/core/services/client-api.service.ts` — client dashboard API
- `frontend/tailwind.config.js` — theme tokens (th-*, primary, etc.)
