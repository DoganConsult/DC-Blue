import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { WorkspaceOverviewComponent } from './components/workspace-overview.component';
import { WorkspacePipelineComponent } from './components/workspace-pipeline.component';
import { WorkspaceInquiriesComponent } from './components/workspace-inquiries.component';
import { WorkspaceTendersComponent } from './components/workspace-tenders.component';
import { WorkspaceDemosComponent } from './components/workspace-demos.component';
import { WorkspaceProjectsComponent } from './components/workspace-projects.component';
import { WorkspaceContractsComponent } from './components/workspace-contracts.component';
import { WorkspaceMessagesComponent } from './components/workspace-messages.component';
import { WorkspaceSettingsComponent } from './components/workspace-settings.component';
import { WorkspaceNotificationsComponent } from './components/workspace-notifications.component';
import { WorkspaceFilesComponent } from './components/workspace-files.component';

type WorkspaceTab = 'overview' | 'pipeline' | 'inquiries' | 'tenders' | 'demos' | 'projects' | 'contracts' | 'documents' | 'messages' | 'settings';

@Component({
  selector: 'app-client-workspace',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    WorkspaceOverviewComponent, WorkspacePipelineComponent, WorkspaceInquiriesComponent,
    WorkspaceTendersComponent, WorkspaceDemosComponent, WorkspaceProjectsComponent,
    WorkspaceContractsComponent, WorkspaceMessagesComponent, WorkspaceSettingsComponent,
    WorkspaceNotificationsComponent, WorkspaceFilesComponent,
  ],
  template: `
    <div class="min-h-screen bg-th-bg text-th-text">
      <!-- Header -->
      <header class="bg-th-card border-b border-th-border sticky top-0 z-30 shadow-th-sm">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
              <a routerLink="/" class="flex items-center gap-2 text-th-text font-bold text-lg hover:opacity-80 transition">
                <span class="w-8 h-8 rounded-lg bg-gold-accent inline-flex items-center justify-center">
                  <svg class="w-4 h-4 text-[#1D2433]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </span>
                <span class="hidden sm:inline">{{ i18n.t('DOGAN', 'دوغان') }}<span class="text-gold-accent">{{ i18n.t('CONSULT', ' للاستشارات') }}</span></span>
              </a>
              <span class="text-th-text-3 text-[11px] px-2.5 py-0.5 border border-th-border rounded-full font-medium tracking-wide uppercase">{{ i18n.t('Workspace', 'مساحة العمل') }}</span>
            </div>

            <div class="flex items-center gap-2 sm:gap-3">
              <a [routerLink]="['/inquiry']" class="text-th-text-3 hover:text-th-text text-xs transition hidden sm:inline-flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                {{ i18n.t('Help', 'المساعدة') }}
              </a>
              <button (click)="toggleLang()" class="text-th-text-3 hover:text-th-text text-xs border border-th-border px-2.5 py-1 rounded-full transition font-medium">
                {{ i18n.lang() === 'en' ? 'عربي' : 'EN' }}
              </button>
              <app-workspace-notifications />
              <div class="hidden sm:flex items-center gap-2 pl-2 border-l border-th-border">
                <span class="text-th-text text-sm font-medium">{{ userName() }}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                      [class]="userRole() === 'partner' ? 'bg-purple-100 text-purple-700' : userRole() === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'">
                  {{ userRole() }}
                </span>
              </div>
              <button (click)="logout()" class="text-th-text-3 hover:text-red-500 transition" [title]="i18n.t('Sign Out', 'تسجيل خروج')">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Tab Navigation -->
      <nav class="bg-th-card border-b border-th-border overflow-x-auto">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex gap-0.5 -mb-px">
            @for (tab of tabs; track tab.key) {
              <button (click)="setTab(tab.key)"
                      class="px-3 sm:px-4 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap"
                      [class]="activeTab() === tab.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-th-text-3 hover:text-th-text hover:border-th-border'">
                {{ i18n.t(tab.en, tab.ar) }}
              </button>
            }
          </div>
        </div>
      </nav>

      <!-- Tab Content -->
      <main class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        @switch (activeTab()) {
          @case ('overview') { <app-workspace-overview /> }
          @case ('pipeline') { <app-workspace-pipeline /> }
          @case ('inquiries') { <app-workspace-inquiries /> }
          @case ('tenders') { <app-workspace-tenders /> }
          @case ('demos') { <app-workspace-demos /> }
          @case ('projects') { <app-workspace-projects /> }
          @case ('contracts') { <app-workspace-contracts /> }
          @case ('documents') { <app-workspace-files /> }
          @case ('messages') { <app-workspace-messages /> }
          @case ('settings') { <app-workspace-settings /> }
        }
      </main>
    </div>
  `,
})
export class ClientWorkspacePage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  i18n = inject(I18nService);

  activeTab = signal<WorkspaceTab>('overview');
  userName = signal('');
  userRole = signal('');

  tabs: { key: WorkspaceTab; en: string; ar: string }[] = [
    { key: 'overview', en: 'Overview', ar: 'نظرة عامة' },
    { key: 'pipeline', en: 'Pipeline', ar: 'سير العمليات' },
    { key: 'inquiries', en: 'Inquiries', ar: 'الاستفسارات' },
    { key: 'tenders', en: 'Tenders', ar: 'المناقصات' },
    { key: 'demos', en: 'Demos & POC', ar: 'العروض والتجارب' },
    { key: 'projects', en: 'Projects', ar: 'المشاريع' },
    { key: 'contracts', en: 'Contracts', ar: 'العقود' },
    { key: 'documents', en: 'Documents', ar: 'المستندات' },
    { key: 'messages', en: 'Messages', ar: 'الرسائل' },
    { key: 'settings', en: 'Settings', ar: 'الإعدادات' },
  ];

  ngOnInit() {
    try {
      const userStr = localStorage.getItem('dc_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.userName.set(user.full_name || user.name || user.email || '');
        this.userRole.set(user.role || 'customer');
      }
    } catch {}

    // Read tab from query param
    const tabParam = this.route.snapshot.queryParamMap.get('tab') as WorkspaceTab;
    if (tabParam && this.tabs.some(t => t.key === tabParam)) {
      this.activeTab.set(tabParam);
    }
  }

  setTab(tab: WorkspaceTab) {
    this.activeTab.set(tab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  toggleLang() {
    this.i18n.setLang(this.i18n.lang() === 'en' ? 'ar' : 'en');
  }

  logout() {
    localStorage.removeItem('dc_user_token');
    localStorage.removeItem('dc_user');
    sessionStorage.removeItem('dc_admin_token');
    sessionStorage.removeItem('dc_portal_user');
    this.router.navigate(['/login']);
  }
}
