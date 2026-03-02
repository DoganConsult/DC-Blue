import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminApiService } from '../../../core/services/admin-api.service';

interface FileItem {
  id: string;
  entity_type: string;
  entity_id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string;
  created_at: string;
}

@Component({
  selector: 'admin-file-browser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <h2 class="text-xl font-bold">File Browser</h2>
      <div class="flex items-center gap-3">
        <select [(ngModel)]="entityType" (change)="loadFiles()" class="bg-th-card border border-th-border-dk text-th-text rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="lead">Leads</option>
          <option value="opportunity">Opportunities</option>
          <option value="engagement">Engagements</option>
          <option value="partner">Partners</option>
        </select>
        <input [(ngModel)]="entityId" placeholder="Entity ID" (keyup.enter)="loadFiles()"
               class="bg-th-card border border-th-border-dk text-th-text placeholder-th-text-3 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-primary" />
        <button (click)="loadFiles()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition">Load</button>
      </div>
    </div>

    <!-- Upload Section -->
    @if (entityId.trim()) {
      <div class="bg-th-card border border-th-border rounded-xl p-4 mb-6">
        <div class="flex items-center gap-4">
          <input #fileInput type="file" (change)="onFileSelected($event)" class="hidden" />
          <button (click)="fileInput.click()" class="px-4 py-2 rounded-lg bg-th-bg-tert text-th-text text-sm font-medium hover:bg-th-bg-tert/80 transition">
            Choose File
          </button>
          @if (selectedFile()) {
            <span class="text-sm text-th-text-3">{{ selectedFile()!.name }} ({{ formatSize(selectedFile()!.size) }})</span>
            <button (click)="uploadFile()" [disabled]="uploading()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition disabled:opacity-50">
              {{ uploading() ? 'Uploading...' : 'Upload' }}
            </button>
          }
        </div>
        @if (uploadError()) {
          <p class="text-red-400 text-xs mt-2">{{ uploadError() }}</p>
        }
      </div>
    }

    <!-- File List -->
    <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-th-border text-th-text-3">
              <th class="text-left font-medium px-4 py-3">Name</th>
              <th class="text-left font-medium px-4 py-3">Type</th>
              <th class="text-left font-medium px-4 py-3">Size</th>
              <th class="text-left font-medium px-4 py-3">Uploaded By</th>
              <th class="text-left font-medium px-4 py-3">Date</th>
              <th class="text-right font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (file of files(); track file.id) {
              <tr class="border-b border-th-border/50 hover:bg-th-bg-tert/50 transition">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{{ getFileIcon(file.mime_type) }}</span>
                    <span class="font-medium truncate max-w-[200px]">{{ file.original_name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-th-text-3 text-xs font-mono">{{ file.mime_type }}</td>
                <td class="px-4 py-3 text-th-text-3 text-xs">{{ formatSize(file.size_bytes) }}</td>
                <td class="px-4 py-3 text-th-text-3 text-xs">{{ file.uploaded_by }}</td>
                <td class="px-4 py-3 text-th-text-3 text-xs">{{ file.created_at | date:'short' }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="downloadFile(file)" class="px-2 py-1 rounded bg-th-bg-tert text-th-text-3 hover:text-th-text text-xs transition">Download</button>
                    <button (click)="deleteFile(file)" class="px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition">Delete</button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="px-4 py-10 text-center text-th-text-3">
                {{ entityId.trim() ? 'No files found for this entity' : 'Enter an entity ID to browse files' }}
              </td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminFileBrowserComponent {
  private http = inject(HttpClient);
  private api = inject(AdminApiService);

  entityType = 'lead';
  entityId = '';
  files = signal<FileItem[]>([]);
  selectedFile = signal<File | null>(null);
  uploading = signal(false);
  uploadError = signal('');

  private headers(): HttpHeaders {
    const t = this.api.token();
    if (t.startsWith('eyJ')) return new HttpHeaders({ Authorization: `Bearer ${t}` });
    return new HttpHeaders({ 'x-admin-token': t });
  }

  loadFiles() {
    if (!this.entityId.trim()) return;
    this.http.get<{ data: FileItem[] }>(`/api/v1/files/${this.entityType}/${this.entityId.trim()}`, { headers: this.headers() }).subscribe({
      next: (r) => this.files.set(r.data || []),
      error: () => this.files.set([]),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile.set(input.files[0]);
      this.uploadError.set('');
    }
  }

  uploadFile() {
    const file = this.selectedFile();
    if (!file || !this.entityId.trim()) return;
    this.uploading.set(true);
    this.uploadError.set('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('entity_type', this.entityType);
    formData.append('entity_id', this.entityId.trim());

    this.http.post<any>('/api/v1/files/upload', formData, { headers: this.headers() }).subscribe({
      next: () => {
        this.uploading.set(false);
        this.selectedFile.set(null);
        this.loadFiles();
      },
      error: (e) => {
        this.uploading.set(false);
        this.uploadError.set(e.error?.error || 'Upload failed');
      },
    });
  }

  downloadFile(file: FileItem) {
    this.http.get(`/api/v1/files/download/${file.id}`, { headers: this.headers(), responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.original_name;
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }

  deleteFile(file: FileItem) {
    if (!confirm(`Delete "${file.original_name}"?`)) return;
    this.http.delete<any>(`/api/v1/files/${file.id}`, { headers: this.headers() }).subscribe({
      next: () => this.files.update(list => list.filter(f => f.id !== file.id)),
    });
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  getFileIcon(mime: string): string {
    if (mime?.startsWith('image/')) return '\u{1F5BC}';
    if (mime?.includes('pdf')) return '\u{1F4C4}';
    if (mime?.includes('spreadsheet') || mime?.includes('excel') || mime?.includes('csv')) return '\u{1F4CA}';
    if (mime?.includes('presentation') || mime?.includes('powerpoint')) return '\u{1F4CA}';
    if (mime?.includes('zip') || mime?.includes('compressed')) return '\u{1F4E6}';
    return '\u{1F4CE}';
  }
}
