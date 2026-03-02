import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-th-bg text-th-text flex items-center justify-center px-4">
      <div class="w-full max-w-md">

        <div class="text-center mb-10">
          <a routerLink="/" class="inline-flex items-center gap-2 text-th-text font-bold text-xl tracking-wide hover:opacity-80 transition">
            <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-cyan-500 inline-flex items-center justify-center"><svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></span> Dogan Consult
          </a>
        </div>

        <div class="bg-th-card border border-th-border rounded-2xl p-8">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold">Change Password</h2>
              <p class="text-th-text-3 text-xs">Required on first login</p>
            </div>
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm mb-6">
            Your administrator created this account. You must set a new password before continuing.
          </div>

          <form (ngSubmit)="submit()" class="space-y-4">
            <div>
              <label class="block text-th-text-3 text-xs mb-1.5 font-medium">Current Password</label>
              <input [(ngModel)]="currentPassword" name="current" type="password" placeholder="Password given by admin" required autocomplete="current-password"
                     class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
            </div>

            <div>
              <label class="block text-th-text-3 text-xs mb-1.5 font-medium">New Password</label>
              <input [(ngModel)]="newPassword" name="new" type="password" placeholder="Min. 8 characters" required autocomplete="new-password"
                     class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
            </div>

            <div>
              <label class="block text-th-text-3 text-xs mb-1.5 font-medium">Confirm New Password</label>
              <input [(ngModel)]="confirmPassword" name="confirm" type="password" placeholder="Re-enter new password" required autocomplete="new-password"
                     class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                     [class.border-red-600]="confirmPassword && confirmPassword !== newPassword" />
              @if (confirmPassword && confirmPassword !== newPassword) {
                <p class="text-red-600 text-xs mt-1">Passwords do not match</p>
              }
            </div>

            @if (error()) {
              <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{{ error() }}</div>
            }

            <button type="submit" [disabled]="loading() || !canSubmit()"
                    class="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/80 transition disabled:opacity-40 disabled:cursor-not-allowed">
              @if (loading()) {
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                  Updating...
                </span>
              } @else {
                Set New Password
              }
            </button>
          </form>
        </div>

      </div>
    </div>
  `,
})
export class ChangePasswordPage implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal<string | null>(null);

  private token = '';
  private user: any = null;

  ngOnInit() {
    this.token =
      (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dc_admin_token') : null) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('dc_user_token') : null) ||
      '';
    const raw =
      (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dc_portal_user') : null) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('dc_user') : null);
    this.user = raw ? JSON.parse(raw) : null;

    if (!this.token || !this.user?.must_change_password) {
      this.router.navigate(['/login']);
    }
  }

  canSubmit(): boolean {
    return this.currentPassword.length > 0 &&
      this.newPassword.length >= 8 &&
      this.newPassword === this.confirmPassword;
  }

  submit() {
    if (!this.canSubmit()) return;
    this.loading.set(true);
    this.error.set(null);

    this.http.post<{ ok: boolean; token: string }>(
      '/api/v1/admin/change-password',
      { current_password: this.currentPassword, new_password: this.newPassword },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).subscribe({
      next: (r) => {
        this.loading.set(false);
        if (this.user) this.user.must_change_password = false;

        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('dc_admin_token', r.token);
          if (this.user) sessionStorage.setItem('dc_portal_user', JSON.stringify(this.user));
        }
        localStorage.setItem('dc_user_token', r.token);
        if (this.user) localStorage.setItem('dc_user', JSON.stringify(this.user));

        if (this.user?.role === 'admin' || this.user?.role === 'employee') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e.error?.error || 'Failed to change password.');
      },
    });
  }
}
