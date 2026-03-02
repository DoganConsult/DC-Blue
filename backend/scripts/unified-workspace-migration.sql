-- Unified Workspace Migration
-- Adds tables for CRM, Tendering, Solution Design, PMO, Maintenance/Renewals, Demo/POC, and Client Messaging

-- 1. Link partners to user accounts (allows JWT auth for partners too)
ALTER TABLE partners ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id) WHERE user_id IS NOT NULL;

-- 2. Ensure engagements table exists (may be missing if autonomous-platform-migration was not registered)
CREATE TABLE IF NOT EXISTS engagements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id),
  lead_intake_id UUID REFERENCES lead_intakes(id),
  title VARCHAR(255),
  phase VARCHAR(50) DEFAULT 'initiation',
  owner VARCHAR(255),
  activity_code VARCHAR(20),
  country_code VARCHAR(5) DEFAULT 'SA',
  scope_notes TEXT,
  started_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ensure gate system tables exist
CREATE TABLE IF NOT EXISTS gate_definitions (
  id SERIAL PRIMARY KEY,
  stage VARCHAR(50) NOT NULL,
  item_key VARCHAR(100) NOT NULL,
  label_en TEXT NOT NULL,
  label_ar TEXT,
  required BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  UNIQUE(stage, item_key)
);

CREATE TABLE IF NOT EXISTS gate_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id),
  gate_def_id INT REFERENCES gate_definitions(id),
  stage VARCHAR(50),
  item_key VARCHAR(100),
  label TEXT,
  checked BOOLEAN DEFAULT false,
  checked_by VARCHAR(255),
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS engagement_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  engagement_id UUID REFERENCES engagements(id),
  category VARCHAR(100),
  label TEXT,
  checked BOOLEAN DEFAULT false,
  checked_by VARCHAR(255),
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Client messages (unified messaging between client and team)
CREATE TABLE IF NOT EXISTS client_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  opportunity_id UUID REFERENCES opportunities(id),
  sender VARCHAR(20) DEFAULT 'client',
  sender_name VARCHAR(255),
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_client_messages_user ON client_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_messages_opp ON client_messages(opportunity_id, created_at DESC);

-- 5. Client notifications
CREATE TABLE IF NOT EXISTS client_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  title VARCHAR(255),
  body TEXT,
  link VARCHAR(500),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_client_notif_user ON client_notifications(user_id, read, created_at DESC);

-- 6. Tenders / RFP tracking
CREATE TABLE IF NOT EXISTS tenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id),
  lead_intake_id UUID REFERENCES lead_intakes(id),
  user_id UUID REFERENCES users(id),
  title VARCHAR(500) NOT NULL,
  rfp_number VARCHAR(100),
  issuing_entity VARCHAR(255),
  tender_type VARCHAR(50) DEFAULT 'open',
  submission_deadline TIMESTAMPTZ,
  budget_estimate NUMERIC(15,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  status VARCHAR(50) DEFAULT 'identified',
  bid_bond_required BOOLEAN DEFAULT false,
  bid_bond_amount NUMERIC(15,2),
  technical_score NUMERIC(5,2),
  financial_score NUMERIC(5,2),
  requirements TEXT,
  our_solution_summary TEXT,
  submission_notes TEXT,
  result_notes TEXT,
  awarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tenders_opp ON tenders(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_tenders_user ON tenders(user_id);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);

-- 7. Solution designs
CREATE TABLE IF NOT EXISTS solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id),
  tender_id UUID REFERENCES tenders(id),
  title VARCHAR(500) NOT NULL,
  version INT DEFAULT 1,
  architecture_type VARCHAR(100),
  tech_stack TEXT,
  scope_description TEXT,
  deliverables TEXT,
  assumptions TEXT,
  constraints TEXT,
  estimated_effort_days INT,
  estimated_cost NUMERIC(15,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  status VARCHAR(50) DEFAULT 'draft',
  approved_by VARCHAR(255),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_solutions_opp ON solutions(opportunity_id);

-- 8. Projects (PMO)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id),
  engagement_id UUID REFERENCES engagements(id),
  user_id UUID REFERENCES users(id),
  title VARCHAR(500) NOT NULL,
  project_code VARCHAR(50),
  status VARCHAR(50) DEFAULT 'planning',
  phase VARCHAR(50) DEFAULT 'initiation',
  start_date DATE,
  end_date DATE,
  actual_start DATE,
  actual_end DATE,
  budget NUMERIC(15,2),
  actual_cost NUMERIC(15,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  progress_pct INT DEFAULT 0,
  owner VARCHAR(255),
  team_members JSONB DEFAULT '[]',
  risks TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_projects_opp ON projects(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);

-- 9. Project milestones
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  status VARCHAR(30) DEFAULT 'pending',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Project tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to VARCHAR(255),
  status VARCHAR(30) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);

