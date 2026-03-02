import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardResponse,
  CommissionsResponse,
  PipelineResponse,
  PartnerLead,
  PartnerInfo,
  NotificationsResponse,
  ActivityResponse,
  SlaResponse,
  PartnerProfile,
  AnalyticsResponse,
  EmailPreferences,
  TierResponse,
  InsightsResponse,
  PartnerResource,
  ForecastResponse,
  MessagesResponse,
  AchievementsResponse,
} from '../models/partner.models';

@Injectable({ providedIn: 'root' })
export class PartnerApiService {
  private http = inject(HttpClient);

  private _apiKey = signal<string | null>(null);
  private _partner = signal<PartnerInfo | null>(null);

  readonly isAuthenticated = computed(() => !!this._apiKey());
  readonly partner = this._partner.asReadonly();
  readonly apiKey = this._apiKey.asReadonly();

  constructor() {
    const saved = typeof localStorage !== 'undefined'
      ? localStorage.getItem('dc_partner_key')
      : null;
    if (saved) this._apiKey.set(saved);
  }

  setApiKey(key: string): void {
    this._apiKey.set(key);
    localStorage.setItem('dc_partner_key', key);
  }

  clearApiKey(): void {
    this._apiKey.set(null);
    this._partner.set(null);
    localStorage.removeItem('dc_partner_key');
  }

  setPartner(info: PartnerInfo): void {
    this._partner.set(info);
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'x-api-key': this._apiKey() || '' });
  }

  /* ── P0: Core ──────────────────────────────────── */
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>('/api/v1/partners/dashboard', { headers: this.headers() });
  }

  getLeads(): Observable<{ data: PartnerLead[] }> {
    return this.http.get<{ data: PartnerLead[] }>('/api/v1/partners/leads', { headers: this.headers() });
  }

  getCommissions(status?: string, page = 1): Observable<CommissionsResponse> {
    const params: Record<string, string> = { page: String(page), limit: '20' };
    if (status) params['status'] = status;
    return this.http.get<CommissionsResponse>('/api/v1/partners/commissions', { headers: this.headers(), params });
  }

  getPipeline(): Observable<PipelineResponse> {
    return this.http.get<PipelineResponse>('/api/v1/partners/pipeline', { headers: this.headers() });
  }

  submitLead(data: Record<string, unknown>): Observable<{ ok: boolean; ticket_number: string }> {
    return this.http.post<{ ok: boolean; ticket_number: string }>('/api/v1/partners/leads', data, { headers: this.headers() });
  }

  validateKey(key: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>('/api/v1/partners/dashboard', { headers: new HttpHeaders({ 'x-api-key': key }) });
  }

  /* ── P1: Notifications ─────────────────────────── */
  getNotifications(unreadOnly = false): Observable<NotificationsResponse> {
    const params: Record<string, string> = {};
    if (unreadOnly) params['unread_only'] = 'true';
    return this.http.get<NotificationsResponse>('/api/v1/partners/notifications', { headers: this.headers(), params });
  }

  markNotificationRead(id: string): Observable<{ ok: boolean }> {
    return this.http.put<{ ok: boolean }>(`/api/v1/partners/notifications/${id}/read`, {}, { headers: this.headers() });
  }

  markAllNotificationsRead(): Observable<{ ok: boolean }> {
    return this.http.put<{ ok: boolean }>('/api/v1/partners/notifications/read-all', {}, { headers: this.headers() });
  }

  /* ── P1: Activity Timeline ─────────────────────── */
  getActivity(page = 1): Observable<ActivityResponse> {
    return this.http.get<ActivityResponse>('/api/v1/partners/activity', { headers: this.headers(), params: { page: String(page) } });
  }

  /* ── P1: SLA Tracker ───────────────────────────── */
  getSla(): Observable<SlaResponse> {
    return this.http.get<SlaResponse>('/api/v1/partners/sla', { headers: this.headers() });
  }

  /* ── P2: Profile ───────────────────────────────── */
  getProfile(): Observable<PartnerProfile> {
    return this.http.get<PartnerProfile>('/api/v1/partners/profile', { headers: this.headers() });
  }

  updateProfile(data: Partial<PartnerProfile>): Observable<{ ok: boolean }> {
    return this.http.put<{ ok: boolean }>('/api/v1/partners/profile', data, { headers: this.headers() });
  }

  /* ── P2: Onboarding ────────────────────────────── */
  updateOnboarding(step: number, completed: boolean): Observable<{ ok: boolean }> {
    return this.http.put<{ ok: boolean }>('/api/v1/partners/onboarding', { step, completed }, { headers: this.headers() });
  }

  /* ── P2: Analytics ─────────────────────────────── */
  getAnalytics(): Observable<AnalyticsResponse> {
    return this.http.get<AnalyticsResponse>('/api/v1/partners/analytics', { headers: this.headers() });
  }

  /* ── P2: Email Preferences ─────────────────────── */
  getEmailPreferences(): Observable<EmailPreferences> {
    return this.http.get<EmailPreferences>('/api/v1/partners/email-preferences', { headers: this.headers() });
  }

  updateEmailPreferences(prefs: Partial<EmailPreferences>): Observable<{ ok: boolean }> {
    return this.http.put<{ ok: boolean }>('/api/v1/partners/email-preferences', prefs, { headers: this.headers() });
  }

  /* ── P3: Tier System ───────────────────────────── */
  getTier(): Observable<TierResponse> {
    return this.http.get<TierResponse>('/api/v1/partners/tier', { headers: this.headers() });
  }

  /* ── P3: AI Insights ───────────────────────────── */
  getInsights(): Observable<InsightsResponse> {
    return this.http.get<InsightsResponse>('/api/v1/partners/insights', { headers: this.headers() });
  }

  /* ── P3: Resources ─────────────────────────────── */
  getResources(): Observable<{ data: PartnerResource[] }> {
    return this.http.get<{ data: PartnerResource[] }>('/api/v1/partners/resources', { headers: this.headers() });
  }

  /* ── P3: Feedback ──────────────────────────────── */
  submitFeedback(rating: number, category: string, message: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>('/api/v1/partners/feedback', { rating, category, message }, { headers: this.headers() });
  }

  /* ── P4: Revenue Forecast ──────────────────────── */
  getForecast(): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>('/api/v1/partners/forecast', { headers: this.headers() });
  }

  /* ── P4: Messaging ─────────────────────────────── */
  getMessages(): Observable<MessagesResponse> {
    return this.http.get<MessagesResponse>('/api/v1/partners/messages', { headers: this.headers() });
  }

  sendMessage(body: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>('/api/v1/partners/messages', { body }, { headers: this.headers() });
  }

  /* ── P4: Lead Comments ────────────────────────── */
  addLeadComment(leadId: string, body: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`/api/v1/partners/leads/${leadId}/comments`, { body }, { headers: this.headers() });
  }

  /* ── P4: Achievements ──────────────────────────── */
  getAchievements(): Observable<AchievementsResponse> {
    return this.http.get<AchievementsResponse>('/api/v1/partners/achievements', { headers: this.headers() });
  }

  /* ── Training Portal ─────────────────────────── */
  getTraining(): Observable<any> {
    return this.http.get<any>('/api/v1/partners/training', { headers: this.headers() });
  }

  updateTrainingProgress(courseId: number, status: string, progressPct: number): Observable<{ ok: boolean }> {
    return this.http.put<{ ok: boolean }>(`/api/v1/partners/training/${courseId}/progress`, { status, progress_pct: progressPct }, { headers: this.headers() });
  }
}
