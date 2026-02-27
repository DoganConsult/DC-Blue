const NCA = { id: 'NCA', nameEn: 'National Cybersecurity Authority', nameAr: 'الهيئة الوطنية للأمن السيبراني', scope: 'National cybersecurity' };
const NDMO = { id: 'NDMO', nameEn: 'National Data Management Office (SDAIA)', nameAr: 'المركز الوطني لإدارة البيانات', scope: 'Data and AI governance' };
const PDPL = { id: 'PDPL', nameEn: 'Personal Data Protection Law', nameAr: 'نظام حماية البيانات الشخصية', scope: 'Personal data' };
const CITC = { id: 'CITC', nameEn: 'Communications and IT Commission', nameAr: 'هيئة الاتصالات وتقنية المعلومات', scope: 'ICT services' };
const MOC = { id: 'MOC', nameEn: 'Ministry of Commerce', nameAr: 'وزارة التجارة', scope: 'Commercial registration' };
const MOMRA = { id: 'MOMRA', nameEn: 'Ministry of Municipal, Rural Affairs & Housing', nameAr: 'وزارة الشؤون البلدية', scope: 'Building & construction' };

const NCA_ECC = { id: 'NCA_ECC', nameEn: 'Essential Cybersecurity Controls', version: '2-2024', authority: 'NCA' };
const PDPL_IMPL = { id: 'PDPL_IMPL', nameEn: 'PDPL implementing regulations', authority: 'NDMO' };
const AI_GOV = { id: 'AI_GOV', nameEn: 'AI governance guidelines', authority: 'NDMO' };
const COBIT = { id: 'COBIT', nameEn: 'COBIT / ISO 38500', authority: 'Reference only' };
const ISO27001 = { id: 'ISO27001', nameEn: 'ISO 27001:2022', authority: 'Reference only' };
const NIST = { id: 'NIST', nameEn: 'NIST Cybersecurity Framework', authority: 'Reference only' };

const CR_PERMIT = (code) => ({ type: 'Commercial Registration (CR) activity', renewal: 'annual', authority: 'Ministry of Commerce', reference: `CR activity ${code}` });

