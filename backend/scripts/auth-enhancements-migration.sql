-- ============================================================
-- Auth Enhancements: Password Reset Tokens + MFA Codes
-- Run: psql -h HOST -U USER -d DATABASE -f auth-enhancements-migration.sql
-- Safe to run multiple times (IF NOT EXISTS / DO blocks).
-- ============================================================

-- 1. Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  user_table  VARCHAR(32) NOT NULL DEFAULT 'users',
  token_hash  VARCHAR(256) NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prt_token ON password_reset_tokens (token_hash) WHERE used = false;
CREATE INDEX IF NOT EXISTS idx_prt_user  ON password_reset_tokens (user_id, user_table);

-- 2. MFA codes (email-based OTP)
CREATE TABLE IF NOT EXISTS mfa_codes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  user_table  VARCHAR(32) NOT NULL DEFAULT 'users',
  code_hash   VARCHAR(256) NOT NULL,
  purpose     VARCHAR(32) NOT NULL DEFAULT 'login',
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mfa_user ON mfa_codes (user_id, user_table) WHERE used = false;

-- 3. Add mfa_enabled to users
DO $$ BEGIN
  ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 4. Add mfa_enabled to portal_users
DO $$ BEGIN
  ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 5. Add 'employee' to users role check constraint (if not present)
DO $$ BEGIN
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('admin', 'partner', 'customer', 'staff', 'employee'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Run as superuser to grant privileges:
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO doganconsult;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO doganconsult;
