import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>('en');
  readonly dir = computed(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));

  setLang(l: Lang): void {
    this.lang.set(l);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', this.dir());
      document.documentElement.setAttribute('lang', l);
    }
  }

  t(en: string, ar: string): string {
    return this.lang() === 'ar' ? ar : en;
  }
}
