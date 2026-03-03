/** Landing page content model — matches backend defaultLanding + public_content DB shape */

export interface LandingContent {
  // Existing
  hero: { headline: { en: string; ar: string }; subline: { en: string; ar: string }; cta: { en: string; ar: string } };
  stats: Array<{ value: number; suffix: string; label: { en: string; ar: string } }>;
  services: Array<{ id: string; title: { en: string; ar: string }; color: string }>;
  chartData: { labels: string[]; values: number[] };

  // Section content (all optional — fallback to component defaults when absent)
  expertise?: ExpertiseCard[];
  methodology?: MethodologyStep[];
  sectors?: SectorCard[];
  benefits?: Array<{ en: string; ar: string }>;
  industries?: IndustryItem[];
  caseStudies?: CaseStudyItem[];
  testimonials?: { featured: TestimonialItem[]; additional: TestimonialItem[] };
  partners?: PartnerItem[];
  certifications?: { security: CertItem[]; technical: CertItem[]; timeline: TimelineYear[] };
  securityPillars?: PillarItem[];
  engagementSteps?: StepItem[];
  faq?: FaqItem[];
  pricingTiers?: TierItem[];
  trustBadges?: Array<{ en: string; ar: string }>;
}

export interface ExpertiseCard {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  iconPath: string;
  iconBg: string;
  iconColor: string;
}

export interface MethodologyStep {
  number: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
}

export interface SectorCard {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  iconPath: string;
}

export interface IndustryItem {
  id: string;
  icon: string;
  color: string;
  titleEn: string;
  titleAr: string;
}

export interface CaseStudyItem {
  id: string;
  industry: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  metrics?: Array<{ labelEn: string; labelAr: string; value: string }>;
  technologies?: string[];
  duration?: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  quoteEn: string;
  quoteAr: string;
  avatar?: string;
}

export interface PartnerItem {
  name: string;
  logo?: string;
  level: string;
  category: string;
  certifications?: string[];
}

export interface CertItem {
  name: string;
  issuer: string;
  descEn: string;
  descAr: string;
  icon?: string;
}

export interface TimelineYear {
  year: string;
  certs: string[];
}

export interface PillarItem {
  titleEn: string;
  titleAr: string;
  icon: string;
}

export interface StepItem {
  titleEn: string;
  titleAr: string;
  icon: string;
}

export interface FaqItem {
  qEn: string;
  qAr: string;
  aEn: string;
  aAr: string;
}

export interface TierItem {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  popular?: boolean;
}
