import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
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
    <div class="min-h-screen bg-gradient-to-br from-[var(--brand-dark)] via-[#0c4a82] to-[var(--brand-darker)]">
      <nav class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <a class="text-white font-bold text-xl tracking-tight cursor-pointer" (click)="router.navigate(['/'])">
          Dogan<span class="text-[var(--gold)]">Consult</span>
        </a>
        <button (click)="router.navigate(['/partner'])"
                class="text-white/80 hover:text-white text-sm border border-white/20 px-3 py-1 rounded-full transition">
          ← {{ i18n.t('Dashboard', 'لوحة التحكم') }}
        </button>
      </nav>

      <div class="max-w-2xl mx-auto px-4 py-12">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-white mb-2">{{ i18n.t('Submit a Lead', 'إرسال عميل محتمل') }}</h1>
          <p class="text-white/60 text-sm">{{ i18n.t('Enter the prospect details below.', 'أدخل بيانات العميل المحتمل أدناه.') }}</p>
        </div>

        @if (success()) {
          <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <div class="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 class="text-lg font-bold text-white mb-2">{{ i18n.t('Lead Submitted!', 'تم إرسال العميل!') }}</h2>
            <p class="text-white/60 mb-4">{{ i18n.t('Ticket:', 'الرقم:') }} <span class="text-[var(--gold)] font-mono">{{ ticket() }}</span></p>
            <div class="flex gap-3 justify-center">
              <button (click)="reset()" class="px-5 py-2 rounded-xl bg-[var(--gold)] text-white font-semibold hover:bg-[var(--gold)]/80 transition text-sm">{{ i18n.t('Submit Another', 'إرسال آخر') }}</button>
              <button (click)="router.navigate(['/partner'])" class="px-5 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition text-sm">{{ i18n.t('Dashboard', 'لوحة التحكم') }}</button>
            </div>
          </div>
        } @else {
          @if (error()) {
            <div class="bg-red-500/10 border border-red-400/30 text-red-200 rounded-xl p-4 mb-6 text-center">{{ error() }}</div>
          }
          <form #f="ngForm" (ngSubmit)="submit()" class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Contact Name', 'الاسم') }} *</label>
                <input name="contact_name" [(ngModel)]="form.contact_name" required
                       class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
              </div>
              <div>
                <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Email', 'البريد') }} *</label>
                <input name="contact_email" [(ngModel)]="form.contact_email" required type="email"
                       class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Company', 'الشركة') }} *</label>
                <input name="company_name" [(ngModel)]="form.company_name" required
                       class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
              </div>
              <div>
                <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Phone', 'الهاتف') }}</label>
                <input name="contact_phone" [(ngModel)]="form.contact_phone" type="tel"
                       class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
              </div>
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Service Area', 'مجال الخدمة') }}</label>
              <select name="product_line" [(ngModel)]="form.product_line"
                      class="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]">
                <option value="" class="text-gray-900">{{ i18n.t('Select...', 'اختر...') }}</option>
                @for (a of crActivities; track a.code) {
                  <option [value]="a.code" class="text-gray-900">{{ i18n.lang() === 'ar' ? a.nameAr : a.nameEn }} ({{ a.code }})</option>
                }
              </select>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Country', 'الدولة') }} *</label>
                <select name="country" [(ngModel)]="form.country" required
                        class="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]">
                  <option value="SA" class="text-gray-900">{{ i18n.t('Saudi Arabia', 'المملكة العربية السعودية') }}</option>
                  <option value="AE" class="text-gray-900">{{ i18n.t('United Arab Emirates', 'الإمارات') }}</option>
                  <option value="EG" class="text-gray-900">{{ i18n.t('Egypt', 'مصر') }}</option>
                  <option value="Other" class="text-gray-900">{{ i18n.t('Other', 'أخرى') }}</option>
                </select>
              </div>
              <div>
                <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('City', 'المدينة') }}</label>
                <select name="city" [(ngModel)]="form.city"
                        class="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]">
                  <option value="" class="text-gray-900">{{ i18n.t('Select...', 'اختر...') }}</option>
                  @for (c of ksaCities; track c.value) {
                    <option [value]="c.value" class="text-gray-900">{{ i18n.lang() === 'ar' ? c.labelAr : c.labelEn }}</option>
                  }
                </select>
              </div>
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Address', 'العنوان') }}</label>
              <input name="address_line" [(ngModel)]="form.address_line"
                     [placeholder]="i18n.t('Building, district, street', 'المبنى، الحي، الشارع')"
                     class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Notes', 'ملاحظات') }}</label>
              <textarea name="message" [(ngModel)]="form.message" rows="3"
                        class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none"></textarea>
            </div>
            <button type="submit" [disabled]="loading() || !f.valid"
                    class="w-full py-4 rounded-xl font-semibold text-lg transition-all
                           bg-gradient-to-r from-[var(--gold)] to-amber-600 text-white
                           hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5
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
  http = inject(HttpClient);
  router = inject(Router);

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
    const key = typeof localStorage !== 'undefined' ? localStorage.getItem('dc_partner_key') : null;
    if (!key) { this.error.set(this.i18n.t('No API key found. Please login first.', 'لم يتم العثور على مفتاح API.')); return; }
    this.loading.set(true);
    this.error.set(null);
    this.http.post<{ ok: boolean; ticket_number: string; error?: string }>(
      '/api/v1/partners/leads',
      { ...this.form, country: this.form.country === 'Other' ? 'SA' : this.form.country },
      { headers: { 'x-api-key': key } }
    ).subscribe({
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