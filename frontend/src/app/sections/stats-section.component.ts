import { Component, input, inject } from '@angular/core';
import { LandingContent } from '../pages/landing.page';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-stats-section',
  standalone: true,
  template: `
    <section class="py-16 px-4 bg-gray-50">
      <div class="container mx-auto max-w-6xl">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          @for (s of content()?.stats ?? []; track s.label.en) {
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div class="text-3xl font-bold text-primary">{{ s.value }}{{ s.suffix }}</div>
              <div class="text-sm text-gray-600 mt-1">{{ i18n.t(s.label.en, s.label.ar) }}</div>
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
}
