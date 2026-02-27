-- ============================================================
-- Portal users: employee + admin login for Dogan Consult internal portal
-- Run after consolidated-migration.sql. Safe to run multiple times.
-- Use: psql -h HOST -U USER -d DATABASE -f portal-users-migration.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS portal_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(256) NOT NULL UNIQUE,
  password_hash VARCHAR(256) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  name VARCHAR(256),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portal_users_email ON portal_users (LOWER(email));

-- Optional: seed first admin (set a real password in app after first login)
-- INSERT INTO portal_users (email, password_hash, role, name)
-- SELECT 'admin@doganconsult.com', '$2a$10$...', 'admin', 'Admin'
-- WHERE NOT EXISTS (SELECT 1 FROM portal_users WHERE role = 'admin' LIMIT 1);
