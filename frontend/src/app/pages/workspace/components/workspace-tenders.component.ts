import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApiService } from '../../../core/services/client-api.service';
import { I18nService } from '../../../core/services/i18n.service';
import { Tender } from '../../../core/models/client.models';

@Component({
  selector: 'app-workspace-tenders',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    } @else {
      <h2 class="text-lg font-bold mb-6">{{ i18n.t('Tenders', 'المناقصات') }} & Bids</h2>

      @if (tenders().length === 0) {
        <div class="bg-th-card border border-th-border rounded-xl p-10 text-center">
          <p class="text-th-text-3 text-sm">{{ i18n.t('No tenders yet', 'لا توجد مناقصات حتى الآن') }}. When an RFP or bid is created for your opportunity, it will appear here.</p>
        </div>
      } @else {
        <div class="grid gap-4">
          @for (t of tenders(); track t.id) {
            <div class="bg-th-card border border-th-border rounded-xl p-5 hover:border-primary/30 transition">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="font-semibold text-sm">{{ t.title }}</h3>
                  <p class="text-th-text-3 text-xs">{{ t.rfp_number ? 'RFP: ' + t.rfp_number : '' }} {{ t.issuing_entity ? '&middot; ' + t.issuing_entity : '' }}</p>
                </div>
                <span class="px-2 py-0.5 rounded text-xs font-medium" [class]="getTenderStatusClass(t.status)">{{ formatStatus(t.status) }}</span>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div><span class="text-th-text-3 block">{{ i18n.t('Type', 'النوع') }}</span>{{ formatStatus(t.tender_type) }}</div>
                <div><span class="text-th-text-3 block">{{ i18n.t('Budget Estimate', 'تقدير الميزانية') }}</span>{{ t.budget_estimate ? (t.currency + ' ' + t.budget_estimate) : '-' }}</div>
                <div><span class="text-th-text-3 block">{{ i18n.t('Deadline', 'الموعد النهائي') }}</span>{{ t.submission_deadline ? (t.submission_deadline | date:'mediumDate') : '-' }}</div>
                <div>
                  <span class="text-th-text-3 block">{{ i18n.t('Scores', 'الدرجات') }}</span>
                  {{ t.technical_score ? i18n.t('T', 'ت') + ': ' + t.technical_score : '-' }}
                  {{ t.financial_score ? ' / ' + i18n.t('F', 'م') + ': ' + t.financial_score : '' }}
                </div>
              </div>
              @if (t.opportunity_name) {
                <div class="mt-2 text-xs text-th-text-3">{{ i18n.t('Opportunity', 'الفرصة') }}: {{ t.opportunity_name }}</div>
              }
            </div>
          }
        </div>
      }
    }
  `,
})
export class WorkspaceTendersComponent implements OnInit {
  private api = inject(ClientApiService);
  i18n = inject(I18nService);
  loading = signal(true);
  tenders = signal<Tender[]>([]);

  ngOnInit() {
    this.api.getTenders().subscribe({
      next: (r) => { this.tenders.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  formatStatus(s: string): string {
    return s?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '-';
  }

  getTenderStatusClass(status: string): string {
    const map: Record<string, string> = {
      identified: 'bg-slate-100 text-slate-700',
      preparing: 'bg-blue-50 text-blue-700',
      submitted: 'bg-indigo-50 text-indigo-700',
      under_evaluation: 'bg-amber-50 text-amber-700',
      awarded: 'bg-emerald-50 text-emerald-700',
      lost: 'bg-red-50 text-red-700',
      cancelled: 'bg-gray-100 text-gray-500',
    };
    return map[status] || 'bg-gray-50 text-gray-700';
  }
}
