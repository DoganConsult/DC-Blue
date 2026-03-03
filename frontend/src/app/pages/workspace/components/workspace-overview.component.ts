import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientApiService } from '../../../core/services/client-api.service';
import { ClientDashboard } from '../../../core/models/client.models';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-workspace-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-3">
          <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
          <span class="text-th-text-3 text-sm">{{ i18n.t('Loading dashboard...', 'جاري تحميل لوحة التحكم...') }}</span>
        </div>
      </div>
    } @else if (error()) {
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <svg class="w-10 h-10 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p class="text-red-700 text-sm font-medium mb-2">{{ error() }}</p>
        <button (click)="reload()" class="text-red-600 hover:text-red-800 text-xs font-medium underline">{{ i18n.t('Try again', 'حاول مرة أخرى') }}</button>
      </div>
    } @else {
      <!-- Welcome Banner (when all data is zero) -->
      @if (isEmptyDashboard()) {
        <div class="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
          <div class="flex flex-col sm:flex-row items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-th-text mb-1">{{ i18n.t('Welcome to your Workspace', 'مرحباً بك في مساحة العمل') }}</h2>
              <p class="text-th-text-3 text-sm mb-4">{{ i18n.t('Your dashboard will populate as you submit inquiries and engage with our team. Get started by submitting your first inquiry.', 'ستمتلئ لوحة التحكم تلقائياً عند تقديم الاستفسارات والتعامل مع فريقنا. ابدأ بتقديم أول استفسار.') }}</p>
              <div class="flex flex-wrap gap-3">
                <a routerLink="/inquiry" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  {{ i18n.t('Submit Inquiry', 'تقديم استفسار') }}
                </a>
                <a routerLink="/track" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-th-border text-th-text text-sm font-medium hover:bg-th-bg-alt transition">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                  {{ i18n.t('Track Ticket', 'تتبع التذكرة') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @for (card of kpiCards(); track card.key) {
          <div class="bg-th-card border border-th-border rounded-xl p-4 hover:border-primary/30 hover:shadow-th-sm transition group">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center" [class]="card.iconBg">
                <span [innerHTML]="card.icon"></span>
              </div>
              <span class="text-th-text-3 text-xs font-medium">{{ i18n.t(card.en, card.ar) }}</span>
            </div>
            <div class="text-2xl font-bold text-th-text">{{ card.value }}</div>
            @if (card.subEn) {
              <div class="text-th-text-3 text-xs mt-1">{{ i18n.t(card.subEn!, card.subAr!) }}</div>
            }
          </div>
        }
      </div>

      <!-- Quick Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Pipeline Summary -->
        <div class="bg-th-card border border-th-border rounded-xl p-5">
          <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
            {{ i18n.t('Pipeline', 'سير العمليات') }}
          </h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">{{ i18n.t('Active Opportunities', 'الفرص النشطة') }}</span>
              <span class="font-semibold">{{ stats()?.opportunities?.active || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">{{ i18n.t('Total Value', 'القيمة الإجمالية') }}</span>
              <span class="font-semibold">{{ formatCurrency(stats()?.opportunities?.total_value || 0) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">{{ i18n.t('Active Tenders', 'المناقصات النشطة') }}</span>
              <span class="font-semibold">{{ stats()?.tenders_active || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Projects Summary -->
        <div class="bg-th-card border border-th-border rounded-xl p-5">
          <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg>
            {{ i18n.t('Projects & Deliverables', 'المشاريع والمخرجات') }}
          </h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">{{ i18n.t('Active Projects', 'المشاريع النشطة') }}</span>
              <span class="font-semibold">{{ stats()?.projects?.active || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">{{ i18n.t('Upcoming Demos', 'العروض القادمة') }}</span>
              <span class="font-semibold">{{ stats()?.demos_upcoming || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">{{ i18n.t('Total Inquiries', 'إجمالي الاستفسارات') }}</span>
              <span class="font-semibold">{{ stats()?.inquiries || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Contracts & Renewals -->
        <div class="bg-th-card border border-th-border rounded-xl p-5">
          <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
            {{ i18n.t('Contracts & Renewals', 'العقود والتجديدات') }}
          </h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">{{ i18n.t('Active Contracts', 'العقود النشطة') }}</span>
              <span class="font-semibold">{{ stats()?.contracts?.active || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">{{ i18n.t('Expiring Soon', 'تنتهي قريباً') }}</span>
              <span class="font-semibold" [class.text-amber-600]="(stats()?.contracts?.expiring_soon || 0) > 0">{{ stats()?.contracts?.expiring_soon || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-th-text-3">{{ i18n.t('Unread Messages', 'رسائل غير مقروءة') }}</span>
              <span class="font-semibold" [class.text-primary]="(stats()?.unread_messages || 0) > 0">{{ stats()?.unread_messages || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lifecycle Flow -->
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <h3 class="text-sm font-semibold mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>
          {{ i18n.t('Business Lifecycle', 'دورة العمل') }}
        </h3>
        <div class="flex flex-wrap gap-1.5">
          @for (stage of pipelineStages; track stage.key) {
            <div class="flex items-center gap-1.5">
              <span class="px-3 py-1.5 rounded-lg text-xs font-medium border" [class]="stage.class">
                {{ i18n.t(stage.en, stage.ar) }}
              </span>
              @if (!$last) {
                <svg class="w-4 h-4 text-th-text-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class WorkspaceOverviewComponent implements OnInit {
  private api = inject(ClientApiService);
  i18n = inject(I18nService);

  loading = signal(true);
  error = signal<string | null>(null);
  stats = signal<ClientDashboard | null>(null);

  pipelineStages = [
    { key: 'lead', en: 'Lead', ar: 'عميل محتمل', class: 'bg-slate-100 text-slate-700 border-slate-200' },
    { key: 'qualified', en: 'Qualified', ar: 'مؤهل', class: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'demo', en: 'Demo', ar: 'عرض', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { key: 'poc', en: 'POC', ar: 'إثبات مفهوم', class: 'bg-violet-50 text-violet-700 border-violet-200' },
    { key: 'tender', en: 'Tender', ar: 'مناقصة', class: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'proposal', en: 'Proposal', ar: 'عرض سعر', class: 'bg-pink-50 text-pink-700 border-pink-200' },
    { key: 'negotiation', en: 'Negotiation', ar: 'تفاوض', class: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'won', en: 'Won', ar: 'فوز', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'implementation', en: 'Implementation', ar: 'تنفيذ', class: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { key: 'maintenance', en: 'Maintenance', ar: 'صيانة', class: 'bg-teal-50 text-teal-700 border-teal-200' },
  ];

  kpiCards = signal<{ key: string; en: string; ar: string; value: string | number; subEn?: string; subAr?: string; icon: string; iconBg: string }[]>([]);

  ngOnInit() {
    this.loadDashboard();
  }

  reload() {
    this.loading.set(true);
    this.error.set(null);
    this.loadDashboard();
  }

  private loadDashboard() {
    this.api.getDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.kpiCards.set([
          { key: 'inquiries', en: 'Inquiries', ar: 'الاستفسارات', value: data.inquiries,
            icon: '<svg class="w-4.5 h-4.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>',
            iconBg: 'bg-sky-50' },
          { key: 'pipeline', en: 'Active Pipeline', ar: 'العمليات النشطة', value: data.opportunities.active,
            subEn: this.formatCurrency(data.opportunities.total_value) + ' total',
            subAr: this.formatCurrency(data.opportunities.total_value) + ' إجمالي',
            icon: '<svg class="w-4.5 h-4.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>',
            iconBg: 'bg-emerald-50' },
          { key: 'projects', en: 'Projects', ar: 'المشاريع', value: data.projects.active,
            subEn: `${data.projects.total} total`, subAr: `${data.projects.total} إجمالي`,
            icon: '<svg class="w-4.5 h-4.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg>',
            iconBg: 'bg-violet-50' },
          { key: 'contracts', en: 'Contracts', ar: 'العقود', value: data.contracts.active,
            subEn: data.contracts.expiring_soon > 0 ? `${data.contracts.expiring_soon} expiring soon` : 'All good',
            subAr: data.contracts.expiring_soon > 0 ? `${data.contracts.expiring_soon} تنتهي قريباً` : 'كل شيء جيد',
            icon: '<svg class="w-4.5 h-4.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>',
            iconBg: 'bg-amber-50' },
          { key: 'tenders', en: 'Tenders', ar: 'المناقصات', value: data.tenders_active,
            icon: '<svg class="w-4.5 h-4.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" /></svg>',
            iconBg: 'bg-purple-50' },
          { key: 'demos', en: 'Demos & POC', ar: 'العروض والتجارب', value: data.demos_upcoming,
            subEn: 'upcoming', subAr: 'قادمة',
            icon: '<svg class="w-4.5 h-4.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>',
            iconBg: 'bg-indigo-50' },
          { key: 'messages', en: 'Messages', ar: 'الرسائل', value: data.unread_messages,
            subEn: 'unread', subAr: 'غير مقروءة',
            icon: '<svg class="w-4.5 h-4.5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>',
            iconBg: 'bg-pink-50' },
          { key: 'notifications', en: 'Notifications', ar: 'الإشعارات', value: data.unread_notifications,
            subEn: 'unread', subAr: 'غير مقروءة',
            icon: '<svg class="w-4.5 h-4.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>',
            iconBg: 'bg-orange-50' },
        ]);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.i18n.t('Failed to load dashboard. Please try again.', 'فشل في تحميل لوحة التحكم. يرجى المحاولة مرة أخرى.'));
        this.loading.set(false);
      },
    });
  }

  isEmptyDashboard(): boolean {
    const s = this.stats();
    if (!s) return true;
    return s.inquiries === 0 && s.opportunities.active === 0 && s.projects.active === 0 &&
           s.contracts.active === 0 && s.tenders_active === 0 && s.demos_upcoming === 0;
  }

  formatCurrency(val: number): string {
    if (!val) return 'SAR 0';
    if (val >= 1000000) return `SAR ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `SAR ${(val / 1000).toFixed(0)}K`;
    return `SAR ${val.toFixed(0)}`;
  }
}
