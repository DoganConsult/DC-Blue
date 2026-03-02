import { Injectable, signal, computed } from '@angular/core';
import { TRANSLATIONS, TranslationEntry } from '../data/translations';

export type Lang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>('en');
  readonly dir = computed(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));

  /** Dynamic dictionary (merged with TRANSLATIONS). Set from API or lazy-loaded JSON if needed. */
  private dynamicDict: Record<string, TranslationEntry> = {};

  setLang(l: Lang): void {
    this.lang.set(l);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', this.dir());
      document.documentElement.setAttribute('lang', l);
    }
  }

  /**
   * Manual translation (existing usage). Prefer get(key) when you have a dictionary key.
   */
  t(en: string, ar: string): string {
    return this.lang() === 'ar' ? ar : en;
  }

  /**
   * Dynamic auto translation by key. Resolves from TRANSLATIONS + dynamicDict.
   * Use in templates: {{ 'nav.sign_in' | translate }} (pipe updates when lang changes)
   * Or in code: i18n.get('nav.sign_in')
   */
  get(key: string, lang?: Lang): string {
    const l = lang ?? this.lang();
    const entry = this.dynamicDict[key] ?? TRANSLATIONS[key];
    if (entry) return l === 'ar' ? entry.ar : entry.en;
    return key;
  }

  /**
   * Merge additional translations (e.g. from API). Does not replace existing keys.
   */
  register(entries: Record<string, TranslationEntry>): void {
    this.dynamicDict = { ...this.dynamicDict, ...entries };
  }

  /**
   * Replace dynamic dictionary (e.g. after loading full JSON).
   */
  setDynamicDict(dict: Record<string, TranslationEntry>): void {
    this.dynamicDict = dict;
  }
}
