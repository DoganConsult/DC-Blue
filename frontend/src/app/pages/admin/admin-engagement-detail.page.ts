import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminApiService } from '../../core/services/admin-api.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-admin-engagement-detail',
  template: `
    <div class="min-h-screen bg-th-bg text-th-text">
      <nav class="bg-th-card border-b border-th-border px-6 py-3 flex items-center gap-4">
        <a class="font-bold text-lg cursor-pointer" (click)="router.navigate(['/'])">
          Dogan<span class="text-gold">Consult</span>
        </a>
        <span class="text-th-text-2">|</span>
        <a class="text-th-text-3 hover:text-th-text text-sm cursor-pointer transition" (click)="router.navigate(['/admin'], { queryParams: { tab: 'engagements' } })">
          {{ i18n.t('← Back to Engagements', '← العودة إلى المشاركات') }}
        </a>
      </nav>

      @if (!engagement()) {
        <div class="flex items-center justify-center min-h-[60vh]">
          @if (error()) {
            <div class="text-center">
              <p class="text-error mb-4">{{ error() }}</p>
              <button (click)="router.navigate(['/admin'], { queryParams: { tab: 'engagements' } })" class="text-primary hover:underline">{{ i18n.t('Back to Engagements', 'العودة إلى المشاركات') }}</button>
            </div>
          } @else {
            <p class="text-th-text-3">{{ i18n.t('Loading...', 'جاري التحميل...') }}</p>
          }
        </div>
      } @else {
        <div class="max-w-5xl mx-auto px-4 py-8">
          <div class="flex items-start justify-between mb-8">
            <div>
              <h1 class="text-2xl font-bold">{{ engagement()!.title }}</h1>
              <p class="text-th-text-3">{{ engagement()!.company_name }} · {{ engagement()!.manager || i18n.t('Unassigned', 'غير معيّن') }}</p>
            </div>
            <span class="px-3 py-1.5 rounded-full text-sm font-semibold"
              [class]="{
                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': engagement()!.status === 'active',
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': engagement()!.status === 'completed',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': engagement()!.status === 'on_hold',
                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300': !['active','completed','on_hold'].includes(engagement()!.status)
              }">
              {{ engagement()!.status }}
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-th-card border border-th-border rounded-xl p-6">
                <h3 class="font-semibold mb-4 text-th-text-3">{{ i18n.t('Engagement Details', 'تفاصيل المشاركة') }}</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div><span class="text-th-text-3">{{ i18n.t('Title', 'العنوان') }}</span><p>{{ engagement()!.title || '—' }}</p></div>
                  <div><span class="text-th-text-3">{{ i18n.t('Type', 'النوع') }}</span><p>{{ engagement()!.engagement_type || '—' }}</p></div>
                  <div><span class="text-th-text-3">{{ i18n.t('Manager', 'المدير') }}</span><p>{{ engagement()!.manager || '—' }}</p></div>
                  <div><span class="text-th-text-3">{{ i18n.t('Status', 'الحالة') }}</span><p>{{ engagement()!.status || '—' }}</p></div>
                  <div><span class="text-th-text-3">{{ i18n.t('Start Date', 'تاريخ البدء') }}</span><p>{{ engagement()!.start_date ? (engagement()!.start_date | date:'mediumDate') : i18n.t('TBD', 'يحدد لاحقاً') }}</p></div>
                  <div><span class="text-th-text-3">{{ i18n.t('End Date', 'تاريخ الانتهاء') }}</span><p>{{ engagement()!.end_date ? (engagement()!.end_date | date:'mediumDate') : i18n.t('TBD', 'يحدد لاحقاً') }}</p></div>
                  <div><span class="text-th-text-3">{{ i18n.t('Contract Value', 'قيمة العقد') }}</span><p>{{ engagement()!.contract_value | currency:'SAR ' }}</p></div>
                  <div><span class="text-th-text-3">{{ i18n.t('Created', 'تاريخ الإنشاء') }}</span><p>{{ engagement()!.created_at | date:'mediumDate' }}</p></div>
                </div>
                @if (engagement()!.notes) {
                  <div class="mt-4 pt-4 border-t border-th-border">
                    <span class="text-th-text-3 text-sm">{{ i18n.t('Notes', 'ملاحظات') }}</span>
                    <p class="mt-1 text-th-text-3">{{ engagement()!.notes }}</p>
                  </div>
                }
              </div>

              @if (gates().length) {
                <div class="bg-th-card border border-th-border rounded-xl p-6">
                  <h3 class="font-semibold mb-4 text-th-text-3">{{ i18n.t('Gate Progress', 'تقدم البوابات') }}</h3>
                  <div class="space-y-3">
                    @for (g of gates(); track g.id) {
                      <div class="flex items-center gap-3 p-3 rounded-lg border border-th-border">
                        <span class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold"
                          [class]="g.status === 'passed' ? 'bg-success text-white' : g.status === 'in_progress' ? 'bg-primary text-white' : 'bg-th-bg-tert text-th-text-3'">
                          {{ g.gate_number }}
                        </span>
                        <div class="flex-1">
                          <p class="font-medium text-sm">{{ g.gate_name }}</p>
                          <p class="text-xs text-th-text-3">{{ g.status }}</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <div class="space-y-6">
              <div class="bg-th-card border border-th-border rounded-xl p-6">
                <h3 class="font-semibold mb-3 text-th-text-3">{{ i18n.t('Timeline', 'الجدول الزمني') }}</h3>
                <div class="text-sm space-y-2">
                  <div class="flex justify-between">
                    <span class="text-th-text-3">{{ i18n.t('Created', 'تاريخ الإنشاء') }}</span>
                    <span>{{ engagement()!.created_at | date:'short' }}</span>
                  </div>
                  @if (engagement()!.start_date) {
                    <div class="flex justify-between">
                      <span class="text-th-text-3">{{ i18n.t('Started', 'بدأ') }}</span>
                      <span>{{ engagement()!.start_date | date:'short' }}</span>
                    </div>
                  }
                  @if (engagement()!.end_date) {
                    <div class="flex justify-between">
                      <span class="text-th-text-3">{{ i18n.t('Target End', 'تاريخ الانتهاء المستهدف') }}</span>
                      <span>{{ engagement()!.end_date | date:'short' }}</span>
                    </div>
                  }
                </div>
              </div>

              @if (engagement()!.opportunity_id) {
                <div class="bg-th-card border border-th-border rounded-xl p-6">
                  <h3 class="font-semibold mb-3 text-th-text-3">{{ i18n.t('Linked Opportunity', 'الفرصة المرتبطة') }}</h3>
                  <button (click)="router.navigate(['/admin/opportunities', engagement()!.opportunity_id])"
                    class="text-primary hover:underline text-sm">{{ i18n.t('View Opportunity →', 'عرض الفرصة →') }}</button>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminEngagementDetailPage implements OnInit {
  router = inject(Router);
  i18n = inject(I18nService);
  private route = inject(ActivatedRoute);
  private api = inject(AdminApiService);

  engagement = signal<any>(null);
  gates = signal<any[]>([]);
  error = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.error.set('No engagement ID'); return; }

    this.api.getEngagement(id).subscribe({
      next: (r: any) => {
        this.engagement.set(r.engagement || r.data || r);
        if (r.gates) this.gates.set(r.gates);
      },
      error: (e) => this.error.set(e.error?.error || 'Failed to load engagement'),
    });
  }
}
