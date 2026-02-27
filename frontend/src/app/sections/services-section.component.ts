import { Component, input, inject } from '@angular/core';
import { LandingContent } from '../pages/landing.page';
import { I18nService } from '../core/services/i18n.service';

const SERVICES_DETAIL = [
  {
    id: '1', icon: '🌐', color: '#0EA5E9',
    titleEn: 'Network & Data Center', titleAr: 'الشبكات ومركز البيانات',
    descEn: 'Enterprise campus, WAN/SD-WAN, data center fabric, and hyperconverged infrastructure design, build and operate.',
    descAr: 'تصميم وبناء وتشغيل شبكات الحرم الجامعي ومركز البيانات والبنية فائقة التقارب.',
    caps: ['Cisco ACI / DNA Center', 'Aruba / HPE Fabric', 'VMware NSX / vSAN', 'Tier III/IV DC Design', 'SD-WAN Orchestration', 'Network Automation'],
  },
  {
    id: '2', icon: '🛡️', color: '#006C35',
    titleEn: 'Cybersecurity', titleAr: 'الأمن السيبراني',
    descEn: 'End-to-end security operations: SOC/SIEM, threat intel, penetration testing, NCA-ECC compliance, and incident response.',
    descAr: 'عمليات أمنية شاملة: SOC/SIEM والاستخبارات الأمنية واختبار الاختراق والامتثال لـ NCA-ECC.',
    caps: ['24/7 SOC-as-a-Service', 'NCA-ECC / ISO 27001', 'Pen Testing & Red Team', 'Zero Trust Architecture', 'OT/ICS Security', 'Threat Intelligence'],
  },
  {
    id: '3', icon: '☁️', color: '#6366F1',
    titleEn: 'Cloud & DevOps', titleAr: 'السحابة و DevOps',
    descEn: 'Multi-cloud architecture, containerization, CI/CD pipelines, and cloud-native application platforms.',
    descAr: 'بنية متعددة السحب والحاويات وخطوط CI/CD ومنصات التطبيقات السحابية.',
    caps: ['AWS / Azure / GCP', 'Kubernetes / OpenShift', 'Terraform / Ansible IaC', 'GitOps CI/CD', 'Serverless Architecture', 'Cloud Cost Optimization'],
  },
  {
    id: '4', icon: '⚙️', color: '#10B981',
    titleEn: 'Systems Integration', titleAr: 'تكامل الأنظمة',
    descEn: 'ERP, EMR, IoT platforms, and enterprise middleware integration with end-to-end project delivery.',
    descAr: 'تكامل أنظمة ERP و EMR ومنصات إنترنت الأشياء والبرمجيات الوسيطة.',
    caps: ['SAP / Oracle Integration', 'HL7 FHIR / EMR Bridge', 'IoT Platform Integration', 'API Gateway & ESB', 'Data Migration', 'Legacy Modernization'],
  },
  {
    id: '5', icon: '📡', color: '#F59E0B',
    titleEn: 'IoT & Smart Solutions', titleAr: 'إنترنت الأشياء والحلول الذكية',
    descEn: 'Industrial IoT, smart city sensors, healthcare IoT, and real-time telemetry platforms for KSA.',
    descAr: 'إنترنت الأشياء الصناعي وأجهزة الاستشعار للمدن الذكية وإنترنت الأشياء الصحية.',
    caps: ['SCADA / OT Monitoring', 'Smart Building BMS', 'Healthcare IoMT', 'Environmental Sensors', 'Edge Computing', 'Digital Twin'],
  },
  {
    id: '6', icon: '📋', color: '#8B5CF6',
    titleEn: 'GRC & Compliance', titleAr: 'الحوكمة والمخاطر والامتثال',
    descEn: 'Governance, risk management and compliance frameworks: CBAHI, HIMSS, ISO, NDMO, PDPL and Vision 2030 alignment.',
    descAr: 'أطر الحوكمة وإدارة المخاطر والامتثال: سباهي و HIMSS و ISO و NDMO و PDPL.',
    caps: ['CBAHI Accreditation', 'HIMSS EMRAM', 'ISO 27001/22301', 'PDPL Privacy', 'NCA-ECC Controls', 'Risk Assessment'],
  },
];

@Component({
  selector: 'app-services-section',
  standalone: true,
  template: `
    <section class="py-24 px-4 bg-white" id="services">
      <div class="container mx-auto max-w-7xl">
        <div class="text-center mb-16">
          <span class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">What We Do</span>
          <h2 class="text-4xl font-bold text-brand-dark mb-4">
            {{ i18n.lang() === 'ar' ? 'خدماتنا الشاملة' : 'Full-Spectrum ICT Services' }}
          </h2>
          <p class="text-gray-600 max-w-3xl mx-auto text-lg">
            {{ i18n.lang() === 'ar' ? 'من الشبكات إلى الأمن السيبراني وإنترنت الأشياء والامتثال — حلول متكاملة للمؤسسات والرعاية الصحية والحكومة.' : 'From network fabric to cybersecurity, IoT, and compliance — integrated solutions for Enterprise, Healthcare & Government.' }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (svc of services; track svc.id) {
            <div class="group rounded-2xl border border-gray-100 p-7 hover:shadow-2xl hover:border-transparent transition-all duration-300 relative overflow-hidden">
              <div class="absolute top-0 left-0 right-0 h-1" [style.background]="svc.color"></div>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" [style.background]="svc.color + '15'">
                  {{ svc.icon }}
                </div>
                <h3 class="font-bold text-lg text-gray-900">{{ i18n.t(svc.titleEn, svc.titleAr) }}</h3>
              </div>
              <p class="text-gray-600 text-sm mb-5 leading-relaxed">{{ i18n.t(svc.descEn, svc.descAr) }}</p>
              <div class="flex flex-wrap gap-1.5">
                @for (c of svc.caps; track c) {
                  <span class="px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-[11px] font-medium border border-gray-100">{{ c }}</span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ServicesSectionComponent {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);
  services = SERVICES_DETAIL;
}
