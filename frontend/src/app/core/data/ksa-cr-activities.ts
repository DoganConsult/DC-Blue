/**
 * KSA CR (Commercial Registration) approved activities — single source of truth.
 * Used across: landing, partner portal, inquiry, admin, finance, platform setup, and all processes.
 * Official list: قائمة الأنشطة التجارية المختارة (17 activities).
 */

export interface KsaCrActivity {
  code: string;
  nameAr: string;
  nameEn: string;
  /** Optional: internal product_line for assignment/routing (see KSA_COMMERCIAL_ACTIVITIES_ICT_CONSULTANT.md). */
  productLine?: string;
}

export const KSA_CR_ACTIVITIES: KsaCrActivity[] = [
  { code: '410010', nameAr: 'الإنشاءات العامة للمباني السكنية', nameEn: 'General construction for residential buildings', productLine: 'smart-building' },
  { code: '410021', nameAr: 'الإنشاءات العامة للمباني غير السكنية (مثل المدارس والمستشفيات والفنادق .... الخ)', nameEn: 'General construction for non-residential buildings (e.g. schools, hospitals, hotels)', productLine: 'network' },
  { code: '410030', nameAr: 'إنشاءات المباني الجاهزة في المواقع', nameEn: 'Construction of prefabricated buildings on sites', productLine: 'network' },
  { code: '410040', nameAr: 'ترميمات المباني السكنية والغير سكنية', nameEn: 'Renovations of residential and non-residential buildings', productLine: 'smart-building' },
  { code: '582001', nameAr: 'نشر البرامج الجاهزة', nameEn: 'Publishing of ready-made software', productLine: 'shahin-grc' },
  { code: '582002', nameAr: 'أنظمة التشغيل', nameEn: 'Operating systems', productLine: 'cybersecurity' },
  { code: '620101', nameAr: 'تكامل الأنظمة', nameEn: 'Systems integration', productLine: 'integration' },
  { code: '620102', nameAr: 'تصميم وبرمجة البرمجيات الخاصة', nameEn: 'Design and programming of special software', productLine: 'software-dev' },
  { code: '620106', nameAr: 'تقنيات الروبوت', nameEn: 'Robotics technologies', productLine: 'software-dev' },
  { code: '620108', nameAr: 'تقنيات الواقع الاندماجي (الواقع الافتراضي والمعزز)', nameEn: 'Immersive reality technologies (virtual and augmented reality)', productLine: 'software-dev' },
  { code: '620111', nameAr: 'تطوير التطبيقات', nameEn: 'Application development', productLine: 'software-dev' },
  { code: '620113', nameAr: 'تقنيات الذكاء الاصطناعي', nameEn: 'Artificial intelligence technologies', productLine: 'ai-governance' },
  { code: '620211', nameAr: 'تقديم خدمة إدارة ومراقبة شبكات الاتصالات والمعلومات', nameEn: 'Communication and information network management and monitoring services', productLine: 'managed' },
  { code: '631121', nameAr: 'إقامة البنية الأساسية لاستضافة المواقع على الشبكة وخدمات تجهيز البيانات والأنشطة المتصلة بذلك', nameEn: 'Infrastructure for hosting websites and data processing services and related activities', productLine: 'cloud' },
  { code: '631125', nameAr: 'تقديم خدمات الحوسبة السحابية', nameEn: 'Cloud computing services', productLine: 'cloud' },
  { code: '702017', nameAr: 'تقديم خدمات الاستشارات الإدارية العليا', nameEn: 'Senior management consulting services', productLine: 'consulting' },
  { code: '731013', nameAr: 'تقديم خدمات تسويقية نيابة عن الغير', nameEn: 'Marketing services on behalf of others', productLine: 'consulting' },
];

/** Total count for display (e.g. "عدد الأنشطة 17"). */
export const KSA_CR_ACTIVITIES_COUNT = KSA_CR_ACTIVITIES.length;

/** Get activity by code. */
export function getKsaCrActivityByCode(code: string): KsaCrActivity | undefined {
  return KSA_CR_ACTIVITIES.find((a) => a.code === code);
}

/** Get display label (AR or EN) for an activity code; falls back to code if not found. */
export function getKsaCrActivityLabel(code: string, lang: 'ar' | 'en'): string {
  const a = getKsaCrActivityByCode(code);
  if (!a) return code;
  return lang === 'ar' ? a.nameAr : a.nameEn;
}
