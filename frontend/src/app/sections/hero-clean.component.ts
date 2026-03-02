import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-hero-clean',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative min-h-screen bg-black text-white overflow-hidden flex items-center">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-950 via-black to-green-950 opacity-50"></div>
        <svg class="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div class="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="max-w-5xl mx-auto text-center">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-900/50 to-green-800/50 backdrop-blur-sm rounded-full border border-green-500/30 mb-8">
            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="text-sm font-medium text-green-400">{{ i18n.t('VISION 2030 ALIGNED', 'متوافق مع رؤية 2030') }}</span>
          </div>

          <h1 class="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span class="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
              {{ i18n.t('Digital Excellence', 'التميز الرقمي') }}
            </span>
            <br />
            <span class="text-4xl md:text-5xl text-th-text-3">
              {{ i18n.t('for Saudi Enterprises', 'للمؤسسات السعودية') }}
            </span>
          </h1>

          <p class="text-xl md:text-2xl text-th-text-3 mb-12 max-w-3xl mx-auto leading-relaxed">
            {{ i18n.t('Transforming businesses through', 'تحويل الأعمال من خلال') }}
            <span class="text-white font-semibold">{{ i18n.t('technical architecture', 'الهندسة التقنية') }}</span>,
            <span class="text-white font-semibold">{{ i18n.t('AI integration', 'تكامل الذكاء الاصطناعي') }}</span>, {{ i18n.t('and', 'و') }}
            <span class="text-white font-semibold">{{ i18n.t('regulatory compliance', 'الامتثال التنظيمي') }}</span>
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold text-lg overflow-hidden transition-all hover:scale-105">
              <span class="relative z-10">{{ i18n.t('Explore Solutions', 'استكشف الحلول') }}</span>
              <div class="absolute inset-0 bg-th-card opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
            <button class="px-8 py-4 bg-th-card/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold text-lg hover:bg-th-card/20 transition-all">
              {{ i18n.t('View Architecture', 'عرض الهندسة') }}
            </button>
          </div>

          <div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            @for (metric of metrics; track metric.label.en) {
              <div class="text-center">
                <div class="text-3xl font-bold mb-1" [class]="metric.colorClass">{{ metric.value }}</div>
                <div class="text-sm text-th-text-3">{{ i18n.t(metric.label.en, metric.label.ar) }}</div>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-th-text-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .animation-delay-2000 {
      animation-delay: 2s;
    }
  `]
})
export class HeroCleanComponent {
  i18n = inject(I18nService);

  metrics = [
    { value: '17', label: { en: 'Licensed Services', ar: 'خدمة مرخصة' }, colorClass: 'text-cyan-400' },
    { value: '100%', label: { en: 'KSA Compliant', ar: 'متوافق مع السعودية' }, colorClass: 'text-green-400' },
    { value: '24/7', label: { en: 'Expert Support', ar: 'دعم الخبراء' }, colorClass: 'text-blue-400' },
  ];
}
