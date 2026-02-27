/**
 * Lead qualification options — company size, expected value, timeline.
 * Single source of truth for inquiry, partner, and admin lead forms.
 */

export interface OptionItem {
  value: string;
  labelEn: string;
  labelAr: string;
}

/** Company size (employees) — experience / scale signal. */
export const COMPANY_SIZE_OPTIONS: OptionItem[] = [
  { value: '1-10', labelEn: '1 – 10 employees', labelAr: '1 – 10 موظف' },
  { value: '11-50', labelEn: '11 – 50 employees', labelAr: '11 – 50 موظف' },
  { value: '51-200', labelEn: '51 – 200 employees', labelAr: '51 – 200 موظف' },
  { value: '201-500', labelEn: '201 – 500 employees', labelAr: '201 – 500 موظف' },
  { value: '501-1000', labelEn: '501 – 1,000 employees', labelAr: '501 – 1,000 موظف' },
  { value: '1000+', labelEn: '1,000+ employees', labelAr: 'أكثر من 1,000 موظف' },
];

/** Expected deal value (SAR) — for lead qualification. */
export const EXPECTED_VALUE_OPTIONS: OptionItem[] = [
  { value: '', labelEn: 'Select...', labelAr: 'اختر...' },
  { value: '<50k', labelEn: '< 50,000 SAR', labelAr: 'أقل من 50,000 ر.س' },
  { value: '50k-200k', labelEn: '50,000 – 200,000 SAR', labelAr: '50,000 – 200,000 ر.س' },
  { value: '200k-500k', labelEn: '200,000 – 500,000 SAR', labelAr: '200,000 – 500,000 ر.س' },
  { value: '500k-1m', labelEn: '500,000 – 1,000,000 SAR', labelAr: '500,000 – 1,000,000 ر.س' },
  { value: '1m+', labelEn: '1,000,000+ SAR', labelAr: 'أكثر من 1,000,000 ر.س' },
];
