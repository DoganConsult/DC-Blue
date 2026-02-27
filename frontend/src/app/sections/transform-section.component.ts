import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-transform-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-gray-50" id="transform">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('From reactive to resilient', 'من التفاعل إلى المرونة') }}
        </h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('We help you move from firefighting to a secure, documented, and monitored ICT environment.', 'نساعدك على الانتقال من إطفاء الحرائق إلى بيئة تقنية آمنة وموثقة ومراقبة.') }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white rounded-2xl p-6 border border-red-100">
            <h3 class="font-semibold text-lg text-red-700 mb-4 flex items-center gap-2">
              <span class="pi pi-times-circle"></span>
              {{ i18n.t('Before', 'قبل') }}
            </h3>
            <ul class="space-y-2 text-gray-600 text-sm">
              <li>{{ i18n.t('Unmanaged, siloed systems', 'أنظمة غير مُدارة ومعزولة') }}</li>
              <li>{{ i18n.t('Reactive support, no SLAs', 'دعم تفاعلي بدون التزامات SLA') }}</li>
              <li>{{ i18n.t('Undocumented changes', 'تغييرات غير موثقة') }}</li>
              <li>{{ i18n.t('No single view of risk', 'لا توجد رؤية موحدة للمخاطر') }}</li>
            </ul>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-emerald-200 border-2">
            <h3 class="font-semibold text-lg text-emerald-700 mb-4 flex items-center gap-2">
              <span class="pi pi-check-circle"></span>
              {{ i18n.t('After', 'بعد') }}
            </h3>
            <ul class="space-y-2 text-gray-600 text-sm">
              <li>{{ i18n.t('Standardized, secure-by-design', 'معيارية وآمنة بالتصميم') }}</li>
              <li>{{ i18n.t('Documented runbooks & as-builts', 'دلائل تشغيل ورسومات كما بُنيت') }}</li>
              <li>{{ i18n.t('Monitoring & observability', 'مراقبة وإمكانية رصد') }}</li>
              <li>{{ i18n.t('Clear ownership & SLAs', 'ملكية و SLA واضحة') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TransformSectionComponent {
  i18n = inject(I18nService);
}
