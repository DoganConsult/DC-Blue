import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../../core/services/admin-api.service';
import { DashboardStats } from '../../core/models/admin.models';
import { AdminLeadsTableComponent } from './components/admin-leads-table.component';
import { AdminPartnersTableComponent } from './components/admin-partners-table.component';
import { AdminTeamManagementComponent } from './components/admin-team-management.component';
import { AdminAiAssistantComponent } from './components/admin-ai-assistant.component';
import { AdminSettingsComponent } from './components/admin-settings.component';
import { AdminStructureComponent } from './components/admin-structure.component';
import { AdminCommissionApprovalComponent } from './components/admin-commission-approval.component';
import { AdminGatePipelineComponent } from './components/admin-gate-pipeline.component';
import { AdminOpportunityPipelineComponent } from './components/admin-opportunity-pipeline.component';
import { AdminEngagementManagerComponent } from './components/admin-engagement-manager.component';
import { AdminNotificationsComponent } from './components/admin-notifications.component';
import { AdminAnalyticsComponent } from './components/admin-analytics.component';
import { AdminAuditLogComponent } from './components/admin-audit-log.component';
import { AdminFileBrowserComponent } from './components/admin-file-browser.component';
import { AdminEmailClientComponent } from './components/admin-email-client.component';
import { AdminERPIntegrationComponent } from './components/admin-erp-integration.component';
import { WidgetRegistryService } from '../../core/services/widget-registry.service';

type AdminTab = 'leads' | 'partners' | 'pipeline' | 'engagements' | 'commissions' | 'gates' | 'team' | 'analytics' | 'audit' | 'files' | 'mail' | 'erp' | 'settings' | 'structure' | 'ai';

