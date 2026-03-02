#!/bin/bash

# Cloudflare Tunnel Production Deployment Script
# This script sets up and deploys the application with Cloudflare Tunnel

set -e

echo "=========================================="
echo "   Cloudflare Tunnel Production Deploy"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must run from project root directory${NC}"
    exit 1
fi

# Step 1: Build Production Application
echo -e "${YELLOW}Step 1: Building production application...${NC}"
if [ ! -d "backend/public" ]; then
    echo "Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
    mkdir -p backend/public
    cp -r frontend/dist/frontend/* backend/public/
    echo -e "${GREEN}✓${NC} Frontend built and copied"
fi

# Step 2: Install backend dependencies
echo -e "${YELLOW}Step 2: Installing production dependencies...${NC}"
cd backend
npm install --production
cd ..
echo -e "${GREEN}✓${NC} Dependencies installed"

# Step 3: Start PM2 Application
echo -e "${YELLOW}Step 3: Starting application with PM2...${NC}"
pm2 stop dogan-consult-api 2>/dev/null || true
pm2 delete dogan-consult-api 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
echo -e "${GREEN}✓${NC} Application started with PM2"

# Step 4: Verify application is running
echo -e "${YELLOW}Step 4: Verifying application health...${NC}"
sleep 5
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health)
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✓${NC} Application is healthy"
else
    echo -e "${RED}Error: Application health check failed (HTTP $response)${NC}"
    pm2 logs dogan-consult-api --lines 50 --nostream
    exit 1
fi

# Step 5: Configure Cloudflare Tunnel
echo -e "${YELLOW}Step 5: Setting up Cloudflare Tunnel...${NC}"

# Check if tunnel exists or needs authentication
if [ ! -f "$HOME/.cloudflared/cert.pem" ]; then
    echo -e "${BLUE}Please authenticate with Cloudflare:${NC}"
    cloudflared tunnel login
    echo -e "${GREEN}✓${NC} Cloudflare authenticated"
fi

# Create tunnel if it doesn't exist
TUNNEL_NAME="dogan-consult-prod"
TUNNEL_ID=$(cloudflared tunnel list --output json 2>/dev/null | jq -r ".[] | select(.name==\"$TUNNEL_NAME\") | .id" || echo "")

if [ -z "$TUNNEL_ID" ]; then
    echo "Creating new tunnel: $TUNNEL_NAME"
    cloudflared tunnel create $TUNNEL_NAME
    TUNNEL_ID=$(cloudflared tunnel list --output json | jq -r ".[] | select(.name==\"$TUNNEL_NAME\") | .id")
    echo -e "${GREEN}✓${NC} Tunnel created: $TUNNEL_ID"
else
    echo -e "${GREEN}✓${NC} Using existing tunnel: $TUNNEL_ID"
fi

# Step 6: Create tunnel configuration
echo -e "${YELLOW}Step 6: Creating tunnel configuration...${NC}"
cat > cloudflared-config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: $HOME/.cloudflared/$TUNNEL_ID.json

ingress:
  # API routes
  - hostname: api.doganconsult.com
    service: http://localhost:4000
    originRequest:
      noTLSVerify: false
      connectTimeout: 30s
      tcpKeepAlive: 30s
      keepAliveConnections: 100
      keepAliveTimeout: 90s
      httpHostHeader: "api.doganconsult.com"
      originServerName: "api.doganconsult.com"

  # Main website
  - hostname: doganconsult.com
    service: http://localhost:4000
    originRequest:
      noTLSVerify: false
      connectTimeout: 30s
      tcpKeepAlive: 30s

  # WWW redirect
  - hostname: www.doganconsult.com
    service: http://localhost:4000
    originRequest:
      noTLSVerify: false

  # Health check endpoint
  - hostname: health.doganconsult.com
    path: /health
    service: http://localhost:4000

  # Catch-all rule
  - service: http_status:404
EOF
echo -e "${GREEN}✓${NC} Configuration created"

# Step 7: Route DNS (if not already routed)
echo -e "${YELLOW}Step 7: Setting up DNS routing...${NC}"
echo -e "${BLUE}Run these commands to route your domain:${NC}"
echo ""
echo "cloudflared tunnel route dns $TUNNEL_NAME doganconsult.com"
echo "cloudflared tunnel route dns $TUNNEL_NAME www.doganconsult.com"
echo "cloudflared tunnel route dns $TUNNEL_NAME api.doganconsult.com"
echo "cloudflared tunnel route dns $TUNNEL_NAME health.doganconsult.com"
echo ""
echo -e "${YELLOW}Note: Only run if DNS is not already configured${NC}"

# Step 8: Start tunnel
echo -e "${YELLOW}Step 8: Starting Cloudflare Tunnel...${NC}"

# Stop existing tunnel if running
pkill cloudflared 2>/dev/null || true
sleep 2

# Start tunnel in background
nohup cloudflared tunnel --config cloudflared-config.yml run $TUNNEL_NAME > cloudflared.log 2>&1 &
echo $! > cloudflared.pid
echo -e "${GREEN}✓${NC} Tunnel started (PID: $(cat cloudflared.pid))"

# Wait for tunnel to establish
echo "Waiting for tunnel to establish..."
sleep 10

# Step 9: Create systemd service for tunnel
echo -e "${YELLOW}Step 9: Creating systemd service...${NC}"
cat > cloudflared.service << EOF
[Unit]
Description=Cloudflare Tunnel for Dogan Consult
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PWD
ExecStart=/usr/local/bin/cloudflared tunnel --config $PWD/cloudflared-config.yml run $TUNNEL_NAME
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=cloudflared

[Install]
WantedBy=multi-user.target
EOF

echo -e "${BLUE}To install as system service, run:${NC}"
echo "sudo cp cloudflared.service /etc/systemd/system/"
echo "sudo systemctl daemon-reload"
echo "sudo systemctl enable cloudflared"
echo "sudo systemctl start cloudflared"

# Step 10: Display status
echo ""
echo "=========================================="
echo -e "${GREEN}   Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo -e "${GREEN}Application Status:${NC}"
pm2 status
echo ""
echo -e "${GREEN}Tunnel Status:${NC}"
if [ -f cloudflared.pid ]; then
    PID=$(cat cloudflared.pid)
    if ps -p $PID > /dev/null; then
        echo "Tunnel is running (PID: $PID)"
        echo "Check logs: tail -f cloudflared.log"
    else
        echo -e "${RED}Tunnel process not found${NC}"
    fi
fi
echo ""
echo -e "${GREEN}Access your application at:${NC}"
echo "  • https://doganconsult.com"
echo "  • https://api.doganconsult.com"
echo "  • https://health.doganconsult.com/health"
echo ""
echo -e "${YELLOW}Important Commands:${NC}"
echo "  pm2 status              - Check app status"
echo "  pm2 logs                - View app logs"
echo "  pm2 restart all         - Restart application"
echo "  tail -f cloudflared.log - View tunnel logs"
echo "  kill \$(cat cloudflared.pid) - Stop tunnel"
echo ""
echo -e "${GREEN}✨ Your application is now live!${NC}"