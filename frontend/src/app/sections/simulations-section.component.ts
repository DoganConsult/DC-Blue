import { Component, inject, signal } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { COLOR_PALETTE } from '../core/data/page-styles';

interface Simulation {
  id: string;
  sector: 'healthcare' | 'enterprise' | 'government';
  iconPath: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  color: string;
  metrics: { label: string; value: number; suffix: string; trend: 'up' | 'down' | 'neutral' }[];
  threatLevel?: number;
  complianceScore?: number;
  liveData: { label: string; values: number[] }[];
  insightEn: string;
  insightAr: string;
}

const SIMULATIONS: Simulation[] = [
  {
    id: 'iot-ksa-enterprise',
    sector: 'enterprise',
    iconPath: 'M12 12.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1ZM8.5 15.5a5 5 0 0 1 7 0m-10-3a9 9 0 0 1 14 0m-17-3c5.3-4 11.7-4 17 0',
    titleEn: 'IoT Enterprise — KSA Industrial',
    titleAr: 'إنترنت الأشياء — الصناعة في المملكة',
    subtitleEn: 'Real-time OT/IT convergence monitoring for Saudi industrial facilities',
    subtitleAr: 'مراقبة تقارب OT/IT في الوقت الفعلي للمنشآت الصناعية السعودية',
    color: COLOR_PALETTE.iot.hex,
    metrics: [
      { label: 'Connected Devices', value: 14280, suffix: '', trend: 'up' },
      { label: 'Data Points/sec', value: 2400000, suffix: '', trend: 'up' },
      { label: 'Uptime SLA', value: 99.97, suffix: '%', trend: 'up' },
      { label: 'Anomalies Blocked', value: 847, suffix: '/day', trend: 'down' },
    ],
    threatLevel: 22,
    liveData: [
      { label: 'Sensor Health', values: [98, 97, 99, 98, 99, 97, 98, 99, 98, 99, 97, 99] },
      { label: 'Throughput (Gbps)', values: [12, 14, 13, 15, 14, 16, 15, 14, 16, 15, 17, 16] },
    ],
    insightEn: 'AI predicts 3 SCADA nodes approaching thermal threshold in Jubail facility. Pre-emptive cooling adjustment recommended within 4 hours.',
    insightAr: 'يتوقع الذكاء الاصطناعي اقتراب 3 عقد SCADA من عتبة الحرارة في منشأة الجبيل. يوصى بتعديل التبريد الوقائي خلال 4 ساعات.',
  },
  {
    id: 'iot-healthcare',
    sector: 'healthcare',
    iconPath: 'M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 6v-3h4v3',
    titleEn: 'IoT Healthcare — KSA Smart Hospital',
    titleAr: 'إنترنت الأشياء — المستشفى الذكي في المملكة',
    subtitleEn: 'Connected medical devices, patient monitoring & facility automation',
    subtitleAr: 'أجهزة طبية متصلة ومراقبة المرضى وأتمتة المنشأة',
    color: COLOR_PALETTE.network.hex,
    metrics: [
      { label: 'Medical IoT Devices', value: 3840, suffix: '', trend: 'up' },
      { label: 'Patient Monitors', value: 1200, suffix: '', trend: 'up' },
      { label: 'Alert Response', value: 1.2, suffix: 'sec', trend: 'down' },
      { label: 'Data Encrypted', value: 100, suffix: '%', trend: 'neutral' },
    ],
    complianceScore: 96,
    liveData: [
      { label: 'ICU Monitors Online', values: [120, 119, 120, 120, 118, 120, 120, 119, 120, 120, 120, 120] },
      { label: 'HL7/FHIR Messages/min', values: [840, 920, 880, 950, 910, 870, 960, 890, 940, 900, 930, 910] },
    ],
    insightEn: 'SEHA integration: 98.6% of patient vitals transmitted to central MOH dashboard. 2 infusion pumps flagged for firmware update — zero patient impact.',
    insightAr: 'تكامل صحة: 98.6% من العلامات الحيوية للمرضى تُرسل إلى لوحة وزارة الصحة المركزية. تم تحديد مضختي تسريب لتحديث البرنامج الثابت — بدون تأثير على المرضى.',
  },
  {
    id: 'cybersec-threat',
    sector: 'enterprise',
    iconPath: 'M12 3s-7 3-7 9c0 4.5 3.5 8 7 9 3.5-1 7-4.5 7-9 0-6-7-9-7-9Zm-1.5 10.5 3.5-3.5M9 12l1.5 1.5',
    titleEn: 'Cybersecurity Threat Simulation',
    titleAr: 'محاكاة التهديدات السيبرانية',
    subtitleEn: 'Live SOC feed — attack vectors, SIEM correlation & automated response',
    subtitleAr: 'بث مباشر من مركز العمليات الأمنية — نواقل الهجوم وارتباط SIEM والاستجابة الآلية',
    color: COLOR_PALETTE.threat.hex,
    metrics: [
      { label: 'Events Analyzed', value: 18700000, suffix: '/day', trend: 'up' },
      { label: 'Threats Blocked', value: 42890, suffix: '/day', trend: 'down' },
      { label: 'MTTR', value: 4.2, suffix: 'min', trend: 'down' },
      { label: 'SOC Coverage', value: 99.99, suffix: '%', trend: 'neutral' },
    ],
    threatLevel: 34,
    liveData: [
      { label: 'DDoS Mitigation (Gbps)', values: [2.1, 3.4, 1.8, 5.2, 2.9, 1.4, 4.1, 2.3, 1.9, 3.7, 2.5, 1.6] },
      { label: 'Phishing Attempts', values: [120, 89, 145, 67, 98, 134, 76, 112, 95, 88, 103, 79] },
    ],
    insightEn: 'NCA-ECC aligned SOC detected APT-41 lateral movement attempt. Contained in 3.8 minutes. Zero data exfiltration. CSIRT escalation protocol activated.',
    insightAr: 'اكتشف مركز العمليات المتوافق مع الهيئة الوطنية للأمن السيبراني محاولة حركة جانبية APT-41. تم الاحتواء في 3.8 دقيقة. صفر تسريب بيانات.',
  },
  {
    id: 'healthcare-grc',
    sector: 'healthcare',
    iconPath: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1H9V5Zm0 9 2 2 4-4',
    titleEn: 'Healthcare GRC — CBAHI & HIMSS',
    titleAr: 'الحوكمة والمخاطر والامتثال — سباهي و HIMSS',
    subtitleEn: 'Governance, Risk & Compliance dashboard for healthcare facilities in KSA',
    subtitleAr: 'لوحة الحوكمة والمخاطر والامتثال لمنشآت الرعاية الصحية في المملكة',
    color: COLOR_PALETTE.integration.hex,
    metrics: [
      { label: 'CBAHI Score', value: 94.7, suffix: '%', trend: 'up' },
      { label: 'HIMSS Level', value: 6, suffix: '/7', trend: 'up' },
      { label: 'Risk Items Open', value: 12, suffix: '', trend: 'down' },
      { label: 'Policy Compliance', value: 97.3, suffix: '%', trend: 'up' },
    ],
    complianceScore: 94,
    liveData: [
      { label: 'Audit Findings Resolved', values: [85, 88, 91, 89, 93, 94, 92, 95, 93, 96, 94, 97] },
      { label: 'Training Completion %', values: [78, 82, 85, 87, 89, 91, 88, 92, 90, 93, 91, 94] },
    ],
    insightEn: 'CBAHI re-accreditation in 47 days. 12 of 14 critical findings resolved. EMR access audit shows 3 role-based access violations requiring immediate remediation.',
    insightAr: 'إعادة اعتماد سباهي خلال 47 يومًا. تم حل 12 من 14 ملاحظة حرجة. تدقيق الوصول للسجل الطبي الإلكتروني يظهر 3 انتهاكات وصول تتطلب معالجة فورية.',
  },
  {
    id: 'quasi-compliance',
    sector: 'healthcare',
    iconPath: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10 10v4m2-2H8',
    titleEn: 'Quality & Safety (Quasi) Simulation',
    titleAr: 'محاكاة الجودة والسلامة (كواسي)',
    subtitleEn: 'Patient safety indicators, quality metrics & accreditation readiness',
    subtitleAr: 'مؤشرات سلامة المرضى ومقاييس الجودة وجاهزية الاعتماد',
    color: COLOR_PALETTE.grc.hex,
    metrics: [
      { label: 'Quality Score', value: 92.1, suffix: '%', trend: 'up' },
      { label: 'Patient Safety Index', value: 96.4, suffix: '%', trend: 'up' },
      { label: 'Near-Miss Reports', value: 23, suffix: '/mo', trend: 'down' },
      { label: 'Corrective Actions', value: 98, suffix: '% closed', trend: 'up' },
    ],
    complianceScore: 92,
    liveData: [
      { label: 'Incident Reports Trend', values: [18, 15, 17, 13, 14, 11, 12, 10, 13, 9, 11, 8] },
      { label: 'Staff Compliance %', values: [88, 89, 91, 90, 93, 92, 94, 93, 95, 94, 96, 95] },
    ],
    insightEn: 'Medication error rate decreased 34% after barcode verification rollout. Hand hygiene compliance at 96.4% — above MOH 90% target. 3 departments flagged for re-training.',
    insightAr: 'انخفض معدل أخطاء الأدوية 34% بعد تطبيق التحقق بالباركود. الامتثال لنظافة اليدين 96.4% — أعلى من هدف وزارة الصحة 90%.',
  },
  {
    id: 'gov-digital-transform',
    sector: 'government',
    iconPath: 'M12 2L2 7h20l-10-5ZM4 9v8m4-8v8m4-8v8m4-8v8m4-8v8M2 19h20M3 21h18',
    titleEn: 'Government Digital Transformation',
    titleAr: 'التحول الرقمي الحكومي',
    subtitleEn: 'Vision 2030 e-government platform monitoring & citizen services uptime',
    subtitleAr: 'مراقبة منصة الحكومة الإلكترونية لرؤية 2030 ووقت تشغيل خدمات المواطنين',
    color: COLOR_PALETTE.cybersecurity.hex,
    metrics: [
      { label: 'Services Digitized', value: 94, suffix: '%', trend: 'up' },
      { label: 'Citizen Transactions/day', value: 840000, suffix: '', trend: 'up' },
      { label: 'Platform Uptime', value: 99.95, suffix: '%', trend: 'up' },
      { label: 'Avg Response Time', value: 180, suffix: 'ms', trend: 'down' },
    ],
    complianceScore: 97,
    liveData: [
      { label: 'API Calls (millions)', values: [4.2, 4.8, 5.1, 4.9, 5.3, 5.6, 5.4, 5.8, 5.5, 5.9, 6.1, 5.7] },
      { label: 'User Satisfaction', values: [88, 89, 90, 91, 90, 92, 91, 93, 92, 94, 93, 95] },
    ],
    insightEn: 'Absher integration processing 840K daily transactions. NIC single sign-on achieving 99.95% uptime. Recommended: scale API gateway ahead of Hajj season surge.',
    insightAr: 'تكامل أبشر يعالج 840 ألف معاملة يومية. الدخول الموحد يحقق 99.95% وقت تشغيل. يوصى بتوسيع بوابة API قبل موسم الحج.',
  },
  {
    id: 'nca-ecc-compliance',
    sector: 'government',
    iconPath: 'M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z',
    titleEn: 'NCA-ECC Compliance Dashboard',
    titleAr: 'لوحة امتثال الهيئة الوطنية للأمن السيبراني',
    subtitleEn: 'Essential Cybersecurity Controls — real-time compliance posture',
    subtitleAr: 'الضوابط الأساسية للأمن السيبراني — وضع الامتثال في الوقت الفعلي',
    color: COLOR_PALETTE.healthcare.hex,
    metrics: [
      { label: 'ECC Controls Met', value: 112, suffix: '/114', trend: 'up' },
      { label: 'Critical Gaps', value: 2, suffix: '', trend: 'down' },
      { label: 'Last Audit Score', value: 96.5, suffix: '%', trend: 'up' },
      { label: 'Remediation SLA', value: 98, suffix: '% on-time', trend: 'up' },
    ],
    complianceScore: 98,
    liveData: [
      { label: 'Controls Compliance %', values: [89, 91, 92, 93, 94, 95, 94, 96, 95, 97, 96, 98] },
      { label: 'Vulnerability Patches', values: [145, 132, 128, 115, 109, 98, 102, 89, 95, 82, 78, 71] },
    ],
    insightEn: '112 of 114 ECC controls fully implemented. 2 remaining: privileged access review automation and cloud workload classification. Target closure: 14 days.',
    insightAr: 'تم تنفيذ 112 من 114 ضابط ECC بالكامل. المتبقي: أتمتة مراجعة الوصول المميز وتصنيف أحمال العمل السحابية. الموعد المستهدف: 14 يومًا.',
  },
  {
    id: 'enterprise-sdn',
    sector: 'enterprise',
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 2c1.93 0 3.5 3.58 3.5 8s-1.57 8-3.5 8-3.5-3.58-3.5-8 1.57-8 3.5-8ZM3 12h18',
    titleEn: 'SD-WAN & Network Fabric',
    titleAr: 'SD-WAN ونسيج الشبكة',
    subtitleEn: 'Multi-site enterprise network orchestration with AI-driven path selection',
    subtitleAr: 'تنسيق شبكة المؤسسة متعددة المواقع مع اختيار المسار المدعوم بالذكاء الاصطناعي',
    color: COLOR_PALETTE.cloud.hex,
    metrics: [
      { label: 'Sites Connected', value: 47, suffix: '', trend: 'up' },
      { label: 'WAN Optimization', value: 68, suffix: '% saved', trend: 'up' },
      { label: 'Failover Time', value: 0.3, suffix: 'sec', trend: 'down' },
      { label: 'Jitter (critical)', value: 1.2, suffix: 'ms', trend: 'down' },
    ],
    liveData: [
      { label: 'Bandwidth Utilization %', values: [45, 52, 48, 55, 50, 58, 53, 49, 56, 51, 54, 47] },
      { label: 'Path Quality Score', values: [94, 95, 93, 96, 95, 97, 96, 94, 97, 96, 98, 97] },
    ],
    insightEn: '47-site SD-WAN mesh achieving 68% bandwidth savings via AI path selection. MPLS fallback triggered 0 times in 30 days. Recommended: enable SaaS breakout for Riyadh HQ.',
    insightAr: 'شبكة SD-WAN من 47 موقعًا تحقق 68% توفيرًا في النطاق الترددي. لم يتم تفعيل MPLS الاحتياطي خلال 30 يومًا.',
  },
  {
    id: 'healthcare-emr',
    sector: 'healthcare',
    iconPath: 'M4.5 12.75l6 6 9-13.5',
    titleEn: 'EMR Infrastructure & HL7 FHIR',
    titleAr: 'بنية السجل الطبي الإلكتروني و HL7 FHIR',
    subtitleEn: 'Electronic Medical Record platform performance, interoperability & data integrity',
    subtitleAr: 'أداء منصة السجل الطبي الإلكتروني والتشغيل البيني وسلامة البيانات',
    color: COLOR_PALETTE.digitalTwin.hex,
    metrics: [
      { label: 'EMR Uptime', value: 99.99, suffix: '%', trend: 'up' },
      { label: 'Records Processed', value: 2400000, suffix: '/day', trend: 'up' },
      { label: 'Integration Points', value: 34, suffix: ' systems', trend: 'up' },
      { label: 'Data Integrity', value: 100, suffix: '%', trend: 'neutral' },
    ],
    complianceScore: 99,
    liveData: [
      { label: 'Query Response (ms)', values: [45, 42, 48, 43, 41, 47, 44, 42, 46, 43, 41, 44] },
      { label: 'FHIR API Success Rate %', values: [99.8, 99.9, 99.7, 99.9, 99.8, 99.9, 100, 99.9, 99.8, 99.9, 100, 99.9] },
    ],
    insightEn: 'Cerner-to-Epic bridge processing 2.4M records/day with 100% data integrity. 34 clinical systems integrated via HL7 FHIR R4. DR failover tested: RTO 4 min, RPO 0.',
    insightAr: 'جسر Cerner-Epic يعالج 2.4 مليون سجل/يوم بسلامة بيانات 100%. 34 نظامًا سريريًا متكاملاً عبر HL7 FHIR R4.',
  },
  {
    id: 'gov-smart-city',
    sector: 'government',
    iconPath: 'M3 21h18M5 21V7l5-4v18m4 0V10l5 2v9M9 9h1m-1 3h1m4 3h1m-1 3h1',
    titleEn: 'Smart City IoT — NEOM / The Line',
    titleAr: 'إنترنت الأشياء للمدن الذكية — نيوم / ذا لاين',
    subtitleEn: 'Urban IoT mesh, traffic optimization, environmental monitoring & public safety',
    subtitleAr: 'شبكة إنترنت الأشياء الحضرية وتحسين حركة المرور والمراقبة البيئية والسلامة العامة',
    color: COLOR_PALETTE.smartCity.hex,
    metrics: [
      { label: 'IoT Nodes', value: 284000, suffix: '', trend: 'up' },
      { label: 'Traffic Optimization', value: 31, suffix: '% faster', trend: 'up' },
      { label: 'Energy Savings', value: 24, suffix: '%', trend: 'up' },
      { label: 'Air Quality Index', value: 42, suffix: ' (Good)', trend: 'down' },
    ],
    liveData: [
      { label: 'Sensor Uptime %', values: [99.1, 99.3, 99.2, 99.4, 99.3, 99.5, 99.4, 99.6, 99.5, 99.7, 99.6, 99.8] },
      { label: 'Alerts Resolved/hr', values: [34, 28, 31, 25, 29, 22, 26, 20, 24, 18, 21, 16] },
    ],
    insightEn: '284K IoT nodes across smart city mesh. Traffic flow optimized 31% via AI signal control. Energy consumption reduced 24% through smart grid integration.',
    insightAr: '284 ألف عقدة IoT عبر شبكة المدينة الذكية. تحسين تدفق المرور 31% عبر التحكم بالإشارات بالذكاء الاصطناعي.',
  },
];

