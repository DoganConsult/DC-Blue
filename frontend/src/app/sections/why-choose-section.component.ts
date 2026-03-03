import { Component, inject, input } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { LandingContent } from '../core/models/landing.model';

@Component({
  selector: 'app-why-choose-section',
  standalone: true,
  template: `
    <section class="bg-th-bg py-24 lg:py-28" id="why-us">
      <div class="max-w-[1200px] mx-auto px-6 lg:px-8">
        <!-- Section header: overline + H2 + intro (enterprise, same as Services) -->
        <div class="text-center mb-16">
          <p class="text-[11px] font-semibold tracking-[0.15em] uppercase text-th-text-3 mb-3">
            {{ i18n.t('Why Us', 'لماذا نحن') }}
          </p>
          <h2 class="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-th-text mb-4">
            {{ i18n.t('Why Dogan Consulting', 'لماذا دوغان للاستشارات') }}
          </h2>
          <p class="text-[15px] text-th-text-3 max-w-2xl mx-auto leading-relaxed">
            {{ i18n.t(
              'An engineering consulting partner focused on ICT and critical infrastructure.',
              'مستشار هندسي موثق للمعلومات والبنية التحتية الحيوية.'
            ) }}
          </p>
        </div>

        <!-- 2-column benefits grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 max-w-3xl mx-auto">
          @for (benefit of benefits; track benefit.en) {
            <div class="flex items-center gap-3 bg-th-bg-alt rounded-2xl px-5 py-4">
              <div class="w-8 h-8 min-w-[2rem] max-w-[2rem] rounded-full bg-emerald-100 flex items-center justify-center flex-none">
                <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
              </div>
              <span class="text-[15px] font-medium text-th-text">
                {{ i18n.t(benefit.en, benefit.ar) }}
              </span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class WhyChooseSectionComponent {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);

  get benefits() { return this.content()?.benefits ?? this.defaultBenefits; }

  private defaultBenefits = [
    { en: 'Close engineering consulting leadership', ar: 'قيادة هندسية استشارية عن قرب' },
    { en: 'Extensive experience and deep expertise', ar: 'خبرات واسعة وتجربة عميقة' },
    { en: 'Customized and comprehensive solutions', ar: 'حلول مخصصة وشاملة' },
    { en: 'Dedicated support for optimization', ar: 'مساعدة مخصصة للحصول على التحسين' },
    { en: 'Focus on telecom and infrastructure', ar: 'التركيز على الاتصالات والبنية التحتية' },
    { en: 'Value-driven with exclusive vision', ar: 'فرق بالقيمة وبرؤية حصرية' },
  ];
}
