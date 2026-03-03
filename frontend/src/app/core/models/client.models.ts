/* ── Client Workspace Models ──────────────────────────── */

export interface ClientDashboard {
  inquiries: number;
  opportunities: { total: number; active: number; total_value: number };
  projects: { total: number; active: number };
  contracts: { total: number; active: number; expiring_soon: number };
  demos_upcoming: number;
  tenders_active: number;
  unread_messages: number;
  unread_notifications: number;
}

export interface ClientOpportunity {
  id: string;
  lead_intake_id: string;
  title: string;
  display_stage: string;
  stage: string;
  extended_stage: string | null;
  estimated_value: number;
  currency: string;
  probability: number;
  owner: string;
  client_company: string;
  ticket_number: string;
  product_line: string;
  next_action_at: string | null;
  client_visible: boolean;
  created_at: string;
  closed_at: string | null;
}

export interface Tender {
  id: string;
  opportunity_id: string | null;
  lead_intake_id: string | null;
  user_id: string;
  title: string;
  rfp_number: string | null;
  issuing_entity: string | null;
  tender_type: string;
  submission_deadline: string | null;
  budget_estimate: number | null;
  currency: string;
  status: string;
  bid_bond_required: boolean;
  technical_score: number | null;
  financial_score: number | null;
  requirements: string | null;
  our_solution_summary: string | null;
  opportunity_name: string | null;
  company_name: string | null;
  created_at: string;
}

export interface Solution {
  id: string;
  title: string;
  version: number;
  architecture_type: string | null;
  status: string;
  estimated_cost: number | null;
  currency: string;
  created_at: string;
}

export interface Demo {
  id: string;
  opportunity_id: string | null;
  title: string;
  demo_type: string;
  status: string;
  scheduled_date: string | null;
  duration_minutes: number;
  environment_url: string | null;
  agenda: string | null;
  outcome: string | null;
  evaluation_score: number | null;
  next_steps: string | null;
  poc_start_date: string | null;
  poc_end_date: string | null;
  success_criteria: string | null;
  opportunity_name: string | null;
  company_name: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  opportunity_id: string | null;
  title: string;
  project_code: string | null;
  status: string;
  phase: string;
  start_date: string | null;
  end_date: string | null;
  actual_start: string | null;
  actual_end: string | null;
  budget: number | null;
  actual_cost: number | null;
  currency: string;
  progress_pct: number;
  owner: string | null;
  risks: string | null;
  notes: string | null;
  opportunity_name: string | null;
  created_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed_at: string | null;
  status: string;
  sort_order: number;
}

export interface Task {
  id: string;
  project_id: string;
  milestone_id: string | null;
  title: string;
  description: string | null;
  assigned_to: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  completed_at: string | null;
}

export interface Contract {
  id: string;
  opportunity_id: string | null;
  project_id: string | null;
  title: string;
  contract_number: string | null;
  contract_type: string;
  vendor: string | null;
  start_date: string | null;
  end_date: string | null;
  auto_renew: boolean;
  renewal_notice_days: number;
  value: number | null;
  currency: string;
  payment_terms: string | null;
  status: string;
  sla_terms: string | null;
  opportunity_name: string | null;
  created_at: string;
}

export interface License {
  id: string;
  contract_id: string | null;
  product_name: string;
  license_type: string | null;
  quantity: number;
  assigned_users: number;
  start_date: string | null;
  expiry_date: string | null;
  auto_renew: boolean;
  cost_per_unit: number | null;
  currency: string;
  vendor: string | null;
  status: string;
  contract_title: string | null;
  contract_number: string | null;
}

export interface ClientMessage {
  id: string;
  opportunity_id: string | null;
  sender: 'client' | 'team';
  sender_name: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface ClientNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface ClientInquiry {
  id: string;
  ticket_number: string;
  status: string;
  company_name: string;
  contact_name: string;
  product_line: string;
  vertical: string;
  score: number;
  budget_range: string;
  city: string;
  created_at: string;
}

export interface GateChecklistItem {
  id: string;
  stage: string;
  item_key: string;
  label: string;
  checked: boolean;
  checked_at: string | null;
}

export interface ClientFile {
  id: string;
  entity_type: string;
  entity_id: string;
  filename: string;
  original_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
}
