import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

interface Education {
  degree: string;
  institution: string;
  logo?: string;
  period: string;
  status?: 'current' | 'completed';
  description?: string;
  highlights?: string[];
  accreditation?: string;
  research?: {
    title: string;
    questions?: string[];
  };
  skills?: string[];
}

@Component({
  selector: 'app-education-section',
  standalone: true,
  imports: [],
  template: `
    <section class="py-20 px-4 bg-gradient-to-b from-th-bg-alt via-th-card to-th-bg-alt">
      <div class="container mx-auto max-w-7xl">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4">
            <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span class="text-sm font-medium text-indigo-700">{{ i18n.t('Academic Excellence', 'التميز الأكاديمي') }}</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
            {{ i18n.t('World-Class Education & Research', 'تعليم وأبحاث عالمية المستوى') }}
          </h2>
          <p class="text-lg text-th-text-2 max-w-3xl mx-auto">
            {{ i18n.t(
              'Combining doctoral research, business administration expertise, and engineering foundations from prestigious global institutions',
              'الجمع بين البحث الدكتوراه وخبرة إدارة الأعمال والأسس الهندسية من مؤسسات عالمية مرموقة'
            ) }}
          </p>
        </div>

        <!-- Education Timeline -->
        <div class="relative mb-16">
          <!-- Current Doctoral Studies - Featured -->
          <div class="mb-12">
            <div class="relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-3xl blur opacity-20 animate-pulse"></div>
              <div class="relative bg-th-card rounded-3xl shadow-2xl overflow-hidden">
                <!-- Status Badge -->
                <div class="absolute top-6 right-6 z-10">
                  <span class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    {{ i18n.t('Currently Pursuing', 'قيد الدراسة حالياً') }}
                  </span>
                </div>

                <div class="grid md:grid-cols-2">
                  <!-- Left: University Info -->
                  <div class="p-8 md:p-12 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <div class="flex items-start gap-4 mb-6">
                      <div class="w-20 h-20 bg-th-card rounded-2xl shadow-lg flex items-center justify-center">
                        <span class="text-2xl font-bold text-indigo-600">UN</span>
                      </div>
                      <div>
                        <h3 class="text-2xl font-bold text-brand-dark mb-1">
                          {{ i18n.t('Doctor of Business Administration (DBA)', 'دكتوراه في إدارة الأعمال (DBA)') }}
                        </h3>
                        <p class="text-lg text-th-text-2">{{ i18n.t('University of Northampton, UK', 'جامعة نورثامبتون، المملكة المتحدة') }}</p>
                        <p class="text-sm text-th-text-3 mt-1">{{ i18n.t('2022 - 2026 (Expected)', '2022 - 2026 (متوقع)') }}</p>
                      </div>
                    </div>

                    <div class="space-y-4">
                      <div>
                        <h4 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-2">
                          {{ i18n.t('Research Focus', 'محور البحث') }}
                        </h4>
                        <p class="text-th-text-2">
                          {{ i18n.t('Business Administration and Management with focus on Digital Transformation and Strategic Leadership in Emerging Markets', 'إدارة الأعمال مع التركيز على التحول الرقمي والقيادة الاستراتيجية في الأسواق الناشئة') }}
                        </p>
                      </div>

                      <div>
                        <h4 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-2">
                          {{ i18n.t('Key Competencies', 'الكفاءات الرئيسية') }}
                        </h4>
                        <div class="flex flex-wrap gap-2">
                          <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            {{ i18n.t('C-Level Strategy', 'استراتيجية الإدارة العليا') }}
                          </span>
                          <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            {{ i18n.t('Management Consulting', 'الاستشارات الإدارية') }}
                          </span>
                          <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            {{ i18n.t('Critical Thinking', 'التفكير النقدي') }}
                          </span>
                          <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            {{ i18n.t('IoT Research', 'أبحاث إنترنت الأشياء') }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right: Impact & Stats -->
                  <div class="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-brand-dark to-brand-darker text-white">
                    <h4 class="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-6">
                      {{ i18n.t('Academic Impact', 'التأثير الأكاديمي') }}
                    </h4>

                    <div class="space-y-6">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-th-card/20 rounded-xl flex items-center justify-center">
                          <svg class="w-6 h-6 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-2xl font-bold text-white">{{ i18n.t('Doctoral Research', 'بحث الدكتوراه') }}</div>
                          <div class="text-sm text-cyan-200">{{ i18n.t('Advanced Business Studies', 'دراسات أعمال متقدمة') }}</div>
                        </div>
                      </div>

                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-th-card/20 rounded-xl flex items-center justify-center">
                          <svg class="w-6 h-6 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-2xl font-bold text-white">{{ i18n.t('Top 1%', 'أفضل 1%') }}</div>
                          <div class="text-sm text-emerald-200">{{ i18n.t('Executive Education', 'التعليم التنفيذي') }}</div>
                        </div>
                      </div>

                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-th-card/20 rounded-xl flex items-center justify-center">
                          <svg class="w-6 h-6 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-2xl font-bold text-white">{{ i18n.t('UK Institution', 'مؤسسة بريطانية') }}</div>
                          <div class="text-sm text-amber-200">{{ i18n.t('Global Recognition', 'اعتراف عالمي') }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Completed Degrees Grid -->
          <div class="grid md:grid-cols-2 gap-8 mb-12">
            <!-- MBA Leicester -->
            <div class="group">
              <div class="bg-th-card rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden h-full">
                <div class="p-8">
                  <!-- Header -->
                  <div class="flex items-start gap-4 mb-6">
                    <div class="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center">
                      <span class="text-xl font-bold text-red-600">UL</span>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-brand-dark mb-1">
                        {{ i18n.t('Master of Business Administration (MBA)', 'ماجستير إدارة الأعمال (MBA)') }}
                      </h3>
                      <p class="text-sm text-th-text-2">{{ i18n.t('University of Leicester, UK', 'جامعة ليستر، المملكة المتحدة') }}</p>
                      <p class="text-xs text-th-text-3 mt-1">2019 - 2021</p>
                    </div>
                  </div>

                  <!-- Accreditation Badge -->
                  <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold mb-4">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {{ i18n.t('AMBA Accredited', 'معتمد AMBA') }}
                  </div>

                  <!-- Research -->
                  <div class="mb-6">
                    <h4 class="text-sm font-semibold text-th-text-2 mb-2">{{ i18n.t('Research Thesis', 'أطروحة البحث') }}</h4>
                    <p class="text-sm text-th-text-2 mb-3">
                      {{ i18n.t('"The Impact of Internet of Things on Consumer Preferences and Behavior" (18,000 words)', '"تأثير إنترنت الأشياء على تفضيلات وسلوك المستهلك" (18,000 كلمة)') }}
                    </p>
                    <div class="space-y-1 text-xs text-th-text-3 bg-th-bg-alt rounded-lg p-3">
                      <p>• {{ i18n.t('Do customers in Saudi Arabia trust IoT?', 'هل يثق العملاء في السعودية بإنترنت الأشياء؟') }}</p>
                      <p>• {{ i18n.t('Are customers in Saudi Arabia satisfied with IoT?', 'هل العملاء في السعودية راضون عن إنترنت الأشياء؟') }}</p>
                      <p>• {{ i18n.t('Trust, satisfaction & purchase retention for IoT products', 'الثقة والرضا والاحتفاظ بالشراء لمنتجات إنترنت الأشياء') }}</p>
                    </div>
                  </div>

                  <!-- Core Modules -->
                  <div>
                    <h4 class="text-sm font-semibold text-th-text-2 mb-3">{{ i18n.t('Core Modules', 'الوحدات الأساسية') }}</h4>
                    <div class="flex flex-wrap gap-1">
                      <span class="px-2 py-1 bg-th-bg-tert text-th-text-2 rounded text-xs">{{ i18n.t('People & Organizations', 'الأفراد والمنظمات') }}</span>
                      <span class="px-2 py-1 bg-th-bg-tert text-th-text-2 rounded text-xs">{{ i18n.t('Value Creation', 'خلق القيمة') }}</span>
                      <span class="px-2 py-1 bg-th-bg-tert text-th-text-2 rounded text-xs">{{ i18n.t('Strategic Finance', 'التمويل الاستراتيجي') }}</span>
                      <span class="px-2 py-1 bg-th-bg-tert text-th-text-2 rounded text-xs">{{ i18n.t('Marketing Strategy', 'استراتيجية التسويق') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CMI Diploma -->
            <div class="group">
              <div class="bg-th-card rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden h-full">
                <div class="p-8">
                  <!-- Header -->
                  <div class="flex items-start gap-4 mb-6">
                    <div class="w-16 h-16 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl flex items-center justify-center">
                      <span class="text-xl font-bold text-purple-600">CMI</span>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-brand-dark mb-1">
                        {{ i18n.t('Level 7 Diploma', 'دبلوم المستوى 7') }}
                      </h3>
                      <p class="text-sm text-th-text-2">{{ i18n.t('Strategic Management & Leadership Practice', 'الإدارة الاستراتيجية وممارسة القيادة') }}</p>
                      <p class="text-xs text-th-text-3 mt-1">{{ i18n.t('Chartered Management Institute', 'معهد الإدارة المعتمد') }} • 2019 - 2021</p>
                    </div>
                  </div>

                  <!-- Level Badge -->
                  <div class="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold mb-4">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                    </svg>
                    {{ i18n.t("Level 7 (Master's Equivalent)", 'المستوى 7 (معادل للماجستير)') }}
                  </div>

                  <!-- Units Completed -->
                  <div>
                    <h4 class="text-sm font-semibold text-th-text-2 mb-3">{{ i18n.t('Units Completed', 'الوحدات المكتملة') }}</h4>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-sm text-th-text-2">{{ i18n.t('Developing Organizational Strategy', 'تطوير الاستراتيجية التنظيمية') }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-sm text-th-text-2">{{ i18n.t('Strategic Data & Information Management', 'إدارة البيانات والمعلومات الاستراتيجية') }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-sm text-th-text-2">{{ i18n.t('Marketing Strategy', 'استراتيجية التسويق') }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-sm text-th-text-2">{{ i18n.t('Applied Strategic Research Project', 'مشروع بحث استراتيجي تطبيقي') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Technical Education -->
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Stanford Certificate -->
            <div class="group">
              <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden h-full border-2 border-red-100">
                <div class="p-8">
                  <!-- Header -->
                  <div class="flex items-start gap-4 mb-6">
                    <div class="w-16 h-16 bg-th-card rounded-xl shadow-md flex items-center justify-center">
                      <span class="text-xl font-bold text-red-600">S</span>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-brand-dark mb-1">
                        {{ i18n.t('Advanced Computer Security', 'أمن الحاسوب المتقدم') }}
                      </h3>
                      <p class="text-sm text-th-text-2">{{ i18n.t('Stanford University School of Engineering', 'كلية الهندسة بجامعة ستانفورد') }}</p>
                      <p class="text-xs text-th-text-3 mt-1">2019 - 2020</p>
                    </div>
                  </div>

                  <!-- Curriculum -->
                  <div>
                    <h4 class="text-sm font-semibold text-th-text-2 mb-3">{{ i18n.t('Curriculum', 'المنهج الدراسي') }}</h4>
                    <div class="grid grid-cols-2 gap-2">
                      <div class="text-xs text-th-text-2 flex items-center gap-1">
                        <span class="w-1 h-1 bg-red-400 rounded-full"></span>
                        {{ i18n.t('Information Security', 'أمن المعلومات') }}
                      </div>
                      <div class="text-xs text-th-text-2 flex items-center gap-1">
                        <span class="w-1 h-1 bg-red-400 rounded-full"></span>
                        {{ i18n.t('Web Application Security', 'أمن تطبيقات الويب') }}
                      </div>
                      <div class="text-xs text-th-text-2 flex items-center gap-1">
                        <span class="w-1 h-1 bg-red-400 rounded-full"></span>
                        {{ i18n.t('Cryptography', 'التشفير') }}
                      </div>
                      <div class="text-xs text-th-text-2 flex items-center gap-1">
                        <span class="w-1 h-1 bg-red-400 rounded-full"></span>
                        {{ i18n.t('Network Security', 'أمن الشبكات') }}
                      </div>
                      <div class="text-xs text-th-text-2 flex items-center gap-1">
                        <span class="w-1 h-1 bg-red-400 rounded-full"></span>
                        {{ i18n.t('Emerging Threats', 'التهديدات الناشئة') }}
                      </div>
                      <div class="text-xs text-th-text-2 flex items-center gap-1">
                        <span class="w-1 h-1 bg-red-400 rounded-full"></span>
                        {{ i18n.t('Secure Coding', 'البرمجة الآمنة') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Engineering Degree -->
            <div class="group">
              <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden h-full border-2 border-blue-100">
                <div class="p-8">
                  <!-- Header -->
                  <div class="flex items-start gap-4 mb-6">
                    <div class="w-16 h-16 bg-th-card rounded-xl shadow-md flex items-center justify-center">
                      <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 7H7v6h6V7z"/>
                        <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-brand-dark mb-1">
                        {{ i18n.t('B.Sc. Electronics & Communications', 'بكالوريوس الإلكترونيات والاتصالات') }}
                      </h3>
                      <p class="text-sm text-th-text-2">{{ i18n.t('Menoufia University, Faculty of Electronic Engineering', 'جامعة المنوفية، كلية الهندسة الإلكترونية') }}</p>
                      <p class="text-xs text-th-text-3 mt-1">1999 - 2004</p>
                    </div>
                  </div>

                  <!-- Engineering Foundation -->
                  <div>
                    <h4 class="text-sm font-semibold text-th-text-2 mb-3">{{ i18n.t('Technical Foundation', 'الأساس التقني') }}</h4>
                    <p class="text-sm text-th-text-2 mb-3">
                      {{ i18n.t('Strong engineering foundation in electronics, telecommunications, and signal processing', 'أساس هندسي قوي في الإلكترونيات والاتصالات ومعالجة الإشارات') }}
                    </p>
                    <div class="flex flex-wrap gap-1">
                      <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ i18n.t('Electronics', 'الإلكترونيات') }}</span>
                      <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ i18n.t('Communications', 'الاتصالات') }}</span>
                      <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ i18n.t('Signal Processing', 'معالجة الإشارات') }}</span>
                      <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ i18n.t('Network Design', 'تصميم الشبكات') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Education Summary Stats -->
        <div class="bg-gradient-to-r from-brand-dark to-brand-darker rounded-3xl p-8 md:p-12 text-white">
          <h3 class="text-2xl font-bold text-center mb-8">
            {{ i18n.t('Educational Excellence Summary', 'ملخص التميز التعليمي') }}
          </h3>

          <div class="grid md:grid-cols-5 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-cyan-300 mb-2">DBA</div>
              <div class="text-sm text-sky-200">{{ i18n.t('In Progress', 'قيد الدراسة') }}</div>
              <div class="text-xs text-sky-300/60 mt-1">2026</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-emerald-300 mb-2">MBA</div>
              <div class="text-sm text-emerald-200">{{ i18n.t('AMBA Accredited', 'معتمد AMBA') }}</div>
              <div class="text-xs text-emerald-300/60 mt-1">{{ i18n.t('Leicester', 'ليستر') }}</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-amber-300 mb-2">Level 7</div>
              <div class="text-sm text-amber-200">{{ i18n.t('CMI Diploma', 'دبلوم CMI') }}</div>
              <div class="text-xs text-amber-300/60 mt-1">{{ i18n.t('Strategic Mgmt', 'الإدارة الاستراتيجية') }}</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-red-300 mb-2">Stanford</div>
              <div class="text-sm text-red-200">{{ i18n.t('Certificate', 'شهادة') }}</div>
              <div class="text-xs text-red-300/60 mt-1">{{ i18n.t('Cybersecurity', 'الأمن السيبراني') }}</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-300 mb-2">B.Sc.</div>
              <div class="text-sm text-purple-200">{{ i18n.t('Engineering', 'الهندسة') }}</div>
              <div class="text-xs text-purple-300/60 mt-1">{{ i18n.t('Electronics', 'الإلكترونيات') }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
  `]
})
export class EducationSectionComponent {
  i18n = inject(I18nService);

