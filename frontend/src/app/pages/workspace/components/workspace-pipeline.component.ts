import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApiService } from '../../../core/services/client-api.service';
import { ClientOpportunity } from '../../../core/models/client.models';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-workspace-pipeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    } @else {
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold">{{ i18n.t('Pipeline', 'سير العمليات') }}</h2>
        <button (click)="exportCsv()" class="text-xs text-primary hover:underline">{{ i18n.t('Export CSV', 'تصدير CSV') }}</button>
      </div>

      @if (opportunities().length === 0) {
        <div class="bg-th-card border border-th-border rounded-xl p-10 text-center">
          <p class="text-th-text-3 text-sm">{{ i18n.t('No opportunities visible yet. Once your inquiry progresses, opportunities will appear here.', 'لا توجد فرص مرئية حتى الآن. عندما يتقدم استفسارك، ستظهر الفرص هنا.') }}</p>
        </div>
      } @else {
        <!-- Pipeline Stages Overview -->
        <div class="flex flex-wrap gap-2 mb-6">
          @for (stage of stageOrder; track stage) {
            <span class="px-3 py-1.5 rounded-lg text-xs font-medium border"
                  [class]="getStageClass(stage)">
              {{ formatStage(stage) }} ({{ countByStage(stage) }})
            </span>
          }
        </div>

        <!-- Opportunities Table -->
        <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-th-border bg-th-bg-tert">
                <th class="text-left px-4 py-3 text-th-text-3 text-xs font-medium">{{ i18n.t('Title', 'العنوان') }}</th>
                <th class="text-left px-4 py-3 text-th-text-3 text-xs font-medium">{{ i18n.t('Stage', 'المرحلة') }}</th>
                <th class="text-left px-4 py-3 text-th-text-3 text-xs font-medium hidden md:table-cell">{{ i18n.t('Value', 'القيمة') }}</th>
                <th class="text-left px-4 py-3 text-th-text-3 text-xs font-medium hidden md:table-cell">{{ i18n.t('Probability', 'الاحتمالية') }}</th>
                <th class="text-left px-4 py-3 text-th-text-3 text-xs font-medium hidden lg:table-cell">{{ i18n.t('Next Action', 'الإجراء التالي') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (opp of opportunities(); track opp.id) {
                <tr class="border-b border-th-border last:border-0 hover:bg-th-bg-tert/50 transition cursor-pointer" (click)="selectOpp(opp)">
                  <td class="px-4 py-3">
                    <div class="font-medium text-th-text">{{ opp.title }}</div>
                    <div class="text-th-text-3 text-xs">{{ opp.ticket_number }} &middot; {{ opp.client_company }}</div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded text-xs font-medium" [class]="getStageClass(opp.stage)">{{ formatStage(opp.stage) }}</span>
                  </td>
                  <td class="px-4 py-3 hidden md:table-cell">{{ opp.currency || 'SAR' }} {{ opp.estimated_value | number }}</td>
                  <td class="px-4 py-3 hidden md:table-cell">{{ opp.probability }}%</td>
                  <td class="px-4 py-3 hidden lg:table-cell text-th-text-3">{{ opp.next_action_at ? (opp.next_action_at | date:'mediumDate') : '-' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Detail Panel -->
        @if (selectedOpp()) {
          <div class="mt-6 bg-th-card border border-th-border rounded-xl p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">{{ selectedOpp()!.title }}</h3>
              <button (click)="selectedOpp.set(null)" class="text-th-text-3 hover:text-th-text text-xs">{{ i18n.t('Close', 'إغلاق') }}</button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span class="text-th-text-3 text-xs block">{{ i18n.t('Stage', 'المرحلة') }}</span><span class="font-medium">{{ formatStage(selectedOpp()!.stage) }}</span></div>
              <div><span class="text-th-text-3 text-xs block">{{ i18n.t('Value', 'القيمة') }}</span><span class="font-medium">{{ selectedOpp()!.currency }} {{ selectedOpp()!.estimated_value | number }}</span></div>
              <div><span class="text-th-text-3 text-xs block">{{ i18n.t('Product', 'المنتج') }}</span><span class="font-medium">{{ selectedOpp()!.product_line || '-' }}</span></div>
              <div><span class="text-th-text-3 text-xs block">{{ i18n.t('Created', 'تاريخ الإنشاء') }}</span><span class="font-medium">{{ selectedOpp()!.created_at | date:'mediumDate' }}</span></div>
            </div>

            @if (detailGates().length) {
              <h4 class="text-xs font-semibold text-th-text-3 mt-4 mb-2">{{ i18n.t('Gate Checklist', 'قائمة التحقق') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                @for (g of detailGates(); track g.id) {
                  <div class="flex items-center gap-2 text-sm">
                    @if (g.checked) {
                      <span class="text-emerald-500">&#10003;</span>
                    } @else {
                      <span class="text-th-text-3">&#9675;</span>
                    }
                    <span [class.text-th-text-3]="!g.checked">{{ g.label }}</span>
                  </div>
                }
              </div>
            }
          </div>
        }
      }
    }
  `,
})
export class WorkspacePipelineComponent implements OnInit {
  private api = inject(ClientApiService);
  i18n = inject(I18nService);

  loading = signal(true);
  opportunities = signal<ClientOpportunity[]>([]);
  selectedOpp = signal<ClientOpportunity | null>(null);
  detailGates = signal<any[]>([]);

  stageOrder = ['discovery', 'qualified', 'demo', 'poc', 'tender', 'proposal', 'negotiation', 'closed_won', 'implementation', 'maintenance'];

  ngOnInit() {
    this.api.getPipeline().subscribe({
      next: (r) => { this.opportunities.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  countByStage(stage: string): number {
    return this.opportunities().filter(o => o.stage === stage).length;
  }

  formatStage(s: string): string {
    return s?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '-';
  }

  getStageClass(stage: string): string {
    const map: Record<string, string> = {
      discovery: 'bg-slate-100 text-slate-700 border-slate-200',
      qualified: 'bg-blue-50 text-blue-700 border-blue-200',
      demo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      poc: 'bg-violet-50 text-violet-700 border-violet-200',
      tender: 'bg-purple-50 text-purple-700 border-purple-200',
      proposal: 'bg-pink-50 text-pink-700 border-pink-200',
      negotiation: 'bg-amber-50 text-amber-700 border-amber-200',
      closed_won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      closed_lost: 'bg-red-50 text-red-700 border-red-200',
      implementation: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      maintenance: 'bg-teal-50 text-teal-700 border-teal-200',
    };
    return map[stage] || 'bg-gray-50 text-gray-700 border-gray-200';
  }

  selectOpp(opp: ClientOpportunity) {
    this.selectedOpp.set(opp);
    this.api.getPipelineDetail(opp.id).subscribe({
      next: (r) => this.detailGates.set(r.gates || []),
      error: () => {},
    });
  }

  exportCsv() {
    this.api.exportPipeline().subscribe(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    });
  }
}
