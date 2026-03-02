import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'sbg-product-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/solutions', slug]"
       class="group block bg-white rounded-2xl border border-sbg-gray-200 hover:border-sbg-blue/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <!-- Top accent bar -->
      <div class="h-1.5 sbg-gradient-blue group-hover:h-2 transition-all"></div>
      <div class="p-6">
        <!-- Icon & Category -->
        <div class="flex items-start justify-between mb-4">
          <span class="text-3xl">{{ icon }}</span>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-sbg-blue/10 text-sbg-blue uppercase tracking-wide">
            {{ category }}
          </span>
        </div>

        <!-- Name & Tagline -->
        <h3 class="text-xl font-bold text-sbg-navy mb-2 group-hover:text-sbg-blue transition-colors">
          {{ name }}
        </h3>
        <p class="text-sbg-gray-500 text-sm leading-relaxed mb-4">
          {{ tagline }}
        </p>

        <!-- Deployment Badge -->
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xs font-medium px-2 py-0.5 rounded bg-sbg-emerald/10 text-sbg-emerald">
            {{ deployment }}
          </span>
        </div>

        <!-- CTA -->
        <div class="flex items-center text-sbg-blue font-semibold text-sm group-hover:gap-2 transition-all">
          {{ i18n.t('Learn More', 'اعرف المزيد') }}
          <svg class="w-4 h-4 ms-1 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </a>
  `,
})
export class ProductCardComponent {
  i18n = inject(I18nService);
  @Input() slug = '';
  @Input() name = '';
  @Input() tagline = '';
  @Input() icon = '';
  @Input() category = '';
  @Input() deployment = '';
}
