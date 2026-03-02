import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApiService } from '../../../core/services/client-api.service';
import { Demo } from '../../../core/models/client.models';

@Component({
  selector: 'app-workspace-demos',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    } @else {
      <h2 class="text-lg font-bold mb-6">Demos & POC</h2>

      @if (demos().length === 0) {
        <div class="bg-th-card border border-th-border rounded-xl p-10 text-center">
          <p class="text-th-text-3 text-sm">No demos or POCs scheduled yet.</p>
        </div>
      } @else {
        <div class="grid gap-4">
          @for (d of demos(); track d.id) {
            <div class="bg-th-card border border-th-border rounded-xl p-5 hover:border-primary/30 transition">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-sm">{{ d.title }}</h3>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase"
                          [class]="d.demo_type === 'poc' ? 'bg-violet-100 text-violet-700' : d.demo_type === 'pilot' ? 'bg-cyan-100 text-cyan-700' : 'bg-blue-100 text-blue-700'">
                      {{ d.demo_type }}
                    </span>
                  </div>
                  @if (d.opportunity_name) {
                    <p class="text-th-text-3 text-xs">{{ d.opportunity_name }}</p>
                  }
                </div>
                <span class="px-2 py-0.5 rounded text-xs font-medium" [class]="getDemoStatusClass(d.status)">{{ formatStatus(d.status) }}</span>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div><span class="text-th-text-3 block">Scheduled</span>{{ d.scheduled_date ? (d.scheduled_date | date:'medium') : 'TBD' }}</div>
                <div><span class="text-th-text-3 block">Duration</span>{{ d.duration_minutes }} min</div>
                @if (d.evaluation_score) {
                  <div><span class="text-th-text-3 block">Score</span>{{ d.evaluation_score }}/10</div>
                }
                @if (d.environment_url) {
                  <div><span class="text-th-text-3 block">Environment</span><a [href]="d.environment_url" target="_blank" class="text-primary hover:underline">Open</a></div>
                }
              </div>

              @if (d.demo_type === 'poc' && (d.poc_start_date || d.poc_end_date)) {
                <div class="mt-2 text-xs text-th-text-3">
                  POC Period: {{ d.poc_start_date ? (d.poc_start_date | date:'mediumDate') : '?' }} - {{ d.poc_end_date ? (d.poc_end_date | date:'mediumDate') : '?' }}
                </div>
              }

              @if (d.outcome) {
                <div class="mt-2 p-2 bg-th-bg-tert rounded-lg text-xs text-th-text-3">
                  <span class="font-medium text-th-text">Outcome:</span> {{ d.outcome }}
                </div>
              }

              @if (d.next_steps) {
                <div class="mt-1 text-xs text-th-text-3">Next steps: {{ d.next_steps }}</div>
              }
            </div>
          }
        </div>
      }
    }
  `,
})
export class WorkspaceDemosComponent implements OnInit {
  private api = inject(ClientApiService);
  loading = signal(true);
  demos = signal<Demo[]>([]);

  ngOnInit() {
    this.api.getDemos().subscribe({
      next: (r) => { this.demos.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  formatStatus(s: string): string {
    return s?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '-';
  }

  getDemoStatusClass(status: string): string {
    const map: Record<string, string> = {
      scheduled: 'bg-blue-50 text-blue-700',
      in_progress: 'bg-amber-50 text-amber-700',
      completed: 'bg-emerald-50 text-emerald-700',
      cancelled: 'bg-gray-100 text-gray-500',
      converted: 'bg-indigo-50 text-indigo-700',
    };
    return map[status] || 'bg-gray-50 text-gray-700';
  }
}
