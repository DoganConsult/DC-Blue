/**
 * Architecture Map Component
 * Interactive network graph visualization for system architecture
 * Shows interconnected components with relationships
 */

import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var echarts: any;

export interface ArchitectureNode {
  id: string;
  name: string;
  x: number;
  y: number;
  category: string;
  size?: number;
  icon?: string;
}

export interface ArchitectureLink {
  source: string;
  target: string;
  value: string;
  type?: string;
}

@Component({
  selector: 'app-architecture-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="architecture-container">
      <div class="architecture-header" *ngIf="title">
        <h3 class="architecture-title">{{ title }}</h3>
        <div class="architecture-controls">
          <button class="control-btn" (click)="resetZoom()" title="Reset Zoom">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button class="control-btn" (click)="toggleLabels()" title="Toggle Labels">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </button>
        </div>
      </div>

      <div #chartContainer class="architecture-chart" [style.height.px]="height"></div>

      <div class="architecture-legend" *ngIf="showLegend">
        <div class="legend-title">Components</div>
        <div class="legend-items">
          <div *ngFor="let category of getCategories()" class="legend-item">
            <span class="legend-dot" [style.background]="getCategoryColor(category)"></span>
            <span class="legend-label">{{ formatCategoryName(category) }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .architecture-container {
      width: 100%;
      background: white;
      border-radius: 0.75rem;
      position: relative;
    }

    .architecture-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0 0.5rem;
    }

    .architecture-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #111827);
    }

    .architecture-controls {
      display: flex;
      gap: 0.5rem;
    }

    .control-btn {
      padding: 0.375rem;
      background: var(--bg-secondary, #f9fafb);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 0.375rem;
      color: var(--text-secondary, #6b7280);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .control-btn:hover {
      background: var(--bg-tertiary, #f3f4f6);
      color: var(--text-primary, #111827);
    }

    .architecture-chart {
      width: 100%;
      min-height: 300px;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 0.5rem;
      background: linear-gradient(to bottom right, #fafafa, #f9fafb);
    }

    .architecture-legend {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--bg-secondary, #f9fafb);
      border-radius: 0.5rem;
    }

    .legend-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary, #4b5563);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
    }

    .legend-items {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-label {
      font-size: 0.875rem;
      color: var(--text-primary, #111827);
    }
  `]
})
export class ArchitectureMapComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  @Input() nodes: ArchitectureNode[] = [];
  @Input() links: ArchitectureLink[] = [];
  @Input() title: string = '';
  @Input() height: number = 400;
  @Input() showLegend: boolean = true;
  @Input() enableDrag: boolean = true;
  @Input() enableZoom: boolean = true;

  private chart: any = null;
  private isChartReady = false;
  private showLabelsState = true;

  private categoryColors: Record<string, string> = {
    'source': '#10b981',      // Green - Data sources
    'core': '#3b82f6',         // Blue - Core components
    'external': '#f59e0b',     // Amber - External systems
    'policy': '#ef4444',       // Red - Policy/Compliance
    'infrastructure': '#8b5cf6', // Purple - Infrastructure
    'security': '#ec4899',     // Pink - Security
    'analytics': '#06b6d4',    // Cyan - Analytics
    'default': '#6b7280'       // Gray - Default
  };

  ngOnInit() {
    // Validate nodes and links
    this.validateData();
  }

  ngAfterViewInit() {
    this.loadEChartsAndRender();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isChartReady && (changes['nodes'] || changes['links'])) {
      this.updateChart();
    }
  }

  private validateData() {
    // Add default positions if not provided
    this.nodes = this.nodes.map((node, index) => ({
      ...node,
      x: node.x || (index % 3) * 200 + 100,
      y: node.y || Math.floor(index / 3) * 150 + 100,
      size: node.size || 50
    }));
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
    if (!this.chart || !this.nodes.length) return;

    // Format nodes for ECharts
    const graphNodes = this.nodes.map(node => ({
      id: node.id,
      name: node.name.replace(/\\n/g, '\n'),
      x: node.x,
      y: node.y,
      symbolSize: node.size || 50,
      category: node.category || 'default',
      itemStyle: {
        color: this.getCategoryColor(node.category),
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.1)'
      },
      label: {
        show: this.showLabelsState,
        position: 'bottom',
        fontSize: 11,
        color: '#374151',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 3,
        padding: [2, 4]
      },
      emphasis: {
        scale: true,
        scaleSize: 1.2,
        itemStyle: {
          borderWidth: 3,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        },
        label: {
          show: true,
          fontSize: 13,
          fontWeight: 'bold'
        }
      }
    }));

    // Format links for ECharts
    const graphLinks = this.links.map(link => ({
      source: link.source,
      target: link.target,
      value: link.value,
      lineStyle: {
        color: '#9ca3af',
        width: 2,
        curveness: 0.2,
        opacity: 0.7,
        type: link.type === 'dashed' ? 'dashed' : 'solid'
      },
      emphasis: {
        lineStyle: {
          width: 3,
          opacity: 1
        }
      },
      label: {
        show: false,
        formatter: link.value,
        fontSize: 10,
        color: '#6b7280'
      }
    }));

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            return `
              <div style="font-weight: 600">${params.name}</div>
              <div style="margin-top: 4px; font-size: 12px; color: #666">
                Category: ${this.formatCategoryName(params.data.category)}
              </div>
            `;
          } else if (params.dataType === 'edge') {
            return `
              <div style="font-weight: 600">${params.data.value}</div>
              <div style="margin-top: 4px; font-size: 12px; color: #666">
                ${params.data.source} → ${params.data.target}
              </div>
            `;
          }
          return '';
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#111827'
        }
      },
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'none',
          animation: true,
          roam: this.enableZoom,
          draggable: this.enableDrag,
          data: graphNodes,
          links: graphLinks,
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 3
            }
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            fontSize: 12
          },
          lineStyle: {
            opacity: 0.7,
            curveness: 0.2
          },
          categories: this.getCategories().map(cat => ({
            name: this.formatCategoryName(cat),
            itemStyle: {
              color: this.getCategoryColor(cat)
            }
          }))
        }
      ]
    };

    this.chart.setOption(option);

    // Add click handler
    this.chart.on('click', (params: any) => {
      if (params.dataType === 'node') {
        console.log('Node clicked:', params.name, params.data);
      } else if (params.dataType === 'edge') {
        console.log('Edge clicked:', params.data.value);
      }
    });
  }

  getCategories(): string[] {
    const categories = new Set(this.nodes.map(n => n.category || 'default'));
    return Array.from(categories);
  }

  getCategoryColor(category: string): string {
    return this.categoryColors[category] || this.categoryColors['default'];
  }

  formatCategoryName(category: string): string {
    const names: Record<string, string> = {
      'source': 'Data Sources',
      'core': 'Core Systems',
      'external': 'External Services',
      'policy': 'Policy & Compliance',
      'infrastructure': 'Infrastructure',
      'security': 'Security Layer',
      'analytics': 'Analytics & BI',
      'default': 'Other'
    };
    return names[category] || category;
  }

  resetZoom(): void {
    if (this.chart) {
      this.chart.dispatchAction({
        type: 'restore'
      });
    }
  }

  toggleLabels(): void {
    this.showLabelsState = !this.showLabelsState;
    if (this.chart) {
      this.chart.setOption({
        series: [{
          data: this.nodes.map(node => ({
            id: node.id,
            label: {
              show: this.showLabelsState
            }
          }))
        }]
      });
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}