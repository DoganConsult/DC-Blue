import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApiService } from '../../../core/services/client-api.service';
import { Project, Milestone, Task } from '../../../core/models/client.models';

@Component({
  selector: 'app-workspace-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    } @else {
      <h2 class="text-lg font-bold mb-6">Projects</h2>

      @if (projects().length === 0) {
        <div class="bg-th-card border border-th-border rounded-xl p-10 text-center">
          <p class="text-th-text-3 text-sm">No projects yet. Once your opportunity is won and implementation begins, your project will appear here.</p>
        </div>
      } @else {
        <div class="grid gap-4">
          @for (p of projects(); track p.id) {
            <div class="bg-th-card border border-th-border rounded-xl p-5 hover:border-primary/30 transition cursor-pointer" (click)="selectProject(p)">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="font-semibold text-sm">{{ p.title }}</h3>
                  <p class="text-th-text-3 text-xs">{{ p.project_code || '' }} {{ p.opportunity_name ? '&middot; ' + p.opportunity_name : '' }}</p>
                </div>
                <span class="px-2 py-0.5 rounded text-xs font-medium" [class]="getStatusClass(p.status)">{{ formatStatus(p.status) }}</span>
              </div>

              <!-- Progress Bar -->
              <div class="mb-3">
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-th-text-3">Progress</span>
                  <span class="font-medium">{{ p.progress_pct }}%</span>
                </div>
                <div class="h-2 bg-th-bg-tert rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full transition-all" [style.width.%]="p.progress_pct"></div>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div><span class="text-th-text-3 block">Phase</span>{{ formatStatus(p.phase) }}</div>
                <div><span class="text-th-text-3 block">Start</span>{{ p.start_date ? (p.start_date | date:'mediumDate') : 'TBD' }}</div>
                <div><span class="text-th-text-3 block">End</span>{{ p.end_date ? (p.end_date | date:'mediumDate') : 'TBD' }}</div>
                <div><span class="text-th-text-3 block">Budget</span>{{ p.budget ? (p.currency + ' ' + (p.budget | number)) : '-' }}</div>
              </div>
            </div>
          }
        </div>

        <!-- Detail Panel -->
        @if (selectedProject()) {
          <div class="mt-6 bg-th-card border border-th-border rounded-xl p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">{{ selectedProject()!.title }} — Details</h3>
              <button (click)="selectedProject.set(null)" class="text-th-text-3 hover:text-th-text text-xs">Close</button>
            </div>

            @if (detailLoading()) {
              <div class="py-4 text-center text-th-text-3 text-sm">Loading...</div>
            } @else {
              @if (milestones().length > 0) {
                <h4 class="text-xs font-semibold text-th-text-3 mb-2">Milestones</h4>
                <div class="space-y-2 mb-4">
                  @for (m of milestones(); track m.id) {
                    <div class="flex items-center gap-3 p-2 rounded-lg bg-th-bg-tert">
                      @if (m.status === 'completed') {
                        <span class="text-emerald-500 text-sm">&#10003;</span>
                      } @else {
                        <span class="text-th-text-3 text-sm">&#9675;</span>
                      }
                      <div class="flex-1">
                        <div class="text-sm font-medium">{{ m.title }}</div>
                        @if (m.due_date) {
                          <div class="text-xs text-th-text-3">Due: {{ m.due_date | date:'mediumDate' }}</div>
                        }
                      </div>
                      <span class="px-2 py-0.5 rounded text-[10px] font-medium" [class]="getStatusClass(m.status)">{{ m.status }}</span>
                    </div>
                  }
                </div>
              }

              @if (tasks().length > 0) {
                <h4 class="text-xs font-semibold text-th-text-3 mb-2">Tasks</h4>
                <div class="space-y-1">
                  @for (t of tasks(); track t.id) {
                    <div class="flex items-center gap-2 text-sm py-1">
                      @if (t.status === 'done') {
                        <span class="text-emerald-500">&#10003;</span>
                      } @else {
                        <span class="text-th-text-3">&#9675;</span>
                      }
                      <span [class.line-through]="t.status === 'done'" [class.text-th-text-3]="t.status === 'done'">{{ t.title }}</span>
                      @if (t.assigned_to) {
                        <span class="text-xs text-th-text-3 ml-auto">{{ t.assigned_to }}</span>
                      }
                      <span class="px-1.5 py-0.5 rounded text-[10px]"
                            [class]="t.priority === 'critical' ? 'bg-red-100 text-red-700' : t.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'">
                        {{ t.priority }}
                      </span>
                    </div>
                  }
                </div>
              }
            }
          </div>
        }
      }
    }
  `,
})
export class WorkspaceProjectsComponent implements OnInit {
  private api = inject(ClientApiService);

  loading = signal(true);
  detailLoading = signal(false);
  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);
  milestones = signal<Milestone[]>([]);
  tasks = signal<Task[]>([]);

  ngOnInit() {
    this.api.getProjects().subscribe({
      next: (r) => { this.projects.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  selectProject(p: Project) {
    this.selectedProject.set(p);
    this.detailLoading.set(true);
    this.api.getProject(p.id).subscribe({
      next: (r) => {
        this.milestones.set(r.milestones);
        this.tasks.set(r.tasks);
        this.detailLoading.set(false);
      },
      error: () => this.detailLoading.set(false),
    });
  }

  formatStatus(s: string): string {
    return s?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '-';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      planning: 'bg-slate-100 text-slate-700',
      active: 'bg-blue-50 text-blue-700',
      on_hold: 'bg-amber-50 text-amber-700',
      completed: 'bg-emerald-50 text-emerald-700',
      cancelled: 'bg-red-50 text-red-700',
      pending: 'bg-slate-100 text-slate-700',
      in_progress: 'bg-blue-50 text-blue-700',
      overdue: 'bg-red-50 text-red-700',
    };
    return map[status] || 'bg-gray-50 text-gray-700';
  }
}
