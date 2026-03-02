import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-awards-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 px-4 bg-gradient-to-b from-th-bg-alt to-th-card">
      <div class="container mx-auto max-w-7xl">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
            <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="text-sm font-medium text-amber-700">{{ i18n.t('Recognition', 'التقدير') }}</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
            {{ i18n.t('Awards & Achievements', 'الجوائز والإنجازات') }}
          </h2>
          <p class="text-lg text-th-text-2 max-w-3xl mx-auto">
            {{ i18n.t(
              'Industry recognition for excellence in digital transformation and innovation',
              'تقدير الصناعة للتميز في التحول الرقمي والابتكار'
            ) }}
          </p>
        </div>

        <!-- Awards Grid -->
        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <div *ngFor="let award of awards" class="group">
            <div class="bg-th-card rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-center h-full">
              <!-- Award Icon -->
              <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br" [ngClass]="award.color"
                class="rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path *ngIf="award.icon === 'trophy'" d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM3 7V5a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2zm7 4a1 1 0 011 1v3a3 3 0 01-6 0v-3a1 1 0 011-1h4z"/>
                  <path *ngIf="award.icon === 'star'" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  <path *ngIf="award.icon === 'badge'" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>

              <h3 class="text-xl font-bold text-brand-dark mb-2">
                {{ i18n.t(award.title.en, award.title.ar) }}
              </h3>
              <p class="text-sm text-th-text-2 mb-3">
                {{ i18n.t(award.organization.en, award.organization.ar) }}
              </p>
              <div class="text-2xl font-bold text-primary mb-4">{{ award.year }}</div>
              <p class="text-sm text-th-text-3">
                {{ i18n.t(award.description.en, award.description.ar) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Media Mentions -->
        <div class="bg-th-card rounded-3xl shadow-xl p-8 md:p-12">
          <h3 class="text-2xl font-bold text-brand-dark mb-8 text-center">
            {{ i18n.t('As Featured In', 'كما ظهر في') }}
          </h3>
          <div class="flex flex-wrap justify-center items-center gap-12">
            <div *ngFor="let media of mediaLogos" class="text-th-text-3 hover:text-th-text-2 transition">
              <span class="text-2xl font-bold">{{ media }}</span>
            </div>
          </div>
        </div>

        <!-- Client Satisfaction -->
        <div class="mt-16 grid md:grid-cols-3 gap-8">
          <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center">
            <div class="text-5xl font-bold text-emerald-600 mb-2">4.9/5</div>
            <div class="flex justify-center gap-1 mb-3">
              <svg *ngFor="let star of [1,2,3,4,5]" class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <p class="text-sm text-th-text-2">
              {{ i18n.t('Client Satisfaction Score', 'نقاط رضا العملاء') }}
            </p>
          </div>

          <div class="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 text-center">
            <div class="text-5xl font-bold text-sky-600 mb-2">98%</div>
            <p class="text-sm text-th-text-2">
              {{ i18n.t('Project Success Rate', 'معدل نجاح المشروع') }}
            </p>
            <div class="mt-3 text-xs text-th-text-3">
              {{ i18n.t('Based on 120+ projects', 'بناءً على 120+ مشروع') }}
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 text-center">
            <div class="text-5xl font-bold text-purple-600 mb-2">100%</div>
            <p class="text-sm text-th-text-2">
              {{ i18n.t('Client Retention', 'الاحتفاظ بالعملاء') }}
            </p>
            <div class="mt-3 text-xs text-th-text-3">
              {{ i18n.t('Over 5 years', 'على مدى 5 سنوات') }}
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class AwardsSectionComponent {
  i18n = inject(I18nService);

  awards = [
    {
      title: { en: 'Digital Excellence Award', ar: 'جائزة التميز الرقمي' },
      organization: { en: 'Saudi Digital Gov', ar: 'الحكومة الرقمية السعودية' },
      year: '2023',
      description: {
        en: 'Best Digital Transformation Implementation',
        ar: 'أفضل تنفيذ للتحول الرقمي'
      },
      icon: 'trophy',
      color: 'from-amber-400 to-orange-500'
    },
    {
      title: { en: 'Innovation Partner', ar: 'شريك الابتكار' },
      organization: { en: 'Ministry of ICT', ar: 'وزارة الاتصالات' },
      year: '2023',
      description: {
        en: 'Strategic Partner for Vision 2030',
        ar: 'شريك استراتيجي لرؤية 2030'
      },
      icon: 'star',
      color: 'from-purple-400 to-indigo-500'
    },
    {
      title: { en: 'Security Excellence', ar: 'التميز الأمني' },
      organization: { en: 'NCA', ar: 'الهيئة الوطنية للأمن السيبراني' },
      year: '2022',
      description: {
        en: 'Outstanding Cybersecurity Implementation',
        ar: 'تنفيذ متميز للأمن السيبراني'
      },
      icon: 'badge',
      color: 'from-emerald-400 to-teal-500'
    }
  ];

  mediaLogos = [
    'Arab News',
    'Al Arabiya',
    'Saudi Gazette',
    'Asharq',
    'Okaz'
  ];
}