import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminApiService } from '../../core/services/admin-api.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-admin-commission-detail',
  template: `
    <div class="min-h-screen bg-th-bg text-th-text">
      <nav class="bg-th-card border-b border-th-border px-6 py-3 flex items-center gap-4">
        <a class="font-bold text-lg cursor-pointer" (click)="router.navigate(['/'])">
          Dogan<span class="text-gold">Consult</span>
        </a>
        <span class="text-th-text-2">|</span>
        <a class="text-th-text-3 hover:text-th-text text-sm cursor-pointer transition" (click)="router.navigate(['/admin'], { queryParams: { tab: 'commissions' } })">
          {{ i18n.t('← Back to Commissions', '← العودة إلى العمولات') }}
        </a>
      </nav>

      @if (!commission()) {
        <div class="flex items-center justify-center min-h-[60vh]">
          @if (error()) {
            <div class="text-center">
              <p class="text-error mb-4">{{ error() }}</p>
              <button (click)="router.navigate(['/admin'], { queryParams: { tab: 'commissions' } })" class="text-primary hover:underline">{{ i18n.t('Back to Commissions', 'العودة إلى العمولات') }}</button>
            </div>
          } @else {
            <p class="text-th-text-3">{{ i18n.t('Loading...', 'جاري التحميل...') }}</p>
          }
        </div>
      } @else {
        <div class="max-w-5xl mx-auto px-4 py-8">
          <div class="flex items-start justify-between mb-8">
            <div>
              <h1 class="text-2xl font-bold">{{ i18n.t('Commission', 'العمولة') }} #{{ commission()!.id }}</h1>
              <p class="text-th-text-3">{{ commission()!.partner_company_name }} · {{ commission()!.partner_name }}</p>
            </div>
            <span class="px-3 py-1.5 rounded-full text-sm font-semibold"
              [class]="{
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': commission()!.status === 'approved' || commission()!.status === 'paid',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': commission()!.status === 'pending',
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': commission()!.status === 'rejected',
                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': commission()!.status === 'payout_requested',
                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300': !['approved','paid','pending','rejected','payout_requested'].includes(commission()!.status)
              }">
              {{ commission()!.status }}
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-th-card border border-th-border rounded-xl p-6">
              <h3 class="font-semibold mb-4 text-th-text-3">{{ i18n.t('Commission Details', 'تفاصيل العمولة') }}</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div><span class="text-th-text-3">{{ i18n.t('Partner', 'الشريك') }}</span><p>{{ commission()!.partner_company_name || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Contact', 'جهة الاتصال') }}</span><p>{{ commission()!.partner_name || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Deal Value', 'قيمة الصفقة') }}</span><p>{{ commission()!.deal_value | currency:'SAR ' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Commission Rate', 'نسبة العمولة') }}</span><p>{{ commission()!.commission_rate || 0 }}%</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Commission Amount', 'مبلغ العمولة') }}</span><p class="font-bold text-gold">{{ commission()!.commission_amount | currency:'SAR ' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Status', 'الحالة') }}</span><p>{{ commission()!.status }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Opportunity', 'الفرصة') }}</span><p>{{ commission()!.opportunity_title || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Created', 'تاريخ الإنشاء') }}</span><p>{{ commission()!.created_at | date:'mediumDate' }}</p></div>
              </div>
              @if (commission()!.notes) {
                <div class="mt-4 pt-4 border-t border-th-border">
                  <span class="text-th-text-3 text-sm">{{ i18n.t('Notes', 'ملاحظات') }}</span>
                  <p class="mt-1 text-th-text-3">{{ commission()!.notes }}</p>
                </div>
              }
            </div>

            <div class="space-y-6">
              <div class="bg-th-card border border-th-border rounded-xl p-6 text-center">
                <h3 class="font-semibold mb-3 text-th-text-3">{{ i18n.t('Amount', 'المبلغ') }}</h3>
                <p class="text-3xl font-bold text-gold">{{ commission()!.commission_amount | currency:'SAR ' }}</p>
                @if (commission()!.payout_requested) {
                  <p class="text-sm text-primary mt-2 font-medium">{{ i18n.t('Payout Requested', 'تم طلب الدفع') }}</p>
                }
                @if (commission()!.paid_at) {
                  <p class="text-sm text-success mt-2 font-medium">{{ i18n.t('Paid', 'مدفوع') }}: {{ commission()!.paid_at | date:'short' }}</p>
                }
              </div>

              @if (commission()!.partner_id) {
                <div class="bg-th-card border border-th-border rounded-xl p-6">
                  <h3 class="font-semibold mb-3 text-th-text-3">{{ i18n.t('Partner', 'الشريك') }}</h3>
                  <button (click)="router.navigate(['/admin/partners', commission()!.partner_id])"
                    class="text-primary hover:underline text-sm">{{ i18n.t('View Partner →', 'عرض الشريك →') }}</button>
                </div>
              }
              @if (commission()!.opportunity_id) {
                <div class="bg-th-card border border-th-border rounded-xl p-6">
                  <h3 class="font-semibold mb-3 text-th-text-3">{{ i18n.t('Opportunity', 'الفرصة') }}</h3>
                  <button (click)="router.navigate(['/admin/opportunities', commission()!.opportunity_id])"
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
export class AdminCommissionDetailPage implements OnInit {
  router = inject(Router);
  i18n = inject(I18nService);
  private route = inject(ActivatedRoute);
  private api = inject(AdminApiService);

  commission = signal<any>(null);
  error = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.error.set('No commission ID'); return; }

    this.api.getCommission(id).subscribe({
      next: (r) => this.commission.set(r.commission || r.data || r),
      error: (e) => this.error.set(e.error?.error || 'Failed to load commission'),
    });
  }
}
