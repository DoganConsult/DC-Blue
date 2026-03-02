import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../../core/services/admin-api.service';

interface Commission {
  id: string;
  partner_id: string;
  partner_company: string;
  partner_email: string;
  opportunity_id: string;
  opportunity_title: string;
  client_company: string;
  ticket_number: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
  paid_at: string | null;
}

@Component({
  selector: 'admin-commission-approval',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-1">Commission Approval</h2>
      <p class="text-th-text-3 text-sm">Review, approve, and track partner commissions.</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <p class="text-2xl font-bold text-amber-400">{{ summary().pending | number:'1.0-0' }} <span class="text-sm font-normal text-th-text-3">SAR</span></p>
        <p class="text-th-text-3 text-sm mt-1">Pending</p>
      </div>
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <p class="text-2xl font-bold text-emerald-400">{{ summary().approved | number:'1.0-0' }} <span class="text-sm font-normal text-th-text-3">SAR</span></p>
        <p class="text-th-text-3 text-sm mt-1">Approved</p>
      </div>
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <p class="text-2xl font-bold text-sky-400">{{ summary().paid | number:'1.0-0' }} <span class="text-sm font-normal text-th-text-3">SAR</span></p>
        <p class="text-th-text-3 text-sm mt-1">Paid</p>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-5">
      @for (f of filterTabs; track f.value) {
        <button (click)="setFilter(f.value)" class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
                [class.bg-primary]="filter() === f.value" [class.text-white]="filter() === f.value"
                [class.bg-th-bg-tert]="filter() !== f.value" [class.text-th-text-3]="filter() !== f.value">
          {{ f.label }}
        </button>
      }
    </div>

    <!-- Table -->
    <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
      @if (loading()) {
        <div class="p-8 text-center text-th-text-3 text-sm">Loading commissions...</div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-th-border text-th-text-3">
                <th class="text-left font-medium px-4 py-3">Partner</th>
                <th class="text-left font-medium px-4 py-3">Client / Deal</th>
                <th class="text-right font-medium px-4 py-3">Amount</th>
                <th class="text-left font-medium px-4 py-3">Status</th>
                <th class="text-left font-medium px-4 py-3">Date</th>
                <th class="text-left font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (c of commissions(); track c.id) {
                <tr class="border-b border-th-border/50 hover:bg-th-bg-tert/50">
                  <td class="px-4 py-3">
                    <p class="font-medium">{{ c.partner_company }}</p>
                    <p class="text-th-text-3 text-xs">{{ c.partner_email }}</p>
                  </td>
                  <td class="px-4 py-3">
                    <p class="font-medium">{{ c.client_company || '—' }}</p>
                    <p class="text-th-text-3 text-xs">{{ c.opportunity_title || c.ticket_number || '—' }}</p>
                  </td>
                  <td class="px-4 py-3 text-right font-mono">
                    {{ c.amount | number:'1.0-0' }} {{ c.currency || 'SAR' }}
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium" [class]="statusClass(c.status)">{{ c.status }}</span>
                  </td>
                  <td class="px-4 py-3 text-th-text-3 text-xs">{{ c.created_at | date:'mediumDate' }}</td>
                  <td class="px-4 py-3">
                    @if (c.status === 'pending') {
                      <button (click)="updateStatus(c.id, 'approved')" [disabled]="actionPending()"
                              class="mr-2 px-2.5 py-1 rounded bg-emerald-600/80 text-white text-xs hover:bg-emerald-600 transition disabled:opacity-50">Approve</button>
                    }
                    @if (c.status === 'approved') {
                      <button (click)="updateStatus(c.id, 'paid')" [disabled]="actionPending()"
                              class="mr-2 px-2.5 py-1 rounded bg-sky-600/80 text-white text-xs hover:bg-sky-600 transition disabled:opacity-50">Mark Paid</button>
                    }
                    @if (c.status !== 'paid') {
                      <button (click)="updateStatus(c.id, 'pending')" [disabled]="actionPending() || c.status === 'pending'"
                              class="px-2.5 py-1 rounded bg-th-bg-tert text-th-text-3 text-xs hover:text-th-text transition disabled:opacity-30">Revert</button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="6" class="px-4 py-10 text-center text-th-text-3">No commissions found</td></tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <!-- Pagination -->
    @if (total() > commissions().length) {
      <div class="flex items-center justify-between mt-4 text-sm text-th-text-3">
        <span>Showing {{ commissions().length }} of {{ total() }}</span>
        <div class="flex gap-2">
          <button (click)="prevPage()" [disabled]="page() <= 1"
                  class="px-3 py-1 rounded bg-th-bg-tert disabled:opacity-30 transition">Prev</button>
          <button (click)="nextPage()" [disabled]="commissions().length < 25"
                  class="px-3 py-1 rounded bg-th-bg-tert disabled:opacity-30 transition">Next</button>
        </div>
      </div>
    }
  `,
})
export class AdminCommissionApprovalComponent implements OnInit {
  private api = inject(AdminApiService);

  commissions = signal<Commission[]>([]);
  total = signal(0);
  page = signal(1);
  filter = signal<string>('');
  loading = signal(false);
  actionPending = signal(false);

  summary = signal<{ pending: number; approved: number; paid: number }>({ pending: 0, approved: 0, paid: 0 });

  filterTabs = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'paid', label: 'Paid' },
  ];

  ngOnInit() {
    this.loadCommissions();
    this.loadSummary();
  }

  setFilter(status: string) {
    this.filter.set(status);
    this.page.set(1);
    this.loadCommissions();
  }

  loadCommissions() {
    this.loading.set(true);
    const params: Record<string, string> = { page: String(this.page()), limit: '25' };
    if (this.filter()) params['status'] = this.filter();
    this.api.getCommissions(params).subscribe({
      next: (r: any) => {
        this.commissions.set(r.data);
        this.total.set(r.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadSummary() {
    this.api.getCommissionSummary().subscribe({
      next: (s) => this.summary.set({ pending: s.pending, approved: s.approved, paid: s.paid }),
      error: () => {},
    });
  }

  updateStatus(id: string, status: string) {
    this.actionPending.set(true);
    this.api.updateCommission(id, { status }).subscribe({
      next: () => {
        this.actionPending.set(false);
        this.loadCommissions();
        this.loadSummary();
      },
      error: () => this.actionPending.set(false),
    });
  }

  statusClass(s: string): string {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-emerald-100 text-emerald-700',
      paid: 'bg-sky-100 text-sky-700',
    };
    return map[s] || 'bg-th-card/10 text-th-text/60';
  }

  prevPage() { if (this.page() > 1) { this.page.set(this.page() - 1); this.loadCommissions(); } }
  nextPage() { this.page.set(this.page() + 1); this.loadCommissions(); }
}
