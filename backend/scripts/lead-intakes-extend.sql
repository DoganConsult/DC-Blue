-- ============================================================
-- Lead registration extensions: address, company size,
-- expected decision/signature date, conditions notes.
-- Run after plrp-migration.sql (or on existing lead_intakes).
-- ============================================================

-- Address (single line; for full address use address_line + city + country)
ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS address_line VARCHAR(512);

-- Company size (employee count band) — experience/scale signal
ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS company_size VARCHAR(64);

-- Expected decision or signature date — when lead expects to decide/sign
ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS expected_decision_date DATE;

-- Conditions / requirements the lead needs (terms, compliance, etc.)
ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS conditions_notes TEXT;

-- Ensure website column exists for backward compatibility (some envs use company_website as alias)
-- DO NOT drop website; if your app uses company_website, add: ALTER TABLE lead_intakes RENAME COLUMN website TO company_website; (one-time)
