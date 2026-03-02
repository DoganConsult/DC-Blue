import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'sbg-trust-badges',
  standalone: true,
  template: `
    <div class="flex flex-wrap justify-center gap-4 md:gap-6">
      @for (badge of badges; track badge.icon) {
        <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm text-white/90">
          <span>{{ badge.icon }}</span>
          <span>{{ i18n.t(badge.en, badge.ar) }}</span>
        </div>
      }
    </div>
  `,
})
export class TrustBadgesComponent {
  i18n = inject(I18nService);

  badges = [
    { icon: '🏛️', en: 'Government-Ready', ar: 'جاهز للحكومة' },
    { icon: '🔒', en: 'NCA-Aligned', ar: 'متوافق مع NCA' },
    { icon: '🇸🇦', en: 'Saudi-First', ar: 'سعودي أولاً' },
    { icon: '☁️', en: 'Microsoft Partner', ar: 'شريك مايكروسوفت' },
  ];
}
