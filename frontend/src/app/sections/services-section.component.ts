import { Component, input, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { LandingContent } from '../core/models/landing.model';

interface SectorCard {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  iconPath: string;
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  template: `
    <section class="bg-th-bg-alt py-24 lg:py-28" id="services">
      <div class="max-w-[1200px] mx-auto px-6 lg:px-8">
        <!-- Section header: overline + H2 + intro (enterprise pattern) -->
        <div class="mb-14">
          <p class="text-[11px] font-semibold tracking-[0.15em] uppercase text-th-text-3 mb-3">
            {{ i18n.t('Sectors', 'القطاعات') }}
          </p>
          <h2 class="text-[clamp(1.75rem,4vw,2.25rem)] font-bold text-th-text tracking-tight mb-4">
            {{ i18n.t('Sectors We Serve', 'القطاعات التي نخدمها') }}
          </h2>
          <p class="text-[15px] text-th-text-3 max-w-2xl leading-[1.6]">
            {{ i18n.t(
              'Deep experience in government, telecommunications, critical infrastructure, and major enterprises.',
              'خبرة عميقة في القطاعات الحكومية والاتصالات والبنية التحتية الحيوية والمؤسسات المتقدمة.'
            ) }}
          </p>
        </div>

        <!-- 2x2 Sector grid: cleaner cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          @for (sector of sectors; track sector.titleEn) {
            <div class="bg-th-card rounded-xl p-6 lg:p-7 border border-th-border-lt hover:border-th-border hover:shadow-md transition-all duration-200 flex items-start gap-4">
              <!-- Icon -->
              <div class="w-11 h-11 min-w-[2.75rem] max-w-[2.75rem] rounded-lg bg-gold-soft flex items-center justify-center flex-none">
                <svg class="w-5 h-5 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="sector.iconPath" /></svg>
              </div>

              <!-- Content -->
              <div>
                <h3 class="text-[17px] font-bold text-th-text mb-1.5">
                  {{ i18n.t(sector.titleEn, sector.titleAr) }}
                </h3>
                <p class="text-[14px] text-th-text-3 leading-[1.55]">
                  {{ i18n.t(sector.descEn, sector.descAr) }}
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ServicesSectionComponent {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);

  get sectors(): SectorCard[] { return this.content()?.sectors ?? this.defaultSectors; }

  private defaultSectors: SectorCard[] = [
    {
      titleEn: 'Government & Public Sector',
      titleAr: 'الحكومة والقطاع العام',
      descEn: 'Smart government solutions, infrastructure management, digital transformation, and Vision 2030 alignment.',
      descAr: 'إدارة وتخطيط البنية التحتية الرقمية الحكومية وتنفيذ مبادرات التحول الرقمي ضمن رؤية 2030.',
      iconPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
    },
    {
      titleEn: 'Telecommunications Sector',
      titleAr: 'قطاع الاتصالات',
      descEn: 'Network planning and design, spectrum management, infrastructure sharing, and compliance with CITC regulations.',
      descAr: 'تخطيط وتصميم شبكات الاتصالات والإدارة الترددية ومشاركة البنية التحتية والامتثال لمتطلبات الهيئة.',
      iconPath: 'M12 12.5a.5.5 0 110-1 .5.5 0 010 1zm-3.5 3a5 5 0 017 0m-10-3a9 9 0 0114 0m-17-3c5.3-4 11.7-4 17 0',
    },
    {
      titleEn: 'Critical Infrastructure',
      titleAr: 'البنية التحتية الحيوية',
      descEn: 'Protection, assessment, and modernization of critical national infrastructure and facilities.',
      descAr: 'حماية وتقييم وتحديث البنية التحتية الحيوية الوطنية والمنشآت الحساسة.',
      iconPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    },
    {
      titleEn: 'Large & Medium Enterprises',
      titleAr: 'المؤسسات الكبرى والمتوسطة',
      descEn: 'Enterprise ICT strategy, digital workplace solutions, and managed ICT services for business growth.',
      descAr: 'استراتيجية تقنية المعلومات المؤسسية وحلول بيئة العمل الرقمية وخدمات تقنية المعلومات المُدارة.',
      iconPath: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21',
    },
  ];
}
