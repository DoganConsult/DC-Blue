import { Component, output, inject, signal, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { TranslatePipe } from '../core/pipes/translate.pipe';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-nav-section',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-sticky transition-all duration-300"
         [style.background]="scrolled() ? 'rgba(6,18,36,0.95)' : 'transparent'"
         [style.backdrop-filter]="scrolled() ? 'blur(24px)' : 'none'">
      <div class="max-w-[1200px] mx-auto px-6 lg:px-8 flex items-center justify-between h-[72px]">

        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 shrink-0">
          <span class="w-8 h-8 rounded-lg bg-gold-accent flex items-center justify-center">
            <svg class="w-4.5 h-4.5 text-[#1D2433]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </span>
          <span class="font-bold text-[17px] text-white tracking-tight">
            {{ i18n.t('DOGAN', 'دوغان') }}<span class="text-gold-accent">{{ i18n.t('CONSULT', ' للاستشارات') }}</span>
          </span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-7">
          @for (item of navItems; track item.route) {
            <a [routerLink]="item.route"
               class="text-[14px] font-medium transition-colors duration-200 hover:text-white"
               [class.text-gold-accent]="isActive(item.route)"
               [style.color]="!isActive(item.route) ? 'rgba(255,255,255,0.8)' : ''">
              {{ i18n.t(item.en, item.ar) }}
            </a>
          }
        </div>

        <!-- Right side controls -->
        <div class="flex items-center gap-3">
          <!-- Language toggle -->
          <button type="button" (click)="langChange.emit(i18n.lang() === 'en' ? 'ar' : 'en')"
                  class="px-3 py-1.5 rounded-lg text-[13px] font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-colors duration-200">
            {{ i18n.lang() === 'en' ? 'عربي' : 'English' }}
          </button>

          <!-- Login link -->
          <a routerLink="/login"
             class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-colors duration-200">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            {{ i18n.t('Sign In', 'تسجيل الدخول') }}
          </a>

          <!-- CTA: enterprise wording -->
          <a routerLink="/inquiry"
             class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-accent text-[#1D2433] text-[13px] font-semibold hover:brightness-90 transition-colors duration-200">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {{ i18n.t('Request Consultation', 'طلب استشارة') }}
          </a>

          <!-- Hamburger (mobile) -->
          <button type="button" (click)="toggleMobileMenu()"
                  class="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 transition-colors"
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

      <!-- Mobile Menu -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden bg-[#061224]/98 backdrop-blur-xl animate-slideDown max-h-[calc(100vh-72px)] overflow-y-auto border-t border-white/10">
          <div class="max-w-[1200px] mx-auto px-6 py-4">
            @for (item of navItems; track item.route) {
              <a [routerLink]="item.route" (click)="closeMobile()"
                 class="flex items-center px-4 py-3.5 text-sm font-semibold text-white/90 hover:text-gold-accent border-b border-white/5 last:border-b-0 transition-colors">
                {{ i18n.t(item.en, item.ar) }}
              </a>
            }
            <!-- Mobile portal links -->
            <div class="border-t border-white/10 mt-2 pt-2">
              <a routerLink="/login" (click)="closeMobile()"
                 class="flex items-center gap-2 px-4 py-3.5 text-sm font-semibold text-white/90 hover:text-gold-accent border-b border-white/5 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                {{ i18n.t('Sign In', 'تسجيل الدخول') }}
              </a>
              <a routerLink="/register" (click)="closeMobile()"
                 class="flex items-center gap-2 px-4 py-3.5 text-sm font-semibold text-white/90 hover:text-gold-accent border-b border-white/5 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                {{ i18n.t('Register', 'إنشاء حساب') }}
              </a>
              <a routerLink="/partner/register" (click)="closeMobile()"
                 class="flex items-center gap-2 px-4 py-3.5 text-sm font-semibold text-white/90 hover:text-gold-accent transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                {{ i18n.t('Partner Portal', 'بوابة الشركاء') }}
              </a>
            </div>
            <!-- Mobile CTA -->
            <a routerLink="/inquiry" (click)="closeMobile()"
               class="flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-lg bg-gold-accent text-[#1D2433] text-sm font-semibold hover:brightness-90 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {{ i18n.t('Request Consultation', 'طلب استشارة') }}
            </a>
          </div>
        </div>
      }
    </nav>
    <div class="h-[72px]"></div>
  `,
  styles: [`
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slideDown {
      animation: slideDown 0.2s ease-out;
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
      background: #ffffff;
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
    }
  `]
})
export class NavSectionComponent implements OnInit, OnDestroy {
  langChange = output<'en' | 'ar'>();
  i18n = inject(I18nService);
  private router = inject(Router);
  private routerSub?: Subscription;

  mobileMenuOpen = signal(false);
  scrolled = signal(false);
  activePath = signal('/');

  readonly navItems = [
    { en: 'Home', ar: 'الرئيسية', route: '/' },
    { en: 'Services', ar: 'خدماتنا', route: '/services' },
    { en: 'About', ar: 'من نحن', route: '/about' },
    { en: 'Case Studies', ar: 'دراسات حالة', route: '/case-studies' },
    { en: 'Insights', ar: 'رؤى', route: '/insights' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  ngOnInit(): void {
    this.activePath.set(this.router.url.split('?')[0].split('#')[0]);
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.activePath.set(e.urlAfterRedirects.split('?')[0].split('#')[0]);
        this.mobileMenuOpen.set(false);
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  isActive(route: string): boolean {
    const path = this.activePath();
    if (route === '/') return path === '/';
    return path === route || path.startsWith(route + '/');
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobile(): void {
    this.mobileMenuOpen.set(false);
  }
}
