# Dogan Consult — ICT Engineering Services

**www.doganconsult.com** · Angular 18 + Node.js + PostgreSQL

## Stack

- **Frontend:** Angular 18 (standalone), PrimeNG 18, Tailwind 3, Chart.js — EN/AR, RTL
- **Backend:** Node.js (Express), PostgreSQL
- **Brand:** Dogan Consult — ICT Engineering Services (not GRC)

## Quick start

```bash
# Install
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# PostgreSQL (optional for leads)
createdb doganconsult
psql -d doganconsult -f backend/scripts/init-db.sql

# Run API (port 4000)
npm run backend

# Run Angular (port 4200) — in another terminal
npm run frontend
```

Open http://localhost:4200 — API is proxied to :4000 via proxy.conf.json.

## Build for production

```bash
# Build Angular
cd frontend && npm run build -- --configuration production && cd ..

# Optional: run Node to serve API + static (copy frontend output into backend)
npm run backend
```

Then open http://localhost:4000 — same server serves API and the landing.

## Deploy www.doganconsult.com

1. Build frontend: `cd frontend && npm run build -- --configuration production`
2. Either:
   - **A)** Deploy `frontend/dist/dogan-consult-web/` to a static host; deploy `backend/` separately and set API base URL in Angular env.
   - **B)** Copy `frontend/dist/dogan-consult-web/*` to `backend/public/` (or keep as ../frontend/dist/), set `NODE_ENV=production`, and run Node — it serves both API and SPA.
3. Set `DATABASE_URL` and `PORT` in production.
4. Point DNS for www.doganconsult.com to your server.

## Project layout

- `frontend/` — Angular 18 landing (nav, hero, stats, services, chart, **contact form**, footer)
- `frontend/src/environments/` — `environment.ts` (dev) and `environment.prod.ts` (prod); set `apiBase` if API is on another host.
- `backend/` — Express API: `/health`, `GET /api/public/landing`, `POST /api/public/leads`
- `backend/scripts/init-db.sql` — schema for leads (and optional landing_strings)
