import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';

interface TrainingCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  duration_minutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url: string;
  content_url: string;
  sort_order: number;
}

interface TrainingProgress {
  course_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_pct: number;
  completed_at: string | null;
}

@Component({
  selector: 'app-partner-training',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <svg class="animate-spin h-6 w-6 text-th-text-3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      </div>
    } @else {
      <!-- Progress Overview -->
      <div class="bg-th-card border border-th-border rounded-xl p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-bold text-th-text">{{ i18n.t('Training Center', 'مركز التدريب') }}</h2>
            <p class="text-sm text-th-text-3 mt-0.5">{{ i18n.t('Build your expertise and earn certifications', 'بناء خبرتك والحصول على الشهادات') }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-th-text">{{ completedCount() }} / {{ courses().length }}</p>
            <p class="text-xs text-th-text-3">{{ i18n.t('courses completed', 'دورات مكتملة') }}</p>
          </div>
        </div>
        <div class="h-2.5 bg-th-bg-tert rounded-full overflow-hidden">
          <div class="h-full bg-blue-500 rounded-full transition-all"
               [style.width.%]="courses().length > 0 ? (completedCount() / courses().length) * 100 : 0"></div>
        </div>
      </div>

      <!-- Category Filters -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-1">
        @for (cat of categories; track cat.key) {
          <button (click)="activeCategory.set(cat.key)"
                  class="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition border"
                  [class.bg-primary]="activeCategory() === cat.key"
                  [class.text-white]="activeCategory() === cat.key"
                  [class.border-primary]="activeCategory() === cat.key"
                  [class.bg-th-card]="activeCategory() !== cat.key"
                  [class.text-th-text-2]="activeCategory() !== cat.key"
                  [class.border-th-border]="activeCategory() !== cat.key">
            {{ i18n.t(cat.en, cat.ar) }}
          </button>
        }
      </div>

      <!-- Course Grid -->
      @if (filteredCourses().length === 0) {
        <div class="bg-th-card border border-th-border rounded-xl p-12 text-center">
          <span class="text-4xl">📚</span>
          <p class="text-th-text-3 mt-3 text-sm">{{ i18n.t('No courses available in this category yet.', 'لا توجد دورات متاحة في هذه الفئة بعد.') }}</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (course of filteredCourses(); track course.id) {
            <div class="bg-th-card border border-th-border rounded-xl overflow-hidden hover:shadow-md transition group">
              <!-- Thumbnail -->
              <div class="h-36 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative">
                <span class="text-4xl">{{ getCategoryIcon(course.category) }}</span>
                @if (getProgress(course.id).status === 'completed') {
                  <div class="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {{ i18n.t('Completed', 'مكتمل') }}
                  </div>
                } @else if (getProgress(course.id).status === 'in_progress') {
                  <div class="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {{ getProgress(course.id).progress_pct }}%
                  </div>
                }
                <div class="absolute bottom-2 left-2">
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full" [class]="difficultyClass(course.difficulty)">
                    {{ course.difficulty }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-4">
                <h3 class="text-sm font-semibold text-th-text mb-1 line-clamp-2">{{ course.title }}</h3>
                <p class="text-xs text-th-text-3 line-clamp-2 mb-3">{{ course.description }}</p>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 text-xs text-th-text-3">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {{ course.duration_minutes }} {{ i18n.t('min', 'دقيقة') }}
                  </div>
                  <button (click)="startCourse(course)"
                          class="text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                          [class.bg-primary]="getProgress(course.id).status !== 'completed'"
                          [class.text-white]="getProgress(course.id).status !== 'completed'"
                          [class.hover:bg-primary-dark]="getProgress(course.id).status !== 'completed'"
                          [class.bg-emerald-50]="getProgress(course.id).status === 'completed'"
                          [class.text-emerald-700]="getProgress(course.id).status === 'completed'">
                    @switch (getProgress(course.id).status) {
                      @case ('completed') { {{ i18n.t('Review', 'مراجعة') }} }
                      @case ('in_progress') { {{ i18n.t('Continue', 'متابعة') }} }
                      @default { {{ i18n.t('Start', 'ابدأ') }} }
                    }
                  </button>
                </div>

                <!-- Progress Bar -->
                @if (getProgress(course.id).status === 'in_progress') {
                  <div class="h-1 bg-th-bg-tert rounded-full mt-3 overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full transition-all" [style.width.%]="getProgress(course.id).progress_pct"></div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    }
  `,
})
export class PartnerTrainingComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  courses = signal<TrainingCourse[]>([]);
  progressMap = signal<Record<number, TrainingProgress>>({});
  loading = signal(false);
  activeCategory = signal('all');

  readonly categories = [
    { key: 'all', en: 'All', ar: 'الكل' },
    { key: 'platform', en: 'Platform', ar: 'المنصة' },
    { key: 'sales', en: 'Sales', ar: 'المبيعات' },
    { key: 'technical', en: 'Technical', ar: 'تقني' },
    { key: 'compliance', en: 'Compliance', ar: 'الامتثال' },
  ];

  filteredCourses = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.courses();
    return this.courses().filter(c => c.category === cat);
  });

  completedCount = computed(() => {
    const map = this.progressMap();
    return Object.values(map).filter(p => p.status === 'completed').length;
  });

  ngOnInit() {
    this.loading.set(true);
    this.api.getTraining().subscribe({
      next: (res: any) => {
        this.courses.set(res.courses || []);
        const map: Record<number, TrainingProgress> = {};
        (res.progress || []).forEach((p: TrainingProgress) => { map[p.course_id] = p; });
        this.progressMap.set(map);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getProgress(courseId: number): TrainingProgress {
    return this.progressMap()[courseId] || { course_id: courseId, status: 'not_started', progress_pct: 0, completed_at: null };
  }

  startCourse(course: TrainingCourse) {
    if (course.content_url) {
      window.open(course.content_url, '_blank');
    }
    // Mark as in_progress if not started
    const current = this.getProgress(course.id);
    if (current.status === 'not_started') {
      this.api.updateTrainingProgress(course.id, 'in_progress', 10).subscribe({
        next: () => {
          const map = { ...this.progressMap() };
          map[course.id] = { course_id: course.id, status: 'in_progress', progress_pct: 10, completed_at: null };
          this.progressMap.set(map);
        },
      });
    }
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      platform: '💻', sales: '📈', technical: '⚙️', compliance: '📋',
    };
    return icons[category] || '📚';
  }

  difficultyClass(level: string): string {
    const map: Record<string, string> = {
      beginner: 'bg-emerald-100 text-emerald-700',
      intermediate: 'bg-amber-100 text-amber-700',
      advanced: 'bg-red-100 text-red-700',
    };
    return map[level] || 'bg-th-bg-tert text-th-text-2';
  }
}
