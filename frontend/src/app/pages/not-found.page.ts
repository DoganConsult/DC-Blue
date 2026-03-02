import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-th-card flex items-center justify-center px-6">
      <div class="text-center max-w-md">
        <div class="text-8xl font-bold text-th-text-3 mb-4">404</div>
        <h1 class="text-2xl font-bold text-th-text mb-3">{{ i18n.t('Page not found', 'الصفحة غير موجودة') }}</h1>
        <p class="text-th-text-3 mb-8">{{ i18n.t("The page you're looking for doesn't exist or has been moved.", 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.') }}</p>
        <div class="flex items-center justify-center gap-4">
          <a routerLink="/" class="px-6 py-3 rounded-xl bg-th-bg-inv text-th-text-inv text-sm font-semibold hover:bg-th-bg-inv transition-colors">
            {{ i18n.t('Back to Home', 'العودة للرئيسية') }}
          </a>
          <a routerLink="/inquiry" class="px-6 py-3 rounded-xl border border-th-border text-th-text-2 text-sm font-semibold hover:bg-th-bg-alt transition-colors">
            {{ i18n.t('Contact Us', 'تواصل معنا') }}
          </a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundPage {
  i18n = inject(I18nService);
}
