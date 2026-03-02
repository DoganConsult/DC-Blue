import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApiService } from '../../../core/services/client-api.service';
import { ClientDashboard } from '../../../core/models/client.models';

@Component({
  selector: 'app-workspace-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    } @else if (error()) {
      <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{{ error() }}</div>
    } @else {
      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @for (card of kpiCards(); track card.label) {
          <div class="bg-th-card border border-th-border rounded-xl p-4 hover:border-primary/30 transition">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center text-sm" [class]="card.iconBg">
                <span [innerHTML]="card.icon"></span>
              </div>
              <span class="text-th-text-3 text-xs font-medium">{{ card.label }}</span>
            </div>
            <div class="text-2xl font-bold text-th-text">{{ card.value }}</div>
            @if (card.sub) {
              <div class="text-th-text-3 text-xs mt-1">{{ card.sub }}</div>
            }
          </div>
        }
      </div>

      <!-- Quick Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Pipeline Summary -->
        <div class="bg-th-card border border-th-border rounded-xl p-5">
          <h3 class="text-sm font-semibold mb-3">Pipeline</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">Active Opportunities</span>
              <span class="font-semibold">{{ stats()?.opportunities?.active || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">Total Value</span>
              <span class="font-semibold">{{ formatCurrency(stats()?.opportunities?.total_value || 0) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">Active Tenders</span>
              <span class="font-semibold">{{ stats()?.tenders_active || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Projects Summary -->
        <div class="bg-th-card border border-th-border rounded-xl p-5">
          <h3 class="text-sm font-semibold mb-3">Projects & Deliverables</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">Active Projects</span>
              <span class="font-semibold">{{ stats()?.projects?.active || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">Upcoming Demos</span>
              <span class="font-semibold">{{ stats()?.demos_upcoming || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">Total Inquiries</span>
              <span class="font-semibold">{{ stats()?.inquiries || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Contracts & Renewals -->
        <div class="bg-th-card border border-th-border rounded-xl p-5">
          <h3 class="text-sm font-semibold mb-3">Contracts & Renewals</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">Active Contracts</span>
              <span class="font-semibold">{{ stats()?.contracts?.active || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">Expiring Soon</span>
              <span class="font-semibold" [class.text-amber-600]="(stats()?.contracts?.expiring_soon || 0) > 0">{{ stats()?.contracts?.expiring_soon || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">Unread Messages</span>
              <span class="font-semibold" [class.text-primary]="(stats()?.unread_messages || 0) > 0">{{ stats()?.unread_messages || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lifecycle Flow -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <h3 class="text-sm font-semibold mb-4">Business Lifecycle</h3>
        <div class="flex flex-wrap gap-1.5">
          @for (stage of pipelineStages; track stage.key) {
            <div class="flex items-center gap-1.5">
              <span class="px-3 py-1.5 rounded-lg text-xs font-medium border" [class]="stage.class">
                {{ stage.label }}
              </span>
              @if (!$last) {
                <svg class="w-4 h-4 text-th-text-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class WorkspaceOverviewComponent implements OnInit {
  private api = inject(ClientApiService);

  loading = signal(true);
  error = signal<string | null>(null);
  stats = signal<ClientDashboard | null>(null);

  pipelineStages = [
    { key: 'lead', label: 'Lead', class: 'bg-slate-100 text-slate-700 border-slate-200' },
    { key: 'qualified', label: 'Qualified', class: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'demo', label: 'Demo', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { key: 'poc', label: 'POC', class: 'bg-violet-50 text-violet-700 border-violet-200' },
    { key: 'tender', label: 'Tender', class: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'proposal', label: 'Proposal', class: 'bg-pink-50 text-pink-700 border-pink-200' },
    { key: 'negotiation', label: 'Negotiation', class: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'won', label: 'Won', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'implementation', label: 'Implementation', class: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { key: 'maintenance', label: 'Maintenance', class: 'bg-teal-50 text-teal-700 border-teal-200' },
  ];

  kpiCards = signal<{ label: string; value: string | number; sub?: string; icon: string; iconBg: string }[]>([]);

  ngOnInit() {
    this.api.getDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.kpiCards.set([
          { label: 'Inquiries', value: data.inquiries, icon: '&#128196;', iconBg: 'bg-sky-100' },
          { label: 'Active Pipeline', value: data.opportunities.active, sub: this.formatCurrency(data.opportunities.total_value) + ' total', icon: '&#128200;', iconBg: 'bg-emerald-100' },
          { label: 'Projects', value: data.projects.active, sub: `${data.projects.total} total`, icon: '&#128736;', iconBg: 'bg-violet-100' },
          { label: 'Contracts', value: data.contracts.active, sub: data.contracts.expiring_soon > 0 ? `${data.contracts.expiring_soon} expiring soon` : 'All good', icon: '&#128203;', iconBg: 'bg-amber-100' },
          { label: 'Tenders', value: data.tenders_active, icon: '&#128220;', iconBg: 'bg-purple-100' },
          { label: 'Demos & POC', value: data.demos_upcoming, sub: 'upcoming', icon: '&#127916;', iconBg: 'bg-indigo-100' },
          { label: 'Messages', value: data.unread_messages, sub: 'unread', icon: '&#128172;', iconBg: 'bg-pink-100' },
          { label: 'Notifications', value: data.unread_notifications, sub: 'unread', icon: '&#128276;', iconBg: 'bg-orange-100' },
        ]);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load dashboard');
        this.loading.set(false);
      },
    });
  }

  formatCurrency(val: number): string {
    if (!val) return 'SAR 0';
    if (val >= 1000000) return `SAR ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `SAR ${(val / 1000).toFixed(0)}K`;
    return `SAR ${val.toFixed(0)}`;
  }
}
