import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { I18nService } from '../core/services/i18n.service';

export interface LegalPageContent {
  key: string;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  updated_at?: string;
}

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="pt-20 pb-12 px-6 lg:px-8 min-h-screen bg-page-dark overflow-x-hidden">
        <div class="container mx-auto max-w-3xl">
          @if (loading()) {
            <p class="text-white/70 text-center py-12">{{ i18n.t('Loading...', 'جاري التحميل...') }}</p>
          } @else if (error()) {
            <div class="bg-red-500/10 border border-red-400/30 text-red-200 rounded-xl p-6 text-center">
              {{ error() }}
            </div>
            <p class="text-center mt-6">
              <a routerLink="/" class="text-sky-400 hover:underline">{{ i18n.t('Back to home', 'العودة للرئيسية') }}</a>
            </p>
          } @else if (content()) {
            <h1 class="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-6" [attr.dir]="i18n.dir()">
              {{ i18n.lang() === 'ar' ? content()!.title_ar : content()!.title_en }}
            </h1>
            <div
              class="legal-body text-white/80 leading-relaxed prose prose-invert max-w-none"
              [attr.dir]="i18n.dir()"
              [innerHTML]="bodySafe()"
            ></div>
            @if (content()?.updated_at) {
              <p class="text-white/50 text-sm mt-8">
                {{ i18n.t('Last updated', 'آخر تحديث') }}: {{ content()!.updated_at }}
              </p>
            }
          }
        </div>
      </section>
  `,
  styles: [
    `
      .legal-body :deep(p) { margin-bottom: 1em; }
      .legal-body :deep(ul), .legal-body :deep(ol) { margin: 0.5em 0 1em 1.5em; }
      .legal-body :deep(h2) { font-size: 1.25rem; margin-top: 1.5em; margin-bottom: 0.5em; }
      .legal-body :deep(a) { color: var(--tw-color-sky-400); text-decoration: underline; }
    `,
  ],
})
export class LegalPage implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  i18n = inject(I18nService);

  content = signal<LegalPageContent | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  bodySafe = (): SafeHtml => {
    const c = this.content();
    if (!c) return '';
    const raw = this.i18n.lang() === 'ar' ? (c.body_ar || c.body_en) : (c.body_en || c.body_ar);
    return this.sanitizer.bypassSecurityTrustHtml(raw || '');
  };

  ngOnInit(): void {
    const key = this.route.snapshot.data['legalKey'] as string;
    if (!key) {
      this.loading.set(false);
      this.error.set(this.i18n.t('Invalid page', 'صفحة غير صالحة'));
      return;
    }
    this.http.get<LegalPageContent>(`/api/public/legal/${key}`).subscribe({
      next: (data) => {
        this.content.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(this.i18n.t('Page not found', 'الصفحة غير موجودة'));
      },
    });
  }
}
