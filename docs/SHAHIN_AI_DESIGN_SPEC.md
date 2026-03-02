# Shahin-AI.com Design Spec (Fetched)

Design captured from **https://shahin-ai.com** for reproduction in DoganConsult Angular apps.  
Source: live site crawl (Playwright) — screenshot: `/tmp/shahin-ai-design/shahin-ai-fullpage.png`, spec: `design-spec.json`.

---

## 1. Brand & product

- **Title:** Shahin-AI by Dr. Dogan — The KSA GRC Painkiller | Dogan Consult  
- **Hero headline:** AGRC-OS (with circular golden bird logo)  
- **RTL:** Arabic-first; language toggle EN/AR in nav.

---

## 2. Typography

| Element   | Font stack | Size  | Color (hex) |
|----------|------------|------|-------------|
| Body     | "IBM Plex Sans Arabic", Tajawal, Cairo, "Noto Sans Arabic", "IBM Plex Sans", sans-serif | 16px | #525252 |
| H1 (hero)| (same)     | 64px | #ffffff     |
| H2       | (same)     | —    | #0f172a / #161616 |

- Use **IBM Plex Sans** + **IBM Plex Sans Arabic** (or Tajawal/Cairo) for EN/AR.

---

## 3. Colors

### Body & surfaces

- **Page background:** `#f4f4f4` (rgb(244, 244, 244))  
- **Body text:** `#525252` (rgb(82, 82, 82))  
- **Card/panel:** white or very light gray.

### PrimeNG / CSS variables (from live site)

- `--primary-color`: **#3B82F6**  
- `--primary-color-text`: **#ffffff**  
- `--text-color`: **#4b5563**  
- `--text-color-secondary`: **#6b7280**  
- `--surface-a` … `--surface-900`: PrimeNG Lara-style surface scale (white → #111827).  
- `--gray-50` … `--gray-600`: Tailwind-like grays.

### Semantic

- **Primary blue:** #3B82F6 (CTAs, links, nav active).  
- **Success / CTA green:** bright green for “Analyze”, “Start”, “Continue”.  
- **Gold:** in logo/brand mark.  
- **Purple/violet:** progress and secondary accents.

---

## 4. Section structure (landing)

| # | Section ID      | Class           | Heading (AR sample) |
|---|-----------------|-----------------|----------------------|
| 0 | —               | hero            | AGRC-OS              |
| 1 | stats           | stats-section   | —                    |
| 2 | value-map       | vm              | كيف يعمل Shahin-AI؟  |
| 3 | solutions       | sol-section     | 47 خدمة مدمجة...     |
| 4 | features        | feat-section    | لوحة التحكم — معاينة مباشرة |
| 5 | ksa-features    | ksa-section     | مصمم للمملكة العربية السعودية |
| 6 | ai-agents       | agents-section  | الفريق المستقل — 10 وكلاء |
| 7 | engine-console  | ec-section      | المحرك المستقل يعمل الآن |
| 8 | trust-compliance| trust-section   | التغطية التنظيمية السعودية |
| 9 | how-it-works    | hiw-section     | إقلاع → تهيئة → تشغيل مستقل |
| 10| cta             | cta-section     | حوكمتك تعمل بنفسها — ابدأ الآن |

---

## 5. UI patterns

- **Nav:** Dark blue bar; logo “AGRC-OS”; icons (search, notifications, help, profile); language toggle **EN/AR**.  
- **Hero:** Full-width blue block; large white “AGRC-OS”; golden bird logo; supporting copy EN/AR.  
- **Stat cards:** Multiple KPI cards with numbers and short labels (e.g. 58, +131, +12,488).  
- **Radar chart:** Hexagonal compliance/risk view with scores.  
- **Analysis bar:** Dark blue strip; right-aligned Arabic input + green “تحليل” (Analyze) button.  
- **Onboarding/form:** White cards; structured fields (dropdowns, no free text); icons (shield, cloud, DB).  
- **Dashboard preview:** Embedded mini-dashboard (charts, KPIs).  
- **Regulatory cards:** NCA-ECC, SAMA-CSF, PDPL with status and “Select” / “Activate”.  
- **Feature/agent cards:** Dark blue section; three large cards (icon + title + description).  
- **Pricing:** Three tiers; “طلب عرض” (Request offer); e.g. “750 ريال”.  
- **Footer:** Dark blue; Legal, Privacy, Terms, Contact; social icons.  
- **CTA:** Green “ابدأ تجربتك المجانية” (Start your free trial).

---

## 6. Reproduction checklist

- [ ] Set body background to `#f4f4f4`, text to `#525252`.  
- [ ] Set primary to `#3B82F6`; primary text to white.  
- [ ] Use IBM Plex Sans + IBM Plex Sans Arabic (or Tajawal/Cairo) for EN/AR.  
- [ ] Hero: full-width blue block; H1 64px white; gold logo.  
- [ ] Nav: dark blue; logo; EN/AR toggle.  
- [ ] Cards: white, rounded corners, light shadow.  
- [ ] Primary buttons: blue; secondary: outline; success/CTA: green.  
- [ ] Sections: hero → stats → value-map → solutions → features → KSA → agents → engine → trust → how-it-works → cta.  
- [ ] RTL support and Arabic labels for all key sections.

---

## 7. Tokens for this repo

Use the **Shahin-AI theme** in `frontend/src/styles/themes/_theme-shahin-ai.scss`. Select it via:

- **Theme picker:** choose "Shahin-AI" in the app (if your UI exposes theme switching).
- **HTML:** set `data-theme="shahin-ai"` on `<html>` (e.g. in `index.html` or via `ThemeService.setTheme('shahin-ai')`).

Tailwind and design-system tokens already reference CSS variables (`--color-primary`, `--bg-primary`, etc.), so the Shahin-AI theme file overrides those to match shahin-ai.com. Page background is set to `#f4f4f4` when this theme is active.

---

## 8. Captured artifacts (ephemeral)

- **Screenshot:** `/tmp/shahin-ai-design/shahin-ai-fullpage.png` (full-page capture).  
- **Spec JSON:** `/tmp/shahin-ai-design/design-spec.json` (colors, sections, nav, CSS vars).  

Re-run the Playwright script in `/tmp/shahin-ai-fetch-design.js` (from the playwright skill) to refresh the capture.
