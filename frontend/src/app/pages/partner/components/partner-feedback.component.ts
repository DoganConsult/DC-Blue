import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';

@Component({
  selector: 'app-partner-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-th-card border border-th-border rounded-xl p-6">
      <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Share Feedback', 'شاركنا رأيك') }}</h3>

      @if (submitted()) {
        <div class="text-center py-8">
          <span class="text-4xl">🎉</span>
          <h4 class="text-lg font-semibold text-th-text mt-3 mb-1">{{ i18n.t('Thank you!', 'شكراً لك!') }}</h4>
          <p class="text-sm text-th-text-3 mb-4">{{ i18n.t('Your feedback helps us improve.', 'ملاحظاتك تساعدنا على التحسين.') }}</p>
          <button (click)="reset()" class="text-sm text-primary hover:underline">
            {{ i18n.t('Submit another', 'إرسال آخر') }}
          </button>
        </div>
      } @else {
        <!-- Rating -->
        <div class="mb-5">
          <label class="block text-sm text-th-text-2 mb-2">{{ i18n.t('How would you rate your experience?', 'كيف تقيّم تجربتك؟') }}</label>
          <div class="flex gap-2">
            @for (star of [1,2,3,4,5]; track star) {
              <button (click)="rating.set(star)"
                      class="w-10 h-10 rounded-lg text-lg transition-all"
                      [class.bg-amber-100]="rating() >= star"
                      [class.text-amber-500]="rating() >= star"
                      [class.bg-th-bg-tert]="rating() < star"
                      [class.text-th-text-3]="rating() < star"
                      [class.scale-110]="rating() === star">
                ★
              </button>
            }
          </div>
        </div>

        <!-- Category -->
        <div class="mb-5">
          <label class="block text-sm text-th-text-2 mb-2">{{ i18n.t('Category', 'الفئة') }}</label>
          <div class="flex flex-wrap gap-2">
            @for (cat of categories; track cat.value) {
              <button (click)="category.set(cat.value)"
                      class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      [class.bg-primary]="category() === cat.value"
                      [class.text-white]="category() === cat.value"
                      [class.bg-th-bg-tert]="category() !== cat.value"
                      [class.text-th-text-2]="category() !== cat.value">
                {{ i18n.t(cat.en, cat.ar) }}
              </button>
            }
          </div>
        </div>

        <!-- Message -->
        <div class="mb-5">
          <label class="block text-sm text-th-text-2 mb-2">{{ i18n.t('Your Message', 'رسالتك') }}</label>
          <textarea [(ngModel)]="message" rows="3"
                    [placeholder]="i18n.t('Tell us what you think...', 'أخبرنا برأيك...')"
                    class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
        </div>

        <button (click)="submit()" [disabled]="!rating() || sending()"
                class="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50">
          {{ i18n.t('Submit Feedback', 'إرسال الملاحظات') }}
        </button>
      }
    </div>
  `,
})
export class PartnerFeedbackComponent {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  rating = signal(0);
  category = signal('general');
  message = '';
  sending = signal(false);
  submitted = signal(false);

  readonly categories = [
    { value: 'portal', en: 'Portal', ar: 'البوابة' },
    { value: 'support', en: 'Support', ar: 'الدعم' },
    { value: 'commissions', en: 'Commissions', ar: 'العمولات' },
    { value: 'pipeline', en: 'Pipeline', ar: 'الأنابيب' },
    { value: 'general', en: 'General', ar: 'عام' },
  ];

  submit() {
    if (!this.rating()) return;
    this.sending.set(true);
    this.api.submitFeedback(this.rating(), this.category(), this.message).subscribe({
      next: () => { this.sending.set(false); this.submitted.set(true); },
      error: () => this.sending.set(false),
    });
  }

  reset() {
    this.rating.set(0);
    this.category.set('general');
    this.message = '';
    this.submitted.set(false);
  }
}
