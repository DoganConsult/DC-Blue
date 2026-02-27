import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

const INDUSTRIES = [
  { id: 'gov', icon: 'pi-building', color: '#006C35', titleEn: 'Government & semi-government', titleAr: 'القطاع الحكومي وشبه الحكومي' },
  { id: 'health', icon: 'pi-heart', color: '#0EA5E9', titleEn: 'Healthcare', titleAr: 'الرعاية الصحية' },
  { id: 'finance', icon: 'pi-wallet', color: '#0A3C6B', titleEn: 'Financial services', titleAr: 'الخدمات المالية' },
  { id: 'telco', icon: 'pi-signal', color: '#6366F1', titleEn: 'Telecom & ICT', titleAr: 'الاتصالات وتقنية المعلومات' },
  { id: 'retail', icon: 'pi-shopping-cart', color: '#10B981', titleEn: 'Retail & multi-site', titleAr: 'التجزئة والمواقع المتعددة' },
  { id: 'industrial', icon: 'pi-cog', color: '#F59E0B', titleEn: 'Manufacturing & logistics', titleAr: 'التصنيع واللوجستيات' },
];

@Component({
  selector: 'app-industries-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-gray-50" id="industries">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('Industries we serve', 'القطاعات التي نخدمها') }}
        </h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('Sector-specific ICT engineering and compliance alignment.', 'هندسة تقنية المعلومات والمطابقة حسب القطاع.') }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (ind of industries; track ind.id) {
            <div
              class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
              [style.borderTopColor]="ind.color"
              [style.borderTopWidth]="'4px'"
            >
              <span [class]="'pi ' + ind.icon + ' text-2xl block mb-3'" [style.color]="ind.color" aria-hidden="true"></span>
              <h3 class="font-semibold text-gray-900">{{ i18n.t(ind.titleEn, ind.titleAr) }}</h3>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class IndustriesSectionComponent {
  i18n = inject(I18nService);
  industries = INDUSTRIES;
}
