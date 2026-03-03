# Full UI Inventory — Reorganization Reference

**Generated:** 2025-03-03  
**Purpose:** Single list of all UI (pages, sections, components, design system) for reorganization.

---

## 1. PAGES (route-level)

| Route / path | File | Notes |
|--------------|------|--------|
| `/` | `pages/landing.page.ts` | LandingPage |
| `/services` | `pages/services.page.ts` | ServicesPage |
| `/about` | `pages/about.page.ts` | AboutPage |
| `/case-studies` | `pages/case-studies.page.ts` | CaseStudiesPage |
| `/case-studies/healthcare` | `pages/case-studies/healthcare/healthcare-case-study.page.ts` | HealthcareCaseStudyPage |
| `/insights` | `pages/insights.page.ts` | InsightsPage |
| `/register` | `pages/auth/register.page.ts` | RegisterPage |
| `/login` | `pages/auth/login.page.ts` | LoginPage |
| `/change-password` | `pages/auth/change-password.page.ts` | ChangePasswordPage |
| `/forgot-password` | `pages/auth/forgot-password.page.ts` | ForgotPasswordPage |
| `/reset-password` | `pages/auth/reset-password.page.ts` | ResetPasswordPage |
| `/inquiry` | `pages/inquiry.page.ts` | InquiryPage |
| `/thanks` | `pages/thanks.page.ts` | ThanksPage |
| `/track` | `pages/track.page.ts` | TrackPage |
| `/privacy`, `/terms`, `/pdpl`, `/cookies` | `pages/legal.page.ts` | LegalPage (data: legalKey) |
| `/workspace` | `pages/workspace/client-workspace.page.ts` | ClientWorkspacePage (auth) |
| `/dashboard` | redirect → workspace | (no page; CustomerDashboardPage exists but not routed) |
| `/partner` | `pages/partner/partner-dashboard.page.ts` | PartnerDashboardPage (auth) |
| `/partner/register` | `pages/partner/partner-register.page.ts` | PartnerRegisterPage |
| `/partner/submit` | `pages/partner/partner-submit.page.ts` | PartnerSubmitPage (auth) |
| `/admin` | `pages/admin/admin-dashboard.page.ts` | AdminDashboardPage (auth) |
| `/admin/leads/:id` | `pages/admin/admin-lead-detail.page.ts` | AdminLeadDetailPage (auth) |
| `/not-found`, `**` | `pages/not-found.page.ts` | NotFoundPage |

**Unused (no route):**  
- `pages/dashboard/customer-dashboard.page.ts` — CustomerDashboardPage

---

## 2. LANDING SECTIONS (used on landing or other content pages)

**Currently used on LandingPage (landing.page.ts):**  
- HeroSectionIctComponent  
- SocialProofSectionComponent  
- ProblemSectionComponent  
- ServicesSectionComponent  
- WhyChooseSectionComponent  
- ContactSectionComponent  

**All section components (full set):**

| Section | File | Selector |
|---------|------|----------|
| Hero (ICT) | `sections/hero-section-ict.component.ts` | app-hero-section-ict |
| Hero (clean) | `sections/hero-clean.component.ts` | app-hero-clean |
| Nav | `sections/nav-section.component.ts` | app-nav-section |
| Social proof | `sections/social-proof-section.component.ts` | app-social-proof-section |
| Problem | `sections/problem-section.component.ts` | app-problem-section |
| Services | `sections/services-section.component.ts` | app-services-section |
| Services detailed | `sections/services-detailed.component.ts` | app-services-detailed |
| Why choose | `sections/why-choose-section.component.ts` | app-why-choose-section |
| Contact | `sections/contact-section.component.ts` | app-contact-section |
| Footer | `sections/footer-section.component.ts` | app-footer-section |
| Stats | `sections/stats-section.component.ts` | app-stats-section |
| Trust | `sections/trust-section.component.ts` | app-trust-section |
| ROI | `sections/roi-section.component.ts` | app-roi-section |
| ROI calculator | `sections/roi-calculator-section.component.ts` | app-roi-calculator-section |
| Security | `sections/security-section.component.ts` | app-security-section |
| Standards | `sections/standards-section.component.ts` | app-standards-section |
| FAQ | `sections/faq-section.component.ts` | app-faq-section |
| Pricing | `sections/pricing-section.component.ts` | app-pricing-section |
| Transform | `sections/transform-section.component.ts` | app-transform-section |
| Final CTA | `sections/final-cta-section.component.ts` | app-final-cta-section |
| Industries | `sections/industries-section.component.ts` | app-industries-section |
| Integrations | `sections/integrations-section.component.ts` | app-integrations-section |
| Competitor | `sections/competitor-section.component.ts` | app-competitor-section |
| Chart | `sections/chart-section.component.ts` | app-chart-section |
| Engagement flow | `sections/engagement-flow-section.component.ts` | app-engagement-flow-section |
| Certifications | `sections/certifications-showcase.component.ts` | app-certifications-showcase |
| Education | `sections/education-section.component.ts` | app-education-section |
| Case studies | `sections/case-studies-section.component.ts` | app-case-studies-section |
| Leadership | `sections/leadership-section.component.ts` | app-leadership-section |
| CR activities | `sections/cr-activities-section.component.ts` | app-cr-activities-section |
| Executive profile | `sections/executive-profile.component.ts` | app-executive-profile |
| Simulations | `sections/simulations-section.component.ts` | app-simulations-section |
| Global reach | `sections/global-reach.component.ts` | app-global-reach |
| Strategic achievements | `sections/strategic-achievements.component.ts` | app-strategic-achievements |
| Testimonials enhanced | `sections/testimonials-enhanced.component.ts` | app-testimonials-enhanced |
| Partners | `sections/partners-section.component.ts` | app-partners-section |
| Technical architecture | `sections/technical-architecture.component.ts` | app-technical-architecture |
| Premium residency | `sections/premium-residency.component.ts` | app-premium-residency |
| Government credentials | `sections/government-credentials.component.ts` | app-government-credentials |
| Awards | `sections/awards-section.component.ts` | app-awards-section |
| Insights | `sections/insights-section.component.ts` | app-insights-section |

