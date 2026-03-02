-- Add approval workflow columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Existing users are auto-approved
UPDATE users SET approval_status = 'approved' WHERE approval_status IS NULL OR approval_status = 'pending';

-- Admin/employee accounts are always approved
UPDATE users SET approval_status = 'approved' WHERE role IN ('admin', 'employee');

-- Index for quick filtering
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status);
