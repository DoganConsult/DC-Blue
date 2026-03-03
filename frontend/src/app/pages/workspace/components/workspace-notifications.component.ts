import { Component, inject, signal, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApiService } from '../../../core/services/client-api.service';
import { ClientNotification } from '../../../core/models/client.models';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-workspace-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button type="button" (click)="toggleOpen()"
              class="relative p-2 rounded-lg text-th-text-3 hover:text-th-text hover:bg-th-bg-tert transition"
              [attr.aria-expanded]="open()" aria-label="Notifications">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.75a8.967 8.967 0 00-2.312-6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        @if (unreadCount() > 0) {
          <span class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
            {{ unreadCount() > 99 ? '99+' : unreadCount() }}
          </span>
        }
      </button>
      @if (open()) {
        <div class="absolute right-0 mt-1 w-[320px] sm:w-[380px] max-h-[400px] overflow-hidden bg-th-card border border-th-border rounded-xl shadow-xl z-50 flex flex-col">
          <div class="flex items-center justify-between px-4 py-3 border-b border-th-border">
            <span class="text-sm font-semibold text-th-text">{{ i18n.t('Notifications', 'الإشعارات') }}</span>
            @if (unreadCount() > 0) {
              <button type="button" (click)="markAllRead()" class="text-xs text-primary hover:underline">
                {{ i18n.t('Mark all read', 'تعليم الكل كمقروء') }}
              </button>
            }
          </div>
          <div class="overflow-y-auto flex-1">
            @if (loading()) {
              <div class="flex items-center justify-center py-8">
                <span class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></span>
              </div>
            } @else if (notifications().length === 0) {
              <p class="px-4 py-8 text-sm text-th-text-3 text-center">{{ i18n.t('No notifications', 'لا توجد إشعارات') }}</p>
            } @else {
              @for (n of notifications(); track n.id) {
                <button type="button" (click)="onNotificationClick(n)"
                        class="w-full text-left px-4 py-3 border-b border-th-border last:border-0 transition hover:bg-th-bg-tert"
                        [ngClass]="!n.read ? 'bg-primary/5' : ''">
                  <p class="text-xs font-medium text-th-text-2">{{ n.title }}</p>
                  @if (n.body) {
                    <p class="text-xs text-th-text-3 mt-0.5 line-clamp-2">{{ n.body }}</p>
                  }
                  <p class="text-[10px] text-th-text-3 mt-1">{{ n.created_at | date:'short' }}</p>
                </button>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class WorkspaceNotificationsComponent implements OnInit, OnDestroy {
  private api = inject(ClientApiService);
  protected i18n = inject(I18nService);
  private el = inject(ElementRef<HTMLElement>);

  open = signal(false);
  loading = signal(false);
  notifications = signal<ClientNotification[]>([]);
  total = signal(0);
  unreadCount = signal(0);

  toggleOpen() {
    this.open.update(v => !v);
  }

  private handleClick = (e: MouseEvent) => {
    const host = this.el.nativeElement;
    if (host && !host.contains((e.target as Node))) this.open.set(false);
  };

  ngOnInit() {
    this.load();
    if (typeof document !== 'undefined') {
      setTimeout(() => document.addEventListener('click', this.handleClick), 0);
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') document.removeEventListener('click', this.handleClick);
  }

  load() {
    this.loading.set(true);
    this.api.getNotifications(30, 0).subscribe({
      next: (r) => {
        this.notifications.set(r.data || []);
        this.total.set(r.total || 0);
        const unread = (r.data || []).filter((n: ClientNotification) => !n.read).length;
        this.unreadCount.set(unread);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  markRead(n: ClientNotification) {
    if (n.read) return;
    this.api.markNotificationRead(n.id).subscribe({
      next: () => {
        this.notifications.update(list => list.map(x => x.id === n.id ? { ...x, read: true } : x));
        this.unreadCount.update(c => Math.max(0, c - 1));
      },
    });
  }

  markAllRead() {
    this.api.markAllNotificationsRead().subscribe({
      next: () => {
        this.notifications.update(list => list.map(x => ({ ...x, read: true })));
        this.unreadCount.set(0);
      },
    });
  }

  go(link: string | null) {
    this.open.set(false);
    if (link && typeof window !== 'undefined') {
      if (link.startsWith('http')) window.open(link, '_blank');
      else window.location.href = link;
    }
  }

  onNotificationClick(n: ClientNotification) {
    this.markRead(n);
    this.go(n.link);
  }
}
