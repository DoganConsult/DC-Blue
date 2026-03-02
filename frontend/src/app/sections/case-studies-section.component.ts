import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../core/services/i18n.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-studies-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 lg:py-32 px-6 lg:px-8 bg-th-bg-alt" id="case-studies">
      <div class="container mx-auto max-w-6xl">
        <div class="max-w-2xl mb-12">
          <p class="text-[13px] font-semibold text-primary tracking-widest uppercase mb-4">{{ i18n.t('Case Studies', 'دراسات حالة') }}</p>
          <h2 class="text-3xl lg:text-4xl font-bold text-th-text tracking-tight mb-4">
            {{ i18n.t('Proven Results Across Industries', 'نتائج مثبتة عبر الصناعات') }}
          </h2>
          <p class="text-lg text-th-text-3 leading-relaxed">
            {{ i18n.t('Real transformations delivered for leading organizations in Saudi Arabia.', 'تحولات حقيقية للمنظمات الرائدة في المملكة العربية السعودية.') }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2 mb-10">
          <button (click)="selectedIndustry = 'all'"
                  class="px-4 py-2 rounded-lg text-[13px] font-medium transition-all border"
                  [class.bg-primary]="selectedIndustry === 'all'" [class.text-white]="selectedIndustry === 'all'" [class.border-primary]="selectedIndustry === 'all'" [class.shadow-sm]="selectedIndustry === 'all'"
                  [class.bg-th-card]="selectedIndustry !== 'all'" [class.text-th-text-3]="selectedIndustry !== 'all'" [class.border-th-border]="selectedIndustry !== 'all'">
            {{ i18n.t('All', 'الكل') }}
          </button>
          @for (ind of industries; track ind.id) {
            <button (click)="selectedIndustry = ind.id"
                    class="px-4 py-2 rounded-lg text-[13px] font-medium transition-all border"
                    [class.bg-primary]="selectedIndustry === ind.id" [class.text-white]="selectedIndustry === ind.id" [class.border-primary]="selectedIndustry === ind.id" [class.shadow-sm]="selectedIndustry === ind.id"
                    [class.bg-th-card]="selectedIndustry !== ind.id" [class.text-th-text-3]="selectedIndustry !== ind.id" [class.border-th-border]="selectedIndustry !== ind.id">
              {{ i18n.t(ind.name.en, ind.name.ar) }}
            </button>
          }
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (cs of getFilteredCaseStudies(); track cs.id) {
            <div class="bg-th-card rounded-xl border border-th-border overflow-hidden hover:border-primary/30 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div class="p-6">
                <div class="flex items-center gap-2 mb-4">
                  <span class="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-[11px] font-medium">{{ i18n.t(cs.client.industry.en, cs.client.industry.ar) }}</span>
                  <span class="px-2.5 py-1 bg-th-bg-alt text-th-text-3 rounded-md text-[11px]">{{ i18n.t(cs.duration.en, cs.duration.ar) }}</span>
                </div>
                <h3 class="font-semibold text-th-text text-lg mb-2">{{ i18n.t(cs.client.name.en, cs.client.name.ar) }}</h3>
                <p class="text-sm text-th-text-3 leading-relaxed mb-4 line-clamp-2">{{ i18n.t(cs.challenge.en, cs.challenge.ar) }}</p>

                <div class="grid grid-cols-2 gap-3 mb-4">
                  @for (result of cs.results.slice(0, 2); track result.metric.en) {
                    <div class="bg-gradient-to-br from-th-bg-alt to-sky-50/50 rounded-lg p-3 border border-th-border-lt">
                      <div class="text-lg font-bold text-primary">{{ i18n.t(result.value.en, result.value.ar) }}</div>
                      <div class="text-[11px] text-th-text-3">{{ i18n.t(result.metric.en, result.metric.ar) }}</div>
                    </div>
                  }
                </div>

                <div class="flex flex-wrap gap-1">
                  @for (tech of cs.technologies.slice(0, 3); track tech) {
                    <span class="px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-[11px] font-medium">{{ tech }}</span>
                  }
                  @if (cs.technologies.length > 3) {
                    <span class="px-2 py-0.5 bg-th-bg-alt text-th-text-3 rounded text-[11px]">+{{ cs.technologies.length - 3 }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class CaseStudiesSectionComponent {
  i18n = inject(I18nService);
  router = inject(Router);
  selectedIndustry = 'all';

  industries = [
    { id: 'healthcare', name: { en: 'Healthcare', ar: 'الرعاية الصحية' } },
    { id: 'finance', name: { en: 'Finance', ar: 'المالية' } },
    { id: 'energy', name: { en: 'Energy', ar: 'الطاقة' } },
    { id: 'entertainment', name: { en: 'Entertainment', ar: 'الترفيه' } },
    { id: 'telecom', name: { en: 'Telecom', ar: 'الاتصالات' } },
  ];

  caseStudies = [
    {
      id: 'healthcare-01', industryId: 'healthcare',
      client: { name: { en: 'Major Healthcare Provider', ar: 'مزود رعاية صحية رئيسي' }, industry: { en: 'Healthcare', ar: 'الرعاية الصحية' } },
      challenge: { en: 'Legacy systems across a hospital network needed modernization to support Vision 2030 healthcare goals', ar: 'الأنظمة القديمة عبر شبكة المستشفيات تحتاج إلى التحديث لدعم أهداف رؤية 2030' },
      solution: { en: 'Unified health information exchange with HL7 FHIR standards, cloud migration, and AI-powered analytics', ar: 'منصة موحدة لتبادل المعلومات الصحية مع معايير HL7 FHIR والترحيل السحابي' },
      results: [
        { metric: { en: 'Wait Time', ar: 'وقت الانتظار' }, value: { en: '-68%', ar: '-68%' }, icon: 'down' as const },
        { metric: { en: 'System Uptime', ar: 'وقت التشغيل' }, value: { en: '99.99%', ar: '99.99%' }, icon: 'up' as const },
      ],
      technologies: ['HL7 FHIR', 'AWS Cloud', 'Kubernetes', 'AI/ML', 'Oracle Health'],
      duration: { en: '18 months', ar: '18 شهر' },
    },
    {
      id: 'finance-01', industryId: 'finance',
      client: { name: { en: 'Leading Financial Institution', ar: 'مؤسسة مالية رائدة' }, industry: { en: 'Finance', ar: 'المالية' } },
      challenge: { en: 'Required Zero Trust security architecture to protect critical financial infrastructure', ar: 'يتطلب بنية أمان Zero Trust لحماية البنية التحتية المالية الحرجة' },
      solution: { en: 'Comprehensive Zero Trust framework with microsegmentation, SIEM/SOAR, and 24/7 SOC', ar: 'إطار Zero Trust شامل مع التقسيم الدقيق و SIEM/SOAR و SOC' },
      results: [
        { metric: { en: 'Security Incidents', ar: 'الحوادث الأمنية' }, value: { en: '-94%', ar: '-94%' }, icon: 'down' as const },
        { metric: { en: 'Compliance', ar: 'الامتثال' }, value: { en: '100%', ar: '100%' }, icon: 'check' as const },
      ],
      technologies: ['Palo Alto', 'Splunk', 'CrowdStrike', 'HashiCorp Vault'],
      duration: { en: '12 months', ar: '12 شهر' },
    },
    {
      id: 'energy-01', industryId: 'energy',
      client: { name: { en: 'National Energy Company', ar: 'شركة طاقة وطنية' }, industry: { en: 'Energy', ar: 'الطاقة' } },
      challenge: { en: 'Monitor thousands of IoT sensors across industrial sites for predictive maintenance', ar: 'مراقبة آلاف أجهزة استشعار IoT عبر المواقع الصناعية للصيانة التنبؤية' },
      solution: { en: 'Edge computing platform with real-time analytics and ML-based failure prediction', ar: 'منصة حوسبة حافة مع تحليلات في الوقت الفعلي والتنبؤ بالفشل' },
      results: [
        { metric: { en: 'Downtime', ar: 'وقت التوقف' }, value: { en: '-76%', ar: '-76%' }, icon: 'down' as const },
        { metric: { en: 'Maintenance Cost', ar: 'تكلفة الصيانة' }, value: { en: '-45%', ar: '-45%' }, icon: 'down' as const },
      ],
      technologies: ['Azure IoT', 'Apache Kafka', 'TensorFlow', 'Grafana'],
      duration: { en: '24 months', ar: '24 شهر' },
    },
    {
      id: 'entertainment-01', industryId: 'entertainment',
      client: { name: { en: 'Entertainment Platform', ar: 'منصة ترفيهية' }, industry: { en: 'Entertainment', ar: 'الترفيه' } },
      challenge: { en: 'Scale platform to handle hundreds of thousands of concurrent users during live events', ar: 'توسيع المنصة للتعامل مع مئات الآلاف من المستخدمين المتزامنين خلال الفعاليات الحية' },
      solution: { en: 'Auto-scaling cloud infrastructure with CDN optimization and real-time streaming', ar: 'بنية سحابية قابلة للتطوير تلقائيًا مع تحسين CDN والبث المباشر' },
      results: [
        { metric: { en: 'Uptime', ar: 'وقت التشغيل' }, value: { en: '100%', ar: '100%' }, icon: 'check' as const },
        { metric: { en: 'User Capacity', ar: 'سعة المستخدم' }, value: { en: '10x', ar: '10x' }, icon: 'up' as const },
      ],
      technologies: ['AWS', 'CloudFlare', 'WebRTC', 'React Native'],
      duration: { en: '6 months', ar: '6 أشهر' },
    },
    {
      id: 'telecom-01', industryId: 'telecom',
      client: { name: { en: 'Major Telecom Operator', ar: 'مشغل اتصالات رئيسي' }, industry: { en: 'Telecom', ar: 'الاتصالات' } },
      challenge: { en: 'Accelerate 5G rollout across multiple cities while maintaining network quality', ar: 'تسريع نشر 5G عبر عدة مدن مع الحفاظ على جودة الشبكة' },
      solution: { en: 'Automated 5G deployment framework with AI-driven RF optimization', ar: 'إطار نشر 5G آلي مع تحسين الترددات الراديوية بالذكاء الاصطناعي' },
      results: [
        { metric: { en: 'Rollout Speed', ar: 'سرعة النشر' }, value: { en: '3x', ar: '3x' }, icon: 'up' as const },
        { metric: { en: 'Coverage', ar: 'التغطية' }, value: { en: '98%', ar: '98%' }, icon: 'check' as const },
      ],
      technologies: ['Ericsson', 'Nokia', 'Azure', 'Python ML'],
      duration: { en: '18 months', ar: '18 شهر' },
    },
  ];

  getFilteredCaseStudies() {
    if (this.selectedIndustry === 'all') return this.caseStudies;
    return this.caseStudies.filter(cs => cs.industryId === this.selectedIndustry);
  }
}
