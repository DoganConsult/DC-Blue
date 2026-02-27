# Production build and deploy — with Cloudflare Tunnel

Build the app, deploy on the **production server**, and expose it via **Cloudflare Tunnel** (no need to open port 4000 on the firewall). **No Docker.**

---

## 1. Build (production)

**On the server** (or on a build machine with enough RAM — Angular production build can use ~1.5–2 GB):

```bash
cd /root/DoganConsultHup/frontend

# If the build was previously killed (OOM), limit Node memory and retry:
export NODE_OPTIONS="--max-old-space-size=2048"
npm ci
npm run build -- --configuration production
```

If the VM has limited RAM, build **locally** or on a CI host, then copy the output to the server:

```bash
# Local/CI: build
cd frontend && npm ci && npm run build -- --configuration production

# Copy to server (from your machine)
scp -r frontend/dist/dogan-consult-web root@149.104.71.166:/root/DoganConsultHup/frontend/dist/
```

**Check:** `frontend/dist/dogan-consult-web/browser/index.html` must exist. The backend serves from `backend/../frontend/dist/dogan-consult-web/browser`.

---

## 2. Deploy backend (production server)

```bash
cd /root/DoganConsultHup/backend

# Env (set in shell or use /etc/doganconsult/env)
export DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/doganconsult"
export ADMIN_PASSWORD="your-secure-admin-password"
export PORT=4000

# Run (or use systemd — see DEPLOY_PRODUCTION_NATIVE.md)
node server.js
```

App is available at **http://127.0.0.1:4000** (and on **http://149.104.71.166:4000** if port 4000 is open). With Cloudflare Tunnel you typically **do not** open 4000 publicly; the tunnel forwards traffic to localhost.

---

## 3. Cloudflare Tunnel (recommended for production)

**cloudflared** is already installed on the server (`/usr/local/bin/cloudflared`). Use it to expose the app via a hostname (e.g. `app.doganconsult.com`) without opening port 4000.

### 3.1 One-off quick tunnel (no Cloudflare account config)

```bash
cloudflared tunnel --url http://127.0.0.1:4000
```

This prints a temporary URL (e.g. `https://xxx.trycloudflare.com`). Good for testing only.

### 3.2 Named tunnel (production, your domain)

1. **Cloudflare Dashboard:** Zero Trust → Networks → Tunnels → Create a tunnel. Choose **cloudflared**, name it (e.g. `doganconsult-app`). Copy the tunnel token.

2. **On the server**, install and login (one-time):

   ```bash
   # If not logged in:
   cloudflared tunnel login
   # (opens browser or gives URL to authorize)
   ```

3. **Create and run the tunnel:**

   ```bash
   # Create named tunnel (one-time)
   cloudflared tunnel create doganconsult-app

   # Configure: route hostname to local app
   mkdir -p ~/.cloudflared
   cat > ~/.cloudflared/config.yml << 'EOF'
   tunnel: <TUNNEL_ID>
   credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

   ingress:
     - hostname: app.doganconsult.com
       service: http://127.0.0.1:4000
     - hostname: api.doganconsult.com
       service: http://127.0.0.1:4000
     - service: http_status:404
   EOF
   ```

   Replace `app.doganconsult.com` / `api.doganconsult.com` with your real hostnames. Use one hostname if the app and API are on the same origin (e.g. `app.doganconsult.com` for both).

4. **In Cloudflare Dashboard:** For the tunnel, add a **Public Hostname**: e.g. `app.doganconsult.com` → Type **HTTP** → URL `localhost:4000` (or leave URL empty and rely on config.yml). Save.

5. **DNS:** In Cloudflare DNS for your domain, add a CNAME: `app` → `<tunnel-id>.cfargotunnel.com` (Proxy status: Proxied).

6. **Run the tunnel** (foreground or as a service):

   ```bash
   cloudflared tunnel run doganconsult-app
   ```

   Or install as a service:

   ```bash
   sudo cloudflared service install
   # Or manually: add systemd unit for `cloudflared tunnel run doganconsult-app`
   ```

After this, **https://app.doganconsult.com** (and your API under the same origin) goes through Cloudflare to your server’s localhost:4000. No firewall rule for 4000 needed.

---

## 4. Summary

| Step | Action |
|------|--------|
| 1 | **Build** frontend: `cd frontend && npm run build -- --configuration production` (or build elsewhere and copy `frontend/dist/dogan-consult-web` to server). |
| 2 | **DB** migrations applied (`plrp-migration.sql`, `consolidated-migration.sql`). |
| 3 | **Run** backend: `cd backend && node server.js` (or systemd). |
| 4 | **Cloudflare Tunnel**: run `cloudflared tunnel run <name>` so your domain points at `http://127.0.0.1:4000`. |
| 5 | **DNS**: CNAME app (and API) hostname to the tunnel. |

**Current server:** 149.104.71.166, app on port 4000, PostgreSQL on 5432, cloudflared at `/usr/local/bin/cloudflared`. See `docs/SERVER_REPORT_CURRENT.md` for full details.
