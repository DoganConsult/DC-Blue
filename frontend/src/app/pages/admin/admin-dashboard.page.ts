import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DOGAN_CONSULT_TEAMS } from '../../core/data/dogan-consult-org-structure';

interface DashboardStats {
  total: number;
  last_7_days: number;
  by_status: Array<{ status: string; cnt: string }>;
  by_product: Array<{ product_line: string; cnt: string }>;
}

interface LeadRow {
  id: string;
  ticket_number: string;
  status: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  product_line: string;
  vertical: string;
  city: string;
  score: number;
  assigned_to: string;
  created_at: string;
}

interface PartnerRow {
  id: string;
  company_name: string;
  company_website: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  partner_type: string;
  status: string;
  tier: string | null;
  commission_rate: number | null;
  created_at: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-admin-dashboard',
  template: `
    <div class="min-h-screen bg-gray-950 text-white">
      <nav class="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a class="font-bold text-lg cursor-pointer" (click)="router.navigate(['/'])">
            Dogan<span class="text-[var(--gold)]">Consult</span>
          </a>
          <span class="text-gray-500 text-sm">Internal Portal</span>
        </div>
        @if (authenticated()) {
          <span class="text-gray-400 text-sm">{{ portalUser()?.name || portalUser()?.email || 'Admin' }}</span>
          <button (click)="logout()" class="text-gray-400 hover:text-white text-sm transition">Logout</button>
        }
      </nav>

      @if (!authenticated()) {
        <div class="flex items-center justify-center min-h-[80vh]">
          <div class="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 class="text-xl font-bold text-center mb-6">Internal Portal Login</h2>
            @if (authError()) {
              <div class="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm text-center">{{ authError() }}</div>
            }
            <input [(ngModel)]="emailInput" type="email" placeholder="Email (employee or admin)"
                   class="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
            <input [(ngModel)]="passwordInput" type="password" placeholder="Password"
                   (keyup.enter)="login()"
                   class="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
            <p class="text-gray-500 text-xs mb-4">Use your email + password, or admin password only (legacy).</p>
            <button (click)="login()" [disabled]="loadingAuth()"
                    class="w-full py-3 rounded-xl font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary)]/80 transition disabled:opacity-50">
              Sign In
            </button>
          </div>
        </div>
      } @else {
        <div class="max-w-7xl mx-auto px-4 py-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p class="text-3xl font-bold">{{ stats()?.total || 0 }}</p>
              <p class="text-gray-500 text-sm mt-1">Total Leads</p>
            </div>
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p class="text-3xl font-bold text-sky-400">{{ stats()?.last_7_days || 0 }}</p>
              <p class="text-gray-500 text-sm mt-1">Last 7 Days</p>
            </div>
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p class="text-3xl font-bold text-emerald-400">{{ getStatusCount('won') }}</p>
              <p class="text-gray-500 text-sm mt-1">Won</p>
            </div>
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p class="text-3xl font-bold text-amber-400">{{ getStatusCount('new') + getStatusCount('qualified') }}</p>
              <p class="text-gray-500 text-sm mt-1">Open Pipeline</p>
            </div>
          </div>

          <div class="flex gap-2 border-b border-gray-800 mb-6">
            <button (click)="setTab('leads')"
                    class="px-4 py-2 text-sm font-medium rounded-t-lg transition"
                    [class.bg-gray-800]="activeTab() === 'leads'"
                    [class.text-white]="activeTab() === 'leads'"
                    [class.text-gray-400]="activeTab() !== 'leads'"
                    [class.hover:text-white]="activeTab() !== 'leads'">
              Leads
            </button>
            @if (isAdmin()) {
            <button (click)="setTab('partners')"
                    class="px-4 py-2 text-sm font-medium rounded-t-lg transition"
                    [class.bg-gray-800]="activeTab() === 'partners'"
                    [class.text-white]="activeTab() === 'partners'"
                    [class.text-gray-400]="activeTab() !== 'partners'"
                    [class.hover:text-white]="activeTab() !== 'partners'">
              Partners
            </button>
            }
            <button (click)="setTab('structure')"
                    class="px-4 py-2 text-sm font-medium rounded-t-lg transition"
                    [class.bg-gray-800]="activeTab() === 'structure'"
                    [class.text-white]="activeTab() === 'structure'"
                    [class.text-gray-400]="activeTab() !== 'structure'"
                    [class.hover:text-white]="activeTab() !== 'structure'">
              Our structure
            </button>
            <button (click)="setTab('ai')"
                    class="px-4 py-2 text-sm font-medium rounded-t-lg transition flex items-center gap-1.5"
                    [class.bg-gray-800]="activeTab() === 'ai'"
                    [class.text-white]="activeTab() === 'ai'"
                    [class.text-gray-400]="activeTab() !== 'ai'"
                    [class.hover:text-white]="activeTab() !== 'ai'">
              <span class="text-[var(--gold)]">✦</span> Shahin AI
            </button>
          </div>

          @if (activeTab() === 'leads') {
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <h2 class="text-xl font-bold">Leads</h2>
            <div class="flex items-center gap-3">
              <input [(ngModel)]="searchQuery" placeholder="Search name, email, company..."
                     (keyup.enter)="loadLeads()"
                     class="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" />
              <select [(ngModel)]="statusFilter" (change)="loadLeads()"
                      class="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="">All statuses</option>
                <option value="new">New</option>
                <option value="qualified">Qualified</option>
                <option value="contacted">Contacted</option>
                <option value="proposal">Proposal</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <button (click)="loadLeads()" class="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary)]/80 transition">
                Search
              </button>
            </div>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-800 text-gray-400">
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
                    <tr class="border-b border-gray-800/50 hover:bg-gray-800/50 cursor-pointer transition"
                        (click)="router.navigate(['/admin/leads', lead.id])">
                      <td class="px-4 py-3 font-mono text-xs text-[var(--gold)]">{{ lead.ticket_number }}</td>
                      <td class="px-4 py-3">
                        <p class="font-medium">{{ lead.contact_name }}</p>
                        <p class="text-gray-500 text-xs">{{ lead.contact_email }}</p>
                      </td>
                      <td class="px-4 py-3 text-gray-300">{{ lead.company_name }}</td>
                      <td class="px-4 py-3 text-gray-400">{{ lead.product_line || '—' }}</td>
                      <td class="px-4 py-3">
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium" [class]="statusClass(lead.status)">{{ lead.status }}</span>
                      </td>
                      <td class="px-4 py-3 text-gray-400 text-xs">{{ lead.assigned_to }}</td>
                      <td class="px-4 py-3 text-gray-500 text-xs">{{ lead.created_at | date:'mediumDate' }}</td>
                    </tr>
                  } @empty {
                    <tr><td colspan="7" class="px-4 py-10 text-center text-gray-500">No leads found</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          @if (totalLeads() > leads().length) {
            <div class="flex items-center justify-between mt-4 text-sm text-gray-400">
              <span>Showing {{ leads().length }} of {{ totalLeads() }}</span>
              <div class="flex gap-2">
                <button (click)="prevPage()" [disabled]="currentPage() <= 1"
                        class="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-30 transition">Prev</button>
                <button (click)="nextPage()" [disabled]="leads().length < 25"
                        class="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-30 transition">Next</button>
              </div>
            </div>
          }
          }

          @if (activeTab() === 'partners') {
          <div class="mb-6">
            <h2 class="text-xl font-bold mb-4">Partner applications</h2>
            <p class="text-gray-400 text-sm mb-4">Approve partners to give them an API key for submitting leads.</p>
          </div>
          <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-800 text-gray-400">
                    <th class="text-left font-medium px-4 py-3">Company</th>
                    <th class="text-left font-medium px-4 py-3">Contact</th>
                    <th class="text-left font-medium px-4 py-3">Type</th>
                    <th class="text-left font-medium px-4 py-3">Status</th>
                    <th class="text-left font-medium px-4 py-3">Date</th>
                    <th class="text-left font-medium px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of partners(); track p.id) {
                    <tr class="border-b border-gray-800/50 hover:bg-gray-800/50">
                      <td class="px-4 py-3">
                        <p class="font-medium">{{ p.company_name }}</p>
                        @if (p.company_website) {
                          <a [href]="p.company_website" target="_blank" rel="noopener" class="text-xs text-[var(--gold)] hover:underline">{{ p.company_website }}</a>
                        }
                      </td>
                      <td class="px-4 py-3">
                        <p class="font-medium">{{ p.contact_name }}</p>
                        <p class="text-gray-500 text-xs">{{ p.contact_email }}</p>
                      </td>
                      <td class="px-4 py-3 text-gray-300 capitalize">{{ p.partner_type }}</td>
                      <td class="px-4 py-3">
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium" [class]="partnerStatusClass(p.status)">{{ p.status }}</span>
                      </td>
                      <td class="px-4 py-3 text-gray-500 text-xs">{{ p.created_at | date:'mediumDate' }}</td>
                      <td class="px-4 py-3">
                        @if (p.status === 'pending' || p.status === 'suspended') {
                          <button (click)="approvePartner(p.id)" [disabled]="partnerActionPending()"
                                  class="mr-2 px-2 py-1 rounded bg-emerald-600/80 text-white text-xs hover:bg-emerald-600 transition disabled:opacity-50">Approve</button>
                        }
                        @if (p.status === 'pending' || p.status === 'approved') {
                          <button (click)="setPartnerStatus(p.id, 'rejected')" [disabled]="partnerActionPending()"
                                  class="mr-2 px-2 py-1 rounded bg-red-600/80 text-white text-xs hover:bg-red-600 transition disabled:opacity-50">Reject</button>
                        }
                        @if (p.status === 'approved') {
                          <button (click)="setPartnerStatus(p.id, 'suspended')" [disabled]="partnerActionPending()"
                                  class="px-2 py-1 rounded bg-amber-600/80 text-white text-xs hover:bg-amber-600 transition disabled:opacity-50">Suspend</button>
                        }
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6" class="px-4 py-10 text-center text-gray-500">No partners found</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
          @if (apiKeyModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" (click)="closeApiKeyModal()">
              <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-xl" (click)="$event.stopPropagation()">
                <h3 class="text-lg font-bold mb-2">Partner approved</h3>
                <p class="text-gray-400 text-sm mb-4">Send this API key to the partner. They will use it in the <code class="bg-gray-800 px-1 rounded">X-Api-Key</code> header when submitting leads.</p>
                <div class="flex items-center gap-2">
                  <input [value]="apiKeyModal()!" readonly
                         class="flex-1 bg-gray-800 text-white font-mono text-sm px-3 py-2 rounded-lg border border-gray-700" />
                  <button (click)="copyApiKey()" class="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition">Copy</button>
                </div>
                <button (click)="closeApiKeyModal()" class="mt-4 w-full py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 transition">Close</button>
              </div>
              </div>
          }
          }

          @if (activeTab() === 'ai') {
          <div class="mb-4">
            <h2 class="text-xl font-bold mb-1">&#10022; Shahin AI Assistant</h2>
            <p class="text-gray-400 text-sm">Autonomous ICT Consultant powered by Claude.</p>
          </div>
          <div class="flex gap-2 mb-5">
            <button (click)="aiSubTab.set('chat')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition" [class.bg-blue-700]="aiSubTab()==='chat'" [class.text-white]="aiSubTab()==='chat'" [class.bg-gray-800]="aiSubTab()!=='chat'" [class.text-gray-400]="aiSubTab()!=='chat'">Chat</button>
            <button (click)="aiSubTab.set('summary')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition" [class.bg-blue-700]="aiSubTab()==='summary'" [class.text-white]="aiSubTab()==='summary'" [class.bg-gray-800]="aiSubTab()!=='summary'" [class.text-gray-400]="aiSubTab()!=='summary'">Lead Summary</button>
            <button (click)="aiSubTab.set('proposal')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition" [class.bg-blue-700]="aiSubTab()==='proposal'" [class.text-white]="aiSubTab()==='proposal'" [class.bg-gray-800]="aiSubTab()!=='proposal'" [class.text-gray-400]="aiSubTab()!=='proposal'">Draft Proposal</button>
            <button (click)="aiSubTab.set('overview')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition" [class.bg-blue-700]="aiSubTab()==='overview'" [class.text-white]="aiSubTab()==='overview'" [class.bg-gray-800]="aiSubTab()!=='overview'" [class.text-gray-400]="aiSubTab()!=='overview'">Pipeline Briefing</button>
          </div>
          <div [class.hidden]="aiSubTab()!=='chat'" class="bg-gray-900 border border-gray-800 rounded-xl flex flex-col" style="height:520px">
            <div class="flex-1 overflow-y-auto p-4 space-y-3">
              <div *ngIf="!aiMessages().length" class="flex flex-col items-center justify-center h-full text-gray-600 text-sm text-center">
                <p class="text-3xl mb-2">&#10022;</p>
                <p>Ask Shahin about leads, pipeline, ICT strategy, CITC requirements, proposals...</p>
              </div>
              @for (m of aiMessages(); track $index) {
                <div class="flex" [class.justify-end]="m.role==='user'">
                  <div class="max-w-prose rounded-xl px-4 py-3 text-sm whitespace-pre-wrap" [class.bg-gray-800]="m.role==='user'" [class.text-white]="m.role==='user'" [class.bg-blue-950]="m.role==='assistant'" [class.text-gray-200]="m.role==='assistant'" [class.border]="m.role==='assistant'" [class.border-blue-800]="m.role==='assistant'">
                    <span class="block text-xs mb-1" [class.text-yellow-400]="m.role==='assistant'" [class.text-gray-500]="m.role==='user'">{{ m.role==='assistant' ? 'Shahin' : 'You' }}</span>
                    {{ m.content }}
                  </div>
                </div>
              }
              <div *ngIf="aiLoading()" class="flex">
                <div class="bg-blue-950 border border-blue-800 rounded-xl px-4 py-3 text-sm text-gray-400">Shahin is thinking...</div>
              </div>
            </div>
            <div *ngIf="aiError()" class="px-4 py-2 text-red-400 text-sm border-t border-gray-800">{{ aiError() }}</div>
            <div class="border-t border-gray-800 p-3 flex gap-2">
              <input [(ngModel)]="aiInput" placeholder="Ask Shahin..." (keyup.enter)="sendAiMessage()" class="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
              <button (click)="sendAiMessage()" [disabled]="aiLoading() || !aiInput.trim()" class="px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-40">Send</button>
              <button (click)="clearAiChat()" class="px-3 py-2 rounded-xl bg-gray-800 text-gray-400 text-sm hover:bg-gray-700 transition">Clear</button>
            </div>
          </div>
          <div [class.hidden]="aiSubTab()!=='summary'" class="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 class="font-semibold mb-2">AI Lead Summary</h3>
            <p class="text-gray-400 text-sm mb-4">Enter a lead ID to get an executive summary + next actions.</p>
            <div class="flex gap-2 mb-4">
              <input [(ngModel)]="aiLeadId" placeholder="Lead ID (e.g. 42)" class="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
              <button (click)="fetchLeadSummary()" [disabled]="aiLeadLoading() || !aiLeadId.trim()" class="px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-40">{{ aiLeadLoading() ? 'Analysing...' : 'Analyse' }}</button>
            </div>
            <div *ngIf="aiLeadSummary()" class="bg-gray-800 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap">{{ aiLeadSummary() }}</div>
          </div>
          <div [class.hidden]="aiSubTab()!=='proposal'" class="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 class="font-semibold mb-2">AI Proposal Draft</h3>
            <p class="text-gray-400 text-sm mb-4">Shahin will draft a full proposal outline (EN + AR sections).</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><label class="block text-gray-400 text-xs mb-1">Client Company *</label><input [(ngModel)]="aiProposalForm.company_name" placeholder="Acme Telecom" class="w-full bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
              <div><label class="block text-gray-400 text-xs mb-1">Service / Scope *</label><input [(ngModel)]="aiProposalForm.service" placeholder="Network Design + Cybersecurity" class="w-full bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
              <div><label class="block text-gray-400 text-xs mb-1">Budget Range (SAR)</label><input [(ngModel)]="aiProposalForm.budget_range" placeholder="500,000 – 1,000,000" class="w-full bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
              <div><label class="block text-gray-400 text-xs mb-1">Timeline</label><input [(ngModel)]="aiProposalForm.timeline" placeholder="Q3 2026 (6 months)" class="w-full bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
              <div><label class="block text-gray-400 text-xs mb-1">Country / Region</label><input [(ngModel)]="aiProposalForm.country" placeholder="Saudi Arabia" class="w-full bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
              <div><label class="block text-gray-400 text-xs mb-1">Special Notes</label><input [(ngModel)]="aiProposalForm.notes" placeholder="Existing vendor: Cisco" class="w-full bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none" /></div>
            </div>
            <button (click)="draftProposal()" [disabled]="aiProposalLoading() || !aiProposalForm.company_name" class="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-40 mb-4">{{ aiProposalLoading() ? 'Generating...' : 'Generate Proposal Draft' }}</button>
            <div *ngIf="aiProposalResult()" class="bg-gray-800 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap max-h-96 overflow-y-auto">{{ aiProposalResult() }}</div>
          </div>
          <div [class.hidden]="aiSubTab()!=='overview'" class="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">AI Pipeline Briefing</h3>
              <button (click)="loadAiOverview()" [disabled]="aiOverviewLoading()" class="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-xs font-medium hover:bg-gray-700 transition disabled:opacity-40">{{ aiOverviewLoading() ? 'Generating...' : 'Refresh' }}</button>
            </div>
            <div *ngIf="aiOverviewLoading()" class="text-gray-500 text-sm">Shahin is analysing your pipeline...</div>
            <div *ngIf="aiOverview()" class="text-sm text-gray-200 whitespace-pre-wrap">{{ aiOverview() }}</div>
          </div>
          }

          @if (activeTab() === 'structure') {
          <div class="mb-6">
            <h2 class="text-xl font-bold mb-2">Dogan Consult — Company structure</h2>
            <p class="text-gray-400 text-sm">Teams used for lead assignment and internal representation.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (t of DOGAN_CONSULT_TEAMS; track t.value) {
              @if (t.value !== 'other') {
                <div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <p class="font-semibold text-[var(--gold)]">{{ t.labelEn }}</p>
                  <p class="text-gray-500 text-sm mt-0.5">{{ t.labelAr }}</p>
                  @if (t.descriptionEn) {
                    <p class="text-gray-400 text-xs mt-2">{{ t.descriptionEn }}</p>
                  }
                </div>
              }
            }
          </div>
          }
        </div>
      }
    </div>
  `,
})
export class AdminDashboardPage implements OnInit {
  private http = inject(HttpClient);
  router = inject(Router);

  authenticated = signal(false);
  loadingAuth = signal(false);
  authError = signal<string | null>(null);
  emailInput = '';
  passwordInput = '';
  adminToken = '';
  portalUser = signal<{ id?: string; email?: string; name?: string; role: string } | null>(null);

  stats = signal<DashboardStats | null>(null);
  leads = signal<LeadRow[]>([]);
  totalLeads = signal(0);
  currentPage = signal(1);
  searchQuery = '';
  statusFilter = '';

  activeTab = signal<'leads' | 'partners' | 'structure' | 'ai'>('leads');
  readonly DOGAN_CONSULT_TEAMS = DOGAN_CONSULT_TEAMS;
  partners = signal<PartnerRow[]>([]);
  partnerActionPending = signal(false);
  apiKeyModal = signal<string | null>(null);

  ngOnInit() {
    const saved = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dc_admin_token') : null;
    const userJson = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dc_portal_user') : null;
    if (saved) {
      this.adminToken = saved;
      this.portalUser.set(userJson ? JSON.parse(userJson) : { role: 'admin' });
      this.authenticated.set(true);
      if (!this.isAdmin()) this.activeTab.set('leads');
      this.loadData();
    }
  }

  isAdmin(): boolean {
    return this.portalUser()?.role === 'admin';
  }

