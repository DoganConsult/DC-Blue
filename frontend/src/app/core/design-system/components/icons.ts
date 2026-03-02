/**
 * Icon system — PrimeIcons first, consistent sizes and colors.
 * PrimeIcons are loaded via primeicons.css in angular.json.
 * Use: <span class="pi pi-{name}"></span> or [ngClass]="ICONS.check"
 */

/** PrimeIcons class prefix */
export const ICON_PREFIX = 'pi';

/**
 * Recommended PrimeIcons for common actions (use these for consistency).
 * Full list: https://primeng.org/icons
 */
export const ICONS = {
  // Actions
  check: 'pi pi-check',
  times: 'pi pi-times',
  plus: 'pi pi-plus',
  minus: 'pi pi-minus',
  edit: 'pi pi-pencil',
  delete: 'pi pi-trash',
  search: 'pi pi-search',
  filter: 'pi pi-filter',
  download: 'pi pi-download',
  upload: 'pi pi-upload',
  refresh: 'pi pi-refresh',
  send: 'pi pi-send',
  copy: 'pi pi-copy',
  externalLink: 'pi pi-external-link',
  // Status / feedback
  checkCircle: 'pi pi-check-circle',
  timesCircle: 'pi pi-times-circle',
  infoCircle: 'pi pi-info-circle',
  exclamationTriangle: 'pi pi-exclamation-triangle',
  // Navigation
  chevronDown: 'pi pi-chevron-down',
  chevronUp: 'pi pi-chevron-up',
  chevronLeft: 'pi pi-chevron-left',
  chevronRight: 'pi pi-chevron-right',
  angleRight: 'pi pi-angle-right',
  angleLeft: 'pi pi-angle-left',
  home: 'pi pi-home',
  menu: 'pi pi-bars',
  user: 'pi pi-user',
  users: 'pi pi-users',
  cog: 'pi pi-cog',
  // Content / data
  chartLine: 'pi pi-chart-line',
  chartBar: 'pi pi-chart-bar',
  file: 'pi pi-file',
  folder: 'pi pi-folder',
  calendar: 'pi pi-calendar',
  envelope: 'pi pi-envelope',
  phone: 'pi pi-phone',
  lock: 'pi pi-lock',
  unlock: 'pi pi-unlock',
  shield: 'pi pi-shield',
  verified: 'pi pi-verified',
  // GRC / business
  building: 'pi pi-building',
  briefcase: 'pi pi-briefcase',
  wallet: 'pi pi-wallet',
  tag: 'pi pi-tag',
  bookmark: 'pi pi-bookmark',
} as const;

/** Tailwind classes for icon sizes (use with PrimeIcons). */
export const ICON_SIZES = {
  xs: 'w-3.5 h-3.5 text-[14px]',
  sm: 'w-4 h-4 text-base',
  md: 'w-5 h-5 text-lg',
  lg: 'w-6 h-6 text-xl',
  xl: 'w-8 h-8 text-2xl',
} as const;

/** Semantic icon color classes (Tailwind). */
export const ICON_COLORS = {
  default: 'text-th-text-2',
  primary: 'text-primary',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  error: 'text-red-600',
  muted: 'text-th-text-3',
} as const;

/** Build full icon class: icon + size + color. */
export function iconClass(
  icon: keyof typeof ICONS,
  size: keyof typeof ICON_SIZES = 'md',
  color: keyof typeof ICON_COLORS = 'default'
): string {
  return [ICONS[icon], ICON_SIZES[size], ICON_COLORS[color]].filter(Boolean).join(' ');
}