@Component({
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    AdminLeadsTableComponent,
    AdminPartnersTableComponent,
    AdminTeamManagementComponent,
    AdminAiAssistantComponent,
    AdminSettingsComponent,
    AdminStructureComponent,
    AdminCommissionApprovalComponent,
    AdminGatePipelineComponent,
    AdminOpportunityPipelineComponent,
    AdminEngagementManagerComponent,
    AdminNotificationsComponent,
    AdminAnalyticsComponent,
    AdminAuditLogComponent,
    AdminFileBrowserComponent,
    AdminEmailClientComponent,
    AdminERPIntegrationComponent,
  ],
  selector: 'app-admin-dashboard',
  template: `
    <div class="min-h-screen bg-th-bg text-th-text">
      <nav class="bg-th-card border-b border-th-border px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a class="font-bold text-lg cursor-pointer" (click)="router.navigate(['/'])">
            Dogan<span class="text-gold">Consult</span>
          </a>
          <span class="text-th-text-3 text-sm">Internal Portal</span>
        </div>
        @if (api.isAuthenticated()) {
          <div class="flex items-center gap-3">
            <span class="text-th-text-3 text-sm hidden md:inline">{{ api.user()?.name || api.user()?.email || 'Admin' }}</span>
            <admin-notifications-bell />
            <button (click)="logout()" class="text-th-text-3 hover:text-th-text text-sm transition">Logout</button>
          </div>
        }
      </nav>

      @if (!api.isAuthenticated()) {
        <div class="flex items-center justify-center min-h-[80vh]">
          <div class="w-full max-w-sm bg-th-card border border-th-border rounded-2xl p-8">
            @if (mfaStep()) {
              <h2 class="text-xl font-bold text-center mb-2">Verification Code</h2>
              <p class="text-th-text-3 text-xs text-center mb-4">A 6-digit code was sent to <strong class="text-th-text">{{ mfaEmail() }}</strong></p>
              @if (authError()) {
                <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm text-center">{{ authError() }}</div>
              }
              <input [(ngModel)]="mfaCodeInput" type="text" placeholder="123456" maxlength="6" autocomplete="one-time-code"
                     (keyup.enter)="verifyMfa()"
                     class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-4 py-3 mb-4 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-gold/50" />
              <button (click)="verifyMfa()" [disabled]="loadingAuth() || mfaCodeInput.length < 6"
                      class="w-full py-3 rounded-xl font-semibold bg-gold text-white hover:bg-gold/80 transition disabled:opacity-50 mb-3">
                {{ loadingAuth() ? 'Verifying...' : 'Verify Code' }}
              </button>
              <div class="flex items-center justify-between text-xs">
                <button (click)="resendMfa()" [disabled]="resendingMfa()" class="text-primary hover:underline disabled:opacity-40">
                  {{ resendingMfa() ? 'Sending...' : 'Resend code' }}
                </button>
                <button (click)="backToLogin()" class="text-th-text-3 hover:text-th-text">Back to login</button>
              </div>
            } @else {
              <h2 class="text-xl font-bold text-center mb-6">Internal Portal Login</h2>
              @if (authError()) {
                <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm text-center">{{ authError() }}</div>
              }
              <input [(ngModel)]="emailInput" type="email" placeholder="Email"
                     class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-primary" />
              <input [(ngModel)]="passwordInput" type="password" placeholder="Password"
                     (keyup.enter)="login()"
                     class="w-full bg-th-bg-tert text-th-text placeholder-th-text-3 border border-th-border-dk rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary" />
              <button (click)="login()" [disabled]="loadingAuth() || !emailInput.trim()"
                      class="w-full py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary/80 transition disabled:opacity-50">
                {{ loadingAuth() ? 'Signing in...' : 'Sign In' }}
              </button>
              <div class="text-center mt-4">
                <a href="/forgot-password" class="text-primary text-xs hover:underline">Forgot password?</a>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="max-w-7xl mx-auto px-4 py-8">
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-5">
              <p class="text-3xl font-bold">{{ stats()?.total || 0 }}</p>
              <p class="text-th-text-3 text-sm mt-1">Total Leads</p>
            </div>
            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-5">
              <p class="text-3xl font-bold text-sky-400">{{ stats()?.last_7_days || 0 }}</p>
              <p class="text-th-text-3 text-sm mt-1">Last 7 Days</p>
            </div>
            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-5">
              <p class="text-3xl font-bold text-emerald-400">{{ getStatusCount('won') }}</p>
              <p class="text-th-text-3 text-sm mt-1">Won</p>
            </div>
            <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-5">
              <p class="text-3xl font-bold text-amber-400">{{ getStatusCount('new') + getStatusCount('qualified') }}</p>
              <p class="text-th-text-3 text-sm mt-1">Open Pipeline</p>
            </div>
          </div>

          <!-- Widget registry (chart types) -->
          <div class="advanced-widget-card bg-th-card border border-th-border rounded-xl p-4 mb-8">
            <h3 class="text-sm font-semibold text-th-text-3 mb-3">Chart & widget types</h3>
            <div class="flex flex-wrap gap-2">
              @for (w of chartWidgets(); track w.id) {
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-th-bg-tert text-th-text text-xs">
                  <i class="pi" [ngClass]="w.icon || 'pi-chart-line'"></i>
                  {{ w.name }}
                </span>
              }
            </div>
          </div>

          <!-- Tab Navigation -->
          <div class="flex gap-2 border-b border-th-border mb-6 overflow-x-auto">
            @for (tab of tabs; track tab.key) {
              @if (!tab.adminOnly || api.isAdmin()) {
                <button (click)="setTab(tab.key)"
                        class="px-4 py-2 text-sm font-medium rounded-t-lg transition whitespace-nowrap flex items-center gap-1.5"
                        [class.bg-th-bg-tert]="activeTab() === tab.key"
                        [class.text-th-text]="activeTab() === tab.key"
                        [class.text-th-text-3]="activeTab() !== tab.key"
                        [class.hover:text-th-text]="activeTab() !== tab.key">
                  @if (tab.icon) { <span class="text-gold">{{ tab.icon }}</span> }
                  {{ tab.label }}
                </button>
              }
            }
          </div>

          <!-- Tab Content -->
          @switch (activeTab()) {
            @case ('leads') { <admin-leads-table (sessionExpired)="handleSessionExpired()" /> }
            @case ('partners') { <admin-partners-table (sessionExpired)="handleSessionExpired()" /> }
            @case ('pipeline') { <admin-opportunity-pipeline /> }
            @case ('engagements') { <admin-engagement-manager /> }
            @case ('commissions') { <admin-commission-approval /> }
            @case ('gates') { <admin-gate-pipeline /> }
            @case ('analytics') { <admin-analytics /> }
            @case ('audit') { <admin-audit-log /> }
            @case ('files') { <admin-file-browser /> }
            @case ('mail') { <admin-email-client /> }
            @case ('erp') { <app-admin-erp-integration /> }
            @case ('team') { <admin-team-management (sessionExpired)="handleSessionExpired()" /> }
            @case ('ai') { <admin-ai-assistant /> }
            @case ('structure') { <admin-structure /> }
            @case ('settings') { <admin-settings /> }
          }
        </div>
      }
    </div>
  `,
})
export class AdminDashboardPage implements OnInit {
  api = inject(AdminApiService);
  router = inject(Router);
  widgetRegistry = inject(WidgetRegistryService);

