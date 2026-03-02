import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { PROBLEM_CARD_ACCENTS } from '../core/data/page-styles';

@Component({
  selector: 'app-problem-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-th-card" id="problem" [class]="ds.section.wrapperLg">
      <div [class]="ds.section.container">
        <div class="max-w-2xl mb-16">
          <p class="text-[13px] font-semibold text-primary tracking-widest uppercase mb-4">{{ i18n.t('The Challenge', 'التحدي') }}</p>
          <h2 class="text-3xl lg:text-4xl font-bold text-th-text tracking-tight mb-4">
            {{ i18n.t('Why ICT delivery fails', 'لماذا تفشل مشاريع تقنية المعلومات والاتصالات') }}
          </h2>
          <p class="text-lg text-th-text-3 leading-relaxed">
            {{ i18n.t('Common pain points we help organizations solve.', 'نقاط ألم شائعة نساعد المؤسسات في حلها.') }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3" [class]="ds.spacing.gapXl">
          <div class="bg-th-card border border-th-border-lt shadow-sm hover:shadow-md relative overflow-hidden group" [class]="ds.radius.card + ' ' + ds.component.cardPadding + ' ' + ds.transition.base">
            <div class="absolute top-0 left-0 w-1 h-full" [ngClass]="accents[0].barGradient"></div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" [ngClass]="accents[0].iconBg">
              <svg class="w-6 h-6" [ngClass]="accents[0].iconText" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
            </div>
            <h3 class="font-semibold text-th-text text-lg mb-3">
              {{ i18n.t('Fragmented infrastructure', 'بنية تحتية مبعثرة') }}
            </h3>
            <p class="text-[15px] text-th-text-3 leading-relaxed">
              {{ i18n.t('Siloed systems, unclear ownership, and no single view of your ICT estate.', 'أنظمة معزولة وملكية غير واضحة وعدم وجود رؤية موحدة لأصول التقنية.') }}
            </p>
          </div>
          <div class="bg-th-card border border-th-border-lt shadow-sm hover:shadow-md relative overflow-hidden group" [class]="ds.radius.card + ' ' + ds.component.cardPadding + ' ' + ds.transition.base">
            <div class="absolute top-0 left-0 w-1 h-full" [ngClass]="accents[1].barGradient"></div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" [ngClass]="accents[1].iconBg">
              <svg class="w-6 h-6" [ngClass]="accents[1].iconText" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
            <h3 class="font-semibold text-th-text text-lg mb-3">
              {{ i18n.t('Security gaps', 'ثغرات أمنية') }}
            </h3>
            <p class="text-[15px] text-th-text-3 leading-relaxed">
              {{ i18n.t('Cloud, on-prem, and OT/IoT need consistent hardening and monitoring.', 'السحابة والمحلي وبيئات التشغيل تحتاج إلى تعزيز ومراقبة متسقة.') }}
            </p>
          </div>
          <div class="bg-th-card border border-th-border-lt shadow-sm hover:shadow-md relative overflow-hidden group" [class]="ds.radius.card + ' ' + ds.component.cardPadding + ' ' + ds.transition.base">
            <div class="absolute top-0 left-0 w-1 h-full" [ngClass]="accents[2].barGradient"></div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" [ngClass]="accents[2].iconBg">
              <svg class="w-6 h-6" [ngClass]="accents[2].iconText" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 class="font-semibold text-th-text text-lg mb-3">
              {{ i18n.t('Slow delivery', 'تسليم بطيء') }}
            </h3>
            <p class="text-[15px] text-th-text-3 leading-relaxed">
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
  ds = inject(DesignSystemService);
  accents = PROBLEM_CARD_ACCENTS;
}
