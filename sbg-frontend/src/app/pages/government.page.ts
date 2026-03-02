import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { SeoService } from '../core/services/seo.service';
import { SbgHeroComponent } from '../components/sbg-hero.component';

@Component({
  selector: 'sbg-government',
  standalone: true,
  imports: [SbgHeroComponent, RouterLink],
  template: `
    <sbg-hero
      [title]="i18n.t('Government Digital Solutions', 'الحلول الرقمية الحكومية')"
      [subtitle]="i18n.t(
        'Purpose-built platforms for Saudi government entities — DGA-compliant, NCA-aligned, PDPL-ready, Vision 2030 enabled.',
        'منصات مصممة خصيصاً للجهات الحكومية السعودية — متوافقة مع هيئة الحكومة الرقمية، ومتسقة مع الهيئة الوطنية للأمن السيبراني، وجاهزة لنظام حماية البيانات الشخصية، وممكّنة لرؤية 2030.'
      )"
      [badge]="i18n.t('Government-Grade', 'بمستوى حكومي')"
      [ctaText]="i18n.t('Request Government Consultation', 'طلب استشارة حكومية')"
      ctaLink="/contact"
    />

    <!-- Why SBG for Government -->
    <section class="sbg-section bg-white">
      <div class="sbg-container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-sbg-navy mb-4">
            {{ i18n.t('Why Saudi Business Gate for Government', 'لماذا بوابة الأعمال السعودية للقطاع الحكومي') }}
          </h2>
          <p class="text-sbg-gray-500 max-w-3xl mx-auto">
            {{ i18n.t(
              'Government entities require solutions that meet strict regulatory standards while enabling digital transformation. SBG delivers governance-enforced platforms with full audit readiness.',
              'تتطلب الجهات الحكومية حلولاً تلبي المعايير التنظيمية الصارمة مع تمكين التحول الرقمي. تقدم بوابة الأعمال السعودية منصات محكومة مع جاهزية كاملة للتدقيق.'
            ) }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (item of govBenefits; track item.icon) {
            <div class="bg-sbg-gray-50 rounded-xl p-6 border border-sbg-gray-200 hover:border-sbg-gold/40 transition-colors">
              <span class="text-3xl mb-4 block">{{ item.icon }}</span>
              <h3 class="text-lg font-bold text-sbg-navy mb-2">{{ i18n.t(item.en, item.ar) }}</h3>
              <p class="text-sbg-gray-500 text-sm leading-relaxed">{{ i18n.t(item.descEn, item.descAr) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Engagement Model -->
    <section class="sbg-section bg-sbg-gray-50">
      <div class="sbg-container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-sbg-navy mb-4">
            {{ i18n.t('Engagement Model', 'نموذج التعامل') }}
          </h2>
          <p class="text-sbg-gray-500 max-w-2xl mx-auto">
            {{ i18n.t(
              'A structured, phased approach ensuring controlled delivery and measurable outcomes.',
              'نهج منظم ومتدرج يضمن تسليماً محكوماً ونتائج قابلة للقياس.'
            ) }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (phase of engagementPhases; track phase.num) {
            <div class="relative bg-white rounded-xl p-6 border border-sbg-gray-200 text-center">
              <div class="w-12 h-12 mx-auto rounded-full sbg-gradient-gold flex items-center justify-center text-white font-bold text-lg mb-4">
                {{ phase.num }}
              </div>
              <h3 class="text-lg font-bold text-sbg-navy mb-2">{{ i18n.t(phase.en, phase.ar) }}</h3>
              <p class="text-sbg-gray-500 text-sm">{{ i18n.t(phase.descEn, phase.descAr) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Regulatory Alignment -->
    <section class="sbg-section sbg-gradient-navy text-white">
      <div class="sbg-container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            {{ i18n.t('Regulatory Alignment', 'التوافق التنظيمي') }}
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          @for (reg of regulations; track reg.code) {
            <div class="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 text-center">
              <div class="text-3xl mb-3">{{ reg.icon }}</div>
              <h3 class="text-lg font-bold text-sbg-gold mb-1">{{ reg.code }}</h3>
              <p class="text-sbg-gray-300 text-sm">{{ i18n.t(reg.en, reg.ar) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Deliverables -->
    <section class="sbg-section bg-white">
      <div class="sbg-container max-w-4xl">
        <h2 class="text-3xl md:text-4xl font-bold text-sbg-navy mb-10 text-center">
          {{ i18n.t('Key Deliverables', 'المخرجات الرئيسية') }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          @for (del of deliverables; track del.en) {
            <div class="flex items-center gap-3 bg-sbg-gray-50 rounded-lg p-4 border border-sbg-gray-200">
              <svg class="w-5 h-5 text-sbg-emerald flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="text-sbg-gray-700">{{ i18n.t(del.en, del.ar) }}</span>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="sbg-section bg-gradient-to-r from-sbg-gold to-sbg-gold-light text-sbg-navy">
      <div class="sbg-container text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          {{ i18n.t('Ready to Modernize Your Government Operations?', 'مستعد لتحديث عملياتك الحكومية؟') }}
        </h2>
        <p class="text-sbg-navy/70 max-w-2xl mx-auto mb-8 text-lg">
          {{ i18n.t(
            'Schedule a private consultation with our government solutions team.',
            'حدد موعد استشارة خاصة مع فريق الحلول الحكومية لدينا.'
          ) }}
        </p>
        <a routerLink="/contact"
           class="inline-flex px-8 py-3.5 rounded-xl bg-sbg-navy text-white font-bold text-lg hover:bg-sbg-navy-light transition-colors">
          {{ i18n.t('Request Government Consultation', 'طلب استشارة حكومية') }}
        </a>
      </div>
    </section>
  `,
})
export class GovernmentPage implements OnInit {
  i18n = inject(I18nService);
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      titleEn: 'Government Digital Solutions',
      titleAr: 'الحلول الرقمية الحكومية',
      descEn: 'DGA-compliant, NCA-aligned, PDPL-ready platforms for Saudi government entities.',
      descAr: 'منصات متوافقة مع DGA ومتسقة مع NCA وجاهزة لـ PDPL للجهات الحكومية السعودية.',
    });
  }

  govBenefits = [
    { icon: '🏛️', en: 'DGA Compliance', ar: 'امتثال هيئة الحكومة الرقمية', descEn: 'Native compliance packs with evidence mapping and authority-ready audit exports.', descAr: 'حزم امتثال أصلية مع ربط الأدلة وتصدير تدقيق جاهز للجهات الرقابية.' },
    { icon: '🔒', en: 'NCA ECC Alignment', ar: 'توافق NCA ECC', descEn: 'Essential Cybersecurity Controls embedded in platform operations and access control.', descAr: 'ضوابط الأمن السيبراني الأساسية مدمجة في عمليات المنصة والتحكم في الوصول.' },
    { icon: '📋', en: 'PDPL Ready', ar: 'جاهز لنظام حماية البيانات', descEn: 'Personal data protection governance with data mapping and consent management.', descAr: 'حوكمة حماية البيانات الشخصية مع خرائط البيانات وإدارة الموافقات.' },
    { icon: '⚡', en: 'Stage Gate Governance', ar: 'حوكمة بوابات المراحل', descEn: 'No action proceeds without approval and evidence — governance is enforced, not advisory.', descAr: 'لا يتم أي إجراء بدون موافقة وأدلة — الحوكمة منفذة وليست استشارية.' },
    { icon: '📊', en: 'Evidence-First Audit', ar: 'تدقيق قائم على الأدلة', descEn: 'Generate inspection-ready packages in hours, not weeks.', descAr: 'إنشاء حزم جاهزة للتفتيش في ساعات وليس أسابيع.' },
    { icon: '🇸🇦', en: 'Saudi Data Residency', ar: 'إقامة البيانات السعودية', descEn: 'All data hosted within Saudi Arabia with sovereign control.', descAr: 'جميع البيانات مستضافة داخل المملكة العربية السعودية مع سيادة كاملة.' },
  ];

  engagementPhases = [
    { num: 1, en: 'Discovery', ar: 'الاكتشاف', descEn: 'Requirements analysis, regulatory mapping, and readiness assessment.', descAr: 'تحليل المتطلبات والخريطة التنظيمية وتقييم الجاهزية.' },
    { num: 2, en: 'Pilot', ar: 'التجربة', descEn: 'Controlled pilot with defined scope, success criteria, and evidence.', descAr: 'تجربة محكومة بنطاق محدد ومعايير نجاح وأدلة.' },
    { num: 3, en: 'Scale', ar: 'التوسع', descEn: 'Full deployment with governance gates and compliance validation.', descAr: 'نشر كامل مع بوابات الحوكمة والتحقق من الامتثال.' },
    { num: 4, en: 'Operate', ar: 'التشغيل', descEn: 'Managed operations with SLAs, support, and continuous compliance.', descAr: 'عمليات مُدارة مع اتفاقيات مستوى الخدمة والدعم والامتثال المستمر.' },
  ];

  regulations = [
    { code: 'DGA', icon: '🏛️', en: 'Digital Government Authority', ar: 'هيئة الحكومة الرقمية' },
    { code: 'NCA ECC', icon: '🔒', en: 'National Cybersecurity Authority', ar: 'الهيئة الوطنية للأمن السيبراني' },
    { code: 'PDPL', icon: '📋', en: 'Personal Data Protection Law', ar: 'نظام حماية البيانات الشخصية' },
  ];

  deliverables = [
    { en: 'Configured governance and compliance platform', ar: 'منصة حوكمة وامتثال مهيأة' },
    { en: 'Regulatory control and evidence library', ar: 'مكتبة ضوابط تنظيمية وأدلة' },
    { en: 'Readiness dashboards and reports', ar: 'لوحات معلومات وتقارير الجاهزية' },
    { en: 'Authority-ready audit packages', ar: 'حزم تدقيق جاهزة للجهات الرقابية' },
    { en: 'Training and operational documentation', ar: 'تدريب ووثائق تشغيلية' },
    { en: 'Managed support with enterprise SLAs', ar: 'دعم مُدار مع اتفاقيات مستوى خدمة مؤسسية' },
  ];
}
