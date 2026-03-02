import { Component, inject, signal, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { PartnerMessage } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-messaging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-th-card border border-th-border rounded-xl overflow-hidden flex flex-col" [style.height]="fullHeight ? 'calc(100vh - 220px)' : '500px'">
      <!-- Header -->
      <div class="px-4 py-3 border-b border-th-border-lt bg-th-bg-alt shrink-0">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-th-text-2">{{ i18n.t('Messages', 'الرسائل') }}</h3>
          @if (unreadCount() > 0) {
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {{ unreadCount() }} {{ i18n.t('unread', 'غير مقروءة') }}
            </span>
          }
        </div>
      </div>

      <!-- Messages List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3" #messagesContainer #scrollContainer>
        @if (messages().length === 0) {
          <div class="flex items-center justify-center h-full text-center">
            <div>
              <span class="text-3xl">💬</span>
              <p class="text-sm text-th-text-3 mt-2">{{ i18n.t('No messages yet. Start a conversation!', 'لا رسائل بعد. ابدأ محادثة!') }}</p>
            </div>
          </div>
        }
        @for (msg of messages(); track msg.id) {
          <div class="flex" [class.justify-end]="msg.sender === 'partner'" [class.justify-start]="msg.sender !== 'partner'">
            <div class="max-w-[75%] rounded-xl px-4 py-2.5"
                 [class.bg-primary]="msg.sender === 'partner'"
                 [class.text-white]="msg.sender === 'partner'"
                 [class.bg-th-bg-tert]="msg.sender !== 'partner'"
                 [class.text-th-text]="msg.sender !== 'partner'">
              @if (msg.sender !== 'partner') {
                <p class="text-[10px] font-semibold mb-0.5 text-th-text-3">{{ msg.sender_name || 'Account Manager' }}</p>
              }
              <p class="text-sm leading-relaxed">{{ msg.body }}</p>
              <p class="text-[10px] mt-1 opacity-60">{{ msg.created_at | date:'short' }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Input -->
      <div class="p-3 border-t border-th-border-lt shrink-0">
        <div class="flex gap-2">
          <input [(ngModel)]="newMessage" (keyup.enter)="send()"
                 [placeholder]="i18n.t('Type a message...', 'اكتب رسالة...')"
                 class="flex-1 bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <button (click)="send()" [disabled]="!newMessage.trim() || sending()"
                  class="px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PartnerMessagingComponent implements OnInit, AfterViewChecked {
  @Input() fullHeight = false;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  messages = signal<PartnerMessage[]>([]);
  unreadCount = signal(0);
  newMessage = '';
  sending = signal(false);
  private shouldScroll = true;

  ngOnInit() { this.load(); }

  ngAfterViewChecked() {
    if (this.shouldScroll) this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      const el = this.scrollContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }

  load() {
    this.api.getMessages().subscribe({
      next: res => {
        this.messages.set(res.data.reverse());
        this.unreadCount.set(res.unread_count);
        this.shouldScroll = true;
      },
    });
  }

  send() {
    const body = this.newMessage.trim();
    if (!body) return;
    this.sending.set(true);
    this.newMessage = '';
    this.api.sendMessage(body).subscribe({
      next: () => { this.sending.set(false); this.load(); },
      error: () => this.sending.set(false),
    });
  }
}
