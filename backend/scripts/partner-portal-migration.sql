-- Partner Portal Enhancement Migration
-- Adds tables for notifications, messages, feedback, resources, achievements, email preferences

-- Partner notifications
CREATE TABLE IF NOT EXISTS partner_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'info', -- info, commission, pipeline, sla, system, achievement
  title TEXT NOT NULL,
  body TEXT,
  link VARCHAR(500),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_partner_notifications_partner ON partner_notifications(partner_id, read, created_at DESC);

-- Partner messages (between partner and account manager)
CREATE TABLE IF NOT EXISTS partner_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  sender VARCHAR(50) NOT NULL DEFAULT 'partner', -- partner, manager
  sender_name VARCHAR(255),
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_partner_messages_partner ON partner_messages(partner_id, created_at DESC);

-- Partner feedback
CREATE TABLE IF NOT EXISTS partner_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  category VARCHAR(100), -- portal, support, commissions, pipeline, general
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner resources (admin-uploaded docs, guides, templates)
CREATE TABLE IF NOT EXISTS partner_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'guide', -- guide, template, policy, training, marketing
  url VARCHAR(1000),
  file_type VARCHAR(50), -- pdf, docx, xlsx, pptx, video, link
  tier_required VARCHAR(50) DEFAULT 'registered', -- registered, silver, gold, platinum
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner achievements/milestones
CREATE TABLE IF NOT EXISTS partner_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  achievement_key VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  icon VARCHAR(10), -- emoji
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(partner_id, achievement_key)
);
CREATE INDEX IF NOT EXISTS idx_partner_achievements_partner ON partner_achievements(partner_id);

-- Partner email preferences
CREATE TABLE IF NOT EXISTS partner_email_preferences (
  partner_id UUID PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  monthly_report BOOLEAN DEFAULT TRUE,
  commission_alerts BOOLEAN DEFAULT TRUE,
  pipeline_updates BOOLEAN DEFAULT TRUE,
  sla_warnings BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add profile fields to partners if not exist
DO $$ BEGIN
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS bio TEXT;
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS logo_url VARCHAR(1000);
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS city VARCHAR(255);
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS country VARCHAR(10) DEFAULT 'SA';
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS address_line TEXT;
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS specializations TEXT[] DEFAULT '{}';
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS onboarding_step INT DEFAULT 0;
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS total_leads INT DEFAULT 0;
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS total_won INT DEFAULT 0;
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS total_commission NUMERIC(12,2) DEFAULT 0;
END $$;
