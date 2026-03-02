-- Add optional user_id column to lead_intakes
-- Links inquiries to registered user accounts when submitted while logged in.
-- NULL = anonymous submission (preserving existing public flow).
ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_lead_intakes_user_id ON lead_intakes (user_id);
