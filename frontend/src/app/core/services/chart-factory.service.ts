import { Injectable } from '@angular/core';

/** Chart.js dataset shape for PrimeNG p-chart (bar/line). */
export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

/** Chart data shape for PrimeNG p-chart. */
export interface ChartDataConfig {
  labels: string[];
  datasets: ChartDataset[];
}

/** Options for Chart.js (plugins, scales). */
export interface ChartOptionsConfig {
  responsive: boolean;
  maintainAspectRatio?: boolean;
  plugins: { legend?: { display: boolean }; title?: { display: boolean; text?: string } };
  scales?: {
    x?: { grid?: { display: boolean }; ticks?: { maxRotation?: number } };
    y?: { beginAtZero?: boolean; max?: number; min?: number; grid?: { display: boolean } };
  };
}

/** Brand colors for consistent charts across the app. */
export const CHART_COLORS = {
  primary: '#0EA5E9',
  secondary: '#006C35',
  accent: '#6366F1',
  success: '#10B981',
  gold: 'var(--gold)',
  series: ['#0EA5E9', '#006C35', '#6366F1', '#10B981', '#F59E0B', '#EF4444'],
} as const;

/**
 * Factory for consistent Chart.js data and options across landing, admin, and dashboards.
 * Use for bar, line, and future chart types so all charts share the same defaults and brand.
 */
@Injectable({ providedIn: 'root' })
export class ChartFactoryService {
  /**
   * Build bar chart data from labels and values (single or multiple series).
   */
  createBarChartData(
    labels: string[],
    values: number[] | number[][],
    options?: { datasetLabel?: string; colors?: string[] }
  ): ChartDataConfig {
    const colors = options?.colors ?? CHART_COLORS.series;
    const single = Array.isArray(values[0]) ? false : true;
    const data = single
      ? [values as number[]]
      : (values as number[][]);
    const datasets: ChartDataset[] = data.map((arr, i) => ({
      label: options?.datasetLabel ?? (data.length > 1 ? `Series ${i + 1}` : 'Score'),
      data: arr,
      backgroundColor: colors[i % colors.length],
    }));
    return { labels, datasets };
  }

  /**
   * Build line chart data (e.g. trends over time).
   */
  createLineChartData(
    labels: string[],
    values: number[] | number[][],
    options?: { datasetLabel?: string; colors?: string[] }
  ): ChartDataConfig {
    const colors = options?.colors ?? CHART_COLORS.series;
    const single = Array.isArray(values[0]) ? false : true;
    const data = single ? [values as number[]] : (values as number[][]);
    const datasets: ChartDataset[] = data.map((arr, i) => ({
      label: options?.datasetLabel ?? (data.length > 1 ? `Series ${i + 1}` : 'Value'),
      data: arr,
      borderColor: colors[i % colors.length],
      backgroundColor: `${colors[i % colors.length]}20`,
      fill: true,
      borderWidth: 2,
    }));
    return { labels, datasets };
  }

  /**
   * Default bar options: responsive, no legend, Y 0–100.
   */
  barOptions(overrides?: Partial<ChartOptionsConfig>): ChartOptionsConfig {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { display: true } },
        x: { grid: { display: false }, ticks: { maxRotation: 45 } },
      },
      ...overrides,
    };
  }

  /**
   * Default line options: responsive, optional legend.
   */
  lineOptions(overrides?: Partial<ChartOptionsConfig>): ChartOptionsConfig {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { display: true } },
        x: { grid: { display: false }, ticks: { maxRotation: 45 } },
      },
      ...overrides,
    };
  }
}
