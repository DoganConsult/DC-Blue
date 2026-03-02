import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerApiService {
  private http = inject(HttpClient);

  private headers(): HttpHeaders {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('dc_user_token') : null;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  getStats(): Observable<{ total: number; by_status: { status: string; count: number }[]; recent_count: number }> {
    return this.http.get<any>('/api/v1/customer/stats', { headers: this.headers() });
  }

  getInquiries(params?: Record<string, string>): Observable<{ total: number; page: number; limit: number; data: any[] }> {
    return this.http.get<any>('/api/v1/customer/inquiries', { headers: this.headers(), params });
  }

  getInquiry(id: string): Observable<{ lead: any; activities: any[]; files: any[] }> {
    return this.http.get<any>(`/api/v1/customer/inquiries/${id}`, { headers: this.headers() });
  }

  exportInquiries(): Observable<Blob> {
    return this.http.get('/api/v1/customer/export/inquiries', { headers: this.headers(), responseType: 'blob' });
  }
}
