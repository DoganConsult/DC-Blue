-- Add theme preference column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS theme_preference VARCHAR(50) DEFAULT 'trust-blueprint';

-- Create settings table for platform-wide settings
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default platform theme if not exists
INSERT INTO settings (key, value, updated_at)
VALUES ('platform_theme', 'trust-blueprint', NOW())
ON CONFLICT (key) DO NOTHING;

-- Add index on settings key for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);