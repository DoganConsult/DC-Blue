import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';
import { PartnerResource } from '../../../core/models/partner.models';

@Component({
  selector: 'app-partner-resources',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      </div>
    } @else if (resources().length === 0) {
      <div class="bg-th-card border border-th-border rounded-xl p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-th-bg-tert flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-th-text mb-2">{{ i18n.t('No Resources Yet', 'لا توجد موارد بعد') }}</h3>
        <p class="text-sm text-th-text-3">{{ i18n.t('Resources will be added by the team. Check back soon!', 'سيتم إضافة الموارد بواسطة الفريق. تحقق قريباً!') }}</p>
      </div>
    } @else {
      <!-- Category Filter -->
      <div class="flex items-center gap-2 mb-6 flex-wrap">
        @for (cat of categories(); track cat) {
          <button (click)="activeCategory.set(cat)"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize"
                  [class.bg-primary]="activeCategory() === cat"
                  [class.text-white]="activeCategory() === cat"
                  [class.bg-th-bg-tert]="activeCategory() !== cat"
                  [class.text-th-text-2]="activeCategory() !== cat">
            {{ cat === 'all' ? i18n.t('All', 'الكل') : cat }}
          </button>
        }
      </div>

      <!-- Resource Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (r of filteredResources(); track r.id) {
          <a [href]="r.url" target="_blank" rel="noopener"
             class="bg-th-card border border-th-border rounded-xl p-5 hover:shadow-md hover:border-th-border transition-all group block">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0" [class]="fileTypeBg(r.file_type)">
                {{ fileTypeIcon(r.file_type) }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-th-text group-hover:text-primary transition-colors truncate">{{ r.title }}</h4>
                @if (r.description) {
                  <p class="text-xs text-th-text-3 mt-1 line-clamp-2">{{ r.description }}</p>
                }
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded bg-th-bg-tert text-th-text-3">{{ r.file_type }}</span>
                  <span class="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded bg-th-bg-tert text-th-text-3">{{ r.category }}</span>
                </div>
              </div>
            </div>
          </a>
        }
      </div>
    }
  `,
})
export class PartnerResourcesComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  resources = signal<PartnerResource[]>([]);
  loading = signal(false);
  activeCategory = signal('all');

  categories = computed(() => {
    const cats = new Set(this.resources().map(r => r.category));
    return ['all', ...Array.from(cats)];
  });

  filteredResources = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.resources();
    return this.resources().filter(r => r.category === cat);
  });

  ngOnInit() {
    this.loading.set(true);
    this.api.getResources().subscribe({
      next: res => { this.resources.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  fileTypeIcon(type: string): string {
    const map: Record<string, string> = { pdf: '📄', docx: '📝', xlsx: '📊', pptx: '📈', video: '🎥', link: '🔗' };
    return map[type] || '📁';
  }

  fileTypeBg(type: string): string {
    const map: Record<string, string> = { pdf: 'bg-red-50', docx: 'bg-blue-50', xlsx: 'bg-emerald-50', pptx: 'bg-amber-50', video: 'bg-purple-50', link: 'bg-sky-50' };
    return map[type] || 'bg-th-bg-alt';
  }
}
