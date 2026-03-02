import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { getKsaCrActivityLabel } from '../../core/data/ksa-cr-activities';
import { getServiceRegulatoryEntry } from '../../core/data/service-regulatory-matrix.model';
import { SERVICE_REGULATORY_MATRIX_KSA } from '../../core/data/service-regulatory-matrix.ksa';
import { DOGAN_CONSULT_TEAMS, getTeamLabel } from '../../core/data/dogan-consult-org-structure';
import type { ServiceRegulatoryEntry } from '../../core/data/service-regulatory-matrix.model';

interface LeadDetail {
  id: string;
  ticket_number: string;
  source: string;
  status: string;
  company_name: string;
  cr_number: string;
  company_website: string;
  city: string;
  country: string;
  contact_name: string;
  contact_title: string;
  contact_email: string;
  contact_phone: string;
  product_line: string;
  vertical: string;
  expected_users: string;
  budget_range: string;
  timeline: string;
  message: string;
  score: number;
  assigned_to: string;
  created_at: string;
  updated_at: string;
  converted_at: string | null;
}

interface Activity {
  id: string;
  type: string;
  body: string;
  created_by: string;
  created_at: string;
  visibility?: string;
}

interface Opportunity {
  id: string;
  title: string;
  stage: string;
  owner: string;
  estimated_value: number;
  currency: string;
  probability: number;
  created_at: string;
}

