import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { TierResponse, TierDefinition } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-tier',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      </div>
    } @else if (data()) {
      <!-- Current Tier Banner -->
      <div class="rounded-xl p-6 mb-6 border-2" [style.border-color]="currentTierColor()" [style.background]="currentTierColor() + '08'">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full flex items-center justify-center text-3xl" [style.background]="currentTierColor() + '20'">
            {{ tierIcon(data()!.current_tier) }}
          </div>
          <div>
            <p class="text-xs text-th-text-3 uppercase tracking-wider mb-0.5">{{ i18n.t('Current Tier', 'المستوى الحالي') }}</p>
            <h2 class="text-2xl font-bold text-th-text capitalize">{{ data()!.current_tier }}</h2>
            <p class="text-xs text-th-text-3 mt-0.5">{{ i18n.t('Member since', 'عضو منذ') }} {{ data()!.member_since | date:'mediumDate' }}</p>
          </div>
        </div>
      </div>

      <!-- Tier Roadmap -->
      <div class="bg-th-card border border-th-border rounded-xl p-6 mb-6">
        <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-5">{{ i18n.t('Tier Roadmap', 'خارطة المستويات') }}</h3>
        <div class="flex items-center gap-0">
          @for (tier of data()!.tiers; track tier.key; let i = $index; let last = $last) {
            <div class="flex items-center" [class.flex-1]="!last">
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all"
                     [class.border-th-border]="!isTierReached(tier.key)"
                     [class.bg-th-card]="!isTierReached(tier.key)"
                     [style.border-color]="isTierReached(tier.key) ? tier.color : ''"
                     [style.background]="isTierReached(tier.key) ? tier.color + '20' : ''">
                  {{ tierIcon(tier.key) }}
                </div>
                <span class="text-[10px] font-semibold mt-1.5 capitalize" [class.text-th-text-3]="!isTierReached(tier.key)" [class.text-th-text]="isTierReached(tier.key)">
                  {{ i18n.t(tier.label.en, tier.label.ar) }}
                </span>
              </div>
              @if (!last) {
                <div class="flex-1 h-1 mx-2 rounded-full" [class]="isTierReached(data()!.tiers[i + 1].key) ? 'bg-emerald-400' : 'bg-th-bg-tert'"></div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Progress to Next Tier -->
      @if (data()!.next_tier) {
        <div class="bg-th-card border border-th-border rounded-xl p-6 mb-6">
          <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider mb-1">
            {{ i18n.t('Progress to', 'التقدم نحو') }} {{ i18n.t(data()!.next_tier!.label.en, data()!.next_tier!.label.ar) }}
          </h3>
          <p class="text-xs text-th-text-3 mb-5">{{ i18n.t('Meet all 3 criteria to advance', 'حقق المعايير الثلاثة للتقدم') }}</p>

          <div class="space-y-5">
            <!-- Leads Progress -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm text-th-text-2">{{ i18n.t('Leads Submitted', 'العملاء المُرسلون') }}</span>
                <span class="text-sm font-bold text-th-text">{{ data()!.progress.leads.current }} / {{ data()!.progress.leads.required }}</span>
              </div>
              <div class="h-2.5 bg-th-bg-tert rounded-full overflow-hidden">
                <div class="h-full bg-blue-500 rounded-full transition-all" [style.width.%]="data()!.progress.leads.pct"></div>
              </div>
            </div>
            <!-- Won Deals Progress -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm text-th-text-2">{{ i18n.t('Won Deals', 'الصفقات الرابحة') }}</span>
                <span class="text-sm font-bold text-th-text">{{ data()!.progress.won.current }} / {{ data()!.progress.won.required }}</span>
              </div>
              <div class="h-2.5 bg-th-bg-tert rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full transition-all" [style.width.%]="data()!.progress.won.pct"></div>
              </div>
            </div>
            <!-- Revenue Progress -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm text-th-text-2">{{ i18n.t('Paid Revenue', 'الإيرادات المدفوعة') }}</span>
                <span class="text-sm font-bold text-th-text">SAR {{ formatK(data()!.progress.revenue.current) }} / {{ formatK(data()!.progress.revenue.required) }}</span>
              </div>
              <div class="h-2.5 bg-th-bg-tert rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full transition-all" [style.width.%]="data()!.progress.revenue.pct"></div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 text-center">
          <span class="text-3xl">👑</span>
          <h3 class="text-lg font-bold text-th-text mt-2">{{ i18n.t('Maximum Tier Reached!', 'تم الوصول إلى أعلى مستوى!') }}</h3>
          <p class="text-sm text-th-text-3 mt-1">{{ i18n.t('You are at the highest partner tier. Enjoy exclusive benefits.', 'أنت في أعلى مستوى شراكة. استمتع بالمزايا الحصرية.') }}</p>
        </div>
      }
    }
  `,
})
export class PartnerTierComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  data = signal<TierResponse | null>(null);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.api.getTier().subscribe({
      next: res => { this.data.set(res); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  currentTierColor(): string {
    const tier = this.data()?.tiers.find(t => t.key === this.data()?.current_tier);
    return tier?.color || '#6b7280';
  }

  isTierReached(key: string): boolean {
    const tiers = this.data()?.tiers || [];
    const currentIdx = tiers.findIndex(t => t.key === this.data()?.current_tier);
    const checkIdx = tiers.findIndex(t => t.key === key);
    return checkIdx <= currentIdx;
  }

  tierIcon(key: string): string {
    const map: Record<string, string> = { registered: '🌱', silver: '🥈', gold: '🥇', platinum: '💎' };
    return map[key] || '🌱';
  }

  formatK(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return String(n);
  }
}
