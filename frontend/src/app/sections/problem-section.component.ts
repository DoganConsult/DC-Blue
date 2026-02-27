import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-problem-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-gray-50" id="problem">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('Why ICT delivery fails', 'لماذا تفشل مشاريع تقنية المعلومات والاتصالات') }}
        </h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('Common pain points we help organizations solve.', 'نقاط ألم شائعة نساعد المؤسسات في حلها.') }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
            <span class="text-3xl text-primary pi pi-sitemap block mb-4" aria-hidden="true"></span>
            <h3 class="font-semibold text-lg text-gray-900 mb-2">
              {{ i18n.t('Fragmented infrastructure & visibility', 'بنية تحتية مبعثرة وغياب الرؤية') }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ i18n.t('Siloed systems, unclear ownership, and no single view of your ICT estate.', 'أنظمة معزولة وملكية غير واضحة وعدم وجود رؤية موحدة لأصول التقنية.') }}
            </p>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
            <span class="text-3xl text-red-500 pi pi-shield block mb-4" aria-hidden="true"></span>
            <h3 class="font-semibold text-lg text-gray-900 mb-2">
              {{ i18n.t('Security gaps across hybrid environments', 'ثغرات أمنية عبر البيئات الهجينة') }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ i18n.t('Cloud, on-prem, and OT/IoT need consistent hardening and monitoring.', 'السحابة والمحلي وبيئات التشغيل تحتاج إلى تعزيز ومراقبة متسقة.') }}
            </p>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
            <span class="text-3xl text-amber-500 pi pi-clock block mb-4" aria-hidden="true"></span>
            <h3 class="font-semibold text-lg text-gray-900 mb-2">
              {{ i18n.t('Slow delivery & undocumented handover', 'تسليم بطيء وتسليم غير موثق') }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ i18n.t('Projects slip, handover is ad-hoc, and runbooks are missing.', 'المشاريع تتأخر والتسليم عشوائي ودلائل التشغيل مفقودة.') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ProblemSectionComponent {
  i18n = inject(I18nService);
}
