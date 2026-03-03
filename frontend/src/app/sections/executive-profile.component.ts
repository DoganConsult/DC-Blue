import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { CONTACT_INFO } from '../core/data/site-content';
import { EXEC_STAT_GRADIENTS, CAREER_DOT_COLORS, CAREER_COMPANY_COLORS } from '../core/data/page-styles';

@Component({
  selector: 'app-executive-profile',
  standalone: true,
  imports: [RouterModule],
  template: `
    <section class="relative py-12 sm:py-24 bg-gradient-to-br from-surface-dark via-brand-dark to-surface-dark overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute inset-0 opacity-20" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.05&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
        <div class="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-0 left-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="text-center mb-16">
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div class="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-xl">
                <svg class="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="text-white font-bold text-sm">{{ i18n.t('KSA PREMIUM RESIDENT', 'مقيم متميز في السعودية') }}</span>
              </div>
            </div>
          </div>

          <div class="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span class="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {{ i18n.t('Executive Leadership', 'القيادة التنفيذية') }}
            </span>
          </div>
          <h2 class="text-5xl font-bold text-white mb-6">
            {{ i18n.t('Ahmet Doğan', 'أحمد دوغان') }}
            <span class="block text-3xl mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {{ i18n.t('Sales Director & Strategic Consultant', 'مدير مبيعات ومستشار استراتيجي') }}
            </span>
          </h2>
          <p class="text-xl text-th-text-3 max-w-3xl mx-auto">
            {{ i18n.t('Two decades of industry expertise uniting technical mastery with strategic excellence', 'عقدان من الخبرة الصناعية تجمع بين الإتقان التقني والتميز الاستراتيجي') }}
          </p>
        </div>

        <div class="grid md:grid-cols-4 gap-6 mb-16">
          @for (stat of stats; track stat.label.en) {
            <div class="bg-th-card/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all">
              <div class="text-4xl font-bold bg-clip-text text-transparent mb-2" [class]="stat.gradientClass">
                {{ stat.value }}
              </div>
              <div class="text-th-text-3">{{ i18n.t(stat.label.en, stat.label.ar) }}</div>
            </div>
          }
        </div>

        <div class="grid lg:grid-cols-2 gap-12">
          <div class="space-y-8">
            <div class="bg-th-card/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
                <svg class="w-8 h-8 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                {{ i18n.t('Career Trajectory', 'المسار المهني') }}
              </h3>

              <div class="space-y-6">
                @for (role of careerRoles; track role.title.en) {
                  <div class="relative pl-8 border-l-2 border-blue-500/30" [class.border-l-0]="$last">
                    <div class="absolute -left-2 top-0 w-4 h-4 rounded-full" [class]="role.dotColor"></div>
                    <div [class.mb-4]="!$last">
                      <h4 class="text-lg font-semibold text-white">{{ i18n.t(role.title.en, role.title.ar) }}</h4>
                      <p [class]="role.companyColor">{{ i18n.t(role.company.en, role.company.ar) }}</p>
                      <p class="text-th-text-3 text-sm">{{ role.period }}</p>
                      <p class="text-th-text-3 mt-2">{{ i18n.t(role.description.en, role.description.ar) }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="space-y-8">
            <div class="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-8 border border-yellow-500/30">
              <h3 class="text-2xl font-bold text-white mb-4 flex items-center">
                <svg class="w-8 h-8 mr-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                {{ i18n.t('Premium Residency Qualifications', 'مؤهلات الإقامة المتميزة') }}
              </h3>
              <p class="text-th-text-3 mb-4">
                {{ i18n.t('Elite engineering credentials, international recognition, and proven leadership make a compelling case for premium residency in Saudi Arabia.', 'شهادات هندسية عالية ومعرفة دولية وقيادة مثبتة تشكل حالة مقنعة للإقامة المتميزة في المملكة العربية السعودية.') }}
              </p>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-th-card/10 rounded-lg p-4">
                  <div class="text-2xl font-bold text-yellow-400">SCE</div>
                  <div class="text-sm text-th-text-3">{{ i18n.t('Consultant Engineer', 'مهندس استشاري') }}</div>
                </div>
                <div class="bg-th-card/10 rounded-lg p-4">
                  <div class="text-2xl font-bold text-yellow-400">17</div>
                  <div class="text-sm text-th-text-3">{{ i18n.t('Licensed Activities', 'نشاط مرخص') }}</div>
                </div>
              </div>
            </div>

            <div class="bg-th-card/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
                <svg class="w-8 h-8 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ i18n.t('Global Recognition', 'الاعتراف العالمي') }}
              </h3>

              <div class="space-y-4">
                @for (item of recognitions; track item.title.en) {
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-2 h-2 mt-2 bg-purple-500 rounded-full"></div>
                    <div class="ml-4">
                      <div class="font-semibold text-white">{{ i18n.t(item.title.en, item.title.ar) }}</div>
                      <div class="text-th-text-3 text-sm">{{ i18n.t(item.subtitle.en, item.subtitle.ar) }}</div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
              <h3 class="text-2xl font-bold text-white mb-4">{{ i18n.t('Ready to Transform Your Business?', 'هل أنت مستعد لتحويل أعمالك؟') }}</h3>
              <p class="text-blue-100 mb-6">
                {{ i18n.t('Connect with a consultant who delivers results that exceed Big 4 standards', 'تواصل مع مستشار يقدم نتائج تتجاوز معايير الاستشارات الكبرى') }}
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a routerLink="/inquiry" class="inline-flex items-center justify-center px-6 py-3 bg-th-card text-blue-600 rounded-lg font-semibold hover:bg-th-bg-tert transition-colors">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  {{ i18n.t('Request Consultation', 'طلب استشارة') }}
                </a>
                <a [href]="contactInfo.linkedin" target="_blank" class="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  {{ i18n.t('LinkedIn Profile', 'ملف لينكد إن') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob { animation: blob 7s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
  `]
})
export class ExecutiveProfileComponent {
  i18n = inject(I18nService);
  contactInfo = CONTACT_INFO;

