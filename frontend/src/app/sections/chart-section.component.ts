import { Component, OnInit, OnChanges, SimpleChanges, inject, input, signal } from '@angular/core';
import { LandingContent } from '../core/models/landing.model';
import { I18nService } from '../core/services/i18n.service';
import { ChartFactoryService, CHART_COLORS } from '../core/services/chart-factory.service';
import { ChartModule } from 'primeng/chart';
import { Chart, registerables } from 'chart.js';
import { COLOR_PALETTE, CHART_THEME, KPI_COLORS } from '../core/data/page-styles';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-section',
  standalone: true,
  imports: [ChartModule],
  template: `
    <section class="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-brand-darker via-surface-dark to-brand-darker">
      <div class="absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(circle at 1px 1px, rgba(56,189,248,0.3) 1px, transparent 0); background-size: 32px 32px;"></div>
      <div class="absolute top-0 left-1/4 w-full max-w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-full max-w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>

      <div class="container mx-auto max-w-7xl relative z-10">

        <div class="text-center mb-16">
          <p class="text-[13px] font-semibold text-sky-400 tracking-widest uppercase mb-4">{{ i18n.t('Track Record', 'سجل الإنجازات') }}</p>
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
            {{ i18n.t('Proven Results, Measured Impact', 'نتائج مثبتة، أثر قابل للقياس') }}
          </h2>
          <p class="text-th-text-3 text-base max-w-2xl mx-auto leading-relaxed">
            {{ i18n.t('Transparent performance metrics from 15+ years delivering enterprise ICT across the Kingdom.', 'مقاييس أداء شفافة من أكثر من 15 عامًا في تقديم حلول تقنية المعلومات للمؤسسات في المملكة.') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          @for (kpi of kpis; track kpi.label) {
            <div class="group relative rounded-2xl border border-th-border-dk bg-th-card backdrop-blur-sm p-6 hover:border-sky-500/30 transition-all duration-300">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" [style.background]="kpi.iconBg">
                  <svg class="w-5 h-5" [style.color]="kpi.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="kpi.icon" />
                  </svg>
                </div>
                <div class="text-3xl lg:text-4xl font-bold tracking-tight mb-1" [style.color]="kpi.valueColor">{{ kpi.value }}</div>
                <div class="text-sm text-th-text-3">{{ i18n.t(kpi.label, kpi.labelAr) }}</div>
                <div class="flex items-center gap-1 mt-2">
                  <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                  </svg>
                  <span class="text-xs text-emerald-400 font-medium">{{ kpi.trend }}</span>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          <div class="lg:col-span-8 chart-panel advanced-widget-card">
            <div class="chart-panel-header">
              <div>
                <h3 class="text-[15px] font-semibold text-white">{{ i18n.t('Project Delivery Performance', 'أداء تسليم المشاريع') }}</h3>
                <p class="text-[12px] text-th-text-3 mt-0.5">{{ i18n.t('On-time delivery rate by quarter — last 2 years', 'معدل التسليم في الوقت المحدد حسب الربع — آخر سنتين') }}</p>
              </div>
              <div class="flex items-center gap-4 text-[11px] text-th-text-3">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-sky-500/80"></span>{{ i18n.t('On-Time', 'في الوقت') }}</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-500/80"></span>{{ i18n.t('Target', 'المستهدف') }}</span>
              </div>
            </div>
            <div class="p-6">
              <p-chart type="bar" [data]="deliveryData" [options]="barOptions" height="300" />
            </div>
          </div>

          <div class="lg:col-span-4 chart-panel advanced-widget-card">
            <div class="chart-panel-header">
              <div>
                <h3 class="text-[15px] font-semibold text-white">{{ i18n.t('Industry Coverage', 'التغطية القطاعية') }}</h3>
                <p class="text-[12px] text-th-text-3 mt-0.5">{{ i18n.t('Projects by sector', 'المشاريع حسب القطاع') }}</p>
              </div>
            </div>
            <div class="p-6">
              <p-chart type="doughnut" [data]="industryData" [options]="doughnutOptions" height="300" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-5 chart-panel advanced-widget-card">
            <div class="chart-panel-header">
              <div>
                <h3 class="text-[15px] font-semibold text-white">{{ i18n.t('Client Satisfaction', 'رضا العملاء') }}</h3>
                <p class="text-[12px] text-th-text-3 mt-0.5">{{ i18n.t('Avg. score across 6 dimensions', 'متوسط التقييم عبر 6 أبعاد') }}</p>
              </div>
            </div>
            <div class="p-6">
              <p-chart type="radar" [data]="satisfactionData" [options]="radarOptions" height="300" />
            </div>
          </div>

          <div class="lg:col-span-7 chart-panel advanced-widget-card">
            <div class="chart-panel-header">
              <div>
                <h3 class="text-[15px] font-semibold text-white">{{ i18n.t('Engagement Growth', 'نمو المشاريع') }}</h3>
                <p class="text-[12px] text-th-text-3 mt-0.5">{{ i18n.t('Active engagements & new clients per year', 'المشاريع النشطة والعملاء الجدد سنوياً') }}</p>
              </div>
              <div class="flex items-center gap-4 text-[11px] text-th-text-3">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-1 rounded-full bg-sky-400"></span>{{ i18n.t('Engagements', 'المشاريع') }}</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-1 rounded-full bg-emerald-400"></span>{{ i18n.t('New Clients', 'عملاء جدد') }}</span>
              </div>
            </div>
            <div class="p-6">
              <p-chart type="line" [data]="growthData" [options]="lineOptions" height="300" />
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    :host ::ng-deep canvas {
      filter: drop-shadow(0 0 4px rgba(14, 165, 233, 0.08));
    }
    .chart-panel {
      border-radius: 1rem;
      border: 1px solid var(--border-dark, rgba(51, 65, 85, 0.4));
      background: color-mix(in srgb, var(--bg-inverse, #0f172a) 60%, transparent);
      backdrop-filter: blur(12px);
      overflow: hidden;
    }
    .chart-panel:hover {
      border-color: color-mix(in srgb, var(--color-primary, #38bdf8) 15%, transparent);
    }
    .chart-panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1.25rem 1.5rem 0;
    }
  `]
})
export class ChartSectionComponent implements OnInit, OnChanges {
  content = input<LandingContent | null>(null);
  i18n = inject(I18nService);
  chartFactory = inject(ChartFactoryService);
  chartData = signal<any>({ labels: [], datasets: [] });

