import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { Router } from '@angular/router';
import { GRADIENTS } from '../core/data/page-styles';

interface Stat {
  value: number;
  suffix: string;
  label: { en: string; ar: string };
}

@Component({
  selector: 'app-hero-section-ict',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-ict relative overflow-hidden bg-surface-dark">
      <div class="absolute inset-0" [style.background]="heroBgCss"></div>

      <div class="relative z-10" [class]="ds.section.container" class="pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div class="max-w-4xl">
          <div class="inline-flex items-center gap-2.5 rounded-full border border-sky-400/20 bg-sky-500/[0.08] backdrop-blur-sm px-5 py-2 mb-8">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span class="text-[13px] font-medium text-white/90 tracking-wide">{{ i18n.t('Trusted by 50+ Enterprises in KSA & GCC', 'موثوق من أكثر من 50 مؤسسة في السعودية والخليج') }}</span>
          </div>

          <h1 class="text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white mb-6">
            {{ i18n.t('ICT Engineering,', 'هندسة تقنية المعلومات') }}
            <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">{{ i18n.t('Delivered.', 'والاتصالات، مُنفّذة.') }}</span>
          </h1>

          <div class="h-7 mb-8 overflow-hidden">
            <div class="transition-transform duration-500 ease-out" [style.transform]="'translateY(' + (-currentTagline() * 28) + 'px)'">
              @for (tagline of taglines; track $index) {
                <div class="h-7 flex items-center text-[15px] text-sky-300 font-medium tracking-wide">
                  {{ i18n.t(tagline.en, tagline.ar) }}
                </div>
              }
            </div>
          </div>

          <p class="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mb-10">
            {{ i18n.t(
              'Design, build, and operate enterprise-grade ICT environments across cloud, network, security, and applications.',
              'نصمم ونبني ونشغّل بيئات تقنية معلومات واتصالات مؤسسية عبر السحابة والشبكات والأمن والتطبيقات.'
            ) }}
          </p>

          <div [class]="ds.layout.buttonGroup" class="mb-16">
            <button (click)="router.navigate(['/inquiry'])"
                    class="group px-8 py-4 bg-th-bg text-th-bg-inv rounded-xl font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_0_40px_rgba(14,165,233,0.2)] hover:-translate-y-0.5">
              {{ i18n.t('Request Proposal', 'طلب عرض') }}
              <span class="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </button>
            <a href="#case-studies"
               class="px-8 py-4 rounded-xl font-semibold text-[15px] text-white/70 border border-white/10 hover:border-white/25 hover:text-white transition-all duration-300">
              {{ i18n.t('View Case Studies', 'عرض دراسات الحالة') }}
            </a>
          </div>

          <div class="flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] text-white/80 font-medium">
            @for (badge of trustBadges; track badge.id) {
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400/70" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                {{ i18n.t(badge.label.en, badge.label.ar) }}
              </span>
            }
          </div>
        </div>
      </div>

      <div class="relative z-10 border-t border-white/10">
        <div [class]="ds.section.container">
          <div class="grid grid-cols-2 lg:grid-cols-4">
            @for (stat of stats; track stat.label.en; let i = $index; let last = $last) {
              <div class="py-10 lg:py-12 text-center"
                   [ngClass]="{'border-r border-white/10': !last, 'border-b border-b-white/10': i < 2, 'lg:border-b-0': true}">
                <div class="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 tracking-tight mb-1.5">
                  <span class="stat-counter">{{ displayValues()[i] }}</span>{{ stat.suffix }}
                </div>
                <div class="text-[13px] text-white/75 font-medium tracking-wide uppercase">{{ i18n.t(stat.label.en, stat.label.ar) }}</div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes stat-entrance {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

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
  heroBgCss = GRADIENTS.heroIctBgCss;
  currentTagline = signal(0);
  private taglineInterval: any;
  private counterAnimated = false;

  displayValues = signal<number[]>([0, 0, 0, 0]);

  taglines = [
    { en: 'Cloud-Native Architecture', ar: 'بنية سحابية أصلية' },
    { en: 'Secure-by-Design Systems', ar: 'أنظمة آمنة بالتصميم' },
    { en: 'AI-Ready Infrastructure', ar: 'بنية تحتية جاهزة للذكاء الاصطناعي' },
    { en: 'Carrier-Grade Solutions', ar: 'حلول بمستوى الناقل' }
  ];

  stats: Stat[] = [
    { value: 15, suffix: '+', label: { en: 'Years Experience', ar: 'سنوات خبرة' } },
    { value: 125, suffix: '+', label: { en: 'Projects Delivered', ar: 'مشاريع منجزة' } },
    { value: 99, suffix: '%', label: { en: 'SLAs Met', ar: 'التزام SLA' } },
    { value: 6, suffix: '', label: { en: 'Regions Served', ar: 'مناطق مخدومة' } }
  ];

  trustBadges = [
    { id: 1, label: { en: 'NCA-ECC Ready', ar: 'متوافق NCA-ECC' } },
    { id: 2, label: { en: 'ISO 27001', ar: 'ISO 27001' } },
    { id: 3, label: { en: 'SCE Registered', ar: 'مسجل SCE' } },
    { id: 4, label: { en: 'Made in KSA', ar: 'صنع في السعودية' } }
  ];

  ngOnInit() {
    this.taglineInterval = setInterval(() => {
      this.currentTagline.update(curr => (curr + 1) % this.taglines.length);
    }, 4000);

    setTimeout(() => this.animateCounters(), 500);
  }

  ngOnDestroy() {
    if (this.taglineInterval) clearInterval(this.taglineInterval);
  }

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
