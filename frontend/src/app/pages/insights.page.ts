import { Component, inject, signal, OnInit } from '@angular/core';
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
    PageHeroComponent,
    InsightsSectionComponent,
    FaqSectionComponent,
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
      <app-insights-section />
      <app-faq-section />
      <app-contact-section />
  `,
})
export class InsightsPage implements OnInit {
  i18n = inject(I18nService);
  private publicContent = inject(PublicContentService);

  content = signal<PageContent | null>(null);
  heroSubtitle = () => {
    const h = (this.content() as any)?.hero;
    if (h?.title_en != null) return { en: h.title_en, ar: h.title_ar ?? h.title_en };
    return { en: 'Insights', ar: 'رؤى' };
  };
  heroTitle = () => {
    const h = (this.content() as any)?.hero;
    if (h?.subtitle_en != null) return { en: h.subtitle_en, ar: h.subtitle_ar ?? h.subtitle_en };
    return { en: 'Insights & Resources', ar: 'رؤى وموارد' };
  };
  heroDesc = () => ({ en: 'Thought leadership, whitepapers, and answers to common questions about ICT transformation in KSA.', ar: 'قيادة فكرية وأوراق بيضاء وإجابات على الأسئلة الشائعة حول التحول الرقمي في المملكة.' });

  ngOnInit(): void {
    this.publicContent.getPage('insights').subscribe(c => this.content.set(c));
  }
}