const MATRIX_KSA = {
  '410010': {
    SA: {
      activityCode: '410010', countryCode: 'SA',
      regulators: [MOMRA, MOC],
      frameworks: [],
      controlThemes: ['Building codes', 'Safety compliance', 'Environmental standards'],
      permits: [CR_PERMIT('410010'), { type: 'Building permit', renewal: 'one-off', authority: 'MOMRA' }],
      referenceDocuments: [{ name: 'Saudi Building Code', type: 'law' }],
    },
  },
  '410021': {
    SA: {
      activityCode: '410021', countryCode: 'SA',
      regulators: [MOMRA, MOC],
      frameworks: [],
      controlThemes: ['Building codes', 'Safety compliance', 'Fire protection', 'Accessibility'],
      permits: [CR_PERMIT('410021'), { type: 'Building permit', renewal: 'one-off', authority: 'MOMRA' }],
      referenceDocuments: [{ name: 'Saudi Building Code', type: 'law' }],
    },
  },
  '410030': {
    SA: {
      activityCode: '410030', countryCode: 'SA',
      regulators: [MOMRA, MOC],
      frameworks: [],
      controlThemes: ['Prefab standards', 'Safety compliance'],
      permits: [CR_PERMIT('410030')],
      referenceDocuments: [{ name: 'Saudi Building Code', type: 'law' }],
    },
  },
  '410040': {
    SA: {
      activityCode: '410040', countryCode: 'SA',
      regulators: [MOMRA, MOC],
      frameworks: [],
      controlThemes: ['Renovation permits', 'Structural assessment', 'Safety'],
      permits: [CR_PERMIT('410040')],
      referenceDocuments: [{ name: 'Saudi Building Code', type: 'law' }],
    },
  },
  '582001': {
    SA: {
      activityCode: '582001', countryCode: 'SA',
      regulators: [NCA, CITC],
      frameworks: [NCA_ECC],
      controlThemes: ['Cybersecurity baseline', 'Secure development', 'Access control', 'Logging'],
      permits: [CR_PERMIT('582001')],
      referenceDocuments: [{ name: 'NCA ECC', type: 'framework' }, { name: 'Commercial regulations', type: 'law' }],
    },
  },
  '582002': {
    SA: {
      activityCode: '582002', countryCode: 'SA',
      regulators: [NCA, CITC],
      frameworks: [NCA_ECC],
      controlThemes: ['OS security', 'Patch management', 'Access control', 'Hardening'],
      permits: [CR_PERMIT('582002')],
      referenceDocuments: [{ name: 'NCA ECC', type: 'framework' }],
    },
  },
  '620101': {
    SA: {
      activityCode: '620101', countryCode: 'SA',
      regulators: [NCA, CITC],
      frameworks: [NCA_ECC, ISO27001],
      controlThemes: ['Systems integration security', 'API security', 'Data flow', 'Change management'],
      permits: [CR_PERMIT('620101')],
      referenceDocuments: [{ name: 'NCA ECC', type: 'framework' }, { name: 'ISO 27001', type: 'standard_terms' }],
    },
  },
  '620102': {
    SA: {
      activityCode: '620102', countryCode: 'SA',
      regulators: [NCA, CITC, PDPL],
      frameworks: [NCA_ECC, PDPL_IMPL],
      controlThemes: ['Secure SDLC', 'Code review', 'Data protection', 'Testing'],
      permits: [CR_PERMIT('620102')],
      referenceDocuments: [{ name: 'NCA ECC', type: 'framework' }, { name: 'PDPL', type: 'law' }],
    },
  },
  '620106': {
    SA: {
      activityCode: '620106', countryCode: 'SA',
      regulators: [NCA, NDMO],
      frameworks: [NCA_ECC, AI_GOV],
      controlThemes: ['Robotics safety', 'AI governance', 'Data protection', 'Physical security'],
      permits: [CR_PERMIT('620106')],
      referenceDocuments: [{ name: 'NDMO AI governance', type: 'official_guide' }],
    },
  },
  '620108': {
    SA: {
      activityCode: '620108', countryCode: 'SA',
      regulators: [NCA, CITC],
      frameworks: [NCA_ECC],
      controlThemes: ['Content security', 'User privacy', 'Data protection', 'Access control'],
      permits: [CR_PERMIT('620108')],
      referenceDocuments: [{ name: 'NCA ECC', type: 'framework' }],
    },
  },
  '620111': {
    SA: {
      activityCode: '620111', countryCode: 'SA',
      regulators: [NCA, CITC, PDPL],
      frameworks: [NCA_ECC, PDPL_IMPL],
      controlThemes: ['Secure SDLC', 'Mobile security', 'API security', 'Data protection'],
      permits: [CR_PERMIT('620111')],
      referenceDocuments: [{ name: 'NCA ECC', type: 'framework' }, { name: 'PDPL', type: 'law' }],
    },
  },
  '620113': {
    SA: {
      activityCode: '620113', countryCode: 'SA',
      regulators: [NCA, NDMO, PDPL],
      frameworks: [NCA_ECC, PDPL_IMPL, AI_GOV],
      controlThemes: ['Data protection', 'Transparency', 'Risk management', 'Logging', 'Access control'],
      permits: [],
      referenceDocuments: [
        { name: 'PDPL (Saudi Arabia)', type: 'law', url: 'https://sdaia.gov.sa/' },
        { name: 'NCA ECC', type: 'framework', url: 'https://nca.gov.sa/' },
        { name: 'NDMO AI governance', type: 'official_guide' },
      ],
      inDepthNeeds: { dataResidency: ['Personal data in KSA or approved countries'], certificationRequired: [], reportingCadence: 'As required by sector regulator' },
    },
  },
  '620211': {
    SA: {
      activityCode: '620211', countryCode: 'SA',
      regulators: [NCA, CITC],
      frameworks: [NCA_ECC, NIST],
      controlThemes: ['Network monitoring', 'Incident response', 'SOC operations', 'Logging'],
      permits: [CR_PERMIT('620211'), { type: 'CITC license (if applicable)', renewal: 'annual', authority: 'CITC' }],
      referenceDocuments: [{ name: 'NCA ECC', type: 'framework' }, { name: 'NIST CSF', type: 'framework' }],
    },
  },
  '631121': {
    SA: {
      activityCode: '631121', countryCode: 'SA',
      regulators: [NCA, CITC],
      frameworks: [NCA_ECC, ISO27001],
      controlThemes: ['Data center security', 'Physical security', 'Availability', 'Disaster recovery'],
      permits: [CR_PERMIT('631121'), { type: 'CITC hosting license', renewal: 'annual', authority: 'CITC' }],
      referenceDocuments: [{ name: 'NCA ECC', type: 'framework' }, { name: 'CITC data center regulations', type: 'law' }],
    },
  },
  '631125': {
    SA: {
      activityCode: '631125', countryCode: 'SA',
      regulators: [NCA, CITC, PDPL],
      frameworks: [NCA_ECC, { id: 'CCC', nameEn: 'Cloud Cybersecurity Controls', authority: 'NCA' }],
      controlThemes: ['Cloud security', 'Data residency', 'Multi-tenancy', 'IAM', 'Encryption'],
      permits: [CR_PERMIT('631125'), { type: 'CITC cloud service provider license', renewal: 'annual', authority: 'CITC' }],
      referenceDocuments: [{ name: 'NCA Cloud Cybersecurity Controls', type: 'framework' }, { name: 'PDPL', type: 'law' }],
    },
  },
  '702017': {
    SA: {
      activityCode: '702017', countryCode: 'SA',
      regulators: [NCA],
      frameworks: [NCA_ECC, COBIT],
      controlThemes: ['Governance', 'Risk management', 'Compliance'],
      permits: [CR_PERMIT('702017')],
      referenceDocuments: [{ name: 'NCA ECC', type: 'framework' }, { name: 'Contract law (KSA)', type: 'law' }],
      inDepthNeeds: { other: 'Sector-specific regulators apply if client is regulated (e.g. SAMA, CITC, MOH)' },
    },
  },
  '731013': {
    SA: {
      activityCode: '731013', countryCode: 'SA',
      regulators: [MOC, CITC],
      frameworks: [],
      controlThemes: ['Marketing compliance', 'Data protection', 'Consumer protection'],
      permits: [CR_PERMIT('731013')],
      referenceDocuments: [{ name: 'E-commerce law', type: 'law' }, { name: 'PDPL', type: 'law' }],
    },
  },
};

export function getMatrixEntry(activityCode, countryCode) {
  return MATRIX_KSA[activityCode]?.[countryCode] || null;
}

export function getAllMatrixEntries(countryCode) {
  const results = [];
  for (const [code, countries] of Object.entries(MATRIX_KSA)) {
    if (countries[countryCode]) results.push(countries[countryCode]);
  }
  return results;
}

export { MATRIX_KSA };
