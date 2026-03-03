import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApiService } from '../../../core/services/client-api.service';
import { I18nService } from '../../../core/services/i18n.service';
import { Contract, License } from '../../../core/models/client.models';

@Component({
  selector: 'app-workspace-contracts',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    } @else {
      <div class="flex items-center gap-4 mb-6">
        <button (click)="view.set('contracts')" class="text-sm font-medium"
                [class]="view() === 'contracts' ? 'text-primary border-b-2 border-primary pb-1' : 'text-th-text-3'">
          {{ i18n.t('Contracts', 'العقود') }}
        </button>
        <button (click)="view.set('licenses'); loadLicenses()" class="text-sm font-medium"
                [class]="view() === 'licenses' ? 'text-primary border-b-2 border-primary pb-1' : 'text-th-text-3'">
          {{ i18n.t('Licenses', 'التراخيص') }}
        </button>
      </div>

      @if (view() === 'contracts') {
        @if (contracts().length === 0) {
          <div class="bg-th-card border border-th-border rounded-xl p-10 text-center">
            <p class="text-th-text-3 text-sm">{{ i18n.t('No contracts yet', 'لا توجد عقود حتى الآن') }}</p>
          </div>
        } @else {
          <div class="grid gap-4">
            @for (c of contracts(); track c.id) {
              <div class="bg-th-card border border-th-border rounded-xl p-5 hover:border-primary/30 transition cursor-pointer" (click)="selectContract(c)">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="font-semibold text-sm">{{ c.title }}</h3>
                    <p class="text-th-text-3 text-xs">{{ c.contract_number || '' }} &middot; {{ formatType(c.contract_type) }}</p>
                  </div>
                  <span class="px-2 py-0.5 rounded text-xs font-medium" [class]="getContractStatusClass(c.status)">{{ formatType(c.status) }}</span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div><span class="text-th-text-3 block">{{ i18n.t('Value', 'القيمة') }}</span>{{ c.value ? (c.currency + ' ' + (c.value | number)) : '-' }}</div>
                  <div><span class="text-th-text-3 block">{{ i18n.t('Start Date', 'تاريخ البدء') }}</span>{{ c.start_date ? (c.start_date | date:'mediumDate') : '-' }}</div>
                  <div>
                    <span class="text-th-text-3 block">{{ i18n.t('End Date', 'تاريخ الانتهاء') }}</span>
                    <span [class.text-amber-600]="isExpiringSoon(c)">{{ c.end_date ? (c.end_date | date:'mediumDate') : '-' }}</span>
                  </div>
                  <div><span class="text-th-text-3 block">{{ i18n.t('Auto-Renew', 'تجديد تلقائي') }}</span>{{ c.auto_renew ? 'Yes' : 'No' }}</div>
                </div>
              </div>
            }
          </div>

          @if (selectedContract()) {
            <div class="mt-6 bg-th-card border border-th-border rounded-xl p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold">{{ selectedContract()!.title }} — {{ i18n.t('Licenses', 'التراخيص') }}</h3>
                <button (click)="selectedContract.set(null)" class="text-th-text-3 hover:text-th-text text-xs">{{ i18n.t('Close', 'إغلاق') }}</button>
              </div>
              @if (contractLicenses().length === 0) {
                <p class="text-th-text-3 text-sm">{{ i18n.t('No licenses yet', 'لا توجد تراخيص حتى الآن') }}</p>
              } @else {
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b border-th-border">
                        <th class="text-left px-3 py-2 text-xs text-th-text-3">{{ i18n.t('Product', 'المنتج') }}</th>
                        <th class="text-left px-3 py-2 text-xs text-th-text-3">{{ i18n.t('Type', 'النوع') }}</th>
                        <th class="text-left px-3 py-2 text-xs text-th-text-3">{{ i18n.t('Quantity', 'الكمية') }}</th>
                        <th class="text-left px-3 py-2 text-xs text-th-text-3">{{ i18n.t('Expiry', 'الانتهاء') }}</th>
                        <th class="text-left px-3 py-2 text-xs text-th-text-3">{{ i18n.t('Status', 'الحالة') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (l of contractLicenses(); track l.id) {
                        <tr class="border-b border-th-border last:border-0">
                          <td class="px-3 py-2">{{ l.product_name }}</td>
                          <td class="px-3 py-2 text-th-text-3">{{ l.license_type || '-' }}</td>
                          <td class="px-3 py-2">{{ l.quantity }}</td>
                          <td class="px-3 py-2 text-th-text-3">{{ l.expiry_date ? (l.expiry_date | date:'mediumDate') : '-' }}</td>
                          <td class="px-3 py-2"><span class="px-2 py-0.5 rounded text-xs" [class]="getLicenseStatusClass(l.status)">{{ l.status }}</span></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          }
        }
      } @else {
        @if (licensesLoading()) {
          <div class="py-10 text-center text-th-text-3 text-sm">Loading licenses...</div>
        } @else if (allLicenses().length === 0) {
          <div class="bg-th-card border border-th-border rounded-xl p-10 text-center">
            <p class="text-th-text-3 text-sm">{{ i18n.t('No licenses yet', 'لا توجد تراخيص حتى الآن') }}</p>
          </div>
        } @else {
          <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-th-border bg-th-bg-tert">
                  <th class="text-left px-4 py-3 text-xs text-th-text-3">{{ i18n.t('Product', 'المنتج') }}</th>
                  <th class="text-left px-4 py-3 text-xs text-th-text-3">{{ i18n.t('Contract', 'العقد') }}</th>
                  <th class="text-left px-4 py-3 text-xs text-th-text-3 hidden md:table-cell">{{ i18n.t('Type', 'النوع') }}</th>
                  <th class="text-left px-4 py-3 text-xs text-th-text-3">{{ i18n.t('Quantity', 'الكمية') }}</th>
                  <th class="text-left px-4 py-3 text-xs text-th-text-3">{{ i18n.t('Expiry', 'الانتهاء') }}</th>
                  <th class="text-left px-4 py-3 text-xs text-th-text-3">{{ i18n.t('Status', 'الحالة') }}</th>
                </tr>
              </thead>
              <tbody>
                @for (l of allLicenses(); track l.id) {
                  <tr class="border-b border-th-border last:border-0">
                    <td class="px-4 py-3 font-medium">{{ l.product_name }}</td>
                    <td class="px-4 py-3 text-th-text-3 text-xs">{{ l.contract_title || '-' }}</td>
                    <td class="px-4 py-3 text-th-text-3 hidden md:table-cell">{{ l.license_type || '-' }}</td>
                    <td class="px-4 py-3">{{ l.quantity }}</td>
                    <td class="px-4 py-3 text-th-text-3">{{ l.expiry_date ? (l.expiry_date | date:'mediumDate') : '-' }}</td>
                    <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs" [class]="getLicenseStatusClass(l.status)">{{ l.status }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    }
  `,
})
export class WorkspaceContractsComponent implements OnInit {
  private api = inject(ClientApiService);
  i18n = inject(I18nService);

  loading = signal(true);
  licensesLoading = signal(false);
  view = signal<'contracts' | 'licenses'>('contracts');
  contracts = signal<Contract[]>([]);
  allLicenses = signal<License[]>([]);
  selectedContract = signal<Contract | null>(null);
  contractLicenses = signal<License[]>([]);

  ngOnInit() {
    this.api.getContracts().subscribe({
      next: (r) => { this.contracts.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  loadLicenses() {
    if (this.allLicenses().length > 0) return;
    this.licensesLoading.set(true);
    this.api.getLicenses().subscribe({
      next: (r) => { this.allLicenses.set(r.data); this.licensesLoading.set(false); },
      error: () => this.licensesLoading.set(false),
    });
  }

  selectContract(c: Contract) {
    this.selectedContract.set(c);
    this.api.getContract(c.id).subscribe({
      next: (r) => this.contractLicenses.set(r.licenses),
      error: () => {},
    });
  }

  isExpiringSoon(c: Contract): boolean {
    if (!c.end_date || c.status !== 'active') return false;
    const days = (new Date(c.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days <= 30 && days >= 0;
  }

  formatType(s: string): string {
    return s?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '-';
  }

  getContractStatusClass(status: string): string {
    const map: Record<string, string> = {
      draft: 'bg-slate-100 text-slate-700',
      active: 'bg-emerald-50 text-emerald-700',
      expiring: 'bg-amber-50 text-amber-700',
      expired: 'bg-red-50 text-red-700',
      renewed: 'bg-blue-50 text-blue-700',
      terminated: 'bg-gray-100 text-gray-500',
    };
    return map[status] || 'bg-gray-50 text-gray-700';
  }

  getLicenseStatusClass(status: string): string {
    const map: Record<string, string> = {
      active: 'bg-emerald-50 text-emerald-700',
      expiring: 'bg-amber-50 text-amber-700',
      expired: 'bg-red-50 text-red-700',
      revoked: 'bg-gray-100 text-gray-500',
    };
    return map[status] || 'bg-gray-50 text-gray-700';
  }
}
