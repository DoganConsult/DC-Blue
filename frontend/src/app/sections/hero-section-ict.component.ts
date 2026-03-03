import { Component, inject, input, signal, OnInit, OnDestroy } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { Router } from '@angular/router';
import { LandingContent } from '../core/models/landing.model';

interface Stat {
  value: number;
  suffix: string;
  label: { en: string; ar: string };
  icon?: string;
}

@Component({
  selector: 'app-hero-section-ict',
  standalone: true,
  imports: [],
  template: `
    <section class="hero-ict relative overflow-hidden -mt-[72px]" style="background: var(--agrc-hero-bg, #0B1220)">
      <!-- Subtle gradient overlay (enterprise: restrained) -->
      <div class="absolute inset-0 pointer-events-none" style="background: var(--agrc-hero-overlay)" aria-hidden="true"></div>

      <div class="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8 pt-[140px] pb-[100px]">
        <div class="max-w-[640px]">
          <!-- Eyebrow: understated (enterprise style) -->
          <div class="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2 mb-8">
            <span class="text-[12px] font-medium tracking-wide text-white/80 uppercase">
              {{ i18n.t('ICT Infrastructure & Telecommunications Consulting', 'استشارات هندسية للبنية التحتية والاتصالات') }}
            </span>
          </div>

          <!-- Main headline: strong hierarchy -->
          <h1 class="text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.2] text-white mb-6 tracking-tight">
            {{ i18n.t('Trusted Engineering Consulting for', 'استشارات هندسية موثوقة للبنية التحتية') }}
            <br>
            <span class="text-gold-accent">{{ i18n.t('Critical Digital Infrastructure', 'الرقمية الحيوية') }}</span>
          </h1>

          <!-- Supporting paragraph: generous line-height -->
          <p class="text-[17px] text-white/80 leading-[1.65] max-w-[540px] mb-10">
            {{ i18n.t(
              'We are an independent engineering consulting firm specializing in ICT infrastructure and telecommunications. We provide strategic consulting, engineering design, technical assurance, and comprehensive solutions for major organizations.',
              'نحن شركة استشارات هندسية مستقلة في مجال البنية التحتية والاتصالات. نقدم خدمات الاستشارات الاستراتيجية والتصميم الهندسي والضمان الفني والحلول الشاملة للمؤسسات الكبرى.'
            ) }}
          </p>

          <!-- CTAs: primary accent + secondary outline -->
          <div class="flex flex-wrap items-center gap-4 mb-16">
            <button (click)="router.navigate(['/inquiry'])"
                    class="inline-flex items-center gap-2 px-6 py-3.5 bg-gold-accent text-th-text rounded-lg font-semibold text-[15px] transition-colors duration-200 hover:bg-[var(--color-accent-dark,#e5a61f)]">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {{ i18n.t('Request Consultation', 'طلب استشارة') }}
            </button>
            <a href="#services"
               class="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-[15px] text-white border border-white/25 hover:border-white/50 hover:bg-white/5 transition-colors duration-200">
              {{ i18n.t('Our Services', 'خدماتنا') }}
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Stats strip: clean with subtle dividers -->
      <div class="relative z-10 border-t border-white/10">
        <div class="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div class="flex flex-wrap items-center justify-start gap-10 lg:gap-14 py-8 lg:py-9">
            @for (stat of stats; track stat.label.en; let i = $index) {
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg class="w-4 h-4 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="stat.icon" /></svg>
                </div>
                <div>
                  <div class="text-xl lg:text-2xl font-bold text-white tracking-tight stat-counter">
                    <span>{{ displayValues()[i] ?? stat.value }}</span>{{ stat.suffix }}
                  </div>
                  <div class="text-[12px] text-white/55 font-medium">{{ i18n.t(stat.label.en, stat.label.ar) }}</div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Scroll indicator: minimal -->
      <div class="relative z-10 flex justify-center pb-6">
        <div class="flex flex-col items-center gap-1.5 text-white/35">
          <span class="text-[10px] tracking-[0.15em] uppercase font-medium">Scroll</span>
          <svg class="w-3.5 h-3.5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stat-counter { font-variant-numeric: tabular-nums; }

    @media (prefers-reduced-motion: reduce) {
      .stat-counter { transition: none; }
    }
  `]
})
export class HeroSectionIctComponent implements OnInit, OnDestroy {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);
  router = inject(Router);
  private counterAnimated = false;
  private animationFrameId: number | null = null;
  private initTimerId: ReturnType<typeof setTimeout> | null = null;

  displayValues = signal<number[]>([]);

  private readonly fallbackIcons: Record<string, string> = {
    'Years Experience': 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    'Projects Delivered': 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'SLAs Met': 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    'Regions': 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
    'Enterprise Clients': 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    'Client Satisfaction': 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  };

  private readonly defaultIcon = 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z';

  get stats(): Stat[] {
    const raw: Stat[] = (this.content()?.stats as any) ?? this.defaultStats;
    return raw.map(s => ({
      ...s,
      icon: s.icon || this.fallbackIcons[s.label.en] || this.defaultIcon,
    }));
  }

  private defaultStats: Stat[] = [
    { value: 15, suffix: '+', label: { en: 'Years Experience', ar: 'سنوات خبرة' } },
    { value: 120, suffix: '+', label: { en: 'Projects Delivered', ar: 'مشاريع منجزة' } },
    { value: 99, suffix: '%', label: { en: 'SLAs Met', ar: 'التزام ب SLA' } },
    { value: 6, suffix: '', label: { en: 'Regions', ar: 'مناطق' } },
  ];

  ngOnInit() {
    this.initTimerId = setTimeout(() => this.animateCounters(), 500);
  }

  ngOnDestroy() {
    if (this.initTimerId !== null) {
      clearTimeout(this.initTimerId);
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private animateCounters() {
    if (this.counterAnimated) return;
    this.counterAnimated = true;
    const targets = this.stats.map(s => s.value);
    this.displayValues.set(targets.map(() => 0));
    const duration = 2000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const vals = targets.map(t => Math.floor(t * eased));
      this.displayValues.set(vals);
      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.displayValues.set(targets);
      }
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }
}
