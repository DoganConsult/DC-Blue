import { Component, inject, signal, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
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
    <section class="relative pt-20 pb-12 sm:pb-16 px-6 lg:px-8 bg-gradient-to-br from-surface-dark via-brand-dark to-surface-dark overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"></div>
        <div class="container mx-auto max-w-5xl text-center relative z-10">
          <p class="text-[13px] font-semibold text-sky-400 tracking-widest uppercase mb-4">
            {{ i18n.t(heroSubtitle().en, heroSubtitle().ar) }}
          </p>
          <h1 class="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-5">
            {{ i18n.t(heroTitle().en, heroTitle().ar) }}
          </h1>
          <p class="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            {{ i18n.t(heroDesc().en, heroDesc().ar) }}
          </p>
        </div>
      </section>

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
  `,
})
export class AboutPage implements OnInit {
  i18n = inject(I18nService);
  private publicContent = inject(PublicContentService);

  content = signal<PageContent | null>(null);
  heroSubtitle = () => {
    const h = (this.content() as any)?.hero;
    if (h?.title_en != null) return { en: h.title_en, ar: h.title_ar ?? h.title_en };
    return { en: 'About Us', ar: 'من نحن' };
  };
  heroTitle = () => {
    const h = (this.content() as any)?.hero;
    if (h?.subtitle_en != null) return { en: h.subtitle_en, ar: h.subtitle_ar ?? h.subtitle_en };
    return { en: 'Leadership & Expertise', ar: 'القيادة والخبرة' };
  };
  heroDesc = () => ({ en: 'Built on decades of enterprise ICT experience across KSA and the GCC region.', ar: 'بنيت على عقود من خبرة تقنية المعلومات المؤسسية في المملكة ودول الخليج.' });

  ngOnInit(): void {
    this.publicContent.getPage('about').subscribe(c => this.content.set(c));
  }
}
