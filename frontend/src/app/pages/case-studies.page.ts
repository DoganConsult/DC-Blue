import { Component, inject, signal, OnInit } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { PublicContentService, PageContent } from '../core/services/public-content.service';
import { CaseStudiesSectionComponent } from '../sections/case-studies-section.component';
import { TestimonialsEnhancedComponent } from '../sections/testimonials-enhanced.component';
import { ContactSectionComponent } from '../sections/contact-section.component';
import { PageHeroComponent } from '../sections/page-hero.component';

@Component({
  selector: 'app-case-studies-page',
  standalone: true,
  imports: [
    PageHeroComponent,
    CaseStudiesSectionComponent,
    TestimonialsEnhancedComponent,
    ContactSectionComponent,
  ],
  template: `
    <app-page-hero
      [overlineEn]="heroSubtitle().en"
      [overlineAr]="heroSubtitle().ar"
      [titleEn]="heroTitle().en"
      [titleAr]="heroTitle().ar"
      [descriptionEn]="heroDesc().en"
      [descriptionAr]="heroDesc().ar"
    />
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
