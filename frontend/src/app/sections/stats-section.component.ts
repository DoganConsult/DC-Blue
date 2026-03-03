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
    { value: 120, suffix: '+', label: { en: 'Projects Delivered', ar: 'مشاريع منجزة' } },
    { value: 99, suffix: '%', label: { en: 'SLAs Met', ar: 'التزام ب SLA' } },
    { value: 6, suffix: '', label: { en: 'Regions', ar: 'مناطق' } },
  ];

  get stats() {
    return this.content()?.stats ?? this.defaultStats;
  }
}
