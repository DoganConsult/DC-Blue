import { Component, input, output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LandingContent } from '../pages/landing.page';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-nav-section',
  standalone: true,
  template: `
    <nav class="fixed top-0 left-0 right-0 z-[1100] bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div class="container mx-auto px-4 flex items-center justify-between h-16">
        <a href="/" class="flex items-center gap-2 shrink-0">
          <span class="font-bold text-xl text-brand-dark">Dogan Consult</span>
          <span class="text-sm text-primary hidden sm:inline">— {{ i18n.t('ICT Engineering Services', 'خدمات هندسة تقنية المعلومات والاتصالات') }}</span>
        </a>
        <div class="hidden md:flex items-center gap-1">
          <a href="#services" class="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-primary/10 transition">{{ i18n.t('Services', 'الخدمات') }}</a>
          <a href="#industries" class="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-primary/10 transition">{{ i18n.t('Industries', 'القطاعات') }}</a>
          <a href="#pricing" class="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-primary/10 transition">{{ i18n.t('Pricing', 'الأسعار') }}</a>
          <a (click)="router.navigate(['/partner'])" class="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-primary/10 transition cursor-pointer">{{ i18n.t('Partners', 'الشركاء') }}</a>
          <a (click)="router.navigate(['/track'])" class="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-primary/10 transition cursor-pointer">{{ i18n.t('Track Inquiry', 'تتبع الاستفسار') }}</a>
        </div>
        <div class="flex items-center gap-2">
          <a
            (click)="router.navigate(['/login'])"
            class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/10 transition cursor-pointer hidden sm:inline-block"
          >
            {{ i18n.t('Sign In', 'تسجيل الدخول') }}
          </a>
          <a
            (click)="router.navigate(['/register'])"
            class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/10 transition cursor-pointer hidden sm:inline-block"
          >
            {{ i18n.t('Register', 'التسجيل') }}
          </a>
          <button
            type="button"
            (click)="langChange.emit(i18n.lang() === 'en' ? 'ar' : 'en')"
            class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-primary hover:text-white transition"
          >
            {{ i18n.lang() === 'en' ? 'عربي' : 'English' }}
          </button>
          <a
            (click)="router.navigate(['/inquiry'])"
            class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-brand-dark transition cursor-pointer"
          >
            {{ content() ? i18n.t(content()!.hero.cta.en, content()!.hero.cta.ar) : i18n.t('Request Proposal', 'طلب عرض') }}
          </a>
        </div>
      </div>
    </nav>
    <div class="h-16"></div>
  `,
})
export class NavSectionComponent {
  content = input<LandingContent | null>(null);
  langChange = output<'en' | 'ar'>();
  i18n = inject(I18nService);
  router = inject(Router);
}
