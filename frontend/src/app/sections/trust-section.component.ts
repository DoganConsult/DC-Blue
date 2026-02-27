import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-trust-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-gray-50" id="trust">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('Trust & compliance', 'الثقة والامتثال') }}
        </h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('Engineering certifications and process alignment.', 'الشهادات الهندسية ومحاذاة العمليات.') }}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <span class="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium">ISO 27001</span>
          <span class="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium">NCA aligned</span>
          <span class="px-4 py-2 rounded-full bg-saudi-green/10 text-saudi-green border border-saudi-green/30 text-sm font-medium">KSA data residency</span>
        </div>
      </div>
    </section>
  `,
})
export class TrustSectionComponent {
  i18n = inject(I18nService);
}
