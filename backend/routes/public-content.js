/**
 * Public content API — site_settings, public_content, legal_pages.
 * Served at /api/public/* (no auth).
 */

import { Router } from 'express';

const defaultLanding = {
  // ── Existing sections (unchanged) ──────────────────────────────────
  hero: {
    headline: { en: 'ICT Engineering, Delivered.', ar: 'هندسة تقنية المعلومات والاتصالات، مُنفّذة.' },
    subline: { en: 'Design, build, and operate enterprise-grade ICT environments.', ar: 'نصمم ونبني ونشغّل بيئات تقنية معلومات واتصالات مؤسسية.' },
    cta: { en: 'Request Proposal', ar: 'طلب عرض' },
  },
  stats: [
    { value: 15, suffix: '+', label: { en: 'Years Experience', ar: 'سنوات خبرة' } },
    { value: 120, suffix: '+', label: { en: 'Projects Delivered', ar: 'مشاريع منجزة' } },
    { value: 99, suffix: '%', label: { en: 'SLAs Met', ar: 'التزام ب SLA' } },
    { value: 6, suffix: '', label: { en: 'Regions', ar: 'مناطق' } },
  ],
  services: [
    { id: '1', title: { en: 'Network & Data Center', ar: 'الشبكات ومركز البيانات' }, color: '#0078D4' },
    { id: '2', title: { en: 'Cybersecurity', ar: 'الأمن السيبراني' }, color: '#006C35' },
    { id: '3', title: { en: 'Cloud & DevOps', ar: 'السحابة و DevOps' }, color: '#6366F1' },
    { id: '4', title: { en: 'Systems Integration', ar: 'تكامل الأنظمة' }, color: '#10B981' },
  ],
  chartData: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [72, 85, 78, 92] },

  // ── 1. Expertise (social-proof-section expertiseCards) ─────────────
  expertise: [
    {
      titleEn: 'Data Centers & Critical Facilities',
      titleAr: 'مراكز البيانات والمرافق الحيوية',
      descEn: 'Design, assessment and operation of data center facilities, including comprehensive facilities planning, power systems, and cooling infrastructure for maximum uptime.',
      descAr: 'تقييم تصميم ومراجعة وتشغيل مراكز البيانات والمرافق الحيوية، بما يشمل تخطيط المنشآت وأنظمة الطاقة والتبريد والبنية التحتية وأكثر.',
      iconPath: 'M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z',
      iconBg: 'rgba(249, 115, 22, 0.12)',
      iconColor: '#F97316',
    },
    {
      titleEn: 'Telecommunications Engineering',
      titleAr: 'هندسة الاتصالات',
      descEn: 'Review of telecommunications infrastructure plans, radio frequency analysis, mobile network planning, and connectivity solutions for operators and enterprises.',
      descAr: 'مراجعة هندسية لخطط البنية التحتية للاتصالات وتخطيط الشبكات والتحليل الترددي وحلول التوصيل لمشغلي الاتصالات والمؤسسات الكبرى.',
      iconPath: 'M12 12.5a.5.5 0 110-1 .5.5 0 010 1zm-3.5 3a5 5 0 017 0m-10-3a9 9 0 0114 0m-17-3c5.3-4 11.7-4 17 0',
      iconBg: 'rgba(139, 92, 246, 0.12)',
      iconColor: '#8B5CF6',
    },
    {
      titleEn: 'IT Governance & Support',
      titleAr: 'حوكمة ودعم تقنية المعلومات',
      descEn: 'IT governance frameworks, PMO consulting, digital transformation roadmaps, and end-to-end technical support for ICT projects.',
      descAr: 'استشارات مكاتب إدارة المشاريع وحوكمة تقنية المعلومات وخطط التحول الرقمي والدعم الفني الشامل للمشاريع التقنية الكبرى.',
      iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
      iconBg: 'rgba(249, 115, 22, 0.12)',
      iconColor: '#F97316',
    },
    {
      titleEn: 'Cybersecurity & Technical Assurance',
      titleAr: 'الأمن السيبراني والضمان الفني',
      descEn: 'Cybersecurity strategy, risk management, NCA-ECC compliance, penetration testing, vulnerability assessment, and continuous monitoring.',
      descAr: 'استشارات الأمن السيبراني وإدارة المخاطر والامتثال مع NCA-ECC واختبار الاختراق وتقييم الثغرات والمراقبة الأمنية المستمرة.',
      iconPath: 'M12 3s-7 3-7 9c0 4.5 3.5 8 7 9 3.5-1 7-4.5 7-9 0-6-7-9-7-9zm-1.5 10.5l3.5-3.5M9 12l1.5 1.5',
      iconBg: 'rgba(34, 197, 94, 0.12)',
      iconColor: '#22C55E',
    },
  ],

  // ── 2. Methodology (problem-section steps) ─────────────────────────
  methodology: [
    { number: '01', titleEn: 'Assessment', titleAr: 'التقييم', descEn: 'Comprehensive assessment of the current situation and needs.', descAr: 'تقييم شامل للوضع الحالي والاحتياجات والمتطلبات.' },
    { number: '02', titleEn: 'Design', titleAr: 'التصميم', descEn: 'Designing practical and implementable solutions.', descAr: 'تصميم حلول عملية قابلة للتنفيذ وفعالة.' },
    { number: '03', titleEn: 'Implementation', titleAr: 'التنفيذ', descEn: 'Gap analysis, priority identification, and execution.', descAr: 'تحليل الفجوات وتحديد الأولويات والتنفيذ الفعلي.' },
    { number: '04', titleEn: 'Support', titleAr: 'الدعم', descEn: 'Follow-up implementation and continuous improvement.', descAr: 'متابعة التنفيذ وضمان التحسن المستمر والاستدامة.' },
  ],

  // ── 3. Sectors (services-section sectors) ──────────────────────────
  sectors: [
    {
      titleEn: 'Government & Public Sector',
      titleAr: 'الحكومة والقطاع العام',
      descEn: 'Smart government solutions, infrastructure management, digital transformation, and Vision 2030 alignment.',
      descAr: 'إدارة وتخطيط البنية التحتية الرقمية الحكومية وتنفيذ مبادرات التحول الرقمي ضمن رؤية 2030.',
      iconPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
    },
    {
      titleEn: 'Telecommunications Sector',
      titleAr: 'قطاع الاتصالات',
      descEn: 'Network planning and design, spectrum management, infrastructure sharing, and compliance with CITC regulations.',
      descAr: 'تخطيط وتصميم شبكات الاتصالات والإدارة الترددية ومشاركة البنية التحتية والامتثال لمتطلبات الهيئة.',
      iconPath: 'M12 12.5a.5.5 0 110-1 .5.5 0 010 1zm-3.5 3a5 5 0 017 0m-10-3a9 9 0 0114 0m-17-3c5.3-4 11.7-4 17 0',
    },
    {
      titleEn: 'Critical Infrastructure',
      titleAr: 'البنية التحتية الحيوية',
      descEn: 'Protection, assessment, and modernization of critical national infrastructure and facilities.',
      descAr: 'حماية وتقييم وتحديث البنية التحتية الحيوية الوطنية والمنشآت الحساسة.',
      iconPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    },
    {
      titleEn: 'Large & Medium Enterprises',
      titleAr: 'المؤسسات الكبرى والمتوسطة',
      descEn: 'Enterprise ICT strategy, digital workplace solutions, and managed ICT services for business growth.',
      descAr: 'استراتيجية تقنية المعلومات المؤسسية وحلول بيئة العمل الرقمية وخدمات تقنية المعلومات المُدارة.',
      iconPath: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21',
    },
  ],

  // ── 4. Benefits (why-choose-section benefits) ─────────────────────
  benefits: [
    { en: 'Close engineering consulting leadership', ar: 'قيادة هندسية استشارية عن قرب' },
    { en: 'Extensive experience and deep expertise', ar: 'خبرات واسعة وتجربة عميقة' },
    { en: 'Customized and comprehensive solutions', ar: 'حلول مخصصة وشاملة' },
    { en: 'Dedicated support for optimization', ar: 'مساعدة مخصصة للحصول على التحسين' },
    { en: 'Focus on telecom and infrastructure', ar: 'التركيز على الاتصالات والبنية التحتية' },
    { en: 'Value-driven with exclusive vision', ar: 'فرق بالقيمة وبرؤية حصرية' },
  ],

  // ── 5. Industries (industries-section INDUSTRIES) ──────────────────
  industries: [
    { id: 'gov', icon: 'pi-building', color: '#006C35', titleEn: 'Government & semi-government', titleAr: 'القطاع الحكومي وشبه الحكومي' },
    { id: 'health', icon: 'pi-heart', color: '#0EA5E9', titleEn: 'Healthcare', titleAr: 'الرعاية الصحية' },
    { id: 'finance', icon: 'pi-wallet', color: '#0A3C6B', titleEn: 'Financial services', titleAr: 'الخدمات المالية' },
    { id: 'telco', icon: 'pi-signal', color: '#6366F1', titleEn: 'Telecom & ICT', titleAr: 'الاتصالات وتقنية المعلومات' },
    { id: 'retail', icon: 'pi-shopping-cart', color: '#10B981', titleEn: 'Retail & multi-site', titleAr: 'التجزئة والمواقع المتعددة' },
    { id: 'industrial', icon: 'pi-cog', color: '#F59E0B', titleEn: 'Manufacturing & logistics', titleAr: 'التصنيع واللوجستيات' },
  ],

  // ── 6. Case Studies (case-studies-section) ─────────────────────────
  caseStudies: [
    {
      id: 'healthcare-01', industryId: 'healthcare',
      client: { name: { en: 'Major Healthcare Provider', ar: 'مزود رعاية صحية رئيسي' }, industry: { en: 'Healthcare', ar: 'الرعاية الصحية' } },
      challenge: { en: 'Legacy systems across a hospital network needed modernization to support Vision 2030 healthcare goals', ar: 'الأنظمة القديمة عبر شبكة المستشفيات تحتاج إلى التحديث لدعم أهداف رؤية 2030' },
      solution: { en: 'Unified health information exchange with HL7 FHIR standards, cloud migration, and AI-powered analytics', ar: 'منصة موحدة لتبادل المعلومات الصحية مع معايير HL7 FHIR والترحيل السحابي' },
      results: [
        { metric: { en: 'Wait Time', ar: 'وقت الانتظار' }, value: { en: '-68%', ar: '-68%' }, icon: 'down' },
        { metric: { en: 'System Uptime', ar: 'وقت التشغيل' }, value: { en: '99.99%', ar: '99.99%' }, icon: 'up' },
      ],
      technologies: ['HL7 FHIR', 'AWS Cloud', 'Kubernetes', 'AI/ML', 'Oracle Health'],
      duration: { en: '18 months', ar: '18 شهر' },
    },
    {
      id: 'finance-01', industryId: 'finance',
      client: { name: { en: 'Leading Financial Institution', ar: 'مؤسسة مالية رائدة' }, industry: { en: 'Finance', ar: 'المالية' } },
      challenge: { en: 'Required Zero Trust security architecture to protect critical financial infrastructure', ar: 'يتطلب بنية أمان Zero Trust لحماية البنية التحتية المالية الحرجة' },
      solution: { en: 'Comprehensive Zero Trust framework with microsegmentation, SIEM/SOAR, and 24/7 SOC', ar: 'إطار Zero Trust شامل مع التقسيم الدقيق و SIEM/SOAR و SOC' },
      results: [
        { metric: { en: 'Security Incidents', ar: 'الحوادث الأمنية' }, value: { en: '-94%', ar: '-94%' }, icon: 'down' },
        { metric: { en: 'Compliance', ar: 'الامتثال' }, value: { en: '100%', ar: '100%' }, icon: 'check' },
      ],
      technologies: ['Palo Alto', 'Splunk', 'CrowdStrike', 'HashiCorp Vault'],
      duration: { en: '12 months', ar: '12 شهر' },
    },
    {
      id: 'energy-01', industryId: 'energy',
      client: { name: { en: 'National Energy Company', ar: 'شركة طاقة وطنية' }, industry: { en: 'Energy', ar: 'الطاقة' } },
      challenge: { en: 'Monitor thousands of IoT sensors across industrial sites for predictive maintenance', ar: 'مراقبة آلاف أجهزة استشعار IoT عبر المواقع الصناعية للصيانة التنبؤية' },
      solution: { en: 'Edge computing platform with real-time analytics and ML-based failure prediction', ar: 'منصة حوسبة حافة مع تحليلات في الوقت الفعلي والتنبؤ بالفشل' },
      results: [
        { metric: { en: 'Downtime', ar: 'وقت التوقف' }, value: { en: '-76%', ar: '-76%' }, icon: 'down' },
        { metric: { en: 'Maintenance Cost', ar: 'تكلفة الصيانة' }, value: { en: '-45%', ar: '-45%' }, icon: 'down' },
      ],
      technologies: ['Azure IoT', 'Apache Kafka', 'TensorFlow', 'Grafana'],
      duration: { en: '24 months', ar: '24 شهر' },
    },
    {
      id: 'entertainment-01', industryId: 'entertainment',
      client: { name: { en: 'Entertainment Platform', ar: 'منصة ترفيهية' }, industry: { en: 'Entertainment', ar: 'الترفيه' } },
      challenge: { en: 'Scale platform to handle hundreds of thousands of concurrent users during live events', ar: 'توسيع المنصة للتعامل مع مئات الآلاف من المستخدمين المتزامنين خلال الفعاليات الحية' },
      solution: { en: 'Auto-scaling cloud infrastructure with CDN optimization and real-time streaming', ar: 'بنية سحابية قابلة للتطوير تلقائيًا مع تحسين CDN والبث المباشر' },
      results: [
        { metric: { en: 'Uptime', ar: 'وقت التشغيل' }, value: { en: '100%', ar: '100%' }, icon: 'check' },
        { metric: { en: 'User Capacity', ar: 'سعة المستخدم' }, value: { en: '10x', ar: '10x' }, icon: 'up' },
      ],
      technologies: ['AWS', 'CloudFlare', 'WebRTC', 'React Native'],
      duration: { en: '6 months', ar: '6 أشهر' },
    },
    {
      id: 'telecom-01', industryId: 'telecom',
      client: { name: { en: 'Major Telecom Operator', ar: 'مشغل اتصالات رئيسي' }, industry: { en: 'Telecom', ar: 'الاتصالات' } },
      challenge: { en: 'Accelerate 5G rollout across multiple cities while maintaining network quality', ar: 'تسريع نشر 5G عبر عدة مدن مع الحفاظ على جودة الشبكة' },
      solution: { en: 'Automated 5G deployment framework with AI-driven RF optimization', ar: 'إطار نشر 5G آلي مع تحسين الترددات الراديوية بالذكاء الاصطناعي' },
      results: [
        { metric: { en: 'Rollout Speed', ar: 'سرعة النشر' }, value: { en: '3x', ar: '3x' }, icon: 'up' },
        { metric: { en: 'Coverage', ar: 'التغطية' }, value: { en: '98%', ar: '98%' }, icon: 'check' },
      ],
      technologies: ['Ericsson', 'Nokia', 'Azure', 'Python ML'],
      duration: { en: '18 months', ar: '18 شهر' },
    },
  ],

  // ── 7. Testimonials (testimonials-enhanced) ───────────────────────
  testimonials: {
    featured: [
      {
        name: 'Iman Radwan',
        role: 'Project Manager',
        company: 'Huawei Enterprise Kuwait',
        content: 'I had the pleasure of working closely with Ahmed during our collaboration on various projects. In his role as General Manager, he consistently demonstrated exceptional leadership and a profound understanding of the market and also of Huawei and all other vendors in the ELV field. Ahmed possesses an impressive ability to strategize and execute complex initiatives. I was particularly impressed by his effective management of KNG Kazmah project, where he showcased a keen attention to detail and a commitment to managing different aspects including even the technical parts as he has a very good technical understanding.',
        highlight: 'Exceptional leadership and profound understanding of the market',
        date: 'December 26, 2023',
        relationship: 'Client relationship',
        rating: 5,
      },
      {
        name: 'Osama Yousef',
        role: 'Sr. Partners Sales Manager | Principal ICT Solutions Architect',
        company: 'Channels Enablement Specialist',
        content: 'I had the pleasure of working closely with Ahmad on several Data Center and Network solutions projects. His exceptional problem-solving skills, attention to details, and strong cooperative skills were instrumental in the success of these projects specially in responding time, with highly management skills in using the allowed resources to accomplish the tasks successfully. Ahmad is a responsible, respected person, well-educated with very good knowledge and significant number of well deserved certificates.',
        highlight: 'Exceptional problem-solving skills and attention to details',
        date: 'January 1, 2024',
        relationship: 'Worked at different companies',
        rating: 5,
      },
      {
        name: 'Ashraf Nassar',
        role: 'Executive Manager',
        company: 'HEV Group | HVAC',
        content: 'As I was manager for integrated maintenance and ICT was part of Division with Ahmed as manager for ICT department, I can say that Ahmed is hard worker and has excellent and professional ideas and visions to the market, and follows operations right well. The department was honored as the best company in the field of data centers in the Middle East region within a year of operating the department in UAE by Huawei.',
        highlight: 'Best company in data centers in Middle East region',
        date: 'December 15, 2023',
        relationship: 'Worked on same team',
        rating: 5,
      },
    ],
    additional: [
      {
        name: 'Fadi Al-Farra',
        role: 'Divisional General Manager',
        company: 'Bader Al Mulla & Bros. Co.',
        content: 'Ahmed is an icon of enthusiasm and perseverance. I had the pleasure of working closely with him on a challenging period and too critical market situation. His exceptional problem-solving skills and attention to detail were instrumental in its success.',
        date: 'January 15, 2024',
        relationship: 'Different teams',
        rating: 5,
      },
      {
        name: 'Wassim Zoueihed',
        role: 'Seasoned Tech Leader',
        company: 'Huawei',
        content: 'I saw him as a leader in his domain, True customer centric and dedicated to long term relationships. He was always clear in his understanding of the clients\' needs and had a sharp focus on the needful towards success.',
        date: 'December 27, 2023',
        relationship: 'Client',
        rating: 5,
      },
      {
        name: 'Camille Muhandes',
        role: 'VAD Channels Sales Manager',
        company: 'Middle East & North Africa',
        content: 'Ahmed is a high professional individual with sharp business acumen. He managed to build excellent rapport and alignment with all stakeholders. Very well organized with sharp focus on what matters to business.',
        date: 'December 11, 2023',
        relationship: 'Client',
        rating: 5,
      },
      {
        name: 'Hassan Abdallah',
        role: 'Senior Product Manager',
        company: 'Aptec Saudi Arabia (VMware)',
        content: 'I was honored to work with Ahmad for the last year. He was a great help for the company and colleagues, man of his word, professional manager and a great mentor for his team.',
        date: 'January 13, 2024',
        relationship: 'Same team',
        rating: 5,
      },
      {
        name: 'László Imre Ludas',
        role: 'Alliances & Sales Director',
        company: 'Oracle',
        content: 'Ahmed has been a great help throughout the years making many contracts and businesses come to fruition. Always ready to help and happy to take the next challenge.',
        date: 'December 12, 2023',
        relationship: 'Client',
        rating: 5,
      },
      {
        name: 'Mohamed Shereen',
        role: 'Operations Manager',
        company: 'Gulf Group ICT',
        content: 'Ahmed is an outstanding telecom engineer and manager. He possesses a deep understanding of the telecom industry, coupled with exceptional leadership skills. His ability to manage and optimize the entire ICT division was truly impressive.',
        date: 'December 9, 2023',
        relationship: 'Direct report',
        rating: 5,
      },
    ],
  },

  // ── 8. Partners (partners-section) ────────────────────────────────
  partners: [
    { name: 'Microsoft', logo: 'microsoft', level: 'platinum', category: 'cloud', certifications: ['Azure Expert MSP', 'Gold Cloud Platform', 'Gold Data & AI', 'Gold Security'] },
    { name: 'AWS', logo: 'aws', level: 'platinum', category: 'cloud', certifications: ['Advanced Consulting Partner', 'Solution Provider', 'Well-Architected Partner'] },
    { name: 'Cisco', logo: 'cisco', level: 'platinum', category: 'network', certifications: ['Gold Partner', 'Master Security Specialization', 'Master Collaboration'] },
    { name: 'Palo Alto', logo: 'paloalto', level: 'platinum', category: 'security', certifications: ['Platinum Innovator', 'MSSP Partner', 'Prisma Cloud Specialization'] },
    { name: 'Oracle', logo: 'oracle', level: 'gold', category: 'software', certifications: ['Gold Partner', 'Cloud Excellence Implementer'] },
    { name: 'SAP', logo: 'sap', level: 'gold', category: 'software', certifications: ['Gold Partner', 'S/4HANA Certified'] },
    { name: 'VMware', logo: 'vmware', level: 'gold', category: 'cloud', certifications: ['Principal Partner', 'Cloud Provider'] },
    { name: 'Fortinet', logo: 'fortinet', level: 'gold', category: 'security', certifications: ['Gold Partner', 'MSSP Specialization'] },
    { name: 'Splunk', logo: 'splunk', level: 'gold', category: 'security', certifications: ['Elite Partner', 'SIEM Expert'] },
    { name: 'Red Hat', logo: 'redhat', level: 'gold', category: 'cloud', certifications: ['Premier Partner', 'OpenShift Specialist'] },
    { name: 'HPE', logo: 'hpe', level: 'silver', category: 'hardware' },
    { name: 'Dell', logo: 'dell', level: 'silver', category: 'hardware' },
    { name: 'F5', logo: 'f5', level: 'silver', category: 'network' },
    { name: 'Juniper', logo: 'juniper', level: 'silver', category: 'network' },
    { name: 'CrowdStrike', logo: 'crowdstrike', level: 'silver', category: 'security' },
    { name: 'Zscaler', logo: 'zscaler', level: 'silver', category: 'security' },
    { name: 'Google Cloud', logo: 'gcp', level: 'certified', category: 'cloud' },
    { name: 'Nutanix', logo: 'nutanix', level: 'certified', category: 'cloud' },
    { name: 'HashiCorp', logo: 'hashicorp', level: 'certified', category: 'software' },
    { name: 'Datadog', logo: 'datadog', level: 'certified', category: 'software' },
    { name: 'Elastic', logo: 'elastic', level: 'certified', category: 'software' },
    { name: 'MongoDB', logo: 'mongodb', level: 'certified', category: 'software' },
    { name: 'Kubernetes', logo: 'kubernetes', level: 'certified', category: 'cloud' },
    { name: 'GitLab', logo: 'gitlab', level: 'certified', category: 'software' },
  ],

  // ── 9. Certifications (certifications-showcase) ───────────────────
  certifications: {
    security: [
      { acronym: 'CISM', name: 'Certified Information Security Manager', issuer: 'ISACA', date: 'Oct 2020', active: false },
      { acronym: 'CISA', name: 'Certified Information Systems Auditor', issuer: 'ISACA', date: 'Oct 2020', active: false },
      { acronym: 'CRISC', name: 'Certified in Risk & Information Systems Control', issuer: 'ISACA', date: 'Oct 2020', active: false },
      { acronym: 'OSHA', name: 'Safety & Health Standards', issuer: 'OSHA Institute', date: 'Nov 2006', active: true },
    ],
    technical: [
      { acronym: 'RCDD', name: 'Registered Communications Distribution Designer', issuer: 'BICSI', date: 'Nov 2021', priority: 1, active: true },
      { acronym: 'ATD', name: 'Accredited Tier Designer', issuer: 'Uptime Institute', date: 'Nov 2019', priority: 1, active: false },
      { acronym: 'AOS', name: 'Accredited Operations Specialist', issuer: 'Uptime Institute', date: 'Apr 2020', priority: 2, active: true },
      { acronym: 'HCIP', name: 'Data Center Facility', issuer: 'Huawei', date: 'Dec 2018', priority: 2, active: false },
      { acronym: 'ITIL', name: 'ITIL\u00AE 4 Foundation', issuer: 'AXELOS', date: 'Sep 2020', priority: 2, active: true },
    ],
    timeline: [
      { year: '2023', certifications: ['Program Management Professional (PgMP)\u00AE'] },
      { year: '2022', certifications: ['Chartered Manager (CMI)'] },
      { year: '2021', certifications: ['RCDD - BICSI', 'PRINCE2\u00AE Practitioner'] },
      { year: '2020', certifications: ['PMP\u00AE', 'PMI-ACP', 'CISM', 'CISA', 'CRISC', 'Saudi Council of Engineers'] },
      { year: '2019', certifications: ['ATD - Uptime Institute', 'Huawei Pre-Sales Specialist'] },
      { year: '2018', certifications: ['HCIP Data Center Facility'] },
    ],
  },

  // ── 10. Security Pillars (security-section PILLARS) ───────────────
  securityPillars: [
    { titleEn: 'Identity & access', titleAr: 'الهوية والوصول', icon: 'pi-user' },
    { titleEn: 'Network segmentation', titleAr: 'تقسيم الشبكة', icon: 'pi-sitemap' },
    { titleEn: 'Endpoint & server hardening', titleAr: 'تعزيز الخوادم والنقاط الطرفية', icon: 'pi-shield' },
    { titleEn: 'Logging & monitoring', titleAr: 'التسجيل والمراقبة', icon: 'pi-chart-line' },
    { titleEn: 'Backup & DR resilience', titleAr: 'النسخ الاحتياطي ومرونة التعافي', icon: 'pi-database' },
    { titleEn: 'Secure configuration & patch mgmt', titleAr: 'التكوين الآمن وإدارة التحديثات', icon: 'pi-wrench' },
  ],

  // ── 11. Engagement Steps (engagement-flow-section STEPS) ──────────
  engagementSteps: [
    { titleEn: 'Discovery & site survey', titleAr: 'الاكتشاف والمسح الميداني', icon: 'pi-search' },
    { titleEn: 'Design & BoQ', titleAr: 'التصميم وقائمة الكميات', icon: 'pi-file-edit' },
    { titleEn: 'Implementation plan', titleAr: 'خطة التنفيذ', icon: 'pi-list-check' },
    { titleEn: 'Deployment & commissioning', titleAr: 'النشر والتشغيل', icon: 'pi-play' },
    { titleEn: 'Handover (as-built + runbooks)', titleAr: 'التسليم (كما بُني + دلائل التشغيل)', icon: 'pi-book' },
    { titleEn: 'Support (SLA / managed services)', titleAr: 'الدعم (SLA / خدمات مُدارة)', icon: 'pi-headphones' },
  ],

  // ── 12. FAQ (faq-section FAQ_ITEMS) ───────────────────────────────
  faq: [
    { qEn: 'What are your typical delivery timelines?', qAr: 'ما هي المدد النموذجية للتسليم؟', aEn: 'Depends on scope; we provide a clear timeline after discovery.', aAr: 'تعتمد على النطاق؛ نقدم جدولاً واضحاً بعد مرحلة الاكتشاف.' },
    { qEn: 'Do you offer 24/7 support?', qAr: 'هل تقدمون دعمًا على مدار الساعة؟', aEn: 'Yes, under Managed Services and Enterprise tiers.', aAr: 'نعم، ضمن مستويات الخدمات المُدارة والمؤسسية.' },
    { qEn: 'Can you work on-site in KSA?', qAr: 'هل يمكنكم العمل ميدانياً في المملكة؟', aEn: 'Yes. We have on-site capability across major regions.', aAr: 'نعم. لدينا قدرة ميدانية في المناطق الرئيسية.' },
    { qEn: 'Do you deliver in Arabic and English?', qAr: 'هل تقدمون التسليم بالعربية والإنجليزية؟', aEn: 'Yes. Documentation and communication in both languages.', aAr: 'نعم. التوثيق والتواصل باللغتين.' },
  ],

  // ── 13. Pricing Tiers (pricing-section TIERS) ─────────────────────
  pricingTiers: [
    { id: 'advisory', titleEn: 'Advisory', titleAr: 'استشاري', descEn: 'Design & assessment', descAr: 'التصميم والتقييم', popular: false },
    { id: 'project', titleEn: 'Project delivery', titleAr: 'تسليم المشاريع', descEn: 'Fixed scope', descAr: 'نطاق ثابت', popular: false },
    { id: 'managed', titleEn: 'Managed services', titleAr: 'الخدمات المُدارة', descEn: 'SLA-based support', descAr: 'دعم وفق SLA', popular: true },
    { id: 'enterprise', titleEn: 'Enterprise retainer', titleAr: 'عقد مؤسسي', descEn: 'Multi-site / priority', descAr: 'متعدد المواقع / أولوية', popular: false },
  ],

  // ── 14. Trust Badges (site-content TRUST_BADGES) ──────────────────
  trustBadges: [
    { en: 'ISO 27001', ar: 'ISO 27001' },
    { en: 'NCA Aligned', ar: 'متوافق مع NCA' },
    { en: 'KSA Data Residency', ar: 'إقامة بيانات في السعودية' },
  ],
};

