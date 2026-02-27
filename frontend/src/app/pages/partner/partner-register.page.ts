import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';

export interface PartnerRegisterForm {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string;
  type: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-partner-register',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[var(--brand-dark)] via-[#0c4a82] to-[var(--brand-darker)]">
      <nav class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <a class="text-white font-bold text-xl tracking-tight cursor-pointer" (click)="goHome()">
          Dogan<span class="text-[var(--gold)]">Consult</span>
        </a>
        <button (click)="i18n.setLang(i18n.lang() === 'en' ? 'ar' : 'en')"
                class="text-white/80 hover:text-white text-sm border border-white/20 px-3 py-1 rounded-full transition">
          {{ i18n.t('عربي', 'English') }}
        </button>
      </nav>

      <div class="max-w-2xl mx-auto px-4 py-12">
        <div class="text-center mb-10">
          <div class="w-14 h-14 bg-[var(--gold)]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-[var(--gold)]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white mb-3">
            {{ i18n.t('Partner Program', 'برنامج الشركاء') }}
          </h1>
          <p class="text-white/70">
            {{ i18n.t('Join our reseller and referral network. Earn commissions on every deal.', 'انضم إلى شبكة الموزعين والإحالات. اكسب عمولات على كل صفقة.') }}
          </p>
        </div>

        @if (success()) {
          <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 class="text-xl font-bold text-white mb-2">{{ i18n.t('Application Submitted!', 'تم إرسال الطلب!') }}</h2>
            <p class="text-white/70 mb-4">{{ i18n.t('We\\'ll review your application and send your API key once approved.', 'سنراجع طلبك ونرسل لك مفتاح API بعد الموافقة.') }}</p>
            @if (apiKey()) {
              <div class="bg-black/30 rounded-xl p-4 mb-4">
                <p class="text-white/50 text-xs mb-1">{{ i18n.t('Your API Key (save it securely)', 'مفتاح API الخاص بك (احفظه بأمان)') }}</p>
                <p class="text-emerald-400 font-mono text-sm break-all">{{ apiKey() }}</p>
              </div>
            }
            <button (click)="goHome()" class="px-6 py-2 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/80 transition">
              {{ i18n.t('Back to Home', 'العودة للرئيسية') }}
            </button>
          </div>
        } @else {
          @if (error()) {
            <div class="bg-red-500/10 border border-red-400/30 text-red-200 rounded-xl p-4 mb-6 text-center">{{ error() }}</div>
            <div class="flex flex-col sm:flex-row gap-3 mb-6">
              <button type="button" (click)="goPortal()"
                      class="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition text-sm font-semibold">
                {{ i18n.t('Go to Partner Portal', 'الانتقال إلى بوابة الشركاء') }}
              </button>
              <button type="button" (click)="resendAccess()" [disabled]="resendLoading() || !(form.email || '').trim()"
                      class="flex-1 py-3 rounded-xl font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary)]/80 transition disabled:opacity-50 text-sm">
                @if (resendLoading()) {
                  <span class="inline-flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                    {{ i18n.t('Sending...', 'جارٍ الإرسال...') }}
                  </span>
                } @else {
                  {{ i18n.t('Email me my API key / login link', 'أرسل لي مفتاح API / رابط الدخول') }}
                }
              </button>
            </div>
            @if (resendSuccess()) {
              <div class="bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 rounded-xl p-4 mb-6 text-center text-sm">
                {{ i18n.t('Email sent. Please check your inbox (and spam).', 'تم إرسال البريد الإلكتروني. يرجى التحقق من بريدك الوارد (والرسائل غير المرغوب فيها).') }}
              </div>
            }
          }

          <form #f="ngForm" (ngSubmit)="register()" class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Company Name', 'اسم الشركة') }} *</label>
                <input name="company_name" [(ngModel)]="form.company_name" required
                       class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
              </div>
              <div>
                <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Contact Name', 'الاسم') }} *</label>
                <input name="contact_name" [(ngModel)]="form.contact_name" required
                       class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Email', 'البريد الإلكتروني') }} *</label>
                <input name="email" [(ngModel)]="form.email" required type="email"
                       class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
              </div>
              <div>
                <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Phone', 'الهاتف') }}</label>
                <input name="phone" [(ngModel)]="form.phone" type="tel"
                       class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
              </div>
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Website', 'الموقع') }}</label>
              <input name="website" [(ngModel)]="form.website" type="url" placeholder="https://"
                     class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Partner Type', 'نوع الشراكة') }} *</label>
              <select name="type" [(ngModel)]="form.type" required
                      class="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] [&>option]:text-gray-900">
                <option value="" disabled selected class="text-gray-500">{{ i18n.t('Select partner type...', 'اختر نوع الشراكة...') }}</option>
                <option value="reseller">{{ i18n.t('Reseller', 'موزع') }}</option>
                <option value="referral">{{ i18n.t('Referral Partner', 'شريك إحالة') }}</option>
                <option value="technology">{{ i18n.t('Technology Partner', 'شريك تقني') }}</option>
              </select>
            </div>

            <button type="submit" [disabled]="loading() || !f.valid"
                    class="w-full py-4 rounded-xl font-semibold text-lg transition-all
                           bg-gradient-to-r from-[var(--gold)] to-amber-600 text-white
                           hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              @if (loading()) {
                <span class="inline-flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                  {{ i18n.t('Registering...', 'جارٍ التسجيل...') }}
                </span>
              } @else {
                {{ i18n.t('Apply to Partner Program', 'تقدم لبرنامج الشركاء') }}
              }
            </button>
          </form>
        }
      </div>
    </div>
  `,
})
export class PartnerRegisterPage {
  i18n = inject(I18nService);
  private http = inject(HttpClient);
  private router = inject(Router);

  loading = signal(false);
  resendLoading = signal(false);
  error = signal<string | null>(null);
  resendSuccess = signal(false);
  success = signal(false);
  apiKey = signal('');

  form: PartnerRegisterForm = {
    company_name: '', contact_name: '', email: '', phone: '', website: '', type: '',
  };

  goHome() { this.router.navigate(['/']); }

  register() {
    this.loading.set(true);
    this.error.set(null);
    this.resendSuccess.set(false);
    this.http.post<{ ok: boolean; partner_id?: string; api_key?: string; error?: string }>(
      '/api/v1/public/partners/register', this.form
    ).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.success.set(true);
        if (res.api_key) this.apiKey.set(res.api_key);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error || this.i18n.t('Something went wrong.', 'حدث خطأ.'));
      },
    });
  }

  goPortal() {
    this.router.navigate(['/partner']);
  }

  resendAccess() {
    const email = (this.form.email || '').trim();
    if (!email) return;
    this.resendLoading.set(true);
    this.resendSuccess.set(false);
    this.error.set(null);
    this.http.post<{ ok: boolean; error?: string }>(
      '/api/v1/public/partners/resend-access',
      { email, lang: this.i18n.lang() }
    ).subscribe({
      next: () => {
        this.resendLoading.set(false);
        this.resendSuccess.set(true);
      },
      error: (err) => {
        this.resendLoading.set(false);
        this.error.set(err.error?.error || this.i18n.t('Failed to send email.', 'فشل إرسال البريد الإلكتروني.'));
      },
    });
  }
}
