import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-register',
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
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ i18n.t('Create Account', 'إنشاء حساب') }}</h2>
              <p class="text-th-text-3 text-xs">{{ i18n.t('Partners, customers, freelancers & ecosystem', 'الشركاء والعملاء والمستقلون والنظام البيئي') }}</p>
            </div>
          </div>

          @if (false) {
          } @else {
            <form (ngSubmit)="register()" class="space-y-4">

              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">{{ i18n.t('I am a', 'أنا') }} <span class="text-red-500">*</span></label>
                <div class="grid grid-cols-2 gap-2">
                  @for (cat of categories; track cat.value) {
                    <button type="button" (click)="form.category = cat.value"
                            class="px-3 py-2.5 rounded-xl text-xs font-medium border transition text-left"
                            [ngClass]="form.category === cat.value ? 'bg-sky-100 border-sky-500 text-sky-700' : 'bg-th-bg-tert border-th-border-dk text-th-text-3 hover:border-th-border-lt0'">
                      {{ cat.label }}
                    </button>
                  }
                </div>
              </div>

              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">{{ i18n.t('Full Name', 'الاسم الكامل') }}</label>
                <input [(ngModel)]="form.name" name="name" placeholder="Jane Smith"
                       class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
              </div>

              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">{{ i18n.t('Email Address', 'البريد الإلكتروني') }} <span class="text-red-500">*</span></label>
                <input [(ngModel)]="form.email" name="email" type="email" placeholder="jane&#64;company.com" required autocomplete="email"
                       class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
                @if (isDoganconsultEmail()) {
                  <p class="text-amber-600 text-xs mt-1">{{ i18n.t('Dogan Consult team accounts are created by your administrator.', 'يتم إنشاء حسابات فريق دوغان كونسلت بواسطة المسؤول.') }}</p>
                }
              </div>

              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">{{ i18n.t('Company / Organisation', 'الشركة / المنظمة') }}</label>
                <input [(ngModel)]="form.company" name="company" placeholder="Acme Corp (optional)"
                       class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
              </div>

              <div>
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">{{ i18n.t('Password', 'كلمة المرور') }} <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input [(ngModel)]="form.password" name="password" [type]="showPw() ? 'text' : 'password'" placeholder="Min. 8 characters" required autocomplete="new-password"
                         class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
                  <button type="button" (click)="showPw.set(!showPw())" class="absolute right-3 top-3 text-th-text-3 hover:text-th-text-3 transition text-xs px-1 py-0.5">
                    {{ showPw() ? i18n.t('Hide', 'إخفاء') : i18n.t('Show', 'عرض') }}
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
                <label class="block text-th-text-3 text-xs mb-1.5 font-medium">{{ i18n.t('Confirm Password', 'تأكيد كلمة المرور') }} <span class="text-red-500">*</span></label>
                <input [(ngModel)]="form.confirm" name="confirm" [type]="showPw() ? 'text' : 'password'" placeholder="Re-enter password" required autocomplete="new-password"
                       class="w-full bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                       [class.border-red-600]="form.confirm && form.confirm !== form.password" />
                @if (form.confirm && form.confirm !== form.password) {
                  <p class="text-red-500 text-xs mt-1">{{ i18n.t('Passwords do not match', 'كلمات المرور غير متطابقة') }}</p>
                }
              </div>

              @if (error()) {
                <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{{ error() }}</div>
              }

              <button type="submit" [disabled]="loading() || !canSubmit()"
                      class="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
                @if (loading()) {
                  <span class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                    {{ i18n.t('Creating account...', 'جاري إنشاء الحساب...') }}
                  </span>
                } @else {
                  {{ i18n.t('Create Account', 'إنشاء حساب') }}
                }
              </button>

              <p class="text-center text-th-text-2 text-xs pt-2">
                {{ i18n.t('Already have an account?', 'لديك حساب بالفعل؟') }} <a routerLink="/login" class="text-primary hover:underline">{{ i18n.t('Sign in', 'تسجيل الدخول') }}</a>
              </p>
            </form>
          }
        </div>

      </div>
    </div>
  `,
})
export class RegisterPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  i18n = inject(I18nService);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  showPw = signal(false);

  get categories() {
    return [
      { value: 'customer', label: this.i18n.t('Customer', 'عميل') },
      { value: 'partner', label: this.i18n.t('Partner', 'شريك') },
      { value: 'freelancer', label: this.i18n.t('Freelancer', 'مستقل') },
      { value: 'vendor', label: this.i18n.t('Vendor', 'مورّد') },
      { value: 'technology-partner', label: this.i18n.t('Technology Partner', 'شريك تقني') },
      { value: 'service-partner', label: this.i18n.t('Service Partner', 'شريك خدمات') },
      { value: 'design-partner', label: this.i18n.t('Design Partner', 'شريك تصميم') },
    ];
  }

  form = { name: '', email: '', company: '', password: '', confirm: '', category: 'customer' };

  isDoganconsultEmail(): boolean {
    return this.form.email.split('@')[1]?.toLowerCase() === 'doganconsult.com';
  }

  pwStrength(): number {
    const p = this.form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }

  canSubmit() {
    return this.form.email.includes('@') &&
      !this.isDoganconsultEmail() &&
      this.form.password.length >= 8 &&
      this.form.password === this.form.confirm;
  }

  register() {
    if (this.loading() || !this.canSubmit()) return;
    this.loading.set(true);
    this.error.set(null);

    this.http.post<{ ok: boolean; token: string; user: any; redirect_url?: string }>('/api/v1/public/auth/register', {
      email: this.form.email.trim(),
      password: this.form.password,
      name: this.form.name.trim() || this.form.email.split('@')[0],
      company: this.form.company.trim() || undefined,
      category: this.form.category,
    }).subscribe({
      next: (r) => {
        this.loading.set(false);
        localStorage.setItem('dc_user_token', r.token);
        localStorage.setItem('dc_user', JSON.stringify(r.user));
        const raw = r.redirect_url;
        const safeRedirect = raw && typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/workspace';
        this.router.navigateByUrl(safeRedirect);
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e.error?.error || 'Registration failed. Please try again.');
      },
    });
  }
}
