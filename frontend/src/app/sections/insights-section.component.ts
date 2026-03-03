import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { Router } from '@angular/router';

interface Insight {
  id: string;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  category: { en: string; ar: string };
  author: string;
  date: string;
  readTime: string;
  image?: string;
  featured?: boolean;
  type: 'article' | 'whitepaper' | 'case-study' | 'video';
}

@Component({
  selector: 'app-insights-section',
  standalone: true,
  imports: [],
  template: `
    <section class="py-20 lg:py-24 px-6 lg:px-8 bg-gradient-to-b from-th-card to-th-bg-alt">
      <div class="max-w-[1200px] mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 rounded-full mb-4">
            <svg class="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
            </svg>
            <span class="text-sm font-medium text-sky-700">{{ i18n.t('Insights & Research', 'الرؤى والأبحاث') }}</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
            {{ i18n.t('Thought Leadership', 'قيادة الفكر') }}
          </h2>
          <p class="text-lg text-th-text-2 max-w-3xl mx-auto">
            {{ i18n.t(
              'Stay ahead with our latest insights on digital transformation, emerging technologies, and Saudi market trends',
              'ابق في المقدمة مع أحدث رؤانا حول التحول الرقمي والتقنيات الناشئة واتجاهات السوق السعودي'
            ) }}
          </p>
        </div>

        <!-- Featured Insight -->
        <div class="mb-16">
          <div class="bg-gradient-to-r from-brand-dark to-brand-darker rounded-3xl overflow-hidden shadow-2xl">
            <div class="grid md:grid-cols-2">
              <!-- Content -->
              <div class="p-8 md:p-12 text-white">
                <div class="flex items-center gap-3 mb-6">
                  <span class="px-3 py-1 bg-amber-500 text-brand-dark rounded-full text-xs font-bold uppercase">
                    {{ i18n.t('Featured Report', 'تقرير مميز') }}
                  </span>
                  <span class="px-3 py-1 bg-th-card/20 rounded-full text-xs font-medium">
                    {{ i18n.t('Digital Transformation', 'التحول الرقمي') }}
                  </span>
                </div>

                <h3 class="text-3xl font-bold mb-4">
                  {{ i18n.t(
                    'Saudi Digital Transformation Report 2024',
                    'تقرير التحول الرقمي السعودي 2024'
                  ) }}
                </h3>

                <p class="text-lg text-sky-100 mb-6 leading-relaxed">
                  {{ i18n.t(
                    'Comprehensive analysis of digital maturity across Saudi enterprises, featuring insights from 200+ organizations and alignment with Vision 2030 objectives.',
                    'تحليل شامل للنضج الرقمي عبر المؤسسات السعودية، يضم رؤى من أكثر من 200 منظمة والمواءمة مع أهداف رؤية 2030.'
                  ) }}
                </p>

                <div class="flex items-center gap-6 mb-8 text-sm text-sky-200">
                  <span>{{ i18n.t('By Research Team', 'بواسطة فريق البحث') }}</span>
                  <span>{{ i18n.t('45 pages', '45 صفحة') }}</span>
                  <span>{{ i18n.t('15 min read', '15 دقيقة قراءة') }}</span>
                </div>

                <div class="flex flex-wrap gap-3">
                  <button (click)="router.navigate(['/inquiry'])" class="inline-flex items-center gap-2 px-6 py-3 bg-th-card text-brand-dark rounded-xl font-semibold hover:bg-sky-50 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    {{ i18n.t('Download Report', 'تحميل التقرير') }}
                  </button>
                  <button (click)="router.navigate(['/inquiry'])" class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/50 text-white rounded-xl font-semibold hover:bg-th-card/10 transition-all">
                    {{ i18n.t('View Summary', 'عرض الملخص') }}
                  </button>
                </div>
              </div>

              <!-- Visual -->
              <div class="relative bg-gradient-to-br from-primary/20 to-cyan-500/20 p-8 md:p-12 flex items-center justify-center">
                <div class="relative">
                  <!-- Chart Preview -->
                  <div class="w-64 h-64 relative">
                    <svg class="w-full h-full" viewBox="0 0 200 200">
                      <!-- Pie Chart -->
                      <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="40"/>
                      <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient1)" stroke-width="40"
                        stroke-dasharray="125 251" transform="rotate(-90 100 100)"/>
                      <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient2)" stroke-width="40"
                        stroke-dasharray="75 251" stroke-dashoffset="-125" transform="rotate(-90 100 100)"/>
                      <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient3)" stroke-width="40"
                        stroke-dasharray="51 251" stroke-dashoffset="-200" transform="rotate(-90 100 100)"/>

                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#0EA5E9;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#D97706;stop-opacity:1" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <!-- Center Text -->
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="text-center">
                        <div class="text-4xl font-bold text-white">87%</div>
                        <div class="text-xs text-sky-200">Digital Ready</div>
                      </div>
                    </div>
                  </div>

                  <!-- Floating Stats -->
                  <div class="absolute -top-4 -right-4 bg-th-card/90 backdrop-blur rounded-lg px-3 py-2 shadow-lg">
                    <div class="text-2xl font-bold text-primary">+43%</div>
                    <div class="text-xs text-th-text-2">YoY Growth</div>
                  </div>
                  <div class="absolute -bottom-4 -left-4 bg-th-card/90 backdrop-blur rounded-lg px-3 py-2 shadow-lg">
                    <div class="text-2xl font-bold text-emerald-500">SAR 2.3B</div>
                    <div class="text-xs text-th-text-2">Market Size</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Latest Insights Grid -->
        <div class="grid md:grid-cols-3 gap-8 mb-12">
          @for (insight of latestInsights; track insight.id) {
          <article
            class="group bg-th-card rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <div class="relative h-48 bg-gradient-to-br" [class]="getTypeGradient(insight.type)">
              <div class="absolute inset-0 flex items-center justify-center">
                @if (insight.type === 'article') {
                <svg class="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
                </svg>
                } @else if (insight.type === 'whitepaper') {
                <svg class="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
                </svg>
                } @else if (insight.type === 'video') {
                <svg class="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                </svg>
                }
              </div>

              <!-- Type Badge -->
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-th-card/90 backdrop-blur rounded-full text-xs font-semibold text-th-text-2 capitalize">
                  {{ insight.type }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <!-- Category & Date -->
              <div class="flex items-center justify-between mb-3 text-xs text-th-text-3">
                <span class="font-medium text-primary">
                  {{ i18n.t(insight.category.en, insight.category.ar) }}
                </span>
                <span>{{ insight.date }}</span>
              </div>

              <!-- Title -->
              <h3 class="text-xl font-bold text-brand-dark mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {{ i18n.t(insight.title.en, insight.title.ar) }}
              </h3>

              <!-- Excerpt -->
              <p class="text-sm text-th-text-2 mb-4 line-clamp-3">
                {{ i18n.t(insight.excerpt.en, insight.excerpt.ar) }}
              </p>

              <!-- Footer -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-xs text-th-text-3">
                  <span>{{ insight.author }}</span>
                  <span>•</span>
                  <span>{{ insight.readTime }}</span>
                </div>
                <button (click)="router.navigate(['/inquiry'])" class="text-primary font-medium hover:text-sky-600 transition-colors">
                  {{ i18n.t('Read →', 'اقرأ ←') }}
                </button>
              </div>
            </div>
          </article>
          }
        </div>

        <!-- Newsletter Signup -->
        <div class="bg-gradient-to-r from-primary to-cyan-500 rounded-3xl p-8 md:p-12 text-white">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 class="text-3xl font-bold mb-4">
                {{ i18n.t('Stay Informed', 'ابق على اطلاع') }}
              </h3>
              <p class="text-lg text-sky-100">
                {{ i18n.t(
                  'Get weekly insights on digital transformation, technology trends, and Saudi market updates delivered to your inbox.',
                  'احصل على رؤى أسبوعية حول التحول الرقمي واتجاهات التكنولوجيا وتحديثات السوق السعودية في بريدك الإلكتروني.'
                ) }}
              </p>
            </div>
            <div>
              <form class="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="{{ i18n.t('Enter your email', 'أدخل بريدك الإلكتروني') }}"
                  class="flex-1 px-4 py-3 rounded-xl text-th-text placeholder-th-text-3 focus:outline-none focus:ring-2 focus:ring-white"
                >
                <button
                  type="submit"
                  class="px-6 py-3 bg-th-card text-primary rounded-xl font-semibold hover:bg-sky-50 transition-all"
                >
                  {{ i18n.t('Subscribe', 'اشترك') }}
                </button>
              </form>
              <p class="mt-3 text-xs text-sky-200">
                {{ i18n.t('No spam. Unsubscribe anytime.', 'لا بريد عشوائي. إلغاء الاشتراك في أي وقت.') }}
              </p>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <div class="text-center mt-12">
          <button (click)="router.navigate(['/insights'])" class="inline-flex items-center gap-2 px-8 py-3 bg-th-card border-2 border-th-border rounded-xl font-medium text-th-text-2 hover:border-primary hover:text-primary transition-all">
            {{ i18n.t('View All Insights', 'عرض جميع الرؤى') }}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class InsightsSectionComponent {
  i18n = inject(I18nService);
  router = inject(Router);

  latestInsights: Insight[] = [
    {
      id: '1',
      title: {
        en: 'AI Adoption in Saudi Government: A Maturity Assessment',
        ar: 'اعتماد الذكاء الاصطناعي في الحكومة السعودية: تقييم النضج'
      },
      excerpt: {
        en: 'Analysis of AI implementation across 50+ government entities reveals accelerating adoption with focus on citizen services and operational efficiency.',
        ar: 'يكشف تحليل تنفيذ الذكاء الاصطناعي عبر أكثر من 50 جهة حكومية عن تسارع الاعتماد مع التركيز على خدمات المواطنين والكفاءة التشغيلية.'
      },
      category: { en: 'Artificial Intelligence', ar: 'الذكاء الاصطناعي' },
      author: 'Dr. Sarah Ibrahim',
      date: 'Jan 15, 2024',
      readTime: '8 min read',
      type: 'whitepaper'
    },
    {
      id: '2',
      title: {
        en: 'Zero Trust Implementation: Lessons from Saudi Financial Sector',
        ar: 'تنفيذ Zero Trust: دروس من القطاع المالي السعودي'
      },
      excerpt: {
        en: 'Case studies from 10 major banks show 94% reduction in security incidents after Zero Trust adoption. Key success factors and implementation roadmap included.',
        ar: 'تُظهر دراسات الحالة من 10 بنوك كبرى انخفاضًا بنسبة 94٪ في الحوادث الأمنية بعد اعتماد Zero Trust.'
      },
      category: { en: 'Cybersecurity', ar: 'الأمن السيبراني' },
      author: 'Mohammed Al-Harbi',
      date: 'Jan 10, 2024',
      readTime: '12 min read',
      type: 'article'
    },
    {
      id: '3',
      title: {
        en: 'Cloud Migration Strategies for Healthcare Providers',
        ar: 'استراتيجيات الترحيل السحابي لمقدمي الرعاية الصحية'
      },
      excerpt: {
        en: 'Comprehensive guide covering HIPAA compliance, data sovereignty, and hybrid cloud architectures tailored for Saudi healthcare regulations.',
        ar: 'دليل شامل يغطي امتثال HIPAA وسيادة البيانات وهياكل السحابة الهجينة المصممة خصيصًا للوائح الرعاية الصحية السعودية.'
      },
      category: { en: 'Cloud Computing', ar: 'الحوسبة السحابية' },
      author: 'Fatima Al-Zahrani',
      date: 'Jan 5, 2024',
      readTime: '15 min read',
      type: 'whitepaper'
    }
  ];

  getTypeGradient(type: string): string {
    const gradients: { [key: string]: string } = {
      'article': 'from-sky-400 to-blue-500',
      'whitepaper': 'from-indigo-400 to-purple-500',
      'case-study': 'from-emerald-400 to-teal-500',
      'video': 'from-amber-400 to-orange-500'
    };
    return gradients[type] || 'from-th-text-3 to-th-bg-alt0';
  }
}