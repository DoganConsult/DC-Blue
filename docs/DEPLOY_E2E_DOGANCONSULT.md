# End-to-end production deploy — doganconsult.com

Get the Dogan Consult site live so **end users see https://www.doganconsult.com** (or https://doganconsult.com). One flow from build → server → domain.

---

## 1. Production URL and app config

| Item | Value |
|------|--------|
| **Live URL** | https://www.doganconsult.com (and doganconsult.com) |
| **Canonical / SEO** | Set in `frontend/src/index.html` (canonical, og:url, schema.org url) |
| **API** | Same origin in production (`environment.prod.ts`: `apiBase: ''`) |
| **Base href** | `/` (works at root and with nginx proxy) |

No code changes needed for the domain: the app is already configured for doganconsult.com in `index.html` and `site-content.ts`.

---

## 2. Build (production)

From repo root:

```bash
./scripts/build-and-deploy-production.sh
```

This:

- Installs frontend deps and runs `ng build --configuration production`
- Installs backend deps
- Verifies `frontend/dist/dogan-consult-web/browser` exists

Or step by step:

```bash
cd frontend && npm ci && npm run build -- --configuration production && cd ..
cd backend && npm ci && cd ..
```

---

## 3. Deploy on server (two options)

### Option A — Full deploy script (PM2, port 5500)

On the **production server** (e.g. self-hosted runner or SSH):

```bash
cd /root/DoganConsultHup
export DEPLOY_BRANCH=main
bash scripts/deploy.sh
```

The script:

1. Pulls latest (e.g. `main`)
2. Installs backend and frontend deps
3. Builds frontend (production)
4. Copies build to `backend/public/`
5. Restarts PM2 app `dogan-consult-api` with **PORT=5500** (from `backend/.env.production` or env)
6. Runs health check on `/health`

Ensure on the server:

- `backend/.env.production` (or env) has: `DATABASE_URL`, `ADMIN_PASSWORD`, `PORT=5500`
- PM2 is installed (`npm i -g pm2`); process name is `dogan-consult-api`
- Database migrations are applied (see [DEPLOY_PRODUCTION_NATIVE.md](./DEPLOY_PRODUCTION_NATIVE.md))

### Option B — Manual (no PM2, port 4000)

```bash
cd /path/to/DoganConsultHup
# Build already done; optionally copy to backend/public for server.js
cp -r frontend/dist/dogan-consult-web/browser/* backend/public/   # optional

export DATABASE_URL="postgresql://USER:PASS@localhost:5432/doganconsult"
export ADMIN_PASSWORD="your-secure-password"
export PORT=4000

cd backend && node server.js
```

- If `backend/public` exists, `server.js` serves from it; otherwise from `frontend/dist/...`.
- App: http://SERVER:4000 (or 5500 if you set PORT=5500).

---

## 4. Nginx (so the world sees doganconsult.com)

Install and enable the site:

```bash
sudo apt-get install -y nginx
sudo ln -sf /root/DoganConsultHup/docs/nginx-doganconsult.conf /etc/nginx/sites-enabled/doganconsult
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

- **Port:** `docs/nginx-doganconsult.conf` proxies to **5500** (for Option A / deploy.sh). If you use Option B with PORT=4000, change `proxy_pass` in the config to `http://127.0.0.1:4000`.
- **SSL:** Use **Let's Encrypt** (certbot) or **Cloudflare** (flexible/full SSL) so users get https://doganconsult.com.

Example with certbot:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d doganconsult.com -d www.doganconsult.com
```

---

## 5. DNS

Point the domain to your server:

- **A record** for `doganconsult.com` → server public IP
- **A or CNAME** for `www.doganconsult.com` → same IP or CNAME to `doganconsult.com`

If you use **Cloudflare Tunnel** instead of nginx, you don’t need to open ports; the tunnel gives you a hostname (e.g. `app.doganconsult.com` or your custom domain). See [DEPLOY_PRODUCTION_CLOUDFLARE.md](./DEPLOY_PRODUCTION_CLOUDFLARE.md).

---

## 6. Checklist — “End users see doganconsult.com”

- [ ] Frontend built: `frontend/dist/dogan-consult-web/browser/index.html` exists
- [ ] Backend env set: `DATABASE_URL`, `ADMIN_PASSWORD`, `PORT` (5500 for deploy.sh, or 4000)
- [ ] Backend running: `curl http://127.0.0.1:5500/health` (or 4000) → `{"status":"ok"}`
- [ ] Nginx enabled and reloaded; `proxy_pass` port matches app port
- [ ] DNS: doganconsult.com and www point to server (or tunnel hostname)
- [ ] SSL: https://doganconsult.com and https://www.doganconsult.com work (certbot or Cloudflare)
- [ ] Homepage loads and API works: e.g. open https://www.doganconsult.com and submit contact form

---

## 7. CI/CD (optional)

On push to `main`, GitHub Actions can run the deploy script on a self-hosted runner (see `.github/workflows/deploy.yml`). The runner must have the repo at e.g. `/root/DoganConsultHup`, PM2, and env (or `.env.production`) configured.

---

**Summary:** Build with `./scripts/build-and-deploy-production.sh`, deploy with `scripts/deploy.sh` on the server, enable nginx with `docs/nginx-doganconsult.conf`, add SSL and DNS. End users then see the site at **https://www.doganconsult.com**.
