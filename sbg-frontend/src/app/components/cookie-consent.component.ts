import { Component, inject, signal, OnInit } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'sbg-cookie-consent',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="fixed bottom-0 inset-x-0 z-50 p-4">
        <div class="max-w-4xl mx-auto bg-sbg-navy text-white rounded-xl shadow-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
          <p class="text-sm flex-1">
            {{ i18n.t(
              'We use cookies to improve your experience. By continuing, you agree to our cookie policy in compliance with PDPL.',
              'نستخدم ملفات تعريف الارتباط لتحسين تجربتك. بالاستمرار، فإنك توافق على سياسة ملفات تعريف الارتباط الخاصة بنا وفقاً لنظام حماية البيانات الشخصية.'
            ) }}
          </p>
          <div class="flex gap-2">
            <button (click)="accept()" class="px-4 py-2 rounded-lg sbg-gradient-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              {{ i18n.t('Accept', 'قبول') }}
            </button>
            <button (click)="decline()" class="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
              {{ i18n.t('Decline', 'رفض') }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class CookieConsentComponent implements OnInit {
  i18n = inject(I18nService);
  visible = signal(false);

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const consent = localStorage.getItem('sbg-cookie-consent');
      if (!consent) this.visible.set(true);
    }
  }

  accept(): void {
    localStorage.setItem('sbg-cookie-consent', 'accepted');
    this.visible.set(false);
  }

  decline(): void {
    localStorage.setItem('sbg-cookie-consent', 'declined');
    this.visible.set(false);
  }
}
