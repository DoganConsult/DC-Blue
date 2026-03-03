import { Component, inject, input } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { LandingContent } from '../core/models/landing.model';

interface MethodologyStep {
  number: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
}

@Component({
  selector: 'app-problem-section',
  standalone: true,
  template: `
    <section class="bg-th-bg py-24 lg:py-28" id="methodology">
      <div class="max-w-[1200px] mx-auto px-6 lg:px-8">
        <!-- Section header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-gold-soft text-gold-accent text-[13px] font-semibold mb-4">
            {{ i18n.t('Methodology', 'منهجية') }}
          </span>
          <h2 class="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-th-text mb-4">
            {{ i18n.t('Consulting Methodology', 'منهجية الاستشارات') }}
          </h2>
          <p class="text-[15px] text-th-text-3 max-w-2xl mx-auto leading-relaxed">
            {{ i18n.t(
              'Professional consultants with deep knowledge and expertise, relying on analysis, experience, and comprehensive planning methodology.',
              'مستشارون أكفاء يعتمدون على التحليل والخبرة والمنهجية الاستشارية التخطيطية الشاملة للعمل.'
            ) }}
          </p>
        </div>

        <!-- 4 Steps -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          @for (step of steps; track step.number) {
            <div class="text-center">
              <!-- Number badge -->
              <div class="w-16 h-16 rounded-2xl bg-gold-accent flex items-center justify-center mx-auto mb-5">
                <span class="text-[22px] font-bold text-th-text">{{ step.number }}</span>
              </div>

              <!-- Title -->
              <h3 class="text-lg font-bold text-th-text mb-2">
                {{ i18n.t(step.titleEn, step.titleAr) }}
              </h3>

              <!-- Description -->
              <p class="text-[14px] text-th-text-3 leading-relaxed">
                {{ i18n.t(step.descEn, step.descAr) }}
              </p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProblemSectionComponent {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);

  get steps(): MethodologyStep[] { return this.content()?.methodology ?? this.defaultSteps; }

  private defaultSteps: MethodologyStep[] = [
    {
      number: '01',
      titleEn: 'Assessment',
      titleAr: 'التقييم',
      descEn: 'Comprehensive assessment of the current situation and needs.',
      descAr: 'تقييم شامل للوضع الحالي والاحتياجات والمتطلبات.',
    },
    {
      number: '02',
      titleEn: 'Design',
      titleAr: 'التصميم',
      descEn: 'Designing practical and implementable solutions.',
      descAr: 'تصميم حلول عملية قابلة للتنفيذ وفعالة.',
    },
    {
      number: '03',
      titleEn: 'Implementation',
      titleAr: 'التنفيذ',
      descEn: 'Gap analysis, priority identification, and execution.',
      descAr: 'تحليل الفجوات وتحديد الأولويات والتنفيذ الفعلي.',
    },
    {
      number: '04',
      titleEn: 'Support',
      titleAr: 'الدعم',
      descEn: 'Follow-up implementation and continuous improvement.',
      descAr: 'متابعة التنفيذ وضمان التحسن المستمر والاستدامة.',
    },
  ];
}
