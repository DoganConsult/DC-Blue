export interface LandingContent {
  hero: { headline: { en: string; ar: string }; subline: { en: string; ar: string }; cta: { en: string; ar: string } };
  stats: Array<{ value: number; suffix: string; label: { en: string; ar: string } }>;
  services: Array<{ id: string; title: { en: string; ar: string }; color: string }>;
  chartData: { labels: string[]; values: number[] };
}
