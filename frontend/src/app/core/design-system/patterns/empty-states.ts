/**
 * Enterprise Empty States Pattern Library
 * Professional zero-data experiences following IBM Carbon patterns
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Empty State Component
 * Displays helpful messages and actions when no data is available
 */
@Component({
  selector: 'ds-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state-container" [ngClass]="sizeClass">
      <!-- Illustration -->
      <div class="empty-state-illustration" *ngIf="illustration || illustrationType">
        <ng-container [ngSwitch]="illustrationType">
          <!-- No Data -->
          <svg *ngSwitchCase="'no-data'" class="empty-illustration" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="80" fill="var(--empty-illustration-bg)" />
            <rect x="60" y="80" width="80" height="10" rx="5" fill="var(--empty-illustration-accent)" />
            <rect x="60" y="100" width="60" height="10" rx="5" fill="var(--empty-illustration-accent)" opacity="0.6" />
            <rect x="60" y="120" width="70" height="10" rx="5" fill="var(--empty-illustration-accent)" opacity="0.4" />
          </svg>

          <!-- Search -->
          <svg *ngSwitchCase="'search'" class="empty-illustration" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="85" cy="85" r="50" fill="none" stroke="var(--empty-illustration-accent)" stroke-width="8" />
            <line x1="120" y1="120" x2="150" y2="150" stroke="var(--empty-illustration-accent)" stroke-width="8" stroke-linecap="round" />
            <path d="M65 85 Q85 65, 105 85" fill="none" stroke="var(--empty-illustration-secondary)" stroke-width="4" stroke-linecap="round" />
          </svg>

          <!-- Error -->
          <svg *ngSwitchCase="'error'" class="empty-illustration" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="80" fill="var(--empty-illustration-error-bg)" />
            <path d="M100 50 L100 110" stroke="var(--empty-illustration-error)" stroke-width="8" stroke-linecap="round" />
            <circle cx="100" cy="140" r="5" fill="var(--empty-illustration-error)" />
          </svg>

          <!-- Success -->
          <svg *ngSwitchCase="'success'" class="empty-illustration" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="80" fill="var(--empty-illustration-success-bg)" />
            <path d="M60 100 L85 125 L140 70" fill="none" stroke="var(--empty-illustration-success)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <!-- Empty Folder -->
          <svg *ngSwitchCase="'folder'" class="empty-illustration" viewBox="0 0 200 200" aria-hidden="true">
            <path d="M40 80 L40 150 L160 150 L160 80 L110 80 L95 65 L40 65 Z" fill="var(--empty-illustration-bg)" stroke="var(--empty-illustration-accent)" stroke-width="3" />
            <rect x="80" y="105" width="40" height="3" fill="var(--empty-illustration-accent)" opacity="0.5" />
            <rect x="80" y="115" width="30" height="3" fill="var(--empty-illustration-accent)" opacity="0.3" />
          </svg>

          <!-- Empty Cart -->
          <svg *ngSwitchCase="'cart'" class="empty-illustration" viewBox="0 0 200 200" aria-hidden="true">
            <path d="M50 50 L60 60 L150 60 L140 120 L70 120 L60 60" fill="none" stroke="var(--empty-illustration-accent)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="80" cy="145" r="8" fill="var(--empty-illustration-accent)" />
            <circle cx="130" cy="145" r="8" fill="var(--empty-illustration-accent)" />
          </svg>

          <!-- No Connection -->
          <svg *ngSwitchCase="'offline'" class="empty-illustration" viewBox="0 0 200 200" aria-hidden="true">
            <path d="M100 140 L100 140" stroke="var(--empty-illustration-accent)" stroke-width="12" stroke-linecap="round" />
            <path d="M75 115 Q100 90, 125 115" fill="none" stroke="var(--empty-illustration-secondary)" stroke-width="6" stroke-linecap="round" opacity="0.3" />
            <path d="M60 100 Q100 60, 140 100" fill="none" stroke="var(--empty-illustration-secondary)" stroke-width="6" stroke-linecap="round" opacity="0.3" />
            <line x1="50" y1="50" x2="150" y2="150" stroke="var(--empty-illustration-error)" stroke-width="4" />
          </svg>

          <!-- Custom Illustration -->
          <div *ngSwitchDefault class="custom-illustration">
            <ng-content select="[illustration]"></ng-content>
          </div>
        </ng-container>
      </div>

      <!-- Icon Alternative (for compact mode) -->
      <div class="empty-state-icon" *ngIf="icon && !illustration && !illustrationType">
        <i [class]="icon"></i>
      </div>

      <!-- Content -->
      <div class="empty-state-content">
        <h3 class="empty-state-title">{{ title }}</h3>
        <p class="empty-state-description" *ngIf="description">{{ description }}</p>

        <!-- Additional Details -->
        <ul class="empty-state-details" *ngIf="details && details.length > 0">
          <li *ngFor="let detail of details">{{ detail }}</li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="empty-state-actions" *ngIf="primaryAction || secondaryAction || hasCustomActions">
        <button
          *ngIf="primaryAction"
          class="empty-action-primary"
          (click)="onPrimaryAction()"
          [attr.aria-label]="primaryActionLabel"
        >
          <i *ngIf="primaryActionIcon" [class]="primaryActionIcon"></i>
          {{ primaryActionLabel }}
        </button>

        <button
          *ngIf="secondaryAction"
          class="empty-action-secondary"
          (click)="onSecondaryAction()"
          [attr.aria-label]="secondaryActionLabel"
        >
          <i *ngIf="secondaryActionIcon" [class]="secondaryActionIcon"></i>
          {{ secondaryActionLabel }}
        </button>

        <!-- Custom Actions -->
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --empty-illustration-bg: #f3f4f6;
      --empty-illustration-accent: #9ca3af;
      --empty-illustration-secondary: #d1d5db;
      --empty-illustration-error: #ef4444;
      --empty-illustration-error-bg: #fee2e2;
      --empty-illustration-success: #10b981;
      --empty-illustration-success-bg: #d1fae5;
    }

    :host-context(.dark) {
      --empty-illustration-bg: #374151;
      --empty-illustration-accent: #6b7280;
      --empty-illustration-secondary: #4b5563;
      --empty-illustration-error-bg: #7f1d1d;
      --empty-illustration-success-bg: #064e3b;
    }

    .empty-state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-12);
      min-height: 300px;
    }

    /* Size Variants */
    .empty-state-container.compact {
      padding: var(--space-6);
      min-height: 200px;
    }

    .empty-state-container.large {
      padding: var(--space-16);
      min-height: 400px;
    }

    .empty-state-container.full {
      min-height: calc(100vh - 200px);
    }

    /* Illustration */
    .empty-state-illustration {
      margin-bottom: var(--space-6);
    }

    .empty-illustration {
      width: 160px;
      height: 160px;
      opacity: 0.9;
    }

    .compact .empty-illustration {
      width: 100px;
      height: 100px;
    }

    .large .empty-illustration {
      width: 200px;
      height: 200px;
    }

    /* Icon */
    .empty-state-icon {
      font-size: 3rem;
      color: var(--empty-illustration-accent);
      margin-bottom: var(--space-4);
    }

    .compact .empty-state-icon {
      font-size: 2rem;
    }

    /* Content */
    .empty-state-content {
      max-width: 500px;
      margin-bottom: var(--space-6);
    }

    .empty-state-title {
      font-size: var(--text-h4);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .compact .empty-state-title {
      font-size: var(--text-h5);
    }

    .large .empty-state-title {
      font-size: var(--text-h3);
    }

    .empty-state-description {
      font-size: var(--text-body-md);
      color: var(--text-secondary);
      margin: 0;
      line-height: var(--leading-relaxed);
    }

    .empty-state-details {
      list-style: none;
      padding: 0;
      margin: var(--space-4) 0 0 0;
      font-size: var(--text-body-sm);
      color: var(--text-tertiary);
    }

    .empty-state-details li {
      padding: var(--space-1) 0;
    }

    .empty-state-details li::before {
      content: '•';
      margin-right: var(--space-2);
      color: var(--empty-illustration-accent);
    }

    /* Actions */
    .empty-state-actions {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
      justify-content: center;
    }

    .empty-action-primary,
    .empty-action-secondary {
      padding: var(--space-3) var(--space-6);
      border-radius: 8px;
      font-size: var(--text-body-md);
      font-weight: var(--font-weight-medium);
      transition: all var(--duration-fast) var(--ease-standard);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      border: 2px solid transparent;
    }

    .empty-action-primary {
      background: var(--color-primary);
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-action-primary:hover {
      background: var(--color-primary-600);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .empty-action-primary:active {
      transform: translateY(0);
    }

    .empty-action-secondary {
      background: transparent;
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .empty-action-secondary:hover {
      background: rgba(var(--color-primary-rgb), 0.05);
      border-color: var(--color-primary-600);
    }

    /* Focus States */
    .empty-action-primary:focus-visible,
    .empty-action-secondary:focus-visible {
      outline: var(--focus-ring-width) solid var(--focus-ring-color);
      outline-offset: var(--focus-ring-offset);
    }

    /* Animation */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .empty-state-container {
      animation: fadeInUp 0.5s var(--ease-decelerate);
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .empty-state-container {
        animation: none;
      }
    }
  `]
})
export class EmptyStateComponent {
  @Input() title: string = 'No data available';
  @Input() description?: string;
  @Input() details?: string[];
  @Input() icon?: string;
  @Input() illustration?: boolean;
  @Input() illustrationType?: 'no-data' | 'search' | 'error' | 'success' | 'folder' | 'cart' | 'offline';
  @Input() size: 'compact' | 'default' | 'large' | 'full' = 'default';

  @Input() primaryAction?: boolean;
  @Input() primaryActionLabel: string = 'Try Again';
  @Input() primaryActionIcon?: string;
  @Output() primaryActionClick = new EventEmitter<void>();

  @Input() secondaryAction?: boolean;
  @Input() secondaryActionLabel: string = 'Learn More';
  @Input() secondaryActionIcon?: string;
  @Output() secondaryActionClick = new EventEmitter<void>();

  @Input() hasCustomActions: boolean = false;

  get sizeClass(): string {
    return this.size !== 'default' ? this.size : '';
  }

  onPrimaryAction(): void {
    this.primaryActionClick.emit();
  }

  onSecondaryAction(): void {
    this.secondaryActionClick.emit();
  }
}

/**
 * Predefined empty state configurations
 */
export const EMPTY_STATE_PRESETS = {
  noData: {
    title: 'No data yet',
    description: 'Start by adding your first item to see it here.',
    illustrationType: 'no-data' as const,
    primaryActionLabel: 'Add Item',
    primaryActionIcon: 'fas fa-plus'
  },

  noSearchResults: {
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
    illustrationType: 'search' as const,
    primaryActionLabel: 'Clear Search',
    secondaryActionLabel: 'Search Tips'
  },

  error: {
    title: 'Something went wrong',
    description: 'We encountered an error while loading your data. Please try again.',
    illustrationType: 'error' as const,
    primaryActionLabel: 'Retry',
    primaryActionIcon: 'fas fa-redo'
  },

  offline: {
    title: 'You\'re offline',
    description: 'Check your internet connection and try again.',
    illustrationType: 'offline' as const,
    primaryActionLabel: 'Retry',
    primaryActionIcon: 'fas fa-wifi'
  },

  emptyFolder: {
    title: 'This folder is empty',
    description: 'Upload files or create new items to get started.',
    illustrationType: 'folder' as const,
    primaryActionLabel: 'Upload Files',
    primaryActionIcon: 'fas fa-upload'
  },

  emptyCart: {
    title: 'Your cart is empty',
    description: 'Add items to your cart to continue shopping.',
    illustrationType: 'cart' as const,
    primaryActionLabel: 'Start Shopping',
    primaryActionIcon: 'fas fa-shopping-bag'
  },

  comingSoon: {
    title: 'Coming Soon',
    description: 'This feature is under development and will be available soon.',
    illustrationType: 'success' as const,
    primaryActionLabel: 'Notify Me',
    secondaryActionLabel: 'Learn More'
  },

  noPermission: {
    title: 'Access Denied',
    description: 'You don\'t have permission to view this content.',
    illustrationType: 'error' as const,
    primaryActionLabel: 'Request Access',
    secondaryActionLabel: 'Go Back'
  },

  maintenance: {
    title: 'Under Maintenance',
    description: 'We\'re making improvements. Please check back later.',
    illustrationType: 'error' as const,
    primaryActionLabel: 'Refresh',
    primaryActionIcon: 'fas fa-sync'
  }
};

/**
 * Empty State Service
 * Manages empty state configurations
 */
export class EmptyStateService {
  static getPreset(type: keyof typeof EMPTY_STATE_PRESETS) {
    return EMPTY_STATE_PRESETS[type];
  }

  static createCustom(config: Partial<EmptyStateComponent>) {
    return {
      ...EMPTY_STATE_PRESETS.noData,
      ...config
    };
  }
}