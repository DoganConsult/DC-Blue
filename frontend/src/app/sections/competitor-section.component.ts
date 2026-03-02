import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-competitor-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-th-card" id="comparison">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('What sets us apart', 'ما الذي يميزنا') }}
        </h2>
        <p class="text-center text-th-text-2 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('Feature-based comparison: delivery quality, documentation, and support.', 'مقارنة قائمة على الميزات: جودة التسليم والتوثيق والدعم.') }}
        </p>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[600px] border border-th-border rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-th-bg-alt border-b border-th-border">
                <th class="text-start py-3 px-4 font-semibold text-th-text">{{ i18n.t('Criteria', 'المعيار') }}</th>
                <th class="text-center py-3 px-4 font-semibold text-primary">{{ i18n.t('Dogan Consult', 'دوغان كونسلت') }}</th>
                <th class="text-center py-3 px-4 font-semibold text-th-text-3">{{ i18n.t('Typical market', 'السوق النموذجي') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-th-border-lt"><td class="py-3 px-4 text-th-text-2">{{ i18n.t('Documentation quality', 'جودة التوثيق') }}</td><td class="py-3 px-4 text-center text-emerald-600 pi pi-check"></td><td class="py-3 px-4 text-center text-th-text-3">—</td></tr>
              <tr class="border-b border-th-border-lt"><td class="py-3 px-4 text-th-text-2">{{ i18n.t('Commissioning & testing', 'التشغيل والاختبار') }}</td><td class="py-3 px-4 text-center text-emerald-600 pi pi-check"></td><td class="py-3 px-4 text-center text-th-text-3">—</td></tr>
              <tr class="border-b border-th-border-lt"><td class="py-3 px-4 text-th-text-2">{{ i18n.t('SLA clarity', 'وضوح SLA') }}</td><td class="py-3 px-4 text-center text-emerald-600 pi pi-check"></td><td class="py-3 px-4 text-center text-th-text-3">—</td></tr>
              <tr class="border-b border-th-border-lt"><td class="py-3 px-4 text-th-text-2">{{ i18n.t('Handover completeness', 'اكتمال التسليم') }}</td><td class="py-3 px-4 text-center text-emerald-600 pi pi-check"></td><td class="py-3 px-4 text-center text-th-text-3">—</td></tr>
              <tr><td class="py-3 px-4 text-th-text-2">{{ i18n.t('On-site capability', 'القدرة الميدانية') }}</td><td class="py-3 px-4 text-center text-emerald-600 pi pi-check"></td><td class="py-3 px-4 text-center text-th-text-3">—</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
})
export class CompetitorSectionComponent {
  i18n = inject(I18nService);
}
