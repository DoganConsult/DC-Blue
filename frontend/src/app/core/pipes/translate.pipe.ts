import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService, Lang } from '../services/i18n.service';

/**
 * Dynamic auto translation pipe. Updates when language changes (impure so it re-runs).
 *
 * Usage:
 *   {{ 'nav.sign_in' | translate }}
 *
 * Optional: pass lang for pure usage: {{ 'nav.sign_in' | translate : i18n.lang() }}
 */
@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string, lang?: Lang): string {
    return this.i18n.get(key, lang ?? this.i18n.lang());
  }
}
