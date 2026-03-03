import { Component, inject, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
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
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-th-text">{{ i18n.t('Documents & Files', 'المستندات والملفات') }}</h2>
        <button (click)="fileInput.click()"
          [disabled]="uploading()"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50">
          @if (uploading()) {
            <span class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ i18n.t('Uploading...', 'جارٍ الرفع...') }}
          } @else {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"/>
            </svg>
            {{ i18n.t('Upload File', 'رفع ملف') }}
          }
        </button>
        <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" />
      </div>

      @if (uploadError()) {
        <div class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {{ uploadError() }}
        </div>
      }
      @if (uploadSuccess()) {
        <div class="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-300">
          {{ i18n.t('File uploaded successfully!', 'تم رفع الملف بنجاح!') }}
        </div>
      }

      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <span class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></span>
        </div>
      } @else if (files().length === 0) {
        <div class="rounded-xl border border-th-border bg-th-bg-tert/30 p-8 text-center">
          <svg class="mx-auto w-12 h-12 text-th-text-3/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <p class="text-th-text-3">{{ i18n.t('No files yet.', 'لا توجد ملفات بعد.') }}</p>
          <p class="text-sm text-th-text-3 mt-1">{{ i18n.t('Upload documents or files attached to your inquiries will appear here.', 'قم برفع المستندات أو ستظهر هنا الملفات المرفقة باستفساراتك.') }}</p>
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
                <th class="px-4 py-3 font-medium text-th-text-2 w-24">{{ i18n.t('Actions', 'إجراءات') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (f of files(); track f.id) {
                <tr class="border-b border-th-border last:border-0 hover:bg-th-bg-tert/30 transition">
                  <td class="px-4 py-3 text-th-text">
                    <div class="flex items-center gap-2">
                      <span class="text-th-text-3">{{ getFileIcon(f.mime_type) }}</span>
                      {{ f.original_name || f.filename }}
                    </div>
                  </td>
                  <td class="px-4 py-3 text-th-text-3 hidden sm:table-cell">{{ f.mime_type || '—' }}</td>
                  <td class="px-4 py-3 text-th-text-3 hidden md:table-cell">{{ formatSize(f.size_bytes) }}</td>
                  <td class="px-4 py-3 text-th-text-3 hidden lg:table-cell">{{ f.created_at | date:'short' }}</td>
                  <td class="px-4 py-3">
                    <button (click)="downloadFile(f)"
                      class="text-primary hover:text-primary/70 text-sm font-medium transition">
                      {{ i18n.t('Download', 'تحميل') }}
                    </button>
                  </td>
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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  loading = signal(true);
  files = signal<ClientFile[]>([]);
  uploading = signal(false);
  uploadError = signal('');
  uploadSuccess = signal(false);

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.api.getFiles().subscribe({
      next: (r) => {
        this.files.set(r.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected
    input.value = '';

    // 20MB limit
    if (file.size > 20 * 1024 * 1024) {
      this.uploadError.set(this.i18n.t('File too large. Maximum size is 20MB.', 'الملف كبير جدًا. الحد الأقصى 20 ميغابايت.'));
      return;
    }

    this.uploading.set(true);
    this.uploadError.set('');
    this.uploadSuccess.set(false);

    this.api.uploadFile(file).subscribe({
      next: () => {
        this.uploading.set(false);
        this.uploadSuccess.set(true);
        this.loadFiles();
        setTimeout(() => this.uploadSuccess.set(false), 3000);
      },
      error: (err) => {
        this.uploading.set(false);
        this.uploadError.set(err?.error?.error || this.i18n.t('Upload failed. Please try again.', 'فشل الرفع. يرجى المحاولة مرة أخرى.'));
      },
    });
  }

  downloadFile(f: ClientFile) {
    this.api.downloadFile(f.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = f.original_name || f.filename || 'download';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        this.uploadError.set(this.i18n.t('Download failed.', 'فشل التحميل.'));
      },
    });
  }

  formatSize(bytes: number | null): string {
    if (bytes == null || bytes === 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getFileIcon(mimeType: string | null): string {
    if (!mimeType) return '📄';
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return '📦';
    return '📄';
  }
}
