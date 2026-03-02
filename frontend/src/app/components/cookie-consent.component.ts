import { Component, inject, signal, OnInit } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="fixed bottom-0 left-0 right-0 z-[1080] bg-th-card border-t border-th-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-6 py-4 animate-slideUp">
        <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p class="text-sm text-th-text-2 leading-relaxed max-w-2xl">
            {{ i18n.t(
              'We use cookies to enhance your experience and comply with PDPL regulations. By continuing, you agree to our cookie policy.',
              'نستخدم ملفات تعريف الارتباط لتحسين تجربتك والامتثال لنظام حماية البيانات الشخصية. بالمتابعة، أنت توافق على سياسة ملفات تعريف الارتباط.'
            ) }}
          </p>
          <div class="flex items-center gap-3 shrink-0">
            <button (click)="accept()" class="px-5 py-2 rounded-lg bg-th-bg-inv text-th-text-inv text-sm font-semibold hover:bg-th-bg-inv transition-colors">
              {{ i18n.t('Accept', 'قبول') }}
            </button>
            <button (click)="dismiss()" class="px-5 py-2 rounded-lg border border-th-border text-th-text-2 text-sm font-medium hover:bg-th-bg-alt transition-colors">
              {{ i18n.t('Decline', 'رفض') }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slideUp {
      animation: slideUp 0.3s ease-out;
    }
  `]
})
export class CookieConsentComponent implements OnInit {
  i18n = inject(I18nService);
  visible = signal(false);

  ngOnInit() {
    const consent = localStorage.getItem('dc_cookie_consent');
    if (!consent) {
      setTimeout(() => this.visible.set(true), 1500);
    }
  }

  accept() {
    localStorage.setItem('dc_cookie_consent', 'accepted');
    this.visible.set(false);
  }

  dismiss() {
    localStorage.setItem('dc_cookie_consent', 'declined');
    this.visible.set(false);
  }
}
