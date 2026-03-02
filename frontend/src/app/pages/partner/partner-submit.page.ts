import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { PartnerApiService } from '../../core/services/partner-api.service';
import { KSA_CR_ACTIVITIES } from '../../core/data/ksa-cr-activities';
import { KSA_CITIES } from '../../core/data/ksa-cities';

export interface PartnerLeadForm {
  contact_name: string;
  contact_email: string;
  company_name: string;
  contact_phone: string;
  product_line: string;
  message: string;
  consent_pdpl: boolean;
  country: string;
  city: string;
  address_line: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-partner-submit',
  template: `
    <div class="min-h-screen bg-th-bg-alt">
      <nav class="bg-th-card border-b border-th-border">
        <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <a class="font-bold text-lg tracking-tight cursor-pointer text-th-text" (click)="router.navigate(['/'])">
            Dogan<span class="text-primary">Consult</span>
          </a>
          <button (click)="router.navigate(['/partner'])"
                  class="text-th-text-3 hover:text-th-text text-sm border border-th-border px-3 py-1.5 rounded-full transition flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            {{ i18n.t('Dashboard', 'لوحة التحكم') }}
          </button>
        </div>
      </nav>

      <div class="max-w-2xl mx-auto px-4 py-12">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-th-text mb-2">{{ i18n.t('Submit a Lead', 'إرسال عميل محتمل') }}</h1>
          <p class="text-th-text-3 text-sm">{{ i18n.t('Enter the prospect details below.', 'أدخل بيانات العميل المحتمل أدناه.') }}</p>
        </div>

        @if (!partnerApi.isAuthenticated()) {
          <div class="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-4 text-center text-sm">
            {{ i18n.t('Please login to your partner dashboard first.', 'يرجى تسجيل الدخول إلى لوحة تحكم الشريك أولاً.') }}
            <a class="text-primary hover:underline cursor-pointer ml-1" (click)="router.navigate(['/partner'])">
              {{ i18n.t('Go to Dashboard', 'الذهاب إلى لوحة التحكم') }}
            </a>
          </div>
        } @else if (success()) {
          <div class="bg-th-card border border-th-border rounded-2xl p-8 text-center shadow-sm">
            <div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 class="text-lg font-bold text-th-text mb-2">{{ i18n.t('Lead Submitted!', 'تم إرسال العميل!') }}</h2>
            <p class="text-th-text-3 mb-4">{{ i18n.t('Ticket:', 'الرقم:') }} <span class="text-primary font-mono font-semibold">{{ ticket() }}</span></p>
            <div class="flex gap-3 justify-center">
              <button (click)="reset()" class="px-5 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition text-sm">{{ i18n.t('Submit Another', 'إرسال آخر') }}</button>
              <button (click)="router.navigate(['/partner'])" class="px-5 py-2 rounded-xl border border-th-border text-th-text-2 hover:bg-th-bg-alt transition text-sm">{{ i18n.t('Dashboard', 'لوحة التحكم') }}</button>
            </div>
          </div>
        } @else {
          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-center text-sm">{{ error() }}</div>
          }
          <form #f="ngForm" (ngSubmit)="submit()" class="bg-th-card border border-th-border rounded-2xl p-6 md:p-10 space-y-5 shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-th-text-2 text-sm font-medium mb-1.5">{{ i18n.t('Contact Name', 'الاسم') }} *</label>
                <input name="contact_name" [(ngModel)]="form.contact_name" required
                       class="w-full bg-th-bg-alt text-th-text placeholder-th-text-3 border border-th-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label class="block text-th-text-2 text-sm font-medium mb-1.5">{{ i18n.t('Email', 'البريد') }} *</label>
                <input name="contact_email" [(ngModel)]="form.contact_email" required type="email"
                       class="w-full bg-th-bg-alt text-th-text placeholder-th-text-3 border border-th-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-th-text-2 text-sm font-medium mb-1.5">{{ i18n.t('Company', 'الشركة') }} *</label>
                <input name="company_name" [(ngModel)]="form.company_name" required
                       class="w-full bg-th-bg-alt text-th-text placeholder-th-text-3 border border-th-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label class="block text-th-text-2 text-sm font-medium mb-1.5">{{ i18n.t('Phone', 'الهاتف') }}</label>
                <input name="contact_phone" [(ngModel)]="form.contact_phone" type="tel"
                       class="w-full bg-th-bg-alt text-th-text placeholder-th-text-3 border border-th-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </div>
            <div>
              <label class="block text-th-text-2 text-sm font-medium mb-1.5">{{ i18n.t('Service Area', 'مجال الخدمة') }}</label>
              <select name="product_line" [(ngModel)]="form.product_line"
                      class="w-full bg-th-bg-alt text-th-text border border-th-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">{{ i18n.t('Select...', 'اختر...') }}</option>
                @for (a of crActivities; track a.code) {
                  <option [value]="a.code">{{ i18n.lang() === 'ar' ? a.nameAr : a.nameEn }} ({{ a.code }})</option>
                }
              </select>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-th-text-2 text-sm font-medium mb-1.5">{{ i18n.t('Country', 'الدولة') }} *</label>
                <select name="country" [(ngModel)]="form.country" required
                        class="w-full bg-th-bg-alt text-th-text border border-th-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="SA">{{ i18n.t('Saudi Arabia', 'المملكة العربية السعودية') }}</option>
                  <option value="AE">{{ i18n.t('United Arab Emirates', 'الإمارات') }}</option>
                  <option value="EG">{{ i18n.t('Egypt', 'مصر') }}</option>
                  <option value="Other">{{ i18n.t('Other', 'أخرى') }}</option>
                </select>
              </div>
              <div>
                <label class="block text-th-text-2 text-sm font-medium mb-1.5">{{ i18n.t('City', 'المدينة') }}</label>
                <select name="city" [(ngModel)]="form.city"
                        class="w-full bg-th-bg-alt text-th-text border border-th-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">{{ i18n.t('Select...', 'اختر...') }}</option>
                  @for (c of ksaCities; track c.value) {
                    <option [value]="c.value">{{ i18n.lang() === 'ar' ? c.labelAr : c.labelEn }}</option>
                  }
                </select>
              </div>
            </div>
            <div>
              <label class="block text-th-text-2 text-sm font-medium mb-1.5">{{ i18n.t('Address', 'العنوان') }}</label>
              <input name="address_line" [(ngModel)]="form.address_line"
                     [placeholder]="i18n.t('Building, district, street', 'المبنى، الحي، الشارع')"
                     class="w-full bg-th-bg-alt text-th-text placeholder-th-text-3 border border-th-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
              <label class="block text-th-text-2 text-sm font-medium mb-1.5">{{ i18n.t('Notes', 'ملاحظات') }}</label>
              <textarea name="message" [(ngModel)]="form.message" rows="3"
                        class="w-full bg-th-bg-alt text-th-text placeholder-th-text-3 border border-th-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"></textarea>
            </div>
            <button type="submit" [disabled]="loading() || !f.valid"
                    class="w-full py-4 rounded-xl font-semibold text-lg transition-all
                           bg-primary text-white hover:bg-primary-dark
                           disabled:opacity-50 disabled:cursor-not-allowed">
              @if (loading()) {
                <svg class="animate-spin h-5 w-5 inline mr-2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
              }
              {{ i18n.t('Submit Lead', 'إرسال العميل') }}
            </button>
          </form>
        }
      </div>
    </div>
  `,
})
export class PartnerSubmitPage {
  i18n = inject(I18nService);
  router = inject(Router);
  partnerApi = inject(PartnerApiService);

  crActivities = KSA_CR_ACTIVITIES;
  ksaCities = KSA_CITIES;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  ticket = signal('');

  form: PartnerLeadForm = {
    contact_name: '', contact_email: '', company_name: '', contact_phone: '',
    product_line: '', message: '', consent_pdpl: true,
    country: 'SA', city: '', address_line: '',
  };

  submit() {
    if (!this.partnerApi.isAuthenticated()) {
      this.error.set(this.i18n.t('No API key found. Please login first.', 'لم يتم العثور على مفتاح API.'));
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.partnerApi.submitLead({
      ...this.form,
      country: this.form.country === 'Other' ? 'SA' : this.form.country,
    }).subscribe({
      next: (res) => { this.loading.set(false); this.success.set(true); this.ticket.set(res.ticket_number); },
      error: (err) => { this.loading.set(false); this.error.set(err.error?.error || 'Error'); },
    });
  }

  reset() {
    this.success.set(false);
    this.ticket.set('');
    this.error.set(null);
    this.form = { contact_name: '', contact_email: '', company_name: '', contact_phone: '', product_line: '', message: '', consent_pdpl: true, country: 'SA', city: '', address_line: '' };
  }
}