---

## 3. SHARED COMPONENTS (app-level / reusable)

| Component | File | Selector |
|-----------|------|----------|
| App shell | `components/app-shell.component.ts` | app-shell |
| Cookie consent | `components/cookie-consent.component.ts` | app-cookie-consent |
| Scroll to top | `components/scroll-to-top.component.ts` | app-scroll-to-top |
| Theme switcher | `components/theme-switcher.component.ts` | app-theme-switcher |
| Dr Dogan Copilot | `components/dr-dogan-copilot.component.ts` | app-dr-dogan-copilot |
| Architecture map | `components/charts/architecture-map.component.ts` | app-architecture-map |
| Delivery timeline | `components/charts/delivery-timeline.component.ts` | app-delivery-timeline |
| KPI bullet chart | `components/charts/kpi-bullet-chart.component.ts` | app-kpi-bullet-chart, app-kpi-bullet-svg |
| References (case studies) | `components/case-studies/references.component.ts` | app-references |

---

## 4. DESIGN SYSTEM (core/design-system)

**Tokens:**  
- `tokens/typography.ts`  
- `tokens/spacing.ts`  
- `tokens/theme-colors.ts`  
- `tokens/enterprise-layout.ts`  

**Components:**  
- `components/buttons.ts` — button exports  
- `components/icons.ts` — icon exports  
- `components/shell-containers.ts` — shell/layout exports  

**Patterns:**  
- `patterns/loading-states.ts`  
- `patterns/empty-states.ts`  
- `patterns/error-boundaries.ts`  

**Widgets:**  
- `widgets.ts` — ADVANCED_WIDGET_CARD_CLASS, ADVANCED_WIDGET_CARD_CLASSES  

**Services:**  
- `services/design-system.service.ts`  
- `services/widget-registry.service.ts`  
- `services/theme.service.ts`  
- `services/chart-factory.service.ts`  

---

## 5. WORKSPACE (customer/partner portal tabs)

| Tab | Component | File |
|-----|-----------|------|
| Overview | WorkspaceOverviewComponent | `pages/workspace/components/workspace-overview.component.ts` |
| Pipeline | WorkspacePipelineComponent | `pages/workspace/components/workspace-pipeline.component.ts` |
| Inquiries | WorkspaceInquiriesComponent | `pages/workspace/components/workspace-inquiries.component.ts` |
| Tenders | WorkspaceTendersComponent | `pages/workspace/components/workspace-tenders.component.ts` |
| Demos & POC | WorkspaceDemosComponent | `pages/workspace/components/workspace-demos.component.ts` |
| Projects | WorkspaceProjectsComponent | `pages/workspace/components/workspace-projects.component.ts` |
| Contracts | WorkspaceContractsComponent | `pages/workspace/components/workspace-contracts.component.ts` |
| Messages | WorkspaceMessagesComponent | `pages/workspace/components/workspace-messages.component.ts` |
| Settings | WorkspaceSettingsComponent | `pages/workspace/components/workspace-settings.component.ts` |

---

## 6. PARTNER PORTAL (partner dashboard + children)

**Pages:**  
- PartnerDashboardPage, PartnerRegisterPage, PartnerSubmitPage  

**Partner components (used in partner dashboard / submit):**

