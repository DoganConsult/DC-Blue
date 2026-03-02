import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { PartnerProfile, EmailPreferences } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      </div>
    } @else {
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Form -->
        <div class="lg:col-span-2 bg-th-card border border-th-border rounded-xl p-6">
          <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-6">{{ i18n.t('Profile Information', 'معلومات الملف الشخصي') }}</h3>
          @if (saved()) {
            <div class="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-3 mb-4 text-sm">
              {{ i18n.t('Profile updated successfully!', 'تم تحديث الملف الشخصي بنجاح!') }}
            </div>
          }
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('Contact Name', 'الاسم') }}</label>
                <input [(ngModel)]="form.contact_name"
                       class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('Phone', 'الهاتف') }}</label>
                <input [(ngModel)]="form.contact_phone" type="tel"
                       class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('Website', 'الموقع') }}</label>
              <input [(ngModel)]="form.company_website" type="url"
                     class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('City', 'المدينة') }}</label>
                <input [(ngModel)]="form.city"
                       class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('Country', 'الدولة') }}</label>
                <select [(ngModel)]="form.country"
                        class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="SA">{{ i18n.t('Saudi Arabia', 'السعودية') }}</option>
                  <option value="AE">{{ i18n.t('UAE', 'الإمارات') }}</option>
                  <option value="EG">{{ i18n.t('Egypt', 'مصر') }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('Address', 'العنوان') }}</label>
              <input [(ngModel)]="form.address_line"
                     class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('Bio / Description', 'نبذة') }}</label>
              <textarea [(ngModel)]="form.bio" rows="3"
                        class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
            </div>
            <button (click)="saveProfile()" [disabled]="saving()"
                    class="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50">
              {{ i18n.t('Save Changes', 'حفظ التغييرات') }}
            </button>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="space-y-6">
          <!-- Account Info (read-only) -->
          <div class="bg-th-card border border-th-border rounded-xl p-6">
            <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Account', 'الحساب') }}</h3>
            <div class="space-y-3">
              <div>
                <p class="text-[10px] text-th-text-3 uppercase">{{ i18n.t('Company', 'الشركة') }}</p>
                <p class="text-sm font-medium text-th-text">{{ profile()?.company_name }}</p>
              </div>
              <div>
                <p class="text-[10px] text-th-text-3 uppercase">{{ i18n.t('Email', 'البريد') }}</p>
                <p class="text-sm text-th-text-2">{{ profile()?.contact_email }}</p>
              </div>
              <div>
                <p class="text-[10px] text-th-text-3 uppercase">{{ i18n.t('Tier', 'المستوى') }}</p>
                <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" [class]="tierClass(profile()?.tier)">
                  {{ profile()?.tier }}
                </span>
              </div>
              <div>
                <p class="text-[10px] text-th-text-3 uppercase">{{ i18n.t('Commission Rate', 'نسبة العمولة') }}</p>
                <p class="text-sm font-bold text-th-text">{{ profile()?.commission_rate }}%</p>
              </div>
              <div>
                <p class="text-[10px] text-th-text-3 uppercase">{{ i18n.t('Member Since', 'عضو منذ') }}</p>
                <p class="text-sm text-th-text-2">{{ profile()?.created_at | date:'mediumDate' }}</p>
              </div>
              <div class="pt-3 border-t border-th-border-lt flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-th-text-3 uppercase">{{ i18n.t('Two-Factor Auth', 'المصادقة الثنائية') }}</p>
                  <p class="text-[10px] text-th-text-3">{{ mfaEnabled() ? i18n.t('Enabled', 'مفعّل') : i18n.t('Disabled', 'معطّل') }}</p>
                </div>
                <button (click)="toggleMfa()" [disabled]="mfaToggling()"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                        [class.bg-primary]="mfaEnabled()" [class.bg-gray-300]="!mfaEnabled()">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        [class.translate-x-6]="mfaEnabled()" [class.translate-x-1]="!mfaEnabled()"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Email Preferences -->
          <div class="bg-th-card border border-th-border rounded-xl p-6">
            <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Email Preferences', 'تفضيلات البريد') }}</h3>
            @if (prefsSaved()) {
              <div class="bg-emerald-50 text-emerald-700 rounded-lg p-2 mb-3 text-xs">{{ i18n.t('Saved!', 'تم الحفظ!') }}</div>
            }
            <div class="space-y-3">
              @for (pref of prefsList; track pref.key) {
                <label class="flex items-center justify-between cursor-pointer">
                  <span class="text-sm text-th-text-2">{{ i18n.t(pref.en, pref.ar) }}</span>
                  <input type="checkbox" [(ngModel)]="emailPrefs[pref.key]" (change)="savePrefs()"
                         class="w-4 h-4 rounded border-th-border text-primary focus:ring-primary" />
                </label>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class PartnerProfileComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);
  private http = inject(HttpClient);

  loading = signal(false);
  saving = signal(false);
  saved = signal(false);
  prefsSaved = signal(false);
  mfaEnabled = signal(false);
  mfaToggling = signal(false);
  profile = signal<PartnerProfile | null>(null);

  form: any = {};
  emailPrefs: any = {};

  readonly prefsList = [
    { key: 'weekly_digest', en: 'Weekly Digest', ar: 'ملخص أسبوعي' },
    { key: 'monthly_report', en: 'Monthly Report', ar: 'تقرير شهري' },
    { key: 'commission_alerts', en: 'Commission Alerts', ar: 'تنبيهات العمولات' },
    { key: 'pipeline_updates', en: 'Pipeline Updates', ar: 'تحديثات الأنابيب' },
    { key: 'sla_warnings', en: 'SLA Warnings', ar: 'تحذيرات SLA' },
    { key: 'marketing_emails', en: 'Marketing Emails', ar: 'رسائل تسويقية' },
  ];

  ngOnInit() {
    // Load MFA state from stored user
    try {
      const userStr = localStorage.getItem('dc_user');
      if (userStr) { this.mfaEnabled.set(!!JSON.parse(userStr).mfa_enabled); }
    } catch {}

    this.loading.set(true);
    this.api.getProfile().subscribe({
      next: p => {
        this.profile.set(p);
        this.form = {
          contact_name: p.contact_name || '',
          contact_phone: p.contact_phone || '',
          company_website: p.company_website || '',
          bio: p.bio || '',
          city: p.city || '',
          country: p.country || 'SA',
          address_line: p.address_line || '',
        };
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.api.getEmailPreferences().subscribe({
      next: prefs => {
        this.emailPrefs = { ...prefs };
      },
    });
  }

  saveProfile() {
    this.saving.set(true);
    this.saved.set(false);
    this.api.updateProfile(this.form).subscribe({
      next: () => { this.saving.set(false); this.saved.set(true); setTimeout(() => this.saved.set(false), 3000); },
      error: () => this.saving.set(false),
    });
  }

  savePrefs() {
    this.prefsSaved.set(false);
    this.api.updateEmailPreferences(this.emailPrefs).subscribe({
      next: () => { this.prefsSaved.set(true); setTimeout(() => this.prefsSaved.set(false), 2000); },
    });
  }

  toggleMfa() {
    const newState = !this.mfaEnabled();
    this.mfaToggling.set(true);
    const token = localStorage.getItem('dc_user_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.post<{ ok: boolean; mfa_enabled: boolean }>('/api/v1/public/auth/toggle-mfa', { enable: newState }, { headers }).subscribe({
      next: (r) => {
        this.mfaEnabled.set(r.mfa_enabled);
        this.mfaToggling.set(false);
        try {
          const userStr = localStorage.getItem('dc_user');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.mfa_enabled = r.mfa_enabled;
            localStorage.setItem('dc_user', JSON.stringify(user));
          }
        } catch {}
      },
      error: () => this.mfaToggling.set(false),
    });
  }

  tierClass(tier?: string): string {
    const map: Record<string, string> = {
      registered: 'bg-th-bg-tert text-th-text-2',
      silver: 'bg-th-bg-tert text-th-text-2',
      gold: 'bg-amber-100 text-amber-700',
      platinum: 'bg-indigo-100 text-indigo-700',
    };
    return map[tier || ''] || 'bg-th-bg-tert text-th-text-2';
  }
}
