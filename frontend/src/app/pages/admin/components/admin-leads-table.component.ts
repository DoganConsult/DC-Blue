import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { LeadRow } from '../../../core/models/admin.models';

@Component({
  selector: 'admin-leads-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <h2 class="text-xl font-bold">Leads</h2>
      <div class="flex items-center gap-3">
        <input [(ngModel)]="searchQuery" placeholder="Search name, email, company..."
               (keyup.enter)="loadLeads()"
               class="bg-th-card border border-th-border-dk text-th-text placeholder-th-text-3 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary" />
        <select [(ngModel)]="statusFilter" (change)="loadLeads()"
                class="bg-th-card border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="qualified">Qualified</option>
          <option value="contacted">Contacted</option>
          <option value="proposal">Proposal</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
        <button (click)="loadLeads()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition">
          Search
        </button>
        <button (click)="exportCsv()" [disabled]="exporting()" class="px-4 py-2 rounded-lg bg-th-bg-tert text-th-text text-sm font-medium hover:bg-th-bg-tert/80 transition disabled:opacity-50">
          {{ exporting() ? 'Exporting...' : 'Export CSV' }}
        </button>
      </div>
    </div>

    <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-th-border text-th-text-3">
              <th class="text-left font-medium px-4 py-3">Ticket</th>
              <th class="text-left font-medium px-4 py-3">Contact</th>
              <th class="text-left font-medium px-4 py-3">Company</th>
              <th class="text-left font-medium px-4 py-3">Service</th>
              <th class="text-left font-medium px-4 py-3">Status</th>
              <th class="text-left font-medium px-4 py-3">Assigned</th>
              <th class="text-left font-medium px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            @for (lead of leads(); track lead.id) {
              <tr class="border-b border-th-border/50 hover:bg-th-bg-tert/50 cursor-pointer transition"
                  (click)="router.navigate(['/admin/leads', lead.id])">
                <td class="px-4 py-3 font-mono text-xs text-gold">{{ lead.ticket_number }}</td>
                <td class="px-4 py-3">
                  <p class="font-medium">{{ lead.contact_name }}</p>
                  <p class="text-th-text-3 text-xs">{{ lead.contact_email }}</p>
                </td>
                <td class="px-4 py-3 text-th-text-3">{{ lead.company_name }}</td>
                <td class="px-4 py-3 text-th-text-3">{{ lead.product_line || '—' }}</td>
                <td class="px-4 py-3">
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium" [class]="statusClass(lead.status)">{{ lead.status }}</span>
                </td>
                <td class="px-4 py-3 text-th-text-3 text-xs">{{ lead.assigned_to }}</td>
                <td class="px-4 py-3 text-th-text-3 text-xs">{{ lead.created_at | date:'mediumDate' }}</td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="px-4 py-10 text-center text-th-text-3">No leads found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (totalLeads() > leads().length) {
      <div class="flex items-center justify-between mt-4 text-sm text-th-text-3">
        <span>Showing {{ leads().length }} of {{ totalLeads() }}</span>
        <div class="flex gap-2">
          <button (click)="prevPage()" [disabled]="currentPage() <= 1"
                  class="px-3 py-1 rounded bg-th-bg-tert hover:bg-th-bg-tert disabled:opacity-30 transition">Prev</button>
          <button (click)="nextPage()" [disabled]="leads().length < 25"
                  class="px-3 py-1 rounded bg-th-bg-tert hover:bg-th-bg-tert disabled:opacity-30 transition">Next</button>
        </div>
      </div>
    }
  `,
})
export class AdminLeadsTableComponent {
  private api = inject(AdminApiService);
  router = inject(Router);

  leads = signal<LeadRow[]>([]);
  totalLeads = signal(0);
  currentPage = signal(1);
  searchQuery = '';
  statusFilter = '';
  exporting = signal(false);

  sessionExpired = output<void>();

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    const params: Record<string, string> = { page: String(this.currentPage()), limit: '25' };
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.searchQuery.trim()) params['search'] = this.searchQuery.trim();

    this.api.getLeads(params).subscribe({
      next: (r) => { this.leads.set(r.data); this.totalLeads.set(r.total); },
      error: (err) => { if (err.status === 401) this.sessionExpired.emit(); },
    });
  }

  statusClass(s: string): string {
    const map: Record<string, string> = {
      new: 'bg-sky-100 text-sky-700',
      qualified: 'bg-purple-100 text-purple-700',
      contacted: 'bg-amber-100 text-amber-700',
      proposal: 'bg-indigo-100 text-indigo-700',
      won: 'bg-emerald-100 text-emerald-700',
      lost: 'bg-red-100 text-red-700',
      duplicate: 'bg-gray-100 text-gray-500',
      spam: 'bg-red-100 text-red-600',
    };
    return map[s] || 'bg-th-card/10 text-th-text/60';
  }

  exportCsv() {
    this.exporting.set(true);
    const params: Record<string, string> = {};
    if (this.statusFilter) params['status'] = this.statusFilter;
    this.api.exportLeads(params).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.exporting.set(false);
      },
      error: () => this.exporting.set(false),
    });
  }

  prevPage() { if (this.currentPage() > 1) { this.currentPage.set(this.currentPage() - 1); this.loadLeads(); } }
  nextPage() { this.currentPage.set(this.currentPage() + 1); this.loadLeads(); }
}
