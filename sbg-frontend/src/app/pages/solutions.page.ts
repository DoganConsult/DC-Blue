import { Component, inject, signal, OnInit } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { SeoService } from '../core/services/seo.service';
import { SbgHeroComponent } from '../components/sbg-hero.component';
import { ProductCardComponent } from '../components/product-card.component';
import { SBG_PRODUCTS } from '../data/products.data';
import { SBG_CATEGORIES } from '../data/categories.data';

@Component({
  selector: 'sbg-solutions',
  standalone: true,
  imports: [SbgHeroComponent, ProductCardComponent],
  template: `
    <sbg-hero
      [title]="i18n.t('Enterprise Solutions', 'الحلول المؤسسية')"
      [subtitle]="i18n.t(
        'Browse our curated marketplace of governance-enforced digital solutions for Saudi organizations.',
        'تصفح سوقنا المختار من الحلول الرقمية المحكومة للمنظمات السعودية.'
      )"
      [compact]="true"
    />

    <section class="sbg-section bg-white">
      <div class="sbg-container">
        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-2 mb-10 justify-center">
          <button (click)="activeFilter.set('all')"
                  [class]="activeFilter() === 'all' ? 'bg-sbg-blue text-white' : 'bg-sbg-gray-100 text-sbg-gray-600 hover:bg-sbg-gray-200'"
                  class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            {{ i18n.t('All Solutions', 'جميع الحلول') }}
          </button>
          @for (cat of categories; track cat.slug) {
            <button (click)="activeFilter.set(cat.slug)"
                    [class]="activeFilter() === cat.slug ? 'bg-sbg-blue text-white' : 'bg-sbg-gray-100 text-sbg-gray-600 hover:bg-sbg-gray-200'"
                    class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              {{ i18n.t(cat.name.en, cat.name.ar) }}
            </button>
          }
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (product of filteredProducts(); track product.slug) {
            <sbg-product-card
              [slug]="product.slug"
              [name]="i18n.t(product.name.en, product.name.ar)"
              [tagline]="i18n.t(product.tagline.en, product.tagline.ar)"
              [icon]="product.icon"
              [category]="product.category"
              [deployment]="product.deployment"
            />
          }
        </div>

        @if (filteredProducts().length === 0) {
          <div class="text-center py-16">
            <p class="text-sbg-gray-400 text-lg">{{ i18n.t('No solutions found in this category.', 'لا توجد حلول في هذه الفئة.') }}</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class SolutionsPage implements OnInit {
  i18n = inject(I18nService);
  private seo = inject(SeoService);
  products = SBG_PRODUCTS;
  categories = SBG_CATEGORIES;
  activeFilter = signal('all');

  ngOnInit(): void {
    this.seo.update({
      titleEn: 'Enterprise Solutions',
      titleAr: 'الحلول المؤسسية',
      descEn: 'Browse governance-enforced digital solutions for Saudi organizations.',
      descAr: 'تصفح الحلول الرقمية المحكومة للمنظمات السعودية.',
    });
  }

  filteredProducts() {
    const filter = this.activeFilter();
    if (filter === 'all') return this.products;
    return this.products.filter(p => p.category === filter);
  }
}
