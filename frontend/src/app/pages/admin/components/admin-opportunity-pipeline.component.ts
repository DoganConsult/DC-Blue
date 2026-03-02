import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';

interface Opportunity {
  id: string;
  lead_intake_id: string;
  title: string;
  stage: string;
  estimated_value: number;
  currency: string;
  probability: number;
  owner: string | null;
  company_name: string;
  contact_name: string;
  ticket_number: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

const STAGES = ['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
const STAGE_LABELS: Record<string, string> = {
  discovery: 'Discovery', proposal: 'Proposal', negotiation: 'Negotiation',
  closed_won: 'Closed Won', closed_lost: 'Closed Lost',
};
const STAGE_COLORS: Record<string, string> = {
  discovery: 'border-sky-500', proposal: 'border-indigo-500', negotiation: 'border-amber-500',
  closed_won: 'border-emerald-500', closed_lost: 'border-red-500',
};

@Component({
  selector: 'admin-opportunity-pipeline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold mb-1">Opportunity Pipeline</h2>
        <p class="text-th-text-3 text-sm">Manage deals across stages. Click a card to view details.</p>
      </div>
      <div class="flex gap-2">
        <button (click)="viewMode.set('kanban')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
                [class.bg-primary]="viewMode()==='kanban'" [class.text-white]="viewMode()==='kanban'"
                [class.bg-th-bg-tert]="viewMode()!=='kanban'" [class.text-th-text-3]="viewMode()!=='kanban'">Kanban</button>
        <button (click)="viewMode.set('list')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
                [class.bg-primary]="viewMode()==='list'" [class.text-white]="viewMode()==='list'"
                [class.bg-th-bg-tert]="viewMode()!=='list'" [class.text-th-text-3]="viewMode()!=='list'">List</button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-th-card border border-th-border rounded-xl p-4">
        <p class="text-2xl font-bold">{{ totalOpps() }}</p>
        <p class="text-th-text-3 text-xs mt-1">Total Opportunities</p>
      </div>
      <div class="bg-th-card border border-th-border rounded-xl p-4">
        <p class="text-2xl font-bold text-sky-400">{{ totalValue() | number:'1.0-0' }} <span class="text-xs font-normal text-th-text-3">SAR</span></p>
        <p class="text-th-text-3 text-xs mt-1">Total Pipeline Value</p>
      </div>
      <div class="bg-th-card border border-th-border rounded-xl p-4">
        <p class="text-2xl font-bold text-amber-400">{{ weightedValue() | number:'1.0-0' }} <span class="text-xs font-normal text-th-text-3">SAR</span></p>
        <p class="text-th-text-3 text-xs mt-1">Weighted Value</p>
      </div>
      <div class="bg-th-card border border-th-border rounded-xl p-4">
        <p class="text-2xl font-bold text-emerald-400">{{ stageCount('closed_won') }}</p>
        <p class="text-th-text-3 text-xs mt-1">Closed Won</p>
      </div>
    </div>

    @if (loading()) {
      <div class="text-center py-12 text-th-text-3 text-sm">Loading pipeline...</div>
    } @else if (viewMode() === 'kanban') {
      <!-- Kanban View -->
      <div class="flex gap-4 overflow-x-auto pb-4">
        @for (stage of stages; track stage) {
          <div class="min-w-[280px] flex-1">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-th-text-3 uppercase tracking-wider">{{ stageLabels[stage] }}</h3>
              <span class="text-xs text-th-text-3 bg-th-bg-tert rounded-full px-2 py-0.5">{{ stageCount(stage) }}</span>
            </div>
            <div class="space-y-3">
              @for (opp of getByStage(stage); track opp.id) {
                <div class="bg-th-card border border-th-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition border-l-4"
                     [ngClass]="stageColors[stage]"
                     (click)="selectOpp(opp)">
                  <p class="font-medium text-sm truncate">{{ opp.title || opp.company_name }}</p>
                  <p class="text-th-text-3 text-xs mt-1">{{ opp.company_name }}</p>
                  <div class="flex items-center justify-between mt-3">
                    <span class="text-sm font-mono font-semibold">{{ opp.estimated_value | number:'1.0-0' }} <span class="text-xs text-th-text-3">SAR</span></span>
                    <span class="text-xs text-th-text-3">{{ opp.probability }}%</span>
                  </div>
                  @if (opp.owner) {
                    <p class="text-[10px] text-th-text-3 mt-2">{{ opp.owner }}</p>
                  }
                </div>
              }
              @if (getByStage(stage).length === 0) {
                <div class="text-center py-8 text-th-text-3 text-xs border border-dashed border-th-border rounded-xl">No deals</div>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <!-- List View -->
      <div class="flex items-center gap-3 mb-4">
        <select [(ngModel)]="stageFilter" (change)="loadOpportunities()" class="bg-th-card border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All stages</option>
          @for (s of stages; track s) { <option [value]="s">{{ stageLabels[s] }}</option> }
        </select>
      </div>
      <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-th-border text-th-text-3">
                <th class="text-left font-medium px-4 py-3">Opportunity</th>
                <th class="text-left font-medium px-4 py-3">Company</th>
                <th class="text-right font-medium px-4 py-3">Value (SAR)</th>
                <th class="text-left font-medium px-4 py-3">Stage</th>
                <th class="text-left font-medium px-4 py-3">Probability</th>
                <th class="text-left font-medium px-4 py-3">Owner</th>
                <th class="text-left font-medium px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              @for (opp of opportunities(); track opp.id) {
                <tr class="border-b border-th-border/50 hover:bg-th-bg-tert/50 cursor-pointer transition" (click)="selectOpp(opp)">
                  <td class="px-4 py-3 font-medium">{{ opp.title || '—' }}</td>
                  <td class="px-4 py-3 text-th-text-3">{{ opp.company_name }}</td>
                  <td class="px-4 py-3 text-right font-mono">{{ opp.estimated_value | number:'1.0-0' }}</td>
                  <td class="px-4 py-3"><span class="px-2.5 py-1 rounded-full text-xs font-medium" [ngClass]="stageBadgeClass(opp.stage)">{{ stageLabels[opp.stage] || opp.stage }}</span></td>
                  <td class="px-4 py-3 text-th-text-3">{{ opp.probability }}%</td>
                  <td class="px-4 py-3 text-th-text-3 text-xs">{{ opp.owner || '—' }}</td>
                  <td class="px-4 py-3 text-th-text-3 text-xs">{{ opp.updated_at | date:'mediumDate' }}</td>
                </tr>
              } @empty {
                <tr><td colspan="7" class="px-4 py-10 text-center text-th-text-3">No opportunities found</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- Detail Panel -->
    @if (selectedOpp()) {
      <div class="fixed inset-0 z-50 flex items-center justify-end bg-th-bg-inv/60" (click)="selectedOpp.set(null)">
        <div class="bg-th-card border-l border-th-border w-full max-w-lg h-full overflow-y-auto shadow-xl" (click)="$event.stopPropagation()">
          <div class="px-6 py-4 border-b border-th-border flex items-center justify-between sticky top-0 bg-th-card z-10">
            <h3 class="font-bold">{{ selectedOpp()!.title || selectedOpp()!.company_name }}</h3>
            <button (click)="selectedOpp.set(null)" class="text-th-text-3 hover:text-th-text transition">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="p-6 space-y-6">
            <!-- Info -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><span class="text-th-text-3 text-xs block mb-1">Company</span><span class="font-medium">{{ selectedOpp()!.company_name }}</span></div>
              <div><span class="text-th-text-3 text-xs block mb-1">Contact</span><span class="font-medium">{{ selectedOpp()!.contact_name }}</span></div>
              <div><span class="text-th-text-3 text-xs block mb-1">Ticket</span><span class="font-mono text-gold text-xs">{{ selectedOpp()!.ticket_number }}</span></div>
              <div><span class="text-th-text-3 text-xs block mb-1">Created</span><span>{{ selectedOpp()!.created_at | date:'mediumDate' }}</span></div>
            </div>

            <!-- Editable Fields -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-th-text-3 mb-1">Stage</label>
                <select [(ngModel)]="editStage" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  @for (s of stages; track s) { <option [value]="s">{{ stageLabels[s] }}</option> }
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-th-text-3 mb-1">Value (SAR)</label>
                  <input [(ngModel)]="editValue" type="number" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label class="block text-xs text-th-text-3 mb-1">Probability %</label>
                  <input [(ngModel)]="editProb" type="number" min="0" max="100" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label class="block text-xs text-th-text-3 mb-1">Owner</label>
                <input [(ngModel)]="editOwner" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none" />
              </div>
              <button (click)="saveOpp()" [disabled]="saving()" class="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50">
                {{ saving() ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminOpportunityPipelineComponent implements OnInit {
  private api = inject(AdminApiService);

  opportunities = signal<Opportunity[]>([]);
  loading = signal(false);
  viewMode = signal<'kanban' | 'list'>('kanban');
  stageFilter = '';

  selectedOpp = signal<Opportunity | null>(null);
  editStage = '';
  editValue = 0;
  editProb = 0;
  editOwner = '';
  saving = signal(false);

  stages = STAGES;
  stageLabels = STAGE_LABELS;
  stageColors = STAGE_COLORS;

  ngOnInit() { this.loadOpportunities(); }

  loadOpportunities() {
    this.loading.set(true);
    const params: Record<string, string> = { limit: '200' };
    if (this.stageFilter) params['stage'] = this.stageFilter;
    this.api.getOpportunities(params).subscribe({
      next: (r: any) => { this.opportunities.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  getByStage(stage: string): Opportunity[] {
    return this.opportunities().filter(o => o.stage === stage);
  }

  stageCount(stage: string): number {
    return this.getByStage(stage).length;
  }

  totalOpps(): number { return this.opportunities().length; }

  totalValue(): number {
    return this.opportunities().reduce((sum, o) => sum + (+o.estimated_value || 0), 0);
  }

  weightedValue(): number {
    return this.opportunities().reduce((sum, o) => sum + ((+o.estimated_value || 0) * (+o.probability || 0) / 100), 0);
  }

  stageBadgeClass(stage: string): string {
    const map: Record<string, string> = {
      discovery: 'bg-sky-100 text-sky-700',
      proposal: 'bg-indigo-100 text-indigo-700',
      negotiation: 'bg-amber-100 text-amber-700',
      closed_won: 'bg-emerald-100 text-emerald-700',
      closed_lost: 'bg-red-100 text-red-700',
    };
    return map[stage] || 'bg-th-card/10 text-th-text/60';
  }

  selectOpp(opp: Opportunity) {
    this.selectedOpp.set(opp);
    this.editStage = opp.stage;
    this.editValue = opp.estimated_value;
    this.editProb = opp.probability;
    this.editOwner = opp.owner || '';
  }

  saveOpp() {
    const opp = this.selectedOpp();
    if (!opp) return;
    this.saving.set(true);
    this.api.updateOpportunity(opp.id, {
      stage: this.editStage,
      estimated_value: this.editValue,
      probability: this.editProb,
      owner: this.editOwner || null,
    } as any).subscribe({
      next: () => {
        this.saving.set(false);
        this.selectedOpp.set(null);
        this.loadOpportunities();
      },
      error: () => this.saving.set(false),
    });
  }
}
