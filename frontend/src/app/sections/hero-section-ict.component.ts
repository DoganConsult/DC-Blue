import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { Router } from '@angular/router';

interface Stat {
  value: number;
  suffix: string;
  label: { en: string; ar: string };
  icon: string;
}

@Component({
  selector: 'app-hero-section-ict',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-ict relative overflow-hidden -mt-[72px] bg-[#0B1220]">
      <!-- Subtle gradient overlay (enterprise: restrained) -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a]/40 via-transparent to-[#0B1220]/60 pointer-events-none" aria-hidden="true"></div>

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
                    class="inline-flex items-center gap-2 px-6 py-3.5 bg-gold-accent text-[#1D2433] rounded-lg font-semibold text-[15px] transition-colors duration-200 hover:bg-[#e5a61f]">
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
                    <span>{{ displayValues()[i] }}</span>{{ stat.suffix }}
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
  i18n = inject(I18nService);
  ds = inject(DesignSystemService);
  router = inject(Router);
  private counterAnimated = false;

  displayValues = signal<number[]>([0, 0, 0]);

  stats: Stat[] = [
    { value: 100, suffix: '+', label: { en: 'Successful Projects', ar: 'مشروع ناجح' }, icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' },
    { value: 50, suffix: '+', label: { en: 'Engineering Experts', ar: 'خبير هندسي' }, icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { value: 20, suffix: '+', label: { en: 'Years of Experience', ar: 'سنوات الخبرة' }, icon: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.27.308m4.27-5.154V2.721' },
  ];

  ngOnInit() {
    setTimeout(() => this.animateCounters(), 500);
  }

  ngOnDestroy() {}

  private animateCounters() {
    if (this.counterAnimated) return;
    this.counterAnimated = true;
    const targets = this.stats.map(s => s.value);
    const duration = 2000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const vals = targets.map(t => Math.floor(t * eased));
      this.displayValues.set(vals);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.displayValues.set(targets);
      }
    };
    requestAnimationFrame(animate);
  }
}
