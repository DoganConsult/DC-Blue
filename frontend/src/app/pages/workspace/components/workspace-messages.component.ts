import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientApiService } from '../../../core/services/client-api.service';
import { ClientMessage } from '../../../core/models/client.models';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-workspace-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold">{{ i18n.t('Messages', 'الرسائل') }}</h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Message List -->
      <div class="lg:col-span-2 bg-th-card border border-th-border rounded-xl flex flex-col" style="min-height: 500px">
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          @if (loading()) {
            <div class="flex items-center justify-center py-10">
              <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          } @else if (messages().length === 0) {
            <div class="py-10 text-center text-th-text-3 text-sm">{{ i18n.t('No messages yet. Start a conversation with the team.', 'لا توجد رسائل حتى الآن. ابدأ محادثة مع الفريق.') }}</div>
          } @else {
            @for (msg of messages(); track msg.id) {
              <div class="flex" [class.justify-end]="msg.sender === 'client'">
                <div class="max-w-[75%] rounded-xl px-4 py-3"
                     [class]="msg.sender === 'client' ? 'bg-primary/10 text-th-text' : 'bg-th-bg-tert text-th-text'">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-semibold">{{ msg.sender_name }}</span>
                    <span class="text-[10px] text-th-text-3">{{ msg.created_at | date:'short' }}</span>
                  </div>
                  <p class="text-sm whitespace-pre-wrap">{{ msg.body }}</p>
                </div>
              </div>
            }
          }
        </div>

        <!-- Compose -->
        <div class="border-t border-th-border p-4">
          <div class="flex gap-2">
            <input [(ngModel)]="newMessage" name="newMessage" [placeholder]="i18n.t('Type a message...', 'اكتب رسالة...')"
                   (keyup.enter)="send()"
                   class="flex-1 bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <button (click)="send()" [disabled]="!newMessage.trim() || sending()"
                    class="px-5 py-2.5 bg-primary text-white text-sm rounded-xl hover:opacity-90 transition disabled:opacity-40">
              {{ sending() ? '...' : i18n.t('Send', 'إرسال') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Info Sidebar -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <h3 class="text-sm font-semibold mb-3">{{ i18n.t('About Messages', 'حول الرسائل') }}</h3>
        <div class="space-y-3 text-xs text-th-text-3">
          <p>{{ i18n.t('Messages go directly to the Dogan Consult team. They can see your messages in the admin portal.', 'الرسائل ترسل مباشرة إلى فريق دوغان للاستشارات. يمكنهم رؤية رسائلك في لوحة الإدارة.') }}</p>
          <p>{{ i18n.t('Use messages to ask questions about your pipeline, request updates on tenders, or discuss project details.', 'استخدم الرسائل للاستفسار عن سير العمليات أو طلب تحديثات المناقصات أو مناقشة تفاصيل المشاريع.') }}</p>
          <hr class="border-th-border" />
          <div>
            <span class="font-medium text-th-text block mb-1">{{ i18n.t('Quick Actions', 'إجراءات سريعة') }}</span>
            <button (click)="quickMessage(i18n.t('Can I get an update on my current pipeline?', 'هل يمكنني الحصول على تحديث عن سير عملياتي الحالي؟'))"
                    class="block w-full text-left px-3 py-2 rounded-lg bg-th-bg-tert hover:bg-th-bg-alt text-th-text transition mb-1">
              {{ i18n.t('Request pipeline update', 'طلب تحديث العمليات') }}
            </button>
            <button (click)="quickMessage(i18n.t('I would like to schedule a demo for my inquiry.', 'أرغب في جدولة عرض توضيحي لاستفساري.'))"
                    class="block w-full text-left px-3 py-2 rounded-lg bg-th-bg-tert hover:bg-th-bg-alt text-th-text transition mb-1">
              {{ i18n.t('Schedule a demo', 'جدولة عرض') }}
            </button>
            <button (click)="quickMessage(i18n.t('I have questions about my contract renewal.', 'لدي أسئلة حول تجديد عقدي.'))"
                    class="block w-full text-left px-3 py-2 rounded-lg bg-th-bg-tert hover:bg-th-bg-alt text-th-text transition">
              {{ i18n.t('Contract question', 'سؤال عن العقد') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WorkspaceMessagesComponent implements OnInit {
  private api = inject(ClientApiService);
  i18n = inject(I18nService);

  loading = signal(true);
  sending = signal(false);
  messages = signal<ClientMessage[]>([]);
  newMessage = '';

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.api.getMessages().subscribe({
      next: (r) => {
        this.messages.set(r.data.reverse());
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  send() {
    if (!this.newMessage.trim()) return;
    this.sending.set(true);
    this.api.sendMessage(this.newMessage.trim()).subscribe({
      next: (msg) => {
        this.messages.set([...this.messages(), msg]);
        this.newMessage = '';
        this.sending.set(false);
      },
      error: () => this.sending.set(false),
    });
  }

  quickMessage(text: string) {
    this.newMessage = text;
  }
}
