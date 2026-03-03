import { Component, inject, input, signal } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { LandingContent } from '../core/models/landing.model';

const FAQ_ITEMS = [
  { qEn: 'What are your typical delivery timelines?', qAr: 'ما هي المدد النموذجية للتسليم؟', aEn: 'Depends on scope; we provide a clear timeline after discovery.', aAr: 'تعتمد على النطاق؛ نقدم جدولاً واضحاً بعد مرحلة الاكتشاف.' },
  { qEn: 'Do you offer 24/7 support?', qAr: 'هل تقدمون دعمًا على مدار الساعة؟', aEn: 'Yes, under Managed Services and Enterprise tiers.', aAr: 'نعم، ضمن مستويات الخدمات المُدارة والمؤسسية.' },
  { qEn: 'Can you work on-site in KSA?', qAr: 'هل يمكنكم العمل ميدانياً في المملكة؟', aEn: 'Yes. We have on-site capability across major regions.', aAr: 'نعم. لدينا قدرة ميدانية في المناطق الرئيسية.' },
  { qEn: 'Do you deliver in Arabic and English?', qAr: 'هل تقدمون التسليم بالعربية والإنجليزية؟', aEn: 'Yes. Documentation and communication in both languages.', aAr: 'نعم. التوثيق والتواصل باللغتين.' },
];

@Component({
  selector: 'app-faq-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-th-bg-alt" id="faq">
      <div class="container mx-auto max-w-3xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('Frequently asked questions', 'الأسئلة الشائعة') }}
        </h2>
        <p class="text-center text-th-text-2 mb-12">
          {{ i18n.t('SLAs, support windows, and engagement details.', 'التزامات SLA ونوافذ الدعم وتفاصيل التعاقد.') }}
        </p>
        <div class="space-y-3">
          @for (item of faqItems; track item.qEn) {
            <div
              class="bg-th-card rounded-xl border border-th-border overflow-hidden"
            >
              <button
                type="button"
                class="w-full flex items-center justify-between py-4 px-4 text-start font-semibold text-th-text hover:bg-th-bg-alt transition"
                (click)="toggle(item.qEn)"
              >
                {{ i18n.t(item.qEn, item.qAr) }}
                <span class="pi text-primary" [class.pi-chevron-down]="open() !== item.qEn" [class.pi-chevron-up]="open() === item.qEn"></span>
              </button>
              @if (open() === item.qEn) {
                <div class="px-4 pb-4 text-th-text-2 text-sm border-t border-th-border-lt pt-2">
                  {{ i18n.t(item.aEn, item.aAr) }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class FaqSectionComponent {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);
  open = signal<string | null>(null);

  get faqItems() { return this.content()?.faq ?? this.defaultFaqItems; }

  private defaultFaqItems = FAQ_ITEMS;
  toggle(key: string): void {
    this.open.set(this.open() === key ? null : key);
  }
}
