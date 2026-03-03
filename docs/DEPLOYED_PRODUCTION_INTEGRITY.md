# Deployed Production Integrity

Checklist and script to verify **production deployment integrity** after deploy (doganconsult.com or your production host).

---

## 1. Post-deploy checklist (manual)

Run these after each deploy or weekly.

| Check | How | Pass condition |
|-------|-----|----------------|
| **Health** | `curl -s https://your-domain.com/health` | HTTP 200, `{"status":"ok",...}` or `status":"degraded" with DB healthy |
| **API** | `curl -s https://your-domain.com/api/v1/health` (if exists) or any `/api/v1/` route | HTTP 200 or 401 (not 5xx) |
| **Static app** | Open `https://your-domain.com/` in browser | Landing page loads; no blank or 404 |
| **Portal login** | Open `https://your-domain.com/login` → sign in | Login works; redirect to `/workspace` or `/dashboard` |
| **Workspace** | Open `https://your-domain.com/workspace` (after login) | Overview/dashboard and tabs load |
| **Partner** | Open `https://your-domain.com/partner` (with partner API key or JWT) | Partner dashboard loads |
| **Inquiry** | Submit a test inquiry on `/inquiry` | Submission succeeds (no 5xx) |

---

## 2. Automated integrity script (on server)

From repo root on the **production server**:

```bash
./scripts/production-integrity-check.sh
```

Options:

- `./scripts/production-integrity-check.sh` — uses `http://localhost:5500` (or `PORT` from `backend/.env.production`)
- `BASE_URL=https://doganconsult.com ./scripts/production-integrity-check.sh` — checks live site

The script verifies:

1. **Health endpoint** — GET `/health` returns 200 and JSON with `status`.
2. **Static build** — `frontend/dist/dogan-consult-web/browser/index.html` (or `backend/public/index.html`) exists.
3. **Optional:** DB and secrets not left as placeholders (when run with env loaded).

---

## 3. Quick one-liners

```bash
# Health only
curl -sS -o /dev/null -w "%{http_code}" https://your-domain.com/health

# Health + body
curl -sS https://your-domain.com/health | jq .
```

---

## 4. When integrity fails

- **Health 503 / 500:** Check app logs (`pm2 logs dogan-consult-api` or `journalctl -u doganconsult`). Often DB connection or missing env.
- **Static 404:** Ensure deploy copied `frontend/dist/dogan-consult-web/browser/*` to `backend/public/` (see `scripts/deploy.sh`).
- **Portal login 401:** Verify JWT/portal env (`PORTAL_JWT_SECRET`, `DATABASE_URL`, portal_users table).
- **Blank page:** Check browser console; often wrong `base href` or API base URL in frontend env.

---

## 5. Related docs

- [DEPLOY_PRODUCTION_NATIVE.md](./DEPLOY_PRODUCTION_NATIVE.md) — build + server setup
- [DEPLOY_E2E_DOGANCONSULT.md](./DEPLOY_E2E_DOGANCONSULT.md) — end-to-end deploy for doganconsult.com
- `scripts/deploy.sh` — CI/manual deploy script (pull, build, PM2 restart, health check)
