import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AppShellComponent } from './components/app-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/landing.page').then(m => m.LandingPage) },
      { path: 'services', loadComponent: () => import('./pages/services.page').then(m => m.ServicesPage) },
      { path: 'about', loadComponent: () => import('./pages/about.page').then(m => m.AboutPage) },
      { path: 'case-studies', loadComponent: () => import('./pages/case-studies.page').then(m => m.CaseStudiesPage) },
      { path: 'insights', loadComponent: () => import('./pages/insights.page').then(m => m.InsightsPage) },
      { path: 'register', loadComponent: () => import('./pages/auth/register.page').then(m => m.RegisterPage) },
      { path: 'login', loadComponent: () => import('./pages/auth/login.page').then(m => m.LoginPage) },
      { path: 'change-password', loadComponent: () => import('./pages/auth/change-password.page').then(m => m.ChangePasswordPage) },
      { path: 'forgot-password', loadComponent: () => import('./pages/auth/forgot-password.page').then(m => m.ForgotPasswordPage) },
      { path: 'reset-password', loadComponent: () => import('./pages/auth/reset-password.page').then(m => m.ResetPasswordPage) },
      { path: 'inquiry', loadComponent: () => import('./pages/inquiry.page').then(m => m.InquiryPage) },
      { path: 'thanks', loadComponent: () => import('./pages/thanks.page').then(m => m.ThanksPage) },
      { path: 'track', loadComponent: () => import('./pages/track.page').then(m => m.TrackPage) },
      { path: 'privacy', loadComponent: () => import('./pages/legal.page').then(m => m.LegalPage), data: { legalKey: 'privacy' } },
      { path: 'terms', loadComponent: () => import('./pages/legal.page').then(m => m.LegalPage), data: { legalKey: 'terms' } },
      { path: 'pdpl', loadComponent: () => import('./pages/legal.page').then(m => m.LegalPage), data: { legalKey: 'pdpl' } },
      { path: 'cookies', loadComponent: () => import('./pages/legal.page').then(m => m.LegalPage), data: { legalKey: 'cookies' } },
      { path: 'workspace', loadComponent: () => import('./pages/workspace/client-workspace.page').then(m => m.ClientWorkspacePage), canActivate: [authGuard], data: { roles: ['customer', 'partner', 'admin'] } },
      { path: 'dashboard', redirectTo: 'workspace', pathMatch: 'full' },
      { path: 'partner', loadComponent: () => import('./pages/partner/partner-dashboard.page').then(m => m.PartnerDashboardPage), canActivate: [authGuard], data: { roles: ['partner', 'admin'] } },
      { path: 'partner/register', loadComponent: () => import('./pages/partner/partner-register.page').then(m => m.PartnerRegisterPage) },
      { path: 'partner/submit', loadComponent: () => import('./pages/partner/partner-submit.page').then(m => m.PartnerSubmitPage), canActivate: [authGuard], data: { roles: ['partner', 'admin'] } },
      { path: 'admin', loadComponent: () => import('./pages/admin/admin-dashboard.page').then(m => m.AdminDashboardPage), canActivate: [authGuard], data: { roles: ['admin', 'employee'] } },
      { path: 'admin/leads/:id', loadComponent: () => import('./pages/admin/admin-lead-detail.page').then(m => m.AdminLeadDetailPage), canActivate: [authGuard], data: { roles: ['admin', 'employee'] } },
      { path: 'admin/partners/:id', loadComponent: () => import('./pages/admin/admin-partner-detail.page').then(m => m.AdminPartnerDetailPage), canActivate: [authGuard], data: { roles: ['admin', 'employee'] } },
      { path: 'admin/opportunities/:id', loadComponent: () => import('./pages/admin/admin-opportunity-detail.page').then(m => m.AdminOpportunityDetailPage), canActivate: [authGuard], data: { roles: ['admin', 'employee'] } },
      { path: 'admin/engagements/:id', loadComponent: () => import('./pages/admin/admin-engagement-detail.page').then(m => m.AdminEngagementDetailPage), canActivate: [authGuard], data: { roles: ['admin', 'employee'] } },
      { path: 'admin/commissions/:id', loadComponent: () => import('./pages/admin/admin-commission-detail.page').then(m => m.AdminCommissionDetailPage), canActivate: [authGuard], data: { roles: ['admin', 'employee'] } },
      { path: 'not-found', loadComponent: () => import('./pages/not-found.page').then(m => m.NotFoundPage) },
      { path: '**', loadComponent: () => import('./pages/not-found.page').then(m => m.NotFoundPage) },
    ],
  },
];
