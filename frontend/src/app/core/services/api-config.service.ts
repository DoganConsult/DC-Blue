import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Single source of truth for API base URL.
 * Use apiUrl(path) when calling HTTP so a separate API host can be configured via environment.apiBase.
 */
@Injectable({ providedIn: 'root' })
export class ApiConfigService {
  get apiBase(): string {
    return (environment as { apiBase?: string }).apiBase ?? '';
  }

  /** Returns full URL for an API path. Path should start with / (e.g. /api/public/landing). */
  apiUrl(path: string): string {
    const base = this.apiBase;
    if (!base) return path;
    const p = path.startsWith('/') ? path : '/' + path;
    return base.replace(/\/$/, '') + p;
  }
}
