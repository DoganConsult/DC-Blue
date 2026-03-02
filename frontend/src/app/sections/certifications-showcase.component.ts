import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../core/services/i18n.service';

interface Certification {
  name: string;
  issuer: string;
  logo?: string;
  issued: string;
  expires?: string;
  credentialId?: string;
  category: 'management' | 'security' | 'technical' | 'infrastructure' | 'regulatory';
  priority: number; // 1-5, with 1 being highest
  skills?: string[];
  active: boolean;
}

@Component({
  selector: 'app-certifications-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-12 sm:py-20 px-4 bg-gradient-to-b from-th-card via-th-bg-alt to-th-card">
      <div class="container mx-auto max-w-7xl">
        <!-- Section Header -->
        <div class="text-center mb-10 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-4">
            <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span class="text-sm font-medium text-amber-700">{{ i18n.t('Professional Accreditations', 'الاعتمادات المهنية') }}</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
            {{ i18n.t('World-Class Certifications & Expertise', 'شهادات وخبرات عالمية المستوى') }}
          </h2>
          <p class="text-lg text-th-text-2 max-w-3xl mx-auto">
            {{ i18n.t(
              'Our leadership holds 25+ premium certifications from globally recognized institutions, ensuring world-class delivery standards',
              'تحمل قيادتنا أكثر من 25 شهادة متميزة من مؤسسات معترف بها عالمياً، مما يضمن معايير تسليم عالمية المستوى'
            ) }}
          </p>
        </div>

        <!-- Key Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-10 sm:mb-12">
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-indigo-600 mb-1">25+</div>
            <div class="text-sm text-th-text-2">{{ i18n.t('Certifications', 'شهادات') }}</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-purple-600 mb-1">PgMP®</div>
            <div class="text-sm text-th-text-2">{{ i18n.t('Program Mgmt', 'إدارة البرامج') }}</div>
          </div>
          <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-emerald-600 mb-1">CISM</div>
            <div class="text-sm text-th-text-2">{{ i18n.t('Security Leader', 'قائد الأمن') }}</div>
          </div>
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-amber-600 mb-1">RCDD</div>
            <div class="text-sm text-th-text-2">{{ i18n.t('Infrastructure', 'البنية التحتية') }}</div>
          </div>
          <div class="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-cyan-600 mb-1">SCE</div>
            <div class="text-sm text-th-text-2">{{ i18n.t('Saudi Certified', 'معتمد سعودي') }}</div>
          </div>
        </div>

        <!-- Premium Certifications Showcase -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-center mb-8 text-brand-dark">
            {{ i18n.t('Premium Leadership Certifications', 'شهادات القيادة المتميزة') }}
          </h3>

          <div class="grid md:grid-cols-3 gap-6">
            <!-- PgMP Certification -->
            <div class="group relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
              <div class="relative bg-th-card rounded-2xl p-8 border-2 border-amber-200 hover:shadow-xl transition-all">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <span class="text-2xl font-bold text-amber-600">PMI</span>
                  </div>
                  <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    {{ i18n.t('Active', 'نشط') }}
                  </span>
                </div>

                <h4 class="text-xl font-bold text-brand-dark mb-2">
                  {{ i18n.t('Program Management Professional (PgMP)®', 'محترف إدارة البرامج (PgMP)®') }}
                </h4>
                <p class="text-sm text-th-text-2 mb-4">
                  {{ i18n.t('Project Management Institute', 'معهد إدارة المشاريع') }}
                </p>

                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2 text-th-text-3">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    {{ i18n.t('Valid: Jan 2023 - Jan 2026', 'صالح: يناير 2023 - يناير 2026') }}
                  </div>
                  <div class="flex items-center gap-2 text-th-text-3">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    {{ i18n.t('Elite 1% of Project Managers', 'أفضل 1% من مديري المشاريع') }}
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-th-border-lt">
                  <div class="flex flex-wrap gap-1">
                    <span class="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs">{{ i18n.t('Program Management', 'إدارة البرامج') }}</span>
                    <span class="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs">{{ i18n.t('C-Level', 'الإدارة العليا') }}</span>
                    <span class="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs">{{ i18n.t('Strategic Planning', 'التخطيط الاستراتيجي') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Saudi Council Certification -->
            <div class="group relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
              <div class="relative bg-th-card rounded-2xl p-8 border-2 border-emerald-200 hover:shadow-xl transition-all">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                    <span class="text-2xl font-bold text-emerald-600">SCE</span>
                  </div>
                  <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                    {{ i18n.t('KSA Official', 'رسمي سعودي') }}
                  </span>
                </div>

                <h4 class="text-xl font-bold text-brand-dark mb-2">
                  {{ i18n.t('Telecommunications Consultant', 'مستشار اتصالات') }}
                </h4>
                <p class="text-sm text-th-text-2 mb-4">
                  {{ i18n.t('Saudi Council of Engineers', 'الهيئة السعودية للمهندسين') }}
                </p>

                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2 text-th-text-3">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    {{ i18n.t('Issued: Jul 2020', 'صدر: يوليو 2020') }}
                  </div>
                  <div class="flex items-center gap-2 text-th-text-3">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                    {{ i18n.t('Saudi Government Recognized', 'معتمد من الحكومة السعودية') }}
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-th-border-lt">
                  <div class="flex flex-wrap gap-1">
                    <span class="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs">{{ i18n.t('Telecom', 'الاتصالات') }}</span>
                    <span class="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs">{{ i18n.t('Consulting', 'الاستشارات') }}</span>
                    <span class="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs">{{ i18n.t('KSA Market', 'السوق السعودي') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chartered Manager -->
            <div class="group relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
              <div class="relative bg-th-card rounded-2xl p-8 border-2 border-purple-200 hover:shadow-xl transition-all">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <span class="text-2xl font-bold text-purple-600">CMI</span>
                  </div>
                  <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    {{ i18n.t('Chartered', 'مُعتمد') }}
                  </span>
                </div>

                <h4 class="text-xl font-bold text-brand-dark mb-2">
                  {{ i18n.t('Chartered Manager', 'مدير معتمد') }}
                </h4>
                <p class="text-sm text-th-text-2 mb-4">
                  {{ i18n.t('Chartered Management Institute', 'معهد الإدارة المعتمد') }}
                </p>

                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2 text-th-text-3">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    {{ i18n.t('Issued: Apr 2022', 'صدر: أبريل 2022') }}
                  </div>
                  <div class="flex items-center gap-2 text-th-text-3">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                    </svg>
                    {{ i18n.t('UK Professional Standard', 'معيار مهني بريطاني') }}
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-th-border-lt">
                  <div class="flex flex-wrap gap-1">
                    <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">{{ i18n.t('Leadership', 'القيادة') }}</span>
                    <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">{{ i18n.t('Management', 'الإدارة') }}</span>
                    <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">{{ i18n.t('Strategy', 'الاستراتيجية') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Security & Risk Certifications -->
        <div class="mb-16">
          <h3 class="text-xl font-bold mb-6 text-brand-dark">
            {{ i18n.t('Information Security & Risk Management', 'أمن المعلومات وإدارة المخاطر') }}
          </h3>
          <div class="grid md:grid-cols-4 gap-4">
            <div *ngFor="let cert of securityCertifications"
                 class="bg-th-card rounded-xl border border-th-border hover:border-emerald-400 hover:shadow-lg transition-all p-6">
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <span class="text-sm font-bold text-emerald-600">{{ cert.acronym }}</span>
                </div>
                <svg *ngIf="cert.active" class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h4 class="font-semibold text-brand-dark mb-1">{{ cert.name }}</h4>
              <p class="text-xs text-th-text-3 mb-2">{{ cert.issuer }}</p>
              <p class="text-xs text-th-text-3">{{ cert.date }}</p>
            </div>
          </div>
        </div>

        <!-- Technical & Infrastructure Certifications -->
        <div class="mb-16">
          <h3 class="text-xl font-bold mb-6 text-brand-dark">
            {{ i18n.t('Technical & Infrastructure Excellence', 'التميز التقني والبنية التحتية') }}
          </h3>
          <div class="grid md:grid-cols-5 gap-4">
            <div *ngFor="let cert of technicalCertifications"
                 class="bg-th-card rounded-xl border border-th-border hover:border-sky-400 hover:shadow-lg transition-all p-6">
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center">
                  <span class="text-xs font-bold text-sky-600">{{ cert.acronym }}</span>
                </div>
                <svg *ngIf="cert.priority === 1" class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h4 class="font-semibold text-brand-dark mb-1 text-sm">{{ cert.name }}</h4>
              <p class="text-xs text-th-text-3 mb-2">{{ cert.issuer }}</p>
              <p class="text-xs text-th-text-3">{{ cert.date }}</p>
            </div>
          </div>
        </div>

        <!-- Certification Timeline -->
        <div class="bg-gradient-to-br from-th-bg-alt to-th-card rounded-3xl p-8 md:p-12">
          <h3 class="text-2xl font-bold text-center mb-8 text-brand-dark">
            {{ i18n.t('Continuous Professional Development', 'التطوير المهني المستمر') }}
          </h3>

          <div class="relative">
            <!-- Timeline Line -->
            <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-emerald-400 to-purple-400"></div>

            <!-- Timeline Items -->
            <div class="space-y-8">
              <div *ngFor="let year of timelineYears; let i = index"
                   class="relative flex items-center md:justify-start"
                   [class.md:justify-start]="i % 2 === 0"
                   [class.md:justify-end]="i % 2 === 1">
                <!-- Content -->
                <div class="ml-10 md:ml-0 md:w-5/12 md:px-6"
                     [class.md:text-right]="i % 2 === 0"
                     [class.md:text-left]="i % 2 === 1">
                  <div class="bg-th-card rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all">
                    <div class="text-lg font-bold text-primary mb-2">{{ year.year }}</div>
                    <div class="space-y-1">
                      <div *ngFor="let cert of year.certifications" class="text-sm text-th-text-2">
                        • {{ cert }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Timeline Dot -->
                <div class="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-th-card border-4 border-primary rounded-full z-10"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom CTA -->
        <div class="mt-16 text-center">
          <p class="text-lg text-th-text-2 mb-6">
            {{ i18n.t(
              'Our certifications guarantee world-class standards in every project delivery',
              'شهاداتنا تضمن معايير عالمية في كل تسليم مشروع'
            ) }}
          </p>
          <button class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all">
            {{ i18n.t('Verify Our Credentials', 'تحقق من اعتماداتنا') }}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class CertificationsShowcaseComponent {
  i18n = inject(I18nService);

  securityCertifications = [
    {
      acronym: 'CISM',
      name: 'Certified Information Security Manager',
      issuer: 'ISACA',
      date: 'Oct 2020',
      active: false
    },
    {
      acronym: 'CISA',
      name: 'Certified Information Systems Auditor',
      issuer: 'ISACA',
      date: 'Oct 2020',
      active: false
    },
    {
      acronym: 'CRISC',
      name: 'Certified in Risk & Information Systems Control',
      issuer: 'ISACA',
      date: 'Oct 2020',
      active: false
    },
    {
      acronym: 'OSHA',
      name: 'Safety & Health Standards',
      issuer: 'OSHA Institute',
      date: 'Nov 2006',
      active: true
    }
  ];

  technicalCertifications = [
    {
      acronym: 'RCDD',
      name: 'Registered Communications Distribution Designer',
      issuer: 'BICSI',
      date: 'Nov 2021',
      priority: 1,
      active: true
    },
    {
      acronym: 'ATD',
      name: 'Accredited Tier Designer',
      issuer: 'Uptime Institute',
      date: 'Nov 2019',
      priority: 1,
      active: false
    },
    {
      acronym: 'AOS',
      name: 'Accredited Operations Specialist',
      issuer: 'Uptime Institute',
      date: 'Apr 2020',
      priority: 2,
      active: true
    },
    {
      acronym: 'HCIP',
      name: 'Data Center Facility',
      issuer: 'Huawei',
      date: 'Dec 2018',
      priority: 2,
      active: false
    },
    {
      acronym: 'ITIL',
      name: 'ITIL® 4 Foundation',
      issuer: 'AXELOS',
      date: 'Sep 2020',
      priority: 2,
      active: true
    }
  ];

  timelineYears = [
    {
      year: '2023',
      certifications: ['Program Management Professional (PgMP)®']
    },
    {
      year: '2022',
      certifications: ['Chartered Manager (CMI)']
    },
    {
      year: '2021',
      certifications: ['RCDD - BICSI', 'PRINCE2® Practitioner']
    },
    {
      year: '2020',
      certifications: ['PMP®', 'PMI-ACP', 'CISM', 'CISA', 'CRISC', 'Saudi Council of Engineers']
    },
    {
      year: '2019',
      certifications: ['ATD - Uptime Institute', 'Huawei Pre-Sales Specialist']
    },
    {
      year: '2018',
      certifications: ['HCIP Data Center Facility']
    }
  ];
}