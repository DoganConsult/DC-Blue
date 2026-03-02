import { Component, inject, signal, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-login',
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

        <div class="bg-th-card/80 border border-th-border rounded-2xl p-8">

          @if (mfaStep()) {
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold">{{ i18n.t('Verification Code', 'رمز التحقق') }}</h2>
                <p class="text-th-text-3 text-xs">{{ i18n.t('Check your email for the 6-digit code', 'تحقق من بريدك للرمز المكون من 6 أرقام') }}</p>
              </div>
            </div>

            <p class="text-th-text-3 text-sm mb-4">{{ i18n.t('A verification code was sent to', 'تم إرسال رمز التحقق إلى') }} <strong class="text-th-text">{{ mfaEmail() }}</strong></p>

            <div class="space-y-4">
              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">{{ i18n.t('Verification Code', 'رمز التحقق') }}</label>
                <input #mfaInput [(ngModel)]="mfaCode" name="mfaCode" type="text" placeholder="123456" maxlength="6" autocomplete="one-time-code"
                       (keyup.enter)="verifyMfa()"
                       class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition" />
              </div>

              @if (error()) {
                <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{{ error() }}</div>
              }

              <button type="button" (click)="verifyMfa()" [disabled]="loading() || mfaCode.length < 6"
                      class="w-full py-3 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-400 transition disabled:opacity-40 disabled:cursor-not-allowed">
                @if (loading()) {
                  <span class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                    {{ i18n.t('Verifying...', 'جاري التحقق...') }}
                  </span>
                } @else {
                  {{ i18n.t('Verify Code', 'تحقق من الرمز') }}
                }
              </button>

              <div class="flex items-center justify-between text-xs">
                <button type="button" (click)="resendMfa()" [disabled]="resending()" class="text-primary hover:underline disabled:opacity-40">
                  {{ resending() ? i18n.t('Sending...', 'جاري الإرسال...') : i18n.t('Resend code', 'إعادة إرسال الرمز') }}
                </button>
                <button type="button" (click)="backToLogin()" class="text-th-text-3 hover:text-th-text">{{ i18n.t('Back to login', 'العودة لتسجيل الدخول') }}</button>
              </div>
            </div>

          } @else {
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold">{{ i18n.t('Sign in', 'تسجيل الدخول') }}</h2>
                <p class="text-th-text-3 text-xs">{{ i18n.t('Partners, clients, and team members', 'الشركاء والعملاء وأعضاء الفريق') }}</p>
              </div>
            </div>

            <form (ngSubmit)="login()" class="space-y-4">
              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">{{ i18n.t('Email address', 'البريد الإلكتروني') }}</label>
                <input [(ngModel)]="identifier" name="identifier" type="email" placeholder="you@company.com" required autocomplete="email"
                       class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
              </div>

              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">{{ i18n.t('Password', 'كلمة المرور') }}</label>
                <div class="relative">
                  <input [(ngModel)]="password" name="password" [type]="showPw() ? 'text' : 'password'" placeholder="Your password" required autocomplete="current-password"
                         class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
                  <button type="button" (click)="showPw.set(!showPw())" class="absolute right-3 top-3 text-th-text-3 hover:text-th-text-3 transition text-xs px-1 py-0.5">
                    {{ showPw() ? i18n.t('Hide', 'إخفاء') : i18n.t('Show', 'إظهار') }}
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <input [(ngModel)]="rememberMe" name="rememberMe" type="checkbox" id="rememberMe"
                       class="w-4 h-4 rounded border-th-border-dk bg-th-bg-tert text-primary focus:ring-primary/50" />
                <label for="rememberMe" class="text-th-text-3 text-xs cursor-pointer">{{ i18n.t('Remember me', 'تذكرني') }}</label>
              </div>

              @if (error()) {
                <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{{ error() }}</div>
              }

              <button type="submit" [disabled]="loading() || !identifier.trim() || !password"
                      class="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
                @if (loading()) {
                  <span class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                    {{ i18n.t('Signing in...', 'جاري تسجيل الدخول...') }}
                  </span>
                } @else {
                  {{ i18n.t('Sign In', 'تسجيل الدخول') }}
                }
              </button>
            </form>

            <div class="flex items-center justify-between mt-4">
              <a routerLink="/forgot-password" class="text-primary text-xs hover:underline">{{ i18n.t('Forgot password?', 'نسيت كلمة المرور؟') }}</a>
              <p class="text-th-text-2 text-xs">
                {{ i18n.t('No account?', 'ليس لديك حساب؟') }} <a routerLink="/register" class="text-primary hover:underline">{{ i18n.t('Register', 'تسجيل') }}</a>
              </p>
            </div>
          }
        </div>

      </div>
    </div>
  `,
})
export class LoginPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  i18n = inject(I18nService);
  mfaInputRef = viewChild<ElementRef>('mfaInput');

  identifier = '';
  password = '';
  showPw = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  mfaStep = signal(false);
  mfaSession = '';
  mfaEmail = signal('');
  mfaCode = '';
  rememberMe = false;
  resending = signal(false);

  constructor() {
    effect(() => {
      if (this.mfaStep()) {
        setTimeout(() => this.mfaInputRef()?.nativeElement?.focus(), 100);
      }
    });
  }

  login() {
    if (!this.identifier.trim() || !this.password) return;
    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>('/api/v1/public/auth/login', {
      identifier: this.identifier.trim(),
      password: this.password,
    }).subscribe({
      next: (r) => {
        this.loading.set(false);

        if (r.mfa_required) {
          this.mfaStep.set(true);
          this.mfaSession = r.mfa_session;
          this.mfaEmail.set(r.user?.email || this.identifier);
          return;
        }

        this.handleLoginSuccess(r);
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e.error?.error || 'Sign in failed. Please try again.');
      },
    });
  }

  verifyMfa() {
    if (this.mfaCode.length < 6) return;
    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>('/api/v1/public/auth/verify-mfa', {
      mfa_session: this.mfaSession,
      code: this.mfaCode.trim(),
    }).subscribe({
      next: (r) => {
        this.loading.set(false);
        this.handleLoginSuccess(r);
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e.error?.error || 'Verification failed. Please try again.');
      },
    });
  }

  resendMfa() {
    this.resending.set(true);
    this.http.post<any>('/api/v1/public/auth/resend-mfa', {
      mfa_session: this.mfaSession,
    }).subscribe({
      next: () => this.resending.set(false),
      error: (e) => {
        this.resending.set(false);
        this.error.set(e.error?.error || 'Failed to resend code.');
      },
    });
  }

  backToLogin() {
    this.mfaStep.set(false);
    this.mfaCode = '';
    this.mfaSession = '';
    this.error.set(null);
  }

  private handleLoginSuccess(r: any) {
    if (r.user.source === 'portal') {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('dc_admin_token', r.token);
        sessionStorage.setItem('dc_portal_user', JSON.stringify(r.user));
      }
    }
    localStorage.setItem('dc_user_token', r.token);
    localStorage.setItem('dc_user', JSON.stringify(r.user));

    if (r.user.must_change_password) {
      this.router.navigate(['/change-password']);
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else if (r.user.role === 'admin' || r.user.role === 'employee') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/workspace']);
    }
  }
}
