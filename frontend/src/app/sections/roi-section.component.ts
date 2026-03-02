import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { ROI_METRICS } from '../core/data/site-content';
import { GRADIENTS } from '../core/data/page-styles';

@Component({
  selector: 'app-roi-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 text-white" [class]="gradient" id="roi">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center mb-2 text-sky-100">
          {{ i18n.t('ROI impact', 'تأثير العائد على الاستثمار') }}
        </h2>
        <p class="text-center text-sky-200/90 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('Reduced downtime, faster response, fewer repeat issues.', 'تقليل التوقف، استجابة أسرع، مشكلات متكررة أقل.') }}
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (m of metrics; track m.value) {
            <div class="bg-th-card/10 backdrop-blur rounded-2xl border border-white/10 p-6 text-center">
              <div class="text-3xl font-bold text-white">{{ m.value }}</div>
              <div class="text-sm text-sky-200 mt-1">{{ i18n.t(m.label.en, m.label.ar) }}</div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class RoiSectionComponent {
  i18n = inject(I18nService);
  metrics = ROI_METRICS;
  gradient = GRADIENTS.roiSection;
}
