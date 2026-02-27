-- ============================================================
-- Consolidated migration: guide-docs implementation
-- Run after plrp-migration.sql. Safe to run multiple times (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
-- Use: psql -h HOST -U USER -d DATABASE -f consolidated-migration.sql
-- ============================================================

-- ----- partners: optional company_website (used by register) -----
ALTER TABLE partners ADD COLUMN IF NOT EXISTS company_website VARCHAR(256);
-- ----- partners: partner type from form (reseller | referral | technology) -----
ALTER TABLE partners ADD COLUMN IF NOT EXISTS partner_type VARCHAR(32);

-- ----- lead_intakes: columns from lead-intakes-extend + compatibility -----
ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS address_line VARCHAR(512);
ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS company_size VARCHAR(64);
ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS expected_decision_date DATE;
ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS conditions_notes TEXT;

-- If your schema uses "website" and backend expects "company_website", add company_website and backfill (optional)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lead_intakes' AND column_name = 'company_website') THEN
    ALTER TABLE lead_intakes ADD COLUMN company_website VARCHAR(256);
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lead_intakes' AND column_name = 'website') THEN
      UPDATE lead_intakes SET company_website = website WHERE website IS NOT NULL;
    END IF;
  END IF;
END $$;

-- ----- partner_leads: approval workflow columns -----
ALTER TABLE partner_leads ADD COLUMN IF NOT EXISTS exclusivity_start_at TIMESTAMPTZ;
ALTER TABLE partner_leads ADD COLUMN IF NOT EXISTS approved_by VARCHAR(256);
ALTER TABLE partner_leads ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE partner_leads ADD COLUMN IF NOT EXISTS rejected_reason TEXT;

-- Normalize status: use 'approved' (docs say accepted; we use approved)
-- UPDATE partner_leads SET status = 'approved' WHERE status = 'accepted';  -- uncomment if you had 'accepted'

-- ----- opportunities: ensure closed_at on close -----
-- (already in plrp-migration; no change needed)

-- ----- lead_assign_rules: default rule exists from plrp-migration -----
-- INSERT default if none (idempotent by convention)
INSERT INTO lead_assign_rules (product_line, vertical, city, assign_to, priority)
SELECT NULL, NULL, NULL, 'sales@doganconsult.com', 0
WHERE NOT EXISTS (SELECT 1 FROM lead_assign_rules LIMIT 1);
