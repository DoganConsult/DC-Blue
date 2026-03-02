import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { COMPLIANCE_BADGES } from '../core/data/site-content';

@Component({
  selector: 'app-social-proof-section',
  standalone: true,
  template: `
    <section class="bg-th-card" [class]="ds.section.wrapperLg">
      <div [class]="ds.section.container">
        <div class="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          {{ i18n.t('Trusted by leaders', 'موثوق من القادة') }}
        </div>
        <h2 class="text-3xl font-bold text-brand-dark mb-2">
          {{ i18n.t('What our clients say', 'ماذا يقول عملاؤنا') }}
        </h2>
        <p class="text-th-text-2 mb-12 max-w-2xl">
          {{ i18n.t('CIOs and IT leaders across government and enterprise.', 'مديرو تقنية المعلومات وقادة IT في القطاع الحكومي والمؤسسات.') }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2" [class]="ds.spacing.gapXl" class="mb-12">
          <div class="bg-th-bg-alt border border-th-border-lt" [class]="ds.radius.card + ' ' + ds.component.cardPadding + ' ' + ds.transition.base">
            <p class="text-th-text-2 mb-4 italic">
              {{ i18n.t('Dogan Consult delivered our network modernization on time with full as-built documentation. Rare in this market.', 'قامت دوغان للاستشارات بتسليم تحديث شبكتنا في الوقت المحدد مع توثيق كامل. نادر في هذا السوق.') }}
            </p>
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</span>
              <div>
                <span class="font-semibold text-th-text">{{ i18n.t('IT Director', 'مدير تقنية المعلومات') }}</span>
                <span class="text-th-text-3 text-sm block">{{ i18n.t('Government sector', 'القطاع الحكومي') }}</span>
              </div>
            </div>
          </div>
          <div class="bg-th-bg-alt border border-th-border-lt" [class]="ds.radius.card + ' ' + ds.component.cardPadding + ' ' + ds.transition.base">
            <p class="text-th-text-2 mb-4 italic">
              {{ i18n.t('Security hardening and SOC integration were done to a high standard. We now have clear visibility.', 'تم تنفيذ تعزيز الأمن ودمج مركز العمليات الأمنية بمستوى عالٍ. لدينا الآن رؤية واضحة.') }}
            </p>
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-saudi-green/20 flex items-center justify-center text-saudi-green font-bold">M</span>
              <div>
                <span class="font-semibold text-th-text">{{ i18n.t('CISO', 'مدير أمن المعلومات') }}</span>
                <span class="text-th-text-3 text-sm block">{{ i18n.t('Financial services', 'الخدمات المالية') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap justify-center gap-4 text-th-text-3 font-bold text-sm mb-16">
          @for (badge of complianceBadges; track badge.en) {
            <span class="px-4 py-2 rounded-lg border border-th-border bg-th-card">{{ i18n.t(badge.en, badge.ar) }}</span>
          }
        </div>

        <div class="border-t border-th-border-lt pt-12">
          <p class="text-center text-[13px] text-th-text-3 font-medium tracking-widest uppercase mb-8">{{ i18n.t('Technology Partners', 'شركاء التقنية') }}</p>
          <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            @for (partner of techPartners; track partner.name) {
              <div class="flex items-center gap-2 text-th-text-3 hover:text-th-text-3 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="partnerIconPaths[partner.id]" /></svg>
                <span class="text-sm font-semibold tracking-wide">{{ partner.name }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class SocialProofSectionComponent {
  i18n = inject(I18nService);
  ds = inject(DesignSystemService);
  complianceBadges = COMPLIANCE_BADGES;

  readonly partnerIconPaths: Record<string, string> = {
    'microsoft': 'M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z',
    'cisco': 'M3 8v8m3-10v12m3-10v8m3-12v16m3-12v8m3-10v12m3-10v8',
    'aws': 'M6.5 19h11a4.5 4.5 0 0 0 .44-8.97 5.5 5.5 0 0 0-10.38-1.74A3.5 3.5 0 0 0 6.5 19Z',
    'fortinet': 'M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5Zm0 4l5 2.75v5.5L12 17l-5-2.75v-5.5L12 6Z',
    'vmware': 'M4 5h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 9h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z',
    'paloalto': 'M12 3s-7 3-7 9c0 4.5 3.5 8 7 9 3.5-1 7-4.5 7-9 0-6-7-9-7-9Z',
    'oracle': 'M5 12a7 7 0 0 1 14 0 7 7 0 0 1-14 0Zm3 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z',
    'dell': 'M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2M19 9h2m-2 6h2M7 7h10v10H7zm3 3h4v4h-4z',
  };

  techPartners = [
    { id: 'microsoft', name: 'Microsoft' },
    { id: 'cisco', name: 'Cisco' },
    { id: 'aws', name: 'AWS' },
    { id: 'fortinet', name: 'Fortinet' },
    { id: 'vmware', name: 'VMware' },
    { id: 'paloalto', name: 'Palo Alto' },
    { id: 'oracle', name: 'Oracle' },
    { id: 'dell', name: 'Dell' },
  ];
}
