import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { ForecastResponse } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-forecast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      </div>
    } @else if (data()) {
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-th-card border border-th-border rounded-xl p-5">
          <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Pipeline Value', 'قيمة الأنابيب') }}</p>
          <p class="text-2xl font-bold text-th-text">SAR {{ formatAmount(data()!.pipeline.total_value) }}</p>
          <p class="text-xs text-th-text-3 mt-0.5">{{ data()!.pipeline.deals }} {{ i18n.t('active deals', 'صفقات نشطة') }}</p>
        </div>
        <div class="bg-th-card border border-th-border rounded-xl p-5">
          <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Weighted Pipeline', 'الأنابيب المرجحة') }}</p>
          <p class="text-2xl font-bold text-primary">SAR {{ formatAmount(data()!.pipeline.weighted_value) }}</p>
          <p class="text-xs text-th-text-3 mt-0.5">{{ i18n.t('probability adjusted', 'معدلة حسب الاحتمال') }}</p>
        </div>
        <div class="bg-th-card border border-emerald-200 rounded-xl p-5">
          <p class="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">{{ i18n.t('Projected Commission', 'العمولة المتوقعة') }}</p>
          <p class="text-2xl font-bold text-emerald-600">SAR {{ formatAmount(data()!.projected_commission) }}</p>
          <p class="text-xs text-th-text-3 mt-0.5">{{ i18n.t('at', 'بنسبة') }} {{ data()!.commission_rate }}% {{ i18n.t('rate', 'عمولة') }}</p>
        </div>
      </div>

      <!-- 3-Month Forecast -->
      <div class="bg-th-card border border-th-border rounded-xl p-6 mb-6">
        <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('3-Month Forecast', 'توقعات 3 أشهر') }}</h3>
        <div class="grid grid-cols-3 gap-4">
          @for (f of data()!.forecast; track f.month) {
            <div class="border border-th-border-lt rounded-lg p-4 text-center">
              <p class="text-xs text-th-text-3 mb-1">{{ f.month }}</p>
              <p class="text-lg font-bold text-th-text">SAR {{ formatAmount(f.projected_revenue) }}</p>
              <span class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium mt-1" [class]="confidenceClass(f.confidence)">
                {{ i18n.t(f.confidence + ' confidence', f.confidence === 'high' ? 'ثقة عالية' : f.confidence === 'medium' ? 'ثقة متوسطة' : 'ثقة منخفضة') }}
              </span>
            </div>
          }
        </div>
      </div>

      <!-- Historical Trend -->
      @if (data()!.history.length > 0) {
        <div class="bg-th-card border border-th-border rounded-xl p-6">
          <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Historical Commission', 'العمولات التاريخية') }}</h3>
          <div class="flex items-end gap-2 h-36">
            @for (h of data()!.history; track h.month) {
              <div class="flex-1 flex flex-col items-center gap-1">
                <span class="text-[9px] font-bold text-th-text-2">{{ formatK(+h.total) }}</span>
                <div class="w-full bg-emerald-500 rounded-t transition-all min-h-[2px]"
                     [style.height.%]="maxHistory() > 0 ? (+h.total / maxHistory()) * 100 : 0"></div>
                <span class="text-[9px] text-th-text-3">{{ h.month.slice(5) }}</span>
              </div>
            }
          </div>
          <div class="mt-4 pt-4 border-t border-th-border-lt text-center">
            <p class="text-xs text-th-text-3">{{ i18n.t('Monthly Average', 'المتوسط الشهري') }}</p>
            <p class="text-lg font-bold text-th-text">SAR {{ formatAmount(data()!.avg_monthly) }}</p>
          </div>
        </div>
      }
    }
  `,
})
export class PartnerForecastComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  data = signal<ForecastResponse | null>(null);
  loading = signal(false);
  maxHistory = signal(1);

  ngOnInit() {
    this.loading.set(true);
    this.api.getForecast().subscribe({
      next: res => {
        this.data.set(res);
        this.maxHistory.set(Math.max(1, ...res.history.map(h => +h.total)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  formatAmount(n: number): string {
    return (n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  formatK(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }

  confidenceClass(level: string): string {
    const map: Record<string, string> = {
      high: 'bg-emerald-100 text-emerald-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-th-bg-tert text-th-text-2',
    };
    return map[level] || 'bg-th-bg-tert text-th-text-2';
  }
}
