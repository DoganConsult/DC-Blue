/**
 * Central translation dictionary for dynamic i18n.
 * Keys are dot-separated (e.g. nav.sign_in). Use I18nService.get(key) or translate pipe.
 */
export type TranslationEntry = { en: string; ar: string };

export const TRANSLATIONS: Record<string, TranslationEntry> = {
  // Nav & global
  'nav.tagline': { en: 'ICT Engineering Services', ar: 'خدمات هندسة تقنية المعلومات والاتصالات' },
  'nav.view_all': { en: 'View all', ar: 'عرض الكل' },
  'nav.sign_in': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'nav.create_account': { en: 'Create Account', ar: 'إنشاء حساب' },
  'nav.partner_portal': { en: 'Partner Portal', ar: 'بوابة الشركاء' },
  'nav.request_proposal': { en: 'Request Proposal', ar: 'طلب عرض' },
  'nav.account': { en: 'Account', ar: 'الحساب' },

  // Common
  'common.submit': { en: 'Submit', ar: 'إرسال' },
  'common.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'common.save': { en: 'Save', ar: 'حفظ' },
  'common.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
  'common.error': { en: 'Error', ar: 'خطأ' },
  'common.success': { en: 'Success', ar: 'تم بنجاح' },
  'common.back': { en: 'Back', ar: 'رجوع' },
  'common.next': { en: 'Next', ar: 'التالي' },
  'common.close': { en: 'Close', ar: 'إغلاق' },
  'common.search': { en: 'Search', ar: 'بحث' },
  'common.no_results': { en: 'No results', ar: 'لا توجد نتائج' },
};
