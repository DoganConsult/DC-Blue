import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApiService } from '../../../core/services/client-api.service';
import { ClientFile } from '../../../core/models/client.models';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-workspace-files',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-th-text">{{ i18n.t('Documents & Files', 'المستندات والملفات') }}</h2>
      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <span class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></span>
        </div>
      } @else if (files().length === 0) {
        <div class="rounded-xl border border-th-border bg-th-bg-tert/30 p-8 text-center">
          <p class="text-th-text-3">{{ i18n.t('No files yet.', 'لا توجد ملفات بعد.') }}</p>
          <p class="text-sm text-th-text-3 mt-1">{{ i18n.t('Files attached to your inquiries will appear here.', 'ستظهر هنا الملفات المرفقة باستفساراتك.') }}</p>
        </div>
      } @else {
        <div class="rounded-xl border border-th-border overflow-hidden">
          <table class="w-full text-left text-sm">
            <thead class="bg-th-bg-tert/50 border-b border-th-border">
              <tr>
                <th class="px-4 py-3 font-medium text-th-text-2">{{ i18n.t('Name', 'الاسم') }}</th>
                <th class="px-4 py-3 font-medium text-th-text-2 hidden sm:table-cell">{{ i18n.t('Type', 'النوع') }}</th>
                <th class="px-4 py-3 font-medium text-th-text-2 hidden md:table-cell">{{ i18n.t('Size', 'الحجم') }}</th>
                <th class="px-4 py-3 font-medium text-th-text-2 hidden lg:table-cell">{{ i18n.t('Date', 'التاريخ') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (f of files(); track f.id) {
                <tr class="border-b border-th-border last:border-0 hover:bg-th-bg-tert/30 transition">
                  <td class="px-4 py-3 text-th-text">{{ f.original_name || f.filename }}</td>
                  <td class="px-4 py-3 text-th-text-3 hidden sm:table-cell">{{ f.mime_type || '—' }}</td>
                  <td class="px-4 py-3 text-th-text-3 hidden md:table-cell">{{ formatSize(f.size_bytes) }}</td>
                  <td class="px-4 py-3 text-th-text-3 hidden lg:table-cell">{{ f.created_at | date:'short' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class WorkspaceFilesComponent implements OnInit {
  private api = inject(ClientApiService);
  i18n = inject(I18nService);

  loading = signal(true);
  files = signal<ClientFile[]>([]);

  ngOnInit() {
    this.api.getFiles().subscribe({
      next: (r) => {
        this.files.set(r.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  formatSize(bytes: number | null): string {
    if (bytes == null || bytes === 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
