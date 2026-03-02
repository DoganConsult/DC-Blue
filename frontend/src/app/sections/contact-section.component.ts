import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { SiteSettingsService } from '../core/services/site-settings.service';
import { CONTACT_INFO } from '../core/data/site-content';
import { GRADIENTS } from '../core/data/page-styles';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="bg-th-bg-alt" id="contact" [class]="ds.section.wrapperLg">
      <div [class]="ds.section.container">
        <div class="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <p class="text-[13px] font-semibold text-primary tracking-widest uppercase mb-4">{{ i18n.t('Get in Touch', 'تواصل معنا') }}</p>
            <h2 class="text-3xl lg:text-4xl font-bold text-th-text tracking-tight mb-4">
              {{ i18n.t('Request a proposal', 'طلب عرض') }}
            </h2>
            <p class="text-lg text-th-text-3 leading-relaxed mb-10">
              {{ i18n.t("Tell us about your project. We respond within one business day.", 'أخبرنا عن مشروعك. نرد خلال يوم عمل واحد.') }}
            </p>
            <div class="text-sm text-th-text-3" [class]="ds.spacing.stackXl">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <span>{{ contactInfo().email }}</span>
              </div>
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span>{{ i18n.t(contactInfo().location.en, contactInfo().location.ar) }}</span>
              </div>
            </div>
          </div>

          <div>
            @if (sent()) {
              <div class="bg-emerald-50 border border-emerald-100 p-8 text-center" [class]="ds.radius.card">
                <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <svg class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p class="font-semibold text-th-text text-lg mb-1">{{ i18n.t('Thank you', 'شكراً') }}</p>
                <p class="text-th-text-3 text-sm">{{ i18n.t('We have received your message and will respond shortly.', 'تم استلام رسالتك وسنرد قريباً.') }}</p>
              </div>
            } @else {
              @if (error()) {
                <div class="bg-red-50 border border-red-100 px-4 py-3 text-red-600 text-sm mb-4" [class]="ds.radius.cardSm">{{ error() }}</div>
              }
              <form (ngSubmit)="submit()" [class]="ds.component.formGroupGap">
                <div [class]="ds.component.labelInputGap" class="flex flex-col">
                  <label class="block text-sm font-medium text-th-text-2">{{ i18n.t('Name', 'الاسم') }}</label>
                  <input type="text" [(ngModel)]="name" name="name"
                         class="w-full border border-th-border bg-th-card px-4 py-3 text-sm text-th-text placeholder-th-text-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" [class]="ds.radius.input + ' ' + ds.transition.base" />
                </div>
                <div [class]="ds.component.labelInputGap" class="flex flex-col">
                  <label class="block text-sm font-medium text-th-text-2">{{ i18n.t('Email', 'البريد الإلكتروني') }} *</label>
                  <input type="email" [(ngModel)]="email" name="email" required
                         class="w-full border border-th-border bg-th-card px-4 py-3 text-sm text-th-text placeholder-th-text-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" [class]="ds.radius.input + ' ' + ds.transition.base" />
                </div>
                <div [class]="ds.component.labelInputGap" class="flex flex-col">
                  <label class="block text-sm font-medium text-th-text-2">{{ i18n.t('Company', 'الشركة') }}</label>
                  <input type="text" [(ngModel)]="company" name="company"
                         class="w-full border border-th-border bg-th-card px-4 py-3 text-sm text-th-text placeholder-th-text-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" [class]="ds.radius.input + ' ' + ds.transition.base" />
                </div>
                <div [class]="ds.component.labelInputGap" class="flex flex-col">
                  <label class="block text-sm font-medium text-th-text-2">{{ i18n.t('Message', 'الرسالة') }}</label>
                  <textarea [(ngModel)]="message" name="message" rows="4"
                            class="w-full border border-th-border bg-th-card px-4 py-3 text-sm text-th-text placeholder-th-text-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" [class]="ds.radius.input + ' ' + ds.transition.base"></textarea>
                </div>
                <button type="submit" [disabled]="loading()"
                        class="w-full px-6 py-3.5 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-50" [class]="btnGradient + ' ' + ds.radius.button + ' ' + ds.transition.base">
                  @if (loading()) {
                    {{ i18n.t('Sending...', 'جاري الإرسال...') }}
                  } @else {
                    {{ i18n.t('Send Message', 'إرسال') }}
                  }
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactSectionComponent implements OnInit {
  private http = inject(HttpClient);
  i18n = inject(I18nService);
  ds = inject(DesignSystemService);
  private siteSettings = inject(SiteSettingsService);

  btnGradient = GRADIENTS.buttonContact;

  contactInfo = computed(() => {
    const s = this.siteSettings.settings();
    if (!s) return CONTACT_INFO;
    return {
      email: s.contact_email ?? CONTACT_INFO.email,
      location: {
        en: s.address_en ?? CONTACT_INFO.location.en,
        ar: s.address_ar ?? CONTACT_INFO.location.ar,
      },
      crNumber: CONTACT_INFO.crNumber,
      linkedin: CONTACT_INFO.linkedin,
      twitter: CONTACT_INFO.twitter,
    };
  });

  name = '';
  email = '';
  company = '';
  message = '';

  loading = signal(false);
  sent = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.siteSettings.load();
  }

  submit(): void {
    if (!this.email?.trim()) {
      this.error.set(this.i18n.t('Email is required.', 'البريد الإلكتروني مطلوب.'));
      return;
    }
    this.error.set(null);
    this.loading.set(true);
    this.http
      .post<{ ok: boolean }>('/api/public/leads', {
        name: this.name?.trim() || null,
        email: this.email.trim(),
        company: this.company?.trim() || null,
        message: this.message?.trim() || null,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.sent.set(true);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(this.i18n.t('Failed to send. Please try again.', 'فشل الإرسال. يرجى المحاولة مرة أخرى.'));
        },
      });
  }
}
