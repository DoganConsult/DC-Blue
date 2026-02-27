import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

const TIERS = [
  { id: 'advisory', titleEn: 'Advisory', titleAr: 'استشاري', descEn: 'Design & assessment', descAr: 'التصميم والتقييم', popular: false },
  { id: 'project', titleEn: 'Project delivery', titleAr: 'تسليم المشاريع', descEn: 'Fixed scope', descAr: 'نطاق ثابت', popular: false },
  { id: 'managed', titleEn: 'Managed services', titleAr: 'الخدمات المُدارة', descEn: 'SLA-based support', descAr: 'دعم وفق SLA', popular: true },
  { id: 'enterprise', titleEn: 'Enterprise retainer', titleAr: 'عقد مؤسسي', descEn: 'Multi-site / priority', descAr: 'متعدد المواقع / أولوية', popular: false },
];

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-white" id="pricing">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('Engagement models', 'نماذج التعاقد') }}
        </h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('From assessment to full managed services.', 'من التقييم إلى الخدمات المُدارة الكاملة.') }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (t of tiers; track t.id) {
            <div
              class="rounded-2xl border p-6 relative transition"
              [class.border-primary]="t.popular"
              [class.border-2]="t.popular"
              [class.shadow-xl]="t.popular"
              [class.border-gray-200]="!t.popular"
            >
              @if (t.popular) {
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-white text-xs font-semibold">
                  {{ i18n.t('Most popular', 'الأكثر طلباً') }}
                </span>
              }
              <h3 class="font-bold text-lg text-gray-900">{{ i18n.t(t.titleEn, t.titleAr) }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ i18n.t(t.descEn, t.descAr) }}</p>
              <a
                href="#contact"
                class="mt-4 inline-block w-full text-center py-2 rounded-lg font-medium transition"
                [class.bg-primary]="t.popular"
                [class.text-white]="t.popular"
                [class.border]="!t.popular"
                [class.border-primary]="!t.popular"
                [class.text-primary]="!t.popular"
              >
                {{ i18n.t('Contact us', 'تواصل معنا') }}
              </a>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class PricingSectionComponent {
  i18n = inject(I18nService);
  tiers = TIERS;
}
