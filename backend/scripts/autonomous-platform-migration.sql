-- ============================================================
-- Autonomous Platform Migration
-- Gate checklists, engagements, file uploads, enhanced partners
-- ============================================================

-- 1. Gate checklist definitions per opportunity stage
CREATE TABLE IF NOT EXISTS gate_definitions (
  id              SERIAL PRIMARY KEY,
  stage           VARCHAR(32) NOT NULL,
  item_key        VARCHAR(128) NOT NULL,
  label_en        VARCHAR(256) NOT NULL,
  label_ar        VARCHAR(256),
  required        BOOLEAN DEFAULT true,
  display_order   INT DEFAULT 0,
  UNIQUE(stage, item_key)
);

-- 2. Gate checklist items per opportunity
CREATE TABLE IF NOT EXISTS gate_checklist_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id  UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  gate_def_id     INT REFERENCES gate_definitions(id) ON DELETE SET NULL,
  stage           VARCHAR(32) NOT NULL,
  item_key        VARCHAR(128) NOT NULL,
  label           VARCHAR(256) NOT NULL,
  checked         BOOLEAN DEFAULT false,
  checked_by      VARCHAR(256),
  checked_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gate_checklist_opp ON gate_checklist_items (opportunity_id, stage);

-- 3. Engagements (delivery lifecycle post-close)
CREATE TABLE IF NOT EXISTS engagements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id  UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  lead_intake_id  UUID REFERENCES lead_intakes(id) ON DELETE SET NULL,
  title           VARCHAR(256) NOT NULL,
  phase           VARCHAR(32) NOT NULL DEFAULT 'qualify',
  owner           VARCHAR(256),
  activity_code   VARCHAR(16),
  country_code    VARCHAR(2) DEFAULT 'SA',
  scope_notes     TEXT,
  started_at      TIMESTAMPTZ DEFAULT now(),
  closed_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Engagement checklist items (from matrix)
CREATE TABLE IF NOT EXISTS engagement_checklist_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id   UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  category        VARCHAR(64) NOT NULL,
  label           VARCHAR(256) NOT NULL,
  checked         BOOLEAN DEFAULT false,
  checked_by      VARCHAR(256),
  checked_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_engagement_checklist ON engagement_checklist_items (engagement_id);

-- 5. File uploads (evidence, documents)
CREATE TABLE IF NOT EXISTS file_uploads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type     VARCHAR(32) NOT NULL,
  entity_id       UUID NOT NULL,
  filename        VARCHAR(512) NOT NULL,
  original_name   VARCHAR(512) NOT NULL,
  mime_type       VARCHAR(128),
  size_bytes      BIGINT,
  uploaded_by     VARCHAR(256) DEFAULT 'system',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_file_uploads_entity ON file_uploads (entity_type, entity_id);

-- 6. Email log
CREATE TABLE IF NOT EXISTS email_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient       VARCHAR(256) NOT NULL,
  template        VARCHAR(64) NOT NULL,
  subject         VARCHAR(512),
  status          VARCHAR(16) DEFAULT 'sent',
  error_message   TEXT,
  entity_type     VARCHAR(32),
  entity_id       UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Scheduled tasks log
CREATE TABLE IF NOT EXISTS scheduled_tasks_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name       VARCHAR(128) NOT NULL,
  status          VARCHAR(16) DEFAULT 'completed',
  details         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Add missing columns to partners (if not present)
DO $$ BEGIN
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS company_website VARCHAR(256);
  ALTER TABLE partners ADD COLUMN IF NOT EXISTS partner_type VARCHAR(32) DEFAULT 'referral';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 9. Add missing columns to partner_leads
DO $$ BEGIN
  ALTER TABLE partner_leads ADD COLUMN IF NOT EXISTS exclusivity_start_at TIMESTAMPTZ;
  ALTER TABLE partner_leads ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
  ALTER TABLE partner_leads ADD COLUMN IF NOT EXISTS approved_by VARCHAR(256);
  ALTER TABLE partner_leads ADD COLUMN IF NOT EXISTS rejected_reason TEXT;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 10. Add missing columns to lead_intakes
DO $$ BEGIN
  ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS company_website VARCHAR(256);
  ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS contact_department VARCHAR(128);
  ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS address_line VARCHAR(512);
  ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS company_size VARCHAR(64);
  ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS expected_decision_date DATE;
  ALTER TABLE lead_intakes ADD COLUMN IF NOT EXISTS conditions_notes TEXT;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 11. Portal users (if not created yet)
CREATE TABLE IF NOT EXISTS portal_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(256) NOT NULL UNIQUE,
  password_hash   VARCHAR(256) NOT NULL,
  name            VARCHAR(256),
  role            VARCHAR(32) DEFAULT 'employee',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Seed gate definitions for opportunity stages
INSERT INTO gate_definitions (stage, item_key, label_en, label_ar, required, display_order) VALUES
  ('discovery', 'need_confirmed', 'Need / pain confirmed', 'تم تأكيد الحاجة', true, 1),
  ('discovery', 'budget_confirmed', 'Budget confirmed or estimated', 'تم تأكيد الميزانية', true, 2),
  ('discovery', 'timeline_confirmed', 'Timeline confirmed', 'تم تأكيد الجدول الزمني', true, 3),
  ('discovery', 'decision_maker', 'Decision maker identified', 'تم تحديد صانع القرار', true, 4),
  ('discovery', 'regulatory_loaded', 'Regulatory context loaded from matrix', 'تم تحميل السياق التنظيمي', false, 5),
  ('proposal', 'proposal_sent', 'Proposal with regulatory annex sent', 'تم إرسال العرض مع الملحق التنظيمي', true, 1),
  ('proposal', 'client_responded', 'Client responded or meeting scheduled', 'رد العميل أو تم جدولة اجتماع', true, 2),
  ('proposal', 'annex_attached', 'Regulatory annex attached', 'تم إرفاق الملحق التنظيمي', false, 3),
  ('negotiation', 'contract_drafted', 'Contract/NDA with annex drafted', 'تم إعداد العقد/اتفاقية السرية', true, 1),
  ('negotiation', 'contract_signed', 'Contract signed', 'تم توقيع العقد', true, 2),
  ('negotiation', 'sow_agreed', 'SOW or first invoice agreed', 'تم الاتفاق على بيان العمل', true, 3)
ON CONFLICT (stage, item_key) DO NOTHING;
