import { Component, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { Commission, CommissionSummary } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-commissions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Total Earned', 'إجمالي المكتسب') }}</p>
        <p class="text-2xl font-bold text-th-text">SAR {{ formatAmount(summary().total_earned) }}</p>
      </div>
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Pending Payout', 'في انتظار الدفع') }}</p>
        <p class="text-2xl font-bold text-amber-600">SAR {{ formatAmount(summary().pending + summary().approved) }}</p>
      </div>
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Paid to Date', 'المدفوع حتى الآن') }}</p>
        <p class="text-2xl font-bold text-emerald-600">SAR {{ formatAmount(summary().paid) }}</p>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-2 mb-4">
      @for (f of filters; track f.value) {
        <button (click)="activeFilter.set(f.value)"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                [class.bg-primary]="activeFilter() === f.value"
                [class.text-white]="activeFilter() === f.value"
                [class.bg-th-bg-tert]="activeFilter() !== f.value"
                [class.text-th-text-2]="activeFilter() !== f.value"
                [class.hover:bg-th-bg-tert]="activeFilter() !== f.value">
          {{ i18n.t(f.label.en, f.label.ar) }}
        </button>
      }
    </div>

    <!-- Commission Table -->
    @if (filteredCommissions().length > 0) {
      <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-th-border-lt bg-th-bg-alt">
                <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Client', 'العميل') }}</th>
                <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Deal', 'الصفقة') }}</th>
                <th class="text-right text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Amount', 'المبلغ') }}</th>
                <th class="text-center text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Status', 'الحالة') }}</th>
                <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Date', 'التاريخ') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (c of filteredCommissions(); track c.id) {
                <tr class="border-b border-th-border-lt hover:bg-th-bg-alt transition-colors">
                  <td class="px-4 py-3">
                    <p class="font-medium text-th-text">{{ c.client_company || '—' }}</p>
                    <p class="text-xs text-th-text-3">{{ c.ticket_number }}</p>
                  </td>
                  <td class="px-4 py-3 text-th-text-2">{{ c.opportunity_title || '—' }}</td>
                  <td class="px-4 py-3 text-right font-semibold text-th-text">SAR {{ formatAmount(c.amount) }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" [class]="statusClass(c.status)">
                      {{ i18n.t(statusLabel(c.status).en, statusLabel(c.status).ar) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-th-text-3 text-xs">{{ c.paid_at ? (c.paid_at | date:'mediumDate') : (c.created_at | date:'mediumDate') }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      @if (total() > 20) {
        <div class="flex items-center justify-between mt-4">
          <p class="text-sm text-th-text-3">
            {{ i18n.t('Showing', 'عرض') }} {{ filteredCommissions().length }} {{ i18n.t('of', 'من') }} {{ total() }}
          </p>
          <div class="flex gap-2">
            <button (click)="prevPage.emit()" [disabled]="page() <= 1"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium bg-th-bg-tert text-th-text-2 hover:bg-th-bg-tert disabled:opacity-40 transition-colors">
              {{ i18n.t('Previous', 'السابق') }}
            </button>
            <button (click)="nextPage.emit()" [disabled]="page() * 20 >= total()"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium bg-th-bg-tert text-th-text-2 hover:bg-th-bg-tert disabled:opacity-40 transition-colors">
              {{ i18n.t('Next', 'التالي') }}
            </button>
          </div>
        </div>
      }
    } @else {
      <!-- Empty State -->
      <div class="bg-th-card border border-th-border rounded-xl p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-th-bg-tert flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-th-text mb-2">{{ i18n.t('No Commissions Yet', 'لا توجد عمولات بعد') }}</h3>
        <p class="text-sm text-th-text-3 max-w-md mx-auto">
          {{ i18n.t(
            'Commissions are generated when your referred leads close as won deals. Submit leads to start earning.',
            'يتم إنشاء العمولات عندما يتم إغلاق العملاء المحالين كصفقات ناجحة. أرسل عملاء محتملين لبدء الكسب.'
          ) }}
        </p>
      </div>
    }
  `,
})
export class PartnerCommissionsComponent {
  i18n = inject(I18nService);

  commissions = input<Commission[]>([]);
  summary = input<CommissionSummary>({ total_earned: 0, pending: 0, approved: 0, paid: 0, currency: 'SAR' });
  total = input(0);
  page = input(1);

  prevPage = output<void>();
  nextPage = output<void>();

  activeFilter = signal<string>('all');

  readonly filters = [
    { value: 'all', label: { en: 'All', ar: 'الكل' } },
    { value: 'pending', label: { en: 'Pending', ar: 'معلق' } },
    { value: 'approved', label: { en: 'Approved', ar: 'معتمد' } },
    { value: 'paid', label: { en: 'Paid', ar: 'مدفوع' } },
  ];

  filteredCommissions = computed(() => {
    const f = this.activeFilter();
    if (f === 'all') return this.commissions();
    return this.commissions().filter(c => c.status === f);
  });

  formatAmount(n: number): string {
    return (n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  statusClass(s: string): string {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-primary/10 text-primary',
      paid: 'bg-emerald-100 text-emerald-700',
    };
    return map[s] || 'bg-th-bg-tert text-th-text-2';
  }

  statusLabel(s: string): { en: string; ar: string } {
    const map: Record<string, { en: string; ar: string }> = {
      pending: { en: 'Pending', ar: 'معلق' },
      approved: { en: 'Approved', ar: 'معتمد' },
      paid: { en: 'Paid', ar: 'مدفوع' },
    };
    return map[s] || { en: s, ar: s };
  }
}
