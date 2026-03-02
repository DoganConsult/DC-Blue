import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { ActivityItem, PartnerLead } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      </div>
    } @else if (activities().length === 0) {
      <div class="bg-th-card border border-th-border rounded-xl p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-th-bg-tert flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-th-text mb-2">{{ i18n.t('No Activity Yet', 'لا يوجد نشاط بعد') }}</h3>
        <p class="text-sm text-th-text-3">{{ i18n.t('Activity on your leads will appear here as a timeline.', 'سيظهر النشاط على عملائك هنا كخط زمني.') }}</p>
      </div>
    } @else {
      <div class="space-y-1">
        @for (a of activities(); track a.id) {
          <div class="flex gap-4 group">
            <!-- Timeline line + dot -->
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 rounded-full shrink-0 mt-1.5" [class]="dotClass(a.type)"></div>
              <div class="w-px flex-1 bg-th-bg-tert group-last:hidden"></div>
            </div>
            <!-- Content -->
            <div class="pb-6 flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full" [class]="badgeClass(a.type)">
                  {{ i18n.t(typeLabel(a.type).en, typeLabel(a.type).ar) }}
                </span>
                <span class="text-[10px] text-th-text-3">{{ a.created_at | date:'medium' }}</span>
              </div>
              <p class="text-sm text-th-text-2">{{ a.body }}</p>
              <div class="flex items-center gap-2 mt-1 text-xs text-th-text-3">
                <span class="font-mono">{{ a.ticket_number }}</span>
                <span>·</span>
                <span>{{ a.company_name }}</span>
                @if (a.created_by) {
                  <span>·</span>
                  <span>{{ a.created_by }}</span>
                }
              </div>
            </div>
          </div>
        }
      </div>
      @if (total() > activities().length) {
        <div class="text-center mt-4">
          <button (click)="loadMore()" [disabled]="loading()"
                  class="px-4 py-2 text-xs font-medium text-th-text-2 bg-th-bg-tert rounded-lg hover:bg-th-bg-tert transition-colors">
            {{ i18n.t('Load More', 'تحميل المزيد') }}
          </button>
        </div>
      }
    }

    <!-- Add Comment -->
    <div class="mt-6 bg-th-card border border-th-border rounded-xl p-4">
      <h4 class="text-sm font-semibold text-th-text-2 mb-3">{{ i18n.t('Add Comment on a Lead', 'أضف تعليقاً على عميل') }}</h4>
      <select [(ngModel)]="selectedLeadId" class="w-full bg-th-bg-alt text-th-text border border-th-border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">{{ i18n.t('Select a lead...', 'اختر عميلاً...') }}</option>
        @for (lead of leads(); track lead.id) {
          <option [value]="lead.id">{{ lead.ticket_number }} — {{ lead.company_name }}</option>
        }
      </select>
      <div class="flex gap-2">
        <input [(ngModel)]="commentBody" [placeholder]="i18n.t('Your comment...', 'تعليقك...')" (keyup.enter)="submitComment()"
               class="flex-1 bg-th-bg-alt text-th-text placeholder-th-text-3 border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <button (click)="submitComment()" [disabled]="!selectedLeadId || !commentBody.trim() || submittingComment()"
                class="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50">
          {{ submittingComment() ? '...' : i18n.t('Send', 'إرسال') }}
        </button>
      </div>
      @if (commentSuccess()) {
        <p class="text-emerald-600 text-xs mt-2">{{ commentSuccess() }}</p>
      }
    </div>
  `,
})
export class PartnerActivityComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  activities = signal<ActivityItem[]>([]);
  total = signal(0);
  page = signal(1);
  loading = signal(false);

  // Comment feature
  leads = signal<PartnerLead[]>([]);
  selectedLeadId = '';
  commentBody = '';
  submittingComment = signal(false);
  commentSuccess = signal<string | null>(null);

  ngOnInit() {
    this.load();
    this.loadLeads();
  }

  private loadLeads() {
    this.api.getLeads().subscribe({
      next: res => this.leads.set(res.data || []),
    });
  }

  submitComment() {
    if (!this.selectedLeadId || !this.commentBody.trim()) return;
    this.submittingComment.set(true);
    this.commentSuccess.set(null);
    this.api.addLeadComment(this.selectedLeadId, this.commentBody.trim()).subscribe({
      next: () => {
        this.submittingComment.set(false);
        this.commentSuccess.set(this.i18n.t('Comment added successfully', 'تمت إضافة التعليق بنجاح'));
        this.commentBody = '';
        this.page.set(1);
        this.load();
        setTimeout(() => this.commentSuccess.set(null), 3000);
      },
      error: () => this.submittingComment.set(false),
    });
  }

  load() {
    this.loading.set(true);
    this.api.getActivity(this.page()).subscribe({
      next: res => {
        if (this.page() === 1) {
          this.activities.set(res.data);
        } else {
          this.activities.update(prev => [...prev, ...res.data]);
        }
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadMore() {
    this.page.update(p => p + 1);
    this.load();
  }

  dotClass(type: string): string {
    const map: Record<string, string> = {
      status_change: 'bg-blue-500', note: 'bg-th-text-3', email: 'bg-emerald-500',
      call: 'bg-amber-500', assignment: 'bg-purple-500', system: 'bg-th-border',
    };
    return map[type] || 'bg-th-text-3';
  }

  badgeClass(type: string): string {
    const map: Record<string, string> = {
      status_change: 'bg-primary/10 text-primary', note: 'bg-th-bg-tert text-th-text-2',
      email: 'bg-emerald-100 text-emerald-700', call: 'bg-amber-100 text-amber-700',
      assignment: 'bg-purple-100 text-purple-700', system: 'bg-th-bg-tert text-th-text-3',
    };
    return map[type] || 'bg-th-bg-tert text-th-text-2';
  }

  typeLabel(type: string): { en: string; ar: string } {
    const map: Record<string, { en: string; ar: string }> = {
      status_change: { en: 'Status Change', ar: 'تغيير الحالة' },
      note: { en: 'Note', ar: 'ملاحظة' },
      email: { en: 'Email', ar: 'بريد' },
      call: { en: 'Call', ar: 'مكالمة' },
      assignment: { en: 'Assignment', ar: 'تعيين' },
      system: { en: 'System', ar: 'نظام' },
    };
    return map[type] || { en: type, ar: type };
  }
}
