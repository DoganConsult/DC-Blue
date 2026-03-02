import { Component, inject, signal, computed, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerApiService } from '../../../core/services/partner-api.service';

interface OnboardingStep {
  key: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
}

@Component({
  selector: 'app-partner-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-th-bg-inv/50 z-50 flex items-center justify-center p-4" (click)="dismiss.emit()">
      <div class="bg-th-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="px-8 pt-8 pb-4">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-bold text-th-text">{{ i18n.t('Welcome to Dogan Consult', 'مرحباً في دوغان للاستشارات') }}</h2>
              <p class="text-sm text-th-text-3 mt-0.5">{{ i18n.t('Let\\'s set up your partner account', 'دعنا نقوم بإعداد حساب الشراكة الخاص بك') }}</p>
            </div>
            <button (click)="dismiss.emit()" class="text-th-text-3 hover:text-th-text-2 p-1">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Step Indicator -->
          <div class="flex items-center gap-0 mb-8">
            @for (step of steps; track step.key; let i = $index; let last = $last) {
              <div class="flex items-center" [class.flex-1]="!last">
                <div class="flex flex-col items-center">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all"
                       [class.border-blue-600]="i <= currentStep()"
                       [class.bg-primary]="i < currentStep()"
                       [class.text-white]="i < currentStep()"
                       [class.text-primary]="i === currentStep()"
                       [class.border-th-border]="i > currentStep()"
                       [class.text-th-text-3]="i > currentStep()">
                    @if (i < currentStep()) {
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    } @else {
                      {{ step.icon }}
                    }
                  </div>
                </div>
                @if (!last) {
                  <div class="flex-1 h-0.5 mx-2" [class.bg-primary]="i < currentStep()" [class.bg-th-bg-tert]="i >= currentStep()"></div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Step Content -->
        <div class="px-8 pb-8">
          @switch (currentStep()) {
            @case (0) {
              <!-- Step 1: Welcome & Overview -->
              <div class="text-center py-4">
                <span class="text-5xl">🤝</span>
                <h3 class="text-lg font-bold text-th-text mt-4 mb-2">{{ i18n.t('Partner Program Overview', 'نظرة عامة على برنامج الشراكة') }}</h3>
                <p class="text-sm text-th-text-3 max-w-md mx-auto leading-relaxed">
                  {{ i18n.t('As a Dogan Consult partner, you can refer leads, track their progress through our pipeline, and earn commissions on closed deals. Here\\'s how it works:', 'كشريك لدوغان للاستشارات، يمكنك إحالة العملاء وتتبع تقدمهم ولامع وكسب عمولات على الصفقات المغلقة. إليك كيف يعمل:') }}
                </p>
                <div class="grid grid-cols-3 gap-4 mt-6">
                  <div class="bg-blue-50 rounded-xl p-4">
                    <span class="text-2xl">📤</span>
                    <p class="text-xs font-semibold text-th-text mt-2">{{ i18n.t('Submit Leads', 'إرسال العملاء') }}</p>
                  </div>
                  <div class="bg-emerald-50 rounded-xl p-4">
                    <span class="text-2xl">📊</span>
                    <p class="text-xs font-semibold text-th-text mt-2">{{ i18n.t('Track Pipeline', 'تتبع الأنابيب') }}</p>
                  </div>
                  <div class="bg-amber-50 rounded-xl p-4">
                    <span class="text-2xl">💰</span>
                    <p class="text-xs font-semibold text-th-text mt-2">{{ i18n.t('Earn Commission', 'اكسب العمولة') }}</p>
                  </div>
                </div>
              </div>
            }

            @case (1) {
              <!-- Step 2: Company Details -->
              <h3 class="text-lg font-bold text-th-text mb-4">{{ i18n.t('Company Details', 'تفاصيل الشركة') }}</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('Website', 'الموقع') }}</label>
                  <input [(ngModel)]="profileData.company_website" type="url" placeholder="https://..."
                         class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('City', 'المدينة') }}</label>
                    <input [(ngModel)]="profileData.city"
                           class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('Country', 'الدولة') }}</label>
                    <select [(ngModel)]="profileData.country"
                            class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="SA">{{ i18n.t('Saudi Arabia', 'السعودية') }}</option>
                      <option value="AE">{{ i18n.t('UAE', 'الإمارات') }}</option>
                      <option value="EG">{{ i18n.t('Egypt', 'مصر') }}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-th-text-3 mb-1">{{ i18n.t('Short Bio', 'نبذة مختصرة') }}</label>
                  <textarea [(ngModel)]="profileData.bio" rows="2"
                            [placeholder]="i18n.t('Tell us about your company and expertise...', 'أخبرنا عن شركتك وخبراتك...')"
                            class="w-full bg-th-bg-alt border border-th-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
                </div>
              </div>
            }

            @case (2) {
              <!-- Step 3: Specializations -->
              <h3 class="text-lg font-bold text-th-text mb-2">{{ i18n.t('Your Specializations', 'تخصصاتك') }}</h3>
              <p class="text-sm text-th-text-3 mb-4">{{ i18n.t('Select the areas where you have expertise', 'اختر المجالات التي لديك خبرة فيها') }}</p>
              <div class="grid grid-cols-2 gap-3">
                @for (spec of specializations; track spec.key) {
                  <button (click)="toggleSpec(spec.key)"
                          class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left"
                          [class.border-primary]="selectedSpecs().has(spec.key)"
                          [class.bg-blue-50]="selectedSpecs().has(spec.key)"
                          [class.border-th-border]="!selectedSpecs().has(spec.key)">
                    <span class="text-lg">{{ spec.icon }}</span>
                    <span class="text-sm font-medium" [class.text-blue-700]="selectedSpecs().has(spec.key)" [class.text-th-text-2]="!selectedSpecs().has(spec.key)">
                      {{ i18n.t(spec.en, spec.ar) }}
                    </span>
                  </button>
                }
              </div>
            }

            @case (3) {
              <!-- Step 4: API Key & Getting Started -->
              <div class="text-center py-4">
                <span class="text-5xl">🎉</span>
                <h3 class="text-lg font-bold text-th-text mt-4 mb-2">{{ i18n.t('You\\'re All Set!', 'أنت جاهز!') }}</h3>
                <p class="text-sm text-th-text-3 max-w-md mx-auto mb-6">
                  {{ i18n.t('Your partner portal is ready. Here are some quick tips to get started:', 'بوابة الشراكة جاهزة. إليك بعض النصائح السريعة للبدء:') }}
                </p>
                <div class="space-y-3 text-left max-w-sm mx-auto">
                  <div class="flex items-start gap-3 bg-th-bg-alt rounded-lg p-3">
                    <span class="text-primary font-bold text-sm mt-0.5">1</span>
                    <p class="text-sm text-th-text-2">{{ i18n.t('Submit your first lead using the button in the top right', 'أرسل أول عميل محتمل باستخدام الزر في أعلى اليمين') }}</p>
                  </div>
                  <div class="flex items-start gap-3 bg-th-bg-alt rounded-lg p-3">
                    <span class="text-primary font-bold text-sm mt-0.5">2</span>
                    <p class="text-sm text-th-text-2">{{ i18n.t('Track progress in the Pipeline tab', 'تتبع التقدم في تبويب الأنابيب') }}</p>
                  </div>
                  <div class="flex items-start gap-3 bg-th-bg-alt rounded-lg p-3">
                    <span class="text-primary font-bold text-sm mt-0.5">3</span>
                    <p class="text-sm text-th-text-2">{{ i18n.t('View commissions as deals close', 'عرض العمولات عند إغلاق الصفقات') }}</p>
                  </div>
                </div>
              </div>
            }
          }

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between mt-8 pt-6 border-t border-th-border-lt">
            @if (currentStep() > 0) {
              <button (click)="prev()" class="px-4 py-2 text-sm font-medium text-th-text-2 hover:text-th-text transition">
                {{ i18n.t('Back', 'رجوع') }}
              </button>
            } @else {
              <div></div>
            }
            @if (currentStep() < steps.length - 1) {
              <button (click)="next()" class="px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition">
                {{ i18n.t('Continue', 'متابعة') }}
              </button>
            } @else {
              <button (click)="complete()" [disabled]="saving()"
                      class="px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/80 transition disabled:opacity-50">
                {{ i18n.t('Get Started', 'ابدأ الآن') }}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PartnerOnboardingComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(PartnerApiService);

  dismiss = output<void>();
  currentStep = signal(0);
  saving = signal(false);
  selectedSpecs = signal(new Set<string>());

  profileData: any = { company_website: '', city: '', country: 'SA', bio: '' };

  readonly steps: OnboardingStep[] = [
    { key: 'welcome', title: { en: 'Welcome', ar: 'مرحباً' }, description: { en: 'Overview', ar: 'نظرة عامة' }, icon: '👋' },
    { key: 'company', title: { en: 'Company', ar: 'الشركة' }, description: { en: 'Details', ar: 'التفاصيل' }, icon: '🏢' },
    { key: 'specializations', title: { en: 'Skills', ar: 'المهارات' }, description: { en: 'Expertise', ar: 'الخبرات' }, icon: '⚡' },
    { key: 'ready', title: { en: 'Ready', ar: 'جاهز' }, description: { en: 'Get started', ar: 'ابدأ' }, icon: '🚀' },
  ];

  readonly specializations = [
    { key: 'network', en: 'Network & DC', ar: 'الشبكات ومراكز البيانات', icon: '🌐' },
    { key: 'security', en: 'Cybersecurity', ar: 'الأمن السيبراني', icon: '🔒' },
    { key: 'cloud', en: 'Cloud & DevOps', ar: 'السحابة و DevOps', icon: '☁️' },
    { key: 'integration', en: 'Systems Integration', ar: 'تكامل الأنظمة', icon: '🔗' },
    { key: 'erp', en: 'ERP & Business Apps', ar: 'تطبيقات الأعمال', icon: '📊' },
    { key: 'compliance', en: 'GRC & Compliance', ar: 'الامتثال والحوكمة', icon: '📋' },
  ];

  ngOnInit() {
    this.api.getProfile().subscribe({
      next: p => {
        this.profileData.company_website = p.company_website || '';
        this.profileData.city = p.city || '';
        this.profileData.country = p.country || 'SA';
        this.profileData.bio = p.bio || '';
        if (p.specializations?.length) {
          this.selectedSpecs.set(new Set(p.specializations));
        }
      },
    });
  }

  next() { this.currentStep.update(s => Math.min(s + 1, this.steps.length - 1)); this.saveStep(); }
  prev() { this.currentStep.update(s => Math.max(s - 1, 0)); }

  toggleSpec(key: string) {
    const current = new Set(this.selectedSpecs());
    if (current.has(key)) current.delete(key); else current.add(key);
    this.selectedSpecs.set(current);
  }

  private saveStep() {
    this.api.updateOnboarding(this.currentStep(), false).subscribe();
    if (this.currentStep() >= 2) {
      this.api.updateProfile({
        ...this.profileData,
        specializations: Array.from(this.selectedSpecs()),
      } as any).subscribe();
    }
  }

  complete() {
    this.saving.set(true);
    this.api.updateProfile({
      ...this.profileData,
      specializations: Array.from(this.selectedSpecs()),
    } as any).subscribe();
    this.api.updateOnboarding(this.steps.length, true).subscribe({
      next: () => { this.saving.set(false); this.dismiss.emit(); },
      error: () => { this.saving.set(false); this.dismiss.emit(); },
    });
  }
}
