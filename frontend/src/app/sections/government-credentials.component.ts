import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../core/services/i18n.service';

interface CommercialActivity {
  code: string;
  nameEn: string;
  nameAr: string;
  icon?: string;
  category: 'construction' | 'technology' | 'consulting' | 'cloud';
}

@Component({
  selector: 'app-government-credentials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 px-4 bg-gradient-to-b from-th-card via-th-bg-alt to-th-card">
      <div class="container mx-auto max-w-7xl">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
            <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm font-medium text-emerald-700">{{ i18n.t('Official Saudi Government Registrations', 'التسجيلات الحكومية السعودية الرسمية') }}</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
            {{ i18n.t('Fully Licensed & Government Authorized', 'مرخص بالكامل ومعتمد حكومياً') }}
          </h2>
          <p class="text-lg text-th-text-2 max-w-3xl mx-auto">
            {{ i18n.t(
              'Operating with full legal compliance and official authorization from Saudi government entities',
              'نعمل بامتثال قانوني كامل وترخيص رسمي من الجهات الحكومية السعودية'
            ) }}
          </p>
        </div>

        <!-- Main Credentials Grid -->
        <div class="grid md:grid-cols-2 gap-8 mb-16">
          <!-- Commercial Registration Certificate -->
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition"></div>
            <div class="relative bg-th-card rounded-3xl shadow-xl overflow-hidden border-2 border-emerald-100">
              <!-- Header with Saudi Flag Colors -->
              <div class="h-2 bg-gradient-to-r from-green-600 via-th-card to-green-600"></div>

              <div class="p-8">
                <!-- Ministry Logo & Title -->
                <div class="flex items-start gap-4 mb-6">
                  <div class="w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg class="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-2xl font-bold text-brand-dark mb-1">
                      {{ i18n.t('Commercial Registration', 'السجل التجاري') }}
                    </h3>
                    <p class="text-sm text-th-text-2">
                      {{ i18n.t('Ministry of Commerce', 'وزارة التجارة') }}
                    </p>
                  </div>
                </div>

                <!-- Registration Details -->
                <div class="space-y-4 mb-6">
                  <div class="flex items-center justify-between p-3 bg-th-bg-alt rounded-lg">
                    <span class="text-sm font-medium text-th-text-2">{{ i18n.t('Registration Number', 'الرقم الوطني الموحد') }}</span>
                    <span class="text-lg font-bold text-brand-dark">7008903317</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-th-bg-alt rounded-lg">
                    <span class="text-sm font-medium text-th-text-2">{{ i18n.t('Issue Date', 'تاريخ الإصدار') }}</span>
                    <span class="text-lg font-semibold text-th-text">24/04/2019</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-th-bg-alt rounded-lg">
                    <span class="text-sm font-medium text-th-text-2">{{ i18n.t('Entity Type', 'نوع الكيان') }}</span>
                    <span class="text-lg font-semibold text-th-text">{{ i18n.t('Corporation', 'مؤسسة') }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span class="text-sm font-medium text-emerald-700">{{ i18n.t('Status', 'حالة السجل') }}</span>
                    <span class="inline-flex items-center gap-2">
                      <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span class="text-lg font-bold text-emerald-600">{{ i18n.t('Active', 'نشط') }}</span>
                    </span>
                  </div>
                </div>

                <!-- QR Code -->
                <div class="flex items-center justify-center p-4 bg-gradient-to-br from-th-bg-alt to-th-bg-tert rounded-xl">
                  <div class="w-32 h-32 bg-th-card p-2 rounded-lg shadow-inner">
                    <div class="w-full h-full bg-th-border rounded flex items-center justify-center">
                      <span class="text-xs text-th-text-3">QR Code</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Saudi Council of Engineers Certificate -->
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition"></div>
            <div class="relative bg-th-card rounded-3xl shadow-xl overflow-hidden border-2 border-amber-100">
              <!-- Header -->
              <div class="h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"></div>

              <div class="p-8">
                <!-- SCE Logo & Title -->
                <div class="flex items-start gap-4 mb-6">
                  <div class="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center shadow-lg">
                    <span class="text-2xl font-bold text-amber-600">SCE</span>
                  </div>
                  <div>
                    <h3 class="text-2xl font-bold text-brand-dark mb-1">
                      {{ i18n.t('Professional Accreditation', 'الاعتماد المهني') }}
                    </h3>
                    <p class="text-sm text-th-text-2">
                      {{ i18n.t('Saudi Council of Engineers', 'الهيئة السعودية للمهندسين') }}
                    </p>
                  </div>
                </div>

                <!-- Certification Details -->
                <div class="space-y-4 mb-6">
                  <div class="flex items-center justify-between p-3 bg-th-bg-alt rounded-lg">
                    <span class="text-sm font-medium text-th-text-2">{{ i18n.t('Member Number', 'رقم العضوية') }}</span>
                    <span class="text-lg font-bold text-brand-dark">303710</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-th-bg-alt rounded-lg">
                    <span class="text-sm font-medium text-th-text-2">{{ i18n.t('Professional Grade', 'الدرجة المهنية') }}</span>
                    <span class="text-lg font-semibold text-th-text">{{ i18n.t('Consultant', 'مستشار') }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-th-bg-alt rounded-lg">
                    <span class="text-sm font-medium text-th-text-2">{{ i18n.t('Specialization', 'التخصص') }}</span>
                    <span class="text-lg font-semibold text-th-text">{{ i18n.t('Electronics Engineering', 'هندسة إلكترونيات') }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <span class="text-sm font-medium text-amber-700">{{ i18n.t('Valid Until', 'صالحة حتى') }}</span>
                    <span class="text-lg font-bold text-amber-600">24 September 2026</span>
                  </div>
                </div>

                <!-- Royal Decree Compliance -->
                <div class="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                  <p class="text-xs text-th-text-2 mb-2">
                    {{ i18n.t('In accordance with Royal Decree M/36', 'وفقاً للمرسوم الملكي رقم م/36') }}
                  </p>
                  <p class="text-sm font-semibold text-th-text">
                    {{ i18n.t('Professional Accreditation Start Date', 'تاريخ بداية الاعتماد المهني') }}: 10/04/2016
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Commercial Activities Section -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-center mb-8 text-brand-dark">
            {{ i18n.t('17 Licensed Commercial Activities', '17 نشاط تجاري مرخص') }}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <!-- Construction Activities -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <h4 class="font-bold text-th-text">{{ i18n.t('Construction', 'الإنشاءات') }}</h4>
              </div>
              <ul class="space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <span class="text-blue-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Residential Buildings', 'المباني السكنية') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Commercial Buildings', 'المباني التجارية') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Prefabricated Buildings', 'المباني الجاهزة') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Renovations', 'التجديدات') }}</span>
                </li>
              </ul>
            </div>

            <!-- Technology Activities -->
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <h4 class="font-bold text-th-text">{{ i18n.t('Software & AI', 'البرمجيات والذكاء الاصطناعي') }}</h4>
              </div>
              <ul class="space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <span class="text-purple-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('AI Technologies', 'تقنيات الذكاء الاصطناعي') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-purple-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Robotics', 'الروبوتات') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-purple-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('VR/AR Technologies', 'تقنيات الواقع الافتراضي') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-purple-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('App Development', 'تطوير التطبيقات') }}</span>
                </li>
              </ul>
            </div>

            <!-- Cloud & Infrastructure -->
            <div class="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/>
                  </svg>
                </div>
                <h4 class="font-bold text-th-text">{{ i18n.t('Cloud Services', 'الخدمات السحابية') }}</h4>
              </div>
              <ul class="space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <span class="text-cyan-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Cloud Computing', 'الحوسبة السحابية') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-cyan-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Data Centers', 'مراكز البيانات') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-cyan-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Network Management', 'إدارة الشبكات') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-cyan-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Systems Integration', 'تكامل الأنظمة') }}</span>
                </li>
              </ul>
            </div>

            <!-- Consulting Services -->
            <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <h4 class="font-bold text-th-text">{{ i18n.t('Consulting', 'الاستشارات') }}</h4>
              </div>
              <ul class="space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <span class="text-emerald-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Management Consulting', 'الاستشارات الإدارية') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-emerald-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Marketing Services', 'خدمات التسويق') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-emerald-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Strategic Planning', 'التخطيط الاستراتيجي') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-emerald-500 mt-0.5">•</span>
                  <span class="text-th-text-2">{{ i18n.t('Digital Transformation', 'التحول الرقمي') }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Activity Codes Display -->
          <div class="bg-gradient-to-r from-th-bg-alt to-th-bg-tert rounded-2xl p-6">
            <p class="text-center text-sm text-th-text-2 mb-4">
              {{ i18n.t('Official ISIC Activity Codes', 'رموز الأنشطة الرسمية ISIC') }}
            </p>
            <div class="flex flex-wrap justify-center gap-2">
              <span *ngFor="let code of activityCodes"
                class="px-3 py-1 bg-th-card rounded-lg text-xs font-mono font-semibold text-th-text-2 shadow-sm">
                {{ code }}
              </span>
            </div>
          </div>
        </div>

        <!-- Trust Statement -->
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-th-card/20 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>

          <h3 class="text-3xl font-bold mb-4">
            {{ i18n.t('Fully Compliant with Saudi Regulations', 'ممتثل بالكامل للوائح السعودية') }}
          </h3>
          <p class="text-lg text-green-100 max-w-3xl mx-auto mb-8">
            {{ i18n.t(
              'All our operations are conducted under full legal authorization from the Saudi Ministry of Commerce and the Saudi Council of Engineers, ensuring complete compliance with Kingdom regulations and Vision 2030 objectives.',
              'تتم جميع عملياتنا بموجب تصريح قانوني كامل من وزارة التجارة السعودية والهيئة السعودية للمهندسين، مما يضمن الامتثال الكامل للوائح المملكة وأهداف رؤية 2030.'
            ) }}
          </p>

          <div class="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div class="text-center">
              <div class="text-4xl font-bold mb-2">2019</div>
              <div class="text-sm text-green-100">{{ i18n.t('Established', 'التأسيس') }}</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold mb-2">17</div>
              <div class="text-sm text-green-100">{{ i18n.t('Licensed Activities', 'الأنشطة المرخصة') }}</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold mb-2">100%</div>
              <div class="text-sm text-green-100">{{ i18n.t('Compliant', 'الامتثال') }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class GovernmentCredentialsComponent {
  i18n = inject(I18nService);

  activityCodes = [
    '410010', '410021', '410030', '410040',
    '582001', '582002',
    '620101', '620102', '620106', '620108', '620111', '620113', '620211',
    '631121', '631125',
    '702017', '731013'
  ];

  commercialActivities: CommercialActivity[] = [
    // Construction (4 activities)
    { code: '410010', nameEn: 'General construction for residential buildings', nameAr: 'الإنشاءات العامة للمباني السكنية', category: 'construction' },
    { code: '410021', nameEn: 'General construction for non-residential buildings', nameAr: 'الإنشاءات العامة للمباني غير السكنية (مثل المدارس والمستشفيات والفنادق ...إلخ)', category: 'construction' },
    { code: '410030', nameEn: 'Construction of prefabricated buildings on sites', nameAr: 'إنشاءات المباني الجاهزة في المواقع', category: 'construction' },
    { code: '410040', nameEn: 'Renovations of residential and non-residential buildings', nameAr: 'ترميمات المباني السكنية والكير سكنية', category: 'construction' },

    // Technology & Software (9 activities)
    { code: '582001', nameEn: 'Publishing of ready-made software', nameAr: 'نشر البرامج الجاهزة', category: 'technology' },
    { code: '582002', nameEn: 'Operating systems', nameAr: 'أنظمة التشغيل', category: 'technology' },
    { code: '620101', nameEn: 'Systems integration', nameAr: 'تكامل الأنظمة', category: 'technology' },
    { code: '620102', nameEn: 'Design and programming of special software', nameAr: 'تصميم وبرمجة البرمجيات الخاصة', category: 'technology' },
    { code: '620106', nameEn: 'Robotics technologies', nameAr: 'تقنيات الروبوت', category: 'technology' },
    { code: '620108', nameEn: 'Immersive reality technologies (virtual and augmented reality)', nameAr: 'تقنيات الواقع الإندماجي (الواقع الإفتراضي والمعزز)', category: 'technology' },
    { code: '620111', nameEn: 'Application development', nameAr: 'تطوير التطبيقات', category: 'technology' },
    { code: '620113', nameEn: 'Artificial intelligence technologies', nameAr: 'تقنيات الذكاء الاصطناعي', category: 'technology' },
    { code: '620211', nameEn: 'Communication and information network management and monitoring services', nameAr: 'تقديم خدمة إدارة ومراقبة شبكات الاتصالات والمعلومات', category: 'technology' },

    // Infrastructure & Cloud (2 activities)
    { code: '631121', nameEn: 'Infrastructure for hosting websites and data processing services', nameAr: 'إقامة البنية الأساسية لاستضافة المواقع على الشبكة وخدمات تجهيز البيانات والأنشطة المتصلة بذلك', category: 'cloud' },
    { code: '631125', nameEn: 'Cloud computing services', nameAr: 'تقديم خدمات الحوسبة السحابية', category: 'cloud' },

    // Consulting & Business Services (2 activities)
    { code: '702017', nameEn: 'Senior management consulting services', nameAr: 'تقديم خدمات الاستشارات الإدارية العليا', category: 'consulting' },
    { code: '731013', nameEn: 'Marketing services on behalf of others', nameAr: 'تقديم خدمات تسويقية نيابة عن الغير', category: 'consulting' }
  ];
}