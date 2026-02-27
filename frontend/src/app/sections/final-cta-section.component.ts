import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-gradient-to-br from-primary via-sky-600 to-blue-600 text-white" id="final-cta">
      <div class="container mx-auto max-w-4xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          {{ i18n.t('Talk to an ICT architect today', 'تحدث إلى مهندس تقنية معلومات اليوم') }}
        </h2>
        <p class="text-sky-100 mb-8 max-w-2xl mx-auto">
          {{ i18n.t('Request a consultation or download our capability statement.', 'اطلب استشارة أو حمّل بيان قدراتنا.') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            (click)="router.navigate(['/inquiry'])"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-sky-50 transition cursor-pointer"
          >
            {{ i18n.t('Request proposal', 'طلب عرض') }}
          </a>
          <a
            (click)="router.navigate(['/inquiry'])"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition cursor-pointer"
          >
            {{ i18n.t('Book consultation', 'حجز استشارة') }}
          </a>
        </div>
      </div>
    </section>
  `,
})
export class FinalCtaSectionComponent {
  i18n = inject(I18nService);
  router = inject(Router);
}
