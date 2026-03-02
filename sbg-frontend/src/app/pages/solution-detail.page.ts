import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { SbgHeroComponent } from '../components/sbg-hero.component';
import { SBG_PRODUCTS, SbgProduct } from '../data/products.data';

@Component({
  selector: 'sbg-solution-detail',
  standalone: true,
  imports: [SbgHeroComponent, RouterLink],
  template: `
    @if (product()) {
      <sbg-hero
        [title]="i18n.t(product()!.name.en, product()!.name.ar)"
        [subtitle]="i18n.t(product()!.tagline.en, product()!.tagline.ar)"
        [badge]="product()!.icon + ' ' + product()!.deployment.toUpperCase()"
        [ctaText]="i18n.t('Request Demo', 'طلب عرض توضيحي')"
        ctaLink="/contact"
        [compact]="true"
      />

      <!-- Overview -->
      <section class="sbg-section bg-white">
        <div class="sbg-container max-w-4xl">
          <h2 class="text-2xl md:text-3xl font-bold text-sbg-navy mb-6">{{ i18n.t('Overview', 'نظرة عامة') }}</h2>
          <p class="text-sbg-gray-600 text-lg leading-relaxed">
            {{ i18n.t(product()!.sections.overview.en, product()!.sections.overview.ar) }}
          </p>
        </div>
      </section>

      <!-- Key Outcomes -->
      <section class="sbg-section bg-sbg-gray-50">
        <div class="sbg-container">
          <h2 class="text-2xl md:text-3xl font-bold text-sbg-navy mb-10 text-center">{{ i18n.t('Key Outcomes', 'النتائج الرئيسية') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            @for (outcome of product()!.sections.outcomes; track outcome.icon) {
              <div class="bg-white rounded-xl p-6 border border-sbg-gray-200 hover:shadow-lg transition-shadow">
                <span class="text-3xl mb-3 block">{{ outcome.icon }}</span>
                <h3 class="text-lg font-bold text-sbg-navy mb-2">{{ i18n.t(outcome.title.en, outcome.title.ar) }}</h3>
                <p class="text-sbg-gray-500 text-sm leading-relaxed">{{ i18n.t(outcome.desc.en, outcome.desc.ar) }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="sbg-section bg-white">
        <div class="sbg-container max-w-4xl">
          <h2 class="text-2xl md:text-3xl font-bold text-sbg-navy mb-10 text-center">{{ i18n.t('How It Works', 'كيف تعمل') }}</h2>
          <div class="space-y-8">
            @for (step of product()!.sections.howItWorks; track step.step) {
              <div class="flex gap-6 items-start">
                <div class="flex-shrink-0 w-12 h-12 rounded-full sbg-gradient-blue flex items-center justify-center text-white font-bold text-lg">
                  {{ step.step }}
                </div>
                <div>
                  <h3 class="text-lg font-bold text-sbg-navy mb-1">{{ i18n.t(step.title.en, step.title.ar) }}</h3>
                  <p class="text-sbg-gray-500 leading-relaxed">{{ i18n.t(step.desc.en, step.desc.ar) }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Who It's For -->
      <section class="sbg-section bg-sbg-gray-50">
        <div class="sbg-container max-w-4xl">
          <h2 class="text-2xl md:text-3xl font-bold text-sbg-navy mb-8 text-center">{{ i18n.t('Who It\'s For', 'لمن هذا الحل') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @for (aud of product()!.sections.audience; track aud.en) {
              <div class="flex items-center gap-3 bg-white rounded-lg p-4 border border-sbg-gray-200">
                <div class="w-2 h-2 rounded-full bg-sbg-emerald flex-shrink-0"></div>
                <span class="text-sbg-gray-700">{{ i18n.t(aud.en, aud.ar) }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Security -->
      <section class="sbg-section sbg-gradient-navy text-white">
        <div class="sbg-container max-w-4xl">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center">{{ i18n.t('Security & Governance', 'الأمن والحوكمة') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @for (sec of product()!.sections.security; track sec.en) {
              <div class="flex items-center gap-3 bg-white/5 rounded-lg p-4 border border-white/10">
                <svg class="w-5 h-5 text-sbg-emerald flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-sbg-gray-200">{{ i18n.t(sec.en, sec.ar) }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Commercial Model -->
      <section class="sbg-section bg-white">
        <div class="sbg-container max-w-4xl">
          <h2 class="text-2xl md:text-3xl font-bold text-sbg-navy mb-6 text-center">{{ i18n.t('Commercial Model', 'النموذج التجاري') }}</h2>
          <div class="bg-sbg-gray-50 rounded-xl p-8 border border-sbg-gray-200 text-center">
            <p class="text-sbg-gray-600 text-lg leading-relaxed">
              {{ i18n.t(product()!.sections.commercial.en, product()!.sections.commercial.ar) }}
            </p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="sbg-section bg-gradient-to-r from-sbg-blue to-sbg-blue-dark text-white">
        <div class="sbg-container text-center">
          <h2 class="text-3xl font-bold mb-4">{{ i18n.t('Ready to Get Started?', 'مستعد للبدء؟') }}</h2>
          <p class="text-white/80 mb-8 max-w-xl mx-auto">
            {{ i18n.t('Schedule a consultation to learn how this solution can transform your organization.', 'حدد موعد استشارة لمعرفة كيف يمكن لهذا الحل تحويل مؤسستك.') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/contact" class="px-8 py-3.5 rounded-xl bg-white text-sbg-blue font-bold hover:bg-sbg-gray-50 transition-colors">
              {{ i18n.t('Request Consultation', 'طلب استشارة') }}
            </a>
            <a routerLink="/solutions" class="px-8 py-3.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors border border-white/20">
              {{ i18n.t('View All Solutions', 'عرض جميع الحلول') }}
            </a>
          </div>
        </div>
      </section>
    } @else {
      <div class="sbg-section text-center">
        <h2 class="text-2xl font-bold text-sbg-navy mb-4">{{ i18n.t('Solution Not Found', 'الحل غير موجود') }}</h2>
        <a routerLink="/solutions" class="text-sbg-blue font-semibold hover:underline">{{ i18n.t('Back to Solutions', 'العودة للحلول') }}</a>
      </div>
    }
  `,
})
export class SolutionDetailPage implements OnInit {
  i18n = inject(I18nService);
  private route = inject(ActivatedRoute);
  product = signal<SbgProduct | undefined>(undefined);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.product.set(SBG_PRODUCTS.find(p => p.slug === slug));
    });
  }
}
