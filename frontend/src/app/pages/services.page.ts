import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../core/services/i18n.service';
import { LandingContent } from '../core/models/landing.model';
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
    PageHeroComponent,
    ServicesDetailedComponent,
    TechnicalArchitectureComponent,
    ChartSectionComponent,
    RoiCalculatorSectionComponent,
    SimulationsSectionComponent,
    ContactSectionComponent,
  ],
  template: `
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
        <app-chart-section [content]="content()" />
      </div>
      <div id="roi">
        <app-roi-calculator-section />
      </div>
      <app-simulations-section />
      <app-contact-section />
  `,
})
export class ServicesPage implements OnInit {
  private http = inject(HttpClient);
  i18n = inject(I18nService);
  content = signal<LandingContent | null>(null);

  ngOnInit(): void {
    this.http.get<LandingContent>('/api/public/landing').subscribe({
      next: (c) => this.content.set(c),
      error: () => {},
    });
  }
}
