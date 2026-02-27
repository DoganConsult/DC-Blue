import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-social-proof-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-white" id="social-proof">
      <div class="container mx-auto max-w-6xl">
        <div class="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          {{ i18n.t('Trusted by leaders', 'موثوق من القادة') }}
        </div>
        <h2 class="text-3xl font-bold text-brand-dark mb-2">
          {{ i18n.t('What our clients say', 'ماذا يقول عملاؤنا') }}
        </h2>
        <p class="text-gray-600 mb-12 max-w-2xl">
          {{ i18n.t('CIOs and IT leaders across government and enterprise.', 'مديرو تقنية المعلومات وقادة IT في القطاع الحكومي والمؤسسات.') }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p class="text-gray-700 mb-4 italic">
              {{ i18n.t('Dogan Consult delivered our network modernization on time with full as-built documentation. Rare in this market.', 'قامت دوغان للاستشارات بتسليم تحديث شبكتنا في الوقت المحدد مع توثيق كامل. نادر في هذا السوق.') }}
            </p>
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</span>
              <div>
                <span class="font-semibold text-gray-900">{{ i18n.t('IT Director', 'مدير تقنية المعلومات') }}</span>
                <span class="text-gray-500 text-sm block">{{ i18n.t('Government sector', 'القطاع الحكومي') }}</span>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p class="text-gray-700 mb-4 italic">
              {{ i18n.t('Security hardening and SOC integration were done to a high standard. We now have clear visibility.', 'تم تنفيذ تعزيز الأمن ودمج مركز العمليات الأمنية بمستوى عالٍ. لدينا الآن رؤية واضحة.') }}
            </p>
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-saudi-green/20 flex items-center justify-center text-saudi-green font-bold">M</span>
              <div>
                <span class="font-semibold text-gray-900">{{ i18n.t('CISO', 'مدير أمن المعلومات') }}</span>
                <span class="text-gray-500 text-sm block">{{ i18n.t('Financial services', 'الخدمات المالية') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap justify-center gap-4 text-gray-400 font-bold text-sm">
          <span class="px-4 py-2 rounded-lg border border-gray-200 bg-white">ISO 27001</span>
          <span class="px-4 py-2 rounded-lg border border-gray-200 bg-white">NCA ECC</span>
          <span class="px-4 py-2 rounded-lg border border-gray-200 bg-white">ITIL</span>
          <span class="px-4 py-2 rounded-lg border border-gray-200 bg-white">CIS</span>
        </div>
      </div>
    </section>
  `,
})
export class SocialProofSectionComponent {
  i18n = inject(I18nService);
}
