import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { SeoService } from '../core/services/seo.service';
import { SbgHeroComponent } from '../components/sbg-hero.component';
import { ProductCardComponent } from '../components/product-card.component';
import { CategoryCardComponent } from '../components/category-card.component';
import { TrustBadgesComponent } from '../components/trust-badges.component';
import { SBG_PRODUCTS } from '../data/products.data';
import { SBG_CATEGORIES } from '../data/categories.data';

@Component({
  selector: 'sbg-home',
  standalone: true,
  imports: [RouterLink, SbgHeroComponent, ProductCardComponent, CategoryCardComponent, TrustBadgesComponent],
  template: `
    <!-- HERO -->
    <sbg-hero
      [title]="i18n.t('The Saudi Enterprise Marketplace for Digital Transformation', 'السوق السعودي للحلول الرقمية المؤسسية')"
      [subtitle]="i18n.t(
        'Discover, compare, and procure governance-enforced enterprise solutions — built for Saudi Arabia, aligned with Vision 2030.',
        'اكتشف وقارن واحصل على حلول مؤسسية محكومة — مصممة للمملكة العربية السعودية ومتوافقة مع رؤية 2030.'
      )"
      [badge]="i18n.t('Saudi Business Gate', 'بوابة الأعمال السعودية')"
      [ctaText]="i18n.t('Explore Solutions', 'استكشف الحلول')"
      ctaLink="/solutions"
      [secondaryCtaText]="i18n.t('Request Consultation', 'طلب استشارة')"
      secondaryCtaLink="/contact"
    />

    <!-- Trust Badges Row -->
    <div class="bg-sbg-navy py-4">
      <div class="max-w-7xl mx-auto px-4">
        <sbg-trust-badges />
      </div>
    </div>

    <!-- WHAT IS SBG -->
    <section class="sbg-section bg-white">
      <div class="sbg-container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-sbg-navy mb-4">
            {{ i18n.t('How It Works', 'كيف تعمل البوابة') }}
          </h2>
          <p class="text-sbg-gray-500 max-w-2xl mx-auto">
            {{ i18n.t(
              'From discovery to operation — a governed, transparent procurement journey.',
              'من الاكتشاف إلى التشغيل — رحلة شراء محكومة وشفافة.'
            ) }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (step of howItWorks; track step.num) {
            <div class="text-center group">
              <div class="w-16 h-16 mx-auto rounded-2xl sbg-gradient-blue flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                {{ step.num }}
              </div>
              <h3 class="text-lg font-bold text-sbg-navy mb-2">{{ i18n.t(step.en, step.ar) }}</h3>
              <p class="text-sbg-gray-500 text-sm">{{ i18n.t(step.descEn, step.descAr) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- FEATURED SOLUTIONS -->
    <section class="sbg-section bg-sbg-gray-50">
      <div class="sbg-container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-sbg-navy mb-4">
            {{ i18n.t('Featured Solutions', 'الحلول المميزة') }}
          </h2>
          <p class="text-sbg-gray-500 max-w-2xl mx-auto">
            {{ i18n.t(
              'Enterprise-grade platforms built for Saudi organizations.',
              'منصات بمستوى المؤسسات مصممة للمنظمات السعودية.'
            ) }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          @for (product of products; track product.slug) {
            <sbg-product-card
              [slug]="product.slug"
              [name]="i18n.t(product.name.en, product.name.ar)"
              [tagline]="i18n.t(product.tagline.en, product.tagline.ar)"
              [icon]="product.icon"
              [category]="i18n.t(product.category, product.category)"
              [deployment]="product.deployment"
            />
          }
        </div>
      </div>
    </section>

    <!-- CATEGORY GRID -->
    <section class="sbg-section bg-white">
      <div class="sbg-container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-sbg-navy mb-4">
            {{ i18n.t('Solution Categories', 'فئات الحلول') }}
          </h2>
          <p class="text-sbg-gray-500 max-w-2xl mx-auto">
            {{ i18n.t(
              'Browse solutions by category to find the right fit for your organization.',
              'تصفح الحلول حسب الفئة لإيجاد الأنسب لمؤسستك.'
            ) }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (cat of categories; track cat.slug) {
            <sbg-category-card
              [slug]="cat.slug"
              [icon]="cat.icon"
              [name]="i18n.t(cat.name.en, cat.name.ar)"
              [description]="i18n.t(cat.description.en, cat.description.ar)"
            />
          }
        </div>
      </div>
    </section>

    <!-- WHY SBG -->
    <section class="sbg-section sbg-gradient-navy text-white">
      <div class="sbg-container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            {{ i18n.t('Why Saudi Business Gate', 'لماذا بوابة الأعمال السعودية') }}
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (point of whySbg; track point.icon) {
            <div class="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <span class="text-3xl mb-4 block">{{ point.icon }}</span>
              <h3 class="text-lg font-bold text-sbg-gold mb-2">{{ i18n.t(point.en, point.ar) }}</h3>
              <p class="text-sbg-gray-300 text-sm leading-relaxed">{{ i18n.t(point.descEn, point.descAr) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="sbg-section bg-gradient-to-r from-sbg-blue to-sbg-blue-dark text-white">
      <div class="sbg-container text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          {{ i18n.t('Ready to Transform Your Organization?', 'مستعد لتحويل مؤسستك؟') }}
        </h2>
        <p class="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
          {{ i18n.t(
            'Schedule a free consultation with our experts and discover the right solution for your enterprise.',
            'حدد موعد استشارة مجانية مع خبرائنا واكتشف الحل المناسب لمؤسستك.'
          ) }}
        </p>
        <a routerLink="/contact"
           class="inline-flex items-center px-8 py-3.5 rounded-xl bg-white text-sbg-blue font-bold text-lg hover:bg-sbg-gray-50 transition-colors">
          {{ i18n.t('Request Consultation', 'طلب استشارة') }}
        </a>
      </div>
    </section>
  `,
})
export class HomePage implements OnInit {
  i18n = inject(I18nService);
  private seo = inject(SeoService);
  products = SBG_PRODUCTS;
  categories = SBG_CATEGORIES;

