import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>('ar');
  readonly dir = computed(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));
  readonly isAr = computed(() => this.lang() === 'ar');

  setLang(l: Lang): void {
    this.lang.set(l);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', this.dir());
      document.documentElement.setAttribute('lang', l);
      document.body.style.fontFamily = l === 'ar'
        ? "'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif"
        : "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif";
    }
  }

  toggle(): void {
    this.setLang(this.lang() === 'ar' ? 'en' : 'ar');
  }

  t(en: string, ar: string): string {
    return this.lang() === 'ar' ? ar : en;
  }
}