  loadingAuth = signal(false);
  authError = signal<string | null>(null);
  emailInput = '';
  passwordInput = '';

  mfaStep = signal(false);
  mfaSession = '';
  mfaEmail = signal('');
  mfaCodeInput = '';
  resendingMfa = signal(false);

  stats = signal<DashboardStats | null>(null);
  activeTab = signal<AdminTab>('leads');

  chartWidgets = signal(this.widgetRegistry.listCharts());

  tabs: { key: AdminTab; label: string; adminOnly: boolean; icon?: string }[] = [
    { key: 'leads', label: 'Leads', adminOnly: false },
    { key: 'pipeline', label: 'Pipeline', adminOnly: true },
    { key: 'engagements', label: 'Engagements', adminOnly: true },
    { key: 'commissions', label: 'Commissions', adminOnly: true },
    { key: 'partners', label: 'Partners', adminOnly: true },
    { key: 'gates', label: 'Gates', adminOnly: true },
    { key: 'analytics', label: 'Analytics', adminOnly: true },
    { key: 'audit', label: 'Audit', adminOnly: true },
    { key: 'files', label: 'Files', adminOnly: true },
    { key: 'mail', label: 'Mail', adminOnly: true },
    { key: 'team', label: 'Team', adminOnly: true },
    { key: 'erp', label: 'ERPNext', adminOnly: true },
    { key: 'settings', label: 'Settings', adminOnly: true },
    { key: 'structure', label: 'Our structure', adminOnly: false },
    { key: 'ai', label: 'Shahin AI', adminOnly: false, icon: '✦' },
  ];

  ngOnInit() {
    if (this.api.isAuthenticated()) {
      if (!this.api.isAdmin()) this.activeTab.set('leads');
      this.loadStats();
    }
  }

  login() {
    const email = this.emailInput.trim();
    const password = this.passwordInput.trim();
    if (!email || !password) return;
    this.loadingAuth.set(true);
    this.authError.set(null);
    this.api.login(email, password).subscribe({
      next: (r: any) => {
        this.loadingAuth.set(false);
        if (r.mfa_required) {
          this.mfaStep.set(true);
          this.mfaSession = r.mfa_session;
          this.mfaEmail.set(r.user?.email || email);
          return;
        }
        this.handleLoginSuccess(r);
      },
      error: (e: any) => {
        this.loadingAuth.set(false);
        this.authError.set(e.error?.error || 'Invalid email or password');
      },
    });
  }

  verifyMfa() {
    if (this.mfaCodeInput.length < 6) return;
    this.loadingAuth.set(true);
    this.authError.set(null);
    this.api.verifyMfa(this.mfaSession, this.mfaCodeInput.trim()).subscribe({
      next: (r: any) => { this.loadingAuth.set(false); this.handleLoginSuccess(r); },
      error: (e: any) => { this.loadingAuth.set(false); this.authError.set(e.error?.error || 'Verification failed'); },
    });
  }

  resendMfa() {
    this.resendingMfa.set(true);
    this.api.resendMfa(this.mfaSession).subscribe({
      next: () => this.resendingMfa.set(false),
      error: (e: any) => { this.resendingMfa.set(false); this.authError.set(e.error?.error || 'Failed to resend code'); },
    });
  }

  backToLogin() {
    this.mfaStep.set(false);
    this.mfaCodeInput = '';
    this.mfaSession = '';
    this.authError.set(null);
  }

  private handleLoginSuccess(r: any) {
    if (r.token) {
      const user = r.user || { role: 'admin' };
      // Normalize: auth.js returns full_name, admin needs name
      if (user.full_name && !user.name) user.name = user.full_name;
      this.api.setAuth(r.token, user);
      if (user.must_change_password) {
        this.router.navigate(['/change-password']);
        return;
      }
    }
    this.mfaStep.set(false);
    this.loadStats();
  }

  logout() {
    this.api.clearAuth();
    this.emailInput = '';
    this.passwordInput = '';
  }

  handleSessionExpired() {
    this.logout();
    this.authError.set('Session expired');
  }

  loadStats() {
    this.api.getStats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => { },
    });
  }

  getStatusCount(status: string): number {
    const found = this.stats()?.by_status?.find(s => s.status === status);
    return found ? +found.cnt : 0;
  }

  setTab(tab: AdminTab) {
    this.activeTab.set(tab);
  }
}
