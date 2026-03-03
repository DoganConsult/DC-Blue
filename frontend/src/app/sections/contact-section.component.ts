import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  template: `
    <section class="py-20 lg:py-24" id="cta" style="background: var(--gradient-primary, linear-gradient(135deg, #1f49c7 0%, #2f6df3 100%));">
      <div class="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
        <h2 class="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-white mb-4">
          {{ i18n.t('Ready to Discuss Your Requirements?', 'هل أنت مستعد لمناقشة متطلباتك؟') }}
        </h2>
        <p class="text-[16px] text-white/80 max-w-xl mx-auto leading-relaxed mb-8">
          {{ i18n.t(
            'Contact us now to discover how our consulting team can support your digital and infrastructure projects.',
            'تواصل معنا الآن لاكتشاف كيف يمكن لفريق الاستشارات دعم مشاريعك التقنية والبنية التحتية الرقمية.'
          ) }}
        </p>
        <button (click)="router.navigate(['/inquiry'])"
                class="inline-flex items-center gap-2 px-8 py-4 bg-gold-accent text-th-text rounded-xl font-bold text-[15px] hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
          {{ i18n.t('Contact Us', 'تواصل معنا') }}
        </button>
      </div>
    </section>
  `,
})
export class ContactSectionComponent {
  i18n = inject(I18nService);
  router = inject(Router);
}
