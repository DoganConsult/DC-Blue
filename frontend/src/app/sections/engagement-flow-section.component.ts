import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

const STEPS = [
  { titleEn: 'Discovery & site survey', titleAr: 'الاكتشاف والمسح الميداني', icon: 'pi-search' },
  { titleEn: 'Design & BoQ', titleAr: 'التصميم وقائمة الكميات', icon: 'pi-file-edit' },
  { titleEn: 'Implementation plan', titleAr: 'خطة التنفيذ', icon: 'pi-list-check' },
  { titleEn: 'Deployment & commissioning', titleAr: 'النشر والتشغيل', icon: 'pi-play' },
  { titleEn: 'Handover (as-built + runbooks)', titleAr: 'التسليم (كما بُني + دلائل التشغيل)', icon: 'pi-book' },
  { titleEn: 'Support (SLA / managed services)', titleAr: 'الدعم (SLA / خدمات مُدارة)', icon: 'pi-headphones' },
];

@Component({
  selector: 'app-engagement-flow-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-th-card" id="engagement">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('How we engage', 'كيف نتعامل معك') }}
        </h2>
        <p class="text-center text-th-text-2 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('From request to delivery and ongoing support.', 'من الطلب إلى التسليم والدعم المستمر.') }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (step of steps; track step.titleEn) {
            <div class="flex gap-4 items-start rounded-xl border border-th-border-lt p-4 hover:border-primary/30 transition">
              <span [class]="'pi ' + step.icon + ' text-primary text-xl mt-0.5'" aria-hidden="true"></span>
              <div>
                <h3 class="font-semibold text-th-text">{{ i18n.t(step.titleEn, step.titleAr) }}</h3>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class EngagementFlowSectionComponent {
  i18n = inject(I18nService);
  steps = STEPS;
}
