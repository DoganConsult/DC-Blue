import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { SeoService } from '../core/services/seo.service';
import { SbgHeroComponent } from '../components/sbg-hero.component';

@Component({
  selector: 'sbg-enterprise',
  standalone: true,
  imports: [SbgHeroComponent, RouterLink],
  template: `
    <sbg-hero
      [title]="i18n.t('Enterprise Solutions', 'حلول المؤسسات')"
      [subtitle]="i18n.t(
        'Governed automation, scalable operations, and enterprise-grade compliance — designed for organizations that demand control.',
        'أتمتة محكومة وعمليات قابلة للتوسع وامتثال بمستوى المؤسسات — مصممة للمنظمات التي تتطلب السيطرة.'
      )"
      [badge]="i18n.t('Enterprise-Grade', 'بمستوى مؤسسي')"
      [ctaText]="i18n.t('Talk to an Expert', 'تحدث مع خبير')"
      ctaLink="/contact"
      [compact]="true"
    />

    <!-- Enterprise Benefits -->
    <section class="sbg-section bg-white">
      <div class="sbg-container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-sbg-navy mb-4">
            {{ i18n.t('Built for Enterprise Control', 'مصممة للسيطرة المؤسسية') }}
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (item of benefits; track item.icon) {
            <div class="bg-sbg-gray-50 rounded-xl p-6 border border-sbg-gray-200 hover:shadow-lg transition-shadow">
              <span class="text-3xl mb-4 block">{{ item.icon }}</span>
              <h3 class="text-lg font-bold text-sbg-navy mb-2">{{ i18n.t(item.en, item.ar) }}</h3>
              <p class="text-sbg-gray-500 text-sm leading-relaxed">{{ i18n.t(item.descEn, item.descAr) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Comparison Table -->
    <section class="sbg-section bg-sbg-gray-50">
      <div class="sbg-container max-w-4xl">
        <h2 class="text-3xl font-bold text-sbg-navy mb-10 text-center">
          {{ i18n.t('Why Choose SBG Enterprise', 'لماذا تختار SBG للمؤسسات') }}
        </h2>
        <div class="bg-white rounded-xl border border-sbg-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="sbg-gradient-navy text-white">
                <th class="text-start p-4 font-semibold">{{ i18n.t('Capability', 'القدرة') }}</th>
                <th class="text-center p-4 font-semibold text-sbg-gold">{{ i18n.t('SBG', 'بوابة الأعمال') }}</th>
                <th class="text-center p-4 font-semibold">{{ i18n.t('Traditional', 'التقليدي') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (row of comparison; track row.en) {
                <tr class="border-t border-sbg-gray-200">
                  <td class="p-4 text-sbg-gray-700 font-medium">{{ i18n.t(row.en, row.ar) }}</td>
                  <td class="p-4 text-center text-sbg-emerald font-bold">✓</td>
                  <td class="p-4 text-center text-sbg-gray-400">{{ row.trad }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="sbg-section bg-gradient-to-r from-sbg-blue to-sbg-blue-dark text-white">
      <div class="sbg-container text-center">
        <h2 class="text-3xl font-bold mb-4">
          {{ i18n.t('Transform Your Enterprise Operations', 'حوّل عمليات مؤسستك') }}
        </h2>
        <p class="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
          {{ i18n.t(
            'Discover how governed automation and compliance-ready platforms can reduce risk and accelerate growth.',
            'اكتشف كيف يمكن للأتمتة المحكومة والمنصات الجاهزة للامتثال تقليل المخاطر وتسريع النمو.'
          ) }}
        </p>
        <a routerLink="/contact"
           class="inline-flex px-8 py-3.5 rounded-xl bg-white text-sbg-blue font-bold text-lg hover:bg-sbg-gray-50 transition-colors">
          {{ i18n.t('Request Enterprise Consultation', 'طلب استشارة مؤسسية') }}
        </a>
      </div>
    </section>
  `,
})
export class EnterprisePage implements OnInit {
  i18n = inject(I18nService);
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      titleEn: 'Enterprise Solutions',
      titleAr: 'حلول المؤسسات',
      descEn: 'Governed automation, scalable operations, and enterprise-grade compliance for organizations that demand control.',
      descAr: 'أتمتة محكومة وعمليات قابلة للتوسع وامتثال بمستوى المؤسسات.',
    });
  }

  benefits = [
    { icon: '🏢', en: 'Full Ownership', ar: 'ملكية كاملة', descEn: 'You own your data, processes, and compliance artifacts — no vendor lock-in.', descAr: 'أنت تمتلك بياناتك وعملياتك ووثائق الامتثال — بدون تقييد بمورد.' },
    { icon: '📊', en: 'Enterprise SLAs', ar: 'اتفاقيات مستوى خدمة مؤسسية', descEn: '99.9% uptime guarantee with dedicated support and escalation paths.', descAr: 'ضمان وقت تشغيل 99.9٪ مع دعم مخصص ومسارات تصعيد.' },
    { icon: '🔒', en: 'Audit-Friendly', ar: 'صديق للتدقيق', descEn: 'Every action is evidenced and traceable — ready for any authority inspection.', descAr: 'كل إجراء موثق وقابل للتتبع — جاهز لأي تفتيش من الجهات الرقابية.' },
    { icon: '⚖️', en: 'Vendor-Neutral', ar: 'محايد تجاه الموردين', descEn: 'Microsoft-aligned but not locked — integrate with your existing stack.', descAr: 'متوافق مع مايكروسوفت لكن غير مقيد — تكامل مع بنيتك الحالية.' },
    { icon: '📈', en: 'Scalable Architecture', ar: 'بنية قابلة للتوسع', descEn: 'Multi-tenant, event-driven architecture scales with your growth.', descAr: 'بنية متعددة المستأجرين وقائمة على الأحداث تتوسع مع نموك.' },
    { icon: '🤝', en: 'Dedicated Escalation', ar: 'تصعيد مخصص', descEn: 'Named account manager with direct escalation to engineering.', descAr: 'مدير حساب مسمى مع تصعيد مباشر للفريق الهندسي.' },
  ];

  comparison = [
    { en: 'Governance enforcement', ar: 'إنفاذ الحوكمة', trad: '✗' },
    { en: 'Evidence-first compliance', ar: 'امتثال قائم على الأدلة', trad: '✗' },
    { en: 'Saudi regulatory packs', ar: 'حزم تنظيمية سعودية', trad: '✗' },
    { en: 'Stage gate control', ar: 'التحكم ببوابات المراحل', trad: '~' },
    { en: 'Multi-tenant isolation', ar: 'عزل متعدد المستأجرين', trad: '~' },
    { en: 'Audit-ready exports', ar: 'تصدير جاهز للتدقيق', trad: '✗' },
    { en: 'Microsoft-aligned security', ar: 'أمن متوافق مع مايكروسوفت', trad: '~' },
    { en: 'Saudi-based support', ar: 'دعم محلي سعودي', trad: '✗' },
  ];
}
