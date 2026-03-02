import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'sbg-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Brand gradient top bar -->
    <div class="h-1 bg-gradient-to-r from-sbg-navy via-sbg-blue to-sbg-gold"></div>

    <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sbg-gray-200 transition-shadow duration-300"
         [class.shadow-lg]="scrolled()">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 group">
            <div class="w-9 h-9 rounded-lg sbg-gradient-navy flex items-center justify-center text-white font-bold text-sm">
              SBG
            </div>
            <div class="hidden sm:block">
              <span class="text-sbg-navy font-bold text-lg leading-none">{{ i18n.t('Saudi Business Gate', 'بوابة الأعمال السعودية') }}</span>
            </div>
          </a>

          <!-- Desktop Nav Links -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/solutions" routerLinkActive="text-sbg-blue font-semibold"
               class="text-sbg-gray-600 hover:text-sbg-blue transition-colors text-sm font-medium">
              {{ i18n.t('Solutions', 'الحلول') }}
            </a>
            <a routerLink="/government" routerLinkActive="text-sbg-blue font-semibold"
               class="text-sbg-gray-600 hover:text-sbg-blue transition-colors text-sm font-medium">
              {{ i18n.t('Government', 'الحكومة') }}
            </a>
            <a routerLink="/enterprise" routerLinkActive="text-sbg-blue font-semibold"
               class="text-sbg-gray-600 hover:text-sbg-blue transition-colors text-sm font-medium">
              {{ i18n.t('Enterprise', 'المؤسسات') }}
            </a>
            <a routerLink="/contact" routerLinkActive="text-sbg-blue font-semibold"
               class="text-sbg-gray-600 hover:text-sbg-blue transition-colors text-sm font-medium">
              {{ i18n.t('Contact', 'تواصل معنا') }}
            </a>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-3">
            <!-- Lang Toggle -->
            <button (click)="i18n.toggle()"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-sbg-gray-200 hover:bg-sbg-gray-50 transition-colors">
              {{ i18n.t('عربي', 'EN') }}
            </button>

            <!-- CTA -->
            <a routerLink="/solutions"
               class="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-white text-sm font-semibold sbg-gradient-blue hover:opacity-90 transition-opacity">
              {{ i18n.t('Explore Solutions', 'استكشف الحلول') }}
            </a>

            <!-- Mobile Menu Toggle -->
            <button (click)="mobileOpen.set(!mobileOpen())"
                    class="md:hidden p-2 rounded-lg hover:bg-sbg-gray-100 transition-colors">
              <svg class="w-5 h-5 text-sbg-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (mobileOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (mobileOpen()) {
        <div class="md:hidden border-t border-sbg-gray-200 bg-white">
          <div class="px-4 py-4 space-y-3">
            <a routerLink="/solutions" (click)="mobileOpen.set(false)"
               class="block px-3 py-2 rounded-lg text-sbg-gray-700 hover:bg-sbg-gray-50 font-medium">
              {{ i18n.t('Solutions', 'الحلول') }}
            </a>
            <a routerLink="/government" (click)="mobileOpen.set(false)"
               class="block px-3 py-2 rounded-lg text-sbg-gray-700 hover:bg-sbg-gray-50 font-medium">
              {{ i18n.t('Government', 'الحكومة') }}
            </a>
            <a routerLink="/enterprise" (click)="mobileOpen.set(false)"
               class="block px-3 py-2 rounded-lg text-sbg-gray-700 hover:bg-sbg-gray-50 font-medium">
              {{ i18n.t('Enterprise', 'المؤسسات') }}
            </a>
            <a routerLink="/contact" (click)="mobileOpen.set(false)"
               class="block px-3 py-2 rounded-lg text-sbg-gray-700 hover:bg-sbg-gray-50 font-medium">
              {{ i18n.t('Contact', 'تواصل معنا') }}
            </a>
            <a routerLink="/solutions" (click)="mobileOpen.set(false)"
               class="block px-3 py-2 rounded-lg text-white text-center font-semibold sbg-gradient-blue">
              {{ i18n.t('Explore Solutions', 'استكشف الحلول') }}
            </a>
          </div>
        </div>
      }
    </nav>
  `,
})
export class SbgNavComponent {
  i18n = inject(I18nService);
  mobileOpen = signal(false);
  scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }
}
