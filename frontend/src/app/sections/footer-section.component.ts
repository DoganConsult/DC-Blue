import { Component, inject, computed, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { TranslatePipe } from '../core/pipes/translate.pipe';
import { SiteSettingsService } from '../core/services/site-settings.service';
import { CONTACT_INFO } from '../core/data/site-content';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  template: `
    <footer class="bg-[#061224] pt-16 pb-8">
      <div class="max-w-[1200px] mx-auto px-6 lg:px-8">
        <!-- Footer grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="w-8 h-8 rounded-lg bg-gold-accent flex items-center justify-center">
                <svg class="w-4.5 h-4.5 text-[#1D2433]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </span>
              <span class="font-bold text-[17px] text-white tracking-tight">
                DOGAN<span class="text-gold-accent">CONSULT</span>
              </span>
            </div>
            <p class="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              {{ i18n.t(
                'Independent engineering consulting in ICT infrastructure and telecommunications across KSA and the GCC.',
                'استشارات هندسية مستقلة في مجال البنية التحتية والاتصالات في المملكة والخليج.'
              ) }}
            </p>
            <!-- Social icons -->
            <div class="flex items-center gap-3">
              <a [href]="contactInfo().linkedin" target="_blank" rel="noopener" aria-label="LinkedIn"
                 class="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a [href]="contactInfo().twitter" target="_blank" rel="noopener" aria-label="X / Twitter"
                 class="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          <!-- Services -->
          <div>
            <h4 class="text-white text-[13px] font-semibold tracking-wider uppercase mb-5">{{ i18n.t('Services', 'الخدمات') }}</h4>
            <ul class="space-y-3 text-sm text-white/50">
              <li><a routerLink="/services" class="hover:text-white transition-colors">{{ i18n.t('Data Centers', 'مراكز البيانات') }}</a></li>
              <li><a routerLink="/services" class="hover:text-white transition-colors">{{ i18n.t('Telecommunications', 'الاتصالات') }}</a></li>
              <li><a routerLink="/services" class="hover:text-white transition-colors">{{ i18n.t('Cybersecurity', 'الأمن السيبراني') }}</a></li>
              <li><a routerLink="/services" class="hover:text-white transition-colors">{{ i18n.t('IT Governance', 'حوكمة تقنية المعلومات') }}</a></li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="text-white text-[13px] font-semibold tracking-wider uppercase mb-5">{{ i18n.t('Company', 'الشركة') }}</h4>
            <ul class="space-y-3 text-sm text-white/50">
              <li><a routerLink="/about" class="hover:text-white transition-colors">{{ i18n.t('About Us', 'من نحن') }}</a></li>
              <li><a routerLink="/case-studies" class="hover:text-white transition-colors">{{ i18n.t('Case Studies', 'دراسات حالة') }}</a></li>
              <li><a routerLink="/insights" class="hover:text-white transition-colors">{{ i18n.t('Insights', 'رؤى') }}</a></li>
              <li><a routerLink="/inquiry" class="hover:text-white transition-colors">{{ i18n.t('Contact Us', 'تواصل معنا') }}</a></li>
            </ul>
          </div>

          <!-- Portals -->
          <div>
            <h4 class="text-white text-[13px] font-semibold tracking-wider uppercase mb-5">{{ i18n.t('Quick Access', 'لوحة تحكم') }}</h4>
            <ul class="space-y-3 text-sm text-white/50">
              <li><a routerLink="/login" class="hover:text-white transition-colors">{{ i18n.t('Sign In', 'تسجيل الدخول') }}</a></li>
              <li><a routerLink="/register" class="hover:text-white transition-colors">{{ i18n.t('Register', 'التسجيل') }}</a></li>
              <li><a routerLink="/track" class="hover:text-white transition-colors">{{ i18n.t('Track Inquiry', 'تتبع الاستفسار') }}</a></li>
              <li><a routerLink="/partner" class="hover:text-white transition-colors">{{ i18n.t('Partner Portal', 'بوابة الشركاء') }}</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p class="text-white/40 text-xs">
            © {{ currentYear }} {{ i18n.t('Dogan Consult. All rights reserved.', 'دوغان للاستشارات. جميع الحقوق محفوظة.') }}
          </p>
          <div class="flex items-center gap-5 text-xs text-white/40">
            <a routerLink="/privacy" class="hover:text-white/70 transition-colors">{{ i18n.t('Privacy Policy', 'سياسة الخصوصية') }}</a>
            <a routerLink="/terms" class="hover:text-white/70 transition-colors">{{ i18n.t('Terms of Service', 'الشروط والأحكام') }}</a>
            <a routerLink="/pdpl" class="hover:text-white/70 transition-colors">{{ i18n.t('PDPL', 'نظام حماية البيانات') }}</a>
            <a routerLink="/cookies" class="hover:text-white/70 transition-colors">{{ i18n.t('Cookies', 'ملفات تعريف الارتباط') }}</a>
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
              {{ i18n.t('Made in KSA', 'صُنع في المملكة') }}
            </span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterSectionComponent implements OnInit {
  i18n = inject(I18nService);
  private siteSettings = inject(SiteSettingsService);
  currentYear = new Date().getFullYear();

  contactInfo = computed(() => {
    const s = this.siteSettings.settings();
    if (!s) return CONTACT_INFO;
    return {
      email: s.contact_email ?? CONTACT_INFO.email,
      location: {
        en: s.address_en ?? CONTACT_INFO.location.en,
        ar: s.address_ar ?? CONTACT_INFO.location.ar,
      },
      crNumber: s.cr_number ?? CONTACT_INFO.crNumber,
      linkedin: s.linkedin_url ?? CONTACT_INFO.linkedin,
      twitter: s.twitter_url ?? CONTACT_INFO.twitter,
    };
  });

  ngOnInit(): void {
    this.siteSettings.load();
  }
}
