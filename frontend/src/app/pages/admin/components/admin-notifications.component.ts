import { Component, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminApiService } from '../../../core/services/admin-api.service';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

@Component({
  selector: 'admin-notifications-bell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button (click)="togglePanel($event)" class="relative p-2 rounded-lg hover:bg-th-bg-tert transition" aria-label="Notifications">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        @if (unreadCount() > 0) {
          <span class="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {{ unreadCount() > 99 ? '99+' : unreadCount() }}
          </span>
        }
      </button>

      @if (panelOpen()) {
        <div class="absolute right-0 top-full mt-2 w-80 md:w-96 bg-th-card border border-th-border rounded-xl shadow-2xl z-50 max-h-[480px] flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-th-border">
            <h3 class="font-semibold text-sm">Notifications</h3>
            @if (unreadCount() > 0) {
              <button (click)="markAllRead()" class="text-xs text-primary hover:underline">Mark all read</button>
            }
          </div>

          <!-- List -->
          <div class="overflow-y-auto flex-1">
            @if (loading()) {
              <div class="p-6 text-center text-th-text-3 text-sm">Loading...</div>
            } @else if (notifications().length === 0) {
              <div class="p-6 text-center text-th-text-3 text-sm">No notifications</div>
            } @else {
              @for (n of notifications(); track n.id) {
                <div (click)="handleClick(n)" class="px-4 py-3 border-b border-th-border/50 hover:bg-th-bg-tert/50 cursor-pointer transition flex gap-3 items-start"
                     [class.opacity-60]="n.read">
                  <div class="mt-0.5 flex-shrink-0">
                    @switch (n.type) {
                      @case ('lead') {
                        <span class="inline-flex w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 items-center justify-center text-xs">L</span>
                      }
                      @case ('partner') {
                        <span class="inline-flex w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 items-center justify-center text-xs">P</span>
                      }
                      @case ('commission') {
                        <span class="inline-flex w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 items-center justify-center text-xs">$</span>
                      }
                      @case ('gate') {
                        <span class="inline-flex w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 items-center justify-center text-xs">G</span>
                      }
                      @case ('warning') {
                        <span class="inline-flex w-7 h-7 rounded-full bg-red-500/20 text-red-400 items-center justify-center text-xs">!</span>
                      }
                      @default {
                        <span class="inline-flex w-7 h-7 rounded-full bg-th-bg-tert text-th-text-3 items-center justify-center text-xs">i</span>
                      }
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate" [class.text-th-text]="!n.read" [class.text-th-text-3]="n.read">{{ n.title }}</p>
                    @if (n.body) {
                      <p class="text-xs text-th-text-3 mt-0.5 line-clamp-2">{{ n.body }}</p>
                    }
                    <p class="text-[10px] text-th-text-3 mt-1">{{ timeAgo(n.created_at) }}</p>
                  </div>
                  @if (!n.read) {
                    <span class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                  }
                </div>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminNotificationsComponent implements OnInit, OnDestroy {
  private api = inject(AdminApiService);
  private router = inject(Router);

  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);
  panelOpen = signal(false);
  loading = signal(false);

  private pollInterval: any;

  ngOnInit() {
    this.loadNotifications();
    this.pollInterval = setInterval(() => this.loadNotifications(), 30000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.panelOpen()) this.panelOpen.set(false);
  }

  togglePanel(event: Event) {
    event.stopPropagation();
    this.panelOpen.set(!this.panelOpen());
    if (this.panelOpen()) this.loadNotifications();
  }

  loadNotifications() {
    if (!this.api.isAuthenticated()) return;
    this.loading.set(this.notifications().length === 0);
    this.api.getNotifications({ limit: '20' }).subscribe({
      next: (r) => {
        this.notifications.set(r.data);
        this.unreadCount.set(r.unread_count);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  markAllRead() {
    this.api.markAllNotificationsRead().subscribe({
      next: () => {
        this.notifications.update(list => list.map(n => ({ ...n, read: true })));
        this.unreadCount.set(0);
      },
    });
  }

  handleClick(n: Notification) {
    if (!n.read) {
      this.api.markNotificationRead(n.id).subscribe();
      this.notifications.update(list => list.map(item => item.id === n.id ? { ...item, read: true } : item));
      this.unreadCount.update(c => Math.max(0, c - 1));
    }
    if (n.link) {
      this.panelOpen.set(false);
      this.router.navigateByUrl(n.link);
    }
  }

  timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }
}
