/* ── Admin Portal TypeScript Models ──────────────────── */

export interface DashboardStats {
  total: number;
  last_7_days: number;
  by_status: Array<{ status: string; cnt: string }>;
  by_product: Array<{ product_line: string; cnt: string }>;
}

export interface LeadRow {
  id: string;
  ticket_number: string;
  status: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  product_line: string;
  vertical: string;
  city: string;
  score: number;
  assigned_to: string;
  created_at: string;
}

export interface PartnerRow {
  id: string;
  company_name: string;
  company_website: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  partner_type: string;
  status: string;
  tier: string | null;
  commission_rate: number | null;
  created_at: string;
}

export interface PortalUser {
  id?: string;
  email?: string;
  name?: string;
  role: string;
  must_change_password?: boolean;
}

export interface TeamMember {
  id: string;
  email: string;
  role: string;
  name: string;
  must_change_password: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  sender_name: string;
  body: string;
  created_at: string;
}

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ProposalForm {
  company_name: string;
  service: string;
  budget_range: string;
  timeline: string;
  country: string;
  notes: string;
}

/* ── Commission Models ──────────────────────────────── */
export interface AdminCommission {
  id: string;
  partner_id: string;
  partner_company: string;
  opportunity_id: string;
  client_company: string;
  deal_title: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
  approved_at: string | null;
  paid_at: string | null;
}

export interface CommissionSummary {
  pending_total: number;
  approved_total: number;
  paid_total: number;
  currency: string;
}

export interface CommissionsListResponse {
  data: AdminCommission[];
  total: number;
  summary: CommissionSummary;
}

/* ── Opportunity / Pipeline Models ──────────────────── */
export interface Opportunity {
  id: string;
  lead_intake_id: string;
  title: string;
  stage: string;
  estimated_value: number;
  currency: string;
  probability: number;
  owner: string;
  client_company: string;
  contact_name: string;
  ticket_number: string;
  product_line: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

/* ── Gate Models ────────────────────────────────────── */
export interface GateItem {
  id: string;
  opportunity_id: string;
  stage: string;
  category: string;
  label: string;
  checked: boolean;
  checked_by: string | null;
  checked_at: string | null;
}

export interface GateStage {
  stage: string;
  items: GateItem[];
  can_advance: boolean;
}

/* ── Engagement Models ──────────────────────────────── */
export interface Engagement {
  id: string;
  opportunity_id: string;
  phase: string;
  scope_notes: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

export interface EngagementChecklist {
  id: string;
  engagement_id: string;
  category: string;
  label: string;
  checked: boolean;
  checked_by: string | null;
  checked_at: string | null;
}
