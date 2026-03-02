import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'sbg-category-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/categories', slug]"
       class="group block bg-white rounded-xl border border-sbg-gray-200 hover:border-sbg-gold/40 p-6 hover:shadow-lg transition-all duration-300">
      <span class="text-3xl mb-3 block">{{ icon }}</span>
      <h3 class="text-lg font-bold text-sbg-navy mb-2 group-hover:text-sbg-gold transition-colors">{{ name }}</h3>
      <p class="text-sbg-gray-500 text-sm leading-relaxed">{{ description }}</p>
      <div class="mt-4 flex items-center text-sbg-gold font-semibold text-sm">
        {{ i18n.t('Explore', 'استكشف') }}
        <svg class="w-4 h-4 ms-1 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </a>
  `,
})
export class CategoryCardComponent {
  i18n = inject(I18nService);
  @Input() slug = '';
  @Input() icon = '';
  @Input() name = '';
  @Input() description = '';
}
