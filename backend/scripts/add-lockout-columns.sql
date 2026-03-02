-- Add lockout columns to users for login attempt tracking (run on existing DBs that lack these columns)
ALTER TABLE users ADD COLUMN IF NOT EXISTS access_failed_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS lockout_end TIMESTAMP;
