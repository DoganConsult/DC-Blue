import { Component, inject, input } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { LandingContent } from '../core/models/landing.model';

interface ExpertiseCard {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  iconPath: string;
  iconBg: string;
  iconColor: string;
}

@Component({
  selector: 'app-social-proof-section',
  standalone: true,
  template: `
    <section class="bg-th-bg-alt py-24 lg:py-28" id="expertise">
      <div class="max-w-[1200px] mx-auto px-6 lg:px-8">
        <!-- Section header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-gold-soft text-gold-accent text-[13px] font-semibold mb-4">
            {{ i18n.t('Our Services', 'خدماتنا') }}
          </span>
          <h2 class="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-th-text mb-4">
            {{ i18n.t('Our Core Expertise', 'خبراتنا الأساسية') }}
          </h2>
          <p class="text-[15px] text-th-text-3 max-w-2xl mx-auto leading-relaxed">
            {{ i18n.t(
              'Engineering consulting powered by deep specialists in telecommunications, data centers, cybersecurity, and IT governance.',
              'استشارات هندسية يقودها خبراء متخصصون في مجالات الاتصالات ومراكز البيانات والأمن السيبراني وبرامج حوكمة تقنية المعلومات الحيوية.'
            ) }}
          </p>
        </div>

        <!-- 2x2 Card grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          @for (card of expertiseCards; track card.titleEn) {
            <div class="bg-th-card rounded-[24px] p-7 lg:p-8 shadow-card-soft hover:shadow-lg transition-shadow duration-300 group">
              <!-- Icon -->
              <div class="w-14 h-14 rounded-[14px] flex items-center justify-center mb-5" [style.background]="card.iconBg">
                <svg class="w-7 h-7" [style.color]="card.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="card.iconPath" /></svg>
              </div>

              <!-- Title -->
              <h3 class="text-xl font-bold text-th-text mb-3">
                {{ i18n.t(card.titleEn, card.titleAr) }}
              </h3>

              <!-- Description -->
              <p class="text-[14px] text-th-text-3 leading-relaxed mb-5">
                {{ i18n.t(card.descEn, card.descAr) }}
              </p>

              <!-- Learn more link -->
              <a routerLink="/services" class="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary group-hover:gap-2.5 transition-all duration-300">
                {{ i18n.t('Learn More', 'اعرف المزيد') }}
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </a>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class SocialProofSectionComponent {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);
  ds = inject(DesignSystemService);

  get expertiseCards(): ExpertiseCard[] { return this.content()?.expertise ?? this.defaultExpertiseCards; }

  private defaultExpertiseCards: ExpertiseCard[] = [
    {
      titleEn: 'Data Centers & Critical Facilities',
      titleAr: 'مراكز البيانات والمرافق الحيوية',
      descEn: 'Design, assessment and operation of data center facilities, including comprehensive facilities planning, power systems, and cooling infrastructure for maximum uptime.',
      descAr: 'تقييم تصميم ومراجعة وتشغيل مراكز البيانات والمرافق الحيوية، بما يشمل تخطيط المنشآت وأنظمة الطاقة والتبريد والبنية التحتية وأكثر.',
      iconPath: 'M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z',
      iconBg: 'rgba(249, 115, 22, 0.12)',
      iconColor: '#F97316',
    },
    {
      titleEn: 'Telecommunications Engineering',
      titleAr: 'هندسة الاتصالات',
      descEn: 'Review of telecommunications infrastructure plans, radio frequency analysis, mobile network planning, and connectivity solutions for operators and enterprises.',
      descAr: 'مراجعة هندسية لخطط البنية التحتية للاتصالات وتخطيط الشبكات والتحليل الترددي وحلول التوصيل لمشغلي الاتصالات والمؤسسات الكبرى.',
      iconPath: 'M12 12.5a.5.5 0 110-1 .5.5 0 010 1zm-3.5 3a5 5 0 017 0m-10-3a9 9 0 0114 0m-17-3c5.3-4 11.7-4 17 0',
      iconBg: 'rgba(139, 92, 246, 0.12)',
      iconColor: '#8B5CF6',
    },
    {
      titleEn: 'IT Governance & Support',
      titleAr: 'حوكمة ودعم تقنية المعلومات',
      descEn: 'IT governance frameworks, PMO consulting, digital transformation roadmaps, and end-to-end technical support for ICT projects.',
      descAr: 'استشارات مكاتب إدارة المشاريع وحوكمة تقنية المعلومات وخطط التحول الرقمي والدعم الفني الشامل للمشاريع التقنية الكبرى.',
      iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
      iconBg: 'rgba(249, 115, 22, 0.12)',
      iconColor: '#F97316',
    },
    {
      titleEn: 'Cybersecurity & Technical Assurance',
      titleAr: 'الأمن السيبراني والضمان الفني',
      descEn: 'Cybersecurity strategy, risk management, NCA-ECC compliance, penetration testing, vulnerability assessment, and continuous monitoring.',
      descAr: 'استشارات الأمن السيبراني وإدارة المخاطر والامتثال مع NCA-ECC واختبار الاختراق وتقييم الثغرات والمراقبة الأمنية المستمرة.',
      iconPath: 'M12 3s-7 3-7 9c0 4.5 3.5 8 7 9 3.5-1 7-4.5 7-9 0-6-7-9-7-9zm-1.5 10.5l3.5-3.5M9 12l1.5 1.5',
      iconBg: 'rgba(34, 197, 94, 0.12)',
      iconColor: '#22C55E',
    },
  ];
}
