import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-competitor-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-white" id="comparison">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('What sets us apart', 'ما الذي يميزنا') }}
        </h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('Feature-based comparison: delivery quality, documentation, and support.', 'مقارنة قائمة على الميزات: جودة التسليم والتوثيق والدعم.') }}
        </p>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[600px] border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="text-start py-3 px-4 font-semibold text-gray-800">{{ i18n.t('Criteria', 'المعيار') }}</th>
                <th class="text-center py-3 px-4 font-semibold text-primary">Dogan Consult</th>
                <th class="text-center py-3 px-4 font-semibold text-gray-500">{{ i18n.t('Typical market', 'السوق النموذجي') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-100"><td class="py-3 px-4 text-gray-700">{{ i18n.t('Documentation quality', 'جودة التوثيق') }}</td><td class="py-3 px-4 text-center text-emerald-600 pi pi-check"></td><td class="py-3 px-4 text-center text-gray-400">—</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 px-4 text-gray-700">{{ i18n.t('Commissioning & testing', 'التشغيل والاختبار') }}</td><td class="py-3 px-4 text-center text-emerald-600 pi pi-check"></td><td class="py-3 px-4 text-center text-gray-400">—</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 px-4 text-gray-700">{{ i18n.t('SLA clarity', 'وضوح SLA') }}</td><td class="py-3 px-4 text-center text-emerald-600 pi pi-check"></td><td class="py-3 px-4 text-center text-gray-400">—</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 px-4 text-gray-700">{{ i18n.t('Handover completeness', 'اكتمال التسليم') }}</td><td class="py-3 px-4 text-center text-emerald-600 pi pi-check"></td><td class="py-3 px-4 text-center text-gray-400">—</td></tr>
              <tr><td class="py-3 px-4 text-gray-700">{{ i18n.t('On-site capability', 'القدرة الميدانية') }}</td><td class="py-3 px-4 text-center text-emerald-600 pi pi-check"></td><td class="py-3 px-4 text-center text-gray-400">—</td></tr>
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
