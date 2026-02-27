/**
 * Dogan Consult internal organization structure — teams and departments.
 * Used in the admin portal for assignment (Assigned to) and to represent
 * company structure (CEO, CFO, CTO, HR, Finance & Administration, etc.).
 */

export interface OrgTeam {
  value: string;
  labelEn: string;
  labelAr: string;
  /** Optional short description for tooltips or about page. */
  descriptionEn?: string;
  descriptionAr?: string;
}

/** Dogan Consult teams — single source of truth for admin assignment and org display. */
export const DOGAN_CONSULT_TEAMS: OrgTeam[] = [
  {
    value: 'ceo',
    labelEn: 'CEO Office',
    labelAr: 'مكتب الرئيس التنفيذي',
    descriptionEn: 'Executive leadership',
    descriptionAr: 'القيادة التنفيذية',
  },
  {
    value: 'cfo',
    labelEn: 'CFO / Finance & Administration',
    labelAr: 'الرئيس المالي / المالية والإدارة',
    descriptionEn: 'Finance, accounting, and administration',
    descriptionAr: 'المالية والمحاسبة والإدارة',
  },
  {
    value: 'cto',
    labelEn: 'CTO / Technology',
    labelAr: 'الرئيس التقني / التقنية',
    descriptionEn: 'Technology and product',
    descriptionAr: 'التقنية والمنتج',
  },
  {
    value: 'hr',
    labelEn: 'HR & People',
    labelAr: 'الموارد البشرية والشؤون الإدارية',
    descriptionEn: 'Human resources and administrative affairs',
    descriptionAr: 'الموارد البشرية والشؤون الإدارية',
  },
  {
    value: 'sales',
    labelEn: 'Sales & Business Development',
    labelAr: 'المبيعات وتطوير الأعمال',
    descriptionEn: 'Sales and partnerships',
    descriptionAr: 'المبيعات والشراكات',
  },
  {
    value: 'delivery',
    labelEn: 'Delivery & Consulting',
    labelAr: 'التنفيذ والاستشارات',
    descriptionEn: 'Client delivery and consulting engagements',
    descriptionAr: 'تنفيذ المشاريع والاستشارات',
  },
  {
    value: 'legal',
    labelEn: 'Legal & Compliance',
    labelAr: 'الشؤون القانونية والامتثال',
    descriptionEn: 'Legal, contracts, and compliance',
    descriptionAr: 'القانون والعقود والامتثال',
  },
  {
    value: 'marketing',
    labelEn: 'Marketing & Communications',
    labelAr: 'التسويق والاتصال',
    descriptionEn: 'Marketing and brand',
    descriptionAr: 'التسويق والعلامة التجارية',
  },
  {
    value: 'other',
    labelEn: 'Other',
    labelAr: 'أخرى',
  },
];

/** Default assignment for new leads (e.g. sales team). */
export const DEFAULT_ASSIGNED_TEAM_VALUE = 'sales';

/** Resolve label for a team value (EN or AR). */
export function getTeamLabel(value: string, lang: 'en' | 'ar' = 'en'): string {
  const team = DOGAN_CONSULT_TEAMS.find(t => t.value === value);
  if (!team) return value;
  return lang === 'ar' ? team.labelAr : team.labelEn;
}
