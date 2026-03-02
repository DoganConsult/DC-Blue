export interface SbgCategory {
  slug: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  seoTitle: { en: string; ar: string };
  seoDesc: { en: string; ar: string };
  productSlugs: string[];
}

export const SBG_CATEGORIES: SbgCategory[] = [
  {
    slug: 'automation',
    name: { en: 'Business Automation', ar: 'أتمتة الأعمال' },
    description: {
      en: 'Streamline operations with intelligent workflow automation, document management, and process orchestration designed for Saudi enterprises.',
      ar: 'تبسيط العمليات من خلال أتمتة سير العمل الذكية وإدارة المستندات وتنسيق العمليات المصممة للمؤسسات السعودية.'
    },
    icon: '⚡',
    seoTitle: { en: 'Business Automation Solutions | SBG', ar: 'حلول أتمتة الأعمال | بوابة الأعمال السعودية' },
    seoDesc: { en: 'Enterprise automation solutions for Saudi businesses aligned with Vision 2030.', ar: 'حلول أتمتة المؤسسات للشركات السعودية المتوافقة مع رؤية 2030.' },
    productSlugs: ['dogan-systems'],
  },
  {
    slug: 'ai',
    name: { en: 'Artificial Intelligence', ar: 'الذكاء الاصطناعي' },
    description: {
      en: 'Leverage AI-powered analytics, predictive compliance, and intelligent decision support to transform your organization.',
      ar: 'استفد من التحليلات المدعومة بالذكاء الاصطناعي والامتثال التنبؤي ودعم القرار الذكي لتحويل مؤسستك.'
    },
    icon: '🧠',
    seoTitle: { en: 'AI Solutions | SBG', ar: 'حلول الذكاء الاصطناعي | بوابة الأعمال السعودية' },
    seoDesc: { en: 'AI-powered solutions for Saudi enterprises and government entities.', ar: 'حلول مدعومة بالذكاء الاصطناعي للمؤسسات والجهات الحكومية السعودية.' },
    productSlugs: ['shahin-ai'],
  },
  {
    slug: 'grc',
    name: { en: 'Governance, Risk & Compliance', ar: 'الحوكمة والمخاطر والامتثال' },
    description: {
      en: 'Comprehensive GRC platform with native DGA, NCA ECC, and PDPL compliance packs — evidence-first, audit-ready.',
      ar: 'منصة حوكمة ومخاطر وامتثال شاملة مع حزم امتثال DGA و NCA ECC و PDPL — قائمة على الأدلة وجاهزة للتدقيق.'
    },
    icon: '🛡️',
    seoTitle: { en: 'GRC Solutions | SBG', ar: 'حلول الحوكمة والمخاطر والامتثال | بوابة الأعمال السعودية' },
    seoDesc: { en: 'Saudi-native GRC platform with DGA, NCA, and PDPL compliance packs.', ar: 'منصة حوكمة سعودية مع حزم امتثال DGA و NCA و PDPL.' },
    productSlugs: ['shahin-ai'],
  },
  {
    slug: 'erp-extensions',
    name: { en: 'ERP Extensions', ar: 'ملحقات تخطيط الموارد' },
    description: {
      en: 'Extend your ERP with governance-enforced modules for finance, HR, projects, and assets — fully integrated with stage gates.',
      ar: 'وسّع نظام تخطيط الموارد بوحدات محكومة للمالية والموارد البشرية والمشاريع والأصول — متكاملة بالكامل مع بوابات المراحل.'
    },
    icon: '🔧',
    seoTitle: { en: 'ERP Extension Solutions | SBG', ar: 'حلول ملحقات تخطيط الموارد | بوابة الأعمال السعودية' },
    seoDesc: { en: 'Governance-enforced ERP extensions for Saudi enterprises.', ar: 'ملحقات تخطيط الموارد المحكومة للمؤسسات السعودية.' },
    productSlugs: ['dogan-systems'],
  },
  {
    slug: 'integration',
    name: { en: 'Integration & APIs', ar: 'التكامل وواجهات البرمجة' },
    description: {
      en: 'Connect your enterprise systems with event-driven integration, API management, and Microsoft-aligned architecture.',
      ar: 'اربط أنظمة مؤسستك بالتكامل القائم على الأحداث وإدارة واجهات البرمجة والبنية المتوافقة مع مايكروسوفت.'
    },
    icon: '🔗',
    seoTitle: { en: 'Integration Solutions | SBG', ar: 'حلول التكامل | بوابة الأعمال السعودية' },
    seoDesc: { en: 'Enterprise integration and API management solutions for Saudi businesses.', ar: 'حلول التكامل وإدارة واجهات البرمجة للشركات السعودية.' },
    productSlugs: ['dogan-systems', 'shahin-ai'],
  },
  {
    slug: 'government',
    name: { en: 'Government Solutions', ar: 'الحلول الحكومية' },
    description: {
      en: 'Purpose-built solutions for Saudi government entities — DGA-compliant, NCA-aligned, PDPL-ready, and Vision 2030 enabled.',
      ar: 'حلول مصممة خصيصاً للجهات الحكومية السعودية — متوافقة مع DGA ومتسقة مع NCA وجاهزة لـ PDPL وممكّنة لرؤية 2030.'
    },
    icon: '🏛️',
    seoTitle: { en: 'Government Digital Solutions | SBG', ar: 'الحلول الرقمية الحكومية | بوابة الأعمال السعودية' },
    seoDesc: { en: 'Digital transformation solutions for Saudi government entities aligned with Vision 2030.', ar: 'حلول التحول الرقمي للجهات الحكومية السعودية المتوافقة مع رؤية 2030.' },
    productSlugs: ['dogan-systems', 'shahin-ai'],
  },
];
