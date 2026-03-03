import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  DashboardStats,
  LeadRow,
  PartnerRow,
  PortalUser,
  TeamMember,
  ChatMessage,
  CommissionsListResponse,
  Opportunity,
  GateItem,
  Engagement,
  EngagementChecklist,
} from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string>('');
  private _user = signal<PortalUser | null>(null);

  readonly isAuthenticated = computed(() => !!this._token());
  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();

  constructor() {
    const saved = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dc_admin_token') : null;
    const userJson = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dc_portal_user') : null;
    if (saved) {
      this._token.set(saved);
      this._user.set(userJson ? JSON.parse(userJson) : { role: 'admin' });
    }
  }

  isAdmin(): boolean {
    return this._user()?.role === 'admin';
  }

  setAuth(token: string, user: PortalUser): void {
    this._token.set(token);
    this._user.set(user);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('dc_admin_token', token);
      sessionStorage.setItem('dc_portal_user', JSON.stringify(user));
    }
  }

  clearAuth(): void {
    this._token.set('');
    this._user.set(null);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('dc_admin_token');
      sessionStorage.removeItem('dc_portal_user');
    }
  }

  private headers(): HttpHeaders {
    const t = this._token();
    if (t.startsWith('eyJ')) return new HttpHeaders({ Authorization: `Bearer ${t}` });
    return new HttpHeaders({ 'x-admin-token': t });
  }

  /* ── Auth (consolidated — single flow for all users) ── */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('/api/v1/auth/login', { email, password });
  }

  verifyMfa(mfaSession: string, code: string): Observable<any> {
    return this.http.post<any>('/api/v1/auth/verify-mfa', { mfa_session: mfaSession, code });
  }

  resendMfa(mfaSession: string): Observable<any> {
    return this.http.post<any>('/api/v1/auth/resend-mfa', { mfa_session: mfaSession });
  }

  /* ── Dashboard Stats ─────────────────────────────── */
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>('/api/v1/dashboard/stats', { headers: this.headers() });
  }

  /* ── Leads ───────────────────────────────────────── */
  getLeads(params: Record<string, string>): Observable<{ total: number; data: LeadRow[] }> {
    return this.http.get<{ total: number; data: LeadRow[] }>('/api/v1/leads', { headers: this.headers(), params });
  }

  /* ── Partners ────────────────────────────────────── */
  getPartners(): Observable<{ data: PartnerRow[] }> {
    return this.http.get<{ data: PartnerRow[] }>('/api/v1/admin/partners', { headers: this.headers() });
  }

  getPartner(id: string): Observable<any> {
    return this.http.get<any>(`/api/v1/admin/partners/${id}`, { headers: this.headers() });
  }

  setPartnerStatus(id: string, status: string): Observable<{ ok: boolean; status: string; api_key?: string }> {
    return this.http.patch<{ ok: boolean; status: string; api_key?: string }>(`/api/v1/admin/partners/${id}`, { status }, { headers: this.headers() });
  }

  getPartnerMessages(partnerId: string): Observable<{ data: ChatMessage[] }> {
    return this.http.get<{ data: ChatMessage[] }>(`/api/v1/admin/partners/${partnerId}/messages`, { headers: this.headers() });
  }

  sendPartnerMessage(partnerId: string, body: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`/api/v1/admin/partners/${partnerId}/messages`, { body }, { headers: this.headers() });
  }

  /* ── Team / Users ────────────────────────────────── */
  getUsers(): Observable<{ ok: boolean; data: TeamMember[] }> {
    return this.http.get<{ ok: boolean; data: TeamMember[] }>('/api/v1/admin/users', { headers: this.headers() });
  }

  createUser(data: { name: string; email: string; password: string; role: string }): Observable<{ ok: boolean; user: any }> {
    return this.http.post<{ ok: boolean; user: any }>('/api/v1/admin/users', data, { headers: this.headers() });
  }

  updateUser(id: string, data: Partial<{ name: string; role: string; active: boolean }>): Observable<{ ok: boolean }> {
    return this.http.patch<{ ok: boolean }>(`/api/v1/admin/users/${id}`, data, { headers: this.headers() });
  }

  resetUserPassword(id: string): Observable<{ ok: boolean; temp_password: string }> {
    return this.http.post<{ ok: boolean; temp_password: string }>(`/api/v1/admin/users/${id}/reset-password`, {}, { headers: this.headers() });
  }

  /* ── AI ──────────────────────────────────────────── */
  getLeadsOverview(): Observable<{ ok: boolean; summary: string }> {
    return this.http.get<{ ok: boolean; summary: string }>('/api/v1/ai/leads-overview', { headers: this.headers() });
  }

  aiChat(messages: { role: string; content: string }[]): Observable<{ ok: boolean; reply: string }> {
    return this.http.post<{ ok: boolean; reply: string }>('/api/v1/ai/chat', { messages }, { headers: this.headers() });
  }

  getLeadSummary(id: string): Observable<{ ok: boolean; summary: string }> {
    return this.http.post<{ ok: boolean; summary: string }>(`/api/v1/ai/lead-summary/${id}`, {}, { headers: this.headers() });
  }

  draftProposal(data: Record<string, string>): Observable<{ ok: boolean; draft: string }> {
    return this.http.post<{ ok: boolean; draft: string }>('/api/v1/ai/draft-proposal', data, { headers: this.headers() });
  }

  /* ── Commissions ─────────────────────────────────── */
  getCommissions(params?: Record<string, string>): Observable<CommissionsListResponse> {
    return this.http.get<CommissionsListResponse>('/api/v1/commissions', { headers: this.headers(), params });
  }

  getCommission(id: string): Observable<any> {
    return this.http.get<any>(`/api/v1/commissions/${id}`, { headers: this.headers() });
  }

  updateCommission(id: string, data: { status: string }): Observable<{ ok: boolean }> {
    return this.http.patch<{ ok: boolean }>(`/api/v1/commissions/${id}`, data, { headers: this.headers() });
  }

  getCommissionSummary(): Observable<any> {
    return this.http.get<any>('/api/v1/commissions/summary', { headers: this.headers() });
  }

  /* ── Opportunities ───────────────────────────────── */
  getOpportunities(params?: Record<string, string>): Observable<{ data: Opportunity[]; total: number }> {
    return this.http.get<{ data: Opportunity[]; total: number }>('/api/v1/opportunities', { headers: this.headers(), params });
  }

  getOpportunity(id: string): Observable<any> {
    return this.http.get<any>(`/api/v1/opportunities/${id}`, { headers: this.headers() });
  }

  updateOpportunity(id: string, data: Partial<Opportunity>): Observable<{ ok: boolean }> {
    return this.http.patch<{ ok: boolean }>(`/api/v1/opportunities/${id}`, data, { headers: this.headers() });
  }

  convertLeadToOpportunity(leadId: string): Observable<{ ok: boolean; opportunity_id: string }> {
    return this.http.post<{ ok: boolean; opportunity_id: string }>(`/api/v1/leads/${leadId}/convert`, {}, { headers: this.headers() });
  }

  /* ── Gates ───────────────────────────────────────── */
  getOpportunityGates(opportunityId: string): Observable<{ data: GateItem[] }> {
    return this.http.get<{ data: GateItem[] }>(`/api/v1/opportunities/${opportunityId}/gates`, { headers: this.headers() });
  }

  updateGateItem(opportunityId: string, itemId: string, checked: boolean): Observable<{ ok: boolean }> {
    return this.http.patch<{ ok: boolean }>(`/api/v1/opportunities/${opportunityId}/gates/${itemId}`, { checked }, { headers: this.headers() });
  }

  /* ── Engagements ─────────────────────────────────── */
  getEngagements(params?: Record<string, string>): Observable<{ data: Engagement[]; total: number }> {
    return this.http.get<{ data: Engagement[]; total: number }>('/api/v1/engagements', { headers: this.headers(), params });
  }

  getEngagement(id: string): Observable<Engagement & { checklist: EngagementChecklist[] }> {
    return this.http.get<Engagement & { checklist: EngagementChecklist[] }>(`/api/v1/engagements/${id}`, { headers: this.headers() });
  }

  createEngagement(data: Partial<Engagement>): Observable<{ ok: boolean; id: string }> {
    return this.http.post<{ ok: boolean; id: string }>('/api/v1/engagements', data, { headers: this.headers() });
  }

  updateEngagement(id: string, data: Partial<Engagement>): Observable<{ ok: boolean }> {
    return this.http.patch<{ ok: boolean }>(`/api/v1/engagements/${id}`, data, { headers: this.headers() });
  }

  updateChecklistItem(engagementId: string, itemId: string, checked: boolean): Observable<{ ok: boolean }> {
    return this.http.patch<{ ok: boolean }>(`/api/v1/engagements/${engagementId}/checklist/${itemId}`, { checked }, { headers: this.headers() });
  }

  /* ── Notifications ────────────────────────────────── */
  getNotifications(params?: Record<string, string>): Observable<{ data: any[]; unread_count: number }> {
    return this.http.get<{ data: any[]; unread_count: number }>('/api/v1/admin/notifications', { headers: this.headers(), params });
  }

  markNotificationRead(id: string): Observable<{ ok: boolean }> {
    return this.http.put<{ ok: boolean }>(`/api/v1/admin/notifications/${id}/read`, {}, { headers: this.headers() });
  }

  markAllNotificationsRead(): Observable<{ ok: boolean }> {
    return this.http.put<{ ok: boolean }>('/api/v1/admin/notifications/read-all', {}, { headers: this.headers() });
  }

  createNotification(data: { user_id?: string; type?: string; title: string; body?: string; link?: string }): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>('/api/v1/admin/notifications', data, { headers: this.headers() });
  }

  /* ── Analytics ─────────────────────────────────────── */
  getAnalyticsPipeline(days?: string): Observable<any> {
    const params: Record<string, string> = days ? { days } : {};
    return this.http.get<any>('/api/v1/admin/analytics/pipeline', { headers: this.headers(), params });
  }

  getAnalyticsLeads(days?: string): Observable<any> {
    const params: Record<string, string> = days ? { days } : {};
    return this.http.get<any>('/api/v1/admin/analytics/leads', { headers: this.headers(), params });
  }

  getAnalyticsRevenue(days?: string): Observable<any> {
    const params: Record<string, string> = days ? { days } : {};
    return this.http.get<any>('/api/v1/admin/analytics/revenue', { headers: this.headers(), params });
  }

  getAnalyticsTeam(days?: string): Observable<any> {
    const params: Record<string, string> = days ? { days } : {};
    return this.http.get<any>('/api/v1/admin/analytics/team', { headers: this.headers(), params });
  }

  /* ── Audit Logs ────────────────────────────────────── */
  getAuditLogs(params: Record<string, string>): Observable<{ data: any[]; total: number }> {
    return this.http.get<{ data: any[]; total: number }>('/api/v1/admin/audit-logs', { headers: this.headers(), params });
  }

  getAuditFilters(): Observable<{ entity_types: string[]; actions: string[] }> {
    return this.http.get<{ entity_types: string[]; actions: string[] }>('/api/v1/admin/audit-logs/filters', { headers: this.headers() });
  }

  /* ── Settings ──────────────────────────────────────── */
  getSettings(): Observable<{ ok: boolean; settings: Record<string, any> }> {
    return this.http.get<{ ok: boolean; settings: Record<string, any> }>('/api/v1/admin/settings', { headers: this.headers() });
  }

  saveSettings(data: Record<string, any>): Observable<{ ok: boolean }> {
    return this.http.put<{ ok: boolean }>('/api/v1/admin/settings', data, { headers: this.headers() });
  }

  /* ── Export ────────────────────────────────────────── */
  exportLeads(params: Record<string, string>): Observable<Blob> {
    return this.http.get('/api/v1/admin/export/leads', { headers: this.headers(), params, responseType: 'blob' });
  }

  bulkUpdateLeadStatus(ids: string[], status: string): Observable<{ ok: boolean; updated: number }> {
    return this.http.post<{ ok: boolean; updated: number }>('/api/v1/admin/bulk/leads/status', { ids, status }, { headers: this.headers() });
  }
}
