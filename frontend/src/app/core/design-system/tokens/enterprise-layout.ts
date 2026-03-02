/**
 * Enterprise layout & spacing — one place for smooth, clean, modern rhythm.
 * Use these everywhere so the app feels consistent and enterprise-grade.
 *
 * Principles:
 * - 8px base grid (4, 8, 12, 16, 24, 32, 48, 64, 96)
 * - Generous section spacing (not cramped)
 * - Consistent gaps between related elements
 * - Single transition timing for polish
 */

/** Base unit in px. All values are multiples of this. */
export const ENTERPRISE_BASE_UNIT = 8;

/**
 * Canonical spacing scale (Tailwind classes).
 * Prefer these over arbitrary values. Base unit: 8px.
 */
export const ENTERPRISE_SPACING = {
  /** 4px */
  gapXs: 'gap-1',
  stackXs: 'space-y-1',
  /** 8px */
  gapSm: 'gap-2',
  stackSm: 'space-y-2',
  /** 12px */
  gapMd: 'gap-3',
  stackMd: 'space-y-3',
  /** 16px */
  gapLg: 'gap-4',
  stackLg: 'space-y-4',
  /** 24px */
  gapXl: 'gap-6',
  stackXl: 'space-y-6',
  /** 32px */
  gap2xl: 'gap-8',
  stack2xl: 'space-y-8',
  /** 48px */
  gap3xl: 'gap-12',
  stack3xl: 'space-y-12',
  /** 64px */
  gap4xl: 'gap-16',
  stack4xl: 'space-y-16',
  /** 96px */
  gap5xl: 'gap-24',
  stack5xl: 'space-y-24',
} as const;

/**
 * Section rhythm — vertical padding for full-width sections.
 * Use on every landing/dashboard section for smooth scroll and clean separation.
 */
export const ENTERPRISE_SECTION = {
  /** Default section: comfortable breathing room */
  padding: 'py-12 sm:py-16 lg:py-20',
  /** Larger sections (hero, CTA) */
  paddingLg: 'py-16 sm:py-20 lg:py-24',
  /** Tighter (dense dashboards) */
  paddingSm: 'py-8 sm:py-10 lg:py-12',
} as const;

/**
 * Container inset — horizontal padding inside containers.
 * Slightly more than minimal for a clean, modern feel.
 */
export const ENTERPRISE_CONTAINER_INSET = {
  /** Standard page content */
  default: 'px-5 sm:px-6 lg:px-8',
  /** Narrow (forms, articles) */
  narrow: 'px-4 sm:px-6',
  /** Maximum breathing (marketing hero) */
  wide: 'px-6 sm:px-8 lg:px-10',
} as const;

/**
 * Component-level spacing — cards, panels, form groups.
 */
export const ENTERPRISE_COMPONENT = {
  /** Card / panel internal padding */
  cardPadding: 'p-5 sm:p-6 lg:p-8',
  cardPaddingSm: 'p-4 sm:p-5',
  /** Space between form fields in a group */
  formGroupGap: 'space-y-5',
  /** Space between label and input */
  labelInputGap: 'gap-2',
  /** Button group gap */
  buttonGroupGap: 'gap-3',
  /** List item gap */
  listGap: 'gap-3',
} as const;

/**
 * Border radius — consistent roundness (smooth, modern).
 */
export const ENTERPRISE_RADIUS = {
  card: 'rounded-xl',
  cardSm: 'rounded-lg',
  button: 'rounded-lg',
  buttonSm: 'rounded-md',
  input: 'rounded-lg',
  badge: 'rounded-full',
} as const;

/**
 * Transitions — one timing for smooth, enterprise feel.
 */
export const ENTERPRISE_TRANSITION = {
  fast: 'transition-all duration-150 ease-out',
  base: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-300 ease-out',
} as const;

/**
 * Full page section: section padding + container + inset.
 * Use as the outer wrapper for each major section.
 */
export const ENTERPRISE_PAGE_SECTION = {
  /** Section wrapper (full width + vertical rhythm) */
  wrapper: 'w-full py-12 sm:py-16 lg:py-20',
  wrapperLg: 'w-full py-16 sm:py-20 lg:py-24',
  /** Inner container (max-width + horizontal padding) */
  container: 'container mx-auto px-5 sm:px-6 lg:px-8',
  /** Narrow inner (e.g. forms) */
  containerNarrow: 'max-w-2xl mx-auto px-4 sm:px-6',
  /** Wide inner (dashboards, tables) */
  containerWide: 'max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8',
} as const;

/**
 * Single class strings for drop-in use in templates.
 */
export const ENTERPRISE_LAYOUT = {
  /** Main content area under nav */
  main: 'min-h-[calc(100vh-60px)]',
  /** Card with enterprise padding and radius */
  card: `${ENTERPRISE_COMPONENT.cardPadding} ${ENTERPRISE_RADIUS.card} ${ENTERPRISE_TRANSITION.base}`,
  /** Stack of content (e.g. form) */
  stack: ENTERPRISE_COMPONENT.formGroupGap,
  /** Inline button group */
  buttonGroup: `flex flex-wrap items-center ${ENTERPRISE_COMPONENT.buttonGroupGap}`,
} as const;
