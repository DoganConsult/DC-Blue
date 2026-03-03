import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-page-dark flex items-center justify-center px-6">
      <div class="text-center max-w-md">
        <p class="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/70 mb-2">{{ i18n.t('Error', 'خطأ') }}</p>
        <div class="text-8xl font-bold text-white/20 mb-4">404</div>
        <h1 class="text-2xl font-bold text-white mb-3">{{ i18n.t('Page not found', 'الصفحة غير موجودة') }}</h1>
        <p class="text-white/70 mb-8">{{ i18n.t("The page you're looking for doesn't exist or has been moved.", 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.') }}</p>
        <div class="flex items-center justify-center gap-4">
          <a routerLink="/" class="px-6 py-3 rounded-lg bg-gold-accent text-page-dark text-sm font-semibold hover:brightness-90 transition-colors">
            {{ i18n.t('Back to Home', 'العودة للرئيسية') }}
          </a>
          <a routerLink="/inquiry" class="px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
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
