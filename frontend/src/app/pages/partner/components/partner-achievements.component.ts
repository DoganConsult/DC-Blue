import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { Achievement } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-12">
        <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      </div>
    } @else {
      <!-- Progress -->
      <div class="bg-th-card border border-th-border rounded-xl p-6 mb-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-th-text-2 uppercase tracking-wider">{{ i18n.t('Achievements', 'الإنجازات') }}</h3>
          <span class="text-sm font-bold text-th-text">{{ unlockedCount() }} / {{ totalCount() }}</span>
        </div>
        <div class="h-2.5 bg-th-bg-tert rounded-full overflow-hidden">
          <div class="h-full bg-indigo-500 rounded-full transition-all"
               [style.width.%]="totalCount() > 0 ? (unlockedCount() / totalCount()) * 100 : 0"></div>
        </div>
      </div>

      <!-- Achievement Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (a of achievements(); track a.key) {
          <div class="border rounded-xl p-5 transition-all"
               [class.bg-th-card]="a.unlocked"
               [class.border-th-border]="a.unlocked"
               [class.hover:shadow-md]="a.unlocked"
               [class.bg-th-bg-alt]="!a.unlocked"
               [class.border-th-border-lt]="!a.unlocked"
               [class.opacity-60]="!a.unlocked">
            <div class="flex items-start gap-3">
              <span class="text-2xl" [class.grayscale]="!a.unlocked">{{ a.icon }}</span>
              <div class="flex-1">
                <h4 class="text-sm font-semibold" [class.text-th-text]="a.unlocked" [class.text-th-text-3]="!a.unlocked">
                  {{ a.title }}
                </h4>
                <p class="text-xs text-th-text-3 mt-0.5">{{ a.description }}</p>
                @if (a.unlocked && a.unlocked_at) {
                  <p class="text-[10px] text-emerald-600 font-medium mt-1.5">
                    {{ i18n.t('Unlocked', 'مفتوح') }} {{ a.unlocked_at | date:'mediumDate' }}
                  </p>
                } @else {
                  <p class="text-[10px] text-th-text-3 mt-1.5">🔒 {{ i18n.t('Locked', 'مقفل') }}</p>
                }
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class PartnerAchievementsComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  achievements = signal<Achievement[]>([]);
  unlockedCount = signal(0);
  totalCount = signal(0);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.api.getAchievements().subscribe({
      next: res => {
        this.achievements.set(res.achievements);
        this.unlockedCount.set(res.unlocked_count);
        this.totalCount.set(res.total_count);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
