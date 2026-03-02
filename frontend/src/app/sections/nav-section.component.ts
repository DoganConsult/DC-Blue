import { Component, output, inject, signal, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { TranslatePipe } from '../core/pipes/translate.pipe';
import { Subscription, filter } from 'rxjs';

interface MegaMenuItem {
  label: { en: string; ar: string };
  description: { en: string; ar: string };
  route: string;
  fragment?: string;
  icon: string;
}

interface MegaMenuGroup {
  id: string;
  label: { en: string; ar: string };
  route?: string;
  children?: MegaMenuItem[];
}

@Component({
  selector: 'app-nav-section',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-sticky bg-surface-primary/80 backdrop-blur-xl border-b border-th-border/60">
      <div class="h-[2px] bg-gradient-to-r from-primary via-secondary to-success"></div>
      <div [class]="ds.section.container" class="flex items-center justify-between h-[60px]">

        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-3 shrink-0">
          <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
            <svg class="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </span>
          <span class="font-bold text-[17px] text-th-text tracking-tight">Dogan<span class="text-primary">Consult</span></span>
          <span class="hidden xl:inline text-[13px] text-th-text-3 font-medium border-l border-th-border pl-3">{{ 'nav.tagline' | translate }}</span>
        </a>

        <!-- Desktop Mega-Menu Navigation -->
        <div class="hidden lg:flex items-center gap-0.5">
          @for (group of menuGroups; track group.id) {
            @if (group.children) {
              <div class="relative"
                   (mouseenter)="openDropdown(group.id)"
                   (mouseleave)="closeDropdown()">
                <a [routerLink]="group.route"
                   class="flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200"
                   [class.text-primary]="isGroupActive(group)"
                   [class.text-th-text-2]="!isGroupActive(group)"
                   [class.hover:text-th-text]="!isGroupActive(group)"
                   [class.hover:bg-th-bg-alt]="true">
                  {{ i18n.t(group.label.en, group.label.ar) }}
                  <svg class="w-3.5 h-3.5 transition-transform duration-200"
                       [class.rotate-180]="activeDropdown() === group.id"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>

                @if (activeDropdown() === group.id) {
                  <div class="absolute top-full left-0 pt-2 z-dropdown"
                       (mouseenter)="cancelClose()"
                       (mouseleave)="closeDropdown()">
                    <div class="w-80 bg-th-card border border-th-border rounded-xl shadow-xl p-2 animate-dropdownIn">
                      @for (item of group.children; track item.route + (item.fragment || '')) {
                        <a (click)="navigateTo(item)" class="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-th-bg-alt transition-colors cursor-pointer group/item">
                          <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-primary/20 transition-colors">
                            <svg class="w-[18px] h-[18px] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                              <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="item.icon" />
                            </svg>
                          </div>
                          <div>
                            <p class="text-[13px] font-semibold text-th-text group-hover/item:text-primary transition-colors">
                              {{ i18n.t(item.label.en, item.label.ar) }}
                            </p>
                            <p class="text-[12px] text-th-text-3 mt-0.5 leading-relaxed">
                              {{ i18n.t(item.description.en, item.description.ar) }}
                            </p>
                          </div>
                        </a>
                      }
                      <div class="border-t border-th-border-lt mt-1 pt-1">
                        <a [routerLink]="group.route" (click)="activeDropdown.set(null)"
                           class="flex items-center justify-between px-3 py-2.5 rounded-lg text-[12px] font-semibold text-primary hover:bg-primary/5 transition-colors">
                          {{ 'nav.view_all' | translate }}
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <a [routerLink]="group.route"
                 class="px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200"
                 [class.text-primary]="isGroupActive(group)"
                 [class.text-th-text-2]="!isGroupActive(group)"
                 [class.hover:text-th-text]="!isGroupActive(group)"
                 [class.hover:bg-th-bg-alt]="true">
                {{ i18n.t(group.label.en, group.label.ar) }}
              </a>
            }
          }
        </div>

        <!-- Right side controls -->
        <div class="flex items-center gap-2">
          <!-- User dropdown (desktop) -->
          <div class="hidden lg:block relative">
            <button type="button" (click)="userDropdownOpen.set(!userDropdownOpen())"
                    class="flex items-center justify-center w-9 h-9 rounded-lg text-th-text-3 hover:text-th-text hover:bg-th-bg-alt transition-colors duration-200"
                    aria-label="Account menu">
              <svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            </button>
            @if (userDropdownOpen()) {
              <div class="absolute right-0 top-[calc(100%+6px)] w-52 bg-th-card border border-th-border rounded-xl shadow-lg py-1.5 animate-dropdownIn">
                <a routerLink="/login" (click)="userDropdownOpen.set(false)"
                   class="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-th-text-2 hover:bg-th-bg-alt transition-colors">
                  <svg class="w-4 h-4 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                  {{ 'nav.sign_in' | translate }}
                </a>
                <a routerLink="/register" (click)="userDropdownOpen.set(false)"
                   class="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-th-text-2 hover:bg-th-bg-alt transition-colors">
                  <svg class="w-4 h-4 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>
                  {{ 'nav.create_account' | translate }}
                </a>
                <div class="border-t border-th-border-lt my-1"></div>
                <a routerLink="/partner" (click)="userDropdownOpen.set(false)"
                   class="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-th-text-2 hover:bg-th-bg-alt transition-colors">
                  <svg class="w-4 h-4 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
                  {{ 'nav.partner_portal' | translate }}
                </a>
              </div>
            }
          </div>

          <!-- Language toggle -->
          <button type="button" (click)="langChange.emit(i18n.lang() === 'en' ? 'ar' : 'en')"
                  class="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-th-text-2 bg-th-bg-alt hover:bg-th-bg-tert transition-colors duration-200">
            {{ i18n.lang() === 'en' ? 'عربي' : 'EN' }}
          </button>

          <!-- CTA button -->
          <a routerLink="/inquiry"
             class="hidden sm:inline-flex px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold hover:opacity-90 hover:shadow-lg transition-all duration-200">
            {{ 'nav.request_proposal' | translate }}
          </a>

          <!-- Hamburger (mobile) -->
          <button type="button" (click)="toggleMobileMenu()"
                  class="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-th-bg-tert transition-colors"
                  [attr.aria-expanded]="mobileMenuOpen()"
                  aria-label="Toggle navigation menu">
            <div class="hamburger-icon" [class.is-open]="mobileMenuOpen()">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      <!-- Mobile Menu (Accordion) -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden border-t border-th-border/60 bg-surface-primary/95 backdrop-blur-xl animate-slideDown max-h-[calc(100vh-60px)] overflow-y-auto">
          <div [class]="ds.section.container" class="py-4">
            @for (group of menuGroups; track group.id) {
              @if (group.children) {
                <div class="border-b border-th-border-lt last:border-b-0">
                  <button (click)="toggleMobileGroup(group.id)"
                          class="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-th-text">
                    <span>{{ i18n.t(group.label.en, group.label.ar) }}</span>
                    <svg class="w-4 h-4 text-th-text-3 transition-transform duration-200"
                         [class.rotate-180]="mobileExpandedGroup() === group.id"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  @if (mobileExpandedGroup() === group.id) {
                    <div class="pb-3 pl-4 space-y-0.5 animate-slideDown">
                      @for (item of group.children; track item.route + (item.fragment || '')) {
                        <a (click)="navigateTo(item)"
                           class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-th-text-2 hover:text-th-text hover:bg-th-bg-alt transition-colors cursor-pointer">
                          <div class="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                            <svg class="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                              <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="item.icon" />
                            </svg>
                          </div>
                          {{ i18n.t(item.label.en, item.label.ar) }}
                        </a>
                      }
                      <a [routerLink]="group.route" (click)="closeMobile()"
                         class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-primary hover:bg-primary/5 transition-colors">
                        {{ 'nav.view_all' | translate }}
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    </div>
                  }
                </div>
              } @else {
                <a [routerLink]="group.route" (click)="closeMobile()"
                   class="flex items-center px-4 py-3.5 text-sm font-semibold text-th-text border-b border-th-border-lt last:border-b-0 hover:bg-th-bg-alt transition-colors">
                  {{ i18n.t(group.label.en, group.label.ar) }}
                </a>
              }
            }

            <!-- Account section -->
            <div class="border-t border-th-border-lt mt-3 pt-3">
              <p class="px-4 pb-2 text-[11px] font-semibold text-th-text-3 tracking-widest uppercase">{{ 'nav.account' | translate }}</p>
              <div class="space-y-0.5">
                <a routerLink="/login" (click)="closeMobile()" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-th-text-2 hover:text-th-text hover:bg-th-bg-alt transition-colors">
                  <svg class="w-4 h-4 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                  {{ 'nav.sign_in' | translate }}
                </a>
                <a routerLink="/register" (click)="closeMobile()" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-th-text-2 hover:text-th-text hover:bg-th-bg-alt transition-colors">
                  <svg class="w-4 h-4 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>
                  {{ 'nav.create_account' | translate }}
                </a>
              </div>
            </div>

            <!-- Mobile CTA -->
            <a routerLink="/inquiry" (click)="closeMobile()"
               class="flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              {{ 'nav.request_proposal' | translate }}
            </a>
          </div>
        </div>
      }
    </nav>
    <div class="h-[60px]"></div>
  `,
  styles: [`
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slideDown {
      animation: slideDown 0.2s ease-out;
    }

    @keyframes dropdownIn {
      from { opacity: 0; transform: translateY(-4px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-dropdownIn {
      animation: dropdownIn 0.15s ease-out;
    }

    .hamburger-icon {
      width: 20px;
      height: 14px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .hamburger-icon span {
      display: block;
      height: 2px;
      width: 100%;
      background: var(--text-secondary);
      border-radius: 2px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center;
    }
    .hamburger-icon.is-open span:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }
    .hamburger-icon.is-open span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    .hamburger-icon.is-open span:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }

    @media (prefers-reduced-motion: reduce) {
      .hamburger-icon span { transition: none; }
      .animate-slideDown { animation: none; }
      .animate-dropdownIn { animation: none; }
    }
  `]
})
export class NavSectionComponent implements OnInit, OnDestroy {
  langChange = output<'en' | 'ar'>();
  i18n = inject(I18nService);
  ds = inject(DesignSystemService);
  private router = inject(Router);
  private routerSub?: Subscription;

  mobileMenuOpen = signal(false);
  userDropdownOpen = signal(false);
  activeDropdown = signal<string | null>(null);
  mobileExpandedGroup = signal<string | null>(null);
  activePath = signal('/');
  private hoverTimeout: any;

  readonly menuGroups: MegaMenuGroup[] = [
    {
      id: 'home',
      label: { en: 'Home', ar: 'الرئيسية' },
      route: '/',
    },
    {
      id: 'services',
      label: { en: 'Services', ar: 'الخدمات' },
      route: '/services',
      children: [
        {
          label: { en: 'All Services', ar: 'جميع الخدمات' },
          description: { en: '17 licensed ICT solutions', ar: '17 حل تقنية معلومات مرخص' },
          route: '/services',
          icon: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
        },
        {
          label: { en: 'Technical Architecture', ar: 'الهندسة التقنية' },
          description: { en: 'Cloud, security, data & AI layers', ar: 'طبقات السحابة والأمن والبيانات والذكاء الاصطناعي' },
          route: '/services',
          fragment: 'architecture',
          icon: 'M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z',
        },
        {
          label: { en: 'ROI Calculator', ar: 'حاسبة العائد' },
          description: { en: 'Calculate your digital transformation savings', ar: 'احسب توفيرات التحول الرقمي' },
          route: '/services',
          fragment: 'roi',
          icon: 'M15.75 15.75V18m-7.5-6.75V18m15-8.25v-.75a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9.25v.75m16.5 0v-.75a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9.25v.75m16.5 0H3m16.5 0a2.25 2.25 0 0 1 2.25 2.25v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6a2.25 2.25 0 0 1 2.25-2.25',
        },
        {
          label: { en: 'Performance Metrics', ar: 'مقاييس الأداء' },
          description: { en: 'KPIs and delivery track record', ar: 'مؤشرات الأداء وسجل التسليم' },
          route: '/services',
          fragment: 'metrics',
          icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
        },
      ],
    },
    {
      id: 'about',
      label: { en: 'About', ar: 'من نحن' },
      route: '/about',
      children: [
        {
          label: { en: 'Our Team', ar: 'فريقنا' },
          description: { en: 'Leadership & executive profile', ar: 'القيادة والملف التنفيذي' },
          route: '/about',
          icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
        },
        {
          label: { en: 'Certifications', ar: 'الشهادات' },
          description: { en: '25+ industry certifications', ar: 'أكثر من 25 شهادة صناعية' },
          route: '/about',
          fragment: 'certifications',
          icon: 'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z',
        },
        {
          label: { en: 'Education', ar: 'التعليم' },
          description: { en: 'Academic credentials & research', ar: 'المؤهلات الأكاديمية والأبحاث' },
          route: '/about',
          fragment: 'education',
          icon: 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5',
        },
        {
          label: { en: 'Awards & Recognition', ar: 'الجوائز والتقدير' },
          description: { en: 'Industry awards & achievements', ar: 'جوائز الصناعة والإنجازات' },
          route: '/about',
          fragment: 'awards',
          icon: 'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.27.308m4.27-5.154V2.721',
        },
      ],
    },
    {
      id: 'case-studies',
      label: { en: 'Case Studies', ar: 'دراسات حالة' },
      route: '/case-studies',
    },
    {
      id: 'insights',
      label: { en: 'Insights', ar: 'رؤى' },
      route: '/insights',
    },
    {
      id: 'partners',
      label: { en: 'Partners', ar: 'الشركاء' },
      route: '/partner/register',
    },
    {
      id: 'track',
      label: { en: 'Track', ar: 'تتبع' },
      route: '/track',
    },
  ];

  ngOnInit(): void {
    this.activePath.set(this.router.url.split('?')[0].split('#')[0]);
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.activePath.set(e.urlAfterRedirects.split('?')[0].split('#')[0]);
        this.mobileMenuOpen.set(false);
        this.activeDropdown.set(null);
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    clearTimeout(this.hoverTimeout);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (this.userDropdownOpen() && !target.closest('.relative')) {
      this.userDropdownOpen.set(false);
    }
  }

  isGroupActive(group: MegaMenuGroup): boolean {
    const path = this.activePath();
    if (group.route === '/') return path === '/';
    return path === group.route || path.startsWith(group.route + '/');
  }

  openDropdown(groupId: string): void {
    clearTimeout(this.hoverTimeout);
    this.activeDropdown.set(groupId);
  }

  closeDropdown(): void {
    this.hoverTimeout = setTimeout(() => {
      this.activeDropdown.set(null);
    }, 150);
  }

  cancelClose(): void {
    clearTimeout(this.hoverTimeout);
  }

  navigateTo(item: MegaMenuItem): void {
    this.activeDropdown.set(null);
    this.mobileMenuOpen.set(false);
    if (item.fragment) {
      this.router.navigate([item.route], { fragment: item.fragment });
    } else {
      this.router.navigate([item.route]);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    this.userDropdownOpen.set(false);
  }

  toggleMobileGroup(groupId: string): void {
    this.mobileExpandedGroup.update(current => current === groupId ? null : groupId);
  }

  closeMobile(): void {
    this.mobileMenuOpen.set(false);
  }
}
