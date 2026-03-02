import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';

interface EngagementRow {
  id: string;
  opportunity_id: string;
  lead_intake_id: string;
  title: string;
  phase: string;
  owner: string | null;
  scope_notes: string | null;
  opportunity_title: string;
  company_name: string;
  ticket_number: string;
  created_at: string;
  updated_at: string;
}

interface ChecklistItem {
  id: string;
  engagement_id: string;
  category: string;
  label: string;
  checked: boolean;
  checked_by: string | null;
  checked_at: string | null;
}

const PHASES = ['initiation', 'planning', 'execution', 'closure'];
const PHASE_LABELS: Record<string, string> = {
  initiation: 'Initiation', planning: 'Planning', execution: 'Execution', closure: 'Closure',
};

@Component({
  selector: 'admin-engagement-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold mb-1">Engagement Management</h2>
        <p class="text-th-text-3 text-sm">Manage active engagements with regulatory checklists.</p>
      </div>
      <button (click)="showCreate.set(!showCreate())" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition">
        {{ showCreate() ? 'Cancel' : '+ New Engagement' }}
      </button>
    </div>

    <!-- Create Form -->
    @if (showCreate()) {
      <div class="bg-th-card border border-th-border rounded-xl p-6 mb-6">
        <h3 class="font-semibold mb-4">Create Engagement from Opportunity</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-xs text-th-text-3 mb-1">Select Opportunity *</label>
            <select [(ngModel)]="createForm.opportunity_id" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">— Choose —</option>
              @for (o of availableOpps(); track o.id) {
                <option [value]="o.id">{{ o.title || o.company_name }} ({{ o.stage }})</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-xs text-th-text-3 mb-1">Owner</label>
            <input [(ngModel)]="createForm.owner" placeholder="Assignee" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs text-th-text-3 mb-1">Activity Code (regulatory)</label>
            <input [(ngModel)]="createForm.activity_code" placeholder="e.g. IT_INFRA" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs text-th-text-3 mb-1">Country Code</label>
            <input [(ngModel)]="createForm.country_code" placeholder="SA" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-th-text-3 mb-1">Scope Notes</label>
            <textarea [(ngModel)]="createForm.scope_notes" rows="2" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"></textarea>
          </div>
        </div>
        <button (click)="createEngagement()" [disabled]="creating() || !createForm.opportunity_id"
                class="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50">
          {{ creating() ? 'Creating...' : 'Create Engagement' }}
        </button>
      </div>
    }

    <!-- Filter -->
    <div class="flex gap-2 mb-5">
      @for (p of allPhases; track p) {
        <button (click)="setPhaseFilter(p)" class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
                [class.bg-primary]="phaseFilter() === p" [class.text-white]="phaseFilter() === p"
                [class.bg-th-bg-tert]="phaseFilter() !== p" [class.text-th-text-3]="phaseFilter() !== p">
          {{ p === '' ? 'All' : phaseLabels[p] || p }}
        </button>
      }
    </div>

    <!-- Engagements List -->
    @if (loading()) {
      <div class="text-center py-12 text-th-text-3 text-sm">Loading engagements...</div>
    } @else {
      <div class="space-y-3">
        @for (eng of engagements(); track eng.id) {
          <div class="bg-th-card border border-th-border rounded-xl p-5 cursor-pointer hover:border-primary/30 transition"
               (click)="selectEngagement(eng)">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm">{{ eng.title }}</h3>
              <span class="px-2.5 py-1 rounded-full text-xs font-medium" [ngClass]="phaseBadgeClass(eng.phase)">{{ phaseLabels[eng.phase] || eng.phase }}</span>
            </div>
            <div class="flex items-center gap-4 text-xs text-th-text-3">
              <span>{{ eng.company_name }}</span>
              <span class="font-mono text-gold">{{ eng.ticket_number }}</span>
              @if (eng.owner) { <span>Owner: {{ eng.owner }}</span> }
            </div>
          </div>
        } @empty {
          <div class="text-center py-12 text-th-text-3 text-sm">No engagements found</div>
        }
      </div>
    }

    <!-- Detail Panel -->
    @if (selectedEng()) {
      <div class="fixed inset-0 z-50 flex items-center justify-end bg-th-bg-inv/60" (click)="selectedEng.set(null)">
        <div class="bg-th-card border-l border-th-border w-full max-w-xl h-full overflow-y-auto shadow-xl" (click)="$event.stopPropagation()">
          <div class="px-6 py-4 border-b border-th-border flex items-center justify-between sticky top-0 bg-th-card z-10">
            <h3 class="font-bold">{{ selectedEng()!.title }}</h3>
            <button (click)="selectedEng.set(null)" class="text-th-text-3 hover:text-th-text transition">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="p-6 space-y-6">
            <!-- Phase Stepper -->
            <div class="flex items-center gap-1">
              @for (phase of phases; track phase; let i = $index; let last = $last) {
                <div class="flex items-center gap-1">
                  <div class="px-3 py-1.5 rounded-lg text-xs font-medium" [ngClass]="getPhaseStepClass(phase)">
                    {{ phaseLabels[phase] }}
                  </div>
                  @if (!last) {
                    <svg class="w-3 h-3 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                  }
                </div>
              }
            </div>

            <!-- Phase Edit -->
            <div class="flex items-center gap-3">
              <label class="text-xs text-th-text-3">Advance to:</label>
              <select [(ngModel)]="editPhase" class="bg-th-bg-tert border border-th-border-dk text-th-text rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                @for (p of phases; track p) { <option [value]="p">{{ phaseLabels[p] }}</option> }
              </select>
              <button (click)="updatePhase()" [disabled]="editPhase === selectedEng()!.phase" class="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/80 transition disabled:opacity-30">Update</button>
            </div>

            <!-- Scope -->
            @if (selectedEng()!.scope_notes) {
              <div>
                <h4 class="text-xs text-th-text-3 font-semibold mb-1 uppercase">Scope Notes</h4>
                <p class="text-sm text-th-text bg-th-bg-tert rounded-lg p-3 whitespace-pre-wrap">{{ selectedEng()!.scope_notes }}</p>
              </div>
            }

            <!-- Checklist -->
            @if (checklistLoading()) {
              <div class="text-th-text-3 text-sm">Loading checklist...</div>
            } @else if (checklist().length) {
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-xs text-th-text-3 font-semibold uppercase">Regulatory Checklist</h4>
                  <span class="text-xs text-th-text-3">{{ checklistChecked() }}/{{ checklist().length }}</span>
                </div>
                <!-- Progress Bar -->
                <div class="w-full h-1.5 bg-th-bg-tert rounded-full mb-4">
                  <div class="h-full bg-primary rounded-full transition-all" [style.width.%]="checklistPct()"></div>
                </div>
                @for (cat of checklistCategories(); track cat) {
                  <div class="mb-4">
                    <p class="text-[10px] text-th-text-3 uppercase tracking-wider font-semibold mb-2">{{ cat }}</p>
                    <div class="bg-th-bg-tert rounded-xl divide-y divide-th-border/30">
                      @for (item of getChecklistByCategory(cat); track item.id) {
                        <label class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-th-card/50 transition">
                          <input type="checkbox" [checked]="item.checked" (change)="toggleChecklistItem(item)"
                                 class="w-4 h-4 rounded bg-th-bg-tert border-th-border-dk text-primary focus:ring-primary focus:ring-offset-th-bg" />
                          <span class="text-sm flex-1" [class.line-through]="item.checked" [class.text-th-text-3]="item.checked">{{ item.label }}</span>
                        </label>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminEngagementManagerComponent implements OnInit {
  private api = inject(AdminApiService);

  engagements = signal<EngagementRow[]>([]);
  loading = signal(false);
  phaseFilter = signal<string>('');
  allPhases = ['', ...PHASES];
  phases = PHASES;
  phaseLabels = PHASE_LABELS;

  showCreate = signal(false);
  createForm = { opportunity_id: '', owner: '', activity_code: '', country_code: 'SA', scope_notes: '' };
  creating = signal(false);
  availableOpps = signal<any[]>([]);

  selectedEng = signal<EngagementRow | null>(null);
  editPhase = 'initiation';
  checklist = signal<ChecklistItem[]>([]);
  checklistLoading = signal(false);

  ngOnInit() {
    this.loadEngagements();
    this.api.getOpportunities({ limit: '200' }).subscribe({
      next: (r) => this.availableOpps.set(r.data),
    });
  }

  setPhaseFilter(phase: string) {
    this.phaseFilter.set(phase);
    this.loadEngagements();
  }

  loadEngagements() {
    this.loading.set(true);
    const params: Record<string, string> = { limit: '100' };
    if (this.phaseFilter()) params['phase'] = this.phaseFilter();
    this.api.getEngagements(params).subscribe({
      next: (r: any) => { this.engagements.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  createEngagement() {
    if (!this.createForm.opportunity_id) return;
    this.creating.set(true);
    this.api.createEngagement(this.createForm as any).subscribe({
      next: () => {
        this.creating.set(false);
        this.showCreate.set(false);
        this.createForm = { opportunity_id: '', owner: '', activity_code: '', country_code: 'SA', scope_notes: '' };
        this.loadEngagements();
      },
      error: () => this.creating.set(false),
    });
  }

  selectEngagement(eng: EngagementRow) {
    this.selectedEng.set(eng);
    this.editPhase = eng.phase;
    this.loadChecklist(eng.id);
  }

  loadChecklist(engId: string) {
    this.checklistLoading.set(true);
    this.api.getEngagement(engId).subscribe({
      next: (r: any) => {
        this.checklist.set(r.checklist || []);
        this.checklistLoading.set(false);
      },
      error: () => this.checklistLoading.set(false),
    });
  }

  updatePhase() {
    const eng = this.selectedEng();
    if (!eng || this.editPhase === eng.phase) return;
    this.api.updateEngagement(eng.id, { phase: this.editPhase } as any).subscribe({
      next: () => { this.loadEngagements(); eng.phase = this.editPhase; },
    });
  }

  toggleChecklistItem(item: ChecklistItem) {
    const eng = this.selectedEng();
    if (!eng) return;
    this.api.updateChecklistItem(eng.id, item.id, !item.checked).subscribe({
      next: () => this.loadChecklist(eng.id),
    });
  }

  phaseBadgeClass(phase: string): string {
    const map: Record<string, string> = {
      initiation: 'bg-sky-100 text-sky-700',
      planning: 'bg-indigo-100 text-indigo-700',
      execution: 'bg-amber-100 text-amber-700',
      closure: 'bg-emerald-100 text-emerald-700',
    };
    return map[phase] || 'bg-th-card/10 text-th-text/60';
  }

  getPhaseStepClass(phase: string): string {
    const eng = this.selectedEng();
    if (!eng) return 'bg-th-bg-tert text-th-text-3';
    const idx = this.phases.indexOf(phase);
    const currentIdx = this.phases.indexOf(eng.phase);
    if (idx === currentIdx) return 'bg-primary text-white';
    if (idx < currentIdx) return 'bg-emerald-100 text-emerald-700';
    return 'bg-th-bg-tert text-th-text-3';
  }

  checklistChecked(): number { return this.checklist().filter(i => i.checked).length; }
  checklistPct(): number {
    const total = this.checklist().length;
    return total ? Math.round(this.checklistChecked() / total * 100) : 0;
  }

  checklistCategories(): string[] {
    const cats = new Set(this.checklist().map(i => i.category));
    return Array.from(cats);
  }

  getChecklistByCategory(cat: string): ChecklistItem[] {
    return this.checklist().filter(i => i.category === cat);
  }
}
