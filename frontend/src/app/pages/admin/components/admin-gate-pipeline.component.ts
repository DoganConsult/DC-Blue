import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { Opportunity } from '../../../core/models/admin.models';

interface GateChecklistItem {
  id: string;
  stage: string;
  item_key: string;
  label: string;
  checked: boolean;
  checked_by: string | null;
  checked_at: string | null;
}

const STAGE_ORDER = ['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
const STAGE_LABELS: Record<string, string> = {
  discovery: 'Discovery',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};

@Component({
  selector: 'admin-gate-pipeline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-1">Stage Gate Pipeline</h2>
      <p class="text-th-text-3 text-sm">Select an opportunity to review and advance its gate checklist.</p>
    </div>

    <!-- Opportunity Selector -->
    <div class="bg-th-card border border-th-border rounded-xl p-5 mb-6">
      <label class="block text-sm font-medium text-th-text-3 mb-2">Select Opportunity</label>
      <select [(ngModel)]="selectedOppId" (change)="loadGates()"
              class="w-full max-w-lg bg-th-bg-tert border border-th-border-dk text-th-text rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
        <option value="">— Choose an opportunity —</option>
        @for (opp of opportunities(); track opp.id) {
          <option [value]="opp.id">{{ opp.title || opp.client_company }} — {{ opp.stage }} — {{ opp.estimated_value | number:'1.0-0' }} {{ opp.currency || 'SAR' }}</option>
        }
      </select>
    </div>

    @if (selectedOppId && gateData()) {
      <!-- Stage Stepper -->
      <div class="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        @for (stage of stageOrder; track stage; let i = $index; let last = $last) {
          <div class="flex items-center gap-1">
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition"
                 [ngClass]="getStageClass(stage)">
              @if (isStageCompleted(stage) && gateData()!.opportunity_stage !== stage) {
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              }
              {{ stageLabels[stage] || stage }}
            </div>
            @if (!last) {
              <svg class="w-4 h-4 text-th-text-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            }
          </div>
        }
      </div>

      <!-- Gate Checklist by Stage -->
      @for (stage of stageOrder; track stage) {
        @if (hasGateItems(stage)) {
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-th-text-3 uppercase tracking-wider">{{ stageLabels[stage] || stage }}</h3>
              <span class="text-xs text-th-text-3">
                {{ getStageProgress(stage).checked }}/{{ getStageProgress(stage).total }} complete
              </span>
            </div>
            <div class="bg-th-card border border-th-border rounded-xl divide-y divide-th-border/50">
              @for (item of gatesByStage()[stage]; track item.id) {
                <label class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-th-bg-tert/50 transition">
                  <input type="checkbox" [checked]="item.checked" (change)="toggleItem(item)"
                         class="w-4 h-4 rounded bg-th-bg-tert border-th-border-dk text-primary focus:ring-primary focus:ring-offset-th-bg" />
                  <span class="text-sm flex-1" [class.line-through]="item.checked" [class.text-th-text-3]="item.checked">{{ item.label }}</span>
                  @if (item.checked && item.checked_by) {
                    <span class="text-[10px] text-th-text-3">{{ item.checked_by }} · {{ item.checked_at | date:'short' }}</span>
                  }
                </label>
              }
            </div>
          </div>
        }
      }

      <!-- Can Advance Indicator -->
      @if (gateData()!.can_advance) {
        <div class="mt-4 p-4 rounded-xl border bg-emerald-50 border-emerald-200">
          <p class="text-emerald-700 text-sm font-medium">All required items in current stage are complete. This opportunity can advance.</p>
        </div>
      } @else {
        <div class="mt-4 p-4 rounded-xl border bg-amber-50 border-amber-200">
          <p class="text-amber-700 text-sm font-medium">Complete all required checklist items before advancing this opportunity.</p>
        </div>
      }
    } @else if (selectedOppId && gatesLoading()) {
      <div class="text-center py-12 text-th-text-3 text-sm">Loading gate checklist...</div>
    }
  `,
})
export class AdminGatePipelineComponent implements OnInit {
  private api = inject(AdminApiService);

  opportunities = signal<Opportunity[]>([]);
  selectedOppId = '';
  gateData = signal<{ opportunity_stage: string; gates: Record<string, GateChecklistItem[]>; can_advance: boolean } | null>(null);
  gatesLoading = signal(false);

  stageOrder = STAGE_ORDER;
  stageLabels = STAGE_LABELS;

  ngOnInit() {
    this.api.getOpportunities({ limit: '200' }).subscribe({
      next: (r) => this.opportunities.set(r.data),
      error: () => {},
    });
  }

  loadGates() {
    if (!this.selectedOppId) { this.gateData.set(null); return; }
    this.gatesLoading.set(true);
    this.api.getOpportunityGates(this.selectedOppId).subscribe({
      next: (r: any) => {
        this.gateData.set(r);
        this.gatesLoading.set(false);
      },
      error: () => this.gatesLoading.set(false),
    });
  }

  gatesByStage(): Record<string, GateChecklistItem[]> {
    return this.gateData()?.gates || {};
  }

  hasGateItems(stage: string): boolean {
    const items = this.gatesByStage()[stage];
    return !!items && items.length > 0;
  }

  isStageCompleted(stage: string): boolean {
    const items = this.gatesByStage()[stage];
    if (!items?.length) return false;
    return items.every(i => i.checked);
  }

  getStageProgress(stage: string): { checked: number; total: number } {
    const items = this.gatesByStage()[stage] || [];
    return { checked: items.filter(i => i.checked).length, total: items.length };
  }

  getStageClass(stage: string): string {
    const data = this.gateData();
    if (!data) return 'bg-th-bg-tert text-th-text-3';
    if (data.opportunity_stage === stage) return 'bg-primary text-white';
    if (this.isStageCompleted(stage)) return 'bg-emerald-100 text-emerald-700';
    return 'bg-th-bg-tert text-th-text-3';
  }

  toggleItem(item: GateChecklistItem) {
    const newChecked = !item.checked;
    this.api.updateGateItem(this.selectedOppId, item.id, newChecked).subscribe({
      next: () => this.loadGates(),
      error: () => {},
    });
  }
}
