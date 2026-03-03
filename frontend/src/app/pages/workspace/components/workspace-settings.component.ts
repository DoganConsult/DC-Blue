import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientApiService } from '../../../core/services/client-api.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-workspace-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="text-lg font-bold mb-6">{{ i18n.t('Settings', 'الإعدادات') }}</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Profile -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <h3 class="text-sm font-semibold mb-4">{{ i18n.t('Profile', 'الملف الشخصي') }}</h3>
        @if (!editingProfile()) {
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-th-text-3">{{ i18n.t('Name', 'الاسم') }}</span>
              <span class="font-medium">{{ user()?.full_name || user()?.name || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-th-text-3">{{ i18n.t('Email', 'البريد الإلكتروني') }}</span>
              <span class="font-medium">{{ user()?.email || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-th-text-3">{{ i18n.t('Company', 'الشركة') }}</span>
              <span class="font-medium">{{ user()?.company || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-th-text-3">{{ i18n.t('Role', 'الدور') }}</span>
              <span class="px-2 py-0.5 rounded text-xs font-medium"
                    [class]="user()?.role === 'partner' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'">
                {{ user()?.role }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-th-text-3">{{ i18n.t('Category', 'الفئة') }}</span>
              <span class="font-medium">{{ user()?.category || '-' }}</span>
            </div>
            <button (click)="startEditing()" class="mt-3 text-primary text-sm hover:underline">{{ i18n.t('Edit Profile', 'تعديل الملف') }}</button>
          </div>
        } @else {
          <div class="space-y-3">
            <div>
              <label class="block text-xs text-th-text-3 mb-1">{{ i18n.t('Name', 'الاسم') }}</label>
              <input [(ngModel)]="editName" class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label class="block text-xs text-th-text-3 mb-1">{{ i18n.t('Email', 'البريد الإلكتروني') }}</label>
              <input [(ngModel)]="editEmail" type="email" class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            @if (profileError()) {
              <div class="text-red-600 text-xs">{{ profileError() }}</div>
            }
            @if (profileSuccess()) {
              <div class="text-emerald-600 text-xs">{{ i18n.t('Profile updated successfully.', 'تم تحديث الملف الشخصي بنجاح.') }}</div>
            }
            <div class="flex gap-2 mt-3">
              <button (click)="saveProfile()" [disabled]="profileSaving()" class="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 disabled:opacity-50">
                {{ profileSaving() ? i18n.t('Saving...', 'جاري الحفظ...') : i18n.t('Save', 'حفظ') }}
              </button>
              <button (click)="cancelEditing()" class="px-4 py-1.5 rounded-lg bg-th-bg-alt text-th-text-3 text-sm font-medium hover:bg-th-bg-tert">{{ i18n.t('Cancel', 'إلغاء') }}</button>
            </div>
          </div>
        }
      </div>

      <!-- Security -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <h3 class="text-sm font-semibold mb-4">{{ i18n.t('Security', 'الأمان') }}</h3>
        <div class="space-y-4">
          <!-- MFA Toggle -->
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm font-medium">{{ i18n.t('Two-Factor Authentication', 'المصادقة الثنائية') }}</span>
              <p class="text-th-text-3 text-xs">{{ i18n.t('Receive email code on login', 'استلام رمز عبر البريد عند تسجيل الدخول') }}</p>
            </div>
            <button (click)="toggleMfa()" [disabled]="mfaToggling()"
                    class="relative w-11 h-6 rounded-full transition-colors"
                    [class]="mfaEnabled() ? 'bg-emerald-500' : 'bg-gray-300'">
              <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    [class.translate-x-5]="mfaEnabled()"></span>
            </button>
          </div>
          <div class="text-xs" [class]="mfaEnabled() ? 'text-emerald-600' : 'text-th-text-3'">
            {{ mfaEnabled()
              ? i18n.t('MFA is enabled \u2014 you will receive a code on each login', 'المصادقة الثنائية مفع\u0651لة \u2014 ستستلم رمز\u064Bا عند كل تسجيل دخول')
              : i18n.t('MFA is off \u2014 you can enable it for extra security', 'المصادقة الثنائية معط\u0651لة \u2014 يمكنك تفعيلها لحماية إضافية') }}
          </div>

          <hr class="border-th-border" />

          <!-- Change Password Link -->
          <a href="/change-password" class="text-primary text-sm hover:underline block">{{ i18n.t('Change Password', 'تغيير كلمة المرور') }}</a>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <h3 class="text-sm font-semibold mb-4">{{ i18n.t('Quick Links', 'روابط سريعة') }}</h3>
        <div class="space-y-2">
          <a href="/inquiry" class="flex items-center gap-2 text-sm text-primary hover:underline">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            {{ i18n.t('Submit New Inquiry', 'إرسال استفسار جديد') }}
          </a>
          <a href="/track" class="flex items-center gap-2 text-sm text-primary hover:underline">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            {{ i18n.t('Track Inquiry by Ticket', 'تتبع الاستفسار بالتذكرة') }}
          </a>
          <a href="/" class="flex items-center gap-2 text-sm text-primary hover:underline">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            {{ i18n.t('Back to Homepage', 'العودة للرئيسية') }}
          </a>
        </div>
      </div>
    </div>
  `,
})
export class WorkspaceSettingsComponent implements OnInit {
  private clientApi = inject(ClientApiService);
  i18n = inject(I18nService);

  user = signal<any>(null);
  mfaEnabled = signal(false);
  mfaToggling = signal(false);

  // Profile editing
  editingProfile = signal(false);
  profileSaving = signal(false);
  profileError = signal<string | null>(null);
  profileSuccess = signal(false);
  editName = '';
  editEmail = '';

  ngOnInit() {
    try {
      const userStr = localStorage.getItem('dc_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        this.user.set(u);
        this.mfaEnabled.set(u.mfa_enabled || false);
      }
    } catch {}
  }

  startEditing() {
    const u = this.user();
    this.editName = u?.full_name || u?.name || '';
    this.editEmail = u?.email || '';
    this.profileError.set(null);
    this.profileSuccess.set(false);
    this.editingProfile.set(true);
  }

  cancelEditing() {
    this.editingProfile.set(false);
    this.profileError.set(null);
    this.profileSuccess.set(false);
  }

  saveProfile() {
    const body: any = {};
    if (this.editName.trim()) body.full_name = this.editName.trim();
    if (this.editEmail.trim()) body.email = this.editEmail.trim();
    if (!body.full_name && !body.email) {
      this.profileError.set(this.i18n.t('Please provide a name or email to update.', 'يرجى تقديم اسم أو بريد إلكتروني للتحديث.'));
      return;
    }

    this.profileSaving.set(true);
    this.profileError.set(null);
    this.profileSuccess.set(false);

    this.clientApi.updateProfile(body).subscribe({
      next: () => {
        this.profileSaving.set(false);
        this.profileSuccess.set(true);
        try {
          const userStr = localStorage.getItem('dc_user');
          if (userStr) {
            const user = JSON.parse(userStr);
            if (body.full_name) user.full_name = body.full_name;
            if (body.email) user.email = body.email;
            localStorage.setItem('dc_user', JSON.stringify(user));
            this.user.set(user);
          }
        } catch {}
        setTimeout(() => {
          this.editingProfile.set(false);
          this.profileSuccess.set(false);
        }, 1500);
      },
      error: (err) => {
        this.profileSaving.set(false);
        this.profileError.set(err.error?.error || this.i18n.t('Failed to update profile', 'فشل في تحديث الملف الشخصي'));
      },
    });
  }

  toggleMfa() {
    const newState = !this.mfaEnabled();
    this.mfaToggling.set(true);

    this.clientApi.toggleMfa(newState).subscribe({
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
}
