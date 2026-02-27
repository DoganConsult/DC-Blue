-- ============================================================
-- PLRP + DLI Migration — Partner Lead Registration Program
-- & Customer Interest / Inquiry Intake
-- ============================================================

-- 1. Core lead intake (public inquiry form submissions)
CREATE TABLE IF NOT EXISTS lead_intakes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Source tracking
  source          VARCHAR(64)   NOT NULL DEFAULT 'website',     -- website | partner | referral | event
  campaign_tag    VARCHAR(128),

  -- Product/service interest
  product_line    VARCHAR(128),     -- e.g. "Network & Data Center", "Cybersecurity"
  vertical        VARCHAR(128),     -- e.g. "Banking", "Healthcare", "Government"

  -- Company info
  company_name    VARCHAR(256)  NOT NULL,
  cr_number       VARCHAR(64),      -- Saudi CR / trade license
  website         VARCHAR(256),
  city            VARCHAR(128),
  country         VARCHAR(64)   DEFAULT 'SA',

  -- Contact info
  contact_name    VARCHAR(256)  NOT NULL,
  contact_title   VARCHAR(128),
  contact_email   VARCHAR(256)  NOT NULL,
  contact_phone   VARCHAR(64),
  department      VARCHAR(128),

  -- Qualification signals
  expected_users  VARCHAR(64),      -- e.g. "1-50", "51-200", "201-1000", "1000+"
  budget_range    VARCHAR(64),      -- e.g. "< 50K SAR", "50K-200K", "200K-1M", "1M+"
  timeline        VARCHAR(64),      -- e.g. "Immediate", "1-3 months", "3-6 months", "6+ months"
  message         TEXT,

  -- Consent
  consent_pdpl    BOOLEAN       NOT NULL DEFAULT false,

  -- Internal processing
  status          VARCHAR(32)   NOT NULL DEFAULT 'new',         -- new | qualified | contacted | proposal | won | lost | duplicate | spam
  score           INT           DEFAULT 0,
  dedupe_hash     VARCHAR(64),
  assigned_to     VARCHAR(256),
  converted_at    TIMESTAMPTZ,
  ticket_number   VARCHAR(32)   UNIQUE,

  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_intakes_email     ON lead_intakes (contact_email);
CREATE INDEX IF NOT EXISTS idx_lead_intakes_status    ON lead_intakes (status);
CREATE INDEX IF NOT EXISTS idx_lead_intakes_dedupe    ON lead_intakes (dedupe_hash);
CREATE INDEX IF NOT EXISTS idx_lead_intakes_created   ON lead_intakes (created_at DESC);

-- 2. Opportunities (converted leads)
CREATE TABLE IF NOT EXISTS opportunities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_intake_id  UUID REFERENCES lead_intakes(id) ON DELETE SET NULL,
  title           VARCHAR(256)  NOT NULL,
  stage           VARCHAR(32)   NOT NULL DEFAULT 'discovery', -- discovery | proposal | negotiation | closed_won | closed_lost
  owner           VARCHAR(256),
  estimated_value NUMERIC(14,2) DEFAULT 0,
  currency        VARCHAR(3)    DEFAULT 'SAR',
  probability     INT           DEFAULT 10,
  next_action     TEXT,
  next_action_at  TIMESTAMPTZ,
  closed_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- 3. Activity log / timeline on a lead
CREATE TABLE IF NOT EXISTS lead_activities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_intake_id  UUID NOT NULL REFERENCES lead_intakes(id) ON DELETE CASCADE,
  type            VARCHAR(32)   NOT NULL,  -- note | email | call | status_change | assignment | system
  body            TEXT,
  created_by      VARCHAR(256)  DEFAULT 'system',
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities (lead_intake_id, created_at DESC);

-- 4. Auto-assign rules
CREATE TABLE IF NOT EXISTS lead_assign_rules (
  id              SERIAL PRIMARY KEY,
  product_line    VARCHAR(128),
  vertical        VARCHAR(128),
  city            VARCHAR(128),
  assign_to       VARCHAR(256) NOT NULL,
  priority        INT DEFAULT 0,
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Partners (PLRP)
CREATE TABLE IF NOT EXISTS partners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name    VARCHAR(256) NOT NULL,
  contact_name    VARCHAR(256) NOT NULL,
  contact_email   VARCHAR(256) NOT NULL UNIQUE,
  contact_phone   VARCHAR(64),
  tier            VARCHAR(32) DEFAULT 'registered',  -- registered | silver | gold | platinum
  status          VARCHAR(32) DEFAULT 'pending',     -- pending | approved | suspended | rejected
  api_key         VARCHAR(128) UNIQUE,
  commission_rate NUMERIC(5,2) DEFAULT 10.00,        -- percentage
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Partner-submitted leads
CREATE TABLE IF NOT EXISTS partner_leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  lead_intake_id  UUID REFERENCES lead_intakes(id) ON DELETE SET NULL,
  status          VARCHAR(32) DEFAULT 'submitted',  -- submitted | accepted | rejected | converted
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_leads_partner ON partner_leads (partner_id, created_at DESC);

-- 7. Commission tracking
CREATE TABLE IF NOT EXISTS commissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  opportunity_id  UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  amount          NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency        VARCHAR(3) DEFAULT 'SAR',
  status          VARCHAR(32) DEFAULT 'pending',  -- pending | approved | paid
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed a default assign rule
INSERT INTO lead_assign_rules (product_line, vertical, city, assign_to, priority)
VALUES (NULL, NULL, NULL, 'sales@doganconsult.com', 0)
ON CONFLICT DO NOTHING;
