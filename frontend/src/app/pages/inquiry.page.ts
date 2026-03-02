import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { KSA_CR_ACTIVITIES, KsaCrActivity } from '../core/data/ksa-cr-activities';
import { KSA_CITIES } from '../core/data/ksa-cities';
import { COMPANY_SIZE_OPTIONS, EXPECTED_VALUE_OPTIONS } from '../core/data/lead-options';

export interface InquiryForm {
  product_line: string;
  vertical: string;
  company_name: string;
  cr_number: string;
  company_website: string;
  country: string;
  city: string;
  address_line: string;
  contact_name: string;
  contact_title: string;
  contact_email: string;
  contact_phone: string;
  company_size: string;
  expected_users: string;
  budget_range: string;
  timeline: string;
  expected_decision_date: string;
  conditions_notes: string;
  message: string;
  consent_pdpl: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-inquiry',
  template: `
    <div class="bg-gradient-to-br from-brand-dark via-primary-dark to-brand-darker">
      <div class="max-w-3xl mx-auto px-4 py-12">
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">
            {{ i18n.t('Request a Proposal', 'طلب عرض') }}
          </h1>
          <p class="text-white/70 text-lg">
            {{ i18n.t(
              'Tell us about your project and we\\'ll respond within 24 hours.',
              'أخبرنا عن مشروعك وسنرد خلال 24 ساعة.'
            ) }}
          </p>
        </div>

        <!-- Error -->
        @if (error()) {
          <div class="bg-red-500/10 border border-red-400/30 text-red-200 rounded-xl p-4 mb-6 text-center">
            {{ error() }}
          </div>
        }

        <!-- Form Card -->
        <form #f="ngForm" (ngSubmit)="submit()" class="bg-th-card/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 space-y-6">

          <!-- Service / Product Line (KSA CR activities - single source of truth) -->
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Service Area', 'مجال الخدمة') }} *</label>
            <select name="product_line" [(ngModel)]="form.product_line" required
                    class="w-full bg-th-card/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="" disabled class="text-th-text">{{ i18n.t('Select...', 'اختر...') }}</option>
              @for (a of crActivities(); track a.code) {
                <option [value]="a.code" class="text-th-text">{{ i18n.lang() === 'ar' ? a.nameAr : a.nameEn }} ({{ a.code }})</option>
              }
            </select>
          </div>

          <!-- Industry / Vertical -->
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Industry', 'القطاع') }}</label>
            <select name="vertical" [(ngModel)]="form.vertical"
                    class="w-full bg-th-card/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="" class="text-th-text">{{ i18n.t('Select...', 'اختر...') }}</option>
              <option value="government" class="text-th-text">{{ i18n.t('Government', 'الحكومة') }}</option>
              <option value="banking" class="text-th-text">{{ i18n.t('Banking & Finance', 'البنوك والمالية') }}</option>
              <option value="healthcare" class="text-th-text">{{ i18n.t('Healthcare', 'الرعاية الصحية') }}</option>
              <option value="energy" class="text-th-text">{{ i18n.t('Energy & Utilities', 'الطاقة والمرافق') }}</option>
              <option value="telecom" class="text-th-text">{{ i18n.t('Telecom', 'الاتصالات') }}</option>
              <option value="retail" class="text-th-text">{{ i18n.t('Retail & E-Commerce', 'التجزئة والتجارة الإلكترونية') }}</option>
              <option value="education" class="text-th-text">{{ i18n.t('Education', 'التعليم') }}</option>
              <option value="other" class="text-th-text">{{ i18n.t('Other', 'أخرى') }}</option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Company -->
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Company Name', 'اسم الشركة') }} *</label>
              <input name="company_name" [(ngModel)]="form.company_name" required
                     [placeholder]="i18n.t('Your company', 'شركتك')"
                     class="w-full bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <!-- CR Number -->
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('CR Number', 'رقم السجل التجاري') }}</label>
              <input name="cr_number" [(ngModel)]="form.cr_number"
                     [placeholder]="i18n.t('e.g. 1010xxxxxx', 'مثال: 1010xxxxxx')"
                     class="w-full bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <!-- Website -->
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Website', 'الموقع الإلكتروني') }}</label>
            <input name="company_website" [(ngModel)]="form.company_website" type="url"
                   placeholder="https://"
                   class="w-full bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <!-- Address -->
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Address', 'العنوان') }}</label>
            <input name="address_line" [(ngModel)]="form.address_line"
                   [placeholder]="i18n.t('Street, building, district', 'الشارع، المبنى، الحي')"
                   class="w-full bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <!-- Country + City (KSA cities list) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Country', 'الدولة') }}</label>
              <select name="country" [(ngModel)]="form.country"
                      class="w-full bg-th-card/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="SA" class="text-th-text">{{ i18n.t('Saudi Arabia', 'المملكة العربية السعودية') }}</option>
                <option value="AE" class="text-th-text">{{ i18n.t('United Arab Emirates', 'الإمارات') }}</option>
                <option value="EG" class="text-th-text">{{ i18n.t('Egypt', 'مصر') }}</option>
                <option value="Other" class="text-th-text">{{ i18n.t('Other', 'أخرى') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('City', 'المدينة') }}</label>
              <select name="city" [(ngModel)]="form.city"
                      class="w-full bg-th-card/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="" class="text-th-text">{{ i18n.t('Select...', 'اختر...') }}</option>
                @for (c of ksaCities; track c.value) {
                  <option [value]="c.value" class="text-th-text">{{ i18n.lang() === 'ar' ? c.labelAr : c.labelEn }}</option>
                }
              </select>
            </div>
          </div>

          <hr class="border-white/10" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Contact Name -->
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Your Name', 'اسمك') }} *</label>
              <input name="contact_name" [(ngModel)]="form.contact_name" required
                     [placeholder]="i18n.t('Full name', 'الاسم الكامل')"
                     class="w-full bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <!-- Title -->
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Job Title', 'المسمى الوظيفي') }}</label>
              <input name="contact_title" [(ngModel)]="form.contact_title"
                     [placeholder]="i18n.t('e.g. CTO', 'مثال: مدير التقنية')"
                     class="w-full bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Email -->
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Work Email', 'البريد الإلكتروني') }} *</label>
              <input name="contact_email" [(ngModel)]="form.contact_email" required type="email"
                     [placeholder]="i18n.t('you@company.com', 'you@company.com')"
                     class="w-full bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <!-- Phone -->
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Phone', 'الهاتف') }}</label>
              <input name="contact_phone" [(ngModel)]="form.contact_phone" type="tel"
                     placeholder="+966 5x xxx xxxx"
                     class="w-full bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <hr class="border-white/10" />

          <!-- Company size (experience) + Expected decision/signature date -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Company Size (employees)', 'حجم الشركة (موظفين)') }}</label>
              <select name="company_size" [(ngModel)]="form.company_size"
                      class="w-full bg-th-card/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="" class="text-th-text">{{ i18n.t('Select...', 'اختر...') }}</option>
                @for (o of companySizeOptions; track o.value) {
                  <option [value]="o.value" class="text-th-text">{{ i18n.lang() === 'ar' ? o.labelAr : o.labelEn }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Expected Decision / Signature Date', 'تاريخ اتخاذ القرار / التوقيع المتوقع') }}</label>
              <input name="expected_decision_date" [(ngModel)]="form.expected_decision_date" type="date"
                     class="w-full bg-th-card/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Expected Users -->
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Expected Users / Endpoints', 'عدد المستخدمين / الأجهزة') }}</label>
              <select name="expected_users" [(ngModel)]="form.expected_users"
                      class="w-full bg-th-card/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="" class="text-th-text">{{ i18n.t('Select...', 'اختر...') }}</option>
                <option value="1-50" class="text-th-text">1 – 50</option>
                <option value="51-200" class="text-th-text">51 – 200</option>
                <option value="201-500" class="text-th-text">201 – 500</option>
                <option value="501-1000" class="text-th-text">501 – 1,000</option>
                <option value="1000+" class="text-th-text">1,000+</option>
              </select>
            </div>
            <!-- Budget / Expected value (SAR) -->
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Expected Value (SAR)', 'القيمة المتوقعة (ر.س)') }}</label>
              <select name="budget_range" [(ngModel)]="form.budget_range"
                      class="w-full bg-th-card/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                @for (o of expectedValueOptions; track o.value) {
                  <option [value]="o.value" class="text-th-text">{{ i18n.lang() === 'ar' ? o.labelAr : o.labelEn }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Timeline -->
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Timeline', 'الجدول الزمني') }}</label>
            <select name="timeline" [(ngModel)]="form.timeline"
                    class="w-full bg-th-card/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="" class="text-th-text">{{ i18n.t('Select...', 'اختر...') }}</option>
              <option value="immediate" class="text-th-text">{{ i18n.t('Immediate (< 1 month)', 'فوري (أقل من شهر)') }}</option>
              <option value="1-3months" class="text-th-text">1 – 3 {{ i18n.t('months', 'أشهر') }}</option>
              <option value="3-6months" class="text-th-text">3 – 6 {{ i18n.t('months', 'أشهر') }}</option>
              <option value="6months+" class="text-th-text">6+ {{ i18n.t('months', 'أشهر') }}</option>
            </select>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Project Details', 'تفاصيل المشروع') }}</label>
            <textarea name="message" [(ngModel)]="form.message" rows="4"
                      [placeholder]="i18n.t('Describe your project requirements...', 'صف متطلبات مشروعك...')"
                      class="w-full bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
          </div>

          <!-- Conditions / requirements details -->
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">{{ i18n.t('Conditions or Requirements', 'الشروط أو المتطلبات') }}</label>
            <textarea name="conditions_notes" [(ngModel)]="form.conditions_notes" rows="2"
                      [placeholder]="i18n.t('e.g. compliance, payment terms, NDA...', 'مثال: الامتثال، شروط الدفع، اتفاقية السرية...')"
                      class="w-full bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
          </div>

          <!-- PDPL Consent -->
          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="consent_pdpl" [(ngModel)]="form.consent_pdpl"
                   class="mt-1 w-5 h-5 rounded border-white/20 bg-th-card/10 text-primary focus:ring-primary" />
            <span class="text-white/70 text-sm leading-relaxed">
              {{ i18n.t(
                'I consent to Dogan Consult processing my data in accordance with Saudi Arabia\\'s Personal Data Protection Law (PDPL) to respond to this inquiry.',
                'أوافق على معالجة بياناتي من قبل دوقان للاستشارات وفقًا لنظام حماية البيانات الشخصية (PDPL) للرد على هذا الاستفسار.'
              ) }} *
            </span>
          </label>

          <!-- Submit -->
          <button type="submit" [disabled]="loading() || !f.valid || !form.consent_pdpl"
                  class="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200
                         bg-gradient-to-r from-primary to-blue-600 text-white
                         hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
            @if (loading()) {
              <span class="inline-flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                {{ i18n.t('Submitting...', 'جارٍ الإرسال...') }}
              </span>
            } @else {
              {{ i18n.t('Submit Inquiry', 'إرسال الاستفسار') }}
            }
          </button>
        </form>

        <p class="text-center text-white/40 text-xs mt-8">
          {{ i18n.t('Your data is protected under PDPL. We never share your information.', 'بياناتك محمية بموجب نظام حماية البيانات الشخصية. لن نشارك معلوماتك أبدًا.') }}
        </p>
      </div>
    </div>
  `,
})
export class InquiryPage implements OnInit {
  i18n = inject(I18nService);
  private http = inject(HttpClient);
  private router = inject(Router);

