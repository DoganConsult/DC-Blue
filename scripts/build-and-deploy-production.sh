#!/usr/bin/env bash
# Build and prepare for production deploy. Run from repo root.
set -e
cd "$(dirname "$0")/.."
echo "=== Dogan Consult Hup — production build ==="

echo "[1/3] Frontend (Angular production)..."
cd frontend
npm ci --quiet
npm run build -- --configuration production
cd ..
echo "    → frontend/dist/dogan-consult-web/browser"

echo "[2/3] Backend deps..."
cd backend
npm ci --quiet
cd ..

echo "[3/3] Verify static dir..."
if [ ! -d "frontend/dist/dogan-consult-web/browser" ]; then
  echo "ERROR: frontend/dist/dogan-consult-web/browser not found"
  exit 1
fi
echo "    → OK"

echo ""
echo "=== Build complete. To deploy on server ==="
echo "1. Copy repo (or git pull) on server."
echo "2. Database: run migrations if not already:"
echo "   psql -h HOST -U USER -d doganconsult -f backend/scripts/plrp-migration.sql"
echo "   psql -h HOST -U USER -d doganconsult -f backend/scripts/consolidated-migration.sql"
echo "   cd backend && npm run portal:migrate   # portal_users table"
echo "   cd backend && npm run portal:seed      # first admin (optional; needs ADMIN_PASSWORD or PORTAL_* in env)"
echo "3. Set env: DATABASE_URL (or DB_*), ADMIN_PASSWORD, PORT=4000"
echo "4. Start: cd backend && node server.js"
echo "   Or restart systemd: sudo systemctl restart doganconsult"
echo ""
