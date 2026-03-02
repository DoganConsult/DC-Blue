import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type PublicPageKey = 'about' | 'services' | 'case_studies' | 'insights';

export interface PageContent {
  hero?: {
    title_en?: string;
    title_ar?: string;
    subtitle_en?: string;
    subtitle_ar?: string;
  };
  sections?: unknown[];
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class PublicContentService {
  private http = inject(HttpClient);

  getPage(page: PublicPageKey): Observable<PageContent | null> {
    return this.http.get<PageContent>(`/api/public/content/${page}`).pipe(
      catchError(() => of(null))
    );
  }
}
