import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminApiService } from '../../core/services/admin-api.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-admin-opportunity-detail',
  template: `
    <div class="min-h-screen bg-th-bg text-th-text">
      <nav class="bg-th-card border-b border-th-border px-6 py-3 flex items-center gap-4">
        <a class="font-bold text-lg cursor-pointer" (click)="router.navigate(['/'])">
          Dogan<span class="text-gold">Consult</span>
        </a>
        <span class="text-th-text-2">|</span>
        <a class="text-th-text-3 hover:text-th-text text-sm cursor-pointer transition" (click)="router.navigate(['/admin'], { queryParams: { tab: 'pipeline' } })">
          {{ i18n.t('← Back to Pipeline', '← العودة إلى خط الأنابيب') }}
        </a>
      </nav>

      @if (!opp()) {
        <div class="flex items-center justify-center min-h-[60vh]">
          @if (error()) {
            <div class="text-center">
              <p class="text-error mb-4">{{ error() }}</p>
              <button (click)="router.navigate(['/admin'], { queryParams: { tab: 'pipeline' } })" class="text-primary hover:underline">{{ i18n.t('Back to Pipeline', 'العودة إلى خط الأنابيب') }}</button>
            </div>
          } @else {
            <p class="text-th-text-3">{{ i18n.t('Loading...', 'جاري التحميل...') }}</p>
          }
        </div>
      } @else {
        <div class="max-w-5xl mx-auto px-4 py-8">
          <div class="flex items-start justify-between mb-8">
            <div>
              <h1 class="text-2xl font-bold">{{ opp()!.title }}</h1>
              <p class="text-th-text-3">{{ opp()!.company_name }} · {{ opp()!.owner || i18n.t('Unassigned', 'غير معيّن') }}</p>
            </div>
            <span class="px-3 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary">
              {{ opp()!.stage }}
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-th-card border border-th-border rounded-xl p-6">
              <h3 class="font-semibold mb-4 text-th-text-3">{{ i18n.t('Opportunity Details', 'تفاصيل الفرصة') }}</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div><span class="text-th-text-3">{{ i18n.t('Title', 'العنوان') }}</span><p>{{ opp()!.title || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Stage', 'المرحلة') }}</span><p>{{ opp()!.stage || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Owner', 'المسؤول') }}</span><p>{{ opp()!.owner || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Probability', 'الاحتمالية') }}</span><p>{{ opp()!.probability || 0 }}%</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Estimated Value', 'القيمة المقدرة') }}</span><p>{{ opp()!.estimated_value | currency:(opp()!.currency || 'SAR') + ' ' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Close Date', 'تاريخ الإغلاق') }}</span><p>{{ opp()!.expected_close_date ? (opp()!.expected_close_date | date:'mediumDate') : i18n.t('TBD', 'يحدد لاحقاً') }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Lead Source', 'مصدر العميل المحتمل') }}</span><p>{{ opp()!.lead_source || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Created', 'تاريخ الإنشاء') }}</span><p>{{ opp()!.created_at | date:'mediumDate' }}</p></div>
              </div>
              @if (opp()!.notes) {
                <div class="mt-4 pt-4 border-t border-th-border">
                  <span class="text-th-text-3 text-sm">{{ i18n.t('Notes', 'ملاحظات') }}</span>
                  <p class="mt-1 text-th-text-3">{{ opp()!.notes }}</p>
                </div>
              }
            </div>

            <div class="space-y-6">
              <div class="bg-th-card border border-th-border rounded-xl p-6">
                <h3 class="font-semibold mb-4 text-th-text-3">{{ i18n.t('Deal Summary', 'ملخص الصفقة') }}</h3>
                <div class="text-center">
                  <p class="text-3xl font-bold text-gold">{{ opp()!.estimated_value | currency:(opp()!.currency || 'SAR') + ' ' }}</p>
                  <p class="text-sm text-th-text-3 mt-1">{{ opp()!.probability || 0 }}% {{ i18n.t('probability', 'احتمالية') }}</p>
                  <p class="text-sm font-semibold mt-2 text-success">
                    {{ i18n.t('Weighted', 'المرجح') }}: {{ (opp()!.estimated_value * (opp()!.probability || 0) / 100) | currency:(opp()!.currency || 'SAR') + ' ' }}
                  </p>
                </div>
              </div>

              @if (opp()!.lead_id) {
                <div class="bg-th-card border border-th-border rounded-xl p-6">
                  <h3 class="font-semibold mb-3 text-th-text-3">{{ i18n.t('Linked Lead', 'العميل المحتمل المرتبط') }}</h3>
                  <button (click)="router.navigate(['/admin/leads', opp()!.lead_id])"
                    class="text-primary hover:underline text-sm">{{ i18n.t('View Lead →', 'عرض العميل المحتمل →') }}</button>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminOpportunityDetailPage implements OnInit {
  router = inject(Router);
  i18n = inject(I18nService);
  private route = inject(ActivatedRoute);
  private api = inject(AdminApiService);

  opp = signal<any>(null);
  error = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.error.set('No opportunity ID'); return; }

    this.api.getOpportunity(id).subscribe({
      next: (r) => this.opp.set(r.opportunity || r.data || r),
      error: (e) => this.error.set(e.error?.error || 'Failed to load opportunity'),
    });
  }
}
