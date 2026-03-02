import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { SlaItem, SlaSummary } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-sla',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      </div>
    } @else {
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="bg-th-card border border-th-border rounded-xl p-5 text-center">
          <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Total Leads', 'إجمالي العملاء') }}</p>
          <p class="text-2xl font-bold text-th-text">{{ summary().total }}</p>
        </div>
        <div class="bg-th-card border border-emerald-200 rounded-xl p-5 text-center">
          <p class="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">{{ i18n.t('On Track', 'في المسار') }}</p>
          <p class="text-2xl font-bold text-emerald-600">{{ summary().on_track }}</p>
        </div>
        <div class="bg-th-card border border-amber-200 rounded-xl p-5 text-center">
          <p class="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1">{{ i18n.t('At Risk', 'في خطر') }}</p>
          <p class="text-2xl font-bold text-amber-600">{{ summary().at_risk }}</p>
        </div>
        <div class="bg-th-card border border-red-200 rounded-xl p-5 text-center">
          <p class="text-xs font-medium text-red-600 uppercase tracking-wider mb-1">{{ i18n.t('Breached', 'منتهك') }}</p>
          <p class="text-2xl font-bold text-red-600">{{ summary().breached }}</p>
        </div>
      </div>

      <!-- Avg Review Time -->
      <div class="bg-th-card border border-th-border rounded-xl p-5 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-th-text-2">{{ i18n.t('Avg. Review Time', 'متوسط وقت المراجعة') }}</p>
            <p class="text-xs text-th-text-3 mt-0.5">{{ i18n.t('48h SLA target', 'هدف SLA 48 ساعة') }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold" [class]="summary().avg_review_hours <= 24 ? 'text-emerald-600' : summary().avg_review_hours <= 48 ? 'text-amber-600' : 'text-red-600'">
              {{ summary().avg_review_hours }}h
            </p>
          </div>
        </div>
        <div class="mt-3 h-2 bg-th-bg-tert rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all"
               [style.width.%]="Math.min(100, (summary().avg_review_hours / 48) * 100)"
               [class]="summary().avg_review_hours <= 24 ? 'bg-emerald-500' : summary().avg_review_hours <= 48 ? 'bg-amber-500' : 'bg-red-500'"></div>
        </div>
      </div>

      <!-- Lead SLA Table -->
      @if (items().length > 0) {
        <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-th-border-lt bg-th-bg-alt">
                  <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Ticket', 'التذكرة') }}</th>
                  <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Client', 'العميل') }}</th>
                  <th class="text-center text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('SLA Status', 'حالة SLA') }}</th>
                  <th class="text-right text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Review Time', 'وقت المراجعة') }}</th>
                  <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Submitted', 'تاريخ الإرسال') }}</th>
                </tr>
              </thead>
              <tbody>
                @for (item of items(); track item.id) {
                  <tr class="border-b border-th-border-lt hover:bg-th-bg-alt transition-colors">
                    <td class="px-4 py-3 font-mono text-xs text-th-text-2">{{ item.ticket_number }}</td>
                    <td class="px-4 py-3">
                      <p class="font-medium text-th-text">{{ item.company_name }}</p>
                      <p class="text-xs text-th-text-3">{{ item.contact_name }}</p>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" [class]="slaClass(item.sla_status)">
                        {{ i18n.t(slaLabel(item.sla_status).en, slaLabel(item.sla_status).ar) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right text-sm font-medium" [class]="item.hours_to_review <= 24 ? 'text-emerald-600' : item.hours_to_review <= 48 ? 'text-amber-600' : 'text-red-600'">
                      {{ Math.round(item.hours_to_review) }}h
                    </td>
                    <td class="px-4 py-3 text-th-text-3 text-xs">{{ item.submitted_at | date:'mediumDate' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    }
  `,
})
export class PartnerSlaComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);
  Math = Math;

  items = signal<SlaItem[]>([]);
  summary = signal<SlaSummary>({ total: 0, on_track: 0, at_risk: 0, breached: 0, avg_review_hours: 0 });
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.api.getSla().subscribe({
      next: res => { this.items.set(res.data); this.summary.set(res.summary); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  slaClass(status: string): string {
    const map: Record<string, string> = {
      on_track: 'bg-emerald-100 text-emerald-700',
      at_risk: 'bg-amber-100 text-amber-700',
      breached: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-th-bg-tert text-th-text-2';
  }

  slaLabel(status: string): { en: string; ar: string } {
    const map: Record<string, { en: string; ar: string }> = {
      on_track: { en: 'On Track', ar: 'في المسار' },
      at_risk: { en: 'At Risk', ar: 'في خطر' },
      breached: { en: 'Breached', ar: 'منتهك' },
    };
    return map[status] || { en: status, ar: status };
  }
}
