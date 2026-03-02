import { Component, inject, OnInit } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { SeoService } from '../core/services/seo.service';
import { SbgHeroComponent } from '../components/sbg-hero.component';
import { ConsultationFormComponent } from '../components/consultation-form.component';

@Component({
  selector: 'sbg-contact',
  standalone: true,
  imports: [SbgHeroComponent, ConsultationFormComponent],
  template: `
    <sbg-hero
      [title]="i18n.t('Request a Consultation', 'طلب استشارة')"
      [subtitle]="i18n.t(
        'Our enterprise solutions team will help you identify the right platform for your organization.',
        'سيساعدك فريق الحلول المؤسسية لدينا في تحديد المنصة المناسبة لمؤسستك.'
      )"
      [compact]="true"
    />

    <section class="sbg-section bg-white">
      <div class="sbg-container">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Form -->
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold text-sbg-navy mb-6">{{ i18n.t('Tell Us About Your Needs', 'أخبرنا عن احتياجاتك') }}</h2>
            <sbg-consultation-form />
          </div>

          <!-- Contact Info Sidebar -->
          <div class="space-y-8">
            <div>
              <h3 class="text-lg font-bold text-sbg-navy mb-4">{{ i18n.t('Contact Information', 'معلومات التواصل') }}</h3>
              <div class="space-y-4">
                @for (info of contactInfo; track info.label) {
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-sbg-blue/10 flex items-center justify-center text-sbg-blue flex-shrink-0">
                      <span class="text-lg">{{ info.icon }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-sbg-gray-500">{{ i18n.t(info.label, info.labelAr) }}</p>
                      <p class="text-sbg-gray-800 font-medium">{{ info.value }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="bg-sbg-gray-50 rounded-xl p-6 border border-sbg-gray-200">
              <h3 class="text-lg font-bold text-sbg-navy mb-3">{{ i18n.t('What Happens Next', 'ماذا يحدث بعد ذلك') }}</h3>
              <div class="space-y-3">
                @for (step of nextSteps; track step.num) {
                  <div class="flex gap-3 items-start">
                    <div class="w-6 h-6 rounded-full sbg-gradient-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {{ step.num }}
                    </div>
                    <p class="text-sm text-sbg-gray-600">{{ i18n.t(step.en, step.ar) }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactPage implements OnInit {
  i18n = inject(I18nService);
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      titleEn: 'Request a Consultation',
      titleAr: 'طلب استشارة',
      descEn: 'Contact our enterprise solutions team for a free consultation.',
      descAr: 'تواصل مع فريق الحلول المؤسسية للحصول على استشارة مجانية.',
    });
  }

  contactInfo = [
    { icon: '📍', label: 'Location', labelAr: 'الموقع', value: 'Riyadh, Saudi Arabia | الرياض' },
    { icon: '📧', label: 'Email', labelAr: 'البريد الإلكتروني', value: 'info@doganconsult.com' },
    { icon: '📱', label: 'Phone', labelAr: 'الهاتف', value: '+966 xx xxx xxxx' },
  ];

  nextSteps = [
    { num: 1, en: 'Our team reviews your request within 24 hours.', ar: 'يراجع فريقنا طلبك خلال 24 ساعة.' },
    { num: 2, en: 'A solutions expert contacts you for a discovery call.', ar: 'يتواصل معك خبير حلول لإجراء مكالمة استكشافية.' },
    { num: 3, en: 'We deliver a tailored proposal with timeline and pricing.', ar: 'نقدم لك عرضاً مخصصاً مع جدول زمني وتسعير.' },
  ];
}
