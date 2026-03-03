import { Component, inject, input } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { LandingContent } from '../core/models/landing.model';

interface Partner {
  name: string;
  logo: string;
  level: 'platinum' | 'gold' | 'silver' | 'certified';
  category: 'cloud' | 'security' | 'network' | 'software' | 'hardware';
  certifications?: string[];
  description?: { en: string; ar: string };
}

@Component({
  selector: 'app-partners-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-th-card">
      <div class="container mx-auto max-w-7xl">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            <span class="text-sm font-medium text-purple-700">{{ i18n.t('Technology Partners', 'شركاء التقنية') }}</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
            {{ i18n.t('Powered by Industry Leaders', 'مدعوم من قادة الصناعة') }}
          </h2>
          <p class="text-lg text-th-text-2 max-w-3xl mx-auto">
            {{ i18n.t(
              'Strategic partnerships with global technology leaders ensure best-in-class solutions',
              'شراكات استراتيجية مع قادة التكنولوجيا العالميين تضمن حلولاً من الدرجة الأولى'
            ) }}
          </p>
        </div>

        <!-- Partner Categories -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <button
            (click)="selectedCategory = 'all'"
            [class.bg-primary]="selectedCategory === 'all'"
            [class.text-white]="selectedCategory === 'all'"
            [class.bg-th-bg-tert]="selectedCategory !== 'all'"
            class="px-4 py-2 rounded-lg font-medium transition-all"
          >
            {{ i18n.t('All Partners', 'جميع الشركاء') }}
          </button>
          @for (cat of categories; track cat.id) {
            <button
              (click)="selectedCategory = cat.id"
              [class.bg-primary]="selectedCategory === cat.id"
              [class.text-white]="selectedCategory === cat.id"
              [class.bg-th-bg-tert]="selectedCategory !== cat.id"
              class="px-4 py-2 rounded-lg font-medium transition-all"
            >
              {{ i18n.t(cat.name.en, cat.name.ar) }}
            </button>
          }
        </div>

        <!-- Platinum Partners -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-th-text mb-8 text-center">
            {{ i18n.t('Platinum Partners', 'شركاء البلاتين') }}
          </h3>
          <div class="grid md:grid-cols-4 gap-8">
            @for (partner of getPlatinumPartners(); track partner.name) {
              <div class="group relative">
                <div class="bg-gradient-to-br from-th-bg-alt to-th-bg-tert rounded-2xl p-8 hover:shadow-xl transition-all border-2 border-th-border hover:border-primary">
                  <div class="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="h-16 flex items-center justify-center mb-4">
                    <div class="text-2xl font-bold text-th-text-2">{{ partner.name }}</div>
                  </div>
                  <div class="space-y-2">
                    @for (cert of partner.certifications?.slice(0, 3) ?? []; track cert) {
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-xs text-th-text-2">{{ cert }}</span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Gold & Silver Partners -->
        <div class="grid md:grid-cols-2 gap-12 mb-16">
          <!-- Gold Partners -->
          <div>
            <h3 class="text-xl font-bold text-th-text mb-6">
              {{ i18n.t('Gold Partners', 'شركاء الذهب') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              @for (partner of getGoldPartners(); track partner.name) {
                <div class="bg-th-card rounded-xl p-6 border border-th-border hover:border-amber-400 hover:shadow-lg transition-all">
                  <div class="h-12 flex items-center justify-center mb-3">
                    <span class="text-lg font-semibold text-th-text-2">{{ partner.name }}</span>
                  </div>
                  <div class="flex justify-center gap-1">
                    @for (star of [1,2,3,4]; track star) {
                      <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Silver Partners -->
          <div>
            <h3 class="text-xl font-bold text-th-text mb-6">
              {{ i18n.t('Silver Partners', 'شركاء الفضة') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              @for (partner of getSilverPartners(); track partner.name) {
                <div class="bg-th-card rounded-xl p-6 border border-th-border hover:border-th-border hover:shadow-lg transition-all">
                  <div class="h-12 flex items-center justify-center mb-3">
                    <span class="text-lg font-semibold text-th-text-2">{{ partner.name }}</span>
                  </div>
                  <div class="flex justify-center gap-1">
                    @for (star of [1,2,3]; track star) {
                      <svg class="w-4 h-4 text-th-text-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Certified Partners Grid -->
        <div>
          <h3 class="text-xl font-bold text-th-text mb-6 text-center">
            {{ i18n.t('Certified Partners', 'شركاء معتمدون') }}
          </h3>
          <div class="flex flex-wrap justify-center gap-6">
            @for (partner of getCertifiedPartners(); track partner.name) {
              <div class="group px-6 py-3 bg-th-bg-alt rounded-lg hover:bg-primary hover:text-white transition-all">
                <span class="text-sm font-medium">{{ partner.name }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Partnership Benefits -->
        <div class="mt-20 bg-gradient-to-br from-th-bg-alt to-th-card rounded-3xl p-8 md:p-12">
          <h3 class="text-2xl font-bold text-brand-dark mb-8 text-center">
            {{ i18n.t('What Partnership Means for You', 'ماذا تعني الشراكة بالنسبة لك') }}
          </h3>

          <div class="grid md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold mb-2">{{ i18n.t('Official Support', 'الدعم الرسمي') }}</h4>
              <p class="text-sm text-th-text-2">
                {{ i18n.t('Direct escalation to vendor support teams', 'تصعيد مباشر لفرق دعم البائعين') }}
              </p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold mb-2">{{ i18n.t('Latest Technologies', 'أحدث التقنيات') }}</h4>
              <p class="text-sm text-th-text-2">
                {{ i18n.t('Early access to new features and products', 'الوصول المبكر للميزات والمنتجات الجديدة') }}
              </p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold mb-2">{{ i18n.t('Best Pricing', 'أفضل الأسعار') }}</h4>
              <p class="text-sm text-th-text-2">
                {{ i18n.t('Partner discounts passed to clients', 'خصومات الشركاء تنتقل للعملاء') }}
              </p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold mb-2">{{ i18n.t('Certified Expertise', 'خبرة معتمدة') }}</h4>
              <p class="text-sm text-th-text-2">
                {{ i18n.t('Vendor-trained and certified engineers', 'مهندسون مدربون ومعتمدون من البائعين') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class PartnersSectionComponent {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);

  selectedCategory = 'all';

  categories = [
    { id: 'cloud', name: { en: 'Cloud', ar: 'السحابة' } },
    { id: 'security', name: { en: 'Security', ar: 'الأمن' } },
    { id: 'network', name: { en: 'Network', ar: 'الشبكات' } },
    { id: 'software', name: { en: 'Software', ar: 'البرمجيات' } }
  ];

  get partners(): Partner[] { return (this.content()?.partners as any) ?? this.defaultPartners; }

  private defaultPartners: Partner[] = [
    // Platinum Partners
    {
      name: 'Microsoft',
      logo: 'microsoft',
      level: 'platinum',
      category: 'cloud',
      certifications: ['Azure Expert MSP', 'Gold Cloud Platform', 'Gold Data & AI', 'Gold Security']
    },
    {
      name: 'AWS',
      logo: 'aws',
      level: 'platinum',
      category: 'cloud',
      certifications: ['Advanced Consulting Partner', 'Solution Provider', 'Well-Architected Partner']
    },
    {
      name: 'Cisco',
      logo: 'cisco',
      level: 'platinum',
      category: 'network',
      certifications: ['Gold Partner', 'Master Security Specialization', 'Master Collaboration']
    },
    {
      name: 'Palo Alto',
      logo: 'paloalto',
      level: 'platinum',
      category: 'security',
      certifications: ['Platinum Innovator', 'MSSP Partner', 'Prisma Cloud Specialization']
    },

    // Gold Partners
    {
      name: 'Oracle',
      logo: 'oracle',
      level: 'gold',
      category: 'software',
      certifications: ['Gold Partner', 'Cloud Excellence Implementer']
    },
    {
      name: 'SAP',
      logo: 'sap',
      level: 'gold',
      category: 'software',
      certifications: ['Gold Partner', 'S/4HANA Certified']
    },
    {
      name: 'VMware',
      logo: 'vmware',
      level: 'gold',
      category: 'cloud',
      certifications: ['Principal Partner', 'Cloud Provider']
    },
    {
      name: 'Fortinet',
      logo: 'fortinet',
      level: 'gold',
      category: 'security',
      certifications: ['Gold Partner', 'MSSP Specialization']
    },
    {
      name: 'Splunk',
      logo: 'splunk',
      level: 'gold',
      category: 'security',
      certifications: ['Elite Partner', 'SIEM Expert']
    },
    {
      name: 'Red Hat',
      logo: 'redhat',
      level: 'gold',
      category: 'cloud',
      certifications: ['Premier Partner', 'OpenShift Specialist']
    },

    // Silver Partners
    {
      name: 'HPE',
      logo: 'hpe',
      level: 'silver',
      category: 'hardware'
    },
    {
      name: 'Dell',
      logo: 'dell',
      level: 'silver',
      category: 'hardware'
    },
    {
      name: 'F5',
      logo: 'f5',
      level: 'silver',
      category: 'network'
    },
    {
      name: 'Juniper',
      logo: 'juniper',
      level: 'silver',
      category: 'network'
    },
    {
      name: 'CrowdStrike',
      logo: 'crowdstrike',
      level: 'silver',
      category: 'security'
    },
    {
      name: 'Zscaler',
      logo: 'zscaler',
      level: 'silver',
      category: 'security'
    },

    // Certified Partners
    {
      name: 'Google Cloud',
      logo: 'gcp',
      level: 'certified',
      category: 'cloud'
    },
    {
      name: 'Nutanix',
      logo: 'nutanix',
      level: 'certified',
      category: 'cloud'
    },
    {
      name: 'HashiCorp',
      logo: 'hashicorp',
      level: 'certified',
      category: 'software'
    },
    {
      name: 'Datadog',
      logo: 'datadog',
      level: 'certified',
      category: 'software'
    },
    {
      name: 'Elastic',
      logo: 'elastic',
      level: 'certified',
      category: 'software'
    },
    {
      name: 'MongoDB',
      logo: 'mongodb',
      level: 'certified',
      category: 'software'
    },
    {
      name: 'Kubernetes',
      logo: 'kubernetes',
      level: 'certified',
      category: 'cloud'
    },
    {
      name: 'GitLab',
      logo: 'gitlab',
      level: 'certified',
      category: 'software'
    }
  ];

  getPlatinumPartners(): Partner[] {
    return this.filterPartners('platinum');
  }

  getGoldPartners(): Partner[] {
    return this.filterPartners('gold');
  }

  getSilverPartners(): Partner[] {
    return this.filterPartners('silver');
  }

  getCertifiedPartners(): Partner[] {
    return this.filterPartners('certified');
  }

  private filterPartners(level: string): Partner[] {
    let filtered = this.partners.filter(p => p.level === level);

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    return filtered;
  }
}