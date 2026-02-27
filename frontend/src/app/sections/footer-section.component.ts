import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  template: `
    <footer class="bg-gray-900 text-gray-300 py-16 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div class="md:col-span-2">
            <span class="font-bold text-white text-lg">Dogan Consult</span>
            <span class="text-gray-400 ml-2">— {{ i18n.t('ICT Engineering Services', 'خدمات هندسة تقنية المعلومات والاتصالات') }}</span>
            <p class="mt-3 text-gray-400 text-sm max-w-sm">
              {{ i18n.t('Design, build, and operate enterprise ICT. KSA and GCC.', 'نصمم ونبني ونشغّل تقنية المعلومات المؤسسية. المملكة والخليج.') }}
            </p>
          </div>
          <div>
            <h4 class="text-white text-sm font-bold uppercase tracking-wider mb-3">{{ i18n.t('Site', 'الموقع') }}</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#services" class="hover:text-primary transition">{{ i18n.t('Services', 'الخدمات') }}</a></li>
              <li><a href="#industries" class="hover:text-primary transition">{{ i18n.t('Industries', 'القطاعات') }}</a></li>
              <li><a href="#pricing" class="hover:text-primary transition">{{ i18n.t('Pricing', 'الأسعار') }}</a></li>
              <li><a (click)="router.navigate(['/inquiry'])" class="hover:text-primary transition cursor-pointer">{{ i18n.t('Request Proposal', 'طلب عرض') }}</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white text-sm font-bold uppercase tracking-wider mb-3">{{ i18n.t('Portals', 'البوابات') }}</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a (click)="router.navigate(['/track'])" class="hover:text-primary transition cursor-pointer">{{ i18n.t('Track Inquiry', 'تتبع الاستفسار') }}</a></li>
              <li><a (click)="router.navigate(['/partner'])" class="hover:text-primary transition cursor-pointer">{{ i18n.t('Partner Portal', 'بوابة الشركاء') }}</a></li>
              <li><a (click)="router.navigate(['/partner/register'])" class="hover:text-primary transition cursor-pointer">{{ i18n.t('Become a Partner', 'انضم كشريك') }}</a></li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-800">
          <p class="text-gray-500 text-sm">
            {{ i18n.t('© Dogan Consult. All rights reserved.', '© دوغان للاستشارات. جميع الحقوق محفوظة.') }}
          </p>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
            {{ i18n.t('Made in KSA', 'صُنع في المملكة العربية السعودية') }}
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterSectionComponent {
  i18n = inject(I18nService);
  router = inject(Router);
}
