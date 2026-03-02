import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
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
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold">Set New Password</h2>
              <p class="text-th-text-3 text-xs">Choose a strong new password</p>
            </div>
          </div>

          @if (!token) {
            <div class="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
              <p class="text-red-700 font-semibold mb-1">Invalid Reset Link</p>
              <p class="text-red-600 text-sm mb-4">This password reset link is invalid or has expired.</p>
              <a routerLink="/forgot-password" class="inline-block px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/80 transition">Request New Link</a>
            </div>
          } @else if (success()) {
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
              <p class="text-emerald-700 font-semibold text-lg mb-1">Password Reset!</p>
              <p class="text-emerald-600 text-sm mb-4">Your password has been changed successfully.</p>
              <a routerLink="/login" class="inline-block px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/80 transition">Sign In</a>
            </div>
          } @else {
            <form (ngSubmit)="submit()" class="space-y-4">
              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">New Password</label>
                <div class="relative">
                  <input [(ngModel)]="newPassword" name="newPassword" [type]="showPw() ? 'text' : 'password'" placeholder="Min. 12 characters" required autocomplete="new-password"
                         class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
                  <button type="button" (click)="showPw.set(!showPw())" class="absolute right-3 top-3 text-th-text-3 hover:text-th-text-3 transition text-xs px-1 py-0.5">
                    {{ showPw() ? 'Hide' : 'Show' }}
                  </button>
                </div>
                <div class="flex gap-1 mt-2">
                  @for (i of [1,2,3,4]; track i) {
                    <div class="h-1 flex-1 rounded-full transition-colors"
                         [class.bg-th-bg-tert]="pwStrength() < i"
                         [class.bg-red-500]="pwStrength() >= i && pwStrength() === 1"
                         [class.bg-orange-500]="pwStrength() >= i && pwStrength() === 2"
                         [class.bg-yellow-500]="pwStrength() >= i && pwStrength() === 3"
                         [class.bg-emerald-500]="pwStrength() >= i && pwStrength() === 4"></div>
                  }
                </div>
              </div>

              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">Confirm New Password</label>
                <input [(ngModel)]="confirmPassword" name="confirmPassword" [type]="showPw() ? 'text' : 'password'" placeholder="Re-enter password" required autocomplete="new-password"
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
                    Resetting...
                  </span>
                } @else {
                  Reset Password
                }
              </button>
            </form>
          }
        </div>

      </div>
    </div>
  `,
})
export class ResetPasswordPage implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  token = '';
  email = '';
  newPassword = '';
  confirmPassword = '';
  showPw = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  pwStrength(): number {
    const p = this.newPassword;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }

  canSubmit(): boolean {
    return this.newPassword.length >= 8 &&
      this.newPassword === this.confirmPassword &&
      !!this.token;
  }

  submit() {
    if (!this.canSubmit()) return;
    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>('/api/v1/public/auth/reset-password', {
      token: this.token,
      email: this.email,
      new_password: this.newPassword,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e.error?.error || 'Failed to reset password.');
      },
    });
  }
}
