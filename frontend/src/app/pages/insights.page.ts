import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { I18nService } from '../core/services/i18n.service';
import { PublicContentService, PageContent } from '../core/services/public-content.service';
import { InsightsSectionComponent } from '../sections/insights-section.component';
import { FaqSectionComponent } from '../sections/faq-section.component';
import { ContactSectionComponent } from '../sections/contact-section.component';
import { PageHeroComponent } from '../sections/page-hero.component';

@Component({
  selector: 'app-insights-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeroComponent,
    InsightsSectionComponent,
    FaqSectionComponent,
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
      <app-insights-section />
      <app-faq-section />
      <app-contact-section />
    }
  `,
})
export class InsightsPage implements OnInit {
  i18n = inject(I18nService);
  private publicContent = inject(PublicContentService);

  content = signal<PageContent | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  heroSubtitle = () => {
    const h = this.content()?.hero;
    if (h?.title_en != null) return { en: h.title_en, ar: h.title_ar ?? h.title_en };
    return { en: 'Insights', ar: 'رؤى' };
  };
  heroTitle = () => {
    const h = this.content()?.hero;
    if (h?.subtitle_en != null) return { en: h.subtitle_en, ar: h.subtitle_ar ?? h.subtitle_en };
    return { en: 'Insights & Resources', ar: 'رؤى وموارد' };
  };
  heroDesc = () => ({ en: 'Thought leadership, whitepapers, and answers to common questions about ICT transformation in KSA.', ar: 'قيادة فكرية وأوراق بيضاء وإجابات على الأسئلة الشائعة حول التحول الرقمي في المملكة.' });

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.publicContent.getPage('insights').subscribe({
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
    this.titleService.setTitle('Insights & Resources | Dogan Consult');
    this.meta.updateTag({ name: 'description', content: 'Thought leadership, whitepapers, and answers to common questions about ICT transformation in KSA.' });
    this.meta.updateTag({ property: 'og:title', content: 'Insights & Resources | Dogan Consult' });
    this.meta.updateTag({ property: 'og:description', content: 'Thought leadership, whitepapers, and answers to common questions about ICT transformation in KSA.' });
    this.load();
  }
}
