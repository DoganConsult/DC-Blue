#!/usr/bin/env bash
set -euo pipefail

# DoganConsultHub — Production Deploy Script
# Called by GitHub Actions self-hosted runner or manually

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="/var/log/dogan-consult/deploy-$(date +%Y%m%d-%H%M%S).log"

log() { echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"; }

mkdir -p /var/log/dogan-consult

log "=== Deploy started ==="
log "Directory: $ROOT_DIR"

# 1. Pull latest code
cd "$ROOT_DIR"
log "Pulling latest code..."
BRANCH="${DEPLOY_BRANCH:-main}"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# 2. Install dependencies
log "Installing backend dependencies..."
cd "$ROOT_DIR/backend"
npm ci --production --ignore-scripts 2>&1 | tail -3

log "Installing frontend dependencies..."
cd "$ROOT_DIR/frontend"
npm ci --ignore-scripts 2>&1 | tail -3

# 3. Build frontend (AOT production)
log "Building frontend (AOT production)..."
cd "$ROOT_DIR/frontend"
npx ng build --configuration production 2>&1 | tail -5

# 4. Copy dist to backend/public
log "Copying build to backend/public..."
rm -rf "$ROOT_DIR/backend/public"/*
cp -r "$ROOT_DIR/frontend/dist/dogan-consult-web/browser"/* "$ROOT_DIR/backend/public/"

# 5. Run database migrations (if any)
if [ -f "$ROOT_DIR/backend/services/migrations.js" ]; then
  log "Running migrations..."
  cd "$ROOT_DIR/backend"
  node -e "import('./services/migrations.js').then(m => m.runMigrations ? m.runMigrations().then(() => process.exit(0)) : process.exit(0)).catch(e => { console.error(e.message); process.exit(0); })" 2>&1 || true
fi

# 6. Restart PM2
log "Restarting PM2 process..."
pm2 restart dogan-consult-api --update-env 2>&1 | tail -5

# 7. Health check (wait up to 15s)
log "Running health check..."
for i in $(seq 1 5); do
  sleep 3
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health 2>/dev/null || echo "000")
  if [ "$STATUS" = "200" ]; then
    log "Health check passed (HTTP 200)"
    break
  fi
  if [ "$i" = "5" ]; then
    log "ERROR: Health check failed after 15s (HTTP $STATUS)"
    pm2 logs dogan-consult-api --lines 20 --nostream 2>&1 | tee -a "$LOG_FILE"
    exit 1
  fi
  log "Health check attempt $i: HTTP $STATUS, retrying..."
done

COMMIT=$(git rev-parse --short HEAD)
log "=== Deploy complete — commit $COMMIT ==="
