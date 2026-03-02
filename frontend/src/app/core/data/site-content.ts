export interface BilingualText {
  en: string;
  ar: string;
}

export const COMPLIANCE_BADGES: BilingualText[] = [
  { en: 'ISO 27001', ar: 'ISO 27001' },
  { en: 'NCA ECC', ar: 'NCA ECC' },
  { en: 'ITIL', ar: 'ITIL' },
  { en: 'CIS', ar: 'CIS' },
];

export const TRUST_BADGES: BilingualText[] = [
  { en: 'ISO 27001', ar: 'ISO 27001' },
  { en: 'NCA Aligned', ar: 'متوافق مع NCA' },
  { en: 'KSA Data Residency', ar: 'إقامة بيانات في السعودية' },
];

export const TECH_PARTNERS = [
  { id: 'microsoft', name: 'Microsoft' },
  { id: 'cisco', name: 'Cisco' },
  { id: 'aws', name: 'AWS' },
  { id: 'fortinet', name: 'Fortinet' },
  { id: 'vmware', name: 'VMware' },
  { id: 'paloalto', name: 'Palo Alto' },
  { id: 'oracle', name: 'Oracle' },
  { id: 'dell', name: 'Dell' },
];

export const INTEGRATION_TOOLS: BilingualText[] = [
  { en: 'Azure', ar: 'Azure' },
  { en: 'AWS', ar: 'AWS' },
  { en: 'Fortinet', ar: 'Fortinet' },
  { en: 'Cisco', ar: 'Cisco' },
  { en: 'VMware', ar: 'VMware' },
  { en: 'M365', ar: 'M365' },
  { en: 'GitHub', ar: 'GitHub' },
  { en: 'Zabbix', ar: 'Zabbix' },
];

export const ROI_METRICS = [
  { value: '40%', label: { en: 'MTTR Reduction', ar: 'تقليل وقت الإصلاح' } },
  { value: '60%', label: { en: 'Provisioning Time', ar: 'وقت التجهيز' } },
  { value: '99%', label: { en: 'SLA Met', ar: 'الالتزام بـ SLA' } },
  { value: '24/7', label: { en: 'Support Coverage', ar: 'تغطية الدعم' } },
];

export const CONTACT_INFO = {
  email: 'info@doganconsult.com',
  location: { en: 'Riyadh, Kingdom of Saudi Arabia', ar: 'الرياض، المملكة العربية السعودية' },
  crNumber: '7008903317',
  linkedin: 'https://linkedin.com/company/doganconsult',
  twitter: 'https://twitter.com/doganconsult',
};
