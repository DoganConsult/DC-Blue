export interface PartnerInfo {
  id: string;
  company_name: string;
  contact_name: string;
  tier: string;
  commission_rate: number;
}

export interface LeadCounts {
  total: number;
  submitted: number;
  approved: number;
  in_pipeline: number;
  closed_won: number;
  closed_lost: number;
}

export interface CommissionSummary {
  total_earned: number;
  pending: number;
  approved: number;
  paid: number;
  currency: string;
}

export interface PipelineSummary {
  total_value: number;
  weighted_value: number;
  currency: string;
}

export interface DashboardResponse {
  partner: PartnerInfo;
  leads: LeadCounts;
  commissions: CommissionSummary;
  pipeline: PipelineSummary;
}

export interface Commission {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid';
  paid_at: string | null;
  created_at: string;
  opportunity_title: string;
  estimated_value: number;
  opportunity_stage: string;
  client_company: string;
  ticket_number: string;
  product_line: string;
}

export interface CommissionsResponse {
  total: number;
  page: number;
  data: Commission[];
  summary: CommissionSummary;
}

export interface PipelineOpportunity {
  opportunity_id: string;
  lead_intake_id: string;
  title: string;
  stage: string;
  estimated_value: number;
  currency: string;
  probability: number;
  updated_at: string;
  closed_at: string | null;
  client_company: string;
  contact_name: string;
  ticket_number: string;
  product_line: string;
}

export interface PipelineStageSummary {
  count: number;
  value: number;
}

export interface PipelineFullSummary {
  total_opportunities: number;
  total_value: number;
  weighted_value: number;
  currency: string;
  by_stage: Record<string, PipelineStageSummary>;
}

export interface PipelineResponse {
  stages: Record<string, PipelineOpportunity[]>;
  summary: PipelineFullSummary;
}

export interface PartnerLead {
  id: string;
  status: string;
  notes: string | null;
  created_at: string;
  ticket_number: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  product_line: string;
  opportunity_id: string | null;
  opportunity_stage: string | null;
  opportunity_closed_at: string | null;
}

/* ── P1: Notifications ─────────────────────────── */
export interface PartnerNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  data: PartnerNotification[];
  unread_count: number;
}

/* ── P1: Activity Timeline ────────────────────── */
export interface ActivityItem {
  id: string;
  type: string;
  body: string;
  created_by: string;
  created_at: string;
  ticket_number: string;
  company_name: string;
  contact_name: string;
}

export interface ActivityResponse {
  data: ActivityItem[];
  total: number;
  page: number;
}

/* ── P1: SLA Tracker ──────────────────────────── */
export interface SlaItem {
  id: string;
  submitted_at: string;
  status: string;
  approved_at: string | null;
  ticket_number: string;
  company_name: string;
  contact_name: string;
  lead_status: string;
  opportunity_stage: string | null;
  hours_to_review: number;
  sla_status: 'on_track' | 'at_risk' | 'breached';
}

export interface SlaSummary {
  total: number;
  on_track: number;
  at_risk: number;
  breached: number;
  avg_review_hours: number;
}

export interface SlaResponse {
  data: SlaItem[];
  summary: SlaSummary;
}

/* ── P2: Profile ──────────────────────────────── */
export interface PartnerProfile {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  tier: string;
  commission_rate: number;
  status: string;
  company_website: string;
  partner_type: string;
  bio: string;
  logo_url: string;
  city: string;
  country: string;
  address_line: string;
  specializations: string[];
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: string;
}

/* ── P2: Analytics ────────────────────────────── */
export interface MonthlyData {
  month: string;
  leads: number;
  commissions: number;
  won: number;
}

export interface ConversionFunnel {
  total_leads: number;
  qualified: number;
  in_pipeline: number;
  won: number;
}

export interface AnalyticsResponse {
  monthly: MonthlyData[];
  funnel: ConversionFunnel;
  product_mix: { product_line: string; count: number }[];
  top_clients: { company_name: string; total_value: number; deals: number }[];
}

/* ── P2: Email Preferences ────────────────────── */
export interface EmailPreferences {
  partner_id: string;
  weekly_digest: boolean;
  monthly_report: boolean;
  commission_alerts: boolean;
  pipeline_updates: boolean;
  sla_warnings: boolean;
  marketing_emails: boolean;
}

/* ── P3: Tier System ──────────────────────────── */
export interface TierDefinition {
  key: string;
  label: { en: string; ar: string };
  minLeads: number;
  minWon: number;
  minRevenue: number;
  color: string;
}

export interface TierProgress {
  leads: { current: number; required: number; pct: number };
  won: { current: number; required: number; pct: number };
  revenue: { current: number; required: number; pct: number };
}

export interface TierResponse {
  current_tier: string;
  tiers: TierDefinition[];
  next_tier: TierDefinition | null;
  progress: TierProgress;
  stats: { total_leads: number; total_won: number; total_revenue: number };
  member_since: string;
}

/* ── P3: AI Insights ──────────────────────────── */
export interface Insight {
  type: string;
  title: { en: string; ar: string };
  body: { en: string; ar: string };
  priority: string;
}

export interface InsightsResponse {
  insights: Insight[];
}

/* ── P3: Resources ────────────────────────────── */
export interface PartnerResource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  file_type: string;
  tier_required: string;
  created_at: string;
}

/* ── P4: Revenue Forecast ─────────────────────── */
export interface ForecastMonth {
  month: string;
  projected_revenue: number;
  confidence: string;
}

export interface ForecastResponse {
  pipeline: { total_value: number; weighted_value: number; deals: number };
  projected_commission: number;
  commission_rate: number;
  history: { month: string; total: number }[];
  avg_monthly: number;
  forecast: ForecastMonth[];
}

/* ── P4: Messaging ────────────────────────────── */
export interface PartnerMessage {
  id: string;
  sender: string;
  sender_name: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface MessagesResponse {
  data: PartnerMessage[];
  unread_count: number;
}

/* ── P4: Achievements ─────────────────────────── */
export interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface AchievementsResponse {
  achievements: Achievement[];
  unlocked_count: number;
  total_count: number;
}
