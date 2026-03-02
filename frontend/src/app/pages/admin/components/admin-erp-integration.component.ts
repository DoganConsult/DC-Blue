import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface ERPStatus {
  connected: boolean;
  erp_url: string;
  health: { ok: boolean; status?: number; error?: string };
  sync: Record<string, { total: number; synced: number; stale: number; unsynced: number; error?: string }>;
}

interface ERPConfig {
  url: string;
  user: string;
  has_api_key: boolean;
  has_api_secret: boolean;
}

interface EntityMapping {
  erpDoctype: string;
  fields: Record<string, string>;
  statusMap: Record<string, string> | null;
}

@Component({
  selector: 'app-admin-erp-integration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Connection Status -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold">ERPNext Connection</h3>
          <button (click)="refresh()" [disabled]="loading()" class="text-xs text-primary hover:underline">Refresh</button>
        </div>

        @if (loading()) {
          <div class="flex items-center gap-2 text-sm text-th-text-3">
            <div class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            Checking connection...
          </div>
        } @else if (status()) {
          <div class="flex items-center gap-3 mb-3">
            <span class="w-3 h-3 rounded-full" [class]="status()!.connected ? 'bg-emerald-500' : 'bg-red-500'"></span>
            <span class="text-sm font-medium">{{ status()!.connected ? 'Connected' : 'Disconnected' }}</span>
            <span class="text-xs text-th-text-3">{{ status()!.erp_url }}</span>
          </div>
          @if (status()!.connected) {
            <div class="text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
              ERPNext is running and accessible
            </div>
          } @else {
            <div class="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg inline-block">
              Cannot reach ERPNext — check configuration
            </div>
          }
        }
      </div>

      <!-- Configuration -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold">Configuration</h3>
          <button (click)="showConfig = !showConfig" class="text-xs text-primary hover:underline">
            {{ showConfig ? 'Hide' : 'Edit' }}
          </button>
        </div>

        @if (config()) {
          <div class="grid grid-cols-2 gap-3 text-sm mb-4">
            <div><span class="text-th-text-3 text-xs">URL</span><div class="font-medium">{{ config()!.url }}</div></div>
            <div><span class="text-th-text-3 text-xs">User</span><div class="font-medium">{{ config()!.user }}</div></div>
            <div><span class="text-th-text-3 text-xs">API Key</span><div class="font-medium">{{ config()!.has_api_key ? 'Configured' : 'Not set' }}</div></div>
            <div><span class="text-th-text-3 text-xs">API Secret</span><div class="font-medium">{{ config()!.has_api_secret ? 'Configured' : 'Not set' }}</div></div>
          </div>
        }

        @if (showConfig) {
          <div class="border-t border-th-border pt-4 space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-th-text-3 block mb-1">ERPNext URL</label>
                <input [(ngModel)]="formUrl" class="w-full px-3 py-2 border border-th-border rounded-lg text-sm bg-th-bg" placeholder="http://localhost:8080" />
              </div>
              <div>
                <label class="text-xs text-th-text-3 block mb-1">Username</label>
                <input [(ngModel)]="formUser" class="w-full px-3 py-2 border border-th-border rounded-lg text-sm bg-th-bg" placeholder="Administrator" />
              </div>
              <div>
                <label class="text-xs text-th-text-3 block mb-1">Password</label>
                <input [(ngModel)]="formPass" type="password" class="w-full px-3 py-2 border border-th-border rounded-lg text-sm bg-th-bg" placeholder="Password" />
              </div>
              <div>
                <label class="text-xs text-th-text-3 block mb-1">API Key (optional)</label>
                <input [(ngModel)]="formApiKey" class="w-full px-3 py-2 border border-th-border rounded-lg text-sm bg-th-bg" placeholder="API Key" />
              </div>
              <div>
                <label class="text-xs text-th-text-3 block mb-1">API Secret (optional)</label>
                <input [(ngModel)]="formApiSecret" type="password" class="w-full px-3 py-2 border border-th-border rounded-lg text-sm bg-th-bg" placeholder="API Secret" />
              </div>
            </div>
            <button (click)="saveConfig()" [disabled]="saving()" class="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition">
              {{ saving() ? 'Saving...' : 'Save & Test Connection' }}
            </button>
            @if (saveResult()) {
              <span class="text-xs ml-3" [class]="saveResult()!.includes('OK') ? 'text-emerald-600' : 'text-red-600'">{{ saveResult() }}</span>
            }
          </div>
        }
      </div>

      <!-- Sync Status -->
      @if (status()?.sync) {
        <div class="bg-th-card border border-th-border rounded-xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold">Sync Status</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-th-border">
                  <th class="text-left px-3 py-2 text-th-text-3 text-xs">Entity</th>
                  <th class="text-center px-3 py-2 text-th-text-3 text-xs">Total</th>
                  <th class="text-center px-3 py-2 text-th-text-3 text-xs">Synced</th>
                  <th class="text-center px-3 py-2 text-th-text-3 text-xs">Unsynced</th>
                  <th class="text-center px-3 py-2 text-th-text-3 text-xs">Stale</th>
                  <th class="text-center px-3 py-2 text-th-text-3 text-xs">Action</th>
                </tr>
              </thead>
              <tbody>
                @for (entry of syncEntries(); track entry.key) {
                  <tr class="border-b border-th-border last:border-0">
                    <td class="px-3 py-2 font-medium">{{ entry.key }}</td>
                    @if (entry.val.error) {
                      <td colspan="4" class="px-3 py-2 text-red-500 text-xs">{{ entry.val.error }}</td>
                    } @else {
                      <td class="px-3 py-2 text-center">{{ entry.val.total }}</td>
                      <td class="px-3 py-2 text-center"><span class="text-emerald-600">{{ entry.val.synced }}</span></td>
                      <td class="px-3 py-2 text-center"><span [class]="entry.val.unsynced > 0 ? 'text-amber-600' : 'text-th-text-3'">{{ entry.val.unsynced }}</span></td>
                      <td class="px-3 py-2 text-center"><span [class]="entry.val.stale > 0 ? 'text-red-500' : 'text-th-text-3'">{{ entry.val.stale }}</span></td>
                    }
                    <td class="px-3 py-2 text-center">
                      <button (click)="bulkPush(entry.key)" [disabled]="pushing() === entry.key"
                              class="text-xs text-primary hover:underline">
                        {{ pushing() === entry.key ? 'Pushing...' : 'Push All' }}
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Entity Mappings -->
      @if (mappings()) {
        <div class="bg-th-card border border-th-border rounded-xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold">Entity Mappings</h3>
            <button (click)="showMappings = !showMappings" class="text-xs text-primary hover:underline">
              {{ showMappings ? 'Hide' : 'Show' }}
            </button>
          </div>
          @if (showMappings) {
            @for (entry of mappingEntries(); track entry.key) {
              <div class="mb-4 last:mb-0">
                <div class="text-xs font-semibold text-th-text-3 mb-1">{{ entry.key }} &rarr; {{ entry.val.erpDoctype }}</div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-1 text-xs">
                  @for (field of fieldEntries(entry.val.fields); track field.key) {
                    <div class="bg-th-bg-tert px-2 py-1 rounded">
                      <span class="text-th-text-3">{{ field.key }}</span> &rarr; <span class="font-medium">{{ field.val }}</span>
                    </div>
                  }
                </div>
              </div>
            }
          }
        </div>
      }

      <!-- Quick Access -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <h3 class="text-sm font-semibold mb-3">Quick Access</h3>
        <div class="flex flex-wrap gap-2">
          <a [href]="(status()?.erp_url || 'http://localhost:8080') + '/app'"
             target="_blank" rel="noopener"
             class="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition inline-flex items-center gap-2">
            Open ERPNext Dashboard
          </a>
          <a [href]="(status()?.erp_url || 'http://localhost:8080') + '/app/lead'"
             target="_blank" rel="noopener"
             class="px-4 py-2 bg-th-bg-tert border border-th-border rounded-lg text-sm hover:bg-th-bg transition">
            Leads
          </a>
          <a [href]="(status()?.erp_url || 'http://localhost:8080') + '/app/opportunity'"
             target="_blank" rel="noopener"
             class="px-4 py-2 bg-th-bg-tert border border-th-border rounded-lg text-sm hover:bg-th-bg transition">
            Opportunities
          </a>
          <a [href]="(status()?.erp_url || 'http://localhost:8080') + '/app/project'"
             target="_blank" rel="noopener"
             class="px-4 py-2 bg-th-bg-tert border border-th-border rounded-lg text-sm hover:bg-th-bg transition">
            Projects
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AdminERPIntegrationComponent implements OnInit {
  private http = inject(HttpClient);

  loading = signal(false);
  status = signal<ERPStatus | null>(null);
  config = signal<ERPConfig | null>(null);
  mappings = signal<Record<string, EntityMapping> | null>(null);
  saving = signal(false);
  saveResult = signal<string | null>(null);
  pushing = signal<string | null>(null);

  showConfig = false;
  showMappings = false;

  formUrl = 'http://localhost:8080';
  formUser = 'Administrator';
  formPass = '';
  formApiKey = '';
  formApiSecret = '';

  get headers() {
    const token = localStorage.getItem('dc_user_token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  ngOnInit() {
    this.refresh();
    this.loadConfig();
    this.loadMappings();
  }

  refresh() {
    this.loading.set(true);
    this.http.get<ERPStatus>('/api/v1/erp/status', { headers: this.headers }).subscribe({
      next: (r) => { this.status.set(r); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  loadConfig() {
    this.http.get<ERPConfig>('/api/v1/erp/config', { headers: this.headers }).subscribe({
      next: (r) => {
        this.config.set(r);
        this.formUrl = r.url;
        this.formUser = r.user;
      },
    });
  }

  loadMappings() {
    this.http.get<Record<string, EntityMapping>>('/api/v1/erp/mappings', { headers: this.headers }).subscribe({
      next: (r) => this.mappings.set(r),
    });
  }

  saveConfig() {
    this.saving.set(true);
    this.saveResult.set(null);
    this.http.put<{ ok: boolean; connected: boolean }>('/api/v1/erp/config', {
      url: this.formUrl,
      user: this.formUser,
      pass: this.formPass || undefined,
      api_key: this.formApiKey || undefined,
      api_secret: this.formApiSecret || undefined,
    }, { headers: this.headers }).subscribe({
      next: (r) => {
        this.saving.set(false);
        this.saveResult.set(r.connected ? 'OK — Connection successful' : 'Saved but connection failed');
        this.refresh();
        this.loadConfig();
      },
      error: (e) => {
        this.saving.set(false);
        this.saveResult.set('Error: ' + (e.error?.error || 'Unknown'));
      },
    });
  }

  bulkPush(entityType: string) {
    this.pushing.set(entityType);
    this.http.post<any>('/api/v1/erp/sync/bulk-push', { entity_type: entityType }, { headers: this.headers }).subscribe({
      next: (r) => {
        this.pushing.set(null);
        this.refresh();
        alert(`Pushed: ${r.pushed}, Failed: ${r.failed}`);
      },
      error: () => this.pushing.set(null),
    });
  }

  syncEntries() {
    const sync = this.status()?.sync;
    if (!sync) return [];
    return Object.entries(sync).map(([key, val]) => ({ key, val }));
  }

  mappingEntries() {
    const m = this.mappings();
    if (!m) return [];
    return Object.entries(m).map(([key, val]) => ({ key, val }));
  }

  fieldEntries(fields: Record<string, string>) {
    return Object.entries(fields).map(([key, val]) => ({ key, val }));
  }
}
