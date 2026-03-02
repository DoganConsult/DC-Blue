import { Component, inject, signal, OnInit } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { PublicContentService, PageContent } from '../core/services/public-content.service';
import { CaseStudiesSectionComponent } from '../sections/case-studies-section.component';
import { TestimonialsEnhancedComponent } from '../sections/testimonials-enhanced.component';
import { ContactSectionComponent } from '../sections/contact-section.component';

@Component({
  selector: 'app-case-studies-page',
  standalone: true,
  imports: [
    CaseStudiesSectionComponent,
    TestimonialsEnhancedComponent,
    ContactSectionComponent,
  ],
  template: `
    <section class="relative pt-20 pb-16 px-6 lg:px-8 bg-gradient-to-br from-surface-dark via-brand-dark to-surface-dark overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"></div>
        <div class="container mx-auto max-w-5xl text-center relative z-10">
          <p class="text-[13px] font-semibold text-sky-400 tracking-widest uppercase mb-4">
            {{ i18n.t(heroSubtitle().en, heroSubtitle().ar) }}
          </p>
          <h1 class="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-5">
            {{ i18n.t(heroTitle().en, heroTitle().ar) }}
          </h1>
          <p class="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            {{ i18n.t(heroDesc().en, heroDesc().ar) }}
          </p>
        </div>
      </section>

      <app-case-studies-section />
      <app-testimonials-enhanced />
      <app-contact-section />
  `,
})
export class CaseStudiesPage implements OnInit {
  i18n = inject(I18nService);
  private publicContent = inject(PublicContentService);

  content = signal<PageContent | null>(null);
  heroSubtitle = () => {
    const h = (this.content() as any)?.hero;
    if (h?.title_en != null) return { en: h.title_en, ar: h.title_ar ?? h.title_en };
    return { en: 'Case Studies', ar: 'دراسات حالة' };
  };
  heroTitle = () => {
    const h = (this.content() as any)?.hero;
    if (h?.subtitle_en != null) return { en: h.subtitle_en, ar: h.subtitle_ar ?? h.subtitle_en };
    return { en: 'Proven Results, Real Impact', ar: 'نتائج مثبتة، تأثير حقيقي' };
  };
  heroDesc = () => ({ en: 'See how we have delivered transformative ICT solutions across healthcare, government, and enterprise sectors.', ar: 'اطلع على كيفية تقديمنا لحلول تقنية معلومات تحويلية في قطاعات الرعاية الصحية والحكومة والمؤسسات.' });

  ngOnInit(): void {
    this.publicContent.getPage('case_studies').subscribe(c => this.content.set(c));
  }
}