  educationList: Education[] = [
    {
      degree: 'Doctor of Business Administration (DBA)',
      institution: 'University of Northampton',
      period: '2022 - 2026',
      status: 'current',
      description: 'Currently enrolled in a Doctoral of Business Administration program with focus on digital transformation and strategic leadership in emerging markets.',
      skills: ['C-Level Strategy', 'Management Consulting', 'Critical Thinking', 'IoT Research']
    },
    {
      degree: 'Master of Business Administration (MBA)',
      institution: 'University of Leicester',
      period: '2019 - 2021',
      status: 'completed',
      accreditation: 'AMBA Accredited',
      research: {
        title: 'The Impact of Internet of Things on Consumer Preferences and Behavior',
        questions: [
          'Do customers in Saudi Arabia trust IoT?',
          'Are customers in Saudi Arabia satisfied with IoT?',
          'What is the relation between trust, customer satisfaction and purchase retention intention for IoT products?'
        ]
      },
      highlights: [
        'Managing and Developing People and Organizations',
        'Managing Value Creation Processes from Idea to Market',
        'Managing Finance and Strategic Decision Making',
        'Managing International Marketing Communications'
      ]
    },
    {
      degree: 'Level 7 Diploma in Strategic Management and Leadership Practice',
      institution: 'Chartered Management Institute',
      period: '2019 - 2021',
      status: 'completed',
      highlights: [
        'Developing Organizational Strategy',
        'Strategic Management of Data and Information',
        'Marketing Strategy',
        'Applied Research of Strategic Project'
      ]
    },
    {
      degree: 'Stanford Advanced Computer Security',
      institution: 'Stanford University School of Engineering',
      period: '2019 - 2020',
      status: 'completed',
      highlights: [
        'Fundamental of Information Security',
        'Exploiting and Protecting Web Applications',
        'Using Cryptography Correctly',
        'Network Security',
        'Emerging Threats and Defenses',
        'Writing Secure Code'
      ]
    },
    {
      degree: 'B.Sc. Electronic and Electrical Communication Engineering',
      institution: 'Faculty of Electronic Engineering, Menoufia University',
      period: '1999 - 2004',
      status: 'completed'
    }
  ];
}