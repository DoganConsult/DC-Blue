import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-page-dark flex items-center justify-center px-6" [attr.dir]="i18n.dir()">
      <div class="text-center max-w-md">
        <p class="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/70 mb-2">{{ i18n.t('Error', 'خطأ') }}</p>
        <div class="text-8xl font-bold text-white/20 mb-4" aria-hidden="true">404</div>
        <h1 class="text-2xl font-bold text-white mb-3">{{ i18n.t('Page not found', 'الصفحة غير موجودة') }}</h1>
        <p class="text-white/70 mb-6">{{ i18n.t("The page you're looking for doesn't exist or has been moved.", 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.') }}</p>
        <p class="text-white/50 text-sm mb-4">{{ i18n.t('Popular pages', 'صفحات شائعة') }}:</p>
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <a routerLink="/services" class="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 text-sm hover:bg-white/10">{{ i18n.t('Services', 'الخدمات') }}</a>
          <a routerLink="/about" class="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 text-sm hover:bg-white/10">{{ i18n.t('About', 'من نحن') }}</a>
          <a routerLink="/inquiry" class="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 text-sm hover:bg-white/10">{{ i18n.t('Inquiry', 'استفسار') }}</a>
        </div>
        <div class="flex items-center justify-center gap-4 flex-wrap">
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
export class NotFoundPage implements OnInit {
  i18n = inject(I18nService);
  private meta = inject(Meta);
  private title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle(this.i18n.t('Page not found', 'الصفحة غير موجودة') + ' | Dogan Consult');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }
}
