import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing.page').then(m => m.LandingPage) },
  { path: 'register', loadComponent: () => import('./pages/auth/register.page').then(m => m.RegisterPage) },
  { path: 'login', loadComponent: () => import('./pages/auth/login.page').then(m => m.LoginPage) },
  { path: 'inquiry', loadComponent: () => import('./pages/inquiry.page').then(m => m.InquiryPage) },
  { path: 'thanks', loadComponent: () => import('./pages/thanks.page').then(m => m.ThanksPage) },
  { path: 'track', loadComponent: () => import('./pages/track.page').then(m => m.TrackPage) },
  { path: 'partner', loadComponent: () => import('./pages/partner/partner-dashboard.page').then(m => m.PartnerDashboardPage) },
  { path: 'partner/register', loadComponent: () => import('./pages/partner/partner-register.page').then(m => m.PartnerRegisterPage) },
  { path: 'partner/submit', loadComponent: () => import('./pages/partner/partner-submit.page').then(m => m.PartnerSubmitPage) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin-dashboard.page').then(m => m.AdminDashboardPage) },
  { path: 'admin/leads/:id', loadComponent: () => import('./pages/admin/admin-lead-detail.page').then(m => m.AdminLeadDetailPage) },
  { path: '**', redirectTo: '' },
];