  stats = [
    { value: '20+', label: { en: 'Years of Excellence', ar: 'سنوات من التميز' }, gradientClass: EXEC_STAT_GRADIENTS[0] },
    { value: 'SAR 125M', label: { en: 'Annual Bookings', ar: 'الحجوزات السنوية' }, gradientClass: EXEC_STAT_GRADIENTS[1] },
    { value: '5x', label: { en: 'Profit Growth', ar: 'نمو الأرباح' }, gradientClass: EXEC_STAT_GRADIENTS[2] },
    { value: '#1', label: { en: 'Regional Performance', ar: 'الأداء الإقليمي' }, gradientClass: EXEC_STAT_GRADIENTS[3] },
  ];

  careerRoles = [
    {
      title: { en: 'Sales Director', ar: 'مدير المبيعات' },
      company: { en: 'InfoTech Abdullah Fouad Group', ar: 'إنفوتك مجموعة عبدالله فؤاد' },
      period: 'Dec 2024 – Present',
      description: { en: 'Overseeing P&L for government, telecom, and enterprise sectors. Implementing national strategies aligned with Vision 2030.', ar: 'الإشراف على الأرباح والخسائر للقطاعات الحكومية والاتصالات والمؤسسات. تنفيذ استراتيجيات وطنية متوافقة مع رؤية 2030.' },
      dotColor: CAREER_DOT_COLORS[0],
      companyColor: CAREER_COMPANY_COLORS[0],
    },
    {
      title: { en: 'Regional Manager, Western Region', ar: 'مدير المنطقة الغربية' },
      company: { en: 'Abdullah Fouad Group', ar: 'مجموعة عبدالله فؤاد' },
      period: 'Jan 2024 – Dec 2024',
      description: { en: 'Propelled region to #1 nationally: SAR 125M bookings, SAR 110M collections, 5x profit increase.', ar: 'دفع المنطقة لتكون الأولى وطنياً: 125 مليون ريال حجوزات، 110 مليون ريال تحصيلات، 5 أضعاف نمو في الأرباح.' },
      dotColor: CAREER_DOT_COLORS[1],
      companyColor: CAREER_COMPANY_COLORS[1],
    },
    {
      title: { en: 'Senior Product Manager', ar: 'مدير منتجات أول' },
      company: { en: 'Ingram Micro - Oracle Portfolio', ar: 'إنجرام مايكرو - محفظة أوراكل' },
      period: 'Sep 2022 – Dec 2023',
      description: { en: 'Maintained #1 Oracle distributor status in KSA. Expanded partner pipeline by 25%.', ar: 'الحفاظ على المركز الأول كموزع لأوراكل في السعودية. توسيع خط الشركاء بنسبة 25٪.' },
      dotColor: CAREER_DOT_COLORS[2],
      companyColor: CAREER_COMPANY_COLORS[2],
    },
    {
      title: { en: 'ICT Business Unit Manager & PMO Head', ar: 'مدير وحدة أعمال تقنية المعلومات ورئيس PMO' },
      company: { en: 'Gulf Group (Kuwait & KSA)', ar: 'مجموعة الخليج (الكويت والسعودية)' },
      period: '2016 – 2022',
      description: { en: 'Established and led ICT Business Unit across Kuwait and Saudi Arabia.', ar: 'تأسيس وقيادة وحدة أعمال تقنية المعلومات في الكويت والسعودية.' },
      dotColor: CAREER_DOT_COLORS[3],
      companyColor: CAREER_COMPANY_COLORS[3],
    },
  ];

  recognitions = [
    { title: { en: 'Stanford Advanced Security', ar: 'أمان متقدم من ستانفورد' }, subtitle: { en: 'Among ~1,000 global cybersecurity experts', ar: 'ضمن حوالي 1,000 خبير أمن سيبراني عالمي' } },
    { title: { en: 'RCDD® Certified', ar: 'معتمد RCDD®' }, subtitle: { en: '~20,000 certified globally', ar: 'حوالي 20,000 معتمد عالمياً' } },
    { title: { en: 'Uptime Institute AOS', ar: 'معهد Uptime AOS' }, subtitle: { en: 'Mission-critical infrastructure expertise', ar: 'خبرة في البنية التحتية ذات المهام الحرجة' } },
    { title: { en: 'Triple ISACA Certified', ar: 'معتمد ISACA ثلاثي' }, subtitle: { en: 'CISA®, CISM®, CRISC® - Complete security suite', ar: 'CISA® و CISM® و CRISC® - مجموعة أمان كاملة' } },
  ];
}
