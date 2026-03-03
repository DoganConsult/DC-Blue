import { Component, inject, OnInit, effect } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SiteSettingsService } from '../core/services/site-settings.service';
import { LandingContentService } from '../core/services/landing-content.service';
import { HeroSectionIctComponent } from '../sections/hero-section-ict.component';
import { SocialProofSectionComponent } from '../sections/social-proof-section.component';
import { ProblemSectionComponent } from '../sections/problem-section.component';
import { ServicesSectionComponent } from '../sections/services-section.component';
import { WhyChooseSectionComponent } from '../sections/why-choose-section.component';

import { StatsSectionComponent } from '../sections/stats-section.component';
import { TrustSectionComponent } from '../sections/trust-section.component';
import { IndustriesSectionComponent } from '../sections/industries-section.component';
import { CaseStudiesSectionComponent } from '../sections/case-studies-section.component';
import { TestimonialsEnhancedComponent } from '../sections/testimonials-enhanced.component';
import { PartnersSectionComponent } from '../sections/partners-section.component';
import { CertificationsShowcaseComponent } from '../sections/certifications-showcase.component';
import { SecuritySectionComponent } from '../sections/security-section.component';
import { EngagementFlowSectionComponent } from '../sections/engagement-flow-section.component';
import { FaqSectionComponent } from '../sections/faq-section.component';
import { FinalCtaSectionComponent } from '../sections/final-cta-section.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeroSectionIctComponent,
    SocialProofSectionComponent,
    StatsSectionComponent,
    ProblemSectionComponent,
    ServicesSectionComponent,
    IndustriesSectionComponent,
    WhyChooseSectionComponent,
    SecuritySectionComponent,
    CertificationsShowcaseComponent,
    TrustSectionComponent,
    EngagementFlowSectionComponent,
    CaseStudiesSectionComponent,
    TestimonialsEnhancedComponent,
    PartnersSectionComponent,
    FaqSectionComponent,
    FinalCtaSectionComponent,
  ],
  template: `
    @if (landingContent.errorMessage()) {
      <div class="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 py-12 text-th-text">
        <p class="text-center">{{ landingContent.errorMessage() }}</p>
        <button type="button" (click)="landingContent.retry()"
          class="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90">
          Retry
        </button>
      </div>
    } @else if (landingContent.loadingState()) {
      <div class="min-h-[60vh] flex items-center justify-center" aria-busy="true" aria-label="Loading">
        <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    } @else {
      <app-hero-section-ict [content]="landingContent.content()" />
      @defer (on viewport) {
        <app-social-proof-section [content]="landingContent.content()" />
        <app-stats-section [content]="landingContent.content()" />
        <app-problem-section [content]="landingContent.content()" />
        <app-services-section [content]="landingContent.content()" />
        <app-industries-section [content]="landingContent.content()" />
        <app-why-choose-section [content]="landingContent.content()" />
        <app-security-section [content]="landingContent.content()" />
        <app-certifications-showcase [content]="landingContent.content()" />
        <app-trust-section [content]="landingContent.content()" />
        <app-engagement-flow-section [content]="landingContent.content()" />
        <app-case-studies-section [content]="landingContent.content()" />
        <app-testimonials-enhanced [content]="landingContent.content()" />
        <app-partners-section [content]="landingContent.content()" />
        <app-faq-section [content]="landingContent.content()" />
        <app-final-cta-section />
      } @placeholder {
        <div class="h-2 min-h-[60vh]" aria-hidden="true"></div>
      }
    }

    <!-- WhatsApp Floating Button (only when URL is set) -->
    @if (siteSettings.whatsappUrl()) {
    <a [href]="siteSettings.whatsappUrl()"
       target="_blank" rel="noopener"
       aria-label="Chat on WhatsApp"
       class="fixed bottom-6 right-6 z-toast w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE57] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
      <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
    }
  `,
})
export class LandingPage implements OnInit {
  private readonly DEFAULT_TITLE = 'Dogan Consult | ICT Engineering, Delivered.';
  private readonly DEFAULT_DESCRIPTION = 'Design, build, and operate enterprise-grade ICT environments.';

  siteSettings = inject(SiteSettingsService);
  landingContent = inject(LandingContentService);
  private meta = inject(Meta);
  private title = inject(Title);

  constructor() {
    effect(() => {
      const c = this.landingContent.content();
      if (c?.hero) {
        const title = c.hero.headline?.en ?? this.DEFAULT_TITLE;
        const description = c.hero.subline?.en ?? this.DEFAULT_DESCRIPTION;
        this.title.setTitle(title);
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
      }
    });
  }

  ngOnInit(): void {
    this.siteSettings.load();
    this.landingContent.load();
  }
}
