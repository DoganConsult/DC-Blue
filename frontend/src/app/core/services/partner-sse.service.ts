import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { PartnerApiService } from './partner-api.service';

export interface SseNotification {
  type: string;
  title: string;
  body: string;
  link?: string;
}

@Injectable({ providedIn: 'root' })
export class PartnerSseService implements OnDestroy {
  private api = inject(PartnerApiService);
  private eventSource: EventSource | null = null;
  private reconnectTimer: any = null;

  /** Fires when a new notification arrives via SSE */
  readonly newNotification = signal<SseNotification | null>(null);
  /** Fires when a new message arrives via SSE */
  readonly newMessage = signal<{ sender: string; body: string } | null>(null);
  /** Whether SSE is currently connected */
  readonly connected = signal(false);

  connect(): void {
    if (this.eventSource) return;
    const key = this.api.apiKey();
    if (!key) return;

    const url = `/api/v1/partners/events?api_key=${encodeURIComponent(key)}`;
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      this.connected.set(true);
    };

    this.eventSource.addEventListener('notification', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        this.newNotification.set(data);
      } catch {}
    });

    this.eventSource.addEventListener('message_received', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        this.newMessage.set(data);
      } catch {}
    });

    this.eventSource.onerror = () => {
      this.connected.set(false);
      this.cleanup();
      // Auto-reconnect after 5s
      this.reconnectTimer = setTimeout(() => this.connect(), 5000);
    };
  }

  disconnect(): void {
    this.cleanup();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.connected.set(false);
  }

  private cleanup(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
