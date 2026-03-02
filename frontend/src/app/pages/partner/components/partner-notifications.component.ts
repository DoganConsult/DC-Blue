import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { PartnerNotification } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative" (click)="$event.stopPropagation()">
      <!-- Bell Button -->
      <button (click)="toggle()" class="relative p-2 rounded-lg hover:bg-th-bg-tert transition-colors">
        <svg class="w-5 h-5 text-th-text-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        @if (unreadCount() > 0) {
          <span class="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] px-1">
            {{ unreadCount() > 9 ? '9+' : unreadCount() }}
          </span>
        }
      </button>

      <!-- Dropdown -->
      @if (open()) {
        <div class="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-th-card border border-th-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-th-border-lt">
            <h3 class="text-sm font-semibold text-th-text">{{ i18n.t('Notifications', 'الإشعارات') }}</h3>
            @if (unreadCount() > 0) {
              <button (click)="markAllRead()" class="text-xs text-primary hover:underline">
                {{ i18n.t('Mark all read', 'قراءة الكل') }}
              </button>
            }
          </div>
          <div class="max-h-80 overflow-y-auto">
            @if (notifications().length === 0) {
              <div class="px-4 py-8 text-center text-th-text-3 text-sm">
                {{ i18n.t('No notifications', 'لا توجد إشعارات') }}
              </div>
            }
            @for (n of notifications(); track n.id) {
              <div (click)="markRead(n)"
                   class="px-4 py-3 border-b border-th-border-lt hover:bg-th-bg-alt transition-colors cursor-pointer"
                   [class.bg-blue-50]="!n.read">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                       [class]="typeIconClass(n.type)">
                    {{ typeIcon(n.type) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-th-text truncate">{{ n.title }}</p>
                    @if (n.body) {
                      <p class="text-xs text-th-text-3 line-clamp-2 mt-0.5">{{ n.body }}</p>
                    }
                    <p class="text-[10px] text-th-text-3 mt-1">{{ n.created_at | date:'short' }}</p>
                  </div>
                  @if (!n.read) {
                    <div class="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"></div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class PartnerNotificationsComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  open = signal(false);
  notifications = signal<PartnerNotification[]>([]);
  unreadCount = signal(0);

  ngOnInit() { this.load(); }

  toggle() {
    this.open.update(v => !v);
    if (this.open()) this.load();
  }

  close() { this.open.set(false); }

  load() {
    this.api.getNotifications().subscribe({
      next: res => { this.notifications.set(res.data); this.unreadCount.set(res.unread_count); },
    });
  }

  markRead(n: PartnerNotification) {
    if (!n.read) {
      this.api.markNotificationRead(n.id).subscribe(() => {
        n.read = true;
        this.unreadCount.update(c => Math.max(0, c - 1));
      });
    }
  }

  markAllRead() {
    this.api.markAllNotificationsRead().subscribe(() => {
      this.notifications.update(list => list.map(n => ({ ...n, read: true })));
      this.unreadCount.set(0);
    });
  }

  typeIcon(type: string): string {
    const map: Record<string, string> = { commission: '💰', pipeline: '📊', sla: '⏱', achievement: '🏆', system: '⚙', info: 'ℹ' };
    return map[type] || 'ℹ';
  }

  typeIconClass(type: string): string {
    const map: Record<string, string> = {
      commission: 'bg-emerald-100', pipeline: 'bg-primary/10', sla: 'bg-amber-100',
      achievement: 'bg-purple-100', system: 'bg-th-bg-tert', info: 'bg-sky-100',
    };
    return map[type] || 'bg-th-bg-tert';
  }
}
