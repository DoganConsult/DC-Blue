import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { WHY_CHOOSE_ACCENTS } from '../core/data/page-styles';

@Component({
  selector: 'app-why-choose-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-th-bg-alt" id="why-us" [class]="ds.section.wrapperLg">
      <div [class]="ds.section.container">
        <div class="max-w-2xl mb-16">
          <p class="text-[13px] font-semibold text-primary tracking-widest uppercase mb-4">{{ i18n.t('Why Choose Us', 'لماذا تختارنا') }}</p>
          <h2 class="text-3xl lg:text-4xl font-bold text-th-text tracking-tight mb-4">
            {{ i18n.t('The Dogan Consult Difference', 'ميزة دوغان كونسلت') }}
          </h2>
          <p class="text-lg text-th-text-3 leading-relaxed">
            {{ i18n.t(
              'Big 4 rigor, specialized technical depth, and local expertise — in one partner.',
              'صرامة الاستشارات الكبرى والعمق التقني المتخصص والخبرة المحلية — في شريك واحد.'
            ) }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 mb-20" [class]="ds.spacing.gapXl">
          @for (diff of differentiators; track diff.title.en) {
            <div class="bg-th-card border border-th-border-lt shadow-sm hover:shadow-md relative overflow-hidden" [class]="ds.radius.card + ' ' + ds.component.cardPadding + ' ' + ds.transition.base">
              <div class="absolute top-0 left-0 right-0 h-1" [ngClass]="diff.topBarColor"></div>
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6" [ngClass]="diff.iconBg">
                <svg class="w-6 h-6" [ngClass]="diff.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="diff.iconPath" />
                </svg>
              </div>
              <h3 class="font-bold text-th-text text-xl mb-2">{{ i18n.t(diff.title.en, diff.title.ar) }}</h3>
              <p class="text-[15px] text-th-text-3 leading-relaxed mb-5">{{ i18n.t(diff.desc.en, diff.desc.ar) }}</p>
              <ul class="space-y-2.5">
                @for (point of diff.points; track point.en) {
                  <li class="flex items-start gap-2.5 text-sm text-th-text-2">
                    <svg class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                    {{ i18n.t(point.en, point.ar) }}
                  </li>
                }
              </ul>
            </div>
          }
        </div>


      </div>
    </section>
  `,
})
export class WhyChooseSectionComponent {
  i18n = inject(I18nService);
  ds = inject(DesignSystemService);

  differentiators = [
    {
      iconBg: WHY_CHOOSE_ACCENTS[0].iconBg, iconColor: WHY_CHOOSE_ACCENTS[0].iconColor, topBarColor: WHY_CHOOSE_ACCENTS[0].topBarGradient,
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: { en: '3x Faster Delivery', ar: '3x أسرع في التسليم' },
      desc: { en: 'Agile sprints with pre-built accelerators reduce time-to-value by 67%.', ar: 'سباقات رشيقة مع مسرعات جاهزة تقلل الوقت للقيمة بنسبة 67٪.' },
      points: [
        { en: '2-week sprints vs 3-month phases', ar: 'سباقات أسبوعين مقابل مراحل 3 أشهر' },
        { en: 'Ready-to-deploy templates', ar: 'قوالب جاهزة للنشر' },
        { en: 'Automated deployment pipelines', ar: 'خطوط نشر آلية' },
      ],
    },
    {
      iconBg: WHY_CHOOSE_ACCENTS[1].iconBg, iconColor: WHY_CHOOSE_ACCENTS[1].iconColor, topBarColor: WHY_CHOOSE_ACCENTS[1].topBarGradient,
      iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: { en: '100% KSA Compliant', ar: '100٪ متوافق مع السعودية' },
      desc: { en: 'Pre-configured compliance frameworks for NCA-ECC, PDPL, and Vision 2030.', ar: 'أطر امتثال مُعدة مسبقًا لمتطلبات NCA-ECC و PDPL ورؤية 2030.' },
      points: [
        { en: 'NCA-certified team members', ar: 'أعضاء فريق معتمدون من NCA' },
        { en: 'Local data residency guaranteed', ar: 'ضمان إقامة البيانات محليًا' },
        { en: 'Arabic-first documentation', ar: 'توثيق بالعربية أولاً' },
      ],
    },
    {
      iconBg: WHY_CHOOSE_ACCENTS[2].iconBg, iconColor: WHY_CHOOSE_ACCENTS[2].iconColor, topBarColor: WHY_CHOOSE_ACCENTS[2].topBarGradient,
      iconPath: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      title: { en: 'Technical Excellence', ar: 'التميز التقني' },
      desc: { en: 'We architect, implement, and operate with certified engineers who understand enterprise complexity.', ar: 'نصمم وننفذ ونشغل مع مهندسين معتمدين يفهمون تعقيد المؤسسات.' },
      points: [
        { en: '150+ technical certifications', ar: '150+ شهادة تقنية' },
        { en: 'Hands-on implementation team', ar: 'فريق تنفيذ عملي' },
        { en: '24/7 expert support', ar: 'دعم خبراء 24/7' },
      ],
    },
  ];


}
