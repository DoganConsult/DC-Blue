#!/bin/bash
# Start ERPNext bench services
# Requires: MariaDB and Redis running

# Ensure MariaDB is running
service mariadb start 2>/dev/null || systemctl start mariadb 2>/dev/null || true

# Ensure Redis is running
service redis-server start 2>/dev/null || systemctl start redis-server 2>/dev/null || true

# Start bench
cd /opt/erpnext
exec /usr/local/bin/bench start 2>&1