interface PartnerLead {
  partner_lead_id: string;
  partner_lead_status: string;
  approved_at: string | null;
  rejected_reason: string | null;
  partner_company_name: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-admin-lead-detail',
  template: `
    <div class="min-h-screen bg-th-bg text-th-text">
      <nav class="bg-th-card border-b border-th-border px-6 py-3 flex items-center gap-4">
        <a class="font-bold text-lg cursor-pointer" (click)="router.navigate(['/'])">
          Dogan<span class="text-gold">Consult</span>
        </a>
        <span class="text-th-text-2">|</span>
        <a class="text-th-text-3 hover:text-th-text text-sm cursor-pointer transition" (click)="router.navigate(['/admin'])">
          ← Back to Dashboard
        </a>
      </nav>

      @if (!lead()) {
        <div class="flex items-center justify-center min-h-[60vh]">
          @if (error()) {
            <div class="text-center">
              <p class="text-error mb-4">{{ error() }}</p>
              <button (click)="router.navigate(['/admin'])" class="text-primary hover:underline">Back to Dashboard</button>
            </div>
          } @else {
            <p class="text-th-text-3">Loading...</p>
          }
        </div>
      } @else {
        <div class="max-w-6xl mx-auto px-4 py-8">
          <div class="flex items-start justify-between mb-8">
            <div>
              <p class="text-gold font-mono text-sm mb-1">{{ lead()!.ticket_number }}</p>
              <h1 class="text-2xl font-bold">{{ lead()!.company_name }}</h1>
              <p class="text-th-text-3">{{ lead()!.contact_name }} · {{ lead()!.contact_email }}</p>
            </div>
            <span class="px-3 py-1.5 rounded-full text-sm font-semibold" [class]="statusClass(lead()!.status)">
              {{ lead()!.status }}
            </span>
          </div>

          @if (partnerLead(); as pl) {
            <div class="mb-8 p-4 rounded-xl border bg-th-card/80 border-th-border-dk">
              <p class="text-sm text-th-text-3 mb-2">Submitted by partner</p>
              <div class="flex flex-wrap items-center justify-between gap-4">
                <p class="font-medium text-gold">{{ pl.partner_company_name }}</p>
                <span class="px-2.5 py-1 rounded-full text-xs font-medium" [class]="partnerLeadStatusClass(pl.partner_lead_status)">{{ pl.partner_lead_status }}</span>
                @if (pl.partner_lead_status === 'pending') {
                  @if (isAdmin()) {
                  <div class="flex gap-2">
                    <button (click)="approvePartnerLead(pl.partner_lead_id)" [disabled]="partnerLeadActionPending()"
                            class="px-3 py-1.5 rounded-lg bg-success text-th-btn-text text-sm font-medium hover:bg-success/80 transition disabled:opacity-50">Approve partner lead</button>
                    <button (click)="rejectPartnerLead(pl.partner_lead_id)" [disabled]="partnerLeadActionPending()"
                            class="px-3 py-1.5 rounded-lg bg-th-btn-danger text-th-btn-text text-sm font-medium hover:bg-th-btn-danger/80 transition disabled:opacity-50">Reject</button>
                  </div>
                  }
                }
                @if (pl.rejected_reason) {
                  <p class="text-sm text-th-text-3 w-full mt-2">Reason: {{ pl.rejected_reason }}</p>
                }
              </div>
            </div>
          }

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-th-card border border-th-border rounded-xl p-6">
                <h3 class="font-semibold mb-4 text-th-text-3">Lead Details</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div><span class="text-th-text-3">Source</span><p>{{ lead()!.source }}</p></div>
                  <div><span class="text-th-text-3">Service</span><p>{{ serviceLabel(lead()!.product_line) }}</p></div>
                  <div><span class="text-th-text-3">Industry</span><p>{{ lead()!.vertical || '—' }}</p></div>
                  <div><span class="text-th-text-3">City</span><p>{{ lead()!.city || '—' }}, {{ lead()!.country }}</p></div>
                  <div><span class="text-th-text-3">CR Number</span><p>{{ lead()!.cr_number || '—' }}</p></div>
                  <div><span class="text-th-text-3">Website</span><p>{{ lead()!.company_website || '—' }}</p></div>
                  <div><span class="text-th-text-3">Contact Title</span><p>{{ lead()!.contact_title || '—' }}</p></div>
                  <div><span class="text-th-text-3">Phone</span><p>{{ lead()!.contact_phone || '—' }}</p></div>
                  <div><span class="text-th-text-3">Expected Users</span><p>{{ lead()!.expected_users || '—' }}</p></div>
                  <div><span class="text-th-text-3">Budget</span><p>{{ lead()!.budget_range || '—' }}</p></div>
                  <div><span class="text-th-text-3">Timeline</span><p>{{ lead()!.timeline || '—' }}</p></div>
                  <div><span class="text-th-text-3">Score</span><p>{{ lead()!.score }}</p></div>
                </div>
                @if (lead()!.message) {
                  <div class="mt-4 pt-4 border-t border-th-border">
                    <span class="text-th-text-3 text-sm">Message</span>
                    <p class="mt-1 text-th-text-3">{{ lead()!.message }}</p>
                  </div>
                }
              </div>

              @if (regulatoryEntry(); as entry) {
                <div class="bg-th-card border border-th-border rounded-xl p-6">
                  <h3 class="font-semibold mb-4 text-gold">Regulatory context</h3>
                  <p class="text-th-text-3 text-xs mb-3">For this service in {{ lead()!.country }} — use in proposals, contracts, and checklists.</p>
                  @if (entry.regulators.length) {
                    <div class="mb-3">
                      <span class="text-th-text-3 text-xs">Regulators</span>
                      <p class="text-sm text-th-text-3 mt-0.5">{{ regulatorsDisplay(entry) }}</p>
                    </div>
                  }
                  @if (entry.frameworks.length) {
                    <div class="mb-3">
                      <span class="text-th-text-3 text-xs">Frameworks</span>
                      <p class="text-sm text-th-text-3 mt-0.5">{{ frameworksDisplay(entry) }}</p>
                    </div>
                  }
                  @if (entry.controlThemes.length) {
                    <div class="mb-3">
                      <span class="text-th-text-3 text-xs">Control themes</span>
                      <p class="text-sm text-th-text-3 mt-0.5">{{ entry.controlThemes.join(', ') }}</p>
                    </div>
                  }
                  @if (entry.permits.length) {
                    <div class="mb-3">
                      <span class="text-th-text-3 text-xs">Permits</span>
                      <p class="text-sm text-th-text-3 mt-0.5">{{ permitsDisplay(entry) }}</p>
                    </div>
                  }
                  @if (entry.referenceDocuments.length) {
                    <div>
                      <span class="text-th-text-3 text-xs">Reference documents</span>
                      <ul class="text-sm text-th-text-3 mt-0.5 list-disc list-inside">
                        @for (ref of entry.referenceDocuments; track ref.name) {
                          <li>{{ ref.name }}{{ ref.url ? ' (link)' : '' }}</li>
                        }
                      </ul>
                    </div>
                  }
                </div>
              }

              <div class="bg-th-card border border-th-border rounded-xl p-6">
                <h3 class="font-semibold mb-4 text-th-text-3">Activity Timeline</h3>
                <div class="space-y-4">
                  @for (a of activities(); track a.id) {
                    <div class="flex gap-3">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                           [class]="activityTypeClass(a.type)">
                        {{ activityTypeIcon(a.type) }}
                      </div>
                      <div class="flex-1">
                        <p class="text-sm">{{ a.body }}</p>
                        <div class="flex items-center gap-2 mt-1">
                          <p class="text-th-text-3 text-xs">{{ a.created_by }} · {{ a.created_at | date:'medium' }}</p>
                          @if (a.visibility === 'partner') {
                            <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-info/20 text-info">Partner Visible</span>
                          } @else {
                            <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-th-bg-tert text-th-text-3">Internal</span>
                          }
                        </div>
                      </div>
                    </div>
                  } @empty {
                    <p class="text-th-text-3 text-sm">No activity yet</p>
                  }
                </div>

                <div class="mt-6 pt-4 border-t border-th-border">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-th-text-3 text-xs">Visibility:</span>
                    <button (click)="noteVisibility = 'internal'"
                            class="px-2.5 py-1 rounded-full text-xs font-medium transition border"
                            [class]="noteVisibility === 'internal' ? 'px-2.5 py-1 rounded-full text-xs font-medium transition border bg-th-bg-tert text-th-text border-th-border' : 'px-2.5 py-1 rounded-full text-xs font-medium transition border border-transparent text-th-text-3'">
                      Internal
                    </button>
                    <button (click)="noteVisibility = 'partner'"
                            class="px-2.5 py-1 rounded-full text-xs font-medium transition border"
                            [class]="noteVisibility === 'partner' ? 'px-2.5 py-1 rounded-full text-xs font-medium transition border bg-info/20 text-info border-info/40' : 'px-2.5 py-1 rounded-full text-xs font-medium transition border border-transparent text-th-text-3'">
                      Partner Visible
                    </button>
                  </div>
                  <div class="flex gap-2">
                    <input [(ngModel)]="noteBody" placeholder="Add a note..."
                           (keyup.enter)="addNote()"
                           class="flex-1 bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                    <button (click)="addNote()" [disabled]="!noteBody.trim()"
                            class="px-4 py-2 rounded-lg bg-th-btn text-th-btn-text text-sm font-medium hover:bg-th-btn-hover transition disabled:opacity-40">
                      Add
                    </button>
                  </div>
                </div>
              </div>

              @if (opportunities().length) {
                <div class="bg-th-card border border-th-border rounded-xl p-6">
                  <h3 class="font-semibold mb-4 text-th-text-3">Opportunities</h3>
                  @for (opp of opportunities(); track opp.id) {
                    <div class="flex items-center justify-between py-3 border-b border-th-border last:border-0">
                      <div>
                        <p class="font-medium">{{ opp.title }}</p>
                        <p class="text-th-text-3 text-xs">{{ opp.stage }} · {{ opp.owner }}</p>
                      </div>
                      <div class="text-right">
                        <p class="font-bold text-success">{{ opp.estimated_value | number }} {{ opp.currency }}</p>
                        <p class="text-th-text-3 text-xs">{{ opp.probability }}% probability</p>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <div class="space-y-6">
              <div class="bg-th-card border border-th-border rounded-xl p-6">
                <h3 class="font-semibold mb-4 text-th-text-3">Update Lead</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-th-text-3 text-xs mb-1">Status</label>
                    <select [(ngModel)]="editStatus"
                            class="w-full bg-th-bg-tert text-th-text border border-th-border-dk rounded-lg px-3 py-2 text-sm focus:outline-none">
                      <option value="new">New</option>
                      <option value="qualified">Qualified</option>
                      <option value="contacted">Contacted</option>
                      <option value="proposal">Proposal</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                      <option value="duplicate">Duplicate</option>
                      <option value="spam">Spam</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-th-text-3 text-xs mb-1">Assigned To (team)</label>
                    <select [(ngModel)]="editAssignedTeam"
                            class="w-full bg-th-bg-tert text-th-text border border-th-border-dk rounded-lg px-3 py-2 text-sm focus:outline-none">
                      @for (t of DOGAN_CONSULT_TEAMS; track t.value) {
                        <option [value]="t.value">{{ t.labelEn }}</option>
                      }
                    </select>
                    @if (editAssignedTeam === 'other') {
                      <input [(ngModel)]="editAssignedToOther" placeholder="Name or email"
                             class="w-full mt-2 bg-th-bg-tert text-th-text border border-th-border-dk rounded-lg px-3 py-2 text-sm focus:outline-none" />
                    }
                  </div>
                  <div>
                    <label class="block text-th-text-3 text-xs mb-1">Score</label>
                    <input [(ngModel)]="editScore" type="number"
                           class="w-full bg-th-bg-tert text-th-text border border-th-border-dk rounded-lg px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <button (click)="updateLead()" [disabled]="updating()"
                          class="w-full py-2 rounded-lg bg-th-btn text-th-btn-text text-sm font-semibold hover:bg-th-btn-hover transition disabled:opacity-50">
                    {{ updating() ? 'Saving...' : 'Save Changes' }}
                  </button>
                  @if (updateMsg()) {
                    <p class="text-success text-xs text-center">{{ updateMsg() }}</p>
                  }
                </div>
              </div>

              @if (lead()!.status !== 'won' && !lead()!.converted_at) {
                <div class="bg-th-card border border-th-border rounded-xl p-6">
                  <h3 class="font-semibold mb-4 text-th-text-3">Convert to Opportunity</h3>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-th-text-3 text-xs mb-1">Est. Value (SAR)</label>
                      <input [(ngModel)]="convertValue" type="number"
                             class="w-full bg-th-bg-tert text-th-text border border-th-border-dk rounded-lg px-3 py-2 text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label class="block text-th-text-3 text-xs mb-1">Probability %</label>
                      <input [(ngModel)]="convertProbability" type="number" min="0" max="100"
                             class="w-full bg-th-bg-tert text-th-text border border-th-border-dk rounded-lg px-3 py-2 text-sm focus:outline-none" />
                    </div>
                    <button (click)="convertLead()" [disabled]="converting()"
                            class="w-full py-2 rounded-lg bg-success text-th-btn-text text-sm font-semibold hover:bg-success/80 transition disabled:opacity-50">
                      {{ converting() ? 'Converting...' : 'Convert to Opportunity' }}
                    </button>
                  </div>
                </div>
              }

              <div class="bg-th-card border border-th-border rounded-xl p-6 text-xs text-th-text-3 space-y-2">
                <p>Created: {{ lead()!.created_at | date:'medium' }}</p>
                <p>Updated: {{ lead()!.updated_at | date:'medium' }}</p>
                <p>Assigned: {{ assignedToDisplay() }}</p>
                @if (lead()!.converted_at) {
                  <p class="text-success">Converted: {{ lead()!.converted_at | date:'medium' }}</p>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminLeadDetailPage implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  lead = signal<LeadDetail | null>(null);
  activities = signal<Activity[]>([]);
  opportunities = signal<Opportunity[]>([]);
  partnerLead = signal<PartnerLead | null>(null);
  error = signal<string | null>(null);

  partnerLeadActionPending = signal(false);

  /** Regulatory context for (product_line, country) from service × country matrix; undefined if no entry. */
  regulatoryEntry = signal<ServiceRegulatoryEntry | undefined>(undefined);

  editStatus = '';
  editAssignedTeam = 'sales';
  editAssignedToOther = '';
  editScore = 0;
  updating = signal(false);
  updateMsg = signal<string | null>(null);

  noteBody = '';
  noteVisibility: 'internal' | 'partner' = 'internal';

  convertValue = 0;
  convertProbability = 20;
  converting = signal(false);

  /** Expose org teams for template. */
  readonly DOGAN_CONSULT_TEAMS = DOGAN_CONSULT_TEAMS;

  assignedToDisplay(): string {
    const l = this.lead();
    if (!l?.assigned_to) return '—';
    const team = DOGAN_CONSULT_TEAMS.find(t => t.value === l.assigned_to || t.labelEn === l.assigned_to);
    if (team) return team.labelEn;
    return l.assigned_to;
  }

  get adminToken(): string {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dc_admin_token') || '' : '';
  }

  private headers(): Record<string, string> {
    const t = this.adminToken;
    if (t.startsWith('eyJ')) return { Authorization: `Bearer ${t}` };
    return { 'x-admin-token': t };
  }

  isAdmin(): boolean {
    try {
      const u = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dc_portal_user') : null;
      if (!u) return true;
      const parsed = JSON.parse(u);
      return parsed?.role === 'admin';
    } catch { return true; }
  }

  ngOnInit() {
    if (!this.adminToken) {
      this.router.navigate(['/admin']);
      return;
    }
    this.route.params.subscribe(p => {
      if (p['id']) this.loadLead(p['id']);
    });
  }

  loadLead(id: string) {
    this.http.get<{ lead: LeadDetail; activities: Activity[]; opportunities: Opportunity[]; partner_lead: PartnerLead | null }>(
      `/api/v1/leads/${id}`, { headers: this.headers() }
    ).subscribe({
      next: (r) => {
        this.lead.set(r.lead);
        this.activities.set(r.activities);
        this.opportunities.set(r.opportunities);
        this.partnerLead.set(r.partner_lead ?? null);
        this.editStatus = r.lead.status;
        this.editScore = r.lead.score || 0;
        const at = r.lead.assigned_to || '';
        const team = DOGAN_CONSULT_TEAMS.find(t => t.value === at || t.labelEn === at);
        if (team) {
          this.editAssignedTeam = team.value;
          this.editAssignedToOther = '';
        } else {
          this.editAssignedTeam = 'other';
          this.editAssignedToOther = at;
        }
        this.setRegulatoryEntry(r.lead.product_line, r.lead.country);
      },
      error: (err) => {
        if (err.status === 401) { this.router.navigate(['/admin']); return; }
        this.error.set(err.status === 404 ? 'Lead not found' : 'Failed to load lead');
      },
    });
  }

  updateLead() {
    const l = this.lead();
    if (!l) return;
    this.updating.set(true);
    this.updateMsg.set(null);
    this.http.patch<{ ok: boolean }>(`/api/v1/leads/${l.id}`, {
      status: this.editStatus,
      assigned_to: this.editAssignedTeam === 'other' ? this.editAssignedToOther : getTeamLabel(this.editAssignedTeam),
      score: this.editScore,
    }, { headers: this.headers() }).subscribe({
      next: () => {
        this.updating.set(false);
        this.updateMsg.set('Saved');
        this.loadLead(l.id);
        setTimeout(() => this.updateMsg.set(null), 2000);
      },
      error: () => { this.updating.set(false); },
    });
  }

  addNote() {
    const l = this.lead();
    if (!l || !this.noteBody.trim()) return;
    this.http.post<{ ok: boolean }>(`/api/v1/leads/${l.id}/activities`, {
      type: 'note', body: this.noteBody.trim(), created_by: 'admin', visibility: this.noteVisibility,
    }, { headers: this.headers() }).subscribe({
      next: () => { this.noteBody = ''; this.noteVisibility = 'internal'; this.loadLead(l.id); },
      error: () => { },
    });
  }

  convertLead() {
    const l = this.lead();
    if (!l) return;
    this.converting.set(true);
    this.http.post<{ ok: boolean; opportunity_id: string }>(`/api/v1/leads/${l.id}/convert`, {
      estimated_value: this.convertValue,
      probability: this.convertProbability,
    }, { headers: this.headers() }).subscribe({
      next: () => { this.converting.set(false); this.loadLead(l.id); },
      error: () => { this.converting.set(false); },
    });
  }

  approvePartnerLead(partnerLeadId: string) {
    this.partnerLeadActionPending.set(true);
    this.http.post<{ ok: boolean }>(`/api/v1/partners/leads/${partnerLeadId}/approve`, { approved_by: 'admin' }, { headers: this.headers() }).subscribe({
      next: () => { this.partnerLeadActionPending.set(false); const l = this.lead(); if (l) this.loadLead(l.id); },
      error: () => this.partnerLeadActionPending.set(false),
    });
  }

  rejectPartnerLead(partnerLeadId: string) {
    const reason = window.prompt('Rejection reason (optional):') || '';
    this.partnerLeadActionPending.set(true);
    this.http.post<{ ok: boolean }>(`/api/v1/partners/leads/${partnerLeadId}/reject`, { reason }, { headers: this.headers() }).subscribe({
      next: () => { this.partnerLeadActionPending.set(false); const l = this.lead(); if (l) this.loadLead(l.id); },
      error: () => this.partnerLeadActionPending.set(false),
    });
  }

  partnerLeadStatusClass(s: string): string {
    const map: Record<string, string> = {
      pending: 'bg-warning/20 text-warning',
      approved: 'bg-success/20 text-success',
      rejected: 'bg-error/20 text-error',
    };
    return map[s] || 'bg-th-card/10 text-th-text/60';
  }

  statusClass(s: string): string {
    const map: Record<string, string> = {
      new: 'bg-info/20 text-info', qualified: 'bg-accent/20 text-accent',
      contacted: 'bg-warning/20 text-warning', proposal: 'bg-accent/20 text-accent',
      won: 'bg-success/20 text-success', lost: 'bg-error/20 text-error',
    };
    return map[s] || 'bg-th-card/10 text-th-text/60';
  }

  activityTypeClass(t: string): string {
    const map: Record<string, string> = {
      system: 'bg-th-bg-tert text-th-text-3', note: 'bg-info/20 text-info',
      status_change: 'bg-warning/20 text-warning', email: 'bg-accent/20 text-accent',
      call: 'bg-success/20 text-success',
    };
    return map[t] || 'bg-th-bg-tert text-th-text-3';
  }

  activityTypeIcon(t: string): string {
    const map: Record<string, string> = { system: 'S', note: 'N', status_change: '↻', email: '@', call: '☎' };
    return map[t] || '•';
  }

  serviceLabel(productLine: string): string {
    const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    return getKsaCrActivityLabel(productLine || '', lang) || productLine || '—';
  }

  regulatorsDisplay(entry: ServiceRegulatoryEntry): string {
    return entry.regulators.map(r => r.nameEn).join(' · ');
  }

  frameworksDisplay(entry: ServiceRegulatoryEntry): string {
    return entry.frameworks.map(f => f.nameEn + (f.version ? ' ' + f.version : '')).join(' · ');
  }

  permitsDisplay(entry: ServiceRegulatoryEntry): string {
    return entry.permits.map(p => p.type + (p.renewal === 'annual' ? ' (annual)' : '')).join(' · ');
  }

  private setRegulatoryEntry(productLine: string | undefined, country: string | undefined): void {
    if (!productLine || !country) {
      this.regulatoryEntry.set(undefined);
      return;
    }
    const countryCode = this.normalizeCountryCode(country);
    const entry = getServiceRegulatoryEntry(SERVICE_REGULATORY_MATRIX_KSA, productLine, countryCode);
    this.regulatoryEntry.set(entry);
  }

  private normalizeCountryCode(country: string): string {
    const s = (country || '').trim().toUpperCase();
    if (s.length === 2) return s;
    const map: Record<string, string> = {
      'SAUDI ARABIA': 'SA', 'KSA': 'SA', 'المملكة العربية السعودية': 'SA',
      'UAE': 'AE', 'UNITED ARAB EMIRATES': 'AE', 'الإمارات': 'AE',
    };
    return map[s] || s.slice(0, 2);
  }
}
