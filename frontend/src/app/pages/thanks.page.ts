import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-thanks',
  template: `
    <div class="bg-[#0B1220] min-h-screen flex items-center justify-center px-4 py-16">
      <div class="max-w-lg w-full text-center">
        <!-- Check Icon -->
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
          {{ i18n.t('Thank You!', 'شكرًا لك!') }}
        </h1>

        <p class="text-white/70 text-lg mb-8">
          {{ i18n.t(
            'Your inquiry has been received successfully. Our team will review it and get back to you within 24 hours.',
            'تم استلام استفسارك بنجاح. سيقوم فريقنا بمراجعته والرد عليك خلال 24 ساعة.'
          ) }}
        </p>

        <!-- Ticket Card -->
        @if (ticket()) {
          <div class="bg-th-card/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
            <p class="text-white/50 text-sm mb-2">{{ i18n.t('Your Reference Number', 'رقم المرجع الخاص بك') }}</p>
            <p class="text-3xl font-mono font-bold text-gold tracking-wider">{{ ticket() }}</p>
            <p class="text-white/40 text-xs mt-3">
              {{ i18n.t('Save this number for future reference', 'احفظ هذا الرقم للرجوع إليه لاحقًا') }}
            </p>
          </div>
        }

        <!-- What's Next -->
        <div class="bg-th-card/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 text-left">
          <h3 class="text-white font-semibold mb-4">{{ i18n.t("What's Next?", 'ماذا بعد؟') }}</h3>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <span class="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">1</span>
              <p class="text-white/70 text-sm">{{ i18n.t('Our team reviews your requirements', 'فريقنا يراجع متطلباتك') }}</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">2</span>
              <p class="text-white/70 text-sm">{{ i18n.t('We schedule a discovery call', 'نُجدول مكالمة استكشافية') }}</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">3</span>
              <p class="text-white/70 text-sm">{{ i18n.t('You receive a tailored proposal', 'تتلقى عرضًا مُخصصًا') }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button (click)="goHome()"
                  class="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-blue-600 text-white
                         hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all">
            {{ i18n.t('Back to Home', 'العودة للرئيسية') }}
          </button>
          <button (click)="newInquiry()"
                  class="px-8 py-3 rounded-xl font-semibold border border-white/20 text-white hover:bg-th-card/10 transition-all">
            {{ i18n.t('Submit Another', 'إرسال استفسار آخر') }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ThanksPage implements OnInit {
  i18n = inject(I18nService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ticket = signal<string>('');

  ngOnInit() {
    this.route.queryParams.subscribe((p) => {
      this.ticket.set(p['ticket'] || '');
    });
  }

  goHome() { this.router.navigate(['/']); }
  newInquiry() { this.router.navigate(['/inquiry']); }
}
