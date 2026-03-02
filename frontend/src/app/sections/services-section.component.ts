import { Component, input, inject } from '@angular/core';
import { LandingContent } from '../core/models/landing.model';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { COLOR_PALETTE } from '../core/data/page-styles';

const SERVICE_ICON_PATHS: Record<string, string> = {
  '1': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 2c1.93 0 3.5 3.58 3.5 8s-1.57 8-3.5 8-3.5-3.58-3.5-8 1.57-8 3.5-8ZM3 12h18M4.2 7.5h15.6M4.2 16.5h15.6',
  '2': 'M12 3s-7 3-7 9c0 4.5 3.5 8 7 9 3.5-1 7-4.5 7-9 0-6-7-9-7-9Zm-1.5 10.5 3.5-3.5M9 12l1.5 1.5',
  '3': 'M6.5 19h11a4.5 4.5 0 0 0 .44-8.97 5.5 5.5 0 0 0-10.38-1.74A3.5 3.5 0 0 0 6.5 19Z',
  '4': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  '5': 'M12 12.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1ZM8.5 15.5a5 5 0 0 1 7 0m-10-3a9 9 0 0 1 14 0m-17-3c5.3-4 11.7-4 17 0',
  '6': 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1H9V5Zm0 9 2 2 4-4',
};

const SERVICES_DETAIL = [
  {
    id: '1', iconPath: SERVICE_ICON_PATHS['1'], color: COLOR_PALETTE.network.hex,
    titleEn: 'Network & Data Center', titleAr: 'الشبكات ومركز البيانات',
    descEn: 'Enterprise campus, WAN/SD-WAN, data center fabric, and hyperconverged infrastructure design, build and operate.',
    descAr: 'تصميم وبناء وتشغيل شبكات الحرم الجامعي ومركز البيانات والبنية فائقة التقارب.',
    caps: ['Cisco ACI / DNA Center', 'Aruba / HPE Fabric', 'VMware NSX / vSAN', 'Tier III/IV DC Design', 'SD-WAN Orchestration', 'Network Automation'],
  },
  {
    id: '2', iconPath: SERVICE_ICON_PATHS['2'], color: COLOR_PALETTE.cybersecurity.hex,
    titleEn: 'Cybersecurity', titleAr: 'الأمن السيبراني',
    descEn: 'End-to-end security operations: SOC/SIEM, threat intel, penetration testing, NCA-ECC compliance, and incident response.',
    descAr: 'عمليات أمنية شاملة: SOC/SIEM والاستخبارات الأمنية واختبار الاختراق والامتثال لـ NCA-ECC.',
    caps: ['24/7 SOC-as-a-Service', 'NCA-ECC / ISO 27001', 'Pen Testing & Red Team', 'Zero Trust Architecture', 'OT/ICS Security', 'Threat Intelligence'],
  },
  {
    id: '3', iconPath: SERVICE_ICON_PATHS['3'], color: COLOR_PALETTE.cloud.hex,
    titleEn: 'Cloud & DevOps', titleAr: 'السحابة و DevOps',
    descEn: 'Multi-cloud architecture, containerization, CI/CD pipelines, and cloud-native application platforms.',
    descAr: 'بنية متعددة السحب والحاويات وخطوط CI/CD ومنصات التطبيقات السحابية.',
    caps: ['AWS / Azure / GCP', 'Kubernetes / OpenShift', 'Terraform / Ansible IaC', 'GitOps CI/CD', 'Serverless Architecture', 'Cloud Cost Optimization'],
  },
  {
    id: '4', iconPath: SERVICE_ICON_PATHS['4'], color: COLOR_PALETTE.integration.hex,
    titleEn: 'Systems Integration', titleAr: 'تكامل الأنظمة',
    descEn: 'ERP, EMR, IoT platforms, and enterprise middleware integration with end-to-end project delivery.',
    descAr: 'تكامل أنظمة ERP و EMR ومنصات إنترنت الأشياء والبرمجيات الوسيطة.',
    caps: ['SAP / Oracle Integration', 'HL7 FHIR / EMR Bridge', 'IoT Platform Integration', 'API Gateway & ESB', 'Data Migration', 'Legacy Modernization'],
  },
  {
    id: '5', iconPath: SERVICE_ICON_PATHS['5'], color: COLOR_PALETTE.iot.hex,
    titleEn: 'IoT & Smart Solutions', titleAr: 'إنترنت الأشياء والحلول الذكية',
    descEn: 'Industrial IoT, smart city sensors, healthcare IoT, and real-time telemetry platforms for KSA.',
    descAr: 'إنترنت الأشياء الصناعي وأجهزة الاستشعار للمدن الذكية وإنترنت الأشياء الصحية.',
    caps: ['SCADA / OT Monitoring', 'Smart Building BMS', 'Healthcare IoMT', 'Environmental Sensors', 'Edge Computing', 'Digital Twin'],
  },
  {
    id: '6', iconPath: SERVICE_ICON_PATHS['6'], color: COLOR_PALETTE.grc.hex,
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
    <section class="bg-th-card" id="services" [class]="ds.section.wrapperLg">
      <div [class]="ds.section.containerWide">
        <div class="text-center mb-16">
          <span class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">{{ i18n.t('What We Do', 'ما نقدمه') }}</span>
          <h2 class="text-4xl font-bold text-brand-dark mb-4">
            {{ i18n.t('Full-Spectrum ICT Services', 'خدماتنا الشاملة') }}
          </h2>
          <p class="text-th-text-2 max-w-3xl mx-auto text-lg">
            {{ i18n.t('From network fabric to cybersecurity, IoT, and compliance — integrated solutions for Enterprise, Healthcare & Government.', 'من الشبكات إلى الأمن السيبراني وإنترنت الأشياء والامتثال — حلول متكاملة للمؤسسات والرعاية الصحية والحكومة.') }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" [class]="ds.spacing.gapXl">
          @for (svc of services; track svc.id) {
            <div class="group border border-th-border-lt relative overflow-hidden hover:shadow-2xl hover:border-transparent" [class]="ds.radius.card + ' ' + ds.component.cardPadding + ' ' + ds.transition.base">
              <div class="absolute top-0 left-0 right-0 h-1" [style.background]="svc.color"></div>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center" [style.background]="svc.color + '15'">
                  <svg class="w-6 h-6" [style.color]="svc.color" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="svc.iconPath" /></svg>
                </div>
                <h3 class="font-bold text-lg text-th-text">{{ i18n.t(svc.titleEn, svc.titleAr) }}</h3>
              </div>
              <p class="text-th-text-2 text-sm mb-5 leading-relaxed">{{ i18n.t(svc.descEn, svc.descAr) }}</p>
              <div class="flex flex-wrap gap-1.5">
                @for (c of svc.caps; track c) {
                  <span class="px-2 py-1 rounded-md bg-th-bg-alt text-th-text-3 text-[11px] font-medium border border-th-border-lt">{{ c }}</span>
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
  ds = inject(DesignSystemService);
  services = SERVICES_DETAIL;
}
