import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminApiService } from '../../../core/services/admin-api.service';

interface MailMessage {
  id: string;
  subject: string;
  bodyPreview: string;
  body?: { content: string; contentType: string };
  from: { emailAddress: { name: string; address: string } };
  toRecipients: { emailAddress: { name: string; address: string } }[];
  receivedDateTime: string;
  isRead: boolean;
  hasAttachments: boolean;
  importance: string;
}

@Component({
  selector: 'admin-email-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">Email</h2>
      <div class="flex items-center gap-3">
        <select [(ngModel)]="account" (change)="loadInbox()" class="bg-th-card border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="admin">Admin Mailbox</option>
          <option value="platform">Platform Mailbox</option>
        </select>
        <button (click)="showCompose.set(true)" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition">Compose</button>
      </div>
    </div>

    <!-- Unread Count -->
    <div class="flex gap-4 mb-4">
      @if (unreadAdmin() !== null) {
        <span class="text-xs text-th-text-3">Admin: <span class="text-primary font-bold">{{ unreadAdmin() }}</span> unread</span>
      }
      @if (unreadPlatform() !== null) {
        <span class="text-xs text-th-text-3">Platform: <span class="text-primary font-bold">{{ unreadPlatform() }}</span> unread</span>
      }
    </div>

    <!-- Message List + Detail Split -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Inbox List -->
      <div class="bg-th-card border border-th-border rounded-xl overflow-hidden" [ngClass]="selectedMessage() ? 'md:col-span-1' : 'md:col-span-3'">
        <div class="divide-y divide-th-border/50 max-h-[600px] overflow-y-auto">
          @for (msg of messages(); track msg.id) {
            <div (click)="selectMessage(msg)" class="px-4 py-3 hover:bg-th-bg-tert/50 cursor-pointer transition"
                 [class.bg-th-bg-tert]="selectedMessage()?.id === msg.id"
                 [class.font-semibold]="!msg.isRead">
              <div class="flex items-center justify-between">
                <span class="text-sm truncate max-w-[200px]">{{ msg.from.emailAddress.name || msg.from.emailAddress.address }}</span>
                <span class="text-[10px] text-th-text-3 whitespace-nowrap ml-2">{{ msg.receivedDateTime | date:'shortDate' }}</span>
              </div>
              <p class="text-sm truncate" [class.text-th-text]="!msg.isRead" [class.text-th-text-3]="msg.isRead">{{ msg.subject }}</p>
              <p class="text-xs text-th-text-3 truncate mt-0.5">{{ msg.bodyPreview }}</p>
              <div class="flex items-center gap-2 mt-1">
                @if (!msg.isRead) { <span class="w-2 h-2 rounded-full bg-primary"></span> }
                @if (msg.hasAttachments) { <span class="text-[10px] text-th-text-3">att</span> }
                @if (msg.importance === 'high') { <span class="text-[10px] text-red-600">!</span> }
              </div>
            </div>
          } @empty {
            <div class="px-4 py-10 text-center text-th-text-3 text-sm">
              {{ loading() ? 'Loading...' : 'No messages' }}
            </div>
          }
        </div>
        @if (messages().length >= 20) {
          <div class="px-4 py-2 border-t border-th-border text-center">
            <button (click)="loadMore()" class="text-xs text-primary hover:underline">Load more</button>
          </div>
        }
      </div>

      <!-- Message Detail -->
      @if (selectedMessage()) {
        <div class="md:col-span-2 bg-th-card border border-th-border rounded-xl p-6 max-h-[600px] overflow-y-auto">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold">{{ selectedMessage()!.subject }}</h3>
              <p class="text-sm text-th-text-3 mt-1">
                From: <span class="text-th-text">{{ selectedMessage()!.from.emailAddress.name }}</span>
                &lt;{{ selectedMessage()!.from.emailAddress.address }}&gt;
              </p>
              <p class="text-xs text-th-text-3 mt-0.5">{{ selectedMessage()!.receivedDateTime | date:'medium' }}</p>
            </div>
            <button (click)="selectedMessage.set(null)" class="text-th-text-3 hover:text-th-text text-lg transition">x</button>
          </div>

          <div class="border-t border-th-border pt-4 mb-4 prose prose-sm prose-invert max-w-none" [innerHTML]="messageBody()"></div>

          <!-- Reply -->
          <div class="border-t border-th-border pt-4">
            <textarea [(ngModel)]="replyBody" rows="4" placeholder="Write your reply..."
                      class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary mb-3"></textarea>
            <button (click)="sendReply()" [disabled]="!replyBody.trim() || sendingReply()"
                    class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition disabled:opacity-50">
              {{ sendingReply() ? 'Sending...' : 'Reply' }}
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Compose Modal -->
    @if (showCompose()) {
      <div class="fixed inset-0 bg-th-bg-inv/50 z-50 flex items-center justify-center" (click)="showCompose.set(false)">
        <div class="bg-th-card border border-th-border rounded-xl p-6 w-full max-w-lg" (click)="$event.stopPropagation()">
          <h3 class="text-lg font-semibold mb-4">Compose Email</h3>
          <input [(ngModel)]="composeTo" type="email" placeholder="To"
                 class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          <input [(ngModel)]="composeSubject" placeholder="Subject"
                 class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          <textarea [(ngModel)]="composeBody" rows="6" placeholder="Message body..."
                    class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary mb-4"></textarea>
          @if (composeError()) {
            <p class="text-red-600 text-xs mb-3">{{ composeError() }}</p>
          }
          <div class="flex justify-end gap-3">
            <button (click)="showCompose.set(false)" class="px-4 py-2 rounded-lg bg-th-bg-tert text-th-text text-sm">Cancel</button>
            <button (click)="sendCompose()" [disabled]="sendingCompose() || !composeTo.trim() || !composeSubject.trim()"
                    class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition disabled:opacity-50">
              {{ sendingCompose() ? 'Sending...' : 'Send' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminEmailClientComponent implements OnInit {
  private http = inject(HttpClient);
  private api = inject(AdminApiService);

  account = 'admin';
  messages = signal<MailMessage[]>([]);
  selectedMessage = signal<MailMessage | null>(null);
  messageBody = signal('');
  loading = signal(false);
  skip = 0;

  unreadAdmin = signal<number | null>(null);
  unreadPlatform = signal<number | null>(null);

  replyBody = '';
  sendingReply = signal(false);

  showCompose = signal(false);
  composeTo = '';
  composeSubject = '';
  composeBody = '';
  sendingCompose = signal(false);
  composeError = signal('');

  private headers(): HttpHeaders {
    const t = this.api.token();
    if (t.startsWith('eyJ')) return new HttpHeaders({ Authorization: `Bearer ${t}` });
    return new HttpHeaders({ 'x-admin-token': t });
  }

  ngOnInit() {
    this.loadInbox();
    this.loadUnread();
  }

  loadUnread() {
    this.http.get<any>('/api/v1/admin/mail/unread', { headers: this.headers() }).subscribe({
      next: (r) => {
        this.unreadAdmin.set(r.admin?.unreadItemCount ?? null);
        this.unreadPlatform.set(r.platform?.unreadItemCount ?? null);
      },
      error: () => {},
    });
  }

  loadInbox() {
    this.loading.set(true);
    this.skip = 0;
    this.http.get<any>(`/api/v1/admin/mail/inbox?account=${this.account}&top=20&skip=0`, { headers: this.headers() }).subscribe({
      next: (r) => { this.messages.set(r.messages || []); this.loading.set(false); },
      error: () => { this.messages.set([]); this.loading.set(false); },
    });
  }

  loadMore() {
    this.skip += 20;
    this.http.get<any>(`/api/v1/admin/mail/inbox?account=${this.account}&top=20&skip=${this.skip}`, { headers: this.headers() }).subscribe({
      next: (r) => this.messages.update(list => [...list, ...(r.messages || [])]),
      error: () => {},
    });
  }

  selectMessage(msg: MailMessage) {
    this.selectedMessage.set(msg);
    this.replyBody = '';
    // Fetch full message body
    this.http.get<any>(`/api/v1/admin/mail/messages/${msg.id}?account=${this.account}`, { headers: this.headers() }).subscribe({
      next: (r) => {
        const full = r.message;
        this.messageBody.set(full?.body?.content || msg.bodyPreview);
        // Mark as read
        if (!msg.isRead) {
          this.http.patch<any>(`/api/v1/admin/mail/messages/${msg.id}/read?account=${this.account}`, { isRead: true }, { headers: this.headers() }).subscribe();
          this.messages.update(list => list.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
        }
      },
      error: () => this.messageBody.set(msg.bodyPreview),
    });
  }

  sendReply() {
    const msg = this.selectedMessage();
    if (!msg || !this.replyBody.trim()) return;
    this.sendingReply.set(true);
    this.http.post<any>(`/api/v1/admin/mail/messages/${msg.id}/reply?account=${this.account}`, { body: this.replyBody }, { headers: this.headers() }).subscribe({
      next: () => { this.sendingReply.set(false); this.replyBody = ''; },
      error: () => this.sendingReply.set(false),
    });
  }

  sendCompose() {
    if (!this.composeTo.trim() || !this.composeSubject.trim()) return;
    this.sendingCompose.set(true);
    this.composeError.set('');
    this.http.post<any>('/api/v1/admin/mail/send', {
      to: this.composeTo.trim(),
      subject: this.composeSubject.trim(),
      body: this.composeBody,
      account: this.account,
    }, { headers: this.headers() }).subscribe({
      next: () => {
        this.sendingCompose.set(false);
        this.showCompose.set(false);
        this.composeTo = '';
        this.composeSubject = '';
        this.composeBody = '';
      },
      error: (e) => {
        this.sendingCompose.set(false);
        this.composeError.set(e.error?.error || 'Failed to send');
      },
    });
  }
}
