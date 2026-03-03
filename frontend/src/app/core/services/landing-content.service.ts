import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LandingContent } from '../models/landing.model';

@Injectable({ providedIn: 'root' })
export class LandingContentService {
  private http = inject(HttpClient);
  private loaded = signal(false);
  private data = signal<LandingContent | null>(null);

  readonly content = computed(() => this.data());

  load(): void {
    if (this.loaded()) return;
    this.loaded.set(true);
    this.http.get<LandingContent>('/api/public/landing').subscribe({
      next: (c) => this.data.set(c),
      error: () => this.data.set(null),
    });
  }
}
