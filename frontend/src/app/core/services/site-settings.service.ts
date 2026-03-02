import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface SiteSettings {
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  address_en: string | null;
  address_ar: string | null;
  cr_number: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  locale: string | null;
}

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private http = inject(HttpClient);
  private loaded = signal(false);
  private data = signal<SiteSettings | null>(null);

  readonly settings = computed(() => this.data());
  readonly whatsappNumber = computed(() => {
    const s = this.data();
    if (!s?.whatsapp_number) return '966500000000';
    const n = String(s.whatsapp_number).replace(/\D/g, '');
    return n.startsWith('0') ? '966' + n.slice(1) : n;
  });
  readonly whatsappUrl = computed(() => {
    const num = this.whatsappNumber();
    const text = encodeURIComponent("Hello Dogan Consult, I'd like to inquire about your ICT services.");
    return `https://wa.me/${num}?text=${text}`;
  });

  load(): void {
    if (this.loaded()) return;
    this.loaded.set(true);
    this.http.get<SiteSettings>('/api/public/site-settings').subscribe({
      next: (s) => this.data.set(s),
      error: () => this.data.set(null),
    });
  }
}
