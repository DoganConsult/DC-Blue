# Platform Pages & Centralized Theme System

## 1. How many pages does the platform app have?

**By route (user-visible URLs):** **24 routes**

| # | Path | Component | Guard |
|---|------|-----------|--------|
| 1 | `/` | LandingPage | — |
| 2 | `/services` | ServicesPage | — |
| 3 | `/about` | AboutPage | — |
| 4 | `/case-studies` | CaseStudiesPage | — |
| 5 | `/insights` | InsightsPage | — |
| 6 | `/register` | RegisterPage | — |
| 7 | `/login` | LoginPage | — |
| 8 | `/change-password` | ChangePasswordPage | — |
| 9 | `/forgot-password` | ForgotPasswordPage | — |
| 10 | `/reset-password` | ResetPasswordPage | — |
| 11 | `/inquiry` | InquiryPage | — |
| 12 | `/thanks` | ThanksPage | — |
| 13 | `/track` | TrackPage | — |
| 14 | `/privacy` | LegalPage (data: privacy) | — |
| 15 | `/terms` | LegalPage (data: terms) | — |
| 16 | `/pdpl` | LegalPage (data: pdpl) | — |
| 17 | `/cookies` | LegalPage (data: cookies) | — |
| 18 | `/workspace` | ClientWorkspacePage | authGuard |
| 19 | `/partner` | PartnerDashboardPage | authGuard |
| 20 | `/partner/register` | PartnerRegisterPage | — |
| 21 | `/partner/submit` | PartnerSubmitPage | authGuard |
| 22 | `/admin` | AdminDashboardPage | authGuard |
| 23 | `/admin/leads/:id` | AdminLeadDetailPage | authGuard |
| 24 | `/not-found` or `**` | NotFoundPage | — |

**By unique page component:** **20 page components** (LegalPage serves 4 routes; `/dashboard` redirects to `/workspace`).

All of these are under the **single AppShell** (nav + main + footer).

---

## 2. Centralized theme system — how it’s set up

The app already has a **centralized theme system**. Summary:

### 2.1 Single source of truth

| Layer | Location | Role |
|-------|----------|------|
| **Design tokens (semantic)** | `src/styles/themes/_theme-variables.scss` | Defines **semantic** variables (`--color-primary`, `--bg-primary`, `--text-primary`, buttons, cards, nav, inputs, etc.) that **all** components use. No raw hex in components. |
| **Theme definitions (concrete colors)** | `src/styles/themes/_carbon-*.scss`, `_trust-blueprint.scss`, etc. | Each file sets **concrete** `--theme-*` values for one theme, scoped by `[data-theme="..."]`. |
| **Tailwind integration** | `tailwind.config.js` | Extends `theme.extend.colors` (and fonts, radius, shadow, zIndex) to use those CSS variables (e.g. `primary: 'var(--color-primary, #0f62fe)'`, `th-bg`, `th-text`, etc.). |
| **Global styles & base/component rules** | `src/styles.scss` | Imports theme SCSS, defines `:root` typography/spacing/duration/z-index, and theme-aware `@layer base` / `@layer components` (form controls, tables, `.theme-card`, `.theme-btn-primary`, etc.). |
| **Runtime theme switch** | `ThemeService` + `index.html` | Service sets `data-theme` on `<html>`; `index.html` restores `preferred-theme` from localStorage before bootstrap. |

### 2.2 Flow

1. **HTML:** `<html data-theme="carbon-g10">` (or value from localStorage).
2. **SCSS:** Only the matching `[data-theme="carbon-g10"] { ... }` block sets `--theme-primary`, `--theme-foundation-light`, etc.
3. **theme-variables.scss:** Maps those to semantic tokens, e.g. `--color-primary: var(--theme-primary);`, `--bg-primary: var(--color-foundation-light);`.
4. **Tailwind / components:** Use `var(--color-primary)` or Tailwind classes like `bg-primary`, `th-bg`, `text-th-text`, so **all pages** get the same look without per-page theme logic.

### 2.3 How to use it (keep it centralized)

- **In templates:** Prefer Tailwind classes that reference the design tokens:
  - Backgrounds: `th-bg`, `th-bg-alt`, `th-card`, `surface-dark`, `bg-primary`
  - Text: `th-text`, `th-text-2`, `th-text-3`, `text-primary`
  - Borders: `th-border`, `th-border-lt`
  - Buttons: `theme-btn-primary`, `theme-btn-secondary` or Tailwind + token colors
- **In component SCSS:** Use CSS variables, e.g. `background: var(--bg-primary);`, `color: var(--text-primary);`.
- **Adding a new theme:**  
  1. Add a new file, e.g. `_my-theme.scss`, with `[data-theme="my-theme"] { --theme-primary: ...; ... }`.  
  2. Import it in `styles.scss`.  
  3. Add the theme to `ThemeService.themes` and to the `allowed` list in `index.html` script.  
  4. No changes needed in individual pages.

### 2.4 Optional: single “theme registry” file

To make the list of themes and their CSS files even more central:

- **Option A:** Keep as today — themes in `ThemeService.themes` and SCSS imports in `styles.scss`.
- **Option B:** Add a small **theme registry** (e.g. `src/app/core/design-system/theme-registry.ts`) that exports:
  - `THEME_IDS: string[]`
  - `DEFAULT_THEME_ID: string`
  and have `ThemeService` and the `index.html` allowlist both read from it so the list of themes exists in one place. SCSS imports still live in `styles.scss` because Angular/SCSS doesn’t support dynamic theme loading by ID from TS.

---

## 3. Quick reference — key files

| Purpose | File |
|--------|------|
| Route definitions (all under AppShell) | `frontend/src/app/app.routes.ts` |
| Semantic design tokens | `frontend/src/styles/themes/_theme-variables.scss` |
| Theme SCSS (Carbon + legacy) | `frontend/src/styles/themes/_carbon-*.scss`, `_trust-blueprint.scss`, etc. |
| Global styles + base/component theme rules | `frontend/src/styles.scss` |
| Tailwind theme extension (colors, etc.) | `frontend/tailwind.config.js` |
| Runtime theme switch + persistence | `frontend/src/app/core/services/theme.service.ts` |
| Theme restore on load | `frontend/src/index.html` (script + `data-theme`) |
| UI to change theme | `frontend/src/app/components/theme-switcher.component.ts` (if used in nav/settings) |

Using only these layers keeps the theme system centralized: add new themes via new SCSS + ThemeService (and index allowlist), and all 20 pages pick them up automatically.
