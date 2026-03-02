import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-forgot-password',
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
            <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ i18n.t('Forgot Password', 'نسيت كلمة المرور') }}</h2>
              <p class="text-th-text-3 text-xs">{{ i18n.t("We'll send a reset link to your email", 'سنرسل رابط إعادة التعيين إلى بريدك') }}</p>
            </div>
          </div>

          @if (sent()) {
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
              <svg class="w-10 h-10 text-emerald-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p class="text-emerald-700 font-semibold mb-1">{{ i18n.t('Check your email', 'تحقق من بريدك') }}</p>
              <p class="text-emerald-600 text-sm">{{ i18n.t('If an account exists for', 'إذا كان هناك حساب لـ') }} <strong>{{ email }}</strong>{{ i18n.t(', a password reset link has been sent.', '، فقد تم إرسال رابط إعادة تعيين كلمة المرور.') }}</p>
              <a routerLink="/login" class="inline-block mt-4 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition">{{ i18n.t('Back to Sign In', 'العودة لتسجيل الدخول') }}</a>
            </div>
          } @else {
            <form (ngSubmit)="submit()" class="space-y-4">
              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">{{ i18n.t('Email address', 'البريد الإلكتروني') }}</label>
                <input [(ngModel)]="email" name="email" type="email" placeholder="you@company.com" required autocomplete="email"
                       class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
              </div>

              @if (error()) {
                <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{{ error() }}</div>
              }

              <button type="submit" [disabled]="loading() || !email.includes('@')"
                      class="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
                @if (loading()) {
                  <span class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                    {{ i18n.t('Sending...', 'جاري الإرسال...') }}
                  </span>
                } @else {
                  {{ i18n.t('Send Reset Link', 'إرسال رابط إعادة التعيين') }}
                }
              </button>

              <p class="text-center text-th-text-2 text-xs pt-2">
                <a routerLink="/login" class="text-primary hover:underline">{{ i18n.t('Back to Sign In', 'العودة لتسجيل الدخول') }}</a>
              </p>
            </form>
          }
        </div>

      </div>
    </div>
  `,
})
export class ForgotPasswordPage {
  private http = inject(HttpClient);
  i18n = inject(I18nService);

  email = '';
  loading = signal(false);
  error = signal<string | null>(null);
  sent = signal(false);

  submit() {
    if (!this.email.includes('@')) return;
    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>('/api/v1/public/auth/forgot-password', {
      email: this.email.trim(),
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.sent.set(true);
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e.error?.error || 'Failed to send reset email.');
      },
    });
  }
}
