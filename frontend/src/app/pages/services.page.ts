import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { I18nService } from '../core/services/i18n.service';
import { LandingContentService } from '../core/services/landing-content.service';
import { ServicesDetailedComponent } from '../sections/services-detailed.component';
import { TechnicalArchitectureComponent } from '../sections/technical-architecture.component';
import { ChartSectionComponent } from '../sections/chart-section.component';
import { RoiCalculatorSectionComponent } from '../sections/roi-calculator-section.component';
import { SimulationsSectionComponent } from '../sections/simulations-section.component';
import { ContactSectionComponent } from '../sections/contact-section.component';
import { PageHeroComponent } from '../sections/page-hero.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeroComponent,
    ServicesDetailedComponent,
    TechnicalArchitectureComponent,
    ChartSectionComponent,
    RoiCalculatorSectionComponent,
    SimulationsSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <nav class="px-4 py-2 text-sm text-th-muted" aria-label="Breadcrumb">
      <ol class="flex flex-wrap gap-1">
        <li><a routerLink="/" class="hover:text-primary">Home</a></li>
        <li aria-hidden="true">/</li>
        <li class="text-th-text" aria-current="page">Services</li>
      </ol>
    </nav>
    <app-page-hero
      overlineEn="Our Services"
      overlineAr="خدماتنا"
      titleEn="ICT Solutions Portfolio"
      titleAr="محفظة حلول تقنية المعلومات"
      descriptionEn="17 licensed services backed by Saudi government registration and 15+ years of technical expertise."
      descriptionAr="17 خدمة مرخصة مدعومة بتسجيل حكومي سعودي وأكثر من 15 عامًا من الخبرة التقنية."
    />
      <app-services-detailed />
      <div id="architecture">
        <app-technical-architecture />
      </div>
      <div id="metrics">
        @if (landingContent.errorMessage()) {
          <div class="flex flex-col items-center justify-center gap-3 py-12 text-th-text">
            <p>{{ landingContent.errorMessage() }}</p>
            <button type="button" (click)="landingContent.retry()" class="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90">Retry</button>
          </div>
        } @else if (landingContent.loadingState()) {
          <div class="min-h-[200px] flex items-center justify-center" aria-busy="true">
            <div class="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        } @else {
          <app-chart-section [content]="landingContent.content()" />
        }
      </div>
      <div id="roi">
        <app-roi-calculator-section />
      </div>
      <app-simulations-section />
      <app-contact-section />
  `,
})
export class ServicesPage implements OnInit {
  i18n = inject(I18nService);
  landingContent = inject(LandingContentService);
  private meta = inject(Meta);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('ICT Solutions Portfolio | Dogan Consult');
    this.meta.updateTag({ name: 'description', content: '17 licensed ICT services backed by Saudi government registration and 15+ years of technical expertise.' });
    this.meta.updateTag({ property: 'og:title', content: 'ICT Solutions Portfolio | Dogan Consult' });
    this.meta.updateTag({ property: 'og:description', content: '17 licensed ICT services backed by Saudi government registration and 15+ years of technical expertise.' });
    this.landingContent.load();
  }
}
