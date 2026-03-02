import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerLead } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-leads-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (leads().length > 0) {
      <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-th-border-lt bg-th-bg-alt">
                <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Ticket', 'التذكرة') }}</th>
                <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Client', 'العميل') }}</th>
                <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Product', 'المنتج') }}</th>
                <th class="text-center text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Status', 'الحالة') }}</th>
                <th class="text-center text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Stage', 'المرحلة') }}</th>
                <th class="text-left text-xs font-medium text-th-text-3 uppercase tracking-wider px-4 py-3">{{ i18n.t('Date', 'التاريخ') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (lead of leads(); track lead.id) {
                <tr class="border-b border-th-border-lt hover:bg-th-bg-alt transition-colors">
                  <td class="px-4 py-3">
                    <span class="font-mono text-xs text-th-text-2">{{ lead.ticket_number }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <p class="font-medium text-th-text">{{ lead.company_name }}</p>
                    <p class="text-xs text-th-text-3">{{ lead.contact_name }}</p>
                  </td>
                  <td class="px-4 py-3 text-th-text-2 text-xs">{{ lead.product_line || '—' }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" [class]="statusClass(lead.status)">
                      {{ i18n.t(statusLabel(lead.status).en, statusLabel(lead.status).ar) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    @if (lead.opportunity_stage) {
                      <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium" [class]="stageClass(lead.opportunity_stage)">
                        {{ i18n.t(stageLabel(lead.opportunity_stage).en, stageLabel(lead.opportunity_stage).ar) }}
                      </span>
                    } @else {
                      <span class="text-xs text-th-text-3">—</span>
                    }
                  </td>
                  <td class="px-4 py-3 text-th-text-3 text-xs">{{ lead.created_at | date:'mediumDate' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    } @else {
      <div class="bg-th-card border border-th-border rounded-xl p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-th-bg-tert flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-th-text mb-2">{{ i18n.t('No Leads Yet', 'لا توجد عملاء محتملون بعد') }}</h3>
        <p class="text-sm text-th-text-3 max-w-md mx-auto">
          {{ i18n.t(
            'Submit your first lead referral to start tracking progress through the sales pipeline.',
            'أرسل أول إحالة عميل محتمل لبدء تتبع التقدم عبر خط أنابيب المبيعات.'
          ) }}
        </p>
      </div>
    }
  `,
})
export class PartnerLeadsTableComponent {
  i18n = inject(I18nService);

  leads = input<PartnerLead[]>([]);

  statusClass(s: string): string {
    const map: Record<string, string> = {
      submitted: 'bg-primary/10 text-primary',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
      in_review: 'bg-amber-100 text-amber-700',
    };
    return map[s] || 'bg-th-bg-tert text-th-text-2';
  }

  statusLabel(s: string): { en: string; ar: string } {
    const map: Record<string, { en: string; ar: string }> = {
      submitted: { en: 'Submitted', ar: 'مُرسل' },
      approved: { en: 'Approved', ar: 'معتمد' },
      rejected: { en: 'Rejected', ar: 'مرفوض' },
      in_review: { en: 'In Review', ar: 'قيد المراجعة' },
    };
    return map[s] || { en: s, ar: s };
  }

  stageClass(stage: string): string {
    const map: Record<string, string> = {
      discovery: 'bg-indigo-50 text-indigo-600',
      proposal: 'bg-sky-50 text-sky-600',
      negotiation: 'bg-amber-50 text-amber-600',
      closed_won: 'bg-emerald-50 text-emerald-600',
      closed_lost: 'bg-red-50 text-red-600',
    };
    return map[stage] || 'bg-th-bg-alt text-th-text-3';
  }

  stageLabel(stage: string): { en: string; ar: string } {
    const map: Record<string, { en: string; ar: string }> = {
      discovery: { en: 'Discovery', ar: 'استكشاف' },
      proposal: { en: 'Proposal', ar: 'عرض' },
      negotiation: { en: 'Negotiation', ar: 'تفاوض' },
      closed_won: { en: 'Won', ar: 'فوز' },
      closed_lost: { en: 'Lost', ar: 'خسارة' },
    };
    return map[stage] || { en: stage, ar: stage };
  }
}
