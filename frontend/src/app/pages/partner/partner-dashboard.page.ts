import { Component, inject, signal, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { PartnerApiService } from '../../core/services/partner-api.service';
import { PartnerSseService } from '../../core/services/partner-sse.service';
import { PartnerCommissionsComponent } from './components/partner-commissions.component';
import { PartnerPipelineComponent } from './components/partner-pipeline.component';
import { PartnerLeadsTableComponent } from './components/partner-leads-table.component';
import { PartnerNotificationsComponent } from './components/partner-notifications.component';
import { PartnerActivityComponent } from './components/partner-activity.component';
import { PartnerSlaComponent } from './components/partner-sla.component';
import { PartnerAnalyticsComponent } from './components/partner-analytics.component';
import { PartnerProfileComponent } from './components/partner-profile.component';
import { PartnerTierComponent } from './components/partner-tier.component';
import { PartnerInsightsComponent } from './components/partner-insights.component';
import { PartnerResourcesComponent } from './components/partner-resources.component';
import { PartnerFeedbackComponent } from './components/partner-feedback.component';
import { PartnerForecastComponent } from './components/partner-forecast.component';
import { PartnerMessagingComponent } from './components/partner-messaging.component';
import { PartnerAchievementsComponent } from './components/partner-achievements.component';
import { PartnerOnboardingComponent } from './components/partner-onboarding.component';
import { PartnerTrainingComponent } from './components/partner-training.component';
import {
  DashboardResponse,
  PartnerLead,
  Commission,
  CommissionSummary,
  PipelineOpportunity,
  PipelineFullSummary,
} from '../../core/models/partner.models';

type TabKey = 'overview' | 'commissions' | 'pipeline' | 'activity' | 'messages' | 'analytics' | 'resources' | 'training' | 'settings';

@Component({
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    PartnerCommissionsComponent, PartnerPipelineComponent, PartnerLeadsTableComponent,
    PartnerNotificationsComponent, PartnerActivityComponent, PartnerSlaComponent,
    PartnerAnalyticsComponent, PartnerProfileComponent, PartnerTierComponent,
    PartnerInsightsComponent, PartnerResourcesComponent, PartnerFeedbackComponent,
    PartnerForecastComponent, PartnerMessagingComponent, PartnerAchievementsComponent,
    PartnerOnboardingComponent, PartnerTrainingComponent,
  ],
  selector: 'app-partner-dashboard',
  template: `
    <div class="min-h-screen bg-th-bg-alt">
      <!-- Top Bar -->
      <nav class="bg-th-card border-b border-th-border sticky top-0 z-40">
        <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <a class="font-bold text-lg tracking-tight cursor-pointer text-th-text" (click)="router.navigate(['/'])">
            Dogan<span class="text-primary">Consult</span>
          </a>
          <div class="flex items-center gap-2">
            @if (partnerApi.isAuthenticated()) {
              <app-partner-notifications />
              <span class="text-sm text-th-text-3 hidden sm:block">{{ partnerApi.partner()?.company_name }}</span>
              <span class="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full" [class]="tierBadgeClass()">
                {{ partnerApi.partner()?.tier || 'partner' }}
              </span>
            }
            <button (click)="i18n.setLang(i18n.lang() === 'en' ? 'ar' : 'en')"
                    class="text-th-text-3 hover:text-th-text text-xs border border-th-border px-2.5 py-1 rounded-full transition">
              {{ i18n.t('عربي', 'EN') }}
            </button>
            @if (partnerApi.isAuthenticated()) {
              <button (click)="logout()"
                      class="text-th-text-3 hover:text-red-500 transition" title="Logout">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              </button>
            }
          </div>
        </div>
      </nav>

      <!-- Toast Notification -->
      @if (toastMessage()) {
        <div class="fixed top-4 right-4 z-50 bg-primary text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-3 animate-slide-in">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          {{ toastMessage() }}
          <button (click)="toastMessage.set(null)" class="ml-2 opacity-70 hover:opacity-100">✕</button>
        </div>
      }

      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <!-- Auth Gate -->
        @if (!partnerApi.isAuthenticated()) {
          <div class="max-w-md mx-auto mt-16">
            <div class="bg-th-card border border-th-border rounded-2xl p-8 shadow-sm">
              <div class="text-center mb-6">
                <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-th-text mb-1">{{ i18n.t('Partner Portal', 'بوابة الشركاء') }}</h2>
                <p class="text-th-text-3 text-sm">{{ i18n.t('Enter your API key to access your dashboard.', 'أدخل مفتاح API للوصول إلى لوحة التحكم.') }}</p>
              </div>
              @if (authError()) {
                <div class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm text-center">{{ authError() }}</div>
              }
              <input [(ngModel)]="apiKeyInput" type="password" [placeholder]="i18n.t('API Key', 'مفتاح API')"
                     (keyup.enter)="login()"
                     class="w-full bg-th-bg-alt text-th-text placeholder-th-text-3 border border-th-border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              <button (click)="login()" [disabled]="loadingAuth()"
                      class="w-full py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50">
                @if (loadingAuth()) {
                  <svg class="animate-spin h-4 w-4 inline mr-2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                }
                {{ i18n.t('Access Dashboard', 'الدخول') }}
              </button>
              <p class="text-center mt-4">
                <a class="text-primary text-sm cursor-pointer hover:underline" (click)="router.navigate(['/partner/register'])">
                  {{ i18n.t('Don\\'t have a key? Register here', 'ليس لديك مفتاح؟ سجل هنا') }}
                </a>
              </p>
            </div>
          </div>
        } @else {
          <!-- Onboarding Wizard -->
          @if (showOnboarding()) {
            <app-partner-onboarding (dismiss)="dismissOnboarding()" />
          }

          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 class="text-2xl font-bold text-th-text">{{ i18n.t('Partner Dashboard', 'لوحة تحكم الشريك') }}</h1>
              <p class="text-sm text-th-text-3 mt-0.5">
                {{ i18n.t('Welcome back,', 'مرحباً،') }} {{ partnerApi.partner()?.contact_name || partnerApi.partner()?.company_name }}
              </p>
            </div>
            <button (click)="router.navigate(['/partner/submit'])"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition text-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {{ i18n.t('Submit Lead', 'إرسال عميل محتمل') }}
            </button>
          </div>

          <!-- Tabs -->
          <div class="border-b border-th-border mb-8 overflow-x-auto">
            <nav class="flex gap-4 sm:gap-6 -mb-px min-w-max">
              @for (tab of tabs; track tab.key) {
                <button (click)="switchTab(tab.key)"
                        class="pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                        [class.border-primary]="activeTab() === tab.key"
                        [class.text-th-text]="activeTab() === tab.key"
                        [class.border-transparent]="activeTab() !== tab.key"
                        [class.text-th-text-3]="activeTab() !== tab.key"
                        [class.hover:text-th-text-2]="activeTab() !== tab.key">
                  {{ i18n.t(tab.label.en, tab.label.ar) }}
                </button>
              }
            </nav>
          </div>

          <!-- Tab Content -->
          @switch (activeTab()) {
            @case ('overview') {
              <!-- Overview Stats -->
              <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div class="bg-th-card border border-th-border rounded-xl p-4">
                  <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Total Leads', 'إجمالي العملاء') }}</p>
                  <p class="text-2xl font-bold text-th-text">{{ dashboardData()?.leads?.total || 0 }}</p>
                </div>
                <div class="bg-th-card border border-th-border rounded-xl p-4">
                  <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('In Pipeline', 'في الأنابيب') }}</p>
                  <p class="text-2xl font-bold text-primary">{{ dashboardData()?.leads?.in_pipeline || 0 }}</p>
                </div>
                <div class="bg-th-card border border-th-border rounded-xl p-4">
                  <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Closed Won', 'تم الفوز') }}</p>
                  <p class="text-2xl font-bold text-emerald-500">{{ dashboardData()?.leads?.closed_won || 0 }}</p>
                </div>
                <div class="bg-th-card border border-th-border rounded-xl p-4">
                  <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Commission', 'العمولة') }}</p>
                  <p class="text-2xl font-bold text-th-text">SAR {{ formatAmount(dashboardData()?.commissions?.total_earned || 0) }}</p>
                </div>
                <div class="bg-th-card border border-th-border rounded-xl p-4">
                  <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Pipeline Value', 'قيمة الأنابيب') }}</p>
                  <p class="text-2xl font-bold text-th-text">SAR {{ formatAmount(dashboardData()?.pipeline?.total_value || 0) }}</p>
                </div>
              </div>

              <!-- AI Insights Banner -->
              <app-partner-insights />

              <!-- Leads Table -->
              <div class="mt-8 mb-4 flex items-center justify-between">
                <h2 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider">{{ i18n.t('Your Leads', 'عملاؤك') }}</h2>
                <span class="text-xs text-th-text-3">{{ leads().length }} {{ i18n.t('leads', 'عملاء') }}</span>
              </div>
              <app-partner-leads-table [leads]="leads()" />
            }

            @case ('commissions') {
              @if (commissionsLoading()) {
                <div class="flex items-center justify-center py-20">
                  <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                </div>
              } @else {
                <app-partner-commissions
                  [commissions]="commissions()"
                  [summary]="commissionSummary()"
                  [total]="commissionsTotal()"
                  [page]="commissionsPage()"
                  (prevPage)="loadCommissions(commissionsPage() - 1)"
                  (nextPage)="loadCommissions(commissionsPage() + 1)" />
              }
            }

            @case ('pipeline') {
              @if (pipelineLoading()) {
                <div class="flex items-center justify-center py-20">
                  <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                </div>
              } @else {
                <app-partner-pipeline
                  [stagesData]="pipelineStages()"
                  [summary]="pipelineSummary()" />
              }
            }

            @case ('activity') {
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                  <h2 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Activity Timeline', 'سجل النشاط') }}</h2>
                  <app-partner-activity />
                </div>
                <div>
                  <h2 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('SLA Compliance', 'التزام SLA') }}</h2>
                  <app-partner-sla />
                </div>
              </div>
            }

            @case ('messages') {
              <div class="max-w-3xl mx-auto">
                <app-partner-messaging [fullHeight]="true" />
              </div>
            }

            @case ('analytics') {
              <!-- Tier + Forecast + Analytics -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div class="lg:col-span-2">
                  <app-partner-tier />
                </div>
                <div>
                  <app-partner-achievements />
                </div>
              </div>
              <app-partner-forecast />
              <div class="mt-8">
                <h2 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Performance Analytics', 'تحليلات الأداء') }}</h2>
                <app-partner-analytics />
              </div>
            }

            @case ('resources') {
              <h2 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-4">{{ i18n.t('Resource Library', 'مكتبة الموارد') }}</h2>
              <app-partner-resources />
            }

            @case ('training') {
              <app-partner-training />
            }

            @case ('settings') {
              <app-partner-profile />
              <div class="mt-8">
                <app-partner-feedback />
              </div>
            }
          }
        }
      </div>
    </div>
  `,
})
export class PartnerDashboardPage implements OnInit, OnDestroy {
  i18n = inject(I18nService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  partnerApi = inject(PartnerApiService);
  private sse = inject(PartnerSseService);

  // Auth
  loadingAuth = signal(false);
  authError = signal<string | null>(null);
  apiKeyInput = '';
  showOnboarding = signal(false);

  // SSE toast
  toastMessage = signal<string | null>(null);
  private toastTimer: any = null;

  private sseNotificationEffect = effect(() => {
    const notif = this.sse.newNotification();
    if (notif) {
      this.showToast(notif.title || notif.body);
    }
  });

  private sseMessageEffect = effect(() => {
    const msg = this.sse.newMessage();
    if (msg) {
      this.showToast(`New message from ${msg.sender || 'Account Manager'}`);
    }
  });

  private showToast(text: string) {
    this.toastMessage.set(text);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage.set(null), 5000);
  }