@Component({
  selector: 'app-simulations-section',
  standalone: true,
  imports: [],
  template: `
    <section class="py-24 px-4 bg-gradient-to-b from-brand-darker via-surface-dark to-brand-darker text-white" id="simulations">
      <div class="container mx-auto max-w-7xl">

        <!-- Header -->
        <div class="text-center mb-6">
          <span class="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold tracking-wider uppercase mb-4">Live Simulations</span>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
            {{ i18n.t('Enterprise-Grade ICT Simulations', 'محاكاة تقنية المعلومات على مستوى المؤسسات') }}
          </h2>
          <p class="text-th-text-3 max-w-3xl mx-auto text-lg">
            {{ i18n.t('Real-world IoT, cybersecurity, GRC & compliance dashboards powering Healthcare, Enterprise & Government across Saudi Arabia.', 'لوحات إنترنت الأشياء والأمن السيبراني والحوكمة والامتثال الواقعية التي تخدم الرعاية الصحية والمؤسسات والحكومة في المملكة العربية السعودية.') }}
          </p>
        </div>

        <!-- Sector filter -->
        <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          <button (click)="filter.set('all')" class="px-4 py-2 rounded-xl text-sm font-medium transition"
                  [class.bg-sky-600]="filter()==='all'" [class.text-white]="filter()==='all'"
                  [class.bg-th-bg-tert]="filter()!=='all'" [class.text-th-text-3]="filter()!=='all'">All (10)</button>
          <button (click)="filter.set('healthcare')" class="px-4 py-2 rounded-xl text-sm font-medium transition"
                  [class.bg-sky-600]="filter()==='healthcare'" [class.text-white]="filter()==='healthcare'"
                  [class.bg-th-bg-tert]="filter()!=='healthcare'" [class.text-th-text-3]="filter()!=='healthcare'">Healthcare (4)</button>
          <button (click)="filter.set('enterprise')" class="px-4 py-2 rounded-xl text-sm font-medium transition"
                  [class.bg-sky-600]="filter()==='enterprise'" [class.text-white]="filter()==='enterprise'"
                  [class.bg-th-bg-tert]="filter()!=='enterprise'" [class.text-th-text-3]="filter()!=='enterprise'">Enterprise (3)</button>
          <button (click)="filter.set('government')" class="px-4 py-2 rounded-xl text-sm font-medium transition"
                  [class.bg-sky-600]="filter()==='government'" [class.text-white]="filter()==='government'"
                  [class.bg-th-bg-tert]="filter()!=='government'" [class.text-th-text-3]="filter()!=='government'">Government (3)</button>
        </div>

        <!-- Active simulation detail -->
        <div class="mb-12">
          <div class="bg-surface-dark/80 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
            <!-- Header bar -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/10">
              <div class="flex items-center gap-3">
                <svg class="w-7 h-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="activeSim().iconPath" /></svg>
                <div>
                  <h3 class="font-bold text-lg">{{ i18n.t(activeSim().titleEn, activeSim().titleAr) }}</h3>
                  <p class="text-th-text-3 text-xs">{{ i18n.t(activeSim().subtitleEn, activeSim().subtitleAr) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      [class.bg-emerald-900]="!activeSim().threatLevel || activeSim().threatLevel! < 30"
                      [class.text-emerald-400]="!activeSim().threatLevel || activeSim().threatLevel! < 30"
                      [class.bg-amber-900]="activeSim().threatLevel! >= 30 && activeSim().threatLevel! < 60"
                      [class.text-amber-400]="activeSim().threatLevel! >= 30 && activeSim().threatLevel! < 60"
                      [class.bg-red-900]="activeSim().threatLevel! >= 60"
                      [class.text-red-400]="activeSim().threatLevel! >= 60">
                  <span class="w-2 h-2 rounded-full animate-pulse"
                        [class.bg-emerald-400]="!activeSim().threatLevel || activeSim().threatLevel! < 30"
                        [class.bg-amber-400]="activeSim().threatLevel! >= 30 && activeSim().threatLevel! < 60"
                        [class.bg-red-400]="activeSim().threatLevel! >= 60"></span>
                  {{ activeSim().threatLevel ? 'Threat: ' + activeSim().threatLevel + '%' : 'Status: Nominal' }}
                </span>
                @if (activeSim().complianceScore) {
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900 text-emerald-400 text-xs font-medium">
                  Compliance: {{ activeSim().complianceScore }}%
                </span>
                }
              </div>
            </div>

            <!-- Metrics row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
              @for (m of activeSim().metrics; track m.label) {
                <div class="bg-surface-dark p-5">
                  <p class="text-th-text-3 text-xs mb-1">{{ m.label }}</p>
                  <p class="text-2xl font-bold" [style.color]="activeSim().color">{{ formatNum(m.value) }}{{ m.suffix }}</p>
                  <span class="text-xs" [class.text-emerald-400]="m.trend==='up'||m.trend==='down'" [class.text-th-text-3]="m.trend==='neutral'">
                    {{ m.trend === 'up' ? '&#9650;' : m.trend === 'down' ? '&#9660;' : '&#8212;' }}
                    {{ m.trend === 'neutral' ? 'Stable' : m.trend === 'up' ? 'Improving' : 'Reducing' }}
                  </span>
                </div>
              }
            </div>

            <!-- Chart area (CSS bars) + AI Insight -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
              @for (d of activeSim().liveData; track d.label) {
                <div class="bg-surface-dark p-5">
                  <p class="text-th-text-3 text-xs mb-3">{{ d.label }}</p>
                  <div class="flex items-end gap-1 h-16">
                    @for (v of d.values; track $index) {
                      <div class="flex-1 rounded-t transition-all duration-500"
                           [style.height.%]="(v / maxVal(d.values)) * 100"
                           [style.background]="activeSim().color"
                           [style.opacity]="0.4 + ($index / d.values.length) * 0.6"></div>
                    }
                  </div>
                </div>
              }
              <div class="bg-surface-dark p-5 lg:col-span-1">
                <p class="text-xs text-sky-400 font-semibold mb-2 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456Z" /></svg>
                  AI Insight
                </p>
                <p class="text-th-text-3 text-sm leading-relaxed">{{ i18n.t(activeSim().insightEn, activeSim().insightAr) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Simulation cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          @for (sim of filteredSims(); track sim.id) {
            <div (click)="activeSim.set(sim)"
                 class="rounded-xl border p-4 cursor-pointer transition-all hover:-translate-y-0.5"
                 [class.border-sky-500]="activeSim().id === sim.id"
                 [class.bg-sky-950]="activeSim().id === sim.id"
                 [class.border-th-border-dk]="activeSim().id !== sim.id"
                 [class.bg-surface-dark]="activeSim().id !== sim.id"
                 [class.hover:border-th-border]="activeSim().id !== sim.id">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="sim.iconPath" /></svg>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                      [class.bg-sky-900]="sim.sector==='healthcare'" [class.text-sky-400]="sim.sector==='healthcare'"
                      [class.bg-amber-900]="sim.sector==='enterprise'" [class.text-amber-400]="sim.sector==='enterprise'"
                      [class.bg-emerald-900]="sim.sector==='government'" [class.text-emerald-400]="sim.sector==='government'">
                  {{ sim.sector }}
                </span>
              </div>
              <p class="font-semibold text-sm text-white leading-tight">{{ i18n.t(sim.titleEn, sim.titleAr) }}</p>
              <p class="text-th-text-2 text-[11px] mt-1 line-clamp-2">{{ i18n.t(sim.subtitleEn, sim.subtitleAr) }}</p>
            </div>
          }
        </div>

      </div>
    </section>
  `,
  styles: [],
})
export class SimulationsSectionComponent {
  i18n = inject(I18nService);
  filter = signal<'all' | 'healthcare' | 'enterprise' | 'government'>('all');
  activeSim = signal<Simulation>(SIMULATIONS[0]);
  allSims = SIMULATIONS;

  filteredSims() {
    const f = this.filter();
    return f === 'all' ? this.allSims : this.allSims.filter(s => s.sector === f);
  }

  maxVal(arr: number[]): number {
    return Math.max(...arr) || 1;
  }

  formatNum(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
    return n.toString();
  }
}
