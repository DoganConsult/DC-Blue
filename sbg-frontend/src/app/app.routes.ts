import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.page').then(m => m.HomePage) },
  { path: 'solutions', loadComponent: () => import('./pages/solutions.page').then(m => m.SolutionsPage) },
  { path: 'solutions/:slug', loadComponent: () => import('./pages/solution-detail.page').then(m => m.SolutionDetailPage) },
  { path: 'categories/:slug', loadComponent: () => import('./pages/category.page').then(m => m.CategoryPage) },
  { path: 'government', loadComponent: () => import('./pages/government.page').then(m => m.GovernmentPage) },
  { path: 'enterprise', loadComponent: () => import('./pages/enterprise.page').then(m => m.EnterprisePage) },
  { path: 'contact', loadComponent: () => import('./pages/contact.page').then(m => m.ContactPage) },
  { path: 'thank-you', loadComponent: () => import('./pages/thank-you.page').then(m => m.ThankYouPage) },
  { path: 'not-found', loadComponent: () => import('./pages/not-found.page').then(m => m.NotFoundPage) },
  { path: '**', loadComponent: () => import('./pages/not-found.page').then(m => m.NotFoundPage) },
];
