# Deploy production via DrDogan tunnel (doganconsult.com)

Use this when the app is built and running on the server and you want **doganconsult.com** / **www.doganconsult.com** to serve it through your existing Cloudflare Tunnel **DrDogan**.

---

## 1. Build and run app (on server)

```bash
cd /root/DoganConsultHup/frontend
npm ci && NODE_OPTIONS="--max-old-space-size=4096" npm run build -- --configuration production

cd /root/DoganConsultHup/backend
npm ci
# Ensure .env has DATABASE_URL and ADMIN_PASSWORD
PORT=4000 node server.js
# Or run in background: nohup env PORT=4000 node server.js &
```

**Check:** `curl -s http://127.0.0.1:4000/health` → `{"status":"ok",...}`

---

## 2. Point tunnel at port 4000

**502 Bad Gateway** means Cloudflare could not get a response from your origin. Common causes:
- Tunnel is still set to **http://localhost:80** (nothing runs there) → set to **http://localhost:4000**.
- **cloudflared** is not running on the server where the app runs → start it there (see below).

Your tunnel **DrDogan** currently has:

| Hostname            | Service          |
|---------------------|------------------|
| doganconsult.com    | http://localhost:80 |
| www.doganconsult.com | http://localhost:80 |

The app runs on **port 4000**, not 80. Update the tunnel so traffic reaches it:

1. **Cloudflare Dashboard** → **Zero Trust** → **Networks** → **Tunnels** → **DrDogan**.
2. Open **Published application routes** (or **Public Hostnames** / **Routes**).
3. For **doganconsult.com** and **www.doganconsult.com**:
   - **Edit** the route.
   - Set **Service** (Origin) to: **`http://localhost:4000`** (replace `80` with `4000`).
   - Save.
4. If **cloudflared** runs on this server, restart it so it picks up the change:
   ```bash
   sudo systemctl restart cloudflared
   # or, if you run it manually:
   # pkill -f cloudflared; cloudflared tunnel run DrDogan &
   ```

After this, **https://doganconsult.com** and **https://www.doganconsult.com** will go through the tunnel to your app on port 4000.

---

## 3. Optional: keep tunnel on port 80 (nginx proxy)

If you prefer not to change the tunnel config, run **nginx** on port 80 and proxy to 4000:

```bash
# Install nginx if needed
sudo apt-get update && sudo apt-get install -y nginx

# Config
sudo tee /etc/nginx/sites-available/doganconsult << 'EOF'
server {
    listen 80 default_server;
    server_name doganconsult.com www.doganconsult.com;
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/doganconsult /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Then leave the tunnel as **http://localhost:80**. Nginx will forward to the app on 4000.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Build frontend and run backend on port 4000; verify `/health`. |
| 2 | In Cloudflare, set DrDogan routes for doganconsult.com and www to **http://localhost:4000**; restart cloudflared if needed. |
| Or | Run nginx on 80 proxying to 4000 and leave tunnel on localhost:80. |

**Current:** App built and running on 4000. Update tunnel origin to **localhost:4000** (or use nginx on 80) so production is live at **https://doganconsult.com**.
