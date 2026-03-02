#!/bin/bash

# Production Build Script for Dogan Consult Platform
# This script builds and optimizes both frontend and backend for production deployment

set -e

echo "=========================================="
echo "   Dogan Consult Production Build"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then
   echo -e "${YELLOW}Warning: Running as root is not recommended${NC}"
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js 18 or higher is required${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js version check passed"

# Create necessary directories
echo -e "${YELLOW}Creating production directories...${NC}"
sudo mkdir -p /var/log/dogan-consult
sudo mkdir -p /var/dogan-consult/uploads
sudo mkdir -p /var/dogan-consult/temp
sudo mkdir -p /var/backups/dogan-consult

# Set proper permissions
sudo chown -R $USER:$USER /var/log/dogan-consult
sudo chown -R $USER:$USER /var/dogan-consult
sudo chmod 755 /var/log/dogan-consult
sudo chmod 755 /var/dogan-consult/uploads

echo -e "${GREEN}✓${NC} Directories created"

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm ci --production
echo -e "${GREEN}✓${NC} Backend dependencies installed"

# Install additional production dependencies
npm install --save \
    winston \
    winston-daily-rotate-file \
    express-slow-down \
    express-mongo-sanitize \
    hpp \
    compression \
    pm2

echo -e "${GREEN}✓${NC} Production dependencies installed"

# Build frontend for production
echo -e "${YELLOW}Building frontend for production...${NC}"
cd ../frontend

# Install dependencies
npm ci

# Build with production configuration
npm run build -- --configuration=production \
    --optimization=true \
    --aot=true \
    --build-optimizer=true \
    --vendor-chunk=true \
    --common-chunk=true \
    --delete-output-path=true \
    --extract-licenses=true \
    --named-chunks=false \
    --output-hashing=all \
    --source-map=false \
    --stats-json=true

echo -e "${GREEN}✓${NC} Frontend built successfully"

# Analyze bundle size
if [ -f "dist/stats.json" ]; then
    echo -e "${YELLOW}Bundle Analysis:${NC}"
    npx webpack-bundle-analyzer dist/stats.json -m static -r dist/report.html -O
fi

# Copy frontend to backend public directory
echo -e "${YELLOW}Copying frontend to backend...${NC}"
cd ..
mkdir -p backend/public
cp -r frontend/dist/frontend/* backend/public/
echo -e "${GREEN}✓${NC} Frontend copied to backend"

# Create production environment file if not exists
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}Creating production environment template...${NC}"
    cp .env.production.template .env.production 2>/dev/null || echo -e "${YELLOW}Note: Please configure .env.production${NC}"
fi

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
cd backend
if [ -f "scripts/migrate.js" ]; then
    NODE_ENV=production node scripts/migrate.js
    echo -e "${GREEN}✓${NC} Database migrations completed"
else
    echo -e "${YELLOW}No migration script found${NC}"
fi

# Validate configuration
echo -e "${YELLOW}Validating configuration...${NC}"
NODE_ENV=production node -e "
const config = require('./config/production.js').config;
if (!config.security.jwtSecret || config.security.jwtSecret.includes('CHANGE_THIS')) {
    console.error('\x1b[31mError: JWT_SECRET not configured in .env.production\x1b[0m');
    process.exit(1);
}
if (!config.database.password || config.database.password.includes('CHANGE_THIS')) {
    console.error('\x1b[31mError: Database password not configured in .env.production\x1b[0m');
    process.exit(1);
}
console.log('\x1b[32m✓\x1b[0m Configuration validated');
"

# Test database connection
echo -e "${YELLOW}Testing database connection...${NC}"
NODE_ENV=production node -e "
import db from './database/pool.js';
db.initialize().then(() => {
    console.log('\x1b[32m✓\x1b[0m Database connection successful');
    process.exit(0);
}).catch(err => {
    console.error('\x1b[31mError: Database connection failed:\x1b[0m', err.message);
    process.exit(1);
});
"

# Generate PM2 startup script
echo -e "${YELLOW}Setting up PM2...${NC}"
cd ..
pm2 startup systemd -u $USER --hp $HOME
pm2 save

# Create health check script
cat > /tmp/health-check.sh << 'EOF'
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health)
if [ $response -eq 200 ]; then
    echo "Health check passed"
    exit 0
else
    echo "Health check failed with status: $response"
    exit 1
fi
EOF

chmod +x /tmp/health-check.sh
sudo mv /tmp/health-check.sh /usr/local/bin/dogan-health-check

# Create backup script
cat > /tmp/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/dogan-consult"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="dogan_consult_prod"

# Database backup
pg_dump -U dogan_prod_user -d $DB_NAME -f "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
gzip "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# File backup
tar czf "$BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz" /var/dogan-consult/uploads/

# Remove old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $TIMESTAMP"
EOF

chmod +x /tmp/backup.sh
sudo mv /tmp/backup.sh /usr/local/bin/dogan-backup

# Set up cron job for backups
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/dogan-backup") | crontab -

# Create log rotation config
sudo tee /etc/logrotate.d/dogan-consult > /dev/null << EOF
/var/log/dogan-consult/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 $USER $USER
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

echo -e "${GREEN}✓${NC} Log rotation configured"

# Final summary
echo ""
echo "=========================================="
echo -e "${GREEN}   Production Build Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review and update .env.production with your production values"
echo "2. Set up your PostgreSQL database"
echo "3. Configure your firewall (allow ports 80, 443, 4000)"
echo "4. Set up SSL certificates"
echo "5. Start the application with: pm2 start ecosystem.config.js --env production"
echo ""
echo "Useful commands:"
echo "  pm2 start ecosystem.config.js --env production  # Start application"
echo "  pm2 status                                       # Check status"
echo "  pm2 logs                                          # View logs"
echo "  pm2 monit                                         # Monitor application"
echo "  dogan-health-check                                # Run health check"
echo "  dogan-backup                                      # Manual backup"
echo ""
echo -e "${GREEN}Build completed successfully!${NC}"