#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
echo "=== Dogan Consult Hup — production build ==="

echo "[1/4] Frontend (Angular production)..."
cd frontend
npm ci --quiet
npm run build -- --configuration production
cd ..

BUILD_DIR="frontend/dist/dogan-consult-web/browser"
if [ ! -f "${BUILD_DIR}/index.html" ]; then
  echo "ERROR: ${BUILD_DIR}/index.html not found — build failed"
  exit 1
fi
echo "    → ${BUILD_DIR} ($(du -sh "$BUILD_DIR" | cut -f1))"

echo "[2/4] Backend deps..."
cd backend
npm ci --quiet --production
cd ..

echo "[3/4] Copy build to backend/public..."
mkdir -p backend/public
rm -rf backend/public/*
cp -r "${BUILD_DIR}"/* backend/public/

echo "[4/4] Pre-flight checks..."
ENV_FILE="backend/.env"
if [ -f "$ENV_FILE" ]; then
  for VAR in JWT_SECRET DB_PASSWORD; do
    VAL=$(grep -E "^${VAR}=" "$ENV_FILE" 2>/dev/null | cut -d= -f2- || true)
    if [ -z "$VAL" ]; then
      echo "WARNING: ${VAR} is empty in ${ENV_FILE}"
    fi
  done
  echo "    → env checked"
else
  echo "    → WARNING: ${ENV_FILE} not found — copy .env.production and fill in secrets"
fi

echo ""
echo "=== Build complete ==="
echo ""
echo "To deploy on server:"
echo "  1. Ensure backend/.env has all required secrets (JWT_SECRET, DB_PASSWORD, ADMIN_PASSWORD, CORS_ORIGINS)"
echo "  2. Database: migrations run automatically on startup via migrations.js"
echo "     Manual if needed:"
echo "       cd backend && npm run portal:migrate"
echo "       cd backend && npm run portal:seed"
echo "  3. Start: cd backend && node server.js"
echo "     Or PM2: PORT=5500 pm2 start backend/server.js --name dogan-consult-api"
echo "     Or systemd: sudo systemctl restart doganconsult"
echo ""
