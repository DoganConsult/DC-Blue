import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'sbg-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="min-h-[70vh] flex items-center justify-center sbg-section bg-sbg-gray-50">
      <div class="text-center max-w-lg mx-auto">
        <div class="text-8xl font-bold text-sbg-gray-200 mb-4">404</div>
        <h1 class="text-3xl font-bold text-sbg-navy mb-4">
          {{ i18n.t('Page Not Found', 'الصفحة غير موجودة') }}
        </h1>
        <p class="text-sbg-gray-500 mb-8">
          {{ i18n.t(
            'The page you are looking for does not exist or has been moved.',
            'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
          ) }}
        </p>
        <a routerLink="/"
           class="inline-flex px-6 py-3 rounded-xl text-white font-semibold sbg-gradient-blue hover:opacity-90 transition-opacity">
          {{ i18n.t('Back to Home', 'العودة للرئيسية') }}
        </a>
      </div>
    </section>
  `,
})
export class NotFoundPage {
  i18n = inject(I18nService);
}
