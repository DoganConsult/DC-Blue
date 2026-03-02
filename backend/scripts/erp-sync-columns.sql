-- Add ERP sync tracking columns to all entity tables that sync with ERPNext
-- erp_sync_id: The ERPNext document name (e.g., 'LEAD-00001')
-- erp_sync_at: When the entity was last synced

ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS erp_sync_id VARCHAR(140);
ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS erp_sync_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_lead_intakes_erp ON lead_intakes(erp_sync_id) WHERE erp_sync_id IS NOT NULL;

ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS erp_sync_id VARCHAR(140);
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS erp_sync_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_opportunities_erp ON opportunities(erp_sync_id) WHERE erp_sync_id IS NOT NULL;

ALTER TABLE projects ADD COLUMN IF NOT EXISTS erp_sync_id VARCHAR(140);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS erp_sync_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_projects_erp ON projects(erp_sync_id) WHERE erp_sync_id IS NOT NULL;

ALTER TABLE contracts ADD COLUMN IF NOT EXISTS erp_sync_id VARCHAR(140);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS erp_sync_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_contracts_erp ON contracts(erp_sync_id) WHERE erp_sync_id IS NOT NULL;

ALTER TABLE tenders ADD COLUMN IF NOT EXISTS erp_sync_id VARCHAR(140);
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS erp_sync_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_tenders_erp ON tenders(erp_sync_id) WHERE erp_sync_id IS NOT NULL;

-- Admin settings table for storing ERP config
CREATE TABLE IF NOT EXISTS admin_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