  // Tabs
  activeTab = signal<TabKey>('overview');
  readonly tabs: { key: TabKey; label: { en: string; ar: string } }[] = [
    { key: 'overview', label: { en: 'Overview', ar: 'نظرة عامة' } },
    { key: 'commissions', label: { en: 'Commissions', ar: 'العمولات' } },
    { key: 'pipeline', label: { en: 'Pipeline', ar: 'الأنابيب' } },
    { key: 'activity', label: { en: 'Activity', ar: 'النشاط' } },
    { key: 'messages', label: { en: 'Messages', ar: 'الرسائل' } },
    { key: 'analytics', label: { en: 'Analytics', ar: 'التحليلات' } },
    { key: 'resources', label: { en: 'Resources', ar: 'الموارد' } },
    { key: 'training', label: { en: 'Training', ar: 'التدريب' } },
    { key: 'settings', label: { en: 'Settings', ar: 'الإعدادات' } },
  ];

  // Data
  dashboardData = signal<DashboardResponse | null>(null);
  leads = signal<PartnerLead[]>([]);

  // Commissions tab
  commissions = signal<Commission[]>([]);
  commissionSummary = signal<CommissionSummary>({ total_earned: 0, pending: 0, approved: 0, paid: 0, currency: 'SAR' });
  commissionsTotal = signal(0);
  commissionsPage = signal(1);
  commissionsLoading = signal(false);
  private commissionsLoaded = false;

