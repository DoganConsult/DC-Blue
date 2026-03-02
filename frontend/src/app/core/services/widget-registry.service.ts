import { Injectable, inject } from '@angular/core';
import { ChartFactoryService } from './chart-factory.service';
import type {
  WidgetRegistryEntry,
  ChartWidgetEntry,
  WidgetRegistryFilter,
  ChartEngine,
  WidgetCategory,
} from '../models/widget-registry.model';

/**
 * Single registry for all advanced widgets (charts + component widgets).
 * Uses ChartFactoryService for chart definitions so dashboards and config-driven UI
 * have one consistent "shape" — one service, one card class, one list.
 */
@Injectable({ providedIn: 'root' })
export class WidgetRegistryService {
  private readonly chartFactory = inject(ChartFactoryService);

  /** Full registry: chart widgets from ChartFactoryService (component widgets can be registered later). */
  getRegistry(): WidgetRegistryEntry[] {
    return this.chartFactory.registry.map((e) => this.toChartWidgetEntry(e));
  }

  getById(id: string): WidgetRegistryEntry | undefined {
    return this.getRegistry().find((e) => e.id === id);
  }

  list(filter?: WidgetRegistryFilter): WidgetRegistryEntry[] {
    let list = this.getRegistry();
    if (!filter) return list;
    if (filter.category) list = list.filter((e) => e.category === filter.category);
    if (filter.engine) list = list.filter((e) => (e as ChartWidgetEntry).engine === filter.engine);
    if (filter.type) list = list.filter((e) => e.type === filter.type);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }

  listCharts(engine?: ChartEngine): ChartWidgetEntry[] {
    const list = this.getRegistry().filter((e): e is ChartWidgetEntry => e.type === 'chart');
    if (engine) return list.filter((e) => e.engine === engine);
    return list;
  }

  private toChartWidgetEntry(e: (typeof this.chartFactory.registry)[0]): ChartWidgetEntry {
    return {
      id: e.id,
      type: 'chart',
      name: e.name,
      description: e.description,
      category: e.category as WidgetCategory,
      engine: e.engine as ChartEngine,
      chartType: e.id,
      icon: this.iconForChart(e.id),
      tags: [e.id, e.engine, e.category],
    };
  }

  private iconForChart(chartType: string): string {
    const map: Record<string, string> = {
      bar: 'pi-chart-bar',
      line: 'pi-chart-line',
      radar: 'pi-chart-radar',
      doughnut: 'pi-chart-pie',
      'stacked-bar': 'pi-chart-bar',
      topology: 'pi-sitemap',
      gauge: 'pi-percentage',
      'multi-gauge': 'pi-th-large',
      sankey: 'pi-arrow-right-arrow-left',
      heatmap: 'pi-table',
      treemap: 'pi-sitemap',
      'bandwidth-gauge': 'pi-wifi',
    };
    return map[chartType] ?? 'pi-chart-line';
  }
}
