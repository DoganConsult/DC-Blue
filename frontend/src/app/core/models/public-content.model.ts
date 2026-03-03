/**
 * Shared content types for public pages (CMS / API).
 * Use these interfaces instead of ad-hoc types or (content as any).
 */

export type PublicPageKey = 'about' | 'services' | 'case_studies' | 'insights';

/** Generic page content from /api/public/content/:page */
export interface PageContent {
  hero?: {
    title_en?: string;
    title_ar?: string;
    subtitle_en?: string;
    subtitle_ar?: string;
  };
  sections?: unknown[];
  [key: string]: unknown;
}

/** Legal page from /api/public/legal/:key */
export interface LegalPageContent {
  key: string;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  updated_at?: string;
}

/** Re-export landing content so consumers can import all public content types from one place */
export type { LandingContent } from './landing.model';