  // Pipeline tab
  pipelineStages = signal<Record<string, PipelineOpportunity[]>>({});
  pipelineSummary = signal<PipelineFullSummary>({ total_opportunities: 0, total_value: 0, weighted_value: 0, currency: 'SAR', by_stage: {} });
  pipelineLoading = signal(false);
  private pipelineLoaded = false;

  ngOnInit() {
    // Handle ?tab=messages (from notification links)
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && this.tabs.some(t => t.key === tab)) {
        this.switchTab(tab as TabKey);
      }
    });

    if (this.partnerApi.isAuthenticated()) {
      this.loadDashboard();
      this.sse.connect();
    }
  }

  ngOnDestroy() {
    this.sse.disconnect();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  login() {
    if (!this.apiKeyInput.trim()) return;
    this.loadingAuth.set(true);
    this.authError.set(null);
    this.partnerApi.validateKey(this.apiKeyInput.trim()).subscribe({
      next: (res) => {
        this.loadingAuth.set(false);
        this.partnerApi.setApiKey(this.apiKeyInput.trim());
        this.partnerApi.setPartner(res.partner);
        this.dashboardData.set(res);
        this.loadLeads();
        this.checkOnboarding();
        this.sse.connect();
      },
      error: (err) => {
        this.loadingAuth.set(false);
        this.authError.set(err.error?.error || this.i18n.t('Invalid API key.', 'مفتاح API غير صالح.'));
      },
    });
  }

  logout() {
    this.sse.disconnect();
    this.partnerApi.clearApiKey();
    this.dashboardData.set(null);
    this.leads.set([]);
    this.commissions.set([]);
    this.commissionsLoaded = false;
    this.pipelineLoaded = false;
    this.activeTab.set('overview');
  }

  switchTab(tab: TabKey) {
    this.activeTab.set(tab);
    if (tab === 'commissions' && !this.commissionsLoaded) {
      this.loadCommissions(1);
    }
    if (tab === 'pipeline' && !this.pipelineLoaded) {
      this.loadPipeline();
    }
  }

  dismissOnboarding() {
    this.showOnboarding.set(false);
  }

  private checkOnboarding() {
    this.partnerApi.getProfile().subscribe({
      next: (profile) => {
        if (!profile.onboarding_completed) {
          this.showOnboarding.set(true);
        }
      },
    });
  }

  private loadDashboard() {
    this.partnerApi.getDashboard().subscribe({
      next: (res) => {
        this.dashboardData.set(res);
        this.partnerApi.setPartner(res.partner);
        this.loadLeads();
        this.checkOnboarding();
      },
      error: () => {
        this.partnerApi.clearApiKey();
      },
    });
  }

  private loadLeads() {
    this.partnerApi.getLeads().subscribe({
      next: (res) => this.leads.set(res.data || []),
    });
  }

  loadCommissions(page: number) {
    this.commissionsLoading.set(true);
    this.commissionsPage.set(page);
    this.partnerApi.getCommissions(undefined, page).subscribe({
      next: (res) => {
        this.commissions.set(res.data);
        this.commissionSummary.set(res.summary);
        this.commissionsTotal.set(res.total);
        this.commissionsLoading.set(false);
        this.commissionsLoaded = true;
      },
      error: () => this.commissionsLoading.set(false),
    });
  }

  private loadPipeline() {
    this.pipelineLoading.set(true);
    this.partnerApi.getPipeline().subscribe({
      next: (res) => {
        this.pipelineStages.set(res.stages);
        this.pipelineSummary.set(res.summary);
        this.pipelineLoading.set(false);
        this.pipelineLoaded = true;
      },
      error: () => this.pipelineLoading.set(false),
    });
  }

  formatAmount(n: number): string {
    return (n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  tierBadgeClass(): string {
    const tier = this.partnerApi.partner()?.tier;
    const map: Record<string, string> = {
      registered: 'bg-th-bg-tert text-th-text-2',
      silver: 'bg-th-bg-tert text-th-text-2',
      gold: 'bg-amber-500/10 text-amber-500',
      platinum: 'bg-primary/10 text-primary',
    };
    return map[tier || ''] || 'bg-primary/10 text-primary';
  }
}