  ngOnInit(): void {
    this.seo.update({
      titleEn: 'Enterprise SaaS Marketplace',
      titleAr: 'سوق الحلول الرقمية المؤسسية',
      descEn: 'Discover, compare, and procure governance-enforced enterprise solutions — built for Saudi Arabia, aligned with Vision 2030.',
      descAr: 'اكتشف وقارن واحصل على حلول مؤسسية محكومة — مصممة للمملكة العربية السعودية ومتوافقة مع رؤية 2030.',
    });
    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Saudi Business Gate',
      alternateName: 'بوابة الأعمال السعودية',
      url: 'https://sbg.doganconsult.com',
      description: 'Enterprise SaaS marketplace for digital transformation solutions aligned with Vision 2030.',
    });
  }

  howItWorks = [
    { num: 1, en: 'Discover', ar: 'اكتشف', descEn: 'Browse our curated marketplace of enterprise solutions.', descAr: 'تصفح سوقنا المختار من الحلول المؤسسية.' },
    { num: 2, en: 'Compare', ar: 'قارن', descEn: 'Evaluate features, compliance, and deployment models.', descAr: 'قيّم الميزات والامتثال ونماذج النشر.' },
    { num: 3, en: 'Procure', ar: 'احصل', descEn: 'Governed checkout with compliance pre-validation.', descAr: 'شراء محكوم مع التحقق المسبق من الامتثال.' },
    { num: 4, en: 'Operate', ar: 'شغّل', descEn: 'Managed deployment with evidence-based go-live.', descAr: 'نشر مُدار مع إطلاق قائم على الأدلة.' },
  ];

  whySbg = [
    { icon: '🏛️', en: 'Unified Procurement', ar: 'شراء موحد', descEn: 'One platform for all enterprise digital solutions — no fragmentation.', descAr: 'منصة واحدة لجميع الحلول الرقمية المؤسسية — بدون تشتت.' },
    { icon: '🔒', en: 'Governed Execution', ar: 'تنفيذ محكوم', descEn: 'Every transaction passes through governance stage gates.', descAr: 'كل معاملة تمر عبر بوابات حوكمة المراحل.' },
    { icon: '📋', en: 'Evidence-First', ar: 'الأدلة أولاً', descEn: 'Audit-ready evidence for every decision and action.', descAr: 'أدلة جاهزة للتدقيق لكل قرار وإجراء.' },
    { icon: '🇸🇦', en: 'Saudi-Native', ar: 'سعودي الأصل', descEn: 'Built for Saudi regulatory landscape and Vision 2030.', descAr: 'مصمم للمشهد التنظيمي السعودي ورؤية 2030.' },
    { icon: '☁️', en: 'Microsoft-Aligned', ar: 'متوافق مع مايكروسوفت', descEn: 'Architecture aligned with Microsoft security and identity.', descAr: 'بنية متوافقة مع أمن وهوية مايكروسوفت.' },
    { icon: '🤝', en: 'Local Support', ar: 'دعم محلي', descEn: 'Saudi-based support team with enterprise SLAs.', descAr: 'فريق دعم سعودي مع اتفاقيات مستوى خدمة مؤسسية.' },
  ];
}
