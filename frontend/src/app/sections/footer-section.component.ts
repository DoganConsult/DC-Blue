import { Component, inject, computed, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { TranslatePipe } from '../core/pipes/translate.pipe';
import { SiteSettingsService } from '../core/services/site-settings.service';
import { CONTACT_INFO } from '../core/data/site-content';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  template: `
    <footer class="bg-th-bg-inv" [class]="ds.sectionRhythm.padding">
      <div [class]="ds.section.container">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div class="md:col-span-1">
            <span class="font-bold text-th-text-inv text-[17px] tracking-tight">{{ i18n.t('Dogan', 'دوغان') }}<span class="text-primary">{{ i18n.t('Consult', 'كونسلت') }}</span></span>
            <p class="mt-3 text-th-text-inv/60 text-sm leading-relaxed max-w-sm">
              {{ i18n.t('Design, build, and operate enterprise ICT environments across KSA and the GCC.', 'نصمم ونبني ونشغّل بيئات تقنية المعلومات المؤسسية في المملكة والخليج.') }}
            </p>
          </div>
          <div>
            <h4 class="text-th-text-inv text-[13px] font-semibold tracking-wider uppercase mb-4">{{ i18n.t('Site', 'الموقع') }}</h4>
            <ul class="space-y-2.5 text-sm text-th-text-inv/60">
              <li><a routerLink="/services" class="hover:text-th-text-inv transition-colors">{{ i18n.t('Services', 'الخدمات') }}</a></li>
              <li><a routerLink="/about" class="hover:text-th-text-inv transition-colors">{{ i18n.t('About Us', 'من نحن') }}</a></li>
              <li><a routerLink="/case-studies" class="hover:text-th-text-inv transition-colors">{{ i18n.t('Case Studies', 'دراسات حالة') }}</a></li>
              <li><a routerLink="/insights" class="hover:text-th-text-inv transition-colors">{{ i18n.t('Insights', 'رؤى') }}</a></li>
              <li><a routerLink="/inquiry" class="hover:text-th-text-inv transition-colors">{{ 'nav.request_proposal' | translate }}</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-th-text-inv text-[13px] font-semibold tracking-wider uppercase mb-4">{{ i18n.t('Portals', 'البوابات') }}</h4>
            <ul class="space-y-2.5 text-sm text-th-text-inv/60">
              <li><a routerLink="/login" class="hover:text-th-text-inv transition-colors">{{ 'nav.sign_in' | translate }}</a></li>
              <li><a routerLink="/register" class="hover:text-th-text-inv transition-colors">{{ i18n.t('Register', 'التسجيل') }}</a></li>
              <li><a routerLink="/track" class="hover:text-th-text-inv transition-colors">{{ i18n.t('Track Inquiry', 'تتبع الاستفسار') }}</a></li>
              <li><a routerLink="/partner" class="hover:text-th-text-inv transition-colors">{{ 'nav.partner_portal' | translate }}</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-th-text-inv text-[13px] font-semibold tracking-wider uppercase mb-4">{{ i18n.t('Legal', 'القانونية') }}</h4>
            <ul class="space-y-2.5 text-sm text-th-text-inv/60">
              <li><a routerLink="/privacy" class="hover:text-th-text-inv transition-colors">{{ i18n.t('Privacy Policy', 'سياسة الخصوصية') }}</a></li>
              <li><a routerLink="/terms" class="hover:text-th-text-inv transition-colors">{{ i18n.t('Terms of Service', 'شروط الخدمة') }}</a></li>
              <li><a routerLink="/pdpl" class="hover:text-th-text-inv transition-colors">{{ i18n.t('PDPL Compliance', 'الامتثال لنظام حماية البيانات') }}</a></li>
              <li><a routerLink="/cookies" class="hover:text-th-text-inv transition-colors">{{ i18n.t('Cookie Policy', 'سياسة ملفات تعريف الارتباط') }}</a></li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-th-text-inv/10">
          <p class="text-th-text-inv/50 text-xs">
            {{ i18n.t('© Dogan Consult. All rights reserved.', '© دوغان للاستشارات. جميع الحقوق محفوظة.') }}
          </p>
          <div class="flex items-center gap-5">
            <div class="flex items-center gap-3">
              <a [href]="contactInfo().linkedin" target="_blank" rel="noopener" [attr.aria-label]="i18n.t('LinkedIn', 'لينكد إن')" class="w-8 h-8 rounded-lg bg-th-text-inv/5 hover:bg-th-text-inv/10 flex items-center justify-center text-th-text-inv/50 hover:text-th-text-inv transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a [href]="contactInfo().twitter" target="_blank" rel="noopener" [attr.aria-label]="i18n.t('X / Twitter', 'إكس / تويتر')" class="w-8 h-8 rounded-lg bg-th-text-inv/5 hover:bg-th-text-inv/10 flex items-center justify-center text-th-text-inv/50 hover:text-th-text-inv transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
            <div class="flex items-center gap-4 text-xs text-th-text-inv/50">
              <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
                {{ i18n.t('Made in KSA', 'صُنع في المملكة العربية السعودية') }}
              </span>
              <span>{{ i18n.t('CR', 'س.ت') }} #{{ contactInfo().crNumber }}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterSectionComponent implements OnInit {
  i18n = inject(I18nService);
  ds = inject(DesignSystemService);
  private siteSettings = inject(SiteSettingsService);

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
