/**
 * Built-in theme color tokens.
 * Use these in templates so all theme colors and surfaces come from one place.
 * CSS variables are defined in styles/themes/_theme-variables.scss and :root in styles.scss.
 * Tailwind uses the same tokens via tailwind.config.js (primary, th-bg, th-text, etc.).
 */

/** Tailwind class names for theme-aware backgrounds */
export const THEME_BG = {
  primary: 'bg-th-bg',
  alt: 'bg-th-bg-alt',
  tertiary: 'bg-th-bg-tert',
  card: 'bg-th-card',
  nav: 'bg-th-nav',
  input: 'bg-th-input',
  inverse: 'bg-th-bg-inv',
  accent: 'bg-th-bg-accent',
} as const;

/** Tailwind class names for theme-aware text */
export const THEME_TEXT = {
  primary: 'text-th-text',
  secondary: 'text-th-text-2',
  muted: 'text-th-text-3',
  inverse: 'text-th-text-inv',
  accent: 'text-th-text-accent',
} as const;

/** Tailwind class names for theme-aware borders */
export const THEME_BORDER = {
  default: 'border-th-border',
  light: 'border-th-border-lt',
  dark: 'border-th-border-dk',
  primary: 'border-th-border-pri',
} as const;

/** Semantic / brand colors (Tailwind) */
export const THEME_SEMANTIC = {
  primary: 'text-primary bg-primary',
  primaryDark: 'text-primary-dark bg-primary-dark',
  primaryLight: 'text-primary-light bg-primary-light',
  gold: 'text-gold',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
} as const;

/** CSS variable names (for use in style binding or custom CSS) */
export const THEME_CSS_VARS = {
  primary: 'var(--color-primary)',
  primaryDark: 'var(--color-primary-dark)',
  primaryLight: 'var(--color-primary-light)',
  accent: 'var(--color-accent)',
  gold: 'var(--gold)',
  bgPrimary: 'var(--bg-primary)',
  bgSecondary: 'var(--bg-secondary)',
  cardBg: 'var(--card-bg)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  borderDefault: 'var(--border-default)',
  buttonPrimaryBg: 'var(--button-primary-bg)',
  buttonPrimaryText: 'var(--button-primary-text)',

  // AGRC-OS Surface & Text
  surface: 'var(--surface)',
  surfaceIce: 'var(--surface-ice)',
  surfaceSunken: 'var(--surface-sunken)',
  surfaceElevated: 'var(--surface-elevated)',
  textHeading: 'var(--text-heading)',
  textBody: 'var(--text-body)',
  heroBackground: 'var(--agrc-hero-bg)',
  gradientPrimary: 'var(--gradient-primary)',
  gradientHero: 'var(--gradient-hero)',

  // GRC
  riskLow: 'var(--risk-low)',
  riskMedium: 'var(--risk-medium)',
  riskHigh: 'var(--risk-high)',
  riskCritical: 'var(--risk-critical)',
  controlPass: 'var(--control-pass)',
  controlFail: 'var(--control-fail)',
} as const;

/** Tailwind class names for GRC semantic colors */
export const THEME_GRC = {
  riskLow: 'text-risk-low',
  riskMedium: 'text-risk-medium',
  riskHigh: 'text-risk-high',
  riskCritical: 'text-risk-critical',
  controlPass: 'text-control-pass',
  controlFail: 'text-control-fail',
  evidenceFresh: 'text-evidence-fresh',
  evidenceStale: 'text-evidence-stale',
  evidenceMissing: 'text-evidence-missing',
} as const;
