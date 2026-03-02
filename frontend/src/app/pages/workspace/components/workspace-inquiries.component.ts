import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApiService } from '../../../core/services/client-api.service';
import { ClientInquiry } from '../../../core/models/client.models';

@Component({
  selector: 'app-workspace-inquiries',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    } @else {
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold">My Inquiries</h2>
        <a href="/inquiry" class="px-4 py-2 bg-primary text-white text-xs rounded-lg hover:opacity-90 transition">New Inquiry</a>
      </div>

      @if (inquiries().length === 0) {
        <div class="bg-th-card border border-th-border rounded-xl p-10 text-center">
          <p class="text-th-text-3 text-sm mb-3">No inquiries yet.</p>
          <a href="/inquiry" class="text-primary text-sm hover:underline">Submit your first inquiry</a>
        </div>
      } @else {
        <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-th-border bg-th-bg-tert">
                <th class="text-left px-4 py-3 text-th-text-3 text-xs font-medium">Ticket</th>
                <th class="text-left px-4 py-3 text-th-text-3 text-xs font-medium">Company</th>
                <th class="text-left px-4 py-3 text-th-text-3 text-xs font-medium hidden md:table-cell">Product</th>
                <th class="text-left px-4 py-3 text-th-text-3 text-xs font-medium">Status</th>
                <th class="text-left px-4 py-3 text-th-text-3 text-xs font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              @for (inq of inquiries(); track inq.id) {
                <tr class="border-b border-th-border last:border-0 hover:bg-th-bg-tert/50 transition">
                  <td class="px-4 py-3 font-mono text-xs text-primary">{{ inq.ticket_number }}</td>
                  <td class="px-4 py-3">{{ inq.company_name || '-' }}</td>
                  <td class="px-4 py-3 hidden md:table-cell text-th-text-3">{{ inq.product_line || '-' }}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded text-xs font-medium" [class]="getStatusClass(inq.status)">{{ inq.status }}</span>
                  </td>
                  <td class="px-4 py-3 hidden lg:table-cell text-th-text-3 text-xs">{{ inq.created_at | date:'mediumDate' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (total() > inquiries().length) {
          <div class="mt-4 text-center">
            <button (click)="loadMore()" class="text-primary text-xs hover:underline">Load more</button>
          </div>
        }
      }
    }
  `,
})
export class WorkspaceInquiriesComponent implements OnInit {
  private api = inject(ClientApiService);

  loading = signal(true);
  inquiries = signal<ClientInquiry[]>([]);
  total = signal(0);
  page = 1;

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getInquiries({ page: String(this.page), limit: '20' }).subscribe({
      next: (r) => {
        this.inquiries.set([...this.inquiries(), ...r.data]);
        this.total.set(r.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadMore() {
    this.page++;
    this.load();
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      new: 'bg-blue-50 text-blue-700',
      qualified: 'bg-indigo-50 text-indigo-700',
      contacted: 'bg-amber-50 text-amber-700',
      proposal: 'bg-purple-50 text-purple-700',
      won: 'bg-emerald-50 text-emerald-700',
      lost: 'bg-red-50 text-red-700',
    };
    return map[status] || 'bg-gray-50 text-gray-700';
  }
}
