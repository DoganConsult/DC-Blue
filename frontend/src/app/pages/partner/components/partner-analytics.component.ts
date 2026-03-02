import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { MonthlyData, ConversionFunnel } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      </div>
    } @else {
      <!-- Conversion Funnel -->
      <div class="bg-th-card border border-th-border rounded-xl p-6 mb-6">
        <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Conversion Funnel', 'قمع التحويل') }}</h3>
        <div class="flex items-end gap-3 h-32">
          @for (step of funnelSteps(); track step.label) {
            <div class="flex-1 flex flex-col items-center gap-2">
              <span class="text-xs font-bold text-th-text">{{ step.value }}</span>
              <div class="w-full rounded-t-lg transition-all" [style.height.%]="step.pct" [class]="step.color"></div>
              <span class="text-[10px] text-th-text-3 text-center leading-tight">{{ i18n.t(step.label, step.labelAr) }}</span>
            </div>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Monthly Trend (bar chart using divs) -->
        <div class="bg-th-card border border-th-border rounded-xl p-6">
          <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Monthly Leads', 'العملاء الشهريين') }}</h3>
          <div class="flex items-end gap-1 h-36">
            @for (m of monthly(); track m.month) {
              <div class="flex-1 flex flex-col items-center gap-1">
                <span class="text-[9px] font-bold text-th-text-2">{{ m.leads }}</span>
                <div class="w-full bg-blue-500 rounded-t transition-all min-h-[2px]"
                     [style.height.%]="maxLeads() > 0 ? (m.leads / maxLeads()) * 100 : 0"></div>
                <span class="text-[9px] text-th-text-3 -rotate-45 origin-center">{{ m.month.slice(5) }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Monthly Commission Trend -->
        <div class="bg-th-card border border-th-border rounded-xl p-6">
          <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Monthly Commission', 'العمولة الشهرية') }}</h3>
          <div class="flex items-end gap-1 h-36">
            @for (m of monthly(); track m.month) {
              <div class="flex-1 flex flex-col items-center gap-1">
                <span class="text-[9px] font-bold text-th-text-2">{{ m.commissions > 0 ? formatK(m.commissions) : '' }}</span>
                <div class="w-full bg-emerald-500 rounded-t transition-all min-h-[2px]"
                     [style.height.%]="maxComm() > 0 ? (m.commissions / maxComm()) * 100 : 0"></div>
                <span class="text-[9px] text-th-text-3 -rotate-45 origin-center">{{ m.month.slice(5) }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Product Mix -->
        <div class="bg-th-card border border-th-border rounded-xl p-6">
          <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Product Mix', 'مزيج المنتجات') }}</h3>
          @if (productMix().length === 0) {
            <p class="text-sm text-th-text-3 text-center py-6">{{ i18n.t('No data yet', 'لا توجد بيانات بعد') }}</p>
          } @else {
            <div class="space-y-3">
              @for (p of productMix(); track p.product_line) {
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-th-text-2 truncate">{{ p.product_line }}</span>
                    <span class="text-xs font-bold text-th-text">{{ p.count }}</span>
                  </div>
                  <div class="h-2 bg-th-bg-tert rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-500 rounded-full" [style.width.%]="productMaxCount() > 0 ? (p.count / productMaxCount()) * 100 : 0"></div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Top Clients -->
        <div class="bg-th-card border border-th-border rounded-xl p-6">
          <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Top Clients', 'أهم العملاء') }}</h3>
          @if (topClients().length === 0) {
            <p class="text-sm text-th-text-3 text-center py-6">{{ i18n.t('No data yet', 'لا توجد بيانات بعد') }}</p>
          } @else {
            <div class="space-y-3">
              @for (c of topClients(); track c.company_name; let i = $index) {
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-th-bg-tert flex items-center justify-center text-xs font-bold text-th-text-3">{{ i + 1 }}</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-th-text truncate">{{ c.company_name }}</p>
                    <p class="text-xs text-th-text-3">{{ c.deals }} {{ i18n.t('deals', 'صفقات') }}</p>
                  </div>
                  <span class="text-sm font-bold text-th-text">SAR {{ formatK(c.total_value) }}</span>
                </div>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class PartnerAnalyticsComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  loading = signal(false);
  monthly = signal<MonthlyData[]>([]);
  funnel = signal<ConversionFunnel>({ total_leads: 0, qualified: 0, in_pipeline: 0, won: 0 });
  productMix = signal<{ product_line: string; count: number }[]>([]);
  topClients = signal<{ company_name: string; total_value: number; deals: number }[]>([]);

  maxLeads = signal(1);
  maxComm = signal(1);
  productMaxCount = signal(1);

  funnelSteps = signal<{ label: string; labelAr: string; value: number; pct: number; color: string }[]>([]);

  ngOnInit() {
    this.loading.set(true);
    this.api.getAnalytics().subscribe({
      next: res => {
        this.monthly.set(res.monthly);
        this.funnel.set(res.funnel);
        this.productMix.set(res.product_mix);
        this.topClients.set(res.top_clients);

        this.maxLeads.set(Math.max(1, ...res.monthly.map(m => +m.leads)));
        this.maxComm.set(Math.max(1, ...res.monthly.map(m => +m.commissions)));
        this.productMaxCount.set(Math.max(1, ...res.product_mix.map(p => +p.count)));

        const f = res.funnel;
        const max = Math.max(1, f.total_leads);
        this.funnelSteps.set([
          { label: 'Submitted', labelAr: 'مُرسل', value: f.total_leads, pct: 100, color: 'bg-blue-500' },
          { label: 'Qualified', labelAr: 'مؤهل', value: f.qualified, pct: (f.qualified / max) * 100, color: 'bg-indigo-500' },
          { label: 'In Pipeline', labelAr: 'في الأنابيب', value: f.in_pipeline, pct: (f.in_pipeline / max) * 100, color: 'bg-amber-500' },
          { label: 'Won', labelAr: 'فوز', value: f.won, pct: (f.won / max) * 100, color: 'bg-emerald-500' },
        ]);

        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  formatK(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }
}