  kpis = [
    {
      label: 'Projects Delivered', labelAr: 'مشاريع منجزة',
      value: '120+', trend: '+18 this year',
      icon: 'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6',
      iconBg: KPI_COLORS[0].iconBg, iconColor: KPI_COLORS[0].iconColor, valueColor: KPI_COLORS[0].valueColor,
    },
    {
      label: 'Client Retention', labelAr: 'الاحتفاظ بالعملاء',
      value: '96%', trend: '+4% vs last year',
      icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
      iconBg: KPI_COLORS[1].iconBg, iconColor: KPI_COLORS[1].iconColor, valueColor: KPI_COLORS[1].valueColor,
    },
    {
      label: 'Avg. Cost Savings', labelAr: 'متوسط التوفير',
      value: '32%', trend: 'Across all engagements',
      icon: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z',
      iconBg: KPI_COLORS[2].iconBg, iconColor: KPI_COLORS[2].iconColor, valueColor: KPI_COLORS[2].valueColor,
    },
    {
      label: 'On-Time Delivery', labelAr: 'التسليم في الوقت',
      value: '92%', trend: 'SLA commitment met',
      icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      iconBg: KPI_COLORS[3].iconBg, iconColor: KPI_COLORS[3].iconColor, valueColor: KPI_COLORS[3].valueColor,
    },
  ];

