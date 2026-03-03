import { Component, inject, input } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { TRUST_BADGES } from '../core/data/site-content';
import { LandingContent } from '../core/models/landing.model';

@Component({
  selector: 'app-trust-section',
  standalone: true,
  template: `
    <section class="py-20 lg:py-24 px-6 lg:px-8 bg-th-bg-alt" id="trust">
      <div class="max-w-[1200px] mx-auto">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('Trust & compliance', 'الثقة والامتثال') }}
        </h2>
        <p class="text-center text-th-text-2 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('Engineering certifications and process alignment.', 'الشهادات الهندسية ومحاذاة العمليات.') }}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          @for (badge of badges; track badge.en) {
            <span class="px-4 py-2 rounded-full bg-th-card border border-th-border text-sm font-medium">{{ i18n.t(badge.en, badge.ar) }}</span>
          }
        </div>
      </div>
    </section>
  `,
})
export class TrustSectionComponent {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);

  get badges() { return this.content()?.trustBadges ?? this.defaultBadges; }

  private defaultBadges = TRUST_BADGES;
}
