import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
      <header class="bg-th-card border-b border-th-border sticky top-0 z-30">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
              <a href="/" class="flex items-center gap-2 text-th-text font-bold text-lg hover:opacity-80 transition">
                <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-cyan-500 inline-flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </span>
                <span class="hidden sm:inline">Dogan Consult</span>
              </a>
              <span class="text-th-text-3 text-xs px-2 py-0.5 border border-th-border rounded-full">{{ i18n.t('Workspace', 'مساحة العمل') }}</span>
            </div>

            <div class="flex items-center gap-2 sm:gap-3">
              <a [routerLink]="['/inquiry']" class="text-th-text-3 hover:text-th-text text-xs transition hidden sm:inline">{{ i18n.t('Help / Contact', 'المساعدة / اتصل') }}</a>
              <app-workspace-notifications />
              <span class="text-th-text-3 text-sm hidden sm:inline">{{ userName() }}</span>
              <span class="text-xs px-2 py-1 rounded-full font-medium"
                    [class]="userRole() === 'partner' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'">
                {{ userRole() }}
              </span>
              <button (click)="logout()" class="text-th-text-3 hover:text-th-text text-xs transition">{{ i18n.t('Sign Out', 'تسجيل خروج') }}</button>
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
                      class="px-3 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap"
                      [class]="activeTab() === tab.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-th-text-3 hover:text-th-text hover:border-th-border'">
                {{ tab.label }}
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

  tabs: { key: WorkspaceTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'pipeline', label: 'Pipeline' },
    { key: 'inquiries', label: 'Inquiries' },
    { key: 'tenders', label: 'Tenders' },
    { key: 'demos', label: 'Demos & POC' },
    { key: 'projects', label: 'Projects' },
    { key: 'contracts', label: 'Contracts' },
    { key: 'documents', label: 'Documents' },
    { key: 'messages', label: 'Messages' },
    { key: 'settings', label: 'Settings' },
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

  logout() {
    localStorage.removeItem('dc_user_token');
    localStorage.removeItem('dc_user');
    sessionStorage.removeItem('dc_admin_token');
    sessionStorage.removeItem('dc_portal_user');
    this.router.navigate(['/login']);
  }
}
