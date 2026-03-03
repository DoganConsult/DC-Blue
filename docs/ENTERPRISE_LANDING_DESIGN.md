# Enterprise Professional Landing Design Guide

**Purpose:** Align the marketing/landing pages with an **enterprise-professional** look — the kind consulting and B2B firms use to convey trust, authority, and clarity.

---

## 1. What “enterprise professional” means

- **Restraint** — Fewer bright gradients; solid or very subtle gradients. Navy, charcoal, white, and one accent (e.g. gold or blue) used sparingly.
- **Typography** — Clear hierarchy: one strong headline, supporting subhead, body. Sans or serif for headlines; consistent scale (no oversized decorative type).
- **Whitespace** — Generous padding and section spacing; content in a readable max-width (e.g. 1200px).
- **Trust** — Logos, certifications, “Trusted by” or “Sectors” without looking loud or salesy.
- **CTAs** — Clear but not flashy: primary action (e.g. “Request consultation”) with secondary “Learn more” or “Our services”.
- **Consistency** — Same nav pattern, same card style, same spacing system across sections.

---

## 2. Professional examples (reference)

Use these for inspiration; do not copy layout or assets.

### McKinsey (mckinsey.com)

- **Hero:** Full-width image or video with overlay; short headline + one line of support; single CTA.
- **Palette:** White/light gray backgrounds; navy or black text; blue or red as accent.
- **Sections:** Clear H2 section titles; cards or list blocks with icons; “Our capabilities” / “Industries” in grids.
- **Nav:** Minimal; logo + a few links + one CTA; often light nav that stays minimal on scroll.

### Deloitte (deloitte.com)

- **Hero:** Dark (navy/black) or light with strong headline; subhead; sometimes “Insights” or “Services” as secondary entry.
- **Palette:** Navy (#0B3B5C style), green accent, white.
- **Sections:** Overline label (e.g. “What we do”) then headline; 3–4 column cards; footer with multiple columns and clear “Careers”, “Contact”.
- **Tone:** Authoritative, clear, no playful illustrations; photography or abstract shapes.

### Accenture / Cisco (accenture.com, cisco.com)

- **Hero:** Dark background, white headline, short supporting line, one or two CTAs (e.g. “Explore” + “Contact”).
- **Palette:** Deep blue/navy, white, sometimes a bright accent (orange/blue) for CTAs only.
- **Sections:** Alternating light/dark or light/light with clear dividers; stats in a strip; “Solutions” or “Industries” in card grids.
- **Nav:** Sticky; logo + links + search + CTA; collapses to hamburger on mobile.

### Takeaway for Dogan Consult

- **Hero:** Deep navy background (not bright blue gradient); white headline; gold or white CTA; optional subtle pattern or soft gradient.
- **Sections:** Overline (e.g. “Sectors”) + H2 + short intro; cards with icon + title + short description; consistent `section-gray` or white.
- **Nav:** Clean sticky nav; logo + Services, About, Case Studies, Contact + one “Request consultation”.
- **Footer:** Dark navy; logo + columns (Services, Company, Contact); copyright and legal links.

---

## 3. Design tokens used on landing (current)

| Token / usage | Purpose |
|---------------|---------|
| `#061224` (navy) | Nav, footer, hero dark |
| `#0B1220` / `#0f172a` | Alternative deeper navy for hero (enterprise) |
| `#F4B223` (gold-accent) | Accent for CTA, highlights (use sparingly) |
| `#F6F7FB` (section-gray) | Alternate section background |
| `#1D2433` | Primary text on light |
| `#7A8090` | Muted text |
| `max-w-[1200px]` | Content width |
| `py-24 lg:py-28` | Section vertical padding |

---

## 4. Checklist for enterprise-professional sections

- [ ] Hero: solid or very subtle gradient; no loud colors.
- [ ] One clear headline + one supporting line + 1–2 CTAs.
- [ ] Section titles: small overline or label, then H2, then short intro.
- [ ] Cards: consistent border-radius and shadow; icon + title + 1–2 lines of copy.
- [ ] Stats strip (if used): clean numbers + labels; subtle dividers.
- [ ] Nav: minimal links; one primary CTA; sticky with backdrop on scroll.
- [ ] Footer: dark; columns; no clutter.
- [ ] Buttons: primary = one accent (gold or blue); secondary = outline or muted.
- [ ] No decorative illustrations unless they add clarity (e.g. simple icons only).

---

## 5. File mapping (where to change what)

| Area | File(s) |
|------|--------|
| Hero | `frontend/src/app/sections/hero-section-ict.component.ts` |
| Nav | `frontend/src/app/sections/nav-section.component.ts` |
| Services / Sectors | `frontend/src/app/sections/services-section.component.ts` |
| Why Choose | `frontend/src/app/sections/why-choose-section.component.ts` |
| Contact | `frontend/src/app/sections/contact-section.component.ts` |
| Footer | `frontend/src/app/sections/footer-section.component.ts` |
| Landing composition | `frontend/src/app/pages/landing.page.ts` |
| Theme tokens | `frontend/src/styles/themes/_theme-variables.scss`, `tailwind.config.js` |

### Centralized marketing page hero (all sub-pages)

All marketing and landing sub-pages use the same enterprise hero look for consistency:

- **Shared component:** `frontend/src/app/sections/page-hero.component.ts`  
  - Inputs: `overlineEn`, `overlineAr`, `titleEn`, `titleAr`, `descriptionEn`, `descriptionAr`.  
  - Style: background `#0B1220`, subtle overlay, overline (uppercase, muted), white H1, white/75 description, max-width container.
- **Central token:** `frontend/src/app/core/data/page-styles.ts` → `MARKETING_PAGE.heroBg` / `MARKETING_PAGE.heroClass`, and `GRADIENTS.pageHeroDark` / `GRADIENTS.inquiryBg` set to the same navy for all full-page marketing backgrounds.
- **Pages using PageHero:** Services, About, Case Studies, Insights, Partner Register.
- **Pages using same navy (`#0B1220`) only:** Inquiry, Thanks, Track, Legal, Not-found.

---

### Checklist vs implementation (deployment-ready)

| Item | Status | Notes |
|------|--------|--------|
| **Case Studies** | ✅ | CMS-driven (`PublicContentService.getPage('case_studies')`) with fallbacks: overline "Case Studies", title "Proven Results, Real Impact". Uses `PageHeroComponent`. |
| **Insights** | ✅ | CMS-driven (`getPage('insights')`) with fallbacks: overline "Insights", title "Insights & Resources". Uses `PageHeroComponent`. |
| **Partner Register** | ✅ | Static copy: overline "Partners", title "Partner Program", description "Join our reseller…". Form block in `bg-th-bg` (light). Uses `PageHeroComponent`. |
| **Inquiry** | ✅ | `bg-[#0B1220]`, `min-h-screen`, overline "Contact", H1 + description style. |
| **Thanks** | ✅ | `bg-[#0B1220]`, `min-h-screen`. |
| **Track** | ✅ | `bg-[#0B1220]`, `min-h-screen`. |
| **Legal** | ✅ | Section `bg-[#0B1220]` (no gradient). |
| **Not-found** | ✅ | `bg-[#0B1220]`, overline "Error", white text, gold primary CTA (`#e5a61f`), outline secondary. |

**Deployment:** Run `npm run build` in `frontend/` before deploy. All marketing pages use the centralized hero or navy background; no per-page gradient overrides remain.

Apply the principles above when editing these components so the whole landing feels enterprise-professional and consistent.