  deliveryData: any = {
    labels: ['Q1 \'24', 'Q2 \'24', 'Q3 \'24', 'Q4 \'24', 'Q1 \'25', 'Q2 \'25', 'Q3 \'25', 'Q4 \'25'],
    datasets: [
      {
        label: 'On-Time Delivery %',
        data: [88, 91, 87, 93, 90, 94, 89, 92],
        backgroundColor: COLOR_PALETTE.sky400.rgba50!,
        borderColor: COLOR_PALETTE.sky400.hex,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Target',
        data: [90, 90, 90, 90, 90, 90, 90, 90],
        type: 'line',
        borderColor: 'rgba(52,211,153,0.6)', // target line
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  industryData: any = {
    labels: [] as string[],
    datasets: [{
      data: [28, 22, 18, 15, 10, 7],
      backgroundColor: CHART_THEME.doughnutSegments,
      borderColor: CHART_THEME.darkBg,
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  satisfactionData: any = {
    labels: [] as string[],
    datasets: [{
      label: 'Client Score',
      data: [94, 91, 92, 88, 86, 93],
      backgroundColor: COLOR_PALETTE.sky400.rgba12!,
      borderColor: COLOR_PALETTE.sky400.hex,
      borderWidth: 2,
      pointBackgroundColor: COLOR_PALETTE.sky400.hex,
      pointBorderColor: CHART_THEME.darkBg,
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  };

  growthData: any = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Active Engagements',
        data: [12, 18, 24, 35, 48, 62, 78],
        borderColor: COLOR_PALETTE.sky400.hex,
        backgroundColor: COLOR_PALETTE.sky400.rgba08!,
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: COLOR_PALETTE.sky400.hex,
        pointBorderColor: CHART_THEME.darkBg,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'New Clients',
        data: [8, 11, 14, 19, 26, 31, 38],
        borderColor: COLOR_PALETTE.emerald400.hex,
        backgroundColor: COLOR_PALETTE.emerald400.rgba06!,
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: COLOR_PALETTE.emerald400.hex,
        pointBorderColor: CHART_THEME.darkBg,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  barOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: CHART_THEME.tooltip.backgroundColor, borderColor: CHART_THEME.tooltip.borderColor, borderWidth: CHART_THEME.tooltip.borderWidth, titleFont: { size: 12 }, bodyFont: { size: 12 }, padding: 12, cornerRadius: 8, callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw}%` } },
    },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: CHART_THEME.axis.gridColor, drawBorder: false }, ticks: { color: CHART_THEME.axis.tickColor, font: { size: 11 }, padding: 8, callback: (v: number) => v + '%' }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: CHART_THEME.axis.labelColor, font: { size: 11 }, padding: 8 }, border: { display: false } },
    },
  };

  doughnutOptions: any = {
    responsive: true, maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { position: 'bottom', labels: { color: CHART_THEME.axis.labelColor, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'circle', font: { size: 11 }, padding: 14 } },
      tooltip: { backgroundColor: CHART_THEME.tooltip.backgroundColor, borderColor: CHART_THEME.tooltip.borderColor, borderWidth: CHART_THEME.tooltip.borderWidth, titleFont: { size: 12 }, bodyFont: { size: 12 }, padding: 12, cornerRadius: 8, callbacks: { label: (ctx: any) => `${ctx.label}: ${ctx.raw}%` } },
    },
  };

  radarOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: CHART_THEME.tooltip.backgroundColor, borderColor: CHART_THEME.tooltip.borderColor, borderWidth: CHART_THEME.tooltip.borderWidth, titleFont: { size: 12 }, bodyFont: { size: 12 }, padding: 12, cornerRadius: 8 },
    },
    scales: {
      r: {
        beginAtZero: true, min: 60, max: 100,
        ticks: { stepSize: 10, display: false },
        grid: { color: CHART_THEME.axis.gridColorRadar, circular: true },
        angleLines: { color: CHART_THEME.axis.gridColorRadar },
        pointLabels: { color: CHART_THEME.axis.labelColor, font: { size: 11 } },
      },
    },
  };

  lineOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: CHART_THEME.tooltip.backgroundColor, borderColor: CHART_THEME.tooltip.borderColor, borderWidth: CHART_THEME.tooltip.borderWidth, titleFont: { size: 12 }, bodyFont: { size: 12 }, padding: 12, cornerRadius: 8 },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: CHART_THEME.axis.gridColor, drawBorder: false }, ticks: { color: CHART_THEME.axis.tickColor, font: { size: 11 }, padding: 8 }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: CHART_THEME.axis.labelColor, font: { size: 11 }, padding: 8 }, border: { display: false } },
    },
  };

  private industryLabels = [
    { en: 'Healthcare', ar: 'الرعاية الصحية' },
    { en: 'Government', ar: 'الحكومة' },
    { en: 'Finance', ar: 'المالية' },
    { en: 'Telecom', ar: 'الاتصالات' },
    { en: 'Energy', ar: 'الطاقة' },
    { en: 'Education', ar: 'التعليم' },
  ];

  private satisfactionLabels = [
    { en: 'Technical Quality', ar: 'الجودة التقنية' },
    { en: 'Communication', ar: 'التواصل' },
    { en: 'On-Time Delivery', ar: 'التسليم في الوقت' },
    { en: 'Cost Efficiency', ar: 'كفاءة التكلفة' },
    { en: 'Innovation', ar: 'الابتكار' },
    { en: 'Support', ar: 'الدعم' },
  ];

  ngOnInit(): void {
    this.updateI18nLabels();
    this.updateChart();
  }

  private updateI18nLabels(): void {
    this.industryData = {
      ...this.industryData,
      labels: this.industryLabels.map(l => this.i18n.t(l.en, l.ar)),
    };
    this.satisfactionData = {
      ...this.satisfactionData,
      labels: this.satisfactionLabels.map(l => this.i18n.t(l.en, l.ar)),
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) this.updateChart();
  }

  private updateChart(): void {
    const c = this.content();
    if (c?.chartData) {
      const labels = c.chartData.labels;
      const values = c.chartData.values;
      this.deliveryData = {
        ...this.deliveryData,
        labels: [...labels, ...labels.map((l: string) => l + ' \'25')],
        datasets: [
          { ...this.deliveryData.datasets[0], data: [...values, ...values.map((v: number) => Math.min(100, v + Math.round(Math.random() * 5)))] },
          this.deliveryData.datasets[1],
        ],
      };
    }
  }
}
