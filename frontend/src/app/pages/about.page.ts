import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { I18nService } from '../core/services/i18n.service';
import { PublicContentService, PageContent } from '../core/services/public-content.service';
import { ExecutiveProfileComponent } from '../sections/executive-profile.component';
import { LeadershipSectionComponent } from '../sections/leadership-section.component';
import { CertificationsShowcaseComponent } from '../sections/certifications-showcase.component';
import { EducationSectionComponent } from '../sections/education-section.component';
import { AwardsSectionComponent } from '../sections/awards-section.component';
import { GovernmentCredentialsComponent } from '../sections/government-credentials.component';
import { GlobalReachComponent } from '../sections/global-reach.component';
import { StrategicAchievementsComponent } from '../sections/strategic-achievements.component';
import { PageHeroComponent } from '../sections/page-hero.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeroComponent,
    ExecutiveProfileComponent,
    LeadershipSectionComponent,
    CertificationsShowcaseComponent,
    EducationSectionComponent,
    AwardsSectionComponent,
    GovernmentCredentialsComponent,
    GlobalReachComponent,
    StrategicAchievementsComponent,
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
      <app-executive-profile />
      <app-leadership-section />
      <div id="certifications">
        <app-certifications-showcase />
      </div>
      <div id="education">
        <app-education-section />
      </div>
      <div id="awards">
        <app-awards-section />
      </div>
      <app-government-credentials />
      <app-global-reach />
      <app-strategic-achievements />
    }
  `,
})
export class AboutPage implements OnInit {
  i18n = inject(I18nService);
  private publicContent = inject(PublicContentService);

  content = signal<PageContent | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  heroSubtitle = () => {
    const h = this.content()?.hero;
    if (h?.title_en != null) return { en: h.title_en, ar: h.title_ar ?? h.title_en };
    return { en: 'About Us', ar: 'من نحن' };
  };
  heroTitle = () => {
    const h = this.content()?.hero;
    if (h?.subtitle_en != null) return { en: h.subtitle_en, ar: h.subtitle_ar ?? h.subtitle_en };
    return { en: 'Leadership & Expertise', ar: 'القيادة والخبرة' };
  };
  heroDesc = () => ({ en: 'Built on decades of enterprise ICT experience across KSA and the GCC region.', ar: 'بنيت على عقود من خبرة تقنية المعلومات المؤسسية في المملكة ودول الخليج.' });

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.publicContent.getPage('about').subscribe({
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
    this.titleService.setTitle('About Us — Leadership & Expertise | Dogan Consult');
    this.meta.updateTag({ name: 'description', content: 'Built on decades of enterprise ICT experience across KSA and the GCC region.' });
    this.meta.updateTag({ property: 'og:title', content: 'About Us — Leadership & Expertise | Dogan Consult' });
    this.meta.updateTag({ property: 'og:description', content: 'Built on decades of enterprise ICT experience across KSA and the GCC region.' });
    this.load();
  }
}
