import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LandingContent } from '../models/landing.model';
import { ApiConfigService } from './api-config.service';

@Injectable({ providedIn: 'root' })
export class LandingContentService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private loaded = signal(false);
  private data = signal<LandingContent | null>(null);
  private loading = signal(false);
  private error = signal<string | null>(null);

  readonly content = computed(() => this.data());
  readonly loadingState = computed(() => this.loading());
  readonly errorMessage = computed(() => this.error());

  load(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.http.get<LandingContent>(this.apiConfig.apiUrl('/api/public/landing')).subscribe({
      next: (c) => {
        this.data.set(c);
        this.loaded.set(true);
        this.loading.set(false);
        this.error.set(null);
      },
      error: (err) => {
        this.error.set(err?.message || 'Failed to load content');
        this.data.set(null);
        this.loading.set(false);
      },
    });
  }

  /** Retry after error; clears error and triggers a fresh load */
  retry(): void {
    this.loaded.set(false);
    this.error.set(null);
    this.load();
  }
}
