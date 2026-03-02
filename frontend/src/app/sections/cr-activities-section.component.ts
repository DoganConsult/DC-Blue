import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { KSA_CR_ACTIVITIES } from '../core/data/ksa-cr-activities';

@Component({
  selector: 'app-cr-activities-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-20 px-4 bg-th-bg-alt" id="cr-activities">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('List of Selected Commercial Activities', 'قائمة الأنشطة التجارية المختارة') }}
        </h2>
        <p class="text-center text-th-text-2 mb-8">
          {{ i18n.t('Activities approved under Saudi Commercial Registration (CR)', 'أنشطة معتمدة من السجل التجاري السعودي') }}
        </p>
        <p class="text-center text-lg font-semibold text-primary mb-10">
          {{ i18n.t('Number of activities', 'عدد الأنشطة') }}: {{ activities.length }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (a of activities; track a.code) {
            <div
              class="rounded-xl border border-th-border bg-th-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 flex flex-col"
            >
              <p class="text-th-text font-medium mb-2 leading-snug" [attr.dir]="i18n.lang() === 'ar' ? 'rtl' : 'ltr'">
                {{ i18n.t(a.nameEn, a.nameAr) }}
              </p>
              <p class="text-sm text-th-text-3 font-mono mt-auto">{{ a.code }}</p>
              <a
                [routerLink]="['/inquiry']"
                queryParamsHandling="merge"
                class="mt-3 text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                {{ i18n.t('Activity details', 'تفاصيل النشاط') }}
                <span aria-hidden="true">←</span>
              </a>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class CrActivitiesSectionComponent {
  i18n = inject(I18nService);
  activities = KSA_CR_ACTIVITIES;
}
