/**
 * Shell and container design — page layout, section wrappers, content width.
 * Use these classes so all pages share the same max-width and padding.
 */

/** Main content area (inside app-shell). Use on <main> or the inner wrapper. */
export const SHELL_MAIN_CLASS = 'min-h-[calc(100vh-60px)]';

/** Standard page content wrapper: centered container + horizontal padding. */
export const CONTAINER_CLASS = 'container mx-auto px-4 sm:px-6 lg:px-8';

/** Narrow content (forms, articles). Use with container for max-width constraint. */
export const CONTAINER_NARROW_CLASS = 'max-w-2xl mx-auto px-4 sm:px-6';

/** Wide content (dashboards, tables). */
export const CONTAINER_WIDE_CLASS = 'max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8';

/** Full-bleed section (edge-to-edge background, content still padded via inner container). */
export const SECTION_FULL_CLASS = 'w-full';

/** Section vertical padding — use with theme-section for consistent spacing. */
export const SECTION_PADDING_CLASS = 'py-12 sm:py-16 lg:py-20';

/** Section that alternates background (e.g. theme-section-alt). */
export const SECTION_ALT_CLASS = 'theme-section-alt';

/** Single place for shell layout: nav height and main offset. */
export const SHELL = {
  navHeight: '60px',
  mainMinHeight: 'min-h-[calc(100vh-60px)]',
  /** Class for the main content block under the nav */
  mainClass: SHELL_MAIN_CLASS,
} as const;

/** Container width breakpoints (match Tailwind / styles.scss .container). */
export const CONTAINER_MAX_WIDTH = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/** Combined: section wrapper with standard padding and container inside. */
export const PAGE_SECTION_CLASSES = `${SECTION_FULL_CLASS} ${SECTION_PADDING_CLASS} theme-section`;
export const PAGE_SECTION_CONTAINER_CLASS = CONTAINER_CLASS;
