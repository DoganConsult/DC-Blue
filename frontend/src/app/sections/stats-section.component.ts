import { Component, input, inject } from '@angular/core';
import { LandingContent } from '../core/models/landing.model';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-stats-section',
  standalone: true,
  template: `
    <section class="py-16 px-4 bg-th-bg-alt">
      <div class="container mx-auto max-w-6xl">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          @for (s of stats; track s.label.en) {
            <div class="advanced-widget-card bg-th-card rounded-2xl p-6 shadow-sm border border-th-border-lt text-center">
              <div class="text-3xl font-bold text-primary">{{ s.value }}{{ s.suffix }}</div>
              <div class="text-sm text-th-text-2 mt-1">{{ i18n.t(s.label.en, s.label.ar) }}</div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class StatsSectionComponent {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);

  defaultStats = [
    { value: 15, suffix: '+', label: { en: 'Years Experience', ar: 'سنوات خبرة' } },
    { value: 200, suffix: '+', label: { en: 'Projects Delivered', ar: 'مشروع تم تسليمه' } },
    { value: 50, suffix: '+', label: { en: 'Enterprise Clients', ar: 'عميل مؤسسي' } },
    { value: 98, suffix: '%', label: { en: 'Client Satisfaction', ar: 'رضا العملاء' } },
  ];

  get stats() {
    return this.content()?.stats ?? this.defaultStats;
  }
}
