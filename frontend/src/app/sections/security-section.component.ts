import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

const PILLARS = [
  { titleEn: 'Identity & access', titleAr: 'الهوية والوصول', icon: 'pi-user' },
  { titleEn: 'Network segmentation', titleAr: 'تقسيم الشبكة', icon: 'pi-sitemap' },
  { titleEn: 'Endpoint & server hardening', titleAr: 'تعزيز الخوادم والنقاط الطرفية', icon: 'pi-shield' },
  { titleEn: 'Logging & monitoring', titleAr: 'التسجيل والمراقبة', icon: 'pi-chart-line' },
  { titleEn: 'Backup & DR resilience', titleAr: 'النسخ الاحتياطي ومرونة التعافي', icon: 'pi-database' },
  { titleEn: 'Secure configuration & patch mgmt', titleAr: 'التكوين الآمن وإدارة التحديثات', icon: 'pi-wrench' },
];

@Component({
  selector: 'app-security-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-white" id="security">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('Security architecture', 'هندسة الأمن') }}
        </h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('Zero-trust alignment, RBAC, and secure SDLC practices.', 'محاذاة عدم الثقة و RBAC وممارسات SDLC آمنة.') }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (p of pillars; track p.titleEn) {
            <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition">
              <span [class]="'pi ' + p.icon + ' text-primary text-2xl block mb-3'" aria-hidden="true"></span>
              <h3 class="font-semibold text-gray-900">{{ i18n.t(p.titleEn, p.titleAr) }}</h3>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class SecuritySectionComponent {
  i18n = inject(I18nService);
  pillars = PILLARS;
}