export default function publicContentRouter(pool) {
  const router = Router();

  /** GET /api/public/site-settings — contact, WhatsApp, socials */
  router.get('/site-settings', async (_req, res) => {
    try {
      const result = await pool.query(
        'SELECT contact_email, contact_phone, whatsapp_number, address_en, address_ar, cr_number, linkedin_url, twitter_url, locale FROM site_settings WHERE id = 1 LIMIT 1'
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Site settings not found' });
      }
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Site settings unavailable' });
    }
  });

  /** GET /api/public/content/:page — about, services, case_studies, insights (and landing payload shape) */
  router.get('/content/:page', async (req, res) => {
    const page = (req.params.page || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!page) return res.status(400).json({ error: 'Invalid page' });
    try {
      const result = await pool.query(
        'SELECT content FROM public_content WHERE page = $1 LIMIT 1',
        [page]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Content not found' });
      }
      res.json(result.rows[0].content);
    } catch (e) {
      res.status(500).json({ error: 'Content unavailable' });
    }
  });

  /** GET /api/public/legal/:key — privacy, terms, pdpl, cookies */
  router.get('/legal/:key', async (req, res) => {
    const key = (req.params.key || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!key) return res.status(400).json({ error: 'Invalid key' });
    try {
      const result = await pool.query(
        'SELECT key, title_en, title_ar, body_en, body_ar, updated_at FROM legal_pages WHERE key = $1 LIMIT 1',
        [key]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Legal page not found' });
      }
      res.json(result.rows[0]);
    } catch (e) {
      console.error('[legal] Error fetching legal page:', e.message);
      res.status(500).json({ error: 'Legal page unavailable' });
    }
  });

  /** GET /api/public/landing — from public_content (page=landing) with fallback to default */
  router.get('/landing', async (_req, res) => {
    try {
      const result = await pool.query(
        "SELECT content FROM public_content WHERE page = 'landing' LIMIT 1"
      );
      const content = result.rows.length > 0 ? result.rows[0].content : defaultLanding;
      res.json(content);
    } catch (e) {
      res.json(defaultLanding);
    }
  });

  return router;
}
