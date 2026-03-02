import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { Insight } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-12">
        <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      </div>
    } @else if (insights().length === 0) {
      <div class="bg-th-card border border-th-border rounded-xl p-12 text-center">
        <span class="text-4xl">🤖</span>
        <h3 class="text-lg font-semibold text-th-text mt-3 mb-2">{{ i18n.t('No Insights Yet', 'لا توجد رؤى بعد') }}</h3>
        <p class="text-sm text-th-text-3">{{ i18n.t('Submit more leads to generate personalized insights.', 'أرسل المزيد من العملاء لتوليد رؤى مخصصة.') }}</p>
      </div>
    } @else {
      <div class="space-y-4">
        @for (insight of insights(); track $index) {
          <div class="bg-th-card border rounded-xl p-5" [class]="insightBorderClass(insight.type)">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0" [class]="insightIconBg(insight.type)">
                {{ insightIcon(insight.type) }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-sm font-semibold text-th-text">{{ i18n.t(insight.title.en, insight.title.ar) }}</h4>
                  <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-full" [class]="priorityClass(insight.priority)">
                    {{ insight.priority }}
                  </span>
                </div>
                <p class="text-sm text-th-text-2 leading-relaxed">{{ i18n.t(insight.body.en, insight.body.ar) }}</p>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class PartnerInsightsComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  insights = signal<Insight[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.api.getInsights().subscribe({
      next: res => { this.insights.set(res.insights); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  insightIcon(type: string): string {
    const map: Record<string, string> = { opportunity: '💡', warning: '⚠️', info: 'ℹ️', success: '✅', tip: '🎯' };
    return map[type] || '💡';
  }

  insightIconBg(type: string): string {
    const map: Record<string, string> = {
      opportunity: 'bg-blue-50', warning: 'bg-amber-50', info: 'bg-sky-50', success: 'bg-emerald-50', tip: 'bg-indigo-50',
    };
    return map[type] || 'bg-th-bg-alt';
  }

  insightBorderClass(type: string): string {
    const map: Record<string, string> = {
      opportunity: 'border-blue-200', warning: 'border-amber-200', info: 'border-sky-200', success: 'border-emerald-200', tip: 'border-indigo-200',
    };
    return map[type] || 'border-th-border';
  }

  priorityClass(priority: string): string {
    const map: Record<string, string> = {
      high: 'bg-red-100 text-red-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-th-bg-tert text-th-text-2',
    };
    return map[priority] || 'bg-th-bg-tert text-th-text-2';
  }
}
