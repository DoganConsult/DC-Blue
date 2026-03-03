// =====================================================================
// Centralized Page Styles Registry
// Single source of truth for all public page colors, gradients,
// section compositions, and accent configurations.
// =====================================================================

// ── Color Palette ────────────────────────────────────────────────────

export interface ColorToken {
  hex: string;
  rgba12?: string;
  rgba50?: string;
  rgba75?: string;
  rgba08?: string;
  rgba06?: string;
}

export const COLOR_PALETTE = {
  // Service domain colors
  network:       { hex: '#0EA5E9', rgba12: 'rgba(14,165,233,0.12)', rgba50: 'rgba(14,165,233,0.5)', rgba75: 'rgba(14,165,233,0.75)', rgba08: 'rgba(14,165,233,0.08)' } as ColorToken,
  cybersecurity: { hex: '#006C35', rgba12: 'rgba(0,108,53,0.12)' } as ColorToken,
  cloud:         { hex: '#6366F1', rgba12: 'rgba(99,102,241,0.12)' } as ColorToken,
  integration:   { hex: '#10B981', rgba12: 'rgba(16,185,129,0.12)' } as ColorToken,
  iot:           { hex: '#F59E0B', rgba12: 'rgba(245,158,11,0.12)' } as ColorToken,
  grc:           { hex: '#8B5CF6', rgba12: 'rgba(139,92,246,0.12)' } as ColorToken,

  // Extended simulation colors
  threat:        { hex: '#EF4444', rgba12: 'rgba(239,68,68,0.12)' } as ColorToken,
  healthcare:    { hex: '#0A3C6B', rgba12: 'rgba(10,60,107,0.12)' } as ColorToken,
  digitalTwin:   { hex: '#EC4899', rgba12: 'rgba(236,72,153,0.12)' } as ColorToken,
  smartCity:     { hex: '#14B8A6', rgba12: 'rgba(20,184,166,0.12)' } as ColorToken,

  // Chart/KPI UI colors
  sky400:     { hex: '#38bdf8', rgba12: 'rgba(56,189,248,0.12)',  rgba50: 'rgba(56,189,248,0.5)',  rgba75: 'rgba(56,189,248,0.75)',  rgba08: 'rgba(56,189,248,0.08)' } as ColorToken,
  emerald400: { hex: '#34d399', rgba12: 'rgba(52,211,153,0.12)',  rgba50: 'rgba(52,211,153,0.5)',  rgba75: 'rgba(52,211,153,0.75)',  rgba06: 'rgba(52,211,153,0.06)' } as ColorToken,
  amber300:   { hex: '#fbbf24', rgba12: 'rgba(251,191,36,0.12)',  rgba75: 'rgba(251,191,36,0.75)' } as ColorToken,
  purple400:  { hex: '#c084fc', rgba12: 'rgba(168,85,247,0.12)',  rgba75: 'rgba(192,132,252,0.75)' } as ColorToken,
  orange300:  { hex: '#fb923c', rgba75: 'rgba(251,146,60,0.75)' } as ColorToken,
  indigo400:  { hex: '#818cf8', rgba75: 'rgba(129,140,248,0.75)' } as ColorToken,

  // Extra chart series colors
  cyan:   { hex: '#06B6D4' } as ColorToken,
  purple: { hex: '#A855F7' } as ColorToken,
  gold:   { hex: '#E3B76B' } as ColorToken,

  // UI semantics
  darkBg:    { hex: '#0f172a' } as ColorToken,
  gridLine:  { hex: '#94a3b8' } as ColorToken,
  axisLabel: { hex: '#64748b' } as ColorToken,
} as const;

export type ColorKey = keyof typeof COLOR_PALETTE;

// ── Service Colors ───────────────────────────────────────────────────

export interface ServiceColorEntry {
  id: string;
  key: ColorKey;
  hex: string;
}

export const SERVICE_COLORS: ServiceColorEntry[] = [
  { id: '1', key: 'network',       hex: COLOR_PALETTE.network.hex },
  { id: '2', key: 'cybersecurity', hex: COLOR_PALETTE.cybersecurity.hex },
  { id: '3', key: 'cloud',         hex: COLOR_PALETTE.cloud.hex },
  { id: '4', key: 'integration',   hex: COLOR_PALETTE.integration.hex },
  { id: '5', key: 'iot',           hex: COLOR_PALETTE.iot.hex },
  { id: '6', key: 'grc',           hex: COLOR_PALETTE.grc.hex },
];

