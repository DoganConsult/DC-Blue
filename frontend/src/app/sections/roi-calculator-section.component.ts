import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-roi-calculator-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="py-20 px-4 bg-gradient-to-b from-th-card to-th-bg-alt">
      <div class="container mx-auto max-w-7xl">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
            <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h1a1 1 0 100-2c-1.654 0-3 1.346-3 3v7a3 3 0 106 0v-3a1 1 0 10-2 0v3a1 1 0 11-2 0v-7a3 3 0 00-3-3z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm font-medium text-emerald-700">{{ i18n.t('ROI Calculator', 'حاسبة العائد على الاستثمار') }}</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
            {{ i18n.t('Calculate Your Digital Transformation ROI', 'احسب عائد الاستثمار للتحول الرقمي') }}
          </h2>
          <p class="text-lg text-th-text-2 max-w-3xl mx-auto">
            {{ i18n.t(
              'Estimate the potential savings and efficiency gains from modernizing your ICT infrastructure',
              'قدّر المدخرات المحتملة ومكاسب الكفاءة من تحديث البنية التحتية لتقنية المعلومات'
            ) }}
          </p>
        </div>

        <div class="bg-th-card rounded-3xl shadow-xl overflow-hidden">
          <div class="grid md:grid-cols-2">
            <!-- Input Section -->
            <div class="p-8 md:p-12 bg-th-bg-alt">
              <h3 class="text-2xl font-bold text-brand-dark mb-8">
                {{ i18n.t('Your Current Environment', 'بيئتك الحالية') }}
              </h3>

              <div class="space-y-6">
                <!-- Company Size -->
                <div>
                  <label class="block text-sm font-semibold text-th-text-2 mb-2">
                    {{ i18n.t('Number of Employees', 'عدد الموظفين') }}
                  </label>
                  <input
                    type="range"
                    [(ngModel)]="employees"
                    min="100"
                    max="10000"
                    step="100"
                    class="w-full"
                  >
                  <div class="flex justify-between text-xs text-th-text-3 mt-1">
                    <span>100</span>
                    <span class="text-lg font-bold text-primary">{{ employees().toLocaleString() }}</span>
                    <span>10,000+</span>
                  </div>
                </div>

                <!-- Current IT Spend -->
                <div>
                  <label class="block text-sm font-semibold text-th-text-2 mb-2">
                    {{ i18n.t('Annual IT Budget (SAR)', 'ميزانية تقنية المعلومات السنوية (ريال)') }}
                  </label>
                  <input
                    type="range"
                    [(ngModel)]="itBudget"
                    min="1000000"
                    max="50000000"
                    step="500000"
                    class="w-full"
                  >
                  <div class="flex justify-between text-xs text-th-text-3 mt-1">
                    <span>1M</span>
                    <span class="text-lg font-bold text-primary">{{ (itBudget() / 1000000).toFixed(1) }}M</span>
                    <span>50M+</span>
                  </div>
                </div>

                <!-- Service Selection -->
                <div>
                  <label class="block text-sm font-semibold text-th-text-2 mb-3">
                    {{ i18n.t('Services Needed', 'الخدمات المطلوبة') }}
                  </label>
                  <div class="space-y-2">
                    <label *ngFor="let service of services" class="flex items-center gap-3 p-3 rounded-lg border border-th-border hover:bg-th-bg-alt cursor-pointer">
                      <input
                        type="checkbox"
                        [(ngModel)]="service.selected"
                        (ngModelChange)="calculate()"
                        class="w-4 h-4 text-primary rounded"
                      >
                      <div class="flex-1">
                        <span class="font-medium text-th-text">{{ i18n.t(service.name.en, service.name.ar) }}</span>
                        <span class="block text-xs text-th-text-3">{{ i18n.t(service.impact.en, service.impact.ar) }}</span>
                      </div>
                      <span class="text-sm font-medium text-emerald-600">{{ service.savings }}%</span>
                    </label>
                  </div>
                </div>

                <!-- Timeline -->
                <div>
                  <label class="block text-sm font-semibold text-th-text-2 mb-2">
                    {{ i18n.t('Implementation Timeline', 'الجدول الزمني للتنفيذ') }}
                  </label>
                  <select
                    [(ngModel)]="timeline"
                    (ngModelChange)="calculate()"
                    class="w-full px-4 py-2 border border-th-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="3">{{ i18n.t('3 Months', '3 أشهر') }}</option>
                    <option value="6">{{ i18n.t('6 Months', '6 أشهر') }}</option>
                    <option value="12">{{ i18n.t('12 Months', '12 شهر') }}</option>
                    <option value="24">{{ i18n.t('24 Months', '24 شهر') }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Results Section -->
            <div class="p-8 md:p-12 bg-gradient-to-br from-primary to-cyan-500 text-white">
              <h3 class="text-2xl font-bold mb-8">
                {{ i18n.t('Your Projected ROI', 'عائد الاستثمار المتوقع') }}
              </h3>

              <!-- Key Metrics -->
              <div class="space-y-6 mb-8">
                <div class="bg-th-card/10 backdrop-blur rounded-xl p-6">
                  <div class="text-sm text-sky-200 mb-2">{{ i18n.t('Annual Savings', 'المدخرات السنوية') }}</div>
                  <div class="text-4xl font-bold">SAR {{ annualSavings().toLocaleString() }}</div>
                  <div class="text-sm text-emerald-300 mt-2">↓ {{ savingsPercentage() }}% reduction</div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-th-card/10 backdrop-blur rounded-xl p-4">
                    <div class="text-xs text-sky-200 mb-1">{{ i18n.t('ROI', 'العائد على الاستثمار') }}</div>
                    <div class="text-2xl font-bold">{{ roiPercentage() }}%</div>
                  </div>
                  <div class="bg-th-card/10 backdrop-blur rounded-xl p-4">
                    <div class="text-xs text-sky-200 mb-1">{{ i18n.t('Payback Period', 'فترة الاسترداد') }}</div>
                    <div class="text-2xl font-bold">{{ paybackPeriod() }} {{ i18n.t('months', 'شهر') }}</div>
                  </div>
                </div>
              </div>

              <!-- Breakdown -->
              <div class="space-y-4 mb-8">
                <h4 class="text-sm font-semibold text-sky-200 uppercase tracking-wider">
                  {{ i18n.t('Savings Breakdown', 'تفصيل المدخرات') }}
                </h4>
                <div *ngFor="let item of savingsBreakdown()" class="flex items-center justify-between">
                  <span class="text-sm text-sky-100">{{ i18n.t(item.category.en, item.category.ar) }}</span>
                  <span class="font-bold">SAR {{ item.amount.toLocaleString() }}</span>
                </div>
              </div>

              <!-- Additional Benefits -->
              <div class="bg-th-card/10 backdrop-blur rounded-xl p-6 mb-8">
                <h4 class="text-sm font-semibold mb-4">{{ i18n.t('Additional Benefits', 'الفوائد الإضافية') }}</h4>
                <ul class="space-y-2 text-sm text-sky-100">
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    {{ i18n.t('Improved security posture', 'تحسين الوضع الأمني') }}
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    {{ i18n.t('Enhanced employee productivity', 'تعزيز إنتاجية الموظفين') }}
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    {{ i18n.t('Regulatory compliance', 'الامتثال التنظيمي') }}
                  </li>
                </ul>
              </div>

              <!-- CTA -->
              <button class="w-full py-4 bg-th-card text-primary rounded-xl font-semibold hover:bg-sky-50 transition-all transform hover:scale-105">
                {{ i18n.t('Get Detailed Assessment', 'احصل على تقييم مفصل') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Disclaimer -->
        <p class="text-center text-sm text-th-text-3 mt-8">
          {{ i18n.t(
            'These estimates are based on industry averages. Actual savings may vary based on your specific environment and requirements.',
            'هذه التقديرات مبنية على متوسطات الصناعة. قد تختلف المدخرات الفعلية بناءً على بيئتك ومتطلباتك المحددة.'
          ) }}
        </p>
      </div>
    </section>
  `,
  styles: []
})
export class RoiCalculatorSectionComponent {
  i18n = inject(I18nService);

  employees = signal(1000);
  itBudget = signal(5000000);
  timeline = signal(12);

  services = [
    {
      name: { en: 'Cloud Migration', ar: 'الترحيل السحابي' },
      impact: { en: 'Reduce infrastructure costs', ar: 'تقليل تكاليف البنية التحتية' },
      savings: 35,
      selected: true
    },
    {
      name: { en: 'Security Enhancement', ar: 'تعزيز الأمان' },
      impact: { en: 'Prevent breach costs', ar: 'منع تكاليف الاختراق' },
      savings: 45,
      selected: false
    },
    {
      name: { en: 'Process Automation', ar: 'أتمتة العمليات' },
      impact: { en: 'Increase efficiency', ar: 'زيادة الكفاءة' },
      savings: 30,
      selected: false
    },
    {
      name: { en: 'Data Analytics', ar: 'تحليلات البيانات' },
      impact: { en: 'Better decision making', ar: 'اتخاذ قرارات أفضل' },
      savings: 25,
      selected: false
    }
  ];

  calculate() {
    // Trigger recalculation
  }

  annualSavings(): number {
    const selectedServices = this.services.filter(s => s.selected);
    if (selectedServices.length === 0) return 0;

    const avgSavings = selectedServices.reduce((acc, s) => acc + s.savings, 0) / selectedServices.length;
    return Math.floor(this.itBudget() * (avgSavings / 100));
  }

  savingsPercentage(): number {
    const selectedServices = this.services.filter(s => s.selected);
    if (selectedServices.length === 0) return 0;
    return Math.floor(selectedServices.reduce((acc, s) => acc + s.savings, 0) / selectedServices.length);
  }

  roiPercentage(): number {
    if (this.annualSavings() === 0) return 0;
    const investmentCost = this.itBudget() * 0.3; // Assume 30% investment
    return Math.floor((this.annualSavings() / investmentCost) * 100);
  }

  paybackPeriod(): number {
    if (this.annualSavings() === 0) return 0;
    const investmentCost = this.itBudget() * 0.3;
    const monthlyBenefit = this.annualSavings() / 12;
    return Math.ceil(investmentCost / monthlyBenefit);
  }

  savingsBreakdown() {
    const base = this.annualSavings();
    if (base === 0) return [];

    return [
      { category: { en: 'Operational Efficiency', ar: 'الكفاءة التشغيلية' }, amount: Math.floor(base * 0.4) },
      { category: { en: 'Infrastructure Costs', ar: 'تكاليف البنية التحتية' }, amount: Math.floor(base * 0.3) },
      { category: { en: 'Risk Mitigation', ar: 'تخفيف المخاطر' }, amount: Math.floor(base * 0.2) },
      { category: { en: 'Productivity Gains', ar: 'مكاسب الإنتاجية' }, amount: Math.floor(base * 0.1) }
    ];
  }
}