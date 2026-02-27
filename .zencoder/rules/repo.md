---
description: Repository Information Overview
alwaysApply: true
---

# Dogan Consult Platform — ICT Engineering Services

## Summary
Full-stack platform for **www.doganconsult.com** — an ICT Engineering Services company. Angular 18 SPA frontend with a Node.js/Express REST API backend, backed by PostgreSQL. Bilingual (EN/AR) with RTL support. Includes a public inquiry form, partner lead registration program (PLRP), lead management pipeline, opportunity tracking, and commission system.

## Repository Structure
- **`frontend/`** — Angular 18 standalone SPA (landing page with 20 section components, inquiry/thanks pages, partner portal)
- **`backend/`** — Express REST API (health, landing content, lead CRUD, partner registration, dashboard stats)
  - **`backend/routes/leads.js`** — All v1 API routes: inquiry intake, lead management, partner endpoints, dashboard
  - **`backend/scripts/`** — SQL migrations (`init-db.sql` for base schema, `plrp-migration.sql` for full PLRP tables)
- **`frontend/src/app/sections/`** — 20 standalone section components (nav, hero, stats, problem, social-proof, services, chart, standards, transform, competitor, industries, engagement-flow, integrations, security, roi, trust, pricing, faq, final-cta, contact, footer)
- **`frontend/src/app/pages/`** — Page components (landing, inquiry, thanks, partner-register, partner-dashboard, partner-submit)
- **`frontend/src/app/core/services/`** — `I18nService` (signal-based EN/AR toggle with RTL)
- **`DOGAN_CONSULT_MASTER_BLUEPRINT.md`** — Full project specification document

## Projects

### Backend (`dogan-consult-api`)
**Config**: `backend/package.json` | **Type**: `module` (ES Modules)

#### Language & Runtime
**Language**: JavaScript (ESM)  
**Runtime**: Node.js  
**Package Manager**: npm  
**Build System**: None (no compile step)

#### Dependencies
- `express` ^4.18.2, `pg` ^8.11.3, `cors` ^2.8.5, `dotenv` ^16.3.1

#### API Endpoints
- `GET /health` — Health check
- `GET /api/public/landing` — Landing content (EN/AR, hardcoded default)
- `POST /api/public/leads` — Legacy lead capture (contact form)
- `POST /api/v1/public/inquiries` — Full inquiry intake with dedup, auto-assign, ticket generation
- `GET|PATCH /api/v1/leads/:id` — Lead detail/update with activity logging
- `POST /api/v1/leads/:id/activities` — Add activity to lead
- `POST /api/v1/leads/:id/convert` — Convert lead to opportunity
- `GET /api/v1/dashboard/stats` — Dashboard statistics
- `POST /api/v1/public/partners/register` — Partner registration (generates API key)
- `POST|GET /api/v1/partners/leads` — Partner lead submission/listing (API key auth via `x-api-key` header)

#### Database (PostgreSQL)
**Tables**: `leads`, `landing_strings` (init-db.sql) + `lead_intakes`, `opportunities`, `lead_activities`, `lead_assign_rules`, `partners`, `partner_leads`, `commissions` (plrp-migration.sql)  
**Connection**: `DATABASE_URL` env var, default `postgresql://localhost:5432/doganconsult`

#### Main Files
- **Entry**: `backend/server.js` (port 4000, serves API + Angular static in production)
- **Routes**: `backend/routes/leads.js`
- **Config**: `backend/.env` / `.env.example` (PORT, DATABASE_URL)

#### Build & Run
```bash
cd backend && npm install
node server.js          # or: npm run backend (from root)
```

### Frontend (`dogan-consult-web`)
**Config**: `frontend/package.json`, `frontend/angular.json`

#### Language & Runtime
**Language**: TypeScript ~5.4.0  
**Framework**: Angular ^18.2.0 (standalone components, signals)  
**Build System**: Angular CLI (`@angular-devkit/build-angular:application`)  
**Package Manager**: npm  
**Target**: ES2022 | **Module**: ES2022 | **Strict mode**: enabled

#### Dependencies
**Main**: `@angular/core` ^18.2.0 (+ animations, common, compiler, forms, router, platform-browser), `primeng` ^18.0.0, `primeicons` ^7.0.0, `primeflex` ^3.3.1, `chart.js` ^4.4.1, `rxjs` ~7.8.0, `zone.js` ~0.14.0  
**Dev**: `tailwindcss` ^3.4.0, `postcss` ^8.4.32, `autoprefixer` ^10.4.16, `typescript` ~5.4.0

#### Styling
- **Tailwind CSS** 3.4 with custom brand colors (`primary` #0EA5E9, `brand-dark` #0A3C6B, `saudi-green` #006C35, `gold` #E3B76B)
- **PrimeFlex** utility classes + **PrimeNG** component library
- **SCSS** as component style language
- **Fonts**: Inter (LTR), IBM Plex Arabic / Noto Kufi Arabic (RTL)

#### Routing
- `/` — `LandingPage` (lazy-loaded)
- `**` — redirect to `/`
- Dev proxy: `/api` and `/health` proxied to `http://localhost:4000`

#### Main Files
- **Entry**: `frontend/src/main.ts`
- **App config**: `frontend/src/app/app.config.ts` (providers: zone, router, httpClient, animations)
- **Routes**: `frontend/src/app/app.routes.ts`
- **Environments**: `environment.ts` (dev), `environment.prod.ts` (prod) — `apiBase` config
- **Styles**: `frontend/src/styles.scss`, `tailwind.config.js`, `postcss.config.js`
- **Output**: `frontend/dist/dogan-consult-web/browser/`

#### Build & Run
```bash
cd frontend && npm install
ng serve                    # dev server on :4200
ng build --configuration production   # production build
```

## Root Scripts
```bash
npm install              # root deps (concurrently)
npm run dev              # run backend + frontend concurrently
npm run build            # build frontend then backend
npm run frontend         # Angular dev server (:4200)
npm run backend          # Express API (:4000)
```

## Testing
No test framework or test files are configured in either project. No `karma.conf`, `jest.config`, or test scripts exist.

## Docker
No Dockerfile or docker-compose configuration present.

## Production Deployment
Backend serves Angular static build from `../frontend/dist/dogan-consult-web/browser/` with SPA fallback. Set `NODE_ENV=production`, `DATABASE_URL`, and `PORT` env vars. DNS points to `www.doganconsult.com`.
