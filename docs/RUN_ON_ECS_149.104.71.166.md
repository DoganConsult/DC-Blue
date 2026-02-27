# Runbook: 149.104.71.166 (ECS Riyadh II)

**Server:** ecs-970000y56s0j · Ubuntu 22.04 · 4 vCPU, 16 GB RAM  
**App:** Dogan Consult Hup · Node on port 4000 · DB `doganconsult`

Run these **on the server** (SSH as root or your user). Replace placeholders where noted.

---

## 1. Update app and rebuild (after code changes)

```bash
cd /root/DoganConsultHup

# Pull latest (if using git)
git pull

# Backend deps
cd backend && npm ci && cd ..

# Frontend production build (needs enough memory)
cd frontend && npm ci && NODE_OPTIONS="--max-old-space-size=4096" npm run build -- --configuration production && cd ..

# Check build output
ls -la frontend/dist/dogan-consult-web/browser/index.html
```

---

## 2. Restart the app

If the app was started manually (no systemd):

```bash
# Find and stop current process
pkill -f "node server.js" || true
# Or: kill $(lsof -t -i:4000)  # if you prefer by port

cd /root/DoganConsultHup/backend

# Set env (use your real values; or source /path/to/env)
export DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/doganconsult"
export ADMIN_PASSWORD="your-admin-token"
export PORT=4000

# Start
node server.js
```

To run in background: `nohup node server.js > /var/log/doganconsult.log 2>&1 &` (or use systemd below).

---

## 3. Quick health check

```bash
curl -s http://127.0.0.1:4000/health
# Expect: {"status":"ok",...}
```

From outside: `http://149.104.71.166:4000` and `http://149.104.71.166:4000/health`.

---

## 4. Optional: systemd (survives reboot)

```bash
sudo tee /etc/systemd/system/doganconsult.service << 'EOF'
[Unit]
Description=Dogan Consult Hup (API + Web)
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/root/DoganConsultHup/backend
EnvironmentFile=/etc/doganconsult/env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

Create env file (chmod 600):

```bash
sudo tee /etc/doganconsult/env << 'EOF'
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/doganconsult
ADMIN_PASSWORD=your-admin-token
PORT=4000
EOF
sudo chmod 600 /etc/doganconsult/env
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable doganconsult
sudo systemctl start doganconsult
sudo systemctl status doganconsult
```

---

## 5. Optional: run DB migrations (if not done yet)

```bash
cd /root/DoganConsultHup
export PGDATABASE=doganconsult
# If DB uses password: export PGPASSWORD=...

psql -h localhost -U postgres -d doganconsult -f backend/scripts/plrp-migration.sql
psql -h localhost -U postgres -d doganconsult -f backend/scripts/consolidated-migration.sql
```

---

## Summary

| Goal                    | Do this                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| Deploy latest code      | §1 (git pull, npm ci, frontend build) then §2 (restart Node)           |
| Just restart app        | §2                                                                     |
| Check app is up         | §3                                                                     |
| Auto-start on reboot    | §4 (systemd)                                                           |
| First-time DB setup     | §5                                                                     |

Full deploy details: `docs/DEPLOY_PRODUCTION_NATIVE.md`. Server overview: `docs/SERVER_REPORT_CURRENT.md`.
