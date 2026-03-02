-- Partner Communication Enhancement Migration
-- Adds visibility control to lead_activities and message_alerts email preference

-- 1. Add visibility column to lead_activities
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'internal';
-- Values: 'internal' (admin-only) | 'partner' (visible to partner)

CREATE INDEX IF NOT EXISTS idx_lead_activities_visibility 
  ON lead_activities(lead_intake_id, visibility, created_at DESC);

-- 2. Add message_alerts preference
ALTER TABLE partner_email_preferences 
  ADD COLUMN IF NOT EXISTS message_alerts BOOLEAN DEFAULT TRUE;

-- 3. Set existing system/status_change activities as partner-visible (they're informational)
UPDATE lead_activities 
  SET visibility = 'partner' 
  WHERE type IN ('status_change', 'system') AND visibility = 'internal';
