import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { AiMessage, ProposalForm } from '../../../core/models/admin.models';

@Component({
  selector: 'admin-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-1 flex items-center gap-2">
        <svg class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456Z" /></svg>
        Shahin AI Assistant
      </h2>
      <p class="text-th-text-3 text-sm">Autonomous ICT Consultant powered by Claude.</p>
    </div>

    <div class="flex gap-2 mb-5">
      <button (click)="subTab.set('chat')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
              [class.bg-primary]="subTab()==='chat'" [class.text-white]="subTab()==='chat'"
              [class.bg-th-bg-tert]="subTab()!=='chat'" [class.text-th-text-3]="subTab()!=='chat'">Chat</button>
      <button (click)="subTab.set('summary')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
              [class.bg-primary]="subTab()==='summary'" [class.text-white]="subTab()==='summary'"
              [class.bg-th-bg-tert]="subTab()!=='summary'" [class.text-th-text-3]="subTab()!=='summary'">Lead Summary</button>
      <button (click)="subTab.set('proposal')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
              [class.bg-primary]="subTab()==='proposal'" [class.text-white]="subTab()==='proposal'"
              [class.bg-th-bg-tert]="subTab()!=='proposal'" [class.text-th-text-3]="subTab()!=='proposal'">Draft Proposal</button>
      <button (click)="subTab.set('overview')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
              [class.bg-primary]="subTab()==='overview'" [class.text-white]="subTab()==='overview'"
              [class.bg-th-bg-tert]="subTab()!=='overview'" [class.text-th-text-3]="subTab()!=='overview'">Pipeline Briefing</button>
    </div>

    <!-- Chat -->
    <div [class.hidden]="subTab()!=='chat'" class="bg-th-card border border-th-border rounded-xl flex flex-col" style="height:520px">
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div *ngIf="!messages().length" class="flex flex-col items-center justify-center h-full text-th-text-2 text-sm text-center">
          <svg class="w-8 h-8 text-sky-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456Z" /></svg>
          <p>Ask Shahin about leads, pipeline, ICT strategy, CITC requirements, proposals...</p>
        </div>
        @for (m of messages(); track $index) {
          <div class="flex" [class.justify-end]="m.role==='user'">
            <div class="max-w-prose rounded-xl px-4 py-3 text-sm whitespace-pre-wrap"
                 [class.bg-th-bg-tert]="m.role==='user'" [class.text-th-text]="m.role==='user'"
                 [class.bg-surface-dark]="m.role==='assistant'" [class.border]="m.role==='assistant'" [class.border-th-border]="m.role==='assistant'">
              <span class="block text-xs mb-1" [class.text-gold]="m.role==='assistant'" [class.text-th-text-3]="m.role==='user'">{{ m.role==='assistant' ? 'Shahin' : 'You' }}</span>
              {{ m.content }}
            </div>
          </div>
        }
        <div *ngIf="loading()" class="flex">
          <div class="bg-surface-dark border border-th-border rounded-xl px-4 py-3 text-sm text-th-text-3">Shahin is thinking...</div>
        </div>
      </div>
      <div *ngIf="error()" class="px-4 py-2 text-red-400 text-sm border-t border-th-border">{{ error() }}</div>
      <div class="border-t border-th-border p-3 flex gap-2">
        <input [(ngModel)]="input" placeholder="Ask Shahin..." (keyup.enter)="send()" class="flex-1 bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
        <button (click)="send()" [disabled]="loading() || !input.trim()" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-40">Send</button>
        <button (click)="clearChat()" class="px-3 py-2 rounded-xl bg-th-bg-tert text-th-text-3 text-sm hover:bg-th-bg-tert transition">Clear</button>
      </div>
    </div>

    <!-- Lead Summary -->
    <div [class.hidden]="subTab()!=='summary'" class="bg-th-card border border-th-border rounded-xl p-6">
      <h3 class="font-semibold mb-2">AI Lead Summary</h3>
      <p class="text-th-text-3 text-sm mb-4">Enter a lead ID to get an executive summary + next actions.</p>
      <div class="flex gap-2 mb-4">
        <input [(ngModel)]="leadId" placeholder="Lead ID (e.g. 42)" class="flex-1 bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
        <button (click)="fetchLeadSummary()" [disabled]="leadLoading() || !leadId.trim()" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-40">{{ leadLoading() ? 'Analysing...' : 'Analyse' }}</button>
      </div>
      <div *ngIf="leadSummary()" class="bg-th-bg-tert rounded-xl p-4 text-sm text-th-text whitespace-pre-wrap">{{ leadSummary() }}</div>
    </div>

    <!-- Proposal Draft -->
    <div [class.hidden]="subTab()!=='proposal'" class="bg-th-card border border-th-border rounded-xl p-6">
      <h3 class="font-semibold mb-2">AI Proposal Draft</h3>
      <p class="text-th-text-3 text-sm mb-4">Shahin will draft a full proposal outline (EN + AR sections).</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div><label class="block text-th-text-3 text-xs mb-1">Client Company *</label><input [(ngModel)]="proposalForm.company_name" placeholder="Acme Telecom" class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
        <div><label class="block text-th-text-3 text-xs mb-1">Service / Scope *</label><input [(ngModel)]="proposalForm.service" placeholder="Network Design + Cybersecurity" class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
        <div><label class="block text-th-text-3 text-xs mb-1">Budget Range (SAR)</label><input [(ngModel)]="proposalForm.budget_range" placeholder="500,000 – 1,000,000" class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
        <div><label class="block text-th-text-3 text-xs mb-1">Timeline</label><input [(ngModel)]="proposalForm.timeline" placeholder="Q3 2026 (6 months)" class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
        <div><label class="block text-th-text-3 text-xs mb-1">Country / Region</label><input [(ngModel)]="proposalForm.country" placeholder="Saudi Arabia" class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
        <div><label class="block text-th-text-3 text-xs mb-1">Special Notes</label><input [(ngModel)]="proposalForm.notes" placeholder="Existing vendor: Cisco" class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
      </div>
      <button (click)="draftProposal()" [disabled]="proposalLoading() || !proposalForm.company_name" class="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-40 mb-4">{{ proposalLoading() ? 'Generating...' : 'Generate Proposal Draft' }}</button>
      <div *ngIf="proposalResult()" class="bg-th-bg-tert rounded-xl p-4 text-sm text-th-text whitespace-pre-wrap max-h-96 overflow-y-auto">{{ proposalResult() }}</div>
    </div>

    <!-- Pipeline Briefing -->
    <div [class.hidden]="subTab()!=='overview'" class="bg-th-card border border-th-border rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold">AI Pipeline Briefing</h3>
        <button (click)="loadOverview()" [disabled]="overviewLoading()" class="px-3 py-1.5 rounded-lg bg-th-bg-tert text-th-text-3 text-xs font-medium hover:bg-th-bg-tert transition disabled:opacity-40">{{ overviewLoading() ? 'Generating...' : 'Refresh' }}</button>
      </div>
      <div *ngIf="overviewLoading()" class="text-th-text-3 text-sm">Shahin is analysing your pipeline...</div>
      <div *ngIf="overview()" class="text-sm text-th-text whitespace-pre-wrap">{{ overview() }}</div>
    </div>
  `,
})
export class AdminAiAssistantComponent {
  private api = inject(AdminApiService);

  messages = signal<AiMessage[]>([]);
  input = '';
  loading = signal(false);
  error = signal<string | null>(null);
  overview = signal<string | null>(null);
  overviewLoading = signal(false);
  leadId = '';
  leadSummary = signal<string | null>(null);
  leadLoading = signal(false);
  proposalResult = signal<string | null>(null);
  proposalLoading = signal(false);
  proposalForm: ProposalForm = { company_name: '', service: '', budget_range: '', timeline: '', country: 'Saudi Arabia', notes: '' };
  subTab = signal<'chat' | 'summary' | 'proposal' | 'overview'>('chat');

  ngOnInit() {
    this.loadOverview();
  }

  loadOverview() {
    this.overviewLoading.set(true);
    this.api.getLeadsOverview().subscribe({
      next: (r) => { this.overviewLoading.set(false); this.overview.set(r.summary); },
      error: (e) => { this.overviewLoading.set(false); this.overview.set('Error: ' + (e.error?.error || e.message)); },
    });
  }

  send() {
    const text = this.input.trim();
    if (!text || this.loading()) return;
    const msgs = [...this.messages(), { role: 'user' as const, content: text }];
    this.messages.set(msgs);
    this.input = '';
    this.loading.set(true);
    this.error.set(null);
    this.api.aiChat(msgs).subscribe({
      next: (r) => {
        this.loading.set(false);
        this.messages.set([...this.messages(), { role: 'assistant', content: r.reply }]);
      },
      error: (e) => { this.loading.set(false); this.error.set(e.error?.error || 'AI error'); },
    });
  }

  clearChat() {
    this.messages.set([]);
    this.error.set(null);
  }

  fetchLeadSummary() {
    const id = this.leadId.trim();
    if (!id) return;
    this.leadLoading.set(true);
    this.leadSummary.set(null);
    this.api.getLeadSummary(id).subscribe({
      next: (r) => { this.leadLoading.set(false); this.leadSummary.set(r.summary); },
      error: (e) => { this.leadLoading.set(false); this.leadSummary.set('Error: ' + (e.error?.error || e.message)); },
    });
  }

  draftProposal() {
    this.proposalLoading.set(true);
    this.proposalResult.set(null);
    this.api.draftProposal(this.proposalForm as any).subscribe({
      next: (r) => { this.proposalLoading.set(false); this.proposalResult.set(r.draft); },
      error: (e) => { this.proposalLoading.set(false); this.proposalResult.set('Error: ' + (e.error?.error || e.message)); },
    });
  }
}
