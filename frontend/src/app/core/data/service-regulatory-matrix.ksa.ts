/**
 * KSA seed for service × country regulatory matrix.
 * Activity codes (CR) are designed to reference this; contracts, NDAs, and docs follow these regulators/frameworks/references.
 */

import type { ServiceRegulatoryMatrix } from './service-regulatory-matrix.model';

const SA = 'SA';

export const SERVICE_REGULATORY_MATRIX_KSA: ServiceRegulatoryMatrix = {
  '620113': {
    [SA]: {
      activityCode: '620113',
      countryCode: SA,
      regulators: [
        { id: 'NCA', nameEn: 'National Cybersecurity Authority', nameAr: 'الهيئة الوطنية للأمن السيبراني', scope: 'National cybersecurity' },
        { id: 'NDMO', nameEn: 'National Data Management Office (SDAIA)', nameAr: 'المركز الوطني لإدارة البيانات', scope: 'Data and AI governance' },
        { id: 'PDPL', nameEn: 'Personal Data Protection Law', nameAr: 'نظام حماية البيانات الشخصية', scope: 'Personal data' },
      ],
      frameworks: [
        { id: 'NCA_ECC', nameEn: 'Essential Cybersecurity Controls', nameAr: 'ضوابط الأمن السيبراني الأساسية', version: '2-2024', authority: 'NCA' },
        { id: 'PDPL_IMPL', nameEn: 'PDPL implementing regulations', nameAr: 'لوائح نظام حماية البيانات الشخصية', authority: 'NDMO' },
        { id: 'AI_GOV', nameEn: 'AI governance guidelines', nameAr: 'إرشادات حوكمة الذكاء الاصطناعي', authority: 'NDMO' },
      ],
      controlThemes: ['Data protection', 'Transparency', 'Risk management', 'Logging', 'Access control'],
      permits: [],
      referenceDocuments: [
        { name: 'PDPL (Saudi Arabia)', type: 'law', url: 'https://sdaia.gov.sa/...' },
        { name: 'NCA ECC', type: 'framework', url: 'https://nca.gov.sa/...' },
        { name: 'NDMO AI governance', type: 'official_guide' },
      ],
      inDepthNeeds: {
        dataResidency: ['Personal data in KSA or approved countries'],
        certificationRequired: [],
        reportingCadence: 'As required by sector regulator',
      },
    },
  },
  '582001': {
    [SA]: {
      activityCode: '582001',
      countryCode: SA,
      regulators: [
        { id: 'NCA', nameEn: 'National Cybersecurity Authority', nameAr: 'الهيئة الوطنية للأمن السيبراني', scope: 'National cybersecurity' },
        { id: 'CITC', nameEn: 'Communications and IT Commission', nameAr: 'هيئة الاتصالات وتقنية المعلومات', scope: 'ICT services where applicable' },
      ],
      frameworks: [
        { id: 'NCA_ECC', nameEn: 'Essential Cybersecurity Controls', nameAr: 'ضوابط الأمن السيبراني الأساسية', version: '2-2024', authority: 'NCA' },
      ],
      controlThemes: ['Cybersecurity baseline', 'Secure development', 'Access control', 'Logging'],
      permits: [
        { type: 'Commercial Registration (CR) activity', renewal: 'annual', authority: 'Ministry of Commerce', reference: 'CR activity 582001' },
      ],
      referenceDocuments: [
        { name: 'NCA ECC', type: 'framework' },
        { name: 'Commercial regulations', type: 'law' },
      ],
      inDepthNeeds: {},
    },
  },
  '702017': {
    [SA]: {
      activityCode: '702017',
      countryCode: SA,
      regulators: [
        { id: 'NCA', nameEn: 'National Cybersecurity Authority', nameAr: 'الهيئة الوطنية للأمن السيبراني', scope: 'National cybersecurity baseline' },
      ],
      frameworks: [
        { id: 'NCA_ECC', nameEn: 'Essential Cybersecurity Controls', nameAr: 'ضوابط الأمن السيبراني الأساسية', version: '2-2024', authority: 'NCA' },
        { id: 'COBIT', nameEn: 'COBIT / ISO 38500', nameAr: 'كوبيت / أيزو 38500', authority: 'Reference only' },
      ],
      controlThemes: ['Governance', 'Risk management', 'Compliance'],
      permits: [
        { type: 'Commercial Registration (CR) activity', renewal: 'annual', authority: 'Ministry of Commerce', reference: 'CR activity 702017' },
      ],
      referenceDocuments: [
        { name: 'NCA ECC', type: 'framework' },
        { name: 'Contract law (KSA)', type: 'law' },
      ],
      inDepthNeeds: {
        other: 'Sector-specific regulators apply if client is regulated (e.g. SAMA, CITC, MOH)',
      },
    },
  },
};
