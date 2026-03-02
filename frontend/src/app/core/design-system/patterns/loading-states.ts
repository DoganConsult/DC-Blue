/**
 * Enterprise Loading States Pattern Library
 * Skeleton loaders, progress indicators, and loading placeholders
 * Following IBM Carbon and Material Design principles
 */

import { Component, Input, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton Loader Component
 * Displays animated placeholder content while data loads
 */
@Component({
  selector: 'ds-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [ngClass]="skeletonClasses()"
      [style.width]="width"
      [style.height]="height"
      [style.borderRadius]="borderRadius"
      role="status"
      aria-live="polite"
      [attr.aria-label]="ariaLabel || 'Loading content'"
    >
      <span class="sr-only">{{ ariaLabel || 'Loading...' }}</span>
    </div>
  `,
  styles: [`
    @keyframes skeleton-shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    .skeleton-base {
      position: relative;
      overflow: hidden;
      background: linear-gradient(
        90deg,
        var(--skeleton-base) 0%,
        var(--skeleton-base) 40%,
        var(--skeleton-highlight) 50%,
        var(--skeleton-base) 60%,
        var(--skeleton-base) 100%
      );
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.5s ease-in-out infinite;
    }

    :host {
      --skeleton-base: #e5e7eb;
      --skeleton-highlight: #f3f4f6;
    }

    :host-context(.dark) {
      --skeleton-base: #374151;
      --skeleton-highlight: #4b5563;
    }

    .skeleton-text {
      border-radius: 4px;
      height: 1em;
      margin: 0.5em 0;
    }

    .skeleton-heading {
      height: 1.5em;
      margin: 0.75em 0;
    }

    .skeleton-button {
      border-radius: 8px;
      height: 44px;
      min-width: 120px;
    }

    .skeleton-avatar {
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }

    .skeleton-card {
      border-radius: 12px;
      height: 200px;
    }

    .skeleton-image {
      border-radius: 8px;
      width: 100%;
      aspect-ratio: 16/9;
    }

    .skeleton-table-row {
      height: 52px;
      margin: 4px 0;
      border-radius: 4px;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .skeleton-base {
        animation: none;
        background: var(--skeleton-base);
      }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: 'text' | 'heading' | 'button' | 'avatar' | 'card' | 'image' | 'table-row' | 'custom' = 'text';
  @Input() width: string = 'auto';
  @Input() height: string = 'auto';
  @Input() borderRadius: string = '4px';
  @Input() ariaLabel?: string;

  skeletonClasses = computed(() => {
    const classes = ['skeleton-base'];
    if (this.type !== 'custom') {
      classes.push(`skeleton-${this.type}`);
    }
    return classes;
  });
}

/**
 * Skeleton Card Component
 * Complete card placeholder with image, title, and content
 */
@Component({
  selector: 'ds-skeleton-card',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="skeleton-card-container" role="status" aria-label="Loading card">
      <ds-skeleton-loader type="image"></ds-skeleton-loader>
      <div class="skeleton-card-content">
        <ds-skeleton-loader type="heading" width="60%"></ds-skeleton-loader>
        <ds-skeleton-loader type="text" width="100%"></ds-skeleton-loader>
        <ds-skeleton-loader type="text" width="80%"></ds-skeleton-loader>
        <ds-skeleton-loader type="text" width="90%"></ds-skeleton-loader>
        <div class="skeleton-card-actions">
          <ds-skeleton-loader type="button" width="100px"></ds-skeleton-loader>
          <ds-skeleton-loader type="button" width="100px"></ds-skeleton-loader>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-card-container {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .skeleton-card-content {
      padding: 1.5rem;
    }

    .skeleton-card-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
  `]
})
export class SkeletonCardComponent {}

/**
 * Skeleton Table Component
 * Table placeholder with multiple rows
 */
@Component({
  selector: 'ds-skeleton-table',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="skeleton-table-container" role="status" aria-label="Loading table">
      <!-- Header -->
      <div class="skeleton-table-header">
        <ds-skeleton-loader type="custom" height="48px" width="100%"></ds-skeleton-loader>
      </div>

      <!-- Rows -->
      <div class="skeleton-table-body">
        <div *ngFor="let row of rows" class="skeleton-table-row">
          <ds-skeleton-loader type="table-row" width="100%"></ds-skeleton-loader>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-table-container {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .skeleton-table-header {
      background: var(--bg-tertiary);
      padding: 0.75rem;
      border-bottom: 1px solid var(--border-color);
    }

    .skeleton-table-body {
      padding: 0.5rem;
    }

    .skeleton-table-row {
      margin: 0.25rem 0;
    }
  `]
})
export class SkeletonTableComponent {
  @Input() rowCount: number = 5;

  get rows() {
    return Array(this.rowCount).fill(0);
  }
}

/**
 * Progress Indicator Component
 * Shows determinate or indeterminate progress
 */
@Component({
  selector: 'ds-progress-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container" role="progressbar"
         [attr.aria-valuenow]="value"
         [attr.aria-valuemin]="0"
         [attr.aria-valuemax]="100"
         [attr.aria-label]="label">

      <!-- Linear Progress -->
      <div *ngIf="type === 'linear'" class="progress-linear">
        <div class="progress-track">
          <div class="progress-fill"
               [style.width.%]="value"
               [class.indeterminate]="indeterminate">
          </div>
        </div>
        <div *ngIf="showLabel" class="progress-label">
          {{ label }} <span *ngIf="!indeterminate">{{ value }}%</span>
        </div>
      </div>

      <!-- Circular Progress -->
      <div *ngIf="type === 'circular'" class="progress-circular" [style.width]="size" [style.height]="size">
        <svg class="progress-svg" viewBox="0 0 100 100">
          <circle class="progress-track-circle" cx="50" cy="50" r="45"></circle>
          <circle class="progress-fill-circle"
                  cx="50" cy="50" r="45"
                  [style.strokeDasharray]="circumference"
                  [style.strokeDashoffset]="strokeOffset"
                  [class.indeterminate]="indeterminate">
          </circle>
        </svg>
        <div *ngIf="showLabel" class="progress-circular-label">
          <span *ngIf="!indeterminate">{{ value }}%</span>
          <span *ngIf="indeterminate">Loading</span>
        </div>
      </div>

      <!-- Dots Progress -->
      <div *ngIf="type === 'dots'" class="progress-dots">
        <span *ngFor="let dot of [1,2,3,4]" class="progress-dot" [style.animationDelay]="(dot * 150) + 'ms'"></span>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      position: relative;
    }

    /* Linear Progress */
    .progress-linear {
      width: 100%;
    }

    .progress-track {
      height: 8px;
      background: var(--bg-tertiary);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), var(--color-primary-600));
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-fill.indeterminate {
      width: 30% !important;
      animation: indeterminate-linear 1.5s ease-in-out infinite;
    }

    @keyframes indeterminate-linear {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(400%);
      }
    }

    .progress-label {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
      display: flex;
      justify-content: space-between;
    }

    /* Circular Progress */
    .progress-circular {
      position: relative;
      display: inline-block;
    }

    .progress-svg {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }

    .progress-track-circle {
      fill: none;
      stroke: var(--bg-tertiary);
      stroke-width: 8;
    }

    .progress-fill-circle {
      fill: none;
      stroke: var(--color-primary);
      stroke-width: 8;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.3s ease;
    }

    .progress-fill-circle.indeterminate {
      animation: indeterminate-circular 1.5s ease-in-out infinite;
    }

    @keyframes indeterminate-circular {
      0% {
        stroke-dashoffset: 282;
        transform: rotate(0deg);
      }
      50% {
        stroke-dashoffset: 70;
        transform: rotate(180deg);
      }
      100% {
        stroke-dashoffset: 282;
        transform: rotate(360deg);
      }
    }

    .progress-circular-label {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Dots Progress */
    .progress-dots {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      align-items: center;
      height: 40px;
    }

    .progress-dot {
      width: 12px;
      height: 12px;
      background: var(--color-primary);
      border-radius: 50%;
      animation: dot-pulse 1.5s ease-in-out infinite;
    }

    @keyframes dot-pulse {
      0%, 80%, 100% {
        transform: scale(1);
        opacity: 0.8;
      }
      40% {
        transform: scale(1.3);
        opacity: 1;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .progress-fill,
      .progress-fill-circle,
      .progress-dot {
        animation: none;
      }
    }
  `]
})
export class ProgressIndicatorComponent implements OnInit {
  @Input() type: 'linear' | 'circular' | 'dots' = 'linear';
  @Input() value: number = 0;
  @Input() indeterminate: boolean = false;
  @Input() size: string = '100px';
  @Input() showLabel: boolean = true;
  @Input() label: string = 'Loading';

  circumference = 283; // 2 * PI * 45 (radius)

  get strokeOffset() {
    if (this.indeterminate) return 0;
    return this.circumference - (this.value / 100) * this.circumference;
  }

  ngOnInit() {
    if (this.value < 0) this.value = 0;
    if (this.value > 100) this.value = 100;
  }
}

/**
 * Content Loader Component
 * Wraps content with loading state management
 */
@Component({
  selector: 'ds-content-loader',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent, ProgressIndicatorComponent],
  template: `
    <div class="content-loader-container">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <ng-container [ngSwitch]="loaderType">
          <ds-skeleton-loader *ngSwitchCase="'skeleton'" [type]="skeletonType"></ds-skeleton-loader>
          <ds-progress-indicator *ngSwitchCase="'progress'" [type]="progressType" [indeterminate]="true"></ds-progress-indicator>
          <div *ngSwitchDefault class="custom-loader">
            <ng-content select="[loader]"></ng-content>
          </div>
        </ng-container>
      </div>

      <!-- Content -->
      <div *ngIf="!loading" class="content-state" [@fadeIn]>
        <ng-content></ng-content>
      </div>

      <!-- Error State (if applicable) -->
      <div *ngIf="error && !loading" class="error-state">
        <ng-content select="[error]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .content-loader-container {
      position: relative;
      min-height: var(--min-height, 100px);
    }

    .loading-state,
    .content-state,
    .error-state {
      width: 100%;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .content-state {
      animation: fadeIn 0.3s ease-in;
    }
  `]
})
export class ContentLoaderComponent {
  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Input() loaderType: 'skeleton' | 'progress' | 'custom' = 'skeleton';
  @Input() skeletonType: any = 'text';
  @Input() progressType: any = 'linear';
}

/**
 * Export all loading state utilities
 */
export const LOADING_COMPONENTS = [
  SkeletonLoaderComponent,
  SkeletonCardComponent,
  SkeletonTableComponent,
  ProgressIndicatorComponent,
  ContentLoaderComponent
];

export const loadingStateStyles = `
  /* Global loading state variables */
  :root {
    --skeleton-base: #e5e7eb;
    --skeleton-highlight: #f3f4f6;
    --loader-primary: var(--color-primary);
    --loader-secondary: var(--color-gray-300);
  }

  .dark {
    --skeleton-base: #374151;
    --skeleton-highlight: #4b5563;
    --loader-secondary: var(--color-gray-700);
  }

  /* Utility classes for loading states */
  .is-loading {
    pointer-events: none;
    user-select: none;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-overlay);
  }

  .dark .loading-overlay {
    background: rgba(0, 0, 0, 0.9);
  }

  /* Skeleton animation utilities */
  .skeleton-pulse {
    animation: skeleton-pulse 2s ease-in-out infinite;
  }

  @keyframes skeleton-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Loading spinner utility */
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--loader-secondary);
    border-top-color: var(--loader-primary);
    border-radius: 50%;
    animation: spinner-rotate 0.8s linear infinite;
  }

  @keyframes spinner-rotate {
    to {
      transform: rotate(360deg);
    }
  }
`;