import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { PartnerRow, ChatMessage } from '../../../core/models/admin.models';

@Component({
  selector: 'admin-partners-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-4">Partner applications</h2>
      <p class="text-th-text-3 text-sm mb-4">Approve partners to give them an API key for submitting leads.</p>
    </div>
    <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-th-border text-th-text-3">
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
              <tr class="border-b border-th-border/50 hover:bg-th-bg-tert/50">
                <td class="px-4 py-3">
                  <p class="font-medium">{{ p.company_name }}</p>
                  @if (p.company_website) {
                    <a [href]="p.company_website" target="_blank" rel="noopener" class="text-xs text-gold hover:underline">{{ p.company_website }}</a>
                  }
                </td>
                <td class="px-4 py-3">
                  <p class="font-medium">{{ p.contact_name }}</p>
                  <p class="text-th-text-3 text-xs">{{ p.contact_email }}</p>
                </td>
                <td class="px-4 py-3 text-th-text-3 capitalize">{{ p.partner_type }}</td>
                <td class="px-4 py-3">
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium" [class]="partnerStatusClass(p.status)">{{ p.status }}</span>
                </td>
                <td class="px-4 py-3 text-th-text-3 text-xs">{{ p.created_at | date:'mediumDate' }}</td>
                <td class="px-4 py-3">
                  @if (p.status === 'pending' || p.status === 'suspended') {
                    <button (click)="approvePartner(p.id)" [disabled]="actionPending()"
                            class="mr-2 px-2 py-1 rounded bg-emerald-600/80 text-white text-xs hover:bg-emerald-600 transition disabled:opacity-50">Approve</button>
                  }
                  @if (p.status === 'pending' || p.status === 'approved') {
                    <button (click)="setStatus(p.id, 'rejected')" [disabled]="actionPending()"
                            class="mr-2 px-2 py-1 rounded bg-red-600/80 text-white text-xs hover:bg-red-600 transition disabled:opacity-50">Reject</button>
                  }
                  @if (p.status === 'approved') {
                    <button (click)="setStatus(p.id, 'suspended')" [disabled]="actionPending()"
                            class="mr-2 px-2 py-1 rounded bg-amber-600/80 text-th-text text-xs hover:bg-amber-600 transition disabled:opacity-50">Suspend</button>
                    <button (click)="openChat(p.id, p.company_name)"
                            class="px-2 py-1 rounded bg-primary/80 text-white text-xs hover:bg-primary transition">
                      Messages
                    </button>
                  }
                </td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="px-4 py-10 text-center text-th-text-3">No partners found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- API Key Modal -->
    @if (apiKeyModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-th-bg-inv/70 p-4" (click)="closeApiKeyModal()">
        <div class="bg-th-card border border-th-border-dk rounded-xl p-6 max-w-md w-full shadow-xl" (click)="$event.stopPropagation()">
          <h3 class="text-lg font-bold mb-2">Partner approved</h3>
          <p class="text-th-text-3 text-sm mb-4">Send this API key to the partner. They will use it in the <code class="bg-th-bg-tert px-1 rounded">X-Api-Key</code> header when submitting leads.</p>
          <div class="flex items-center gap-2">
            <input [value]="apiKeyModal()!" readonly
                   class="flex-1 bg-th-bg-tert text-th-text font-mono text-sm px-3 py-2 rounded-lg border border-th-border-dk" />
            <button (click)="copyApiKey()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition">Copy</button>
          </div>
          <button (click)="closeApiKeyModal()" class="mt-4 w-full py-2 rounded-lg border border-th-border-dk text-th-text-3 text-sm hover:bg-th-bg-tert transition">Close</button>
        </div>
      </div>
    }

    <!-- Partner Chat Modal -->
    @if (chatPartnerId()) {
      <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-th-bg-inv/60 p-4" (click)="closeChat()">
        <div class="bg-th-card border border-th-border-dk rounded-xl w-full max-w-lg shadow-xl flex flex-col" style="height: 520px;" (click)="$event.stopPropagation()">
          <div class="px-5 py-3 border-b border-th-border flex items-center justify-between shrink-0">
            <div>
              <h3 class="font-bold text-sm">Messages — {{ chatPartnerName() }}</h3>
              <p class="text-th-text-3 text-xs">Partner conversation</p>
            </div>
            <button (click)="closeChat()" class="text-th-text-3 hover:text-th-text transition">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            @if (chatLoading()) {
              <div class="flex items-center justify-center h-full">
                <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
              </div>
            } @else if (chatMessages().length === 0) {
              <div class="flex items-center justify-center h-full text-center">
                <p class="text-sm text-th-text-3">No messages yet. Start the conversation!</p>
              </div>
            } @else {
              @for (msg of chatMessages(); track msg.id) {
                <div class="flex" [class.justify-end]="msg.sender === 'manager'" [class.justify-start]="msg.sender !== 'manager'">
                  <div class="max-w-[75%] rounded-xl px-4 py-2.5"
                       [class.bg-primary]="msg.sender === 'manager'"
                       [class.text-white]="msg.sender === 'manager'"
                       [class.bg-th-bg-tert]="msg.sender !== 'manager'"
                       [class.text-th-text]="msg.sender !== 'manager'">
                    @if (msg.sender !== 'manager') {
                      <p class="text-[10px] font-semibold mb-0.5 text-th-text-3">{{ msg.sender_name || 'Partner' }}</p>
                    }
                    <p class="text-sm leading-relaxed">{{ msg.body }}</p>
                    <p class="text-[10px] mt-1 opacity-60">{{ msg.created_at | date:'short' }}</p>
                  </div>
                </div>
              }
            }
          </div>
          <div class="p-3 border-t border-th-border shrink-0">
            <div class="flex gap-2">
              <input [(ngModel)]="chatReplyText" (keyup.enter)="sendReply()"
                     placeholder="Type a reply..."
                     class="flex-1 bg-th-bg-tert border border-th-border-dk rounded-lg px-3 py-2.5 text-sm text-th-text placeholder-th-text-3 focus:outline-none focus:ring-2 focus:ring-primary" />
              <button (click)="sendReply()" [disabled]="!chatReplyText.trim() || chatSending()"
                      class="px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/80 transition disabled:opacity-50 text-sm font-medium">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminPartnersTableComponent {
  private api = inject(AdminApiService);

  partners = signal<PartnerRow[]>([]);
  actionPending = signal(false);
  apiKeyModal = signal<string | null>(null);

  chatPartnerId = signal<string | null>(null);
  chatPartnerName = signal('');
  chatMessages = signal<ChatMessage[]>([]);
  chatLoading = signal(false);
  chatSending = signal(false);
  chatReplyText = '';

  sessionExpired = output<void>();

  ngOnInit() {
    this.loadPartners();
  }

  loadPartners() {
    this.api.getPartners().subscribe({
      next: (r) => this.partners.set(r.data),
      error: (err) => { if (err.status === 401) this.sessionExpired.emit(); },
    });
  }

  partnerStatusClass(s: string): string {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
      suspended: 'bg-gray-100 text-gray-500',
    };
    return map[s] || 'bg-th-card/10 text-th-text/60';
  }

  approvePartner(id: string) { this.setStatus(id, 'approved'); }

  setStatus(id: string, status: string) {
    this.actionPending.set(true);
    this.api.setPartnerStatus(id, status).subscribe({
      next: (r) => {
        this.actionPending.set(false);
        this.loadPartners();
        if (r.status === 'approved' && r.api_key) this.apiKeyModal.set(r.api_key);
      },
      error: () => this.actionPending.set(false),
    });
  }

  closeApiKeyModal() { this.apiKeyModal.set(null); }

  copyApiKey() {
    const key = this.apiKeyModal();
    if (key && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(key);
    }
  }

  openChat(partnerId: string, companyName: string) {
    this.chatPartnerId.set(partnerId);
    this.chatPartnerName.set(companyName);
    this.chatReplyText = '';
    this.loadChatMessages(partnerId);
  }

  closeChat() {
    this.chatPartnerId.set(null);
    this.chatMessages.set([]);
  }

  loadChatMessages(partnerId: string) {
    this.chatLoading.set(true);
    this.api.getPartnerMessages(partnerId).subscribe({
      next: (r) => { this.chatMessages.set(r.data || []); this.chatLoading.set(false); },
      error: () => this.chatLoading.set(false),
    });
  }

  sendReply() {
    const body = this.chatReplyText.trim();
    const partnerId = this.chatPartnerId();
    if (!body || !partnerId) return;
    this.chatSending.set(true);
    this.chatReplyText = '';
    this.api.sendPartnerMessage(partnerId, body).subscribe({
      next: () => { this.chatSending.set(false); this.loadChatMessages(partnerId); },
      error: () => this.chatSending.set(false),
    });
  }
}
