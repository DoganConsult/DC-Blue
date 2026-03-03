#!/usr/bin/env bash
set -euo pipefail

# DoganConsultHub — Production Deploy Script
# Called by GitHub Actions self-hosted runner or manually

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="/var/log/dogan-consult/deploy-${TIMESTAMP}.log"
BACKUP_DIR="/var/log/dogan-consult/backups"

export PM2_HOME="${PM2_HOME:-/root/.pm2}"

log() { echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"; }

mkdir -p /var/log/dogan-consult "$BACKUP_DIR"

log "=== Deploy started ==="
log "Directory: $ROOT_DIR"

# ─── 0. Pre-flight: verify required env ───────────────
ENV_FILE="${ROOT_DIR}/backend/.env"
if [ ! -f "$ENV_FILE" ]; then
  log "ERROR: ${ENV_FILE} not found. Copy .env.production and fill in secrets."
  exit 1
fi

for VAR in JWT_SECRET DB_PASSWORD; do
  VAL=$(grep -E "^${VAR}=" "$ENV_FILE" 2>/dev/null | cut -d= -f2- || true)
  if [ -z "$VAL" ]; then
    log "ERROR: ${VAR} is empty in ${ENV_FILE}. Set it before deploying."
    exit 1
  fi
done
log "Pre-flight checks passed"

# ─── 1. Pull latest code ──────────────────────────────
cd "$ROOT_DIR"
log "Pulling latest code..."
BRANCH="${DEPLOY_BRANCH:-main}"
git fetch origin "$BRANCH"

PREV_COMMIT=$(git rev-parse HEAD)
git reset --hard "origin/$BRANCH"
NEW_COMMIT=$(git rev-parse HEAD)
log "Updated: ${PREV_COMMIT:0:7} → ${NEW_COMMIT:0:7}"

# ─── 2. Backup current build ──────────────────────────
if [ -d "$ROOT_DIR/backend/public" ] && [ "$(ls -A "$ROOT_DIR/backend/public" 2>/dev/null)" ]; then
  BACKUP_FILE="${BACKUP_DIR}/public-${TIMESTAMP}.tar.gz"
  tar -czf "$BACKUP_FILE" -C "$ROOT_DIR/backend" public/ 2>/dev/null || true
  log "Previous build backed up to ${BACKUP_FILE}"
fi

# ─── 3. Install dependencies ──────────────────────────
log "Installing backend dependencies..."
cd "$ROOT_DIR/backend"
npm ci --production --legacy-peer-deps --ignore-scripts 2>&1 | tail -3

log "Installing frontend dependencies..."
cd "$ROOT_DIR/frontend"
npm ci --legacy-peer-deps --ignore-scripts 2>&1 | tail -3

# ─── 4. Build frontend (AOT production) ───────────────
log "Building frontend (AOT production)..."
cd "$ROOT_DIR/frontend"
npx ng build --configuration production 2>&1 | tail -5
BUILD_DIR="$ROOT_DIR/frontend/dist/dogan-consult-web/browser"

if [ ! -d "$BUILD_DIR" ] || [ ! -f "$BUILD_DIR/index.html" ]; then
  log "ERROR: Frontend build failed — ${BUILD_DIR}/index.html not found"
  exit 1
fi
log "Frontend build OK"

# ─── 5. Copy dist to backend/public ───────────────────
log "Copying build to backend/public..."
mkdir -p "$ROOT_DIR/backend/public"
rm -rf "$ROOT_DIR/backend/public"/*
cp -r "${BUILD_DIR}"/* "$ROOT_DIR/backend/public/"

# ─── 6. Run database migrations ───────────────────────
log "Running migrations..."
cd "$ROOT_DIR/backend"
node -e "
  import('dotenv/config').then(() =>
    import('./services/migrations.js').then(m =>
      m.runMigrations ? m.runMigrations(undefined).then(r => { console.log('Migrations OK:', JSON.stringify(r)); process.exit(0); }) : process.exit(0)
    )
  ).catch(e => { console.error('Migration error:', e.message); process.exit(1); })
" 2>&1 | tee -a "$LOG_FILE" || {
  log "WARNING: Migrations had issues — check logs"
}

# ─── 7. Restart PM2 ───────────────────────────────────
log "Restarting PM2 process..."
APP_PORT=$(grep -E '^PORT=' "$ENV_FILE" 2>/dev/null | cut -d= -f2 || echo "5500")

if pm2 describe dogan-consult-api > /dev/null 2>&1; then
  pm2 restart dogan-consult-api --update-env 2>&1 | tail -5
else
  log "PM2 process not found, starting fresh..."
  cd "$ROOT_DIR/backend"
  pm2 start server.js --name dogan-consult-api --node-args="--env-file=.env" 2>&1 | tail -5
  pm2 save 2>&1
fi

# ─── 8. Health check (wait up to 30s) ─────────────────
log "Running health check..."
HEALTHY=false
for i in $(seq 1 10); do
  sleep 3
  STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "http://localhost:${APP_PORT}/health" 2>/dev/null || echo "000")
  if [ "$STATUS" = "200" ]; then
    log "Health check passed (HTTP 200)"
    HEALTHY=true
    break
  fi
  log "Health check attempt $i/10: HTTP $STATUS"
done

if [ "$HEALTHY" != "true" ]; then
  log "ERROR: Health check failed after 30s"
  log "Attempting rollback to ${PREV_COMMIT:0:7}..."
  pm2 logs dogan-consult-api --lines 30 --nostream 2>&1 | tee -a "$LOG_FILE"

  if [ -f "${BACKUP_FILE:-/dev/null}" ]; then
    rm -rf "$ROOT_DIR/backend/public"/*
    tar -xzf "$BACKUP_FILE" -C "$ROOT_DIR/backend/"
    git reset --hard "$PREV_COMMIT"
    pm2 restart dogan-consult-api --update-env 2>&1 || true
    log "Rolled back to ${PREV_COMMIT:0:7}"
  fi
  exit 1
fi

# ─── 9. Cleanup old backups (keep last 5) ─────────────
ls -t "$BACKUP_DIR"/public-*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true

COMMIT=$(git rev-parse --short HEAD)
log "=== Deploy complete — commit $COMMIT ==="
