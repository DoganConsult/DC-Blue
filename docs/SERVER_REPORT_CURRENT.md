# Current server report — Dogan Consult Hup

**Generated:** 2026-02-27 (server time)  
**Updated:** ECS instance details (Riyadh II, 4 vCPU, 16 GB RAM)

---

## 1. Host and network

| Item | Value |
|------|--------|
| **Instance / ID** | `ecs-970000y56s0j` (Created 2026-02-27) |
| **Hostname** | `y8m6ffhs.vm` / `202602262210...` |
| **OS** | Ubuntu 22.04.5 LTS (Jammy Jellyfish) |
| **Location** | **Riyadh II** |
| **Kernel** | Linux 5.15.0-60-generic x86_64 |
| **Private IP** | 172.16.1.142/24 |
| **Public IPv4** | **149.104.71.166** |
| **Line type** | BGP |

| Resource | Value |
|----------|--------|
| **CPU** | 4 vCPU |
| **RAM** | 16 GB |
| **System disk** | 150 GB |
| **Data disk** | 0 GB |
| **Username** | root |

---

## 2. Installed stack

| Component | Version / path |
|-----------|-----------------|
| **Node.js** | v20.20.0 (`/usr/bin/node`) |
| **npm** | 10.8.2 |
| **PostgreSQL** | 14 (client: `/usr/bin/psql`), cluster `14-main` |
| **nginx** | 1.18.0 (`/usr/sbin/nginx`) — **not running** (inactive) |

---

## 3. Listening ports

| Port | Process | Notes |
|------|---------|--------|
| **22** | sshd | SSH |
| **4000** | **node server.js** | Dogan Consult API + web app (cwd: `/root/DoganConsultHup/backend`) |
| **5432** | postgres | PostgreSQL (localhost only) |
| 20241 | cloudflared | (tunnel / dev) |
| 34227, 36213, 44181 | node | Other Node processes (e.g. Cursor/IDE) |
| 34959 | code (Cursor) | IDE |

---

## 4. Dogan Consult app

| Item | Value |
|------|--------|
| **Process** | `node server.js` (PID 64138) |
| **CWD** | `/root/DoganConsultHup/backend` |
| **Bind** | `*:4000` (all interfaces) |
| **Health** | `GET http://127.0.0.1:4000/health` → **200** `{"status":"ok",...}` |
| **Managed by** | Not systemd (no `doganconsult.service`); process started manually (or by IDE). |

---

## 5. Database

| Item | Value |
|------|--------|
| **Databases** | `postgres`, **doganconsult** |
| **PostgreSQL** | Running (`postgresql@14-main.service`), listen on 127.0.0.1:5432 |

---

## 6. Nginx

| Item | Value |
|------|--------|
| **Status** | **inactive** (not running) |
| **Config** | Default site only: `sites-enabled/default` → `/var/www/html`, port 80. No proxy to Node. |

So today the app is reached **directly on port 4000** (e.g. `http://149.104.71.166:4000`). Nginx is available if you want to put it in front later (e.g. port 80/443 and proxy to 4000).

---

## 7. Summary

- **Public IP:** **149.104.71.166**
- **App URL:** `http://149.104.71.166:4000` (API: `/api/v1/...`, health: `/health`)
- **Stack:** Node 20 (app on 4000), PostgreSQL 14 (DB `doganconsult`), nginx installed but off
- **App:** Running from `/root/DoganConsultHup/backend`; not under systemd — consider adding a unit for restart and startup (see `docs/DEPLOY_PRODUCTION_NATIVE.md`).

---

## 8. Optional next steps

1. **Systemd:** Add `doganconsult.service` and `EnvironmentFile` so the app survives reboot and is easier to manage.
2. **Nginx:** Enable nginx and add a vhost that proxies `/api` and `/health` (and optionally static) to `http://127.0.0.1:4000`, and open firewall for 80/443.
3. **Firewall:** If you use `ufw`/iptables, ensure 4000 (or 80/443 if using nginx) is allowed for external access.