-- 11. Contracts / Maintenance & Renewals
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id),
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES users(id),
  title VARCHAR(500) NOT NULL,
  contract_number VARCHAR(100),
  contract_type VARCHAR(50) DEFAULT 'service',
  vendor VARCHAR(255),
  start_date DATE,
  end_date DATE,
  auto_renew BOOLEAN DEFAULT false,
  renewal_notice_days INT DEFAULT 30,
  value NUMERIC(15,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  payment_terms VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  sla_terms TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contracts_user ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- 12. License tracking
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id),
  user_id UUID REFERENCES users(id),
  product_name VARCHAR(255) NOT NULL,
  license_key VARCHAR(500),
  license_type VARCHAR(50),
  quantity INT DEFAULT 1,
  assigned_users INT DEFAULT 0,
  start_date DATE,
  expiry_date DATE,
  auto_renew BOOLEAN DEFAULT false,
  cost_per_unit NUMERIC(15,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  vendor VARCHAR(255),
  status VARCHAR(30) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_licenses_contract ON licenses(contract_id);
CREATE INDEX IF NOT EXISTS idx_licenses_expiry ON licenses(expiry_date);

-- 13. Demo / POC tracking
CREATE TABLE IF NOT EXISTS demos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id),
  lead_intake_id UUID REFERENCES lead_intakes(id),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  demo_type VARCHAR(30) DEFAULT 'demo',
  status VARCHAR(30) DEFAULT 'scheduled',
  scheduled_date TIMESTAMPTZ,
  duration_minutes INT DEFAULT 60,
  environment_url VARCHAR(500),
  attendees JSONB DEFAULT '[]',
  agenda TEXT,
  outcome TEXT,
  evaluation_criteria TEXT,
  evaluation_score NUMERIC(5,2),
  next_steps TEXT,
  poc_start_date DATE,
  poc_end_date DATE,
  success_criteria TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_demos_opp ON demos(opportunity_id);

-- 14. Extend opportunities for new pipeline stages and client visibility
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS extended_stage VARCHAR(50);
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS client_visible BOOLEAN DEFAULT false;

-- 15. Seed gate definitions for all pipeline stages
INSERT INTO gate_definitions (stage, item_key, label_en, required, display_order)
VALUES
  ('discovery', 'disc_initial_meeting', 'Initial meeting completed', true, 1),
  ('discovery', 'disc_needs_captured', 'Client needs documented', true, 2),
  ('discovery', 'disc_budget_confirmed', 'Budget range confirmed', true, 3),
  ('proposal', 'prop_solution_designed', 'Solution designed', true, 1),
  ('proposal', 'prop_pricing_approved', 'Pricing approved internally', true, 2),
  ('proposal', 'prop_submitted', 'Proposal submitted to client', true, 3),
  ('negotiation', 'neg_terms_discussed', 'Commercial terms discussed', true, 1),
  ('negotiation', 'neg_legal_reviewed', 'Legal review completed', true, 2),
  ('negotiation', 'neg_final_offer', 'Final offer presented', true, 3),
  ('demo', 'demo_scheduled', 'Demo date confirmed with client', true, 1),
  ('demo', 'demo_env_ready', 'Demo environment prepared', true, 2),
  ('demo', 'demo_deck_ready', 'Presentation/demo deck prepared', true, 3),
  ('demo', 'demo_completed', 'Demo completed successfully', true, 4),
  ('poc', 'poc_scope_defined', 'POC scope and success criteria defined', true, 1),
  ('poc', 'poc_env_provisioned', 'POC environment provisioned', true, 2),
  ('poc', 'poc_data_loaded', 'Test data loaded', false, 3),
  ('poc', 'poc_evaluation_done', 'Client evaluation completed', true, 4),
  ('tender', 'tender_rfp_reviewed', 'RFP/RFQ reviewed and understood', true, 1),
  ('tender', 'tender_team_assigned', 'Bid team assigned', true, 2),
  ('tender', 'tender_solution_designed', 'Solution architecture completed', true, 3),
  ('tender', 'tender_pricing_approved', 'Pricing approved internally', true, 4),
  ('tender', 'tender_docs_submitted', 'Tender documents submitted', true, 5),
  ('implementation', 'impl_kickoff_done', 'Project kickoff meeting completed', true, 1),
  ('implementation', 'impl_plan_approved', 'Project plan approved', true, 2),
  ('implementation', 'impl_resources_allocated', 'Resources allocated', true, 3),
  ('implementation', 'impl_uat_passed', 'UAT sign-off received', true, 4),
  ('implementation', 'impl_golive', 'Go-live completed', true, 5),
  ('maintenance', 'maint_sla_agreed', 'SLA terms agreed', true, 1),
  ('maintenance', 'maint_monitoring_setup', 'Monitoring and alerting configured', true, 2),
  ('maintenance', 'maint_handover_done', 'Knowledge transfer completed', true, 3)
ON CONFLICT (stage, item_key) DO NOTHING;
