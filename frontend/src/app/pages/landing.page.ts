import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../core/services/i18n.service';
import { NavSectionComponent } from '../sections/nav-section.component';
import { HeroSectionComponent } from '../sections/hero-section.component';
import { StatsSectionComponent } from '../sections/stats-section.component';
import { ProblemSectionComponent } from '../sections/problem-section.component';
import { SocialProofSectionComponent } from '../sections/social-proof-section.component';
import { ServicesSectionComponent } from '../sections/services-section.component';
import { CrActivitiesSectionComponent } from '../sections/cr-activities-section.component';
import { ChartSectionComponent } from '../sections/chart-section.component';
import { StandardsSectionComponent } from '../sections/standards-section.component';
import { TransformSectionComponent } from '../sections/transform-section.component';
import { CompetitorSectionComponent } from '../sections/competitor-section.component';
import { IndustriesSectionComponent } from '../sections/industries-section.component';
import { EngagementFlowSectionComponent } from '../sections/engagement-flow-section.component';
import { IntegrationsSectionComponent } from '../sections/integrations-section.component';
import { SecuritySectionComponent } from '../sections/security-section.component';
import { RoiSectionComponent } from '../sections/roi-section.component';
import { TrustSectionComponent } from '../sections/trust-section.component';
import { PricingSectionComponent } from '../sections/pricing-section.component';
import { FaqSectionComponent } from '../sections/faq-section.component';
import { FinalCtaSectionComponent } from '../sections/final-cta-section.component';
import { ContactSectionComponent } from '../sections/contact-section.component';
import { FooterSectionComponent } from '../sections/footer-section.component';
import { SimulationsSectionComponent } from '../sections/simulations-section.component';

export interface LandingContent {
  hero: { headline: { en: string; ar: string }; subline: { en: string; ar: string }; cta: { en: string; ar: string } };
  stats: Array<{ value: number; suffix: string; label: { en: string; ar: string } }>;
  services: Array<{ id: string; title: { en: string; ar: string }; color: string }>;
  chartData: { labels: string[]; values: number[] };
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    NavSectionComponent,
    HeroSectionComponent,
    StatsSectionComponent,
    ProblemSectionComponent,
    SocialProofSectionComponent,
    ServicesSectionComponent,
    CrActivitiesSectionComponent,
    ChartSectionComponent,
    StandardsSectionComponent,
    TransformSectionComponent,
    CompetitorSectionComponent,
    IndustriesSectionComponent,
    EngagementFlowSectionComponent,
    IntegrationsSectionComponent,
    SecuritySectionComponent,
    RoiSectionComponent,
    TrustSectionComponent,
    PricingSectionComponent,
    FaqSectionComponent,
    FinalCtaSectionComponent,
    ContactSectionComponent,
    FooterSectionComponent,
    SimulationsSectionComponent,
  ],
  template: `
    <app-nav-section [content]="content()" (langChange)="i18n.setLang($event)" />
    <main>
      <app-hero-section [content]="content()" />
      <app-stats-section [content]="content()" />
      <app-problem-section />
      <app-social-proof-section />
      <app-services-section [content]="content()" />
      <app-cr-activities-section />
      <app-chart-section [content]="content()" />
      <app-simulations-section />
      <app-standards-section />
      <app-transform-section />
      <app-competitor-section />
      <app-industries-section />
      <app-engagement-flow-section />
      <app-integrations-section />
      <app-security-section />
      <app-roi-section />
      <app-trust-section />
      <app-pricing-section />
      <app-faq-section />
      <app-final-cta-section />
      <app-contact-section />
      <app-footer-section />
    </main>
  `,
})
export class LandingPage implements OnInit {
  private http = inject(HttpClient);
  i18n = inject(I18nService);
  content = signal<LandingContent | null>(null);

  private defaultContent: LandingContent = {
    hero: {
      headline: { en: 'ICT Engineering, Delivered.', ar: 'هندسة تقنية المعلومات والاتصالات، مُنفّذة.' },
      subline: { en: 'Design, build, and operate enterprise-grade ICT environments.', ar: 'نصمم ونبني ونشغّل بيئات تقنية معلومات واتصالات مؤسسية.' },
      cta: { en: 'Request Proposal', ar: 'طلب عرض' },
    },
    stats: [
      { value: 15, suffix: '+', label: { en: 'Years Experience', ar: 'سنوات خبرة' } },
      { value: 120, suffix: '+', label: { en: 'Projects Delivered', ar: 'مشاريع منجزة' } },
      { value: 99, suffix: '%', label: { en: 'SLAs Met', ar: 'التزام ب SLA' } },
      { value: 6, suffix: '', label: { en: 'Regions', ar: 'مناطق' } },
    ],
    services: [
      { id: '1', title: { en: 'Network & Data Center', ar: 'الشبكات ومركز البيانات' }, color: '#0EA5E9' },
      { id: '2', title: { en: 'Cybersecurity', ar: 'الأمن السيبراني' }, color: '#006C35' },
      { id: '3', title: { en: 'Cloud & DevOps', ar: 'السحابة و DevOps' }, color: '#6366F1' },
      { id: '4', title: { en: 'Systems Integration', ar: 'تكامل الأنظمة' }, color: '#10B981' },
    ],
    chartData: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [72, 85, 78, 92] },
  };

  ngOnInit(): void {
    this.content.set(this.defaultContent);
    this.http.get<LandingContent>('/api/public/landing').subscribe({
      next: (c) => this.content.set(c),
      error: () => {},
    });
  }
}
