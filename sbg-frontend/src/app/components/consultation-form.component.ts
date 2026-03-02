import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'sbg-consultation-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-sbg-gray-700 mb-1">{{ i18n.t('Full Name', 'الاسم الكامل') }} *</label>
          <input [(ngModel)]="form.name" name="name" required type="text"
                 [placeholder]="i18n.t('Enter your full name', 'أدخل اسمك الكامل')"
                 class="w-full border border-sbg-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sbg-blue/50 focus:border-sbg-blue outline-none transition" />
        </div>
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-sbg-gray-700 mb-1">{{ i18n.t('Email', 'البريد الإلكتروني') }} *</label>
          <input [(ngModel)]="form.email" name="email" required type="email"
                 [placeholder]="i18n.t('your@company.sa', 'بريدك@شركتك.sa')"
                 class="w-full border border-sbg-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sbg-blue/50 focus:border-sbg-blue outline-none transition" />
        </div>
        <!-- Company -->
        <div>
          <label class="block text-sm font-medium text-sbg-gray-700 mb-1">{{ i18n.t('Company / Entity', 'الشركة / الجهة') }} *</label>
          <input [(ngModel)]="form.company" name="company" required type="text"
                 [placeholder]="i18n.t('Organization name', 'اسم المنظمة')"
                 class="w-full border border-sbg-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sbg-blue/50 focus:border-sbg-blue outline-none transition" />
        </div>
        <!-- Role -->
        <div>
          <label class="block text-sm font-medium text-sbg-gray-700 mb-1">{{ i18n.t('Role / Title', 'المسمى الوظيفي') }}</label>
          <input [(ngModel)]="form.role" name="role" type="text"
                 [placeholder]="i18n.t('e.g. CTO, CISO, CDO', 'مثال: مدير التقنية، مدير الأمن')"
                 class="w-full border border-sbg-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sbg-blue/50 focus:border-sbg-blue outline-none transition" />
        </div>
        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-sbg-gray-700 mb-1">{{ i18n.t('Phone', 'رقم الهاتف') }}</label>
          <input [(ngModel)]="form.phone" name="phone" type="tel"
                 [placeholder]="i18n.t('+966 5x xxx xxxx', '+966 5x xxx xxxx')"
                 class="w-full border border-sbg-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sbg-blue/50 focus:border-sbg-blue outline-none transition" />
        </div>
        <!-- Objective -->
        <div>
          <label class="block text-sm font-medium text-sbg-gray-700 mb-1">{{ i18n.t('Primary Objective', 'الهدف الأساسي') }}</label>
          <select [(ngModel)]="form.objective" name="objective"
                  class="w-full border border-sbg-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sbg-blue/50 focus:border-sbg-blue outline-none transition bg-white">
            <option value="">{{ i18n.t('Select objective', 'اختر الهدف') }}</option>
            <option value="erp">{{ i18n.t('ERP & Automation', 'تخطيط الموارد والأتمتة') }}</option>
            <option value="grc">{{ i18n.t('GRC & Compliance', 'الحوكمة والامتثال') }}</option>
            <option value="ai">{{ i18n.t('AI Solutions', 'حلول الذكاء الاصطناعي') }}</option>
            <option value="government">{{ i18n.t('Government Solutions', 'الحلول الحكومية') }}</option>
            <option value="consulting">{{ i18n.t('General Consulting', 'استشارات عامة') }}</option>
          </select>
        </div>
      </div>

      <!-- Systems -->
      <div>
        <label class="block text-sm font-medium text-sbg-gray-700 mb-1">{{ i18n.t('Current Systems', 'الأنظمة الحالية') }}</label>
        <input [(ngModel)]="form.systems" name="systems" type="text"
               [placeholder]="i18n.t('e.g. SAP, Oracle, Microsoft 365', 'مثال: SAP، Oracle، Microsoft 365')"
               class="w-full border border-sbg-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sbg-blue/50 focus:border-sbg-blue outline-none transition" />
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-medium text-sbg-gray-700 mb-1">{{ i18n.t('Additional Notes', 'ملاحظات إضافية') }}</label>
        <textarea [(ngModel)]="form.notes" name="notes" rows="4"
                  [placeholder]="i18n.t('Tell us about your requirements...', 'أخبرنا عن متطلباتك...')"
                  class="w-full border border-sbg-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sbg-blue/50 focus:border-sbg-blue outline-none transition resize-none"></textarea>
      </div>

      @if (error()) {
        <p class="text-red-600 text-sm">{{ error() }}</p>
      }

      <button type="submit" [disabled]="loading()"
              class="w-full md:w-auto px-8 py-3 rounded-xl text-white font-semibold sbg-gradient-blue hover:opacity-90 transition-opacity disabled:opacity-50">
        @if (loading()) {
          {{ i18n.t('Submitting...', 'جاري الإرسال...') }}
        } @else {
          {{ i18n.t('Request Consultation', 'طلب استشارة') }}
        }
      </button>
    </form>
  `,
})
export class ConsultationFormComponent {
  i18n = inject(I18nService);
  private http = inject(HttpClient);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = {
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    objective: '',
    systems: '',
    notes: '',
  };

  submit(): void {
    if (!this.form.name || !this.form.email || !this.form.company) {
      this.error.set(this.i18n.t('Please fill all required fields.', 'يرجى ملء جميع الحقول المطلوبة.'));
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.http.post('/api/sbg/consultation', this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/thank-you']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(this.i18n.t('Submission failed. Please try again.', 'فشل الإرسال. يرجى المحاولة مرة أخرى.'));
      },
    });
  }
}
