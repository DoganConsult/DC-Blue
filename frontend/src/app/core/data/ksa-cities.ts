/**
 * KSA cities — single source of truth for lead/inquiry forms and address dropdowns.
 * Used for: inquiry form, partner submit, admin lead detail, assign rules.
 */

export interface KsaCity {
  value: string;
  labelEn: string;
  labelAr: string;
  /** Optional: region for grouping (e.g. Central, Western). */
  region?: string;
}

export const KSA_CITIES: KsaCity[] = [
  { value: 'Riyadh', labelEn: 'Riyadh', labelAr: 'الرياض', region: 'Central' },
  { value: 'Jeddah', labelEn: 'Jeddah', labelAr: 'جدة', region: 'Western' },
  { value: 'Makkah', labelEn: 'Makkah', labelAr: 'مكة المكرمة', region: 'Western' },
  { value: 'Madinah', labelEn: 'Madinah', labelAr: 'المدينة المنورة', region: 'Western' },
  { value: 'Dammam', labelEn: 'Dammam', labelAr: 'الدمام', region: 'Eastern' },
  { value: 'Khobar', labelEn: 'Al Khobar', labelAr: 'الخبر', region: 'Eastern' },
  { value: 'Dhahran', labelEn: 'Dhahran', labelAr: 'الظهران', region: 'Eastern' },
  { value: 'Tabuk', labelEn: 'Tabuk', labelAr: 'تبوك', region: 'Northern' },
  { value: 'Buraidah', labelEn: 'Buraidah', labelAr: 'بريدة', region: 'Central' },
  { value: 'Khamis Mushait', labelEn: 'Khamis Mushait', labelAr: 'خميس مشيط', region: 'Southern' },
  { value: 'Abha', labelEn: 'Abha', labelAr: 'أبها', region: 'Southern' },
  { value: 'Najran', labelEn: 'Najran', labelAr: 'نجران', region: 'Southern' },
  { value: 'Jazan', labelEn: 'Jazan', labelAr: 'جازان', region: 'Southern' },
  { value: 'Al Ahsa', labelEn: 'Al Ahsa', labelAr: 'الأحساء', region: 'Eastern' },
  { value: 'Yanbu', labelEn: 'Yanbu', labelAr: 'ينبع', region: 'Western' },
  { value: 'Arar', labelEn: 'Arar', labelAr: 'عرعر', region: 'Northern' },
  { value: 'Sakaka', labelEn: 'Sakaka', labelAr: 'سكاكا', region: 'Northern' },
  { value: 'Hail', labelEn: 'Hail', labelAr: 'حائل', region: 'Northern' },
  { value: 'Taif', labelEn: 'Taif', labelAr: 'الطائف', region: 'Western' },
  { value: 'Jubail', labelEn: 'Jubail', labelAr: 'الجبيل', region: 'Eastern' },
  { value: 'Other', labelEn: 'Other', labelAr: 'أخرى', region: undefined },
];

export const KSA_CITIES_COUNT = KSA_CITIES.length;

export function getKsaCityByValue(value: string): KsaCity | undefined {
  return KSA_CITIES.find((c) => c.value === value);
}

export function getKsaCityLabel(value: string, lang: 'ar' | 'en'): string {
  const c = getKsaCityByValue(value);
  if (!c) return value;
  return lang === 'ar' ? c.labelAr : c.labelEn;
}
