import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-workspace-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-lg font-bold mb-6">Settings</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Profile -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <h3 class="text-sm font-semibold mb-4">Profile</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-th-text-3">Name</span>
            <span class="font-medium">{{ user()?.full_name || user()?.name || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-th-text-3">Email</span>
            <span class="font-medium">{{ user()?.email || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-th-text-3">Company</span>
            <span class="font-medium">{{ user()?.company || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-th-text-3">Role</span>
            <span class="px-2 py-0.5 rounded text-xs font-medium"
                  [class]="user()?.role === 'partner' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'">
              {{ user()?.role }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-th-text-3">Category</span>
            <span class="font-medium">{{ user()?.category || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- Security -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <h3 class="text-sm font-semibold mb-4">Security</h3>
        <div class="space-y-4">
          <!-- MFA Toggle -->
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm font-medium">Two-Factor Authentication</span>
              <p class="text-th-text-3 text-xs">Receive email code on login</p>
            </div>
            <button (click)="toggleMfa()" [disabled]="mfaToggling()"
                    class="relative w-11 h-6 rounded-full transition-colors"
                    [class]="mfaEnabled() ? 'bg-emerald-500' : 'bg-gray-300'">
              <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    [class.translate-x-5]="mfaEnabled()"></span>
            </button>
          </div>
          <div class="text-xs" [class]="mfaEnabled() ? 'text-emerald-600' : 'text-th-text-3'">
            {{ mfaEnabled() ? 'MFA is enabled — you will receive a code on each login' : 'MFA is off — you can enable it for extra security' }}
          </div>

          <hr class="border-th-border" />

          <!-- Change Password Link -->
          <a href="/change-password" class="text-primary text-sm hover:underline block">Change Password</a>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <h3 class="text-sm font-semibold mb-4">Quick Links</h3>
        <div class="space-y-2">
          <a href="/inquiry" class="flex items-center gap-2 text-sm text-primary hover:underline">
            <span>&#128221;</span> Submit New Inquiry
          </a>
          <a href="/track" class="flex items-center gap-2 text-sm text-primary hover:underline">
            <span>&#128269;</span> Track Inquiry by Ticket
          </a>
          <a href="/" class="flex items-center gap-2 text-sm text-primary hover:underline">
            <span>&#127968;</span> Back to Homepage
          </a>
        </div>
      </div>
    </div>
  `,
})
export class WorkspaceSettingsComponent implements OnInit {
  private http = inject(HttpClient);

  user = signal<any>(null);
  mfaEnabled = signal(false);
  mfaToggling = signal(false);

  ngOnInit() {
    try {
      const userStr = localStorage.getItem('dc_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        this.user.set(u);
        this.mfaEnabled.set(u.mfa_enabled || false);
      }
    } catch {}
  }

  toggleMfa() {
    const newState = !this.mfaEnabled();
    this.mfaToggling.set(true);
    const token = localStorage.getItem('dc_user_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.post<{ ok: boolean; mfa_enabled: boolean }>('/api/v1/public/auth/toggle-mfa', { enable: newState }, { headers }).subscribe({
      next: (r) => {
        this.mfaEnabled.set(r.mfa_enabled);
        this.mfaToggling.set(false);
        try {
          const userStr = localStorage.getItem('dc_user');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.mfa_enabled = r.mfa_enabled;
            localStorage.setItem('dc_user', JSON.stringify(user));
          }
        } catch {}
      },
      error: () => this.mfaToggling.set(false),
    });
  }
}