  crActivities = signal<KsaCrActivity[]>(KSA_CR_ACTIVITIES);
  ksaCities = KSA_CITIES;
  companySizeOptions = COMPANY_SIZE_OPTIONS;
  expectedValueOptions = EXPECTED_VALUE_OPTIONS;
  loading = signal(false);
  error = signal<string | null>(null);

  form: InquiryForm = {
    product_line: '',
    vertical: '',
    company_name: '',
    cr_number: '',
    company_website: '',
    country: 'SA',
    city: '',
    address_line: '',
    contact_name: '',
    contact_title: '',
    contact_email: '',
    contact_phone: '',
    company_size: '',
    expected_users: '',
    budget_range: '',
    timeline: '',
    expected_decision_date: '',
    conditions_notes: '',
    message: '',
    consent_pdpl: false,
  };

  ngOnInit(): void {
    this.http.get<{ data: KsaCrActivity[] }>('/api/v1/public/cr-activities').subscribe({
      next: (res) => { if (res?.data?.length) this.crActivities.set(res.data); },
      error: () => {},
    });
  }

  submit() {
    this.loading.set(true);
    this.error.set(null);

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('dc_user_token') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.post<{ ok: boolean; ticket_number: string; error?: string; existing_ticket?: string }>(
      '/api/v1/public/inquiries',
      { ...this.form, source: 'website', country: this.form.country === 'Other' ? 'SA' : this.form.country },
      { headers }
    ).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.router.navigate(['/thanks'], { queryParams: { ticket: res.ticket_number } });
      },
      error: (err) => {
        this.loading.set(false);
        const body = err.error || {};
        if (body.existing_ticket) {
          this.error.set(this.i18n.t(
            `A similar inquiry already exists (${body.existing_ticket}). We'll be in touch soon.`,
            `يوجد استفسار مماثل بالفعل (${body.existing_ticket}). سنتواصل معك قريبًا.`
          ));
        } else {
          this.error.set(body.error || this.i18n.t('Something went wrong. Please try again.', 'حدث خطأ. يرجى المحاولة مرة أخرى.'));
        }
      },
    });
  }
}
