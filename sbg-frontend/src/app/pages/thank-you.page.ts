import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'sbg-thank-you',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="min-h-[70vh] flex items-center justify-center sbg-section bg-sbg-gray-50">
      <div class="text-center max-w-lg mx-auto">
        <div class="w-20 h-20 mx-auto rounded-full bg-sbg-emerald/10 flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-sbg-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-sbg-navy mb-4">
          {{ i18n.t('Thank You!', 'شكراً لك!') }}
        </h1>
        <p class="text-sbg-gray-500 text-lg mb-8 leading-relaxed">
          {{ i18n.t(
            'Your consultation request has been received. Our team will review it and contact you within 24 hours.',
            'تم استلام طلب الاستشارة الخاص بك. سيقوم فريقنا بمراجعته والتواصل معك خلال 24 ساعة.'
          ) }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/solutions"
             class="px-6 py-3 rounded-xl text-white font-semibold sbg-gradient-blue hover:opacity-90 transition-opacity">
            {{ i18n.t('Explore Solutions', 'استكشف الحلول') }}
          </a>
          <a routerLink="/"
             class="px-6 py-3 rounded-xl bg-sbg-gray-100 text-sbg-gray-700 font-semibold hover:bg-sbg-gray-200 transition-colors">
            {{ i18n.t('Back to Home', 'العودة للرئيسية') }}
          </a>
        </div>
      </div>
    </section>
  `,
})
export class ThankYouPage {
  i18n = inject(I18nService);
}
