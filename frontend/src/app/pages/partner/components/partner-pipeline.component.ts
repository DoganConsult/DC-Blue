import { Component, inject, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PipelineOpportunity, PipelineFullSummary } from '../../../core/models/partner.models';

interface StageConfig {
  key: string;
  label: { en: string; ar: string };
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon: string;
}

@Component({
  selector: 'app-partner-pipeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Summary Header -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Total Opportunities', 'إجمالي الفرص') }}</p>
        <p class="text-2xl font-bold text-th-text">{{ summary().total_opportunities }}</p>
      </div>
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Pipeline Value', 'قيمة خط الأنابيب') }}</p>
        <p class="text-2xl font-bold text-th-text">SAR {{ formatAmount(summary().total_value) }}</p>
      </div>
      <div class="bg-th-card border border-th-border rounded-xl p-5">
        <p class="text-xs font-medium text-th-text-3 uppercase tracking-wider mb-1">{{ i18n.t('Weighted Value', 'القيمة المرجحة') }}</p>
        <p class="text-2xl font-bold text-emerald-600">SAR {{ formatAmount(summary().weighted_value) }}</p>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider">{{ i18n.t('Pipeline Stages', 'مراحل خط الأنابيب') }}</h3>
      <div class="flex items-center gap-1 bg-th-bg-tert rounded-lg p-0.5">
        <button (click)="viewMode.set('kanban')"
                class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                [class.bg-th-card]="viewMode() === 'kanban'"
                [class.shadow-sm]="viewMode() === 'kanban'"
                [class.text-th-text]="viewMode() === 'kanban'"
                [class.text-th-text-3]="viewMode() !== 'kanban'">
          {{ i18n.t('Board', 'لوحة') }}
        </button>
        <button (click)="viewMode.set('list')"
                class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                [class.bg-th-card]="viewMode() === 'list'"
                [class.shadow-sm]="viewMode() === 'list'"
                [class.text-th-text]="viewMode() === 'list'"
                [class.text-th-text-3]="viewMode() !== 'list'">
          {{ i18n.t('List', 'قائمة') }}
        </button>
      </div>
    </div>

    @if (hasOpportunities()) {
      <!-- Kanban View (Desktop) / Accordion (Mobile) -->
      @if (viewMode() === 'kanban') {
        <!-- Desktop: Horizontal Kanban -->
        <div class="hidden md:grid grid-cols-5 gap-3">
          @for (stage of stages; track stage.key) {
            <div class="flex flex-col">
              <!-- Stage Header -->
              <div class="flex items-center justify-between px-3 py-2 rounded-t-xl" [class]="stage.bgClass">
                <div class="flex items-center gap-2">
                  <span class="text-sm" [innerHTML]="stage.icon"></span>
                  <span class="text-xs font-semibold" [class]="stage.textClass">{{ i18n.t(stage.label.en, stage.label.ar) }}</span>
                </div>
                <span class="text-xs font-bold px-1.5 py-0.5 rounded-full" [class]="stage.textClass + ' bg-th-card/60'">
                  {{ stageOpportunities(stage.key).length }}
                </span>
              </div>
              <!-- Cards -->
              <div class="flex flex-col gap-2 p-2 bg-th-bg-alt rounded-b-xl min-h-[120px] border border-t-0 border-th-border">
                @for (opp of stageOpportunities(stage.key); track opp.opportunity_id) {
                  <div class="bg-th-card rounded-lg border border-th-border p-3 hover:shadow-md transition-shadow cursor-default">
                    <p class="text-xs font-semibold text-th-text truncate mb-1">{{ opp.client_company || '—' }}</p>
                    <p class="text-[11px] text-th-text-3 truncate mb-2">{{ opp.title || opp.ticket_number }}</p>
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-th-text">SAR {{ formatAmount(opp.estimated_value) }}</span>
                      <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-th-bg-tert text-th-text-2">{{ opp.probability }}%</span>
                    </div>
                  </div>
                } @empty {
                  <div class="flex items-center justify-center h-20 text-xs text-th-text-3">
                    {{ i18n.t('No deals', 'لا صفقات') }}
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Mobile: Accordion -->
        <div class="md:hidden flex flex-col gap-2">
          @for (stage of stages; track stage.key) {
            <div class="border border-th-border rounded-xl overflow-hidden">
              <button (click)="toggleStage(stage.key)"
                      class="w-full flex items-center justify-between px-4 py-3" [class]="stage.bgClass">
                <div class="flex items-center gap-2">
                  <span class="text-sm" [innerHTML]="stage.icon"></span>
                  <span class="text-sm font-semibold" [class]="stage.textClass">{{ i18n.t(stage.label.en, stage.label.ar) }}</span>
                  <span class="text-xs font-bold px-2 py-0.5 rounded-full" [class]="stage.textClass + ' bg-th-card/60'">
                    {{ stageOpportunities(stage.key).length }}
                  </span>
                </div>
                <svg class="w-4 h-4 transition-transform" [class.rotate-180]="expandedStages().has(stage.key)"
                     [class]="stage.textClass" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              @if (expandedStages().has(stage.key)) {
                <div class="p-3 bg-th-bg-alt flex flex-col gap-2">
                  @for (opp of stageOpportunities(stage.key); track opp.opportunity_id) {
                    <div class="bg-th-card rounded-lg border border-th-border p-3">
                      <div class="flex items-center justify-between mb-1">
                        <p class="text-sm font-semibold text-th-text">{{ opp.client_company || '—' }}</p>
                        <span class="text-xs font-bold text-th-text">SAR {{ formatAmount(opp.estimated_value) }}</span>
                      </div>
                      <p class="text-xs text-th-text-3 mb-1">{{ opp.title || opp.ticket_number }}</p>
                      <div class="flex items-center gap-3 text-[11px] text-th-text-3">
                        <span>{{ opp.probability }}% {{ i18n.t('probability', 'احتمال') }}</span>
                        <span>{{ opp.product_line || '' }}</span>
                      </div>
                    </div>
                  } @empty {
                    <p class="text-xs text-th-text-3 text-center py-4">{{ i18n.t('No deals in this stage', 'لا صفقات في هذه المرحلة') }}</p>
                  }
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- List View -->
      @if (viewMode() === 'list') {
        <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-th-border-lt bg-th-bg-alt">
                  <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Client', 'العميل') }}</th>
                  <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Deal', 'الصفقة') }}</th>
                  <th class="text-center text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Stage', 'المرحلة') }}</th>
                  <th class="text-right text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Value', 'القيمة') }}</th>
                  <th class="text-center text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Probability', 'الاحتمال') }}</th>
                  <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Updated', 'آخر تحديث') }}</th>
                </tr>
              </thead>
              <tbody>
                @for (opp of allOpportunities(); track opp.opportunity_id) {
                  <tr class="border-b border-th-border-lt hover:bg-th-bg-alt transition-colors">
                    <td class="px-4 py-3">
                      <p class="font-medium text-th-text">{{ opp.client_company || '—' }}</p>
                      <p class="text-xs text-th-text-3">{{ opp.ticket_number }}</p>
                    </td>
                    <td class="px-4 py-3 text-th-text-2">{{ opp.title || '—' }}</td>
                    <td class="px-4 py-3 text-center">
                      <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" [class]="stageBadgeClass(opp.stage)">
                        {{ i18n.t(stageLabel(opp.stage).en, stageLabel(opp.stage).ar) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right font-semibold text-th-text">SAR {{ formatAmount(opp.estimated_value) }}</td>
                    <td class="px-4 py-3 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-12 h-1.5 bg-th-bg-tert rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all" [class]="probabilityBarClass(opp.probability)"
                               [style.width.%]="opp.probability"></div>
                        </div>
                        <span class="text-xs text-th-text-2">{{ opp.probability }}%</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-th-text-3 text-xs">{{ opp.updated_at | date:'mediumDate' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    } @else {
      <!-- Empty State -->
      <div class="bg-th-card border border-th-border rounded-xl p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-th-bg-tert flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-th-text mb-2">{{ i18n.t('No Active Pipeline', 'لا يوجد خط أنابيب نشط') }}</h3>
        <p class="text-sm text-th-text-3 max-w-md mx-auto">
          {{ i18n.t(
            'When your referred leads advance through the sales process, their opportunities will appear here organized by stage.',
            'عندما يتقدم العملاء المحالون عبر عملية المبيعات، ستظهر فرصهم هنا مرتبة حسب المرحلة.'
          ) }}
        </p>
      </div>
    }
  `,
})
export class PartnerPipelineComponent {
  i18n = inject(I18nService);

  stagesData = input<Record<string, PipelineOpportunity[]>>({});
  summary = input<PipelineFullSummary>({ total_opportunities: 0, total_value: 0, weighted_value: 0, currency: 'SAR', by_stage: {} });

  viewMode = signal<'kanban' | 'list'>('kanban');
  private _expandedStages = signal(new Set<string>(['discovery', 'proposal', 'negotiation']));
  expandedStages = this._expandedStages.asReadonly();

  readonly stages: StageConfig[] = [
    { key: 'discovery', label: { en: 'Discovery', ar: 'استكشاف' }, color: '#6366f1', bgClass: 'bg-indigo-50', textClass: 'text-indigo-700', borderClass: 'border-indigo-200', icon: '🔍' },
    { key: 'proposal', label: { en: 'Proposal', ar: 'عرض' }, color: '#0ea5e9', bgClass: 'bg-sky-50', textClass: 'text-sky-700', borderClass: 'border-sky-200', icon: '📋' },
    { key: 'negotiation', label: { en: 'Negotiation', ar: 'تفاوض' }, color: '#f59e0b', bgClass: 'bg-amber-50', textClass: 'text-amber-700', borderClass: 'border-amber-200', icon: '🤝' },
    { key: 'closed_won', label: { en: 'Won', ar: 'فوز' }, color: '#10b981', bgClass: 'bg-emerald-50', textClass: 'text-emerald-700', borderClass: 'border-emerald-200', icon: '🏆' },
    { key: 'closed_lost', label: { en: 'Lost', ar: 'خسارة' }, color: '#ef4444', bgClass: 'bg-red-50', textClass: 'text-red-700', borderClass: 'border-red-200', icon: '✕' },
  ];

  hasOpportunities = computed(() => {
    const data = this.stagesData();
    return Object.values(data).some(arr => arr.length > 0);
  });

  allOpportunities = computed(() => {
    const data = this.stagesData();
    const all: PipelineOpportunity[] = [];
    for (const stage of this.stages) {
      if (data[stage.key]) all.push(...data[stage.key]);
    }
    return all;
  });

  stageOpportunities(key: string): PipelineOpportunity[] {
    return this.stagesData()[key] || [];
  }

  toggleStage(key: string): void {
    const current = new Set(this._expandedStages());
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    this._expandedStages.set(current);
  }

  formatAmount(n: number): string {
    return (n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  stageBadgeClass(stage: string): string {
    const map: Record<string, string> = {
      discovery: 'bg-indigo-100 text-indigo-700',
      proposal: 'bg-sky-100 text-sky-700',
      negotiation: 'bg-amber-100 text-amber-700',
      closed_won: 'bg-emerald-100 text-emerald-700',
      closed_lost: 'bg-red-100 text-red-700',
    };
    return map[stage] || 'bg-th-bg-tert text-th-text-2';
  }

  stageLabel(stage: string): { en: string; ar: string } {
    const found = this.stages.find(s => s.key === stage);
    return found?.label || { en: stage, ar: stage };
  }

  probabilityBarClass(prob: number): string {
    if (prob >= 70) return 'bg-emerald-500';
    if (prob >= 40) return 'bg-amber-500';
    return 'bg-th-text-3';
  }
}
