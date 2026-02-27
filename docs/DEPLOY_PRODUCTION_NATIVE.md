# Production deploy — native server (no Docker)

Deploy the Dogan Consult Hup platform on a single Linux server using Node, PostgreSQL, and (optionally) nginx. **No Docker.**

---

## 0. Quick build + deploy (from repo root)

```bash
./scripts/build-and-deploy-production.sh
```

Then on the **server**: ensure DB migrations are applied, set `DATABASE_URL`, `ADMIN_PASSWORD`, `PORT=4000`, and start (or restart) the app — see Sections 2–4 below.

---

## 1. Prerequisites on server

- **Node.js** 18+ (e.g. `node -v`)
- **npm** 9+
- **PostgreSQL** 14+
- **Git** (to clone/pull repo)
- Optional: **nginx** (reverse proxy + static), **systemd** (process manager)

---

## 2. Database

Create a database and run migrations in order:

```bash
# Create DB (if not exists)
sudo -u postgres psql -c "CREATE DATABASE doganconsult;"   # or your DB name

# From repo root
export PGDATABASE=doganconsult   # or DATABASE_URL
psql -h localhost -U your_user -d doganconsult -f backend/scripts/plrp-migration.sql
psql -h localhost -U your_user -d doganconsult -f backend/scripts/consolidated-migration.sql
```

If `lead_intakes` already exists, `plrp-migration.sql` is safe (IF NOT EXISTS). Run `consolidated-migration.sql` to add new columns.

---

## 3. Application (single process: API + static)

Backend serves both API and the built Angular app from one process.

```bash
cd /path/to/DoganConsultHup

# Backend deps
cd backend && npm ci && cd ..

# Frontend build (production)
cd frontend && npm ci && npm run build -- --configuration production && cd ..

# Env (set before starting)
export DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/doganconsult"
export ADMIN_PASSWORD="your-secure-admin-password"
export PORT=4000

# Run (from repo root; server.js uses backend/ so static path is backend/../frontend/dist/...)
cd backend && node server.js
```

App is available at `http://SERVER_IP:4000`. API: `http://SERVER_IP:4000/api/v1/...`, health: `http://SERVER_IP:4000/health`.

---

## 4. Process manager (systemd)

Create `/etc/systemd/system/doganconsult.service`:

```ini
[Unit]
Description=Dogan Consult Hup (API + Web)
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/DoganConsultHup/backend
EnvironmentFile=/etc/doganconsult/env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Create `/etc/doganconsult/env` (chmod 600):

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/doganconsult
ADMIN_PASSWORD=your-secure-admin-password
PORT=4000
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable doganconsult
sudo systemctl start doganconsult
sudo systemctl status doganconsult
```

---

## 5. Reverse proxy (nginx, optional)

To serve on port 80/443 and proxy to Node:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/DoganConsultHup/frontend/dist/dogan-consult-web/browser;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /health {
        proxy_pass http://127.0.0.1:4000;
    }
}
```

If you use this, you can run Node without serving static files (change server.js to not use express.static for frontend); or keep current server.js and proxy everything to Node:

```nginx
location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 6. Deploy checklist

- [ ] PostgreSQL running; DB created
- [ ] `plrp-migration.sql` and `consolidated-migration.sql` applied
- [ ] `DATABASE_URL` and `ADMIN_PASSWORD` set (env or EnvironmentFile)
- [ ] Frontend built: `frontend/dist/dogan-consult-web/browser` exists
- [ ] Backend starts: `cd backend && node server.js`
- [ ] Health: `curl http://localhost:4000/health` → `{"status":"ok",...}`
- [ ] Optional: systemd service enabled and running
- [ ] Optional: nginx configured and reloaded; firewall allows 80/443

---

## 7. New APIs (from guide docs)

- **GET** `/api/v1/opportunities` — list opportunities (admin token). Query: `stage`, `owner`, `page`, `limit`
- **PATCH** `/api/v1/opportunities/:id` — update stage, next_action, closed_at (admin). On `closed_won`, creates commission for approved partner lead.
- **POST** `/api/v1/partners/leads/:id/approve` — approve partner lead (admin)
- **POST** `/api/v1/partners/leads/:id/reject` — reject partner lead (admin), body: `{ "reason": "..." }`
- **GET** `/api/v1/partners/leads` — now returns `opportunity_id`, `opportunity_stage`, `opportunity_closed_at` per lead (partner API key)

Admin requests require header: `X-Admin-Token: <ADMIN_PASSWORD>`.

---

## 8. ECS / upgraded server (e.g. Riyadh II, 4 vCPU, 16 GB RAM)

After upgrading to a larger instance (e.g. **ecs-970000y56s0j**, Ubuntu 22.04, **149.104.71.166**):

1. **Clone/pull** the repo on the new server (or rsync from your dev machine).
2. **Install stack** (if fresh): Node 20+, PostgreSQL 14, git.
3. **Database:** Create `doganconsult`, run `plrp-migration.sql` then `consolidated-migration.sql`.
4. **Frontend build** (from repo root):
   ```bash
   cd frontend && npm ci && NODE_OPTIONS="--max-old-space-size=4096" npm run build -- --configuration production && cd ..
   ```
   Confirm `frontend/dist/dogan-consult-web/browser` exists.
5. **Backend:** Set `DATABASE_URL`, `ADMIN_PASSWORD`, `PORT=4000`; run `cd backend && npm ci && node server.js`.
6. **Optional:** Add systemd unit (Section 4) and/or Cloudflare Tunnel (see `docs/DEPLOY_PRODUCTION_CLOUDFLARE.md`).

See `docs/SERVER_REPORT_CURRENT.md` for the current server overview (IP, stack, app URL).
