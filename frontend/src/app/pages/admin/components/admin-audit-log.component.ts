import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';

interface AuditEntry {
  id: string;
  user_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  created_at: string;
}

@Component({
  selector: 'admin-audit-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <h2 class="text-xl font-bold">Audit Log</h2>
      <div class="flex items-center gap-2 flex-wrap">
        <input [(ngModel)]="searchQuery" placeholder="Search..."
               (keyup.enter)="loadLogs()"
               class="bg-th-card border border-th-border-dk text-th-text placeholder-th-text-3 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-primary" />
        <select [(ngModel)]="entityFilter" (change)="loadLogs()"
                class="bg-th-card border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All entities</option>
          @for (e of entityTypes(); track e) {
            <option [value]="e">{{ e }}</option>
          }
        </select>
        <select [(ngModel)]="actionFilter" (change)="loadLogs()"
                class="bg-th-card border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All actions</option>
          @for (a of actions(); track a) {
            <option [value]="a">{{ a }}</option>
          }
        </select>
        <button (click)="loadLogs()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition">Search</button>
      </div>
    </div>

    <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-th-border text-th-text-3">
              <th class="text-left font-medium px-4 py-3">Time</th>
              <th class="text-left font-medium px-4 py-3">User</th>
              <th class="text-left font-medium px-4 py-3">Action</th>
              <th class="text-left font-medium px-4 py-3">Entity</th>
              <th class="text-left font-medium px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            @for (entry of logs(); track entry.id) {
              <tr class="border-b border-th-border/50 hover:bg-th-bg-tert/50 transition cursor-pointer"
                  (click)="toggleExpanded(entry.id)">
                <td class="px-4 py-3 text-xs font-mono text-th-text-3 whitespace-nowrap">{{ entry.created_at | date:'short' }}</td>
                <td class="px-4 py-3 text-xs">{{ entry.user_email || 'System' }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium" [ngClass]="getActionClass(entry.action)">{{ entry.action }}</span>
                </td>
                <td class="px-4 py-3 text-xs">
                  <span class="text-th-text-3">{{ entry.entity_type }}</span>
                  @if (entry.entity_id) {
                    <span class="text-gold font-mono ml-1">#{{ entry.entity_id | slice:0:8 }}</span>
                  }
                </td>
                <td class="px-4 py-3 text-xs text-th-text-3">
                  @if (entry.ip_address) {
                    <span class="font-mono">{{ entry.ip_address }}</span>
                  }
                </td>
              </tr>
              @if (expandedId() === entry.id) {
                <tr>
                  <td colspan="5" class="px-4 py-4 bg-th-bg-tert/30">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      @if (entry.old_values) {
                        <div>
                          <p class="text-xs font-semibold text-red-400 mb-1">Old Values</p>
                          <pre class="text-xs font-mono bg-th-bg p-3 rounded-lg overflow-auto max-h-48 text-th-text-3">{{ formatJson(entry.old_values) }}</pre>
                        </div>
                      }
                      @if (entry.new_values) {
                        <div>
                          <p class="text-xs font-semibold text-emerald-400 mb-1">New Values</p>
                          <pre class="text-xs font-mono bg-th-bg p-3 rounded-lg overflow-auto max-h-48 text-th-text-3">{{ formatJson(entry.new_values) }}</pre>
                        </div>
                      }
                      @if (!entry.old_values && !entry.new_values) {
                        <p class="text-th-text-3 text-xs">No change data recorded</p>
                      }
                    </div>
                  </td>
                </tr>
              }
            } @empty {
              <tr><td colspan="5" class="px-4 py-10 text-center text-th-text-3">No audit entries found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (total() > logs().length) {
      <div class="flex items-center justify-between mt-4 text-sm text-th-text-3">
        <span>Showing {{ logs().length }} of {{ total() }}</span>
        <div class="flex gap-2">
          <button (click)="prevPage()" [disabled]="currentPage() <= 1"
                  class="px-3 py-1 rounded bg-th-bg-tert hover:bg-th-bg-tert disabled:opacity-30 transition">Prev</button>
          <button (click)="nextPage()" [disabled]="logs().length < pageSize"
                  class="px-3 py-1 rounded bg-th-bg-tert hover:bg-th-bg-tert disabled:opacity-30 transition">Next</button>
        </div>
      </div>
    }
  `,
})
export class AdminAuditLogComponent implements OnInit {
  private api = inject(AdminApiService);

  logs = signal<AuditEntry[]>([]);
  total = signal(0);
  currentPage = signal(1);
  expandedId = signal<string | null>(null);
  pageSize = 50;

  entityTypes = signal<string[]>([]);
  actions = signal<string[]>([]);

  searchQuery = '';
  entityFilter = '';
  actionFilter = '';

  ngOnInit() {
    this.loadLogs();
    this.api.getAuditFilters().subscribe({
      next: (r) => { this.entityTypes.set(r.entity_types); this.actions.set(r.actions); },
      error: () => {},
    });
  }

  loadLogs() {
    const params: Record<string, string> = {
      limit: String(this.pageSize),
      offset: String((this.currentPage() - 1) * this.pageSize),
    };
    if (this.entityFilter) params['entity_type'] = this.entityFilter;
    if (this.actionFilter) params['action'] = this.actionFilter;
    if (this.searchQuery.trim()) params['search'] = this.searchQuery.trim();

    this.api.getAuditLogs(params).subscribe({
      next: (r) => { this.logs.set(r.data); this.total.set(r.total); },
      error: () => {},
    });
  }

  toggleExpanded(id: string) {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  getActionClass(action: string): string {
    if (action.startsWith('create') || action === 'insert') return 'bg-emerald-500/20 text-emerald-400';
    if (action.startsWith('update') || action.startsWith('edit') || action === 'status_change') return 'bg-amber-500/20 text-amber-400';
    if (action.startsWith('delete') || action === 'remove') return 'bg-red-500/20 text-red-400';
    if (action.startsWith('login') || action === 'auth') return 'bg-sky-500/20 text-sky-400';
    return 'bg-th-bg-tert text-th-text-3';
  }

  formatJson(val: any): string {
    if (!val) return '';
    try {
      return JSON.stringify(typeof val === 'string' ? JSON.parse(val) : val, null, 2);
    } catch {
      return String(val);
    }
  }

  prevPage() { if (this.currentPage() > 1) { this.currentPage.set(this.currentPage() - 1); this.loadLogs(); } }
  nextPage() { this.currentPage.set(this.currentPage() + 1); this.loadLogs(); }
}
