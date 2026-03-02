import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'sbg-hero',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative overflow-hidden sbg-gradient-navy text-white"
             [class]="compact ? 'py-16 md:py-20' : 'py-24 md:py-36'">
      <!-- Background decorations -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 right-0 w-96 h-96 bg-sbg-gold rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-sbg-blue rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        @if (badge) {
          <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-sbg-gold text-sm font-medium mb-6">
            {{ badge }}
          </div>
        }

        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          {{ title }}
        </h1>

        @if (subtitle) {
          <p class="text-lg md:text-xl text-sbg-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            {{ subtitle }}
          </p>
        }

        @if (ctaText) {
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a [routerLink]="ctaLink"
               class="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-white font-semibold sbg-gradient-blue hover:opacity-90 transition-opacity text-lg">
              {{ ctaText }}
            </a>
            @if (secondaryCtaText) {
              <a [routerLink]="secondaryCtaLink"
                 class="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition-colors text-lg border border-white/20">
                {{ secondaryCtaText }}
              </a>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class SbgHeroComponent {
  i18n = inject(I18nService);

  @Input() title = '';
  @Input() subtitle = '';
  @Input() badge = '';
  @Input() ctaText = '';
  @Input() ctaLink = '/';
  @Input() secondaryCtaText = '';
  @Input() secondaryCtaLink = '/';
  @Input() compact = false;
}