| Component | File |
|-----------|------|
| PartnerNotificationsComponent | `pages/partner/components/partner-notifications.component.ts` |
| PartnerMessagingComponent | `pages/partner/components/partner-messaging.component.ts` |
| PartnerCommissionsComponent | `pages/partner/components/partner-commissions.component.ts` |
| PartnerLeadsTableComponent | `pages/partner/components/partner-leads-table.component.ts` |
| PartnerActivityComponent | `pages/partner/components/partner-activity.component.ts` |
| PartnerOnboardingComponent | `pages/partner/components/partner-onboarding.component.ts` |
| PartnerForecastComponent | `pages/partner/components/partner-forecast.component.ts` |
| PartnerFeedbackComponent | `pages/partner/components/partner-feedback.component.ts` |
| PartnerResourcesComponent | `pages/partner/components/partner-resources.component.ts` |
| PartnerProfileComponent | `pages/partner/components/partner-profile.component.ts` |
| PartnerTrainingComponent | `pages/partner/components/partner-training.component.ts` |
| PartnerAchievementsComponent | `pages/partner/components/partner-achievements.component.ts` |
| PartnerInsightsComponent | `pages/partner/components/partner-insights.component.ts` |
| PartnerTierComponent | `pages/partner/components/partner-tier.component.ts` |
| PartnerAnalyticsComponent | `pages/partner/components/partner-analytics.component.ts` |
| PartnerPipelineComponent | `pages/partner/components/partner-pipeline.component.ts` |
| PartnerSlaComponent | `pages/partner/components/partner-sla.component.ts` |

---

## 7. ADMIN PORTAL (admin dashboard + children)

**Pages:**  
- AdminDashboardPage, AdminLeadDetailPage  

**Admin components:**

| Component | File |
|-----------|------|
| AdminLeadsTableComponent | `pages/admin/components/admin-leads-table.component.ts` |
| AdminPartnersTableComponent | `pages/admin/components/admin-partners-table.component.ts` |
| AdminTeamManagementComponent | `pages/admin/components/admin-team-management.component.ts` |
| AdminAiAssistantComponent | `pages/admin/components/admin-ai-assistant.component.ts` |
| AdminSettingsComponent | `pages/admin/components/admin-settings.component.ts` |
| AdminStructureComponent | `pages/admin/components/admin-structure.component.ts` |
| AdminCommissionApprovalComponent | `pages/admin/components/admin-commission-approval.component.ts` |
| AdminGatePipelineComponent | `pages/admin/components/admin-gate-pipeline.component.ts` |
| AdminOpportunityPipelineComponent | `pages/admin/components/admin-opportunity-pipeline.component.ts` |
| AdminEngagementManagerComponent | `pages/admin/components/admin-engagement-manager.component.ts` |
| AdminNotificationsComponent | `pages/admin/components/admin-notifications.component.ts` |
| AdminAnalyticsComponent | `pages/admin/components/admin-analytics.component.ts` |
| AdminAuditLogComponent | `pages/admin/components/admin-audit-log.component.ts` |
| AdminFileBrowserComponent | `pages/admin/components/admin-file-browser.component.ts` |
| AdminEmailClientComponent | `pages/admin/components/admin-email-client.component.ts` |
| AdminERPIntegrationComponent | `pages/admin/components/admin-erp-integration.component.ts` |

---

## 8. CUSTOMER DASHBOARD (standalone — not routed)

| Item | File |
|------|------|
| CustomerDashboardPage | `pages/dashboard/customer-dashboard.page.ts` |

*(No child components; self-contained page.)*

---

## 9. CORE PIPES & GUARDS (UI-related)

| Type | File |
|------|------|
| Pipe | `core/pipes/translate.pipe.ts` |
| Guard | `core/guards/auth.guard.ts` |

---

## 10. COUNTS SUMMARY

| Category | Count |
|----------|--------|
| Pages | 23 (22 routed + 1 unused customer dashboard) |
| Landing sections | 38 |
| Shared components | 9 |
| Design-system tokens/patterns/widgets | 12 files |
| Workspace tab components | 9 |
| Partner components | 17 |
| Admin components | 16 |
| Pipes (UI) | 1 |
| Guards | 1 |

---

## 11. Suggested reorganization buckets

- **Public site:** Landing + sections used on `/`, `/services`, `/about`, `/case-studies`, `/insights` + shared components (app-shell, cookie-consent, scroll-to-top, theme-switcher).
- **Auth flows:** All `pages/auth/*` + login/register/forgot/reset/change-password.
- **Legal:** Single `legal.page` with keys (privacy, terms, pdpl, cookies).
- **Customer/lead:** Inquiry, thanks, track + (optional) customer-dashboard or workspace as single “portal”.
- **Workspace:** One workspace page + 9 tab components (overview, pipeline, inquiries, tenders, demos, projects, contracts, messages, settings).
- **Partner:** Partner pages + 17 partner components.
- **Admin:** Admin pages + 16 admin components.
- **Design system:** tokens, buttons, icons, shell-containers, patterns, widgets, design-system + theme + widget-registry + chart-factory services.
- **Sections bank:** All 38 sections for reuse across landing, about, services, case-studies, insights (pick per page).

Use this list to rename, move, or merge UI into a new folder/module structure.
