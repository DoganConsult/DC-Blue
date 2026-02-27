import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LandingContent } from '../pages/landing.page';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  template: `
    <section class="bg-gradient-to-br from-brand-dark via-brand-dark to-brand-darker text-white py-20 px-4">
      <div class="container mx-auto max-w-5xl text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
          {{ i18n.t(c?.hero?.headline?.en ?? 'ICT Engineering, Delivered.', c?.hero?.headline?.ar ?? 'هندسة تقنية المعلومات، بإتقان.') }}
        </h1>
        <p class="text-lg text-sky-100 mb-8 max-w-2xl mx-auto">
          {{ i18n.t(c?.hero?.subline?.en ?? 'Design, build, and operate enterprise-grade ICT environments.', c?.hero?.subline?.ar ?? 'تصميم وبناء وتشغيل بيئات تقنية المعلومات على مستوى المؤسسات.') }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <a
            (click)="router.navigate(['/inquiry'])"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-sky-400 text-white font-semibold transition cursor-pointer"
          >
            {{ i18n.t(c?.hero?.cta?.en ?? 'Request Proposal', c?.hero?.cta?.ar ?? 'اطلب عرضاً') }}
          </a>
          <a
            (click)="router.navigate(['/partner'])"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-white/50 text-white hover:bg-white/10 font-medium transition cursor-pointer"
          >
            {{ i18n.t('Portal Login', 'دخول البوابة') }}
          </a>
          <a
            (click)="router.navigate(['/partner/register'])"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-white/50 text-white hover:bg-white/10 font-medium transition cursor-pointer"
          >
            {{ i18n.t('Register', 'التسجيل') }}
          </a>
        </div>
        <p class="mt-4 text-sm text-sky-200/90">
          {{ i18n.t('Partners & candidates: login or register to access your portal.', 'الشركاء والمرشحون: سجّل الدخول أو أنشئ حساباً للوصول إلى بوابتك.') }}
        </p>
      </div>
    </section>
  `,
})
export class HeroSectionComponent {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);
  router = inject(Router);
  get c() { return this.content(); }
}
