import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeSwitcherComponent } from '../../../components/theme-switcher.component';
import { AdminApiService } from '../../../core/services/admin-api.service';

@Component({
  selector: 'admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeSwitcherComponent],
  template: `
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-2">Platform Settings</h2>
      <p class="text-th-text-3 text-sm">Configure the appearance and behavior of your Dogan Consult platform.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="lg:col-span-2">
        <app-theme-switcher></app-theme-switcher>
      </div>

      <div class="bg-th-card border border-th-border rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-4">Platform Configuration</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-th-text-3 mb-1">Default Language</label>
            <select [(ngModel)]="language" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-th-text-3 mb-1">Time Zone</label>
            <select [(ngModel)]="timezone" class="w-full bg-th-bg-tert border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="AST">Arabia Standard Time (UTC+3)</option>
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time (UTC-5)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-th-card border border-th-border rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-4">Notification Settings</h3>
        <div class="space-y-3">
          <label class="flex items-center justify-between">
            <span class="text-sm text-th-text-3">Email notifications for new leads</span>
            <input type="checkbox" [(ngModel)]="notifyNewLeads" class="w-4 h-4 rounded bg-th-bg-tert border-th-border-dk text-primary focus:ring-primary focus:ring-offset-th-bg">
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm text-th-text-3">Daily pipeline summary</span>
            <input type="checkbox" [(ngModel)]="notifyPipeline" class="w-4 h-4 rounded bg-th-bg-tert border-th-border-dk text-primary focus:ring-primary focus:ring-offset-th-bg">
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm text-th-text-3">Partner activity alerts</span>
            <input type="checkbox" [(ngModel)]="notifyPartnerActivity" class="w-4 h-4 rounded bg-th-bg-tert border-th-border-dk text-primary focus:ring-primary focus:ring-offset-th-bg">
          </label>
        </div>
      </div>

      <div class="lg:col-span-2 flex justify-end">
        <button (click)="saveSettings()" [disabled]="saving()" class="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50">
          {{ saving() ? 'Saving...' : 'Save Settings' }}
        </button>
      </div>

      @if (saveSuccess()) {
        <div class="lg:col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm">Settings saved successfully.</div>
      }
      @if (saveError()) {
        <div class="lg:col-span-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{{ saveError() }}</div>
      }
    </div>
  `,
})
export class AdminSettingsComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  language = 'en';
  timezone = 'AST';
  notifyNewLeads = true;
  notifyPipeline = true;
  notifyPartnerActivity = false;

  saving = signal(false);
  saveSuccess = signal(false);
  saveError = signal<string | null>(null);

  ngOnInit() {
    this.loadSettings();
  }

  private loadSettings() {
    this.adminApi.getSettings().subscribe({
      next: (res) => {
        const s = res.settings || {};
        if (s['platform_language']) this.language = s['platform_language'];
        if (s['platform_timezone']) this.timezone = s['platform_timezone'];
        if (s['platform_notify_new_leads'] !== undefined) this.notifyNewLeads = s['platform_notify_new_leads'];
        if (s['platform_notify_pipeline'] !== undefined) this.notifyPipeline = s['platform_notify_pipeline'];
        if (s['platform_notify_partner_activity'] !== undefined) this.notifyPartnerActivity = s['platform_notify_partner_activity'];
      },
    });
  }

  saveSettings() {
    this.saving.set(true);
    this.saveSuccess.set(false);
    this.saveError.set(null);

    this.adminApi.saveSettings({
      language: this.language,
      timezone: this.timezone,
      notify_new_leads: this.notifyNewLeads,
      notify_pipeline: this.notifyPipeline,
      notify_partner_activity: this.notifyPartnerActivity,
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.saveError.set(err.error?.error || 'Failed to save settings');
        setTimeout(() => this.saveError.set(null), 5000);
      },
    });
  }
}