  login() {
    const email = this.emailInput.trim();
    const password = this.passwordInput.trim();
    if (!password) return;
    this.loadingAuth.set(true);
    this.authError.set(null);
    const body = email ? { email, password } : { password };
    this.http.post<{ ok: boolean; token?: string; user?: { id?: string; email?: string; name?: string; role: string } }>('/api/v1/admin/login', body).subscribe({
      next: (r) => {
        this.loadingAuth.set(false);
        this.authenticated.set(true);
        if (r.token) {
          this.adminToken = r.token;
          this.portalUser.set(r.user || { role: 'admin' });
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('dc_admin_token', r.token);
            if (r.user) sessionStorage.setItem('dc_portal_user', JSON.stringify(r.user));
          }
        } else {
          this.adminToken = password;
          this.portalUser.set({ role: 'admin' });
          if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('dc_admin_token', password);
        }
        this.loadData();
      },
      error: () => {
        this.loadingAuth.set(false);
        this.authError.set('Invalid email or password');
      },
    });
  }

  logout() {
    this.authenticated.set(false);
    this.adminToken = '';
    this.emailInput = '';
    this.passwordInput = '';
    this.portalUser.set(null);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('dc_admin_token');
      sessionStorage.removeItem('dc_portal_user');
    }
  }

  private headers(): Record<string, string> {
    if (this.adminToken.startsWith('eyJ')) return { Authorization: `Bearer ${this.adminToken}` };
    return { 'x-admin-token': this.adminToken };
  }

  loadData() {
    this.loadStats();
    this.loadLeads();
  }

  loadStats() {
    this.http.get<DashboardStats>('/api/v1/dashboard/stats', { headers: this.headers() }).subscribe({
      next: (s) => this.stats.set(s),
      error: () => {},
    });
  }

  loadLeads() {
    const params: Record<string, string> = { page: String(this.currentPage()), limit: '25' };
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.searchQuery.trim()) params['search'] = this.searchQuery.trim();

    this.http.get<{ total: number; data: LeadRow[] }>('/api/v1/leads', { headers: this.headers(), params }).subscribe({
      next: (r) => { this.leads.set(r.data); this.totalLeads.set(r.total); },
      error: (err) => {
        if (err.status === 401) { this.logout(); this.authError.set('Session expired'); }
      },
    });
  }

  getStatusCount(status: string): number {
    const found = this.stats()?.by_status?.find(s => s.status === status);
    return found ? +found.cnt : 0;
  }

  prevPage() { if (this.currentPage() > 1) { this.currentPage.set(this.currentPage() - 1); this.loadLeads(); } }
  nextPage() { this.currentPage.set(this.currentPage() + 1); this.loadLeads(); }

  statusClass(s: string): string {
    const map: Record<string, string> = {
      new: 'bg-sky-500/20 text-sky-300',
      qualified: 'bg-purple-500/20 text-purple-300',
      contacted: 'bg-amber-500/20 text-amber-300',
      proposal: 'bg-indigo-500/20 text-indigo-300',
      won: 'bg-emerald-500/20 text-emerald-300',
      lost: 'bg-red-500/20 text-red-300',
      duplicate: 'bg-gray-500/20 text-gray-400',
      spam: 'bg-red-800/20 text-red-400',
    };
    return map[s] || 'bg-white/10 text-white/60';
  }

  setTab(tab: 'leads' | 'partners' | 'structure' | 'ai') {
    this.activeTab.set(tab);
    if (tab === 'partners') this.loadPartners();
    if (tab === 'ai') this.loadAiOverview();
  }

  loadPartners() {
    this.http.get<{ data: PartnerRow[] }>('/api/v1/admin/partners', { headers: this.headers() }).subscribe({
      next: (r) => this.partners.set(r.data),
      error: (err) => { if (err.status === 401) this.logout(); },
    });
  }

  partnerStatusClass(s: string): string {
    const map: Record<string, string> = {
      pending: 'bg-amber-500/20 text-amber-300',
      approved: 'bg-emerald-500/20 text-emerald-300',
      rejected: 'bg-red-500/20 text-red-300',
      suspended: 'bg-gray-500/20 text-gray-400',
    };
    return map[s] || 'bg-white/10 text-white/60';
  }

  approvePartner(id: string) {
    this.setPartnerStatus(id, 'approved');
  }

  setPartnerStatus(id: string, status: string) {
    this.partnerActionPending.set(true);
    this.http.patch<{ ok: boolean; status: string; api_key?: string }>(`/api/v1/admin/partners/${id}`, { status }, { headers: this.headers() }).subscribe({
      next: (r) => {
        this.partnerActionPending.set(false);
        this.loadPartners();
        if (r.status === 'approved' && r.api_key) this.apiKeyModal.set(r.api_key);
      },
      error: () => this.partnerActionPending.set(false),
    });
  }

  closeApiKeyModal() {
    this.apiKeyModal.set(null);
  }

  copyApiKey() {
    const key = this.apiKeyModal();
    if (key && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(key);
    }
  }

  // ── AI Assistant ────────────────────────────────────────
  aiMessages = signal<{ role: 'user' | 'assistant'; content: string }[]>([]);
  aiInput = '';
  aiLoading = signal(false);
  aiError = signal<string | null>(null);
  aiOverview = signal<string | null>(null);
  aiOverviewLoading = signal(false);
  aiLeadId = '';
  aiLeadSummary = signal<string | null>(null);
  aiLeadLoading = signal(false);
  aiProposalResult = signal<string | null>(null);
  aiProposalLoading = signal(false);
  aiProposalForm = { company_name: '', service: '', budget_range: '', timeline: '', country: 'Saudi Arabia', notes: '' };
  aiSubTab = signal<'chat' | 'summary' | 'proposal' | 'overview'>('chat');

  loadAiOverview() {
    this.aiOverviewLoading.set(true);
    this.http.get<{ ok: boolean; summary: string }>('/api/v1/ai/leads-overview', { headers: this.headers() }).subscribe({
      next: (r) => { this.aiOverviewLoading.set(false); this.aiOverview.set(r.summary); },
      error: (e) => { this.aiOverviewLoading.set(false); this.aiOverview.set('Error: ' + (e.error?.error || e.message)); },
    });
  }

  sendAiMessage() {
    const text = this.aiInput.trim();
    if (!text || this.aiLoading()) return;
    const msgs = [...this.aiMessages(), { role: 'user' as const, content: text }];
    this.aiMessages.set(msgs);
    this.aiInput = '';
    this.aiLoading.set(true);
    this.aiError.set(null);
    this.http.post<{ ok: boolean; reply: string }>('/api/v1/ai/chat', { messages: msgs }, { headers: this.headers() }).subscribe({
      next: (r) => {
        this.aiLoading.set(false);
        this.aiMessages.set([...this.aiMessages(), { role: 'assistant', content: r.reply }]);
      },
      error: (e) => { this.aiLoading.set(false); this.aiError.set(e.error?.error || 'AI error'); },
    });
  }

  clearAiChat() {
    this.aiMessages.set([]);
    this.aiError.set(null);
  }

  fetchLeadSummary() {
    const id = this.aiLeadId.trim();
    if (!id) return;
    this.aiLeadLoading.set(true);
    this.aiLeadSummary.set(null);
    this.http.post<{ ok: boolean; summary: string }>(`/api/v1/ai/lead-summary/${id}`, {}, { headers: this.headers() }).subscribe({
      next: (r) => { this.aiLeadLoading.set(false); this.aiLeadSummary.set(r.summary); },
      error: (e) => { this.aiLeadLoading.set(false); this.aiLeadSummary.set('Error: ' + (e.error?.error || e.message)); },
    });
  }

  draftProposal() {
    this.aiProposalLoading.set(true);
    this.aiProposalResult.set(null);
    this.http.post<{ ok: boolean; draft: string }>('/api/v1/ai/draft-proposal', this.aiProposalForm, { headers: this.headers() }).subscribe({
      next: (r) => { this.aiProposalLoading.set(false); this.aiProposalResult.set(r.draft); },
      error: (e) => { this.aiProposalLoading.set(false); this.aiProposalResult.set('Error: ' + (e.error?.error || e.message)); },
    });
  }
}
