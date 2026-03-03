# What You Need to Build the App

Quick reference for **DoganConsultHub** (Dogan Consult ICT platform).

---

## 1. Runtime requirements

| Requirement | Version / note |
|-------------|-----------------|
| **Node.js** | 18+ (LTS recommended) |
| **npm** | 8+ (comes with Node) |
| **PostgreSQL** | 14+ (optional for full leads/portal; app can run without it for static/landing) |
| **Python** | 3.10+ (only if you run Design Hub viz) |

---

## 2. Install (first time)

```bash
# From repo root
npm install

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

---

## 3. Database (optional but needed for leads/portal/auth)

- Create DB: `createdb doganconsult`
- Init schema: `psql -d doganconsult -f backend/scripts/init-db.sql`
- Backend reads connection from env (see below).

---

## 4. Environment / config

**Backend** (e.g. `backend/.env` or env vars):

- `PORT` — API port (default often 4000)
- `DATABASE_URL` or `PG*` vars — PostgreSQL connection (needed for leads, auth, portal)
- Other optional: email (Nodemailer), AI (Anthropic), etc.

**Frontend** (e.g. `frontend/src/environments/environment.ts`):

- `apiBase` — base URL for API (dev: proxy to backend; prod: your API host)

---

## 5. Build & run

| Goal | Command |
|------|--------|
| **Dev – API** | `npm run backend` (or `cd backend && node server.js`) |
| **Dev – Angular** | `npm run frontend` (or `cd frontend && npm start`) |
| **Dev – both** | `npm run dev` (concurrently backend + frontend) |
| **Production build** | `npm run build` (builds frontend + backend “build” step) |
| **Production build (frontend only)** | `cd frontend && npm run build -- --configuration production` |

- Dev app: http://localhost:4200 (Angular; API proxied to backend port).
- Production: serve `frontend/dist/dogan-consult-web/` (static) and run backend for API; or serve both from Node (see README).

---

## 6. What each part needs

| Part | Needs |
|------|--------|
| **Frontend (Angular)** | Node/npm, `npm install` in `frontend/`. Builds with Angular CLI. |
| **Backend (Express)** | Node/npm, `npm install` in `backend/`. Optional: PostgreSQL + env for DB. |
| **Full app (leads, auth, portal)** | Backend + DB + env (e.g. `DATABASE_URL`). |
| **Design Hub (Python viz)** | Python 3.10+, deps in `design-hub/`. Only if you use that layer. |

---

## 7. One-line “do you know what we need”

**To build the app:** Node 18+, npm, and (for full features) PostgreSQL and backend env. Run `npm install` at root and in `frontend` and `backend`, then `npm run dev` or `npm run build` as above.