export function getServiceColor(serviceId: string): string {
  return SERVICE_COLORS.find(s => s.id === serviceId)?.hex ?? COLOR_PALETTE.network.hex;
}

// ── Simulation Colors ────────────────────────────────────────────────

export const SIMULATION_COLORS: Record<string, string> = {
  'iot-ksa-enterprise':   COLOR_PALETTE.iot.hex,
  'iot-healthcare':       COLOR_PALETTE.network.hex,
  'cybersec-threat':      COLOR_PALETTE.threat.hex,
  'healthcare-grc':       COLOR_PALETTE.integration.hex,
  'quasi-compliance':     COLOR_PALETTE.grc.hex,
  'gov-digital-transform': COLOR_PALETTE.cybersecurity.hex,
  'nca-ecc-compliance':   COLOR_PALETTE.healthcare.hex,
  'enterprise-sdn':       COLOR_PALETTE.cloud.hex,
  'healthcare-emr':       COLOR_PALETTE.digitalTwin.hex,
  'gov-smart-city':       COLOR_PALETTE.smartCity.hex,
};

// ── Chart Theme ──────────────────────────────────────────────────────

export const CHART_THEME = {
  series: [
    COLOR_PALETTE.network.hex,
    COLOR_PALETTE.cybersecurity.hex,
    COLOR_PALETTE.cloud.hex,
    COLOR_PALETTE.integration.hex,
    COLOR_PALETTE.iot.hex,
    COLOR_PALETTE.threat.hex,
    COLOR_PALETTE.cyan.hex,
    COLOR_PALETTE.grc.hex,
  ],
  nocSeries: [
    COLOR_PALETTE.sky400.hex,
    COLOR_PALETTE.emerald400.hex,
    COLOR_PALETTE.purple400.hex,
    COLOR_PALETTE.threat.hex,
    COLOR_PALETTE.amber300.hex,
    COLOR_PALETTE.smartCity.hex,
    COLOR_PALETTE.indigo400.hex,
    COLOR_PALETTE.orange300.hex,
  ],
  doughnutSegments: [
    COLOR_PALETTE.sky400.rgba75!,
    COLOR_PALETTE.emerald400.rgba75!,
    COLOR_PALETTE.amber300.rgba75!,
    COLOR_PALETTE.purple400.rgba75!,
    COLOR_PALETTE.orange300.rgba75!,
    COLOR_PALETTE.indigo400.rgba75!,
  ],
  tooltip: {
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderColor: 'rgba(56,189,248,0.15)',
    borderWidth: 1,
  },
  axis: {
    gridColor: 'rgba(148,163,184,0.06)',
    gridColorRadar: 'rgba(148,163,184,0.1)',
    tickColor: COLOR_PALETTE.axisLabel.hex,
    labelColor: COLOR_PALETTE.gridLine.hex,
  },
  darkBg: COLOR_PALETTE.darkBg.hex,
} as const;

// ── KPI Card Colors ──────────────────────────────────────────────────

export const KPI_COLORS = [
  { iconBg: COLOR_PALETTE.sky400.rgba12!,     iconColor: COLOR_PALETTE.sky400.hex,     valueColor: '#ffffff' },
  { iconBg: COLOR_PALETTE.emerald400.rgba12!, iconColor: COLOR_PALETTE.emerald400.hex, valueColor: COLOR_PALETTE.emerald400.hex },
  { iconBg: COLOR_PALETTE.amber300.rgba12!,   iconColor: COLOR_PALETTE.amber300.hex,   valueColor: COLOR_PALETTE.amber300.hex },
  { iconBg: COLOR_PALETTE.purple400.rgba12!,  iconColor: COLOR_PALETTE.purple400.hex,  valueColor: COLOR_PALETTE.purple400.hex },
] as const;

// ── Status Badge Colors ──────────────────────────────────────────────

export const STATUS_COLORS: Record<string, string> = {
  new:       'bg-sky-100 text-sky-700',
  qualified: 'bg-purple-100 text-purple-700',
  contacted: 'bg-amber-100 text-amber-700',
  proposal:  'bg-indigo-100 text-indigo-700',
  won:       'bg-emerald-100 text-emerald-700',
  lost:      'bg-red-100 text-red-700',
};

