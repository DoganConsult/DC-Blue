/**
 * Industry / vertical options — single source of truth for inquiry and lead forms.
 */
import { OptionItem } from './lead-options';

export const INDUSTRY_OPTIONS: OptionItem[] = [
  { value: 'government', labelEn: 'Government', labelAr: 'الحكومة' },
  { value: 'banking', labelEn: 'Banking & Finance', labelAr: 'البنوك والمالية' },
  { value: 'healthcare', labelEn: 'Healthcare', labelAr: 'الرعاية الصحية' },
  { value: 'energy', labelEn: 'Energy & Utilities', labelAr: 'الطاقة والمرافق' },
  { value: 'telecom', labelEn: 'Telecom', labelAr: 'الاتصالات' },
  { value: 'retail', labelEn: 'Retail & E-Commerce', labelAr: 'التجزئة والتجارة الإلكترونية' },
  { value: 'education', labelEn: 'Education', labelAr: 'التعليم' },
  { value: 'other', labelEn: 'Other', labelAr: 'أخرى' },
];
