import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
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
    RouterLink,
    PageHeroComponent,
    CaseStudiesSectionComponent,
    TestimonialsEnhancedComponent,
    ContactSectionComponent,
  ],
  template: `
    @if (error()) {
      <div class="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 py-12 text-th-text">
        <p class="text-center">{{ error() }}</p>
        <button type="button" (click)="load()" class="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90">Retry</button>
        <a routerLink="/" class="text-primary underline">Back to home</a>
      </div>
    } @else if (loading()) {
      <div class="min-h-[50vh] flex items-center justify-center" aria-busy="true" aria-label="Loading">
        <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    } @else {
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
    }
  `,
})
export class CaseStudiesPage implements OnInit {
  i18n = inject(I18nService);
  private publicContent = inject(PublicContentService);

  content = signal<PageContent | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  heroSubtitle = () => {
    const h = this.content()?.hero;
    if (h?.title_en != null) return { en: h.title_en, ar: h.title_ar ?? h.title_en };
    return { en: 'Case Studies', ar: 'دراسات حالة' };
  };
  heroTitle = () => {
    const h = this.content()?.hero;
    if (h?.subtitle_en != null) return { en: h.subtitle_en, ar: h.subtitle_ar ?? h.subtitle_en };
    return { en: 'Proven Results, Real Impact', ar: 'نتائج مثبتة، تأثير حقيقي' };
  };
  heroDesc = () => ({ en: 'See how we have delivered transformative ICT solutions across healthcare, government, and enterprise sectors.', ar: 'اطلع على كيفية تقديمنا لحلول تقنية معلومات تحويلية في قطاعات الرعاية الصحية والحكومة والمؤسسات.' });

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.publicContent.getPage('case_studies').subscribe({
      next: (c) => { this.content.set(c); this.loading.set(false); this.error.set(null); },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.status === 404 ? 'Page not found' : err?.message || 'Failed to load content');
        this.content.set(null);
      },
    });
  }

  private meta = inject(Meta);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('Case Studies — Proven Results | Dogan Consult');
    this.meta.updateTag({ name: 'description', content: 'See how we have delivered transformative ICT solutions across healthcare, government, and enterprise sectors.' });
    this.meta.updateTag({ property: 'og:title', content: 'Case Studies — Proven Results | Dogan Consult' });
    this.meta.updateTag({ property: 'og:description', content: 'See how we have delivered transformative ICT solutions across healthcare, government, and enterprise sectors.' });
    this.load();
  }
}