// ── Problem Card Accents ─────────────────────────────────────────────

export const PROBLEM_CARD_ACCENTS = [
  { barGradient: 'bg-gradient-to-b from-sky-400 to-sky-600',     iconBg: 'bg-gradient-to-br from-sky-50 to-sky-100',     iconText: 'text-sky-600' },
  { barGradient: 'bg-gradient-to-b from-red-400 to-rose-600',    iconBg: 'bg-gradient-to-br from-red-50 to-rose-100',    iconText: 'text-red-500' },
  { barGradient: 'bg-gradient-to-b from-amber-400 to-orange-500', iconBg: 'bg-gradient-to-br from-amber-50 to-orange-100', iconText: 'text-amber-600' },
] as const;

// ── WhyChoose Differentiator Colors ──────────────────────────────────

export const WHY_CHOOSE_ACCENTS = [
  { iconBg: 'bg-gradient-to-br from-sky-50 to-sky-100',       iconColor: 'text-sky-600',     topBarGradient: 'bg-gradient-to-r from-sky-400 to-sky-600' },
  { iconBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', iconColor: 'text-emerald-600', topBarGradient: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
  { iconBg: 'bg-gradient-to-br from-violet-50 to-violet-100',   iconColor: 'text-violet-600',  topBarGradient: 'bg-gradient-to-r from-violet-400 to-violet-600' },
] as const;

// ── Guidance Type Colors (services-detailed) ─────────────────────────

export const GUIDANCE_TYPE_COLORS = {
  cost:       { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', tipText: 'text-emerald-800', impactText: 'text-emerald-600' },
  efficiency: { bg: 'bg-blue-50',    iconBg: 'bg-blue-100',    iconText: 'text-blue-600',    tipText: 'text-blue-800',    impactText: 'text-blue-600' },
  risk:       { bg: 'bg-amber-50',   iconBg: 'bg-amber-100',   iconText: 'text-amber-600',   tipText: 'text-amber-800',   impactText: 'text-amber-600' },
} as const;

// ── Architecture Layer Colors (services-detailed) ────────────────────

export const ARCH_LAYER_COLORS = [
  'bg-sky-100 text-sky-700',
  'bg-indigo-100 text-indigo-700',
  'bg-violet-100 text-violet-700',
  'bg-th-bg-alt text-th-text-2',
] as const;

// ── Executive Profile Colors ─────────────────────────────────────────

export const EXEC_STAT_GRADIENTS = [
  'bg-gradient-to-r from-green-400 to-emerald-400',
  'bg-gradient-to-r from-blue-400 to-cyan-400',
  'bg-gradient-to-r from-purple-400 to-pink-400',
  'bg-gradient-to-r from-orange-400 to-red-400',
] as const;

export const CAREER_DOT_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
] as const;

export const CAREER_COMPANY_COLORS = [
  'text-blue-400',
  'text-purple-400',
  'text-green-400',
  'text-orange-400',
] as const;

// ── Gradient Definitions ─────────────────────────────────────────────

// Enterprise marketing pages: single navy background (centralized)
export const MARKETING_PAGE = {
  heroBg:    '#0B1220',
  heroClass: 'bg-[#0B1220]',
} as const;

export const GRADIENTS = {
  // Page hero backgrounds (prefer MARKETING_PAGE.heroClass for all marketing pages)
  pageHeroDark:     'bg-[#0B1220]',
  inquiryBg:        'bg-[#0B1220]',

  // Hero ICT CSS background (blue gradient)
  heroIctBgCss:     'linear-gradient(135deg, #1f49c7 0%, #2f6df3 100%)',

  // Section backgrounds
  roiSection:       'bg-gradient-to-br from-brand-dark via-sky-800 to-brand-darker',
  ctaSection:       'bg-gradient-to-br from-[#1f49c7] to-[#2f6df3]',
  chartSection:     'bg-gradient-to-br from-brand-darker via-surface-dark to-brand-darker',
  simulationsSection: 'bg-gradient-to-b from-brand-darker via-surface-dark to-brand-darker',

  // Button gradients
  buttonContact:    'bg-gold-accent hover:bg-gold-accent/90',
  buttonPrimary:    'bg-gold-accent hover:bg-gold-accent/90',

  // Hero text gradient
  heroText:         'bg-gradient-to-r from-sky-400 to-cyan-300',

  // Executive CTA gradient
  executiveCta:     'bg-gradient-to-r from-blue-600 to-purple-600',
} as const;

export type GradientKey = keyof typeof GRADIENTS;

// ── Page Registry ────────────────────────────────────────────────────

export type PageId =
  | 'landing' | 'services' | 'about' | 'case-studies' | 'insights'
  | 'inquiry' | 'thanks' | 'track'
  | 'privacy' | 'terms' | 'pdpl' | 'cookies'
  | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'change-password'
  | 'partner-register'
  | 'not-found'
  | 'case-studies-healthcare';

export type SectionId =
  | 'hero-ict' | 'social-proof' | 'problem' | 'services' | 'why-choose' | 'contact'
  | 'services-detailed' | 'technical-architecture' | 'chart' | 'roi-calculator' | 'simulations'
  | 'executive-profile' | 'leadership' | 'certifications' | 'education' | 'awards'
  | 'government-credentials' | 'global-reach' | 'strategic-achievements'
  | 'case-studies' | 'testimonials-enhanced'
  | 'insights' | 'faq'
  | 'roi' | 'stats' | 'final-cta'
  | 'nav' | 'footer'
  | 'partners' | 'integrations' | 'security' | 'standards' | 'trust'
  | 'industries' | 'engagement-flow' | 'competitor' | 'cr-activities' | 'transform'
  | 'premium-residency' | 'hero-clean';

export interface PageEntry {
  id: PageId;
  route: string;
  sections: SectionId[];
  pageBackground?: string;
}

export const PAGE_REGISTRY: PageEntry[] = [
  { id: 'landing',      route: '/',                sections: ['hero-ict', 'social-proof', 'problem', 'services', 'why-choose', 'contact'] },
  { id: 'services',     route: '/services',        sections: ['services-detailed', 'technical-architecture', 'chart', 'roi-calculator', 'simulations', 'contact'] },
  { id: 'about',        route: '/about',           sections: ['executive-profile', 'leadership', 'certifications', 'education', 'awards', 'government-credentials', 'global-reach', 'strategic-achievements'] },
  { id: 'case-studies', route: '/case-studies',     sections: ['case-studies', 'testimonials-enhanced', 'contact'] },
  { id: 'case-studies-healthcare', route: '/case-studies/healthcare', sections: [] },
  { id: 'insights',     route: '/insights',        sections: ['insights', 'faq', 'contact'] },
  { id: 'inquiry',      route: '/inquiry',         sections: [], pageBackground: GRADIENTS.inquiryBg },
  { id: 'thanks',       route: '/thanks',          sections: [], pageBackground: GRADIENTS.inquiryBg },
  { id: 'track',        route: '/track',           sections: [], pageBackground: GRADIENTS.inquiryBg },
  { id: 'privacy',      route: '/privacy',         sections: [], pageBackground: GRADIENTS.pageHeroDark },
  { id: 'terms',        route: '/terms',           sections: [], pageBackground: GRADIENTS.pageHeroDark },
  { id: 'pdpl',         route: '/pdpl',            sections: [], pageBackground: GRADIENTS.pageHeroDark },
  { id: 'cookies',      route: '/cookies',         sections: [], pageBackground: GRADIENTS.pageHeroDark },
  { id: 'login',        route: '/login',           sections: [], pageBackground: 'bg-th-bg' },
  { id: 'register',     route: '/register',        sections: [], pageBackground: 'bg-th-bg' },
  { id: 'forgot-password', route: '/forgot-password', sections: [], pageBackground: 'bg-th-bg' },
  { id: 'reset-password',  route: '/reset-password',  sections: [], pageBackground: 'bg-th-bg' },
  { id: 'change-password', route: '/change-password',  sections: [], pageBackground: 'bg-th-bg' },
  { id: 'partner-register', route: '/partner/register', sections: [], pageBackground: 'bg-th-bg' },
  { id: 'not-found',    route: '**',               sections: [], pageBackground: GRADIENTS.pageHeroDark },
];

export function getPageEntry(id: PageId): PageEntry | undefined {
  return PAGE_REGISTRY.find(p => p.id === id);
}

export function getPageByRoute(route: string): PageEntry | undefined {
  return PAGE_REGISTRY.find(p => p.route === route);
}
