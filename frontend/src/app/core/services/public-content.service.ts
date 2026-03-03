import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageContent, PublicPageKey } from '../models/public-content.model';
import { ApiConfigService } from './api-config.service';

export type { PageContent, PublicPageKey } from '../models/public-content.model';

@Injectable({ providedIn: 'root' })
export class PublicContentService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);

  /** Fetches page content; errors (including 404) propagate to subscriber so pages can show retry/message. */
  getPage(page: PublicPageKey): Observable<PageContent> {
    return this.http.get<PageContent>(this.apiConfig.apiUrl(`/api/public/content/${page}`));
  }
}
