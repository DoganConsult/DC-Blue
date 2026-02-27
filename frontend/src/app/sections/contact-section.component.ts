import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="py-16 px-4 bg-gray-50 dark:bg-gray-800/50" id="contact">
      <div class="container mx-auto max-w-2xl">
        <h2 class="text-2xl font-bold text-center mb-2">
          {{ i18n.t('Request a proposal', 'طلب عرض') }}
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
          {{ i18n.t("Tell us about your project. We'll get back to you shortly.", 'أخبرنا عن مشروعك. سنتواصل معك قريباً.') }}
        </p>

        @if (sent()) {
          <div class="rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-3 text-center">
            {{ i18n.t('Thank you. We have received your message.', 'شكراً. تم استلام رسالتك.') }}
          </div>
        } @else if (error()) {
          <div class="rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-4 py-3 text-center mb-4">
            {{ error() }}
          </div>
        }

        @if (!sent()) {
          <form (ngSubmit)="submit()" class="flex flex-col gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">{{ i18n.t('Name', 'الاسم') }}</label>
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">{{ i18n.t('Email', 'البريد الإلكتروني') }} *</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">{{ i18n.t('Company', 'الشركة') }}</label>
              <input
                type="text"
                [(ngModel)]="company"
                name="company"
                class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">{{ i18n.t('Message', 'الرسالة') }}</label>
              <textarea
                [(ngModel)]="message"
                name="message"
                rows="4"
                class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              ></textarea>
            </div>
            <button
              type="submit"
              [disabled]="loading()"
              class="mt-2 px-6 py-3 rounded bg-primary text-white font-medium hover:opacity-90 disabled:opacity-50 transition"
            >
              @if (loading()) {
                {{ i18n.lang() === 'ar' ? 'جاري الإرسال...' : 'Sending...' }}
              } @else {
                {{ i18n.t('Send', 'إرسال') }}
              }
            </button>
          </form>
        }
      </div>
    </section>
  `,
})
export class ContactSectionComponent {
  private http = inject(HttpClient);
  i18n = inject(I18nService);

  name = '';
  email = '';
  company = '';
  message = '';

  loading = signal(false);
  sent = signal(false);
  error = signal<string | null>(null);

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
