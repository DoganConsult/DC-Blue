/**
 * References Component
 * Displays and manages academic/regulatory references for case studies
 * Supports APA 7, IEEE, and custom citation formats
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reference } from '../../services/case-study.service';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="references-container">
      <!-- Reference List -->
      <ol class="reference-list">
        <li *ngFor="let ref of references; let i = index"
            [id]="ref.id"
            class="reference-item"
            [class.regulation]="ref.category === 'regulation'"
            [class.law]="ref.category === 'law'"
            [class.research]="ref.category === 'research'">

          <!-- Reference Number -->
          <span class="reference-number">[{{ i + 1 }}]</span>

          <!-- Reference Content -->
          <div class="reference-content">
            <!-- Main Citation -->
            <div class="citation">
              <span class="publisher" *ngIf="ref.publisher">{{ ref.publisher }}</span>
              <span class="year" *ngIf="ref.year">({{ ref.year }})</span>.
              <span class="title">{{ ref.label }}</span>.
            </div>

            <!-- URL -->
            <div class="url-container">
              <a [href]="ref.url"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="reference-url">
                {{ ref.url }}
              </a>
              <button
                class="copy-btn"
                (click)="copyReference(ref, i + 1)"
                [title]="'Copy ' + getCitationFormat() + ' citation'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <!-- Relevance Note -->
            <div class="relevance" *ngIf="ref.relevance">
              <span class="relevance-label">Relevance:</span>
              {{ ref.relevance }}
            </div>

            <!-- Category Badge -->
            <span class="category-badge" [class]="'badge-' + ref.category">
              {{ getCategoryLabel(ref.category) }}
            </span>
          </div>
        </li>
      </ol>

      <!-- Citation Format Selector -->
      <div class="citation-controls" *ngIf="showFormatSelector">
        <label class="format-label">Citation Format:</label>
        <select
          class="format-selector"
          [(ngModel)]="citationFormat"
          (change)="onFormatChange()">
          <option value="apa7">APA 7th Edition</option>
          <option value="ieee">IEEE</option>
          <option value="chicago">Chicago</option>
          <option value="mla">MLA</option>
          <option value="harvard">Harvard</option>
        </select>

        <button
          class="export-btn"
          (click)="exportReferences()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export to Word
        </button>

        <button
          class="export-btn"
          (click)="exportToBibTeX()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export BibTeX
        </button>
      </div>

      <!-- Copy Success Toast -->
      <div class="toast" *ngIf="showCopyToast" [@fadeInOut]>
        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>Citation copied to clipboard!</span>
      </div>
    </div>
  `,
  styles: [`
    .references-container {
      position: relative;
    }

    .reference-list {
      list-style: none;
      padding: 0;
      margin: 0;
      counter-reset: reference-counter;
    }

    .reference-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
      background: var(--bg-secondary, #f9fafb);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 0.75rem;
      transition: all 0.2s ease;
    }

    .reference-item:hover {
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }

    /* Category-specific styling */
    .reference-item.regulation {
      border-left: 4px solid #3b82f6;
    }

    .reference-item.law {
      border-left: 4px solid #ef4444;
    }

    .reference-item.research {
      border-left: 4px solid #10b981;
    }

    .reference-number {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-primary, #3b82f6);
      color: white;
      border-radius: 50%;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .reference-content {
      flex: 1;
      min-width: 0;
    }

    .citation {
      font-size: 1rem;
      line-height: 1.5;
      color: var(--text-primary, #111827);
      margin-bottom: 0.5rem;
    }

    .publisher {
      font-weight: 500;
      color: var(--text-secondary, #4b5563);
    }

    .year {
      color: var(--text-tertiary, #6b7280);
      margin-left: 0.25rem;
    }

    .title {
      font-style: italic;
      color: var(--text-primary, #111827);
    }

    .url-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0;
    }

    .reference-url {
      color: var(--color-primary, #3b82f6);
      text-decoration: none;
      font-size: 0.875rem;
      word-break: break-all;
      flex: 1;
    }

    .reference-url:hover {
      text-decoration: underline;
    }

    .copy-btn {
      flex-shrink: 0;
      padding: 0.375rem;
      background: transparent;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-secondary, #6b7280);
    }

    .copy-btn:hover {
      background: var(--bg-tertiary, #f3f4f6);
      color: var(--text-primary, #111827);
      border-color: var(--border-hover, #d1d5db);
    }

    .relevance {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: var(--bg-tertiary, #f3f4f6);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      color: var(--text-secondary, #4b5563);
    }

    .relevance-label {
      font-weight: 600;
      color: var(--text-primary, #111827);
      margin-right: 0.5rem;
    }

    .category-badge {
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-regulation {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-law {
      background: #fee2e2;
      color: #991b1b;
    }

    .badge-research {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-policy {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-framework {
      background: #ede9fe;
      color: #5b21b6;
    }

    /* Citation Controls */
    .citation-controls {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--bg-tertiary, #f9fafb);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .format-label {
      font-weight: 500;
      color: var(--text-primary, #111827);
    }

    .format-selector {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color, #d1d5db);
      border-radius: 0.375rem;
      background: white;
      color: var(--text-primary, #111827);
      font-size: 0.875rem;
    }

    .export-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid var(--border-color, #d1d5db);
      border-radius: 0.375rem;
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--text-primary, #111827);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .export-btn:hover {
      background: var(--color-primary, #3b82f6);
      color: white;
      border-color: var(--color-primary, #3b82f6);
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .reference-item {
        flex-direction: column;
      }

      .reference-number {
        width: auto;
        height: auto;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        align-self: flex-start;
      }

      .citation-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .export-btn {
        justify-content: center;
      }
    }
  `]
})
export class ReferencesComponent {
  @Input() references: Reference[] = [];
  @Input() showFormatSelector: boolean = true;
  @Input() citationFormat: string = 'apa7';

  @Output() formatChanged = new EventEmitter<string>();
  @Output() referenceClicked = new EventEmitter<Reference>();
  @Output() exportRequested = new EventEmitter<{format: string, references: Reference[]}>();

  showCopyToast = false;

  getCitationFormat(): string {
    const formats: Record<string, string> = {
      'apa7': 'APA 7',
      'ieee': 'IEEE',
      'chicago': 'Chicago',
      'mla': 'MLA',
      'harvard': 'Harvard'
    };
    return formats[this.citationFormat] || 'APA 7';
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'regulation': 'Regulation',
      'law': 'Law',
      'research': 'Research',
      'policy': 'Policy',
      'framework': 'Framework',
      'standard': 'Standard'
    };
    return labels[category] || category;
  }

  formatCitation(ref: Reference, index: number): string {
    switch (this.citationFormat) {
      case 'apa7':
        return this.formatAPA7(ref);
      case 'ieee':
        return this.formatIEEE(ref, index);
      case 'chicago':
        return this.formatChicago(ref);
      case 'mla':
        return this.formatMLA(ref);
      case 'harvard':
        return this.formatHarvard(ref);
      default:
        return this.formatAPA7(ref);
    }
  }

  private formatAPA7(ref: Reference): string {
    const publisher = ref.publisher || 'n.p.';
    const year = ref.year || 'n.d.';
    return `${publisher}. (${year}). ${ref.label}. ${ref.url}`;
  }

  private formatIEEE(ref: Reference, index: number): string {
    const publisher = ref.publisher || '';
    const year = ref.year || '';
    return `[${index}] ${publisher}, "${ref.label}," ${year}. [Online]. Available: ${ref.url}`;
  }

  private formatChicago(ref: Reference): string {
    const publisher = ref.publisher || '';
    const year = ref.year || '';
    return `${publisher}. "${ref.label}." ${year}. ${ref.url}.`;
  }

  private formatMLA(ref: Reference): string {
    const publisher = ref.publisher || '';
    const year = ref.year || '';
    return `${publisher}. "${ref.label}." Web. ${year}. <${ref.url}>.`;
  }

  private formatHarvard(ref: Reference): string {
    const publisher = ref.publisher || '';
    const year = ref.year || '';
    return `${publisher} ${year}, '${ref.label}', viewed ${new Date().toLocaleDateString()}, <${ref.url}>.`;
  }

  async copyReference(ref: Reference, index: number): Promise<void> {
    try {
      const citation = this.formatCitation(ref, index);
      await navigator.clipboard.writeText(citation);

      // Show toast notification
      this.showCopyToast = true;
      setTimeout(() => {
        this.showCopyToast = false;
      }, 3000);
    } catch (err) {
      console.error('Failed to copy citation:', err);
    }
  }

  onFormatChange(): void {
    this.formatChanged.emit(this.citationFormat);
  }

  exportReferences(): void {
    this.exportRequested.emit({
      format: 'word',
      references: this.references
    });

    // Generate Word-compatible format
    const citations = this.references.map((ref, i) =>
      this.formatCitation(ref, i + 1)
    ).join('\\n\\n');

    // Create a blob for download
    const blob = new Blob([citations], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `references-${this.citationFormat}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  exportToBibTeX(): void {
    const bibtex = this.references.map((ref, i) => {
      const type = ref.category === 'research' ? '@article' : '@misc';
      const key = ref.id || `ref${i + 1}`;

      return `${type}{${key},
  title={${ref.label}},
  author={${ref.publisher || ''}},
  year={${ref.year || ''}},
  url={${ref.url}},
  note={${ref.relevance || ''}}
}`;
    }).join('\\n\\n');

    // Create BibTeX file for download
    const blob = new Blob([bibtex], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'references.bib';
    link.click();
    URL.revokeObjectURL(url);
  }
}