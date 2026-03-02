/**
 * KPI Bullet Chart Component
 * Enterprise-grade bullet chart for showing KPI metrics
 * Uses normalized indices (0-100) to avoid sensitive data exposure
 */

import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// ECharts will be loaded dynamically to avoid SSR issues
declare var echarts: any;

@Component({
  selector: 'app-kpi-bullet-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-chart-container">
      <div class="chart-header" *ngIf="label">
        <span class="chart-label">{{ label }}</span>
        <span class="chart-value" [style.color]="getValueColor()">
          {{ actual }}%
        </span>
      </div>

      <div #chartContainer class="chart-area" [style.height.px]="height"></div>

      <div class="chart-legend">
        <div class="legend-item">
          <span class="legend-marker baseline"></span>
          <span class="legend-label">Baseline: {{ baseline }}%</span>
        </div>
        <div class="legend-item">
          <span class="legend-marker target"></span>
          <span class="legend-label">Target: {{ target }}%</span>
        </div>
        <div class="legend-item">
          <span class="legend-marker actual" [style.background]="getActualColor()"></span>
          <span class="legend-label">Actual: {{ actual }}%</span>
        </div>
      </div>

      <div class="chart-note" *ngIf="note">
        <svg class="note-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span class="note-text">{{ note }}</span>
      </div>
    </div>
  `,
  styles: [`
    .kpi-chart-container {
      width: 100%;
      padding: 1rem;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .chart-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary, #4b5563);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .chart-value {
      font-size: 1.5rem;
      font-weight: 700;
      transition: color 0.3s ease;
    }

    .chart-area {
      width: 100%;
      min-height: 80px;
      position: relative;
    }

    .chart-legend {
      display: flex;
      gap: 1rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .legend-marker {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .legend-marker.baseline {
      background: #e5e7eb;
      border: 1px solid #9ca3af;
    }

    .legend-marker.target {
      background: transparent;
      border: 2px dashed #6b7280;
    }

    .legend-marker.actual {
      background: #3b82f6;
    }

    .legend-label {
      font-size: 0.75rem;
      color: var(--text-tertiary, #6b7280);
    }

    .chart-note {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-top: 0.75rem;
      padding: 0.5rem;
      background: var(--bg-tertiary, #f9fafb);
      border-radius: 0.375rem;
    }

    .note-icon {
      flex-shrink: 0;
      width: 14px;
      height: 14px;
      color: var(--text-tertiary, #9ca3af);
      margin-top: 1px;
    }

    .note-text {
      font-size: 0.75rem;
      color: var(--text-tertiary, #6b7280);
      line-height: 1.4;
    }

    /* Color variations */
    :host-context(.color-green) .legend-marker.actual {
      background: #10b981;
    }

    :host-context(.color-purple) .legend-marker.actual {
      background: #8b5cf6;
    }

    :host-context(.color-amber) .legend-marker.actual {
      background: #f59e0b;
    }

    :host-context(.color-red) .legend-marker.actual {
      background: #ef4444;
    }
  `]
})
export class KpiBulletChartComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  @Input() baseline: number = 0;  // 0-100
  @Input() target: number = 100;  // 0-100
  @Input() actual: number = 50;   // 0-100
  @Input() label: string = '';
  @Input() note: string = '';
  @Input() height: number = 100;
  @Input() color: string = 'blue';  // blue, green, purple, amber, red
  @Input() showAnimation: boolean = true;

  private chart: any = null;
  private isChartReady = false;

  ngOnInit() {
    // Clamp values to 0-100 range
    this.baseline = Math.max(0, Math.min(100, this.baseline));
    this.target = Math.max(0, Math.min(100, this.target));
    this.actual = Math.max(0, Math.min(100, this.actual));
  }

  ngAfterViewInit() {
    this.loadEChartsAndRender();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isChartReady && (changes['baseline'] || changes['target'] || changes['actual'])) {
      this.updateChart();
    }
  }

  private loadEChartsAndRender() {
    // Check if ECharts is already loaded
    if (typeof echarts !== 'undefined') {
      this.initChart();
      return;
    }

    // Dynamically load ECharts
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
    script.async = true;
    script.onload = () => {
      this.initChart();
    };
    document.body.appendChild(script);
  }

  private initChart() {
    if (!this.chartContainer) return;

    // Initialize ECharts instance
    this.chart = echarts.init(this.chartContainer.nativeElement);
    this.isChartReady = true;

    // Set initial chart options
    this.updateChart();

    // Handle resize
    window.addEventListener('resize', () => {
      if (this.chart) {
        this.chart.resize();
      }
    });
  }

  private updateChart() {
    if (!this.chart) return;

    const colorMap: Record<string, string> = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      amber: '#f59e0b',
      red: '#ef4444'
    };

    const mainColor = colorMap[this.color] || colorMap.blue;

    const option = {
      grid: {
        left: 0,
        right: 0,
        top: 5,
        bottom: 5,
        containLabel: false
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        show: false,
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false }
      },
      yAxis: {
        type: 'category',
        data: [''],
        show: false,
        axisTick: { show: false },
        axisLabel: { show: false }
      },
      series: [
        // Background (full range)
        {
          type: 'bar',
          data: [100],
          barWidth: 24,
          itemStyle: {
            color: '#f3f4f6',
            borderRadius: 4
          },
          silent: true,
          z: 0,
          animation: false
        },
        // Baseline range
        {
          type: 'bar',
          data: [this.baseline],
          barWidth: 24,
          itemStyle: {
            color: '#e5e7eb',
            borderRadius: 4
          },
          silent: true,
          z: 1,
          animation: this.showAnimation,
          animationDuration: 800,
          animationEasing: 'cubicOut'
        },
        // Actual value (thin bar)
        {
          type: 'bar',
          data: [this.actual],
          barWidth: 8,
          barGap: '-100%',
          itemStyle: {
            color: mainColor,
            borderRadius: 2,
            shadowBlur: 4,
            shadowColor: mainColor + '40',
            shadowOffsetY: 2
          },
          z: 3,
          animation: this.showAnimation,
          animationDuration: 1200,
          animationDelay: 200,
          animationEasing: 'elasticOut'
        },
        // Target marker (vertical line)
        {
          type: 'scatter',
          data: [[this.target, 0]],
          symbolSize: [2, 28],
          symbol: 'rect',
          itemStyle: {
            color: '#374151',
            opacity: 0.8
          },
          z: 4,
          silent: true,
          animation: this.showAnimation,
          animationDuration: 1000,
          animationDelay: 400,
          animationEasing: 'cubicOut'
        }
      ]
    };

    this.chart.setOption(option);
  }

  getValueColor(): string {
    const percentage = this.actual / this.target;

    if (percentage >= 1) {
      return '#10b981'; // Green - target met
    } else if (percentage >= 0.8) {
      return '#f59e0b'; // Amber - close to target
    } else if (percentage >= 0.6) {
      return '#6b7280'; // Gray - moderate
    } else {
      return '#ef4444'; // Red - far from target
    }
  }

  getActualColor(): string {
    const colorMap: Record<string, string> = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      amber: '#f59e0b',
      red: '#ef4444'
    };

    return colorMap[this.color] || colorMap.blue;
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}

/**
 * Alternative SVG-based Bullet Chart (for when ECharts is not needed)
 */
@Component({
  selector: 'app-kpi-bullet-svg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg class="bullet-chart" [attr.viewBox]="'0 0 ' + width + ' ' + height">
      <!-- Background -->
      <rect x="0" [attr.y]="(height - barHeight) / 2"
            [attr.width]="width"
            [attr.height]="barHeight"
            fill="#f3f4f6"
            rx="2" />

      <!-- Baseline -->
      <rect x="0" [attr.y]="(height - barHeight) / 2"
            [attr.width]="(baseline / 100) * width"
            [attr.height]="barHeight"
            fill="#e5e7eb"
            rx="2" />

      <!-- Actual -->
      <rect x="0" [attr.y]="(height - actualBarHeight) / 2"
            [attr.width]="(actual / 100) * width"
            [attr.height]="actualBarHeight"
            [attr.fill]="getColor()"
            rx="1">
        <animate *ngIf="animate"
                 attributeName="width"
                 [attr.from]="0"
                 [attr.to]="(actual / 100) * width"
                 dur="1s"
                 fill="freeze" />
      </rect>

      <!-- Target line -->
      <line [attr.x1]="(target / 100) * width"
            [attr.y1]="(height - targetHeight) / 2"
            [attr.x2]="(target / 100) * width"
            [attr.y2]="(height + targetHeight) / 2"
            stroke="#374151"
            stroke-width="2"
            stroke-dasharray="2,2" />
    </svg>
  `,
  styles: [`
    .bullet-chart {
      width: 100%;
      height: auto;
    }
  `]
})
export class KpiBulletSvgComponent {
  @Input() baseline: number = 0;
  @Input() target: number = 100;
  @Input() actual: number = 50;
  @Input() width: number = 300;
  @Input() height: number = 40;
  @Input() barHeight: number = 20;
  @Input() actualBarHeight: number = 8;
  @Input() targetHeight: number = 28;
  @Input() color: string = 'blue';
  @Input() animate: boolean = true;

  getColor(): string {
    const colors: Record<string, string> = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      amber: '#f59e0b',
      red: '#ef4444'
    };
    return colors[this.color] || colors.blue;
  }
}