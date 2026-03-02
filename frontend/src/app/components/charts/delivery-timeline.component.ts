/**
 * Delivery Timeline Component
 * Interactive Gantt-style timeline for project phases
 * Professional visualization for case studies
 */

import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelinePhase } from '../../services/case-study.service';

declare var echarts: any;

@Component({
  selector: 'app-delivery-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline-container">
      <div class="timeline-header" *ngIf="title">
        <h3 class="timeline-title">{{ title }}</h3>
        <span class="timeline-duration">{{ getTotalDuration() }}</span>
      </div>

      <div #chartContainer class="timeline-chart" [style.height.px]="height"></div>

      <div class="timeline-footer" *ngIf="showLegend">
        <div class="timeline-phases">
          <div *ngFor="let phase of phases" class="phase-item">
            <span class="phase-marker" [style.background]="phase.color || defaultColor"></span>
            <span class="phase-name">{{ phase.name }}</span>
            <span class="phase-duration">{{ getPhaseDuration(phase) }}</span>
          </div>
        </div>
      </div>

      <!-- Milestone markers -->
      <div class="milestones" *ngIf="milestones && milestones.length > 0">
        <h4 class="milestones-title">Key Milestones</h4>
        <div class="milestone-list">
          <div *ngFor="let milestone of milestones" class="milestone-item">
            <svg class="milestone-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
            <span class="milestone-date">{{ formatDate(milestone.date) }}</span>
            <span class="milestone-label">{{ milestone.label }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline-container {
      width: 100%;
      background: white;
      border-radius: 0.75rem;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0 0.5rem;
    }

    .timeline-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #111827);
    }

    .timeline-duration {
      font-size: 0.875rem;
      color: var(--text-secondary, #6b7280);
      background: var(--bg-tertiary, #f3f4f6);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }

    .timeline-chart {
      width: 100%;
      min-height: 200px;
    }

    .timeline-footer {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--bg-secondary, #f9fafb);
      border-radius: 0.5rem;
    }

    .timeline-phases {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    .phase-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .phase-marker {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .phase-name {
      font-size: 0.875rem;
      color: var(--text-primary, #111827);
      flex: 1;
    }

    .phase-duration {
      font-size: 0.75rem;
      color: var(--text-tertiary, #9ca3af);
    }

    .milestones {
      margin-top: 1.5rem;
      padding: 1rem;
      background: var(--bg-secondary, #f9fafb);
      border-radius: 0.5rem;
    }

    .milestones-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary, #4b5563);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
    }

    .milestone-list {
      display: grid;
      gap: 0.5rem;
    }

    .milestone-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      background: white;
      border-radius: 0.375rem;
      border: 1px solid var(--border-color, #e5e7eb);
    }

    .milestone-icon {
      width: 16px;
      height: 16px;
      color: var(--color-primary, #3b82f6);
      flex-shrink: 0;
    }

    .milestone-date {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #111827);
      min-width: 80px;
    }

    .milestone-label {
      font-size: 0.875rem;
      color: var(--text-secondary, #6b7280);
    }

    @media (max-width: 640px) {
      .timeline-phases {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DeliveryTimelineComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  @Input() phases: TimelinePhase[] = [];
  @Input() title: string = '';
  @Input() height: number = 260;
  @Input() showLegend: boolean = true;
  @Input() milestones: Array<{date: string, label: string}> = [];
  @Input() defaultColor: string = '#3b82f6';

  private chart: any = null;
  private isChartReady = false;

  ngOnInit() {
    // Validate phases have required data
    this.phases = this.phases.map(phase => ({
      ...phase,
      color: phase.color || this.defaultColor
    }));
  }

  ngAfterViewInit() {
    this.loadEChartsAndRender();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isChartReady && changes['phases']) {
      this.updateChart();
    }
  }

  private loadEChartsAndRender() {
    if (typeof echarts !== 'undefined') {
      this.initChart();
      return;
    }

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

    this.chart = echarts.init(this.chartContainer.nativeElement);
    this.isChartReady = true;
    this.updateChart();

    window.addEventListener('resize', () => {
      if (this.chart) {
        this.chart.resize();
      }
    });
  }

  private updateChart() {
    if (!this.chart || !this.phases.length) return;

    // Convert dates to timestamps
    const data = this.phases.map((phase, index) => {
      const startTime = this.parseDate(phase.start).getTime();
      const endTime = this.parseDate(phase.end).getTime();

      return {
        name: phase.name,
        value: [index, startTime, endTime],
        itemStyle: {
          color: phase.color || this.defaultColor,
          borderRadius: 4
        }
      };
    });

    const categories = this.phases.map(p => p.name);

    const option = {
      tooltip: {
        formatter: (params: any) => {
          const startDate = new Date(params.value[1]).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          });
          const endDate = new Date(params.value[2]).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          });
          const days = Math.ceil((params.value[2] - params.value[1]) / (1000 * 60 * 60 * 24));

          return `
            <div style="font-weight: 600">${params.name}</div>
            <div style="margin-top: 4px; font-size: 12px; color: #666">
              ${startDate} → ${endDate}
            </div>
            <div style="margin-top: 2px; font-size: 12px; color: #999">
              Duration: ${days} days
            </div>
          `;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#111827'
        }
      },
      grid: {
        left: 120,
        right: 40,
        top: 20,
        bottom: 40,
        containLabel: true
      },
      xAxis: {
        type: 'time',
        position: 'bottom',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280',
          formatter: (value: number) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            });
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#374151',
          fontSize: 12,
          formatter: (value: string) => {
            // Truncate long names
            return value.length > 20 ? value.substring(0, 20) + '...' : value;
          }
        }
      },
      series: [
        {
          type: 'custom',
          renderItem: (params: any, api: any) => {
            const categoryIndex = api.value(0);
            const start = api.coord([api.value(1), categoryIndex]);
            const end = api.coord([api.value(2), categoryIndex]);
            const height = api.size([0, 1])[1] * 0.6;

            const rectShape = echarts.graphic.clipRectByRect(
              {
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height
              },
              {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
              }
            );

            return (
              rectShape && {
                type: 'rect',
                transition: ['shape'],
                shape: rectShape,
                style: api.style({
                  fill: api.visual('color'),
                  opacity: 0.9
                }),
                emphasis: {
                  style: {
                    opacity: 1,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,0.1)',
                    shadowOffsetY: 2
                  }
                }
              }
            );
          },
          encode: {
            x: [1, 2],
            y: 0
          },
          data: data,
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        }
      ]
    };

    this.chart.setOption(option);
  }

  private parseDate(dateStr: string): Date {
    // Handle different date formats
    if (dateStr.includes('-')) {
      // YYYY-MM format
      if (dateStr.split('-').length === 2) {
        return new Date(dateStr + '-01');
      }
      // YYYY-MM-DD format
      return new Date(dateStr);
    }
    // Fallback
    return new Date(dateStr);
  }

  getTotalDuration(): string {
    if (!this.phases.length) return '';

    const startDates = this.phases.map(p => this.parseDate(p.start).getTime());
    const endDates = this.phases.map(p => this.parseDate(p.end).getTime());

    const projectStart = Math.min(...startDates);
    const projectEnd = Math.max(...endDates);

    const months = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24 * 30));

    return `${months} months`;
  }

  getPhaseDuration(phase: TimelinePhase): string {
    const start = this.parseDate(phase.start);
    const end = this.parseDate(phase.end);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days < 30) {
      return `${days} days`;
    } else {
      const months = Math.round(days / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
  }

  formatDate(dateStr: string): string {
    const date = this.parseDate(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}