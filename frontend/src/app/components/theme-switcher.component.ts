import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-switcher-container">
      <!-- Theme Selection Header -->
      <div class="theme-header">
        <h3 class="text-lg font-semibold text-th-text dark:text-white mb-2">Platform Theme</h3>
        <p class="text-sm text-th-text-2 dark:text-th-text-3">Select the design system for your platform</p>
      </div>

      <!-- Theme Options Grid -->
      <div class="theme-grid">
        @for (theme of themes; track theme.id) {
          <div
            class="theme-card"
            [class.active]="(themeService.theme$() === theme.id)"
            (click)="selectTheme(theme.id)"
            (mouseenter)="previewTheme(theme.id)"
            (mouseleave)="clearPreview()">

            <!-- Theme Preview Colors -->
            <div class="theme-preview">
              <div class="color-swatch primary" [style.background]="theme.preview.primary"></div>
              <div class="color-swatch secondary" [style.background]="theme.preview.secondary"></div>
              <div class="color-swatch accent" [style.background]="theme.preview.accent"></div>
            </div>

            <!-- Theme Info -->
            <div class="theme-info">
              <div class="theme-icon">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  @if (theme.icon === 'blueprint') { <path d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z" /> }
                  @if (theme.icon === 'minimal') { <circle cx="12" cy="12" r="10" /> }
                  @if (theme.icon === 'saudi') { <path d="M12 2L2 7h20l-10-5ZM4 9v8m4-8v8m4-8v8m4-8v8m4-8v8M2 19h20" /> }
                </svg>
              </div>
              <h4 class="theme-name">{{ theme.name }}</h4>
              <p class="theme-description">{{ theme.description }}</p>
            </div>

            <!-- Active Indicator -->
            @if (themeService.theme$() === theme.id) {
              <div class="active-indicator">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>
            }
          </div>
        }
      </div>

      <!-- Dark Mode Toggle -->
      <div class="dark-mode-section">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-th-text dark:text-white">Dark Mode</h4>
            <p class="text-xs text-th-text-2 dark:text-th-text-3">Enable dark theme variant</p>
          </div>
          <button
            class="dark-mode-toggle"
            [class.enabled]="themeService.darkMode$()"
            (click)="toggleDarkMode()"
            type="button">
            <span class="toggle-slider"></span>
            <svg *ngIf="!themeService.darkMode$()" class="toggle-icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg *ngIf="themeService.darkMode$()" class="toggle-icon moon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Apply Button (for preview mode) -->
      @if (isPreviewMode) {
        <div class="action-buttons">
          <button
            class="btn-apply"
            (click)="applyCurrentTheme()"
            type="button">
            Apply Theme Changes
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .theme-switcher-container {
      padding: 1.5rem;
      background: var(--bg-primary);
      border-radius: 0.75rem;
      border: 1px solid var(--border-primary);
    }

    .theme-header {
      margin-bottom: 1.5rem;
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .theme-card {
      position: relative;
      background: var(--bg-secondary);
      border: 2px solid var(--border-secondary);
      border-radius: 0.5rem;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s var(--ease-standard);
      overflow: hidden;
    }

    .theme-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      border-color: var(--color-primary);
    }

    .theme-card.active {
      border-color: var(--color-primary);
      background: var(--bg-primary);
      box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
    }

    .theme-preview {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .color-swatch {
      width: 40px;
      height: 40px;
      border-radius: 0.375rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    .color-swatch::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%);
    }

    .theme-info {
      margin-bottom: 0.5rem;
    }

    .theme-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .theme-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .theme-description {
      font-size: 0.75rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .active-indicator {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      color: var(--color-success);
      background: var(--bg-primary);
      border-radius: 50%;
      padding: 0.25rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .dark-mode-section {
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-secondary);
      margin-top: 1.5rem;
    }

    .dark-mode-toggle {
      position: relative;
      width: 52px;
      height: 28px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-secondary);
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s var(--ease-standard);
    }

    .dark-mode-toggle.enabled {
      background: var(--color-primary);
      border-color: var(--color-primary);
    }

    .toggle-slider {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 22px;
      height: 22px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s var(--ease-spring);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .dark-mode-toggle.enabled .toggle-slider {
      transform: translateX(24px);
    }

    .toggle-icon {
      position: absolute;
      width: 14px;
      height: 14px;
      top: 50%;
      transform: translateY(-50%);
      stroke-width: 2;
      transition: opacity 0.2s;
    }

    .toggle-icon.sun {
      left: 6px;
      color: var(--text-tertiary);
    }

    .toggle-icon.moon {
      right: 6px;
      color: white;
    }

    .dark-mode-toggle:not(.enabled) .moon {
      opacity: 0;
    }

    .dark-mode-toggle.enabled .sun {
      opacity: 0;
    }

    .action-buttons {
      margin-top: 1.5rem;
      display: flex;
      justify-content: flex-end;
    }

    .btn-apply {
      padding: 0.625rem 1.5rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s var(--ease-standard);
    }

    .btn-apply:hover {
      background: var(--color-primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .theme-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Dark mode specific styles */
    [data-mode="dark"] {
      .theme-card {
        background: rgba(30, 41, 59, 0.5);
        border-color: rgba(71, 85, 105, 0.5);
      }

      .theme-card.active {
        background: rgba(30, 41, 59, 0.8);
      }

      .color-swatch {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
    }
  `]
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);

  themes = this.themeService.themes;
  isPreviewMode = false;
  private currentPreview: string | null = null;

  selectTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
    this.isPreviewMode = false;
  }

  previewTheme(themeId: string): void {
    if (this.themeService.theme$() !== themeId) {
      this.themeService.previewTheme(themeId);
      this.currentPreview = themeId;
      this.isPreviewMode = true;
    }
  }

  clearPreview(): void {
    if (this.isPreviewMode && this.currentPreview) {
      this.themeService.clearPreview();
      this.currentPreview = null;
      // Keep preview mode active until explicitly applied or cancelled
    }
  }

  applyCurrentTheme(): void {
    if (this.currentPreview) {
      this.themeService.setTheme(this.currentPreview);
      this.currentPreview = null;
      this.isPreviewMode = false;
    }
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}