import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private http = inject(HttpClient);

  // Available themes — IBM Carbon Design System + Regional
  readonly themes: Theme[] = [
    {
      id: 'carbon-white',
      name: 'Carbon White',
      description: 'IBM Carbon — Light theme, white background',
      icon: 'light',
      preview: {
        primary: '#0f62fe',
        secondary: '#009d9a',
        accent: '#8a3ffc'
      }
    },
    {
      id: 'carbon-g10',
      name: 'Carbon Gray 10',
      description: 'IBM Carbon — Light theme, soft gray background',
      icon: 'light-gray',
      preview: {
        primary: '#0f62fe',
        secondary: '#1192e8',
        accent: '#ee5396'
      }
    },
    {
      id: 'carbon-g90',
      name: 'Carbon Gray 90',
      description: 'IBM Carbon — Dark theme, charcoal background',
      icon: 'dark',
      preview: {
        primary: '#78a9ff',
        secondary: '#08bdba',
        accent: '#a56eff'
      }
    },
    {
      id: 'carbon-g100',
      name: 'Carbon Gray 100',
      description: 'IBM Carbon — Darkest theme, near-black background',
      icon: 'darkest',
      preview: {
        primary: '#78a9ff',
        secondary: '#33b1ff',
        accent: '#ff7eb6'
      }
    },
    {
      id: 'trust-blueprint',
      name: 'Trust Blueprint',
      description: 'Professional Enterprise — Blue & Cyan',
      icon: 'blueprint',
      preview: {
        primary: '#0078D4',
        secondary: '#00BCF2',
        accent: '#FF8C00'
      }
    },
    {
      id: 'luxury-minimal',
      name: 'Luxury Minimal',
      description: 'Premium & Sophisticated — Black & White',
      icon: 'minimal',
      preview: {
        primary: '#000000',
        secondary: '#F5F5F7',
        accent: '#0071E3'
      }
    },
    {
      id: 'saudi-excellence',
      name: 'Saudi Excellence',
      description: 'National Pride — Green & Gold',
      icon: 'saudi',
      preview: {
        primary: '#006C35',
        secondary: '#0EA5E9',
        accent: '#E3B76B'
      }
    },
    {
      id: 'shahin-ai',
      name: 'AGRC-OS (Shahin AI)',
      description: 'KSA GRC Platform — IBM Carbon v11, AGRC-OS Design System',
      icon: 'grc',
      preview: {
        primary: '#0f62fe',
        secondary: '#009d9a',
        accent: '#8a3ffc'
      }
    }
  ];

  // Current theme signal — default AGRC-OS (Shahin AI)
  private currentTheme = signal<string>('shahin-ai');

  // Dark mode is DISABLED — platform uses fixed light colors regardless of device settings
  private isDarkMode = signal<boolean>(false);

  // Public observables
  theme$ = this.currentTheme.asReadonly();
  darkMode$ = this.isDarkMode.asReadonly();

  constructor() {
    // Load saved theme preference on init
    this.loadThemePreference();

    // Apply theme changes to DOM — always light mode
    effect(() => {
      this.applyThemeToDOM(this.currentTheme(), false);
    });
  }

  /**
   * Set the active theme
   */
  setTheme(themeId: string): void {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) {
      console.warn(`Theme ${themeId} not found. Using default.`);
      themeId = 'carbon-white';
    }

    this.currentTheme.set(themeId);
    this.saveThemePreference(themeId);
    this.saveThemeToBackend(themeId).subscribe();
  }

  /**
   * Toggle dark mode — disabled, platform uses fixed light colors
   */
  toggleDarkMode(): void {
    // Dark mode disabled — fixed light branding
  }

  /**
   * Set dark mode — disabled, platform uses fixed light colors
   */
  setDarkMode(_enabled: boolean): void {
    // Dark mode disabled — fixed light branding
  }

  /**
   * Get current theme details
   */
  getCurrentTheme(): Theme | undefined {
    return this.themes.find(t => t.id === this.currentTheme());
  }

  /**
   * Apply theme to DOM
   */
  private applyThemeToDOM(themeId: string, _darkMode: boolean): void {
    if (typeof document === 'undefined' || !document.documentElement) return;
    const root = document.documentElement;

    // Set theme attribute
    root.setAttribute('data-theme', themeId);
    root.removeAttribute('data-theme-preview');

    // Always remove dark mode — fixed light branding
    root.removeAttribute('data-mode');

    // Add theme class to body for theme-specific styles
    if (document.body) {
      document.body.className = document.body.className
        .replace(/theme-[\w-]+/g, '')
        .trim();
      document.body.classList.add(`theme-${themeId}`);
    }
  }

  /**
   * Load theme preference from localStorage or backend
   */
  private loadThemePreference(): void {
    // Check localStorage first — only allow light themes
    const savedTheme = localStorage.getItem('preferred-theme');

    if (savedTheme && this.themes.find(t => t.id === savedTheme)) {
      this.currentTheme.set(savedTheme);
    }

    // Dark mode always off — fixed light branding
    this.isDarkMode.set(false);
    localStorage.removeItem('dark-mode');

    // Try to load from backend only if user is authenticated
    const hasToken = typeof window !== 'undefined' && window.localStorage &&
      (localStorage.getItem('dc_user_token') || localStorage.getItem('dc_partner_key'));
    if (hasToken) {
      this.loadThemeFromBackend().subscribe(theme => {
        if (theme) {
          this.currentTheme.set(theme);
        }
      });
    }
  }

  /**
   * Save theme preference to localStorage
   */
  private saveThemePreference(themeId: string): void {
    localStorage.setItem('preferred-theme', themeId);
  }

  /**
   * Save dark mode preference — disabled
   */
  private saveDarkModePreference(_enabled: boolean): void {
    // Dark mode disabled
  }

  /**
   * Save theme preference to backend
   */
  private saveThemeToBackend(themeId: string): Observable<any> {
    return this.http.put('/api/v1/user/theme', { theme: themeId })
      .pipe(
        catchError(error => {
          console.error('Failed to save theme preference:', error);
          return of(null);
        })
      );
  }

  /**
   * Load theme preference from backend
   */
  private loadThemeFromBackend(): Observable<string | null> {
    return this.http.get<{ theme: string }>('/api/v1/user/theme')
      .pipe(
        map(response => response?.theme || null),
        tap(theme => {
          if (theme) {
            this.saveThemePreference(theme);
          }
        }),
        catchError(() => of(null))
      );
  }

  /**
   * Preview a theme without applying it
   */
  previewTheme(themeId: string): void {
    document.documentElement.setAttribute('data-theme-preview', themeId);
  }

  /**
   * Clear theme preview
   */
  clearPreview(): void {
    document.documentElement.removeAttribute('data-theme-preview');
  }
}