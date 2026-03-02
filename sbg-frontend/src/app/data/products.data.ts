export interface SbgProduct {
  slug: string;
  name: { en: string; ar: string };
  tagline: { en: string; ar: string };
  category: string;
  deployment: 'saas' | 'hybrid' | 'enterprise';
  icon: string;
  sections: {
    overview: { en: string; ar: string };
    outcomes: { icon: string; title: { en: string; ar: string }; desc: { en: string; ar: string } }[];
    howItWorks: { step: number; title: { en: string; ar: string }; desc: { en: string; ar: string } }[];
    audience: { en: string; ar: string }[];
    security: { en: string; ar: string }[];
    commercial: { en: string; ar: string };
  };
}

export const SBG_PRODUCTS: SbgProduct[] = [
  {
    slug: 'dogan-systems',
    name: { en: 'Dogan Systems', ar: 'أنظمة دوغان' },
    tagline: {
      en: 'Enterprise Automation & ERP Platform',
      ar: 'منصة أتمتة المؤسسات وتخطيط الموارد'
    },
    category: 'automation',
    deployment: 'hybrid',
    icon: '⚙️',
    sections: {
      overview: {
        en: 'Dogan Systems is a comprehensive enterprise automation and ERP platform that combines governance-enforced workflows, intelligent document management, and full-spectrum business process orchestration. Built for Saudi enterprises and aligned with Vision 2030 digital transformation objectives.',
        ar: 'أنظمة دوغان هي منصة شاملة لأتمتة المؤسسات وتخطيط الموارد تجمع بين سير العمل المحكوم وإدارة المستندات الذكية وتنسيق عمليات الأعمال الكاملة. مصممة للمؤسسات السعودية ومتوافقة مع أهداف التحول الرقمي لرؤية 2030.'
      },
      outcomes: [
        {
          icon: '📊',
          title: { en: 'Operational Efficiency', ar: 'الكفاءة التشغيلية' },
          desc: { en: 'Reduce manual processes by up to 70% with intelligent automation and stage-gate workflows.', ar: 'تقليل العمليات اليدوية بنسبة تصل إلى 70٪ من خلال الأتمتة الذكية وسير عمل بوابات المراحل.' }
        },
        {
          icon: '🔒',
          title: { en: 'Governance Compliance', ar: 'امتثال الحوكمة' },
          desc: { en: 'Built-in compliance with Saudi regulatory requirements — every action is auditable and evidence-linked.', ar: 'امتثال مدمج للمتطلبات التنظيمية السعودية — كل إجراء قابل للتدقيق ومرتبط بالأدلة.' }
        },
        {
          icon: '💰',
          title: { en: 'Cost Optimization', ar: 'تحسين التكاليف' },
          desc: { en: 'Unified platform eliminates redundant systems, reducing total cost of ownership by 40%.', ar: 'المنصة الموحدة تلغي الأنظمة المتكررة وتقلل التكلفة الإجمالية للملكية بنسبة 40٪.' }
        },
        {
          icon: '📈',
          title: { en: 'Scalable Growth', ar: 'النمو القابل للتوسع' },
          desc: { en: 'Multi-tenant architecture scales from 10 to 10,000+ users without performance degradation.', ar: 'بنية متعددة المستأجرين تتوسع من 10 إلى أكثر من 10,000 مستخدم دون تدهور الأداء.' }
        },
      ],
      howItWorks: [
        { step: 1, title: { en: 'Assessment', ar: 'التقييم' }, desc: { en: 'We analyze your current systems, processes, and compliance requirements.', ar: 'نحلل أنظمتك الحالية وعملياتك ومتطلبات الامتثال.' } },
        { step: 2, title: { en: 'Configuration', ar: 'التهيئة' }, desc: { en: 'Platform is configured with your workflows, stage gates, and governance rules.', ar: 'يتم تهيئة المنصة بسير عملك وبوابات المراحل وقواعد الحوكمة.' } },
        { step: 3, title: { en: 'Integration', ar: 'التكامل' }, desc: { en: 'Seamless integration with your existing ERP, Microsoft stack, and third-party systems.', ar: 'تكامل سلس مع نظام تخطيط الموارد الحالي ومنتجات مايكروسوفت والأنظمة الخارجية.' } },
        { step: 4, title: { en: 'Go-Live & Support', ar: 'الإطلاق والدعم' }, desc: { en: 'Governed go-live with evidence-based delivery and ongoing managed support.', ar: 'إطلاق محكوم مع تسليم قائم على الأدلة ودعم مُدار مستمر.' } },
      ],
      audience: [
        { en: 'Large Saudi enterprises (500+ employees)', ar: 'المؤسسات السعودية الكبرى (أكثر من 500 موظف)' },
        { en: 'Government entities and ministries', ar: 'الجهات الحكومية والوزارات' },
        { en: 'Critical infrastructure operators', ar: 'مشغلو البنية التحتية الحيوية' },
        { en: 'Organizations undergoing digital transformation', ar: 'المنظمات التي تخضع للتحول الرقمي' },
      ],
      security: [
        { en: 'Zero-Trust architecture with identity-first design', ar: 'بنية عدم الثقة مع تصميم قائم على الهوية' },
        { en: 'End-to-end encryption at rest and in transit', ar: 'تشفير شامل للبيانات في حالة السكون والنقل' },
        { en: 'NCA ECC-aligned security controls', ar: 'ضوابط أمنية متوافقة مع NCA ECC' },
        { en: 'Saudi data residency compliance', ar: 'امتثال إقامة البيانات السعودية' },
        { en: 'Immutable audit trails', ar: 'سجلات تدقيق غير قابلة للتغيير' },
      ],
      commercial: {
        en: 'Flexible licensing: SaaS subscription, hybrid deployment, or enterprise on-premise. All plans include governance enforcement, evidence vault, and 24/7 Saudi-based support.',
        ar: 'ترخيص مرن: اشتراك SaaS أو نشر هجين أو محلي للمؤسسات. جميع الخطط تشمل إنفاذ الحوكمة وخزنة الأدلة ودعم سعودي على مدار الساعة.'
      },
    },
  },
  {
    slug: 'shahin-ai',
    name: { en: 'Shahin AI', ar: 'شاهين AI' },
    tagline: {
      en: 'GRC & Regulatory Intelligence Platform',
      ar: 'منصة الحوكمة والمخاطر والامتثال والذكاء التنظيمي'
    },
    category: 'grc',
    deployment: 'saas',
    icon: '🦅',
    sections: {
      overview: {
        en: 'Shahin AI is a Saudi-native GRC platform that turns regulatory requirements into executable controls. With native DGA, NCA ECC, and PDPL compliance packs, AI-powered gap analysis, and evidence-first audit readiness, Shahin AI ensures your organization is always compliant — not just during inspections.',
        ar: 'شاهين AI هي منصة حوكمة ومخاطر وامتثال سعودية أصيلة تحول المتطلبات التنظيمية إلى ضوابط قابلة للتنفيذ. مع حزم امتثال DGA و NCA ECC و PDPL الأصلية وتحليل الفجوات المدعوم بالذكاء الاصطناعي والجاهزية للتدقيق القائمة على الأدلة، يضمن شاهين AI أن مؤسستك متوافقة دائماً — وليس فقط أثناء عمليات التفتيش.'
      },
      outcomes: [
        {
          icon: '✅',
          title: { en: 'Continuous Compliance', ar: 'الامتثال المستمر' },
          desc: { en: 'Real-time compliance scoring with automatic gap detection and remediation tracking.', ar: 'تسجيل الامتثال في الوقت الفعلي مع كشف الفجوات التلقائي وتتبع المعالجة.' }
        },
        {
          icon: '📋',
          title: { en: 'Audit-Ready in Hours', ar: 'جاهز للتدقيق في ساعات' },
          desc: { en: 'Generate authority-ready audit packages with mapped evidence in hours, not weeks.', ar: 'إنشاء حزم تدقيق جاهزة للجهات الرقابية مع أدلة مرتبطة في ساعات وليس أسابيع.' }
        },
        {
          icon: '🤖',
          title: { en: 'AI-Powered Insights', ar: 'رؤى مدعومة بالذكاء الاصطناعي' },
          desc: { en: 'Predictive risk analysis, evidence completeness scoring, and intelligent compliance recommendations.', ar: 'تحليل المخاطر التنبؤي وتسجيل اكتمال الأدلة وتوصيات الامتثال الذكية.' }
        },
        {
          icon: '🏛️',
          title: { en: 'Saudi Authority-Ready', ar: 'جاهز للجهات السعودية' },
          desc: { en: 'Native support for DGA, NCA, PDPL with authority-specific reporting and evidence formats.', ar: 'دعم أصلي لـ DGA و NCA و PDPL مع تقارير وتنسيقات أدلة خاصة بكل جهة.' }
        },
      ],
      howItWorks: [
        { step: 1, title: { en: 'Framework Selection', ar: 'اختيار الإطار' }, desc: { en: 'Choose applicable regulatory frameworks: DGA, NCA ECC, PDPL, ISO 27001.', ar: 'اختر الأطر التنظيمية المطبقة: DGA أو NCA ECC أو PDPL أو ISO 27001.' } },
        { step: 2, title: { en: 'Baseline Assessment', ar: 'تقييم خط الأساس' }, desc: { en: 'AI-powered assessment identifies gaps, scores readiness, and prioritizes remediation.', ar: 'التقييم المدعوم بالذكاء الاصطناعي يحدد الفجوات ويسجل الجاهزية ويرتب أولويات المعالجة.' } },
        { step: 3, title: { en: 'Evidence Management', ar: 'إدارة الأدلة' }, desc: { en: 'Collect, map, and validate evidence against controls with automated workflows.', ar: 'جمع وربط والتحقق من الأدلة مقابل الضوابط من خلال سير عمل آلي.' } },
        { step: 4, title: { en: 'Continuous Monitoring', ar: 'المراقبة المستمرة' }, desc: { en: 'Real-time dashboards, automated alerts, and authority-ready report generation.', ar: 'لوحات معلومات في الوقت الفعلي وتنبيهات آلية وإنشاء تقارير جاهزة للجهات الرقابية.' } },
      ],
      audience: [
        { en: 'Compliance officers and CISOs', ar: 'مسؤولو الامتثال ومديرو أمن المعلومات' },
        { en: 'Government entities subject to DGA/NCA', ar: 'الجهات الحكومية الخاضعة لـ DGA/NCA' },
        { en: 'Organizations processing personal data (PDPL)', ar: 'المنظمات التي تعالج البيانات الشخصية (PDPL)' },
        { en: 'Internal audit and risk management teams', ar: 'فرق التدقيق الداخلي وإدارة المخاطر' },
      ],
      security: [
        { en: 'Evidence vault with immutable storage', ar: 'خزنة أدلة بتخزين غير قابل للتغيير' },
        { en: 'Role-based and attribute-based access control', ar: 'التحكم في الوصول القائم على الأدوار والسمات' },
        { en: 'Encrypted data at rest and in transit', ar: 'بيانات مشفرة في حالة السكون والنقل' },
        { en: 'Saudi-hosted infrastructure', ar: 'بنية تحتية مستضافة في السعودية' },
        { en: 'Complete audit trail of all platform actions', ar: 'سجل تدقيق كامل لجميع إجراءات المنصة' },
      ],
      commercial: {
        en: 'SaaS subscription with tiered pricing based on framework coverage and user count. Enterprise plans include dedicated support, custom compliance packs, and on-premise deployment options.',
        ar: 'اشتراك SaaS بتسعير متدرج بناءً على تغطية الإطار وعدد المستخدمين. تشمل خطط المؤسسات دعماً مخصصاً وحزم امتثال مخصصة وخيارات النشر المحلي.'
      },
    },
  },
];
