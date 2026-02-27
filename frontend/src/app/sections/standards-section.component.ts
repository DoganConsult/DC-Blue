import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-standards-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-white" id="standards">
      <div class="container mx-auto max-w-6xl">
        <div class="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          {{ i18n.t('Standards & frameworks', 'المعايير والأطر') }}
        </div>
        <h2 class="text-3xl font-bold text-brand-dark mb-2">
          {{ i18n.t('We align with global and local standards', 'نلتزم بالمعايير المحلية والعالمية') }}
        </h2>
        <p class="text-gray-600 mb-12 max-w-2xl">
          {{ i18n.t('Our delivery and documentation follow recognized frameworks.', 'تسليمنا وتوثيقنا يتبعان أطراً معترفاً بها.') }}
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (f of frameworks; track f.code) {
            <div
              class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center hover:border-primary/40 hover:bg-sky-50/50 transition"
            >
              <span class="font-bold text-gray-800 block">{{ f.code }}</span>
              <span class="text-xs text-gray-500">{{ i18n.t(f.nameEn, f.nameAr) }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class StandardsSectionComponent {
  i18n = inject(I18nService);
  frameworks = [
    { code: 'ISO 27001', nameEn: 'Information security', nameAr: 'أمن المعلومات' },
    { code: 'ISO 20000', nameEn: 'IT service management', nameAr: 'إدارة خدمات تقنية المعلومات' },
    { code: 'ITIL', nameEn: 'Service lifecycle', nameAr: 'دورة حياة الخدمة' },
    { code: 'NCA ECC', nameEn: 'KSA cybersecurity', nameAr: 'الأمن السيبراني السعودي' },
    { code: 'NIST CSF', nameEn: 'Security framework', nameAr: 'إطار الأمن' },
    { code: 'CIS', nameEn: 'Hardening benchmarks', nameAr: 'معايير التعزيز' },
  ];
}
