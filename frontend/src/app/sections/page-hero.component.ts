import { Component, input, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { MARKETING_PAGE } from '../core/data/page-styles';

/**
 * Centralized page hero for all marketing/sub-pages.
 * Enterprise style: deep navy, overline, H1, description.
 * Use on: Services, About, Case Studies, Insights, and any other marketing page.
 */
@Component({
  selector: 'app-page-hero',
  standalone: true,
  template: `
    <section class="page-hero relative overflow-hidden pt-[100px] pb-14 lg:pt-[108px] lg:pb-16 px-6 lg:px-8" [style.background]="heroBg">
      <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a]/30 via-transparent to-[#0B1220]/50 pointer-events-none" aria-hidden="true"></div>
      <div class="relative z-10 max-w-[1200px] mx-auto text-center">
        <p class="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/70 mb-3">
          {{ i18n.t(overlineEn(), overlineAr()) }}
        </p>
        <h1 class="text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-white tracking-tight mb-4">
          {{ i18n.t(titleEn(), titleAr()) }}
        </h1>
        <p class="text-base lg:text-lg text-white/75 max-w-2xl mx-auto leading-[1.6]">
          {{ i18n.t(descriptionEn(), descriptionAr()) }}
        </p>
      </div>
    </section>
  `,
})
export class PageHeroComponent {
  readonly heroBg = MARKETING_PAGE.heroBg;
  i18n = inject(I18nService);

  overlineEn = input<string>('');
  overlineAr = input<string>('');
  titleEn = input<string>('');
  titleAr = input<string>('');
  descriptionEn = input<string>('');
  descriptionAr = input<string>('');
}
