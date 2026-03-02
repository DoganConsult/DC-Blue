/**
 * Enterprise Error Boundary Pattern Library
 * Professional error handling with recovery actions
 * Following IBM Carbon and Microsoft Fluent principles
 */

import { Component, Input, Output, EventEmitter, ErrorHandler, Injectable, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Error Types Enum
 */
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  SERVER = 'server',
  CLIENT = 'client',
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  NOT_FOUND = 'not_found',
  UNKNOWN = 'unknown'
}

/**
 * Error Severity Levels
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Error Recovery Actions
 */
export interface ErrorRecoveryAction {
  label: string;
  icon?: string;
  action: () => void;
  isPrimary?: boolean;
}

/**
 * Error Context
 */
export interface ErrorContext {
  timestamp: Date;
  url?: string;
  userId?: string;
  sessionId?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

/**
 * Error Boundary Component
 * Catches and displays errors with recovery options
 */
@Component({
  selector: 'ds-error-boundary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-boundary-container" [ngClass]="severityClass" *ngIf="hasError">
      <!-- Error Icon/Illustration -->
      <div class="error-illustration">
        <ng-container [ngSwitch]="errorType">
          <!-- Network Error -->
          <svg *ngSwitchCase="'network'" class="error-icon" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="3" opacity="0.3"/>
            <path d="M30 50 L70 50 M50 30 L50 70" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.3"/>
            <line x1="20" y1="20" x2="80" y2="80" stroke="var(--error-color)" stroke-width="4" stroke-linecap="round"/>
          </svg>

          <!-- Authentication Error -->
          <svg *ngSwitchCase="'authentication'" class="error-icon" viewBox="0 0 100 100">
            <rect x="30" y="40" width="40" height="40" rx="5" fill="none" stroke="currentColor" stroke-width="3"/>
            <circle cx="50" cy="35" r="10" fill="none" stroke="currentColor" stroke-width="3"/>
            <circle cx="50" cy="60" r="3" fill="var(--error-color)"/>
          </svg>

          <!-- Server Error -->
          <svg *ngSwitchCase="'server'" class="error-icon" viewBox="0 0 100 100">
            <rect x="25" y="30" width="50" height="15" rx="3" fill="currentColor" opacity="0.3"/>
            <rect x="25" y="50" width="50" height="15" rx="3" fill="currentColor" opacity="0.3"/>
            <circle cx="65" cy="37" r="2" fill="var(--error-color)"/>
            <circle cx="65" cy="57" r="2" fill="var(--error-color)"/>
            <text x="50" y="85" text-anchor="middle" font-size="16" fill="var(--error-color)">500</text>
          </svg>

          <!-- Default Error -->
          <svg *ngSwitchDefault class="error-icon" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--error-color)" stroke-width="3"/>
            <text x="50" y="60" text-anchor="middle" font-size="36" fill="var(--error-color)">!</text>
          </svg>
        </ng-container>
      </div>

      <!-- Error Header -->
      <div class="error-header">
        <h2 class="error-title">{{ title }}</h2>
        <span class="error-code" *ngIf="errorCode">Error Code: {{ errorCode }}</span>
      </div>

      <!-- Error Message -->
      <div class="error-message">
        <p class="error-description">{{ message }}</p>

        <!-- Detailed Error Information (Collapsible) -->
        <details class="error-details" *ngIf="showDetails && details">
          <summary class="error-details-toggle">
            <i class="fas fa-chevron-right"></i>
            Technical Details
          </summary>
          <div class="error-details-content">
            <pre>{{ details }}</pre>
            <button class="copy-details-btn" (click)="copyDetails()" *ngIf="canCopy">
              <i class="fas fa-copy"></i>
              Copy
            </button>
          </div>
        </details>
      </div>

      <!-- Suggestions -->
      <div class="error-suggestions" *ngIf="suggestions && suggestions.length > 0">
        <h3 class="suggestions-title">Try these solutions:</h3>
        <ul class="suggestions-list">
          <li *ngFor="let suggestion of suggestions">
            <i class="fas fa-lightbulb"></i>
            {{ suggestion }}
          </li>
        </ul>
      </div>

      <!-- Recovery Actions -->
      <div class="error-actions" *ngIf="recoveryActions && recoveryActions.length > 0">
        <button
          *ngFor="let action of recoveryActions"
          [ngClass]="action.isPrimary ? 'action-primary' : 'action-secondary'"
          (click)="executeAction(action)"
        >
          <i *ngIf="action.icon" [class]="action.icon"></i>
          {{ action.label }}
        </button>
      </div>

      <!-- Default Actions -->
      <div class="error-actions" *ngIf="showDefaultActions && (!recoveryActions || recoveryActions.length === 0)">
        <button class="action-primary" (click)="retry()">
          <i class="fas fa-redo"></i>
          Try Again
        </button>
        <button class="action-secondary" (click)="goHome()">
          <i class="fas fa-home"></i>
          Go to Home
        </button>
        <button class="action-tertiary" (click)="reportIssue()" *ngIf="allowReporting">
          <i class="fas fa-flag"></i>
          Report Issue
        </button>
      </div>

      <!-- Support Information -->
      <div class="error-support" *ngIf="showSupport">
        <p class="support-text">
          If the problem persists, please contact support at
          <a [href]="'mailto:' + supportEmail" class="support-link">{{ supportEmail }}</a>
          or call <a [href]="'tel:' + supportPhone" class="support-link">{{ supportPhone }}</a>
        </p>
        <p class="error-timestamp">
          Error occurred at: {{ errorTimestamp | date:'medium' }}
        </p>
      </div>
    </div>

    <!-- Fallback Content (when no error) -->
    <ng-content *ngIf="!hasError"></ng-content>
  `,
  styles: [`
    :host {
      --error-color: #ef4444;
      --warning-color: #f59e0b;
      --info-color: #3b82f6;
      --error-bg: #fee2e2;
      --warning-bg: #fef3c7;
      --info-bg: #dbeafe;
    }

    :host-context(.dark) {
      --error-bg: #7f1d1d;
      --warning-bg: #78350f;
      --info-bg: #1e3a8a;
    }

    .error-boundary-container {
      padding: var(--space-8);
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      max-width: 600px;
      margin: var(--space-8) auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Severity Variants */
    .error-boundary-container.severity-error {
      border-left: 4px solid var(--error-color);
      background: var(--error-bg);
    }

    .error-boundary-container.severity-warning {
      border-left: 4px solid var(--warning-color);
      background: var(--warning-bg);
    }

    .error-boundary-container.severity-info {
      border-left: 4px solid var(--info-color);
      background: var(--info-bg);
    }

    .error-boundary-container.severity-critical {
      border: 2px solid var(--error-color);
      background: var(--error-bg);
      animation: pulse-border 2s infinite;
    }

    @keyframes pulse-border {
      0%, 100% {
        border-color: var(--error-color);
      }
      50% {
        border-color: rgba(239, 68, 68, 0.5);
      }
    }

    /* Error Illustration */
    .error-illustration {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-6);
    }

    .error-icon {
      width: 80px;
      height: 80px;
      color: var(--text-secondary);
    }

    /* Error Header */
    .error-header {
      text-align: center;
      margin-bottom: var(--space-4);
    }

    .error-title {
      font-size: var(--text-h3);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .error-code {
      font-size: var(--text-caption);
      color: var(--text-tertiary);
      font-family: var(--font-mono);
      background: rgba(0, 0, 0, 0.05);
      padding: var(--space-1) var(--space-2);
      border-radius: 4px;
      display: inline-block;
    }

    /* Error Message */
    .error-message {
      margin-bottom: var(--space-6);
      text-align: center;
    }

    .error-description {
      font-size: var(--text-body-md);
      color: var(--text-secondary);
      line-height: var(--leading-relaxed);
      margin: 0;
    }

    /* Error Details */
    .error-details {
      margin-top: var(--space-4);
      text-align: left;
    }

    .error-details-toggle {
      cursor: pointer;
      font-size: var(--text-body-sm);
      color: var(--color-primary);
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      user-select: none;
    }

    .error-details-toggle:hover {
      text-decoration: underline;
    }

    .error-details[open] .error-details-toggle i {
      transform: rotate(90deg);
      transition: transform 0.2s ease;
    }

    .error-details-content {
      margin-top: var(--space-3);
      padding: var(--space-3);
      background: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      position: relative;
    }

    .error-details-content pre {
      font-family: var(--font-mono);
      font-size: var(--text-caption);
      color: var(--text-tertiary);
      overflow-x: auto;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .copy-details-btn {
      position: absolute;
      top: var(--space-2);
      right: var(--space-2);
      padding: var(--space-1) var(--space-2);
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: var(--text-caption);
      cursor: pointer;
      transition: all var(--duration-fast) ease;
    }

    .copy-details-btn:hover {
      background: var(--color-primary);
      color: white;
    }

    /* Suggestions */
    .error-suggestions {
      margin-bottom: var(--space-6);
      text-align: left;
    }

    .suggestions-title {
      font-size: var(--text-body-md);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0 0 var(--space-3) 0;
    }

    .suggestions-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .suggestions-list li {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      padding: var(--space-2) 0;
      font-size: var(--text-body-sm);
      color: var(--text-secondary);
    }

    .suggestions-list i {
      color: var(--warning-color);
      margin-top: 2px;
    }

    /* Recovery Actions */
    .error-actions {
      display: flex;
      gap: var(--space-3);
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: var(--space-4);
    }

    .action-primary,
    .action-secondary,
    .action-tertiary {
      padding: var(--space-3) var(--space-6);
      border-radius: 8px;
      font-size: var(--text-body-md);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all var(--duration-fast) ease;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      border: 2px solid transparent;
    }

    .action-primary {
      background: var(--color-primary);
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .action-primary:hover {
      background: var(--color-primary-600);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .action-secondary {
      background: transparent;
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .action-secondary:hover {
      background: rgba(var(--color-primary-rgb), 0.05);
    }

    .action-tertiary {
      background: transparent;
      color: var(--text-secondary);
    }

    .action-tertiary:hover {
      color: var(--text-primary);
      background: var(--bg-tertiary);
    }

    /* Support Information */
    .error-support {
      text-align: center;
      padding-top: var(--space-4);
      border-top: 1px solid var(--border-color);
      font-size: var(--text-body-sm);
      color: var(--text-tertiary);
    }

    .support-text {
      margin: 0 0 var(--space-2) 0;
    }

    .support-link {
      color: var(--color-primary);
      text-decoration: none;
    }

    .support-link:hover {
      text-decoration: underline;
    }

    .error-timestamp {
      font-size: var(--text-caption);
      color: var(--text-tertiary);
      margin: 0;
    }

    /* Focus States */
    button:focus-visible,
    .support-link:focus-visible {
      outline: var(--focus-ring-width) solid var(--focus-ring-color);
      outline-offset: var(--focus-ring-offset);
      border-radius: 4px;
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .error-boundary-container.severity-critical {
        animation: none;
      }

      .error-details[open] .error-details-toggle i {
        transition: none;
      }
    }
  `]
})
export class ErrorBoundaryComponent {
  @Input() hasError: boolean = false;
  @Input() errorType: ErrorType = ErrorType.UNKNOWN;
  @Input() severity: ErrorSeverity = ErrorSeverity.ERROR;
  @Input() title: string = 'Something went wrong';
  @Input() message: string = 'An unexpected error occurred. Please try again.';
  @Input() errorCode?: string;
  @Input() details?: string;
  @Input() suggestions?: string[];
  @Input() recoveryActions?: ErrorRecoveryAction[];
  @Input() showDetails: boolean = true;
  @Input() showDefaultActions: boolean = true;
  @Input() showSupport: boolean = true;
  @Input() allowReporting: boolean = true;
  @Input() supportEmail: string = 'support@doganconsult.com';
  @Input() supportPhone: string = '+966-XXX-XXXXX';
  @Input() errorTimestamp: Date = new Date();

  @Output() retryClick = new EventEmitter<void>();
  @Output() homeClick = new EventEmitter<void>();
  @Output() reportClick = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<ErrorRecoveryAction>();

  canCopy: boolean = !!navigator.clipboard;

  constructor(private router: Router) {}

  get severityClass(): string {
    return `severity-${this.severity}`;
  }

  retry(): void {
    this.retryClick.emit();
  }

  goHome(): void {
    this.homeClick.emit();
    this.router.navigate(['/']);
  }

  reportIssue(): void {
    this.reportClick.emit();
    // Implement issue reporting logic
    console.log('Reporting issue:', {
      type: this.errorType,
      code: this.errorCode,
      message: this.message,
      timestamp: this.errorTimestamp
    });
  }

  executeAction(action: ErrorRecoveryAction): void {
    this.actionClick.emit(action);
    action.action();
  }

  async copyDetails(): Promise<void> {
    if (!this.details || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(this.details);
      // Show success feedback
      console.log('Details copied to clipboard');
    } catch (err) {
      console.error('Failed to copy details:', err);
    }
  }
}

/**
 * Global Error Handler Service
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error): void {
    console.error('Global error caught:', error);

    // Get error details
    const errorType = this.categorizeError(error);
    const errorContext = this.getErrorContext(error);

    // Log to monitoring service
    this.logError(error, errorType, errorContext);

    // Show user-friendly error
    this.showErrorNotification(error, errorType);
  }

  private categorizeError(error: any): ErrorType {
    if (error.status === 0 || error.message?.includes('network')) {
      return ErrorType.NETWORK;
    }
    if (error.status === 401) {
      return ErrorType.AUTHENTICATION;
    }
    if (error.status === 403) {
      return ErrorType.AUTHORIZATION;
    }
    if (error.status === 404) {
      return ErrorType.NOT_FOUND;
    }
    if (error.status === 429) {
      return ErrorType.RATE_LIMIT;
    }
    if (error.status >= 500) {
      return ErrorType.SERVER;
    }
    if (error.status >= 400) {
      return ErrorType.CLIENT;
    }
    if (error.name === 'TimeoutError') {
      return ErrorType.TIMEOUT;
    }
    return ErrorType.UNKNOWN;
  }

  private getErrorContext(error: any): ErrorContext {
    return {
      timestamp: new Date(),
      url: window.location.href,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      stackTrace: error.stack,
      metadata: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
  }

  private logError(error: Error, type: ErrorType, context: ErrorContext): void {
    // Send to logging service (e.g., Sentry, LogRocket)
    console.error('Error logged:', {
      error,
      type,
      context
    });
  }

  private showErrorNotification(error: Error, type: ErrorType): void {
    // Show toast or modal notification
    console.log('Showing error notification for:', type);
  }

  private getCurrentUserId(): string | undefined {
    // Get from auth service
    return undefined;
  }

  private getSessionId(): string | undefined {
    // Get from session storage
    return sessionStorage.getItem('sessionId') || undefined;
  }
}

/**
 * Error Recovery Strategies
 */
export const ERROR_RECOVERY_STRATEGIES = {
  network: [
    {
      label: 'Check Connection',
      icon: 'fas fa-wifi',
      action: () => window.location.reload()
    },
    {
      label: 'Try Offline Mode',
      icon: 'fas fa-download',
      action: () => console.log('Switching to offline mode')
    }
  ],

  authentication: [
    {
      label: 'Sign In Again',
      icon: 'fas fa-sign-in-alt',
      action: () => window.location.href = '/login',
      isPrimary: true
    },
    {
      label: 'Forgot Password',
      icon: 'fas fa-key',
      action: () => window.location.href = '/forgot-password'
    }
  ],

  rateLimit: [
    {
      label: 'Wait & Retry',
      icon: 'fas fa-clock',
      action: () => setTimeout(() => window.location.reload(), 5000),
      isPrimary: true
    }
  ]
};