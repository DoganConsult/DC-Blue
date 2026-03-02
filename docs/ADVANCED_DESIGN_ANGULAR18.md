# Advanced Design for Angular 18+

This document lists the **smartest advanced design options** for Angular 18+ and how this project uses them.

---

## 1. Recommended options (download / use)

### Free & open source

| Option | Description | Download / link |
|--------|-------------|------------------|
| **Sakai** | PrimeNG’s free Angular admin template. Multiple themes (PrimeOne, Bootstrap, Material), light/dark, static & overlay menus, PrimeFlex + PrimeIcons. | [Live](https://sakai.primeng.org/) · [GitHub](https://github.com/primefaces/sakai-ng) `git clone https://github.com/primefaces/sakai-ng` |
| **Apollo** | Free PrimeNG application template. | [v18 templates](https://v18.primeng.org/templates/apollo) |
| **PrimeNG Blocks** | Free block-based UI (sections, forms, dashboards) for PrimeNG. | [Blocks](https://v18.primeng.org/blocks) |

### Premium (advanced layouts & support)

| Option | Description | Link |
|--------|-------------|------|
| **Ultima** | Most advanced PrimeNG template: 13 themes, 7 menu modes, 4 menu types, Figma, SASS. | [Ultima](https://v18.primeng.org/templates/ultima) |
| **Atlantis** | Premium dashboard template. | [Templates](https://v18.primeng.org/templates) |
| **Sakai Pro** | Extended Sakai with more layouts and support. | [PrimeStore](https://www.primefaces.org/store/) |

### Other stacks (Angular 18+)

| Option | Description |
|--------|-------------|
| **Admira** | Angular 18+ with Angular Material 3, multiple layouts, RTL, 7 color variants. |
| **Mantis / TailAdmin / Datta Able** | Angular 18 admin templates (see npm / theme vendors). |

---

## 2. What this project uses (design stack)

- **PrimeNG 18** – UI components (Chart, and more as you add them).
- **PrimeIcons 7** – Icon set (e.g. `pi pi-chart-line`, `pi-user`). Loaded in `angular.json` → `primeicons.css`.
- **PrimeFlex 3** – Flex/grid/spacing utilities. Add to global styles if you use it:  
  `@import 'primeflex/primeflex.css';` in `src/styles.scss` (or use PrimeNG’s preset which may include it).
- **@primeng/themes 18** – Theme presets (e.g. Lara). Optional: configure `providePrimeNG({ theme: { preset: ... } })` in `app.config.ts` for a single preset.
- **Tailwind 3** – Utility-first CSS for custom layout and one-off styling.
- **ECharts 6 + ngx-echarts** – Advanced charts; `ChartFactoryService` + widget registry for dynamic charts.

For a **single, consistent “advanced” design** in this repo:

1. Use **PrimeNG components** (Button, Card, InputText, etc.) for all standard UI.
2. Use **PrimeIcons** for all icons (no inline SVGs for standard actions).
3. Use **one PrimeNG theme preset** (e.g. Lara) via `providePrimeNG` and avoid mixing random Tailwind colors for buttons/inputs.
4. Use **design-system tokens** in `core/design-system/` (e.g. `buttonClasses`, `theme-*`) for custom elements so they match the theme.

---

## 3. Quick start: use Sakai as reference or base

To **download and run** the free advanced Angular 18 admin template:

```bash
git clone https://github.com/primefaces/sakai-ng.git
cd sakai-ng
npm install
npm start
```

You can copy layout components, menu structure, and theme setup from Sakai into this project instead of adopting the full template.

---

## 4. Enabling PrimeNG theme (Lara) in this project

To turn on a single, consistent PrimeNG theme (e.g. Lara) in `app.config.ts`:

1. Ensure `providePrimeNG` is available from `primeng/config`.
2. If using `@primeng/themes`, import the Lara preset and pass it as the theme.

Example (exact API may depend on your PrimeNG/themes version):

```ts
// app.config.ts
import { providePrimeNG } from 'primeng/config';
// If using @primeng/themes (deprecated but still works):
// import Aura from '@primeng/themes/lara';
// Then: providePrimeNG({ theme: { preset: Aura } })
```

After that, use PrimeNG components (e.g. `p-button`, `p-card`) so the advanced design is applied consistently.

---

## 5. Advanced widgets — same “catch” for easy UX

To keep **all advanced widgets** (charts, stat cards, KPI panels) with the **same look and one data source**:

1. **Card shape**  
   Use the shared class on every widget container (chart panel, stat card, etc.):
   - Global: `advanced-widget-card` (in `styles.scss`).
   - Design system: `ADVANCED_WIDGET_CARD_CLASS` or `ADVANCED_WIDGET_CARD_CLASSES` from `core/design-system` (see `widgets.ts`).

2. **Registry**  
   Use `WidgetRegistryService` for a single list of widgets:
   - `getRegistry()` — all entries (charts from `ChartFactoryService`).
   - `getById(id)` — one widget by id.
   - `list(filter)` — filter by category, engine, type, search.
   - `listCharts(engine)` — chart widgets only (optionally by `chartjs` or `echarts`).

3. **Usage**  
   - Wrap any chart or stat block in a div (or `p-card`) with class `advanced-widget-card`.
   - Inject `WidgetRegistryService` when building dynamic dashboards or config-driven widget lists.

This gives one consistent shape and one registry so the user experience stays simple and uniform.

---

## 6. Built-in theme colors and buttons

Yes — the Angular app has **built-in theme colors, surfaces, and button styles** in one place.

### Theme colors (design-system tokens)

Import from `@app/core/design-system`:

- **THEME_BG** — Tailwind classes for backgrounds: `THEME_BG.primary` → `bg-th-bg`, `THEME_BG.card` → `bg-th-card`, etc.
- **THEME_TEXT** — Text: `THEME_TEXT.primary` → `text-th-text`, `THEME_TEXT.muted` → `text-th-text-3`.
- **THEME_BORDER** — Borders: `THEME_BORDER.default` → `border-th-border`.
- **THEME_SEMANTIC** — Brand/semantic: `THEME_SEMANTIC.primary`, `THEME_SEMANTIC.gold`, `THEME_SEMANTIC.success`, etc.
- **THEME_CSS_VARS** — Raw CSS variable names for `[style.color]` or custom CSS: `THEME_CSS_VARS.primary` → `var(--color-primary)`.

Use in templates:

```html
<div [class]="THEME_BG.card" class="rounded-xl p-4">...</div>
<span [class]="THEME_TEXT.muted">Caption</span>
<button [class]="THEME_BUTTON_CLASSES.primary">Save</button>
```

### Button styles

Two ways to get consistent buttons:

1. **Global CSS classes** (from `styles.scss`):
   - `theme-btn-primary` — primary CTA (uses `--button-primary-bg`, `--button-primary-text`).
   - `theme-btn-secondary` — outline style (uses `--color-primary`).

2. **Design-system constants** (from `core/design-system`):
   - **THEME_BUTTON_CLASSES.primary** → `'theme-btn-primary'`.
   - **THEME_BUTTON_CLASSES.secondary** → `'theme-btn-secondary'`.
   - **THEME_BUTTON_CLASSES.primaryTailwind** / **secondaryTailwind** — full Tailwind class strings (theme-aware).

3. **Tailwind variants** (from `buttonClasses`):
   - `buttonClasses.base` + `buttonClasses.variants.primary` + `buttonClasses.sizes.md` for a primary button.
   - Or use PrimeNG `<p-button>` for the fullest theme integration.

All of these use the same design tokens (`--color-primary`, `--button-primary-bg`, `th-*` in Tailwind), so the app has built-in theme colors and buttons in one system.

---

## 7. UI components, style, icons, buttons, shell & containers

Single reference for **component design**, **icons**, **buttons**, and **shell/container** layout.

### UI component design and style

- **Cards:** Use `theme-card` (global) or `advanced-widget-card` for charts/KPI panels. Both use `--card-bg`, `--card-border`, `--card-shadow` so they follow the active theme.
- **Inputs:** Use `theme-input` for custom inputs, or PrimeNG `p-inputText` / `p-inputNumber` for full theme integration.
- **Sections:** Use `theme-section` (default background) or `theme-section-alt` (alternate) for full-width blocks. Add `SECTION_PADDING_CLASS` from the design system for vertical rhythm.
- **Spacing:** Prefer the 8px grid from `SPACING` in `core/design-system/tokens/spacing.ts` (e.g. `SPACING.layout.containerPadding`, `SPACING.layout.sectionSpacing`). In Tailwind, use `p-4`, `p-6`, `gap-4`, etc. consistently.
- **Borders:** Use `border-th-border` or `THEME_BORDER.default` so borders respect light/dark and theme.

### Icon system

- **Standard:** **PrimeIcons** only (`pi pi-*`). Loaded via `primeicons.css` in `angular.json`. Do not use inline SVGs for standard actions (edit, delete, save, etc.).
- **Design-system helpers** (from `core/design-system/components/icons.ts`):
  - **ICONS** — recommended PrimeIcons for actions (e.g. `ICONS.check`, `ICONS.edit`, `ICONS.delete`), navigation, status, and GRC (building, shield, etc.).
  - **ICON_SIZES** — Tailwind classes: `xs`, `sm`, `md`, `lg`, `xl` (e.g. `ICON_SIZES.sm` → `w-4 h-4 text-base`).
  - **ICON_COLORS** — semantic: `default`, `primary`, `success`, `warning`, `error`, `muted`.
  - **iconClass(icon, size?, color?)** — returns a single string: icon + size + color.
- **Usage:** `<span [ngClass]="ICONS.check + ' ' + ICON_SIZES.md"></span>` or `[ngClass]="iconClass('check', 'md', 'primary')"`.

### Buttons

- **Primary CTA:** `theme-btn-primary` or `THEME_BUTTON_CLASSES.primary` (or PrimeNG `p-button` with severity="primary").
- **Secondary / outline:** `theme-btn-secondary` or `THEME_BUTTON_CLASSES.secondary`.
- **Sizes/variants:** Use `buttonClasses.base` + `buttonClasses.variants.*` + `buttonClasses.sizes.*` from `core/design-system/components/buttons.ts` when building custom buttons with Tailwind only.
- **When to use which:** Prefer PrimeNG `<p-button>` for forms and dialogs; use `theme-btn-primary` / `theme-btn-secondary` for landing and custom layouts so everything stays on the same tokens.

### Shell and container design

- **App shell** (`app-shell`): Top = `app-nav-section` (fixed, h-[60px]). Main = content area with `SHELL_MAIN_CLASS` → `min-h-[calc(100vh-60px)]`. Footer = `app-footer-section`. No sidebar by default; add one in the shell template if needed.
- **Content width:** Use one of:
  - **CONTAINER_CLASS** — `container mx-auto px-4 sm:px-6 lg:px-8` (responsive max-width from `styles.scss`).
  - **CONTAINER_NARROW_CLASS** — `max-w-2xl mx-auto px-4 sm:px-6` for forms, articles.
  - **CONTAINER_WIDE_CLASS** — `max-w-[1600px] mx-auto ...` for dashboards/tables.
- **Section wrapper:** For landing/dashboard sections use:
  - **PAGE_SECTION_CLASSES** — full width + vertical padding + `theme-section`.
  - **PAGE_SECTION_CONTAINER_CLASS** — same as `CONTAINER_CLASS` for the inner content.
- **Constants** (from `core/design-system/components/shell-containers.ts`): `SHELL`, `CONTAINER_MAX_WIDTH`, `SECTION_PADDING_CLASS`, `SECTION_FULL_CLASS`, `SECTION_ALT_CLASS`.

Example:

```html
<main [class]="SHELL_MAIN_CLASS">
  <section [class]="PAGE_SECTION_CLASSES">
    <div [class]="PAGE_SECTION_CONTAINER_CLASS">
      <!-- content -->
    </div>
  </section>
</main>
```

---

## 9. Current system vs enterprise — full-place recommendation

Comparison of **what exists today** vs a **full enterprise-grade, smooth, clean, modern** spacing and layout standard, and the recommended single place to get it.

### What the system has now

| Area | Current state |
|------|----------------|
| **Spacing** | `SPACING` (8px grid, layout.containerPadding, sectionSpacing) in tokens; `--spacing-*` in `_theme-variables.scss`; sections use mixed `py-12 sm:py-16 lg:py-20`, `px-4 sm:px-6 lg:px-8`, or ad‑hoc `px-6 lg:px-8`, `pt-32 pb-24`. |
| **Containers** | `CONTAINER_CLASS`, `PAGE_SECTION_*` in shell-containers; global `.container` in styles.scss with responsive max-width; some sections use raw `container mx-auto px-6 lg:px-8`. |
| **Cards** | `theme-card`, `advanced-widget-card`; padding varies (e.g. `p-4`, `p-6`, `1.25rem 1.5rem`). |
| **Transitions** | `--transition-fast/base/slow` in theme; no single canonical class set. |
| **Radius** | `--radius-*` in theme; Tailwind `rounded-lg`, `rounded-xl` used inconsistently. |
| **Gaps** | Mix of `gap-2`, `gap-4`, `gap-6`, `space-y-*` without one canonical scale. |

So: tokens and variables exist, but **there is no single “enterprise” spacing/layout layer** used everywhere, and section/container/card spacing is not fully unified.

### Enterprise recommendation (smooth, clean, modern)

Use the **enterprise layout tokens** as the **one place** for all spacing, section rhythm, container inset, and component spacing. That gives a full-place, enterprise-grade, smooth, clean, modern feel.

| Need | Use (from `core/design-system/tokens/enterprise-layout.ts`) |
|------|-------------------------------------------------------------|
| **Section vertical rhythm** | `ENTERPRISE_SECTION.padding` (default), `paddingLg` (hero/CTA), `paddingSm` (dense). |
| **Container horizontal inset** | `ENTERPRISE_CONTAINER_INSET.default` (pages), `narrow` (forms), `wide` (marketing). |
| **Gap between elements (flex/grid)** | `ENTERPRISE_SPACING.gapMd`, `gapLg`, `gapXl`, etc. (4px → 24px scale). |
| **Vertical stack** | `ENTERPRISE_SPACING.stackMd`, `stackLg`, `stackXl`, etc. |
| **Card padding** | `ENTERPRISE_COMPONENT.cardPadding` or `cardPaddingSm`. |
| **Form group / button group** | `ENTERPRISE_COMPONENT.formGroupGap`, `buttonGroupGap`. |
| **Border radius** | `ENTERPRISE_RADIUS.card`, `button`, `input`, `badge`. |
| **Transitions** | `ENTERPRISE_TRANSITION.base` (default), `fast`, `slow`. |
| **Full page section** | `ENTERPRISE_PAGE_SECTION.wrapper` + `container` (or `containerNarrow` / `containerWide`). |
| **Main + card layout** | `ENTERPRISE_LAYOUT.main`, `ENTERPRISE_LAYOUT.card`, `stack`, `buttonGroup`. |

### Recommended usage (one place, enterprise smooth)

1. **Landing / marketing sections**  
   Section: `ENTERPRISE_PAGE_SECTION.wrapper` (or `wrapperLg` for hero).  
   Inner: `ENTERPRISE_PAGE_SECTION.container` (or `containerWide`).  
   Use `ENTERPRISE_SECTION.padding` / `paddingLg` so every section has the same vertical rhythm.

2. **Dashboards / app pages**  
   Main: `ENTERPRISE_LAYOUT.main`.  
   Content: `ENTERPRISE_PAGE_SECTION.container` or `containerWide` + `ENTERPRISE_CONTAINER_INSET.default`.  
   Between blocks: `ENTERPRISE_SPACING.stackXl` or `stack2xl`.  
   Cards: `theme-card` or `advanced-widget-card` + `ENTERPRISE_COMPONENT.cardPadding` + `ENTERPRISE_RADIUS.card`.

3. **Forms**  
   Container: `ENTERPRISE_PAGE_SECTION.containerNarrow`.  
   Field groups: `ENTERPRISE_COMPONENT.formGroupGap` (or `ENTERPRISE_SPACING.stackLg`).  
   Buttons: `ENTERPRISE_LAYOUT.buttonGroup` (uses `buttonGroupGap`).

4. **Any new component**  
   Use `ENTERPRISE_SPACING.gap*` / `stack*`, `ENTERPRISE_COMPONENT.*`, `ENTERPRISE_RADIUS.*`, `ENTERPRISE_TRANSITION.base` so the whole app stays smooth and consistent.

### Summary

- **Current:** Theme tokens, shell/container constants, and 8px spacing exist, but section/container/card spacing and gaps are not fully unified in one enterprise layer.
- **Recommendation:** Treat **enterprise-layout.ts** as the **full-place enterprise** source: use `ENTERPRISE_SECTION`, `ENTERPRISE_CONTAINER_INSET`, `ENTERPRISE_SPACING`, `ENTERPRISE_COMPONENT`, `ENTERPRISE_RADIUS`, `ENTERPRISE_TRANSITION`, and `ENTERPRISE_PAGE_SECTION` / `ENTERPRISE_LAYOUT` everywhere for a smooth, clean, modern, consistent spacing and layout.

---

## 10. Summary

- **Best free advanced design for Angular 18+:** **Sakai** (PrimeNG, MIT, [GitHub](https://github.com/primefaces/sakai-ng)).
- **Best paid advanced design:** **Ultima** (PrimeNG, most options).
- **This repo:** Use PrimeNG + PrimeIcons + one theme preset + design-system tokens for a single, advanced, consistent UI system. Use `advanced-widget-card` and `WidgetRegistryService` for all advanced widgets so they share one look and one registry. Use **THEME_BG**, **THEME_TEXT**, **THEME_BORDER**, **THEME_BUTTON_CLASSES**, and **buttonClasses** for built-in theme colors and button styles. For **icons**, use **ICONS**, **ICON_SIZES**, **ICON_COLORS**, and **iconClass()** from `components/icons.ts`. For **shell and containers**, use **SHELL_MAIN_CLASS**, **CONTAINER_CLASS**, **PAGE_SECTION_CLASSES**, and **PAGE_SECTION_CONTAINER_CLASS** from `components/shell-containers.ts`. For **enterprise-grade smooth, clean spacing and layout**, use **ENTERPRISE_SPACING**, **ENTERPRISE_SECTION**, **ENTERPRISE_CONTAINER_INSET**, **ENTERPRISE_COMPONENT**, **ENTERPRISE_RADIUS**, **ENTERPRISE_TRANSITION**, **ENTERPRISE_PAGE_SECTION**, and **ENTERPRISE_LAYOUT** from `tokens/enterprise-layout.ts` as the single source for section rhythm, container inset, gaps, card padding, and transitions.
