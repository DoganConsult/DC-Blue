import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ClientDashboard, ClientOpportunity, Tender, Demo, Project, Milestone, Task,
  Contract, License, ClientMessage, ClientNotification, ClientInquiry, GateChecklistItem, Solution,
} from '../models/client.models';

@Injectable({ providedIn: 'root' })
export class ClientApiService {
  private http = inject(HttpClient);

  private headers(): HttpHeaders {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('dc_user_token') : null;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // Dashboard
  getDashboard(): Observable<ClientDashboard> {
    return this.http.get<ClientDashboard>('/api/v1/client/dashboard', { headers: this.headers() });
  }

  // Profile
  updateProfile(body: { full_name?: string; email?: string }): Observable<{ ok: boolean }> {
    return this.http.patch<any>('/api/v1/client/profile', body, { headers: this.headers() });
  }

  // Notifications
  getNotifications(limit = 20, offset = 0): Observable<{ data: ClientNotification[]; total: number }> {
    return this.http.get<any>('/api/v1/client/notifications', { headers: this.headers(), params: { limit: String(limit), offset: String(offset) } });
  }

  markNotificationRead(id: string): Observable<{ ok: boolean }> {
    return this.http.put<any>(`/api/v1/client/notifications/${id}/read`, {}, { headers: this.headers() });
  }

  markAllNotificationsRead(): Observable<{ ok: boolean }> {
    return this.http.put<any>('/api/v1/client/notifications/read-all', {}, { headers: this.headers() });
  }

  // Pipeline
  getPipeline(): Observable<{ data: ClientOpportunity[] }> {
    return this.http.get<any>('/api/v1/client/pipeline', { headers: this.headers() });
  }

  getPipelineDetail(id: string): Observable<{ opportunity: ClientOpportunity; activities: any[]; gates: GateChecklistItem[] }> {
    return this.http.get<any>(`/api/v1/client/pipeline/${id}`, { headers: this.headers() });
  }

  // Inquiries
  getInquiries(params?: Record<string, string>): Observable<{ total: number; page: number; limit: number; data: ClientInquiry[] }> {
    return this.http.get<any>('/api/v1/client/inquiries', { headers: this.headers(), params });
  }

  getInquiry(id: string): Observable<{ lead: any; activities: any[]; files: any[] }> {
    return this.http.get<any>(`/api/v1/client/inquiries/${id}`, { headers: this.headers() });
  }

  // Tenders
  getTenders(): Observable<{ data: Tender[] }> {
    return this.http.get<any>('/api/v1/client/tenders', { headers: this.headers() });
  }

  getTender(id: string): Observable<{ tender: Tender; solutions: Solution[] }> {
    return this.http.get<any>(`/api/v1/client/tenders/${id}`, { headers: this.headers() });
  }

  // Demos / POC
  getDemos(): Observable<{ data: Demo[] }> {
    return this.http.get<any>('/api/v1/client/demos', { headers: this.headers() });
  }

  getDemo(id: string): Observable<{ demo: Demo }> {
    return this.http.get<any>(`/api/v1/client/demos/${id}`, { headers: this.headers() });
  }

  // Projects
  getProjects(): Observable<{ data: Project[] }> {
    return this.http.get<any>('/api/v1/client/projects', { headers: this.headers() });
  }

  getProject(id: string): Observable<{ project: Project; milestones: Milestone[]; tasks: Task[] }> {
    return this.http.get<any>(`/api/v1/client/projects/${id}`, { headers: this.headers() });
  }

  // Contracts
  getContracts(): Observable<{ data: Contract[] }> {
    return this.http.get<any>('/api/v1/client/contracts', { headers: this.headers() });
  }

  getContract(id: string): Observable<{ contract: Contract; licenses: License[] }> {
    return this.http.get<any>(`/api/v1/client/contracts/${id}`, { headers: this.headers() });
  }

  // Licenses
  getLicenses(): Observable<{ data: License[] }> {
    return this.http.get<any>('/api/v1/client/licenses', { headers: this.headers() });
  }

  // Messages
  getMessages(opportunityId?: string): Observable<{ data: ClientMessage[] }> {
    const params: Record<string, string> = {};
    if (opportunityId) params['opportunity_id'] = opportunityId;
    return this.http.get<any>('/api/v1/client/messages', { headers: this.headers(), params });
  }

  sendMessage(body: string, opportunityId?: string): Observable<ClientMessage> {
    return this.http.post<ClientMessage>('/api/v1/client/messages', { body, opportunity_id: opportunityId || null }, { headers: this.headers() });
  }

  // Files
  getFiles(): Observable<{ data: any[] }> {
    return this.http.get<any>('/api/v1/client/files', { headers: this.headers() });
  }

  uploadFile(file: File): Observable<{ ok: boolean; file: any }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entity_type', 'client_upload');
    formData.append('entity_id', 'workspace');
    return this.http.post<any>('/api/v1/files/upload', formData, { headers: this.headers() });
  }

  downloadFile(fileId: string): Observable<Blob> {
    return this.http.get(`/api/v1/files/download/${fileId}`, { headers: this.headers(), responseType: 'blob' });
  }

  // Auth / Security
  toggleMfa(enable: boolean): Observable<{ ok: boolean; mfa_enabled: boolean }> {
    return this.http.post<{ ok: boolean; mfa_enabled: boolean }>('/api/v1/public/auth/toggle-mfa', { enable }, { headers: this.headers() });
  }

  // Export
  exportPipeline(): Observable<Blob> {
    return this.http.get('/api/v1/client/export/pipeline', { headers: this.headers(), responseType: 'blob' });
  }
}
