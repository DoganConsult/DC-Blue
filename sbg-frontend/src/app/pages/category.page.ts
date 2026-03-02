import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { SbgHeroComponent } from '../components/sbg-hero.component';
import { ProductCardComponent } from '../components/product-card.component';
import { SBG_CATEGORIES, SbgCategory } from '../data/categories.data';
import { SBG_PRODUCTS, SbgProduct } from '../data/products.data';

@Component({
  selector: 'sbg-category',
  standalone: true,
  imports: [SbgHeroComponent, ProductCardComponent, RouterLink],
  template: `
    @if (category()) {
      <sbg-hero
        [title]="i18n.t(category()!.name.en, category()!.name.ar)"
        [subtitle]="i18n.t(category()!.description.en, category()!.description.ar)"
        [badge]="category()!.icon"
        [compact]="true"
      />

      <section class="sbg-section bg-white">
        <div class="sbg-container">
          @if (categoryProducts().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              @for (product of categoryProducts(); track product.slug) {
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
          } @else {
            <div class="text-center py-16">
              <p class="text-sbg-gray-400 text-lg mb-4">{{ i18n.t('More solutions coming soon.', 'مزيد من الحلول قريباً.') }}</p>
              <a routerLink="/contact" class="text-sbg-blue font-semibold hover:underline">
                {{ i18n.t('Contact us for custom solutions', 'تواصل معنا للحلول المخصصة') }}
              </a>
            </div>
          }
        </div>
      </section>

      <!-- CTA -->
      <section class="sbg-section bg-sbg-gray-50">
        <div class="sbg-container text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-sbg-navy mb-4">
            {{ i18n.t('Need a Custom Solution?', 'تحتاج حلاً مخصصاً؟') }}
          </h2>
          <p class="text-sbg-gray-500 mb-8 max-w-xl mx-auto">
            {{ i18n.t(
              'Our team can design and implement solutions tailored to your specific requirements.',
              'يمكن لفريقنا تصميم وتنفيذ حلول مصممة خصيصاً لمتطلباتك.'
            ) }}
          </p>
          <a routerLink="/contact" class="inline-flex px-8 py-3 rounded-xl text-white font-semibold sbg-gradient-blue hover:opacity-90 transition-opacity">
            {{ i18n.t('Request Consultation', 'طلب استشارة') }}
          </a>
        </div>
      </section>
    } @else {
      <div class="sbg-section text-center">
        <h2 class="text-2xl font-bold text-sbg-navy mb-4">{{ i18n.t('Category Not Found', 'الفئة غير موجودة') }}</h2>
        <a routerLink="/solutions" class="text-sbg-blue font-semibold hover:underline">{{ i18n.t('Back to Solutions', 'العودة للحلول') }}</a>
      </div>
    }
  `,
})
export class CategoryPage implements OnInit {
  i18n = inject(I18nService);
  private route = inject(ActivatedRoute);
  category = signal<SbgCategory | undefined>(undefined);
  categoryProducts = signal<SbgProduct[]>([]);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const cat = SBG_CATEGORIES.find(c => c.slug === slug);
      this.category.set(cat);
      if (cat) {
        this.categoryProducts.set(SBG_PRODUCTS.filter(p => cat.productSlugs.includes(p.slug)));
      }
    });
  }
}
