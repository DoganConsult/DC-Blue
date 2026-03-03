import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminApiService } from '../../core/services/admin-api.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-admin-partner-detail',
  template: `
    <div class="min-h-screen bg-th-bg text-th-text">
      <nav class="bg-th-card border-b border-th-border px-6 py-3 flex items-center gap-4">
        <a class="font-bold text-lg cursor-pointer" (click)="router.navigate(['/'])">
          Dogan<span class="text-gold">Consult</span>
        </a>
        <span class="text-th-text-2">|</span>
        <a class="text-th-text-3 hover:text-th-text text-sm cursor-pointer transition" (click)="router.navigate(['/admin'], { queryParams: { tab: 'partners' } })">
          {{ i18n.t('← Back to Partners', '← العودة إلى الشركاء') }}
        </a>
      </nav>

      @if (!partner()) {
        <div class="flex items-center justify-center min-h-[60vh]">
          @if (error()) {
            <div class="text-center">
              <p class="text-error mb-4">{{ error() }}</p>
              <button (click)="router.navigate(['/admin'], { queryParams: { tab: 'partners' } })" class="text-primary hover:underline">{{ i18n.t('Back to Partners', 'العودة إلى الشركاء') }}</button>
            </div>
          } @else {
            <p class="text-th-text-3">{{ i18n.t('Loading...', 'جاري التحميل...') }}</p>
          }
        </div>
      } @else {
        <div class="max-w-5xl mx-auto px-4 py-8">
          <div class="flex items-start justify-between mb-8">
            <div>
              <h1 class="text-2xl font-bold">{{ partner()!.company_name }}</h1>
              <p class="text-th-text-3">{{ partner()!.contact_name }} · {{ partner()!.email }}</p>
            </div>
            <span class="px-3 py-1.5 rounded-full text-sm font-semibold"
              [class]="{
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': partner()!.status === 'approved',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': partner()!.status === 'pending',
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': partner()!.status === 'rejected',
                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300': !['approved','pending','rejected'].includes(partner()!.status)
              }">
              {{ partner()!.status }}
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-th-card border border-th-border rounded-xl p-6">
              <h3 class="font-semibold mb-4 text-th-text-3">{{ i18n.t('Partner Details', 'تفاصيل الشريك') }}</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div><span class="text-th-text-3">{{ i18n.t('Company', 'الشركة') }}</span><p>{{ partner()!.company_name || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Contact', 'جهة الاتصال') }}</span><p>{{ partner()!.contact_name || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Email', 'البريد الإلكتروني') }}</span><p>{{ partner()!.email || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Phone', 'الهاتف') }}</span><p>{{ partner()!.phone || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Tier', 'المستوى') }}</span><p>{{ partner()!.tier || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Region', 'المنطقة') }}</span><p>{{ partner()!.region || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Specializations', 'التخصصات') }}</span><p>{{ partner()!.specializations || '—' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Joined', 'تاريخ الانضمام') }}</span><p>{{ partner()!.created_at | date:'mediumDate' }}</p></div>
              </div>
            </div>

            <div class="bg-th-card border border-th-border rounded-xl p-6">
              <h3 class="font-semibold mb-4 text-th-text-3">{{ i18n.t('Performance', 'الأداء') }}</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div><span class="text-th-text-3">{{ i18n.t('Leads Submitted', 'العملاء المحتملون المقدمون') }}</span><p class="text-lg font-bold">{{ partner()!.leads_count || 0 }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Leads Approved', 'العملاء المحتملون الموافق عليهم') }}</span><p class="text-lg font-bold text-success">{{ partner()!.approved_count || 0 }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Total Commission', 'إجمالي العمولة') }}</span><p class="text-lg font-bold text-gold">{{ partner()!.total_commission | currency:'SAR ' }}</p></div>
                <div><span class="text-th-text-3">{{ i18n.t('Pending Payout', 'الدفع المعلق') }}</span><p class="text-lg font-bold">{{ partner()!.pending_payout | currency:'SAR ' }}</p></div>
              </div>
            </div>
          </div>

          @if (leads().length) {
            <div class="mt-6 bg-th-card border border-th-border rounded-xl p-6">
              <h3 class="font-semibold mb-4 text-th-text-3">{{ i18n.t('Submitted Leads', 'العملاء المحتملون المقدمون') }}</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                  <thead class="text-th-text-3 border-b border-th-border">
                    <tr>
                      <th class="px-3 py-2">{{ i18n.t('Company', 'الشركة') }}</th>
                      <th class="px-3 py-2">{{ i18n.t('Status', 'الحالة') }}</th>
                      <th class="px-3 py-2">{{ i18n.t('Date', 'التاريخ') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (l of leads(); track l.id) {
                      <tr class="border-b border-th-border last:border-0 hover:bg-th-bg-tert/30 cursor-pointer transition"
                          (click)="router.navigate(['/admin/leads', l.lead_id || l.id])">
                        <td class="px-3 py-2">{{ l.company_name }}</td>
                        <td class="px-3 py-2">{{ l.status }}</td>
                        <td class="px-3 py-2">{{ l.created_at | date:'short' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AdminPartnerDetailPage implements OnInit {
  router = inject(Router);
  i18n = inject(I18nService);
  private route = inject(ActivatedRoute);
  private api = inject(AdminApiService);

  partner = signal<any>(null);
  leads = signal<any[]>([]);
  error = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.error.set('No partner ID'); return; }

    this.api.getPartner(id).subscribe({
      next: (r) => {
        this.partner.set(r.partner || r.data || r);
        if (r.leads) this.leads.set(r.leads);
      },
      error: (e) => this.error.set(e.error?.error || 'Failed to load partner'),
    });
  }
}
