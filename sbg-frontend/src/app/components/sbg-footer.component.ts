import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'sbg-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-sbg-navy text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <!-- Brand Column -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sbg-gold font-bold text-sm">SBG</div>
              <span class="font-bold text-lg">{{ i18n.t('Saudi Business Gate', 'بوابة الأعمال السعودية') }}</span>
            </div>
            <p class="text-sbg-gray-400 text-sm leading-relaxed mb-4">
              {{ i18n.t(
                'Enterprise SaaS marketplace for digital transformation solutions aligned with Saudi Vision 2030.',
                'سوق الحلول الرقمية المتكاملة للمؤسسات والجهات الحكومية المتوافقة مع رؤية السعودية 2030.'
              ) }}
            </p>
            <div class="flex items-center gap-2 text-xs text-sbg-gray-400">
              <span class="px-2 py-1 bg-white/5 rounded">{{ i18n.t('Microsoft Partner', 'شريك مايكروسوفت') }}</span>
              <span class="px-2 py-1 bg-white/5 rounded">MPN 7056213</span>
            </div>
          </div>

          <!-- Solutions Column -->
          <div>
            <h4 class="font-semibold text-sbg-gold mb-4">{{ i18n.t('Solutions', 'الحلول') }}</h4>
            <ul class="space-y-2 text-sm text-sbg-gray-300">
              <li><a routerLink="/solutions/dogan-systems" class="hover:text-white transition-colors">{{ i18n.t('Dogan Systems', 'أنظمة دوغان') }}</a></li>
              <li><a routerLink="/solutions/shahin-ai" class="hover:text-white transition-colors">{{ i18n.t('Shahin AI', 'شاهين AI') }}</a></li>
              <li><a routerLink="/solutions" class="hover:text-white transition-colors">{{ i18n.t('All Solutions', 'جميع الحلول') }}</a></li>
            </ul>
          </div>

          <!-- Categories Column -->
          <div>
            <h4 class="font-semibold text-sbg-gold mb-4">{{ i18n.t('Categories', 'الفئات') }}</h4>
            <ul class="space-y-2 text-sm text-sbg-gray-300">
              <li><a routerLink="/categories/automation" class="hover:text-white transition-colors">{{ i18n.t('Automation', 'الأتمتة') }}</a></li>
              <li><a routerLink="/categories/ai" class="hover:text-white transition-colors">{{ i18n.t('AI', 'الذكاء الاصطناعي') }}</a></li>
              <li><a routerLink="/categories/grc" class="hover:text-white transition-colors">{{ i18n.t('GRC', 'الحوكمة والمخاطر والامتثال') }}</a></li>
              <li><a routerLink="/categories/government" class="hover:text-white transition-colors">{{ i18n.t('Government', 'الحلول الحكومية') }}</a></li>
            </ul>
          </div>

          <!-- Company Column -->
          <div>
            <h4 class="font-semibold text-sbg-gold mb-4">{{ i18n.t('Company', 'الشركة') }}</h4>
            <ul class="space-y-2 text-sm text-sbg-gray-300">
              <li><a routerLink="/government" class="hover:text-white transition-colors">{{ i18n.t('Government', 'الحكومة') }}</a></li>
              <li><a routerLink="/enterprise" class="hover:text-white transition-colors">{{ i18n.t('Enterprise', 'المؤسسات') }}</a></li>
              <li><a routerLink="/contact" class="hover:text-white transition-colors">{{ i18n.t('Contact Us', 'تواصل معنا') }}</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-sbg-gray-400">
          <p>© {{ currentYear }} {{ i18n.t('Dogan Consult. All rights reserved.', 'دوغان للاستشارات. جميع الحقوق محفوظة.') }}</p>
          <p>{{ i18n.t('CR', 'سجل تجاري') }} #7008903317 · {{ i18n.t('Riyadh, Saudi Arabia', 'الرياض، المملكة العربية السعودية') }}</p>
        </div>
      </div>
    </footer>
  `,
})
export class SbgFooterComponent {
  i18n = inject(I18nService);
  currentYear = new Date().getFullYear();
}
