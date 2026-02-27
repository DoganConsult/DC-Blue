import { Component, input, inject, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LandingContent } from '../pages/landing.page';
import { I18nService } from '../core/services/i18n.service';
import { ChartFactoryService, CHART_COLORS } from '../core/services/chart-factory.service';
import { ChartModule } from 'primeng/chart';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-section',
  standalone: true,
  imports: [ChartModule],
  template: `
    <section class="py-24 px-4 bg-gray-50">
      <div class="container mx-auto max-w-7xl">
        <div class="text-center mb-16">
          <span class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">Analytics</span>
          <h2 class="text-4xl font-bold text-brand-dark mb-4">
            {{ i18n.lang() === 'ar' ? 'بيانات الأداء والامتثال' : 'Performance & Compliance Analytics' }}
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            {{ i18n.lang() === 'ar' ? 'رؤى في الوقت الفعلي عبر التسليم والأمان وإنترنت الأشياء والامتثال' : 'Real-time insights across delivery, security, IoT, and compliance posture.' }}
          </p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="font-semibold text-gray-900 mb-1">{{ i18n.t('Project Delivery Rate', 'معدل إنجاز المشاريع') }}</h3>
            <p class="text-gray-500 text-xs mb-4">{{ i18n.t('Quarterly on-time delivery performance', 'أداء التسليم في الوقت المحدد ربع سنويًا') }}</p>
            <p-chart type="bar" [data]="chartData()" [options]="chartOptions" height="260" />
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="font-semibold text-gray-900 mb-1">{{ i18n.t('Cybersecurity Posture', 'وضع الأمن السيبراني') }}</h3>
            <p class="text-gray-500 text-xs mb-4">{{ i18n.t('Threats blocked & incident response time trend', 'التهديدات المحظورة واتجاه زمن الاستجابة') }}</p>
            <p-chart type="line" [data]="securityData" [options]="lineOptions" height="260" />
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="font-semibold text-gray-900 mb-1">{{ i18n.t('IoT Device Growth — KSA', 'نمو أجهزة إنترنت الأشياء — المملكة') }}</h3>
            <p class="text-gray-500 text-xs mb-4">{{ i18n.t('Connected devices across healthcare, industrial & smart city', 'الأجهزة المتصلة عبر الرعاية الصحية والصناعة والمدينة الذكية') }}</p>
            <p-chart type="bar" [data]="iotData" [options]="stackedOptions" height="260" />
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="font-semibold text-gray-900 mb-1">{{ i18n.t('Compliance Scores', 'درجات الامتثال') }}</h3>
            <p class="text-gray-500 text-xs mb-4">{{ i18n.t('Framework compliance across client portfolio', 'امتثال الأطر عبر محفظة العملاء') }}</p>
            <p-chart type="radar" [data]="complianceData" [options]="radarOptions" height="260" />
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ChartSectionComponent implements OnInit, OnChanges {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);
  chartFactory = inject(ChartFactoryService);
  chartData = signal(this.chartFactory.createBarChartData([], []));
  chartOptions = { ...this.chartFactory.barOptions(), plugins: { legend: { display: false } } };
  lineOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 11 } } } }, scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } } };
  stackedOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 11 } } } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: '#f1f5f9' } } } };
  radarOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20, font: { size: 10 } }, grid: { color: '#e2e8f0' }, pointLabels: { font: { size: 11 } } } } };

  securityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { label: 'Threats Blocked (K)', data: [32, 35, 38, 42, 40, 45, 43, 48, 46, 50, 47, 52], borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 },
      { label: 'MTTR (min)', data: [12, 11, 9.5, 8, 7.5, 6, 5.8, 5.2, 4.8, 4.5, 4.2, 3.8], borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 },
    ],
  };

  iotData = {
    labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
    datasets: [
      { label: 'Healthcare IoT', data: [800, 1200, 2100, 3200, 4800, 6400], backgroundColor: '#0EA5E9' },
      { label: 'Industrial IoT', data: [2400, 3800, 5600, 8200, 11400, 14200], backgroundColor: '#F59E0B' },
      { label: 'Smart City', data: [1200, 4500, 12000, 48000, 142000, 284000], backgroundColor: '#14B8A6' },
    ],
  };

  complianceData = {
    labels: ['NCA-ECC', 'ISO 27001', 'CBAHI', 'HIMSS', 'PDPL', 'NDMO'],
    datasets: [{ label: 'Compliance %', data: [96, 94, 92, 88, 91, 95], backgroundColor: 'rgba(14,165,233,0.2)', borderColor: '#0EA5E9', pointBackgroundColor: '#0EA5E9', pointBorderColor: '#fff' }],
  };

  ngOnInit(): void { this.updateChart(); }
  ngOnChanges(changes: SimpleChanges): void { if (changes['content']) this.updateChart(); }

  private updateChart(): void {
    const c = this.content();
    if (!c?.chartData) return;
    this.chartData.set(
      this.chartFactory.createBarChartData(c.chartData.labels, c.chartData.values, {
        datasetLabel: 'Score',
        colors: [CHART_COLORS.primary],
      })
    );
  }
}
