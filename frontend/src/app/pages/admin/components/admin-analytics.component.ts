import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';

@Component({
  selector: 'admin-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Date Range Selector -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">Analytics</h2>
      <select [(ngModel)]="selectedDays" (change)="loadAll()" class="bg-th-card border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
        <option value="180">Last 180 days</option>
        <option value="365">Last year</option>
      </select>
    </div>

    <!-- Sub-tab Nav -->
    <div class="flex gap-2 mb-6 overflow-x-auto">
      @for (tab of subTabs; track tab.key) {
        <button (click)="activeSubTab.set(tab.key)"
                class="px-4 py-2 text-sm rounded-lg transition whitespace-nowrap"
                [class.bg-primary]="activeSubTab() === tab.key"
                [class.text-white]="activeSubTab() === tab.key"
                [class.bg-th-bg-tert]="activeSubTab() !== tab.key"
                [class.text-th-text-3]="activeSubTab() !== tab.key">
          {{ tab.label }}
        </button>
      }
    </div>

    @if (loading()) {
      <div class="text-center py-12 text-th-text-3">Loading analytics...</div>
    } @else {
      @switch (activeSubTab()) {
        @case ('pipeline') {
          <!-- Pipeline KPI Cards -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-4">
              <p class="text-2xl font-bold">{{ pipelineTotals()?.total || 0 }}</p>
              <p class="text-th-text-3 text-xs mt-1">Total Opportunities</p>
            </div>
            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-4">
              <p class="text-2xl font-bold text-primary">{{ formatCurrency(pipelineTotals()?.total_value) }}</p>
              <p class="text-th-text-3 text-xs mt-1">Pipeline Value</p>
            </div>
            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-4">
              <p class="text-2xl font-bold text-amber-600">{{ formatCurrency(pipelineTotals()?.weighted_value) }}</p>
              <p class="text-th-text-3 text-xs mt-1">Weighted Value</p>
            </div>
            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-4">
              <p class="text-2xl font-bold text-emerald-600">{{ pipelineTotals()?.win_rate || 0 }}%</p>
              <p class="text-th-text-3 text-xs mt-1">Win Rate</p>
            </div>
            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-4">
              <p class="text-2xl font-bold text-sky-600">{{ formatCurrency(pipelineTotals()?.avg_deal) }}</p>
              <p class="text-th-text-3 text-xs mt-1">Avg Deal Size</p>
            </div>
          </div>

          <!-- Pipeline Funnel -->
          <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-6 mb-6">
            <h3 class="font-semibold mb-4">Pipeline Funnel</h3>
            <div class="space-y-3">
              @for (stage of pipelineStages(); track stage.stage) {
                <div class="flex items-center gap-4">
                  <span class="w-28 text-sm text-th-text-3 capitalize">{{ formatStage(stage.stage) }}</span>
                  <div class="flex-1 bg-th-bg-tert rounded-full h-8 overflow-hidden relative">
                    <div class="h-full rounded-full transition-all duration-500" [ngClass]="getStageBarClass(stage.stage)"
                         [style.width.%]="getBarWidth(+stage.opportunity_count)">
                    </div>
                    <span class="absolute inset-0 flex items-center justify-center text-xs font-mono text-th-text">
                      {{ stage.opportunity_count }} deals · {{ formatCurrency(stage.total_value) }}
                    </span>
                  </div>
                </div>
              } @empty {
                <p class="text-th-text-3 text-sm text-center py-4">No pipeline data</p>
              }
            </div>
          </div>
        }

        @case ('leads') {
          <!-- Lead Status Breakdown -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-6">
              <h3 class="font-semibold mb-4">By Status</h3>
              <div class="space-y-2">
                @for (s of leadsByStatus(); track s.status) {
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full" [ngClass]="getStatusDotClass(s.status)"></span>
                      <span class="text-sm capitalize">{{ s.status }}</span>
                    </div>
                    <span class="text-sm font-mono text-th-text-3">{{ s.cnt }}</span>
                  </div>
                } @empty {
                  <p class="text-th-text-3 text-sm">No data</p>
                }
              </div>
            </div>

            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-6">
              <h3 class="font-semibold mb-4">By Source</h3>
              <div class="space-y-2">
                @for (s of leadsBySource(); track s.source) {
                  <div class="flex items-center justify-between">
                    <span class="text-sm capitalize">{{ s.source }}</span>
                    <span class="text-sm font-mono text-th-text-3">{{ s.cnt }}</span>
                  </div>
                } @empty {
                  <p class="text-th-text-3 text-sm">No data</p>
                }
              </div>
            </div>
          </div>

          <!-- Product Line Performance -->
          <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-6 mb-6">
            <h3 class="font-semibold mb-4">Product Line Performance</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-th-border text-th-text-3">
                    <th class="text-left font-medium px-3 py-2">Product Line</th>
                    <th class="text-right font-medium px-3 py-2">Leads</th>
                    <th class="text-right font-medium px-3 py-2">Won</th>
                    <th class="text-right font-medium px-3 py-2">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of leadsByProduct(); track p.product_line) {
                    <tr class="border-b border-th-border/50">
                      <td class="px-3 py-2">{{ p.product_line }}</td>
                      <td class="px-3 py-2 text-right font-mono">{{ p.cnt }}</td>
                      <td class="px-3 py-2 text-right font-mono text-emerald-600">{{ p.won }}</td>
                      <td class="px-3 py-2 text-right font-mono">{{ p.avg_score || '—' }}</td>
                    </tr>
                  } @empty {
                    <tr><td colspan="4" class="px-3 py-6 text-center text-th-text-3">No data</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Monthly Trend -->
          <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-6">
            <h3 class="font-semibold mb-4">Monthly Lead Trend</h3>
            <div class="space-y-2">
              @for (m of monthlyTrend(); track m.month) {
                <div class="flex items-center gap-4">
                  <span class="w-20 text-xs font-mono text-th-text-3">{{ m.month }}</span>
                  <div class="flex-1 flex items-center gap-1">
                    <div class="bg-sky-500/60 rounded h-5 transition-all" [style.width.%]="getTrendWidth(+m.total, 'total')">
                      <span class="px-2 text-[10px] text-white leading-5">{{ m.total }}</span>
                    </div>
                    @if (+m.qualified > 0) {
                      <div class="bg-purple-500/60 rounded h-5 transition-all" [style.width.%]="getTrendWidth(+m.qualified, 'qual')">
                        <span class="px-1 text-[10px] text-white leading-5">{{ m.qualified }}q</span>
                      </div>
                    }
                    @if (+m.won > 0) {
                      <div class="bg-emerald-500/60 rounded h-5 transition-all" [style.width.%]="getTrendWidth(+m.won, 'won')">
                        <span class="px-1 text-[10px] text-white leading-5">{{ m.won }}w</span>
                      </div>
                    }
                  </div>
                </div>
              } @empty {
                <p class="text-th-text-3 text-sm text-center py-4">No trend data</p>
              }
            </div>
            @if (monthlyTrend().length > 0) {
              <div class="flex items-center gap-4 mt-4 text-xs text-th-text-3">
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-sky-500/60"></span> Total</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-purple-500/60"></span> Qualified</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-emerald-500/60"></span> Won</span>
              </div>
            }
          </div>
        }

        @case ('revenue') {
          <!-- Commission Totals -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            @for (c of commissionsByStatus(); track c.status) {
              <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-5">
                <p class="text-2xl font-bold" [ngClass]="getCommStatusTextClass(c.status)">{{ formatCurrency(c.total) }}</p>
                <p class="text-th-text-3 text-xs mt-1 capitalize">{{ c.status }} ({{ c.cnt }})</p>
              </div>
            }
          </div>

          <!-- Monthly Revenue Trend -->
          <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-6 mb-6">
            <h3 class="font-semibold mb-4">Monthly Revenue</h3>
            <div class="space-y-2">
              @for (m of monthlyRevenue(); track m.month) {
                <div class="flex items-center gap-4">
                  <span class="w-20 text-xs font-mono text-th-text-3">{{ m.month }}</span>
                  <div class="flex-1 bg-th-bg-tert rounded-full h-6 overflow-hidden relative">
                    <div class="h-full bg-emerald-500/50 rounded-full transition-all" [style.width.%]="getRevenueWidth(+m.won_value)"></div>
                    <span class="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-th-text">
                      {{ m.won_deals }} won · {{ formatCurrency(m.won_value) }}
                    </span>
                  </div>
                </div>
              } @empty {
                <p class="text-th-text-3 text-sm text-center py-4">No revenue data</p>
              }
            </div>
          </div>

          <!-- Partner Contribution -->
          <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-6">
            <h3 class="font-semibold mb-4">Top Partner Commissions</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-th-border text-th-text-3">
                    <th class="text-left font-medium px-3 py-2">Partner</th>
                    <th class="text-left font-medium px-3 py-2">Tier</th>
                    <th class="text-right font-medium px-3 py-2">Deals</th>
                    <th class="text-right font-medium px-3 py-2">Total</th>
                    <th class="text-right font-medium px-3 py-2">Paid</th>
                    <th class="text-right font-medium px-3 py-2">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of partnerContribution(); track p.company_name) {
                    <tr class="border-b border-th-border/50">
                      <td class="px-3 py-2 font-medium">{{ p.company_name }}</td>
                      <td class="px-3 py-2"><span class="px-2 py-0.5 rounded-full text-xs bg-th-bg-tert text-th-text-3">{{ p.tier || '—' }}</span></td>
                      <td class="px-3 py-2 text-right font-mono">{{ p.commission_count }}</td>
                      <td class="px-3 py-2 text-right font-mono">{{ formatCurrency(p.total_commission) }}</td>
                      <td class="px-3 py-2 text-right font-mono text-emerald-600">{{ formatCurrency(p.paid_amount) }}</td>
                      <td class="px-3 py-2 text-right font-mono text-amber-600">{{ formatCurrency(p.pending_amount) }}</td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6" class="px-3 py-6 text-center text-th-text-3">No partner commission data</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        @case ('team') {
          <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-6">
            <h3 class="font-semibold mb-4">Team Performance</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-th-border text-th-text-3">
                    <th class="text-left font-medium px-3 py-2">Owner</th>
                    <th class="text-right font-medium px-3 py-2">Opportunities</th>
                    <th class="text-right font-medium px-3 py-2">Won</th>
                    <th class="text-right font-medium px-3 py-2">Win Rate</th>
                    <th class="text-right font-medium px-3 py-2">Avg Deal</th>
                    <th class="text-right font-medium px-3 py-2">Pipeline</th>
                    <th class="text-right font-medium px-3 py-2">Won Value</th>
                  </tr>
                </thead>
                <tbody>
                  @for (m of teamData(); track m.owner) {
                    <tr class="border-b border-th-border/50">
                      <td class="px-3 py-2 font-medium">{{ m.owner }}</td>
                      <td class="px-3 py-2 text-right font-mono">{{ m.opportunity_count }}</td>
                      <td class="px-3 py-2 text-right font-mono text-emerald-600">{{ m.won_count }}</td>
                      <td class="px-3 py-2 text-right font-mono">{{ m.win_rate || '—' }}%</td>
                      <td class="px-3 py-2 text-right font-mono">{{ formatCurrency(m.avg_deal_size) }}</td>
                      <td class="px-3 py-2 text-right font-mono text-sky-600">{{ formatCurrency(m.total_pipeline) }}</td>
                      <td class="px-3 py-2 text-right font-mono text-emerald-600">{{ formatCurrency(m.won_value) }}</td>
                    </tr>
                  } @empty {
                    <tr><td colspan="7" class="px-3 py-6 text-center text-th-text-3">No team performance data</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      }
    }
  `,
})
export class AdminAnalyticsComponent implements OnInit {
  private api = inject(AdminApiService);

  selectedDays = '90';
  loading = signal(false);
  activeSubTab = signal<'pipeline' | 'leads' | 'revenue' | 'team'>('pipeline');

  subTabs = [
    { key: 'pipeline' as const, label: 'Pipeline' },
    { key: 'leads' as const, label: 'Leads' },
    { key: 'revenue' as const, label: 'Revenue' },
    { key: 'team' as const, label: 'Team' },
  ];

  // Pipeline data
  pipelineStages = signal<any[]>([]);
  pipelineTotals = signal<any>(null);

  // Leads data
  leadsByStatus = signal<any[]>([]);
  leadsBySource = signal<any[]>([]);
  leadsByProduct = signal<any[]>([]);
  monthlyTrend = signal<any[]>([]);

  // Revenue data
  monthlyRevenue = signal<any[]>([]);
  partnerContribution = signal<any[]>([]);
  commissionsByStatus = signal<any[]>([]);

  // Team data
  teamData = signal<any[]>([]);

  private maxLeadCount = 0;
  private maxRevenueValue = 0;

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading.set(true);
    const days = this.selectedDays;

    this.api.getAnalyticsPipeline(days).subscribe({
      next: (r) => { this.pipelineStages.set(r.by_stage || []); this.pipelineTotals.set(r.totals || {}); },
      error: () => {},
    });

    this.api.getAnalyticsLeads(days).subscribe({
      next: (r) => {
        this.leadsByStatus.set(r.by_status || []);
        this.leadsBySource.set(r.by_source || []);
        this.leadsByProduct.set(r.by_product || []);
        this.monthlyTrend.set(r.monthly_trend || []);
        this.maxLeadCount = Math.max(1, ...((r.monthly_trend || []) as any[]).map((m: any) => +m.total));
      },
      error: () => {},
    });

    this.api.getAnalyticsRevenue(days).subscribe({
      next: (r) => {
        this.monthlyRevenue.set(r.monthly_revenue || []);
        this.partnerContribution.set(r.partner_contribution || []);
        this.commissionsByStatus.set(r.commissions_by_status || []);
        this.maxRevenueValue = Math.max(1, ...((r.monthly_revenue || []) as any[]).map((m: any) => +m.won_value));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.api.getAnalyticsTeam(days).subscribe({
      next: (r) => this.teamData.set(r.data || []),
      error: () => {},
    });
  }

  formatCurrency(val: any): string {
    const num = +val || 0;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M SAR`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K SAR`;
    return `${num.toLocaleString()} SAR`;
  }

  formatStage(s: string): string {
    return s?.replace(/_/g, ' ') || s;
  }

  getBarWidth(count: number): number {
    const max = Math.max(1, ...this.pipelineStages().map(s => +s.opportunity_count));
    return Math.max(5, (count / max) * 100);
  }

  getStageBarClass(stage: string): string {
    const map: Record<string, string> = {
      discovery: 'bg-sky-500/60',
      proposal: 'bg-purple-500/60',
      negotiation: 'bg-amber-500/60',
      closed_won: 'bg-emerald-500/60',
      closed_lost: 'bg-red-500/40',
    };
    return map[stage] || 'bg-th-bg-tert';
  }

  getStatusDotClass(status: string): string {
    const map: Record<string, string> = {
      new: 'bg-sky-400',
      qualified: 'bg-purple-400',
      contacted: 'bg-amber-400',
      proposal: 'bg-indigo-400',
      won: 'bg-emerald-400',
      lost: 'bg-red-400',
    };
    return map[status] || 'bg-th-text-3';
  }

  getTrendWidth(val: number, type: string): number {
    if (type === 'total') return Math.max(8, (val / this.maxLeadCount) * 60);
    return Math.max(5, (val / this.maxLeadCount) * 30);
  }

  getRevenueWidth(val: number): number {
    return Math.max(5, (val / this.maxRevenueValue) * 100);
  }

  getCommStatusTextClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'text-amber-600',
      approved: 'text-sky-600',
      paid: 'text-emerald-600',
    };
    return map[status] || 'text-th-text';
  }
}
