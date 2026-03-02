import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../core/services/i18n.service';
import { COLOR_PALETTE } from '../core/data/page-styles';
import { SiteSettingsService } from '../core/services/site-settings.service';
import { HeroSectionIctComponent } from '../sections/hero-section-ict.component';
import { SocialProofSectionComponent } from '../sections/social-proof-section.component';
import { ProblemSectionComponent } from '../sections/problem-section.component';
import { ServicesSectionComponent } from '../sections/services-section.component';
import { WhyChooseSectionComponent } from '../sections/why-choose-section.component';
import { ContactSectionComponent } from '../sections/contact-section.component';

export { LandingContent } from '../core/models/landing.model';
import { LandingContent } from '../core/models/landing.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeroSectionIctComponent,
    SocialProofSectionComponent,
    ProblemSectionComponent,
    ServicesSectionComponent,
    WhyChooseSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <app-hero-section-ict />
    <app-social-proof-section />
    <app-problem-section />
    <app-services-section [content]="content()" />
    <app-why-choose-section />
    <app-contact-section />

    <!-- WhatsApp Floating Button -->
    <a [href]="siteSettings.whatsappUrl()"
       target="_blank" rel="noopener"
       aria-label="Chat on WhatsApp"
       class="fixed bottom-20 sm:bottom-6 right-6 z-toast w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE57] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
      <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>

    <!-- Scroll to Top Button -->
    @if (showScrollTop()) {
      <button (click)="scrollToTop()"
              aria-label="Scroll to top"
              class="fixed bottom-20 sm:bottom-6 right-24 z-toast w-12 h-12 rounded-full bg-th-bg-inv/80 hover:bg-th-bg-inv text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 backdrop-blur-sm">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
      </button>
    }
  `,
})
export class LandingPage implements OnInit {
  private http = inject(HttpClient);
  i18n = inject(I18nService);
  siteSettings = inject(SiteSettingsService);
  content = signal<LandingContent | null>(null);
  showScrollTop = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollTop.set(window.scrollY > 600);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
      { id: '1', title: { en: 'Network & Data Center', ar: 'الشبكات ومركز البيانات' }, color: COLOR_PALETTE.network.hex },
      { id: '2', title: { en: 'Cybersecurity', ar: 'الأمن السيبراني' }, color: COLOR_PALETTE.cybersecurity.hex },
      { id: '3', title: { en: 'Cloud & DevOps', ar: 'السحابة و DevOps' }, color: COLOR_PALETTE.cloud.hex },
      { id: '4', title: { en: 'Systems Integration', ar: 'تكامل الأنظمة' }, color: COLOR_PALETTE.integration.hex },
    ],
    chartData: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [72, 85, 78, 92] },
  };

  ngOnInit(): void {
    this.siteSettings.load();
    this.content.set(this.defaultContent);
    this.http.get<LandingContent>('/api/public/landing').subscribe({
      next: (c) => this.content.set(c),
      error: () => {},
    });
  }
}
