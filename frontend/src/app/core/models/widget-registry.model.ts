/**
 * Widget Registry — types for the dynamic UI system.
 * Charts (Chart.js + ECharts) and advanced widgets are registered here.
 */

export type ChartEngine = 'chartjs' | 'echarts';

export type WidgetCategory = 'basic' | 'enterprise' | 'noc' | 'ui';

export type WidgetType = 'chart' | 'component';

/** Base descriptor for any registered widget */
export interface WidgetRegistryEntry {
  id: string;
  type: WidgetType;
  name: string;
  description: string;
  category: WidgetCategory;
  /** Optional: for charts, which engine (Chart.js vs ECharts) */
  engine?: ChartEngine;
  /** Optional: Angular component type for type: 'component' */
  component?: unknown;
  /** Optional: icon key (e.g. PrimeIcons pi-chart-line) */
  icon?: string;
  /** Optional: tags for search/filter */
  tags?: string[];
}

/** Chart widget: id + engine + option builder key (delegated to ChartFactoryService) */
export interface ChartWidgetEntry extends WidgetRegistryEntry {
  type: 'chart';
  engine: ChartEngine;
  /** Chart type used by ChartFactoryService (e.g. bar, line, gauge, topology) */
  chartType: string;
}

/** Custom UI component widget (e.g. KPI card, table, form) */
export interface ComponentWidgetEntry extends WidgetRegistryEntry {
  type: 'component';
  component: unknown;
}

export type AnyWidgetEntry = ChartWidgetEntry | ComponentWidgetEntry;

export interface WidgetRegistryFilter {
  category?: WidgetCategory;
  engine?: ChartEngine;
  type?: WidgetType;
  search?: string;
}
