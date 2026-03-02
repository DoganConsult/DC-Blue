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

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [
    ServicesDetailedComponent,
    TechnicalArchitectureComponent,
    ChartSectionComponent,
    RoiCalculatorSectionComponent,
    SimulationsSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <section class="relative pt-20 pb-16 px-6 lg:px-8 bg-gradient-to-br from-surface-dark via-brand-dark to-surface-dark overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"></div>
        <div class="container mx-auto max-w-5xl text-center relative z-10">
          <p class="text-[13px] font-semibold text-sky-400 tracking-widest uppercase mb-4">
            {{ i18n.t('Our Services', 'خدماتنا') }}
          </p>
          <h1 class="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-5">
            {{ i18n.t('ICT Solutions Portfolio', 'محفظة حلول تقنية المعلومات') }}
          </h1>
          <p class="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            {{ i18n.t('17 licensed services backed by Saudi government registration and 15+ years of technical expertise.', '17 خدمة مرخصة مدعومة بتسجيل حكومي سعودي وأكثر من 15 عامًا من الخبرة التقنية.') }}
          </p>
        </div>
      </section>

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
