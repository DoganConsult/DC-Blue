import { Injectable } from '@angular/core';
import type { EChartsCoreOption } from 'echarts';
import { COLOR_PALETTE, CHART_THEME } from '../data/page-styles';

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderRadius?: number;
  borderSkipped?: boolean;
  fill?: boolean;
  tension?: number;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointBorderWidth?: number;
  stack?: string;
}

export interface ChartDataConfig {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptionsConfig {
  responsive: boolean;
  maintainAspectRatio?: boolean;
  plugins: Record<string, any>;
  scales?: Record<string, any>;
  elements?: Record<string, any>;
}

export const CHART_COLORS = {
  primary: COLOR_PALETTE.network.hex,
  secondary: COLOR_PALETTE.cybersecurity.hex,
  accent: COLOR_PALETTE.cloud.hex,
  success: COLOR_PALETTE.integration.hex,
  warning: COLOR_PALETTE.iot.hex,
  danger: COLOR_PALETTE.threat.hex,
  gold: COLOR_PALETTE.gold.hex,
  cyan: COLOR_PALETTE.cyan.hex,
  purple: COLOR_PALETTE.purple.hex,
  teal: COLOR_PALETTE.smartCity.hex,
  series: CHART_THEME.series,
  nocSeries: CHART_THEME.nocSeries,
} as const;

const NOC_TOOLTIP: any = {
  backgroundColor: CHART_THEME.tooltip.backgroundColor,
  borderColor: 'rgba(56,189,248,0.2)',
  borderWidth: CHART_THEME.tooltip.borderWidth,
  titleFont: { family: 'monospace', size: 11 },
  bodyFont: { family: 'monospace', size: 11 },
  padding: 10,
  cornerRadius: 8,
};

const NOC_ECHARTS_TOOLTIP: any = {
  backgroundColor: CHART_THEME.tooltip.backgroundColor,
  borderColor: 'rgba(56,189,248,0.3)',
  textStyle: { color: '#e2e8f0', fontFamily: 'monospace', fontSize: 11 },
};

const NOC_AXIS = {
  grid: { color: CHART_THEME.axis.gridColor, drawBorder: false },
  ticks: { color: CHART_THEME.axis.tickColor, font: { size: 10, family: 'monospace' }, padding: 8 },
  border: { display: false },
};

const NOC_LEGEND_LABELS: any = {
  color: '#94a3b8', boxWidth: 8, boxHeight: 8,
  usePointStyle: true, pointStyle: 'circle',
  font: { size: 10, family: 'monospace' }, padding: 16,
};

export type ChartType =
  | 'bar' | 'line' | 'radar' | 'stacked-bar' | 'doughnut'
  | 'topology' | 'gauge' | 'multi-gauge' | 'sankey'
  | 'heatmap' | 'treemap' | 'bandwidth-gauge';

export interface ChartRegistryEntry {
  id: ChartType;
  engine: 'chartjs' | 'echarts';
  name: string;
  description: string;
  category: 'basic' | 'enterprise' | 'noc';
}

@Injectable({ providedIn: 'root' })
export class ChartFactoryService {

  readonly registry: ChartRegistryEntry[] = [
    { id: 'bar', engine: 'chartjs', name: 'Bar Chart', description: 'Vertical bar chart for comparisons', category: 'basic' },
    { id: 'line', engine: 'chartjs', name: 'Line / Area', description: 'Trend lines with optional fill', category: 'basic' },
    { id: 'radar', engine: 'chartjs', name: 'Radar', description: 'Multi-axis radar for compliance scoring', category: 'basic' },
    { id: 'stacked-bar', engine: 'chartjs', name: 'Stacked Bar', description: 'Stacked categories over time', category: 'basic' },
    { id: 'doughnut', engine: 'chartjs', name: 'Doughnut', description: 'Proportional ring chart', category: 'basic' },
    { id: 'topology', engine: 'echarts', name: 'Network Topology', description: 'Cisco-style L2/L3 force-directed graph', category: 'enterprise' },
    { id: 'gauge', engine: 'echarts', name: 'Gauge Meter', description: 'Single animated gauge (CPU, bandwidth, etc.)', category: 'noc' },
    { id: 'multi-gauge', engine: 'echarts', name: 'Multi-Gauge', description: '4-quadrant gauge dashboard', category: 'noc' },
    { id: 'sankey', engine: 'echarts', name: 'Sankey Flow', description: 'Data flow between network layers', category: 'enterprise' },
    { id: 'heatmap', engine: 'echarts', name: 'Heatmap', description: 'Threat or activity heatmap by time/region', category: 'noc' },
    { id: 'treemap', engine: 'echarts', name: 'Treemap', description: 'Hierarchical asset inventory', category: 'enterprise' },
    { id: 'bandwidth-gauge', engine: 'echarts', name: 'Bandwidth Gauge', description: 'Large throughput gauge with zones', category: 'noc' },
  ];

  // ═══════════════════════════════════════════
  //  CHART.JS — DATA BUILDERS
  // ═══════════════════════════════════════════

  createBarChartData(
    labels: string[],
    values: number[] | number[][],
    opts?: { datasetLabel?: string; colors?: string[]; dark?: boolean }
  ): ChartDataConfig {
    const colors = opts?.colors ?? (opts?.dark ? CHART_COLORS.nocSeries : CHART_COLORS.series);
    const multi = Array.isArray(values[0]);
    const data = multi ? (values as number[][]) : [values as number[]];
    return {
      labels,
      datasets: data.map((arr, i) => ({
        label: opts?.datasetLabel ?? (data.length > 1 ? `Series ${i + 1}` : 'Value'),
        data: arr,
        backgroundColor: opts?.dark ? `${colors[i % colors.length]}99` : colors[i % colors.length],
        borderColor: colors[i % colors.length],
        borderWidth: 1,
        borderRadius: opts?.dark ? 6 : 0,
        borderSkipped: opts?.dark ? false : undefined as any,
      })),
    };
  }

  createLineChartData(
    labels: string[],
    values: number[] | number[][],
    opts?: { datasetLabel?: string; colors?: string[]; dark?: boolean; tension?: number }
  ): ChartDataConfig {
    const colors = opts?.colors ?? (opts?.dark ? CHART_COLORS.nocSeries : CHART_COLORS.series);
    const multi = Array.isArray(values[0]);
    const data = multi ? (values as number[][]) : [values as number[]];
    return {
      labels,
      datasets: data.map((arr, i) => ({
        label: opts?.datasetLabel ?? (data.length > 1 ? `Series ${i + 1}` : 'Value'),
        data: arr,
        borderColor: colors[i % colors.length],
        backgroundColor: `${colors[i % colors.length]}14`,
        fill: true,
        borderWidth: 2,
        tension: opts?.tension ?? 0.4,
        pointBackgroundColor: colors[i % colors.length],
        pointBorderColor: opts?.dark ? '#0f172a' : '#fff',
        pointBorderWidth: 2,
      })),
    };
  }

  createRadarChartData(
    labels: string[],
    values: number[],
    opts?: { datasetLabel?: string; color?: string; dark?: boolean }
  ): ChartDataConfig {
    const c = opts?.color ?? CHART_COLORS.primary;
    return {
      labels,
      datasets: [{
        label: opts?.datasetLabel ?? 'Score',
        data: values,
        backgroundColor: opts?.dark ? `${c}1f` : `${c}33`,
        borderColor: c,
        borderWidth: 2,
        pointBackgroundColor: c,
        pointBorderColor: opts?.dark ? '#0f172a' : '#fff',
        pointBorderWidth: 2,
      }],
    };
  }

  createStackedBarData(
    labels: string[],
    series: { label: string; data: number[]; color?: string }[],
    opts?: { dark?: boolean }
  ): ChartDataConfig {
    const colors = opts?.dark ? CHART_COLORS.nocSeries : CHART_COLORS.series;
    return {
      labels,
      datasets: series.map((s, i) => ({
        label: s.label,
        data: s.data,
        backgroundColor: `${s.color ?? colors[i % colors.length]}b3`,
        borderColor: s.color ?? colors[i % colors.length],
        borderWidth: 1,
        borderRadius: opts?.dark ? 4 : 0,
        stack: 'stack0',
      })),
    };
  }

  createDoughnutData(
    labels: string[],
    values: number[],
    opts?: { colors?: string[]; dark?: boolean }
  ): ChartDataConfig {
    const colors = opts?.colors ?? (opts?.dark ? CHART_COLORS.nocSeries : CHART_COLORS.series);
    return {
      labels,
      datasets: [{
        label: 'Value',
        data: values,
        backgroundColor: colors.slice(0, values.length),
        borderColor: opts?.dark ? '#0f172a' : '#fff',
        borderWidth: opts?.dark ? 2 : 3,
      }],
    };
  }

  // ═══════════════════════════════════════════
  //  CHART.JS — OPTIONS BUILDERS
  // ═══════════════════════════════════════════

  barOptions(opts?: { dark?: boolean; max?: number; legend?: boolean }): any {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: opts?.legend ?? false },
        tooltip: opts?.dark ? NOC_TOOLTIP : {},
      },
      scales: {
        y: { beginAtZero: true, max: opts?.max ?? 100, ...(opts?.dark ? NOC_AXIS : { grid: { display: true } }), },
        x: { grid: { display: false }, ...(opts?.dark ? { ticks: NOC_AXIS.ticks, border: NOC_AXIS.border } : {}) },
      },
    };
  }

  lineOptions(opts?: { dark?: boolean; legend?: boolean }): any {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: opts?.legend !== false ? { position: 'bottom' as const, labels: opts?.dark ? NOC_LEGEND_LABELS : {} } : { display: false },
        tooltip: opts?.dark ? NOC_TOOLTIP : {},
      },
      scales: {
        y: { beginAtZero: true, ...(opts?.dark ? NOC_AXIS : { grid: { display: true } }) },
        x: { grid: { display: false }, ...(opts?.dark ? { ticks: NOC_AXIS.ticks, border: NOC_AXIS.border } : {}) },
      },
      elements: { point: { radius: 3, hoverRadius: 6, borderWidth: 2 }, line: { borderWidth: 2 } },
    };
  }

  radarOptions(opts?: { dark?: boolean; max?: number }): any {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: opts?.dark ? NOC_TOOLTIP : {} },
      scales: {
        r: {
          beginAtZero: true, max: opts?.max ?? 100,
          ticks: { stepSize: 20, display: false },
          grid: { color: opts?.dark ? 'rgba(148,163,184,0.08)' : '#e5e7eb', circular: true },
          angleLines: { color: opts?.dark ? 'rgba(148,163,184,0.08)' : '#e5e7eb' },
          pointLabels: { color: opts?.dark ? '#94a3b8' : '#374151', font: { size: 10, family: opts?.dark ? 'monospace' : 'inherit' } },
        },
      },
    };
  }

  stackedBarOptions(opts?: { dark?: boolean; legend?: boolean }): any {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: opts?.legend !== false ? { position: 'bottom' as const, labels: opts?.dark ? NOC_LEGEND_LABELS : {} } : { display: false },
        tooltip: opts?.dark ? NOC_TOOLTIP : {},
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ...(opts?.dark ? { ticks: NOC_AXIS.ticks, border: NOC_AXIS.border } : {}) },
        y: { stacked: true, ...(opts?.dark ? NOC_AXIS : { grid: { display: true } }) },
      },
    };
  }

  doughnutOptions(opts?: { dark?: boolean; cutout?: string }): any {
    return {
      responsive: true, maintainAspectRatio: false,
      cutout: opts?.cutout ?? '65%',
      plugins: {
        legend: { position: 'bottom' as const, labels: opts?.dark ? NOC_LEGEND_LABELS : {} },
        tooltip: opts?.dark ? NOC_TOOLTIP : {},
      },
    };
  }

  // ═══════════════════════════════════════════
  //  ECHARTS — CONFIG BUILDERS
  // ═══════════════════════════════════════════

  createTopology(config: {
    nodes: { name: string; category: number; size?: number; glow?: boolean }[];
    links: { source: string; target: string; highlight?: boolean }[];
    categories: { name: string; color: string }[];
  }): EChartsCoreOption {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item', ...NOC_ECHARTS_TOOLTIP },
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [{
        type: 'graph',
        layout: 'force',
        roam: true,
        draggable: true,
        force: { repulsion: 260, gravity: 0.12, edgeLength: [80, 180], friction: 0.6 },
        label: { show: true, color: '#e2e8f0', fontSize: 10, fontFamily: 'monospace' },
        lineStyle: { color: 'rgba(56,189,248,0.3)', width: 2, curveness: 0.1 },
        emphasis: { focus: 'adjacency', lineStyle: { width: 4, color: '#38bdf8' }, itemStyle: { shadowBlur: 20, shadowColor: 'rgba(56,189,248,0.5)' } },
        categories: config.categories.map(c => ({ name: c.name, itemStyle: { color: c.color } })),
        data: config.nodes.map(n => ({
          name: n.name,
          category: n.category,
          symbolSize: n.size ?? 30,
          ...(n.glow ? { itemStyle: { shadowBlur: 16, shadowColor: `${config.categories[n.category]?.color ?? '#38bdf8'}66` } } : {}),
        })),
        links: config.links.map(l => ({
          source: l.source,
          target: l.target,
          ...(l.highlight ? { lineStyle: { width: 4, color: 'rgba(56,189,248,0.5)' } } : {}),
        })),
      }],
      legend: {
        data: config.categories.map(c => c.name),
        bottom: 4,
        textStyle: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
        itemWidth: 10, itemHeight: 10,
      },
    };
  }

  createGauge(config: {
    title: string;
    value: number;
    max?: number;
    color: string;
    darkColor?: string;
    unit?: string;
  }): EChartsCoreOption {
    const dk = config.darkColor ?? config.color;
    return {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        center: ['50%', '58%'],
        radius: '85%',
        startAngle: 220,
        endAngle: -40,
        min: 0,
        max: config.max ?? 100,
        splitNumber: 5,
        pointer: { show: true, length: '55%', width: 6, itemStyle: { color: config.color } },
        progress: { show: true, width: 14, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: dk }, { offset: 1, color: config.color }] } } },
        axisLine: { lineStyle: { width: 14, color: [[1, 'rgba(148,163,184,0.08)']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: { valueAnimation: true, fontSize: 22, fontFamily: 'monospace', fontWeight: 'bold', color: config.color, offsetCenter: [0, '30%'], formatter: `{value}${config.unit ?? '%'}` },
        title: { fontSize: 11, fontFamily: 'monospace', color: '#94a3b8', offsetCenter: [0, '55%'] },
        data: [{ value: config.value, name: config.title }],
      }],
    };
  }

  createMultiGauge(gauges: { title: string; value: number; color: string; darkColor?: string }[]): EChartsCoreOption {
    const positions: [number, number][] = [[-60, -20], [60, -20], [-60, 55], [60, 55]];
    return {
      backgroundColor: 'transparent',
      series: gauges.slice(0, 4).map((g, i) => {
        const dk = g.darkColor ?? g.color;
        const [cx, cy] = positions[i];
        return {
          type: 'gauge',
          center: [`${50 + cx}%`, `${50 + cy}%`],
          radius: '38%',
          startAngle: 220, endAngle: -40, min: 0, max: 100, splitNumber: 5,
          pointer: { show: true, length: '50%', width: 4, itemStyle: { color: g.color } },
          progress: { show: true, width: 10, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: dk }, { offset: 1, color: g.color }] } } },
          axisLine: { lineStyle: { width: 10, color: [[1, 'rgba(148,163,184,0.08)']] } },
          axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
          detail: { valueAnimation: true, fontSize: 18, fontFamily: 'monospace', fontWeight: 'bold', color: g.color, offsetCenter: [0, '30%'], formatter: '{value}%' },
          title: { fontSize: 10, fontFamily: 'monospace', color: '#94a3b8', offsetCenter: [0, '55%'] },
          data: [{ value: g.value, name: g.title }],
        };
      }),
    };
  }

  createSankey(config: {
    nodes: { name: string; color: string }[];
    links: { source: string; target: string; value: number }[];
  }): EChartsCoreOption {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item', ...NOC_ECHARTS_TOOLTIP },
      series: [{
        type: 'sankey',
        layout: 'none',
        nodeAlign: 'left',
        nodeGap: 14,
        nodeWidth: 20,
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.4 },
        label: { color: '#e2e8f0', fontSize: 10, fontFamily: 'monospace' },
        itemStyle: { borderWidth: 0 },
        data: config.nodes.map(n => ({ name: n.name, itemStyle: { color: n.color } })),
        links: config.links,
      }],
    };
  }

  createHeatmap(config: {
    xLabels: string[];
    yLabels: string[];
    data: number[][];
    maxVal?: number;
    colorRange?: string[];
  }): EChartsCoreOption {
    const colors = config.colorRange ?? ['#0f172a', '#164e63', '#0e7490', '#f59e0b', '#ef4444'];
    return {
      backgroundColor: 'transparent',
      tooltip: {
        ...NOC_ECHARTS_TOOLTIP,
        formatter: (p: any) => `${config.yLabels[p.value[1]]} · ${config.xLabels[p.value[0]]}<br/>Value: <b>${p.value[2]}</b>`,
      },
      grid: { top: 10, right: 20, bottom: 50, left: 60 },
      xAxis: { type: 'category', data: config.xLabels, splitArea: { show: false }, axisLabel: { color: '#64748b', fontFamily: 'monospace', fontSize: 10 }, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: 'category', data: config.yLabels, splitArea: { show: false }, axisLabel: { color: '#64748b', fontFamily: 'monospace', fontSize: 10 }, axisLine: { show: false }, axisTick: { show: false } },
      visualMap: { min: 0, max: config.maxVal ?? 100, calculable: false, orient: 'horizontal', left: 'center', bottom: 4, itemWidth: 10, itemHeight: 120, textStyle: { color: '#64748b', fontSize: 10 }, inRange: { color: colors } },
      series: [{ type: 'heatmap', data: config.data, label: { show: true, color: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(56,189,248,0.5)' } }, itemStyle: { borderColor: '#0f172a', borderWidth: 3, borderRadius: 4 } }],
    };
  }

  createTreemap(config: {
    data: { name: string; value: number; color: string; children?: { name: string; value: number }[] }[];
  }): EChartsCoreOption {
    return {
      backgroundColor: 'transparent',
      tooltip: NOC_ECHARTS_TOOLTIP,
      series: [{
        type: 'treemap',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        width: '100%',
        height: '90%',
        label: { show: true, color: '#fff', fontSize: 11, fontFamily: 'monospace', fontWeight: 'bold' },
        upperLabel: { show: true, height: 24, color: '#e2e8f0', fontSize: 10, fontFamily: 'monospace', backgroundColor: 'transparent' },
        itemStyle: { borderColor: '#0f172a', borderWidth: 2, gapWidth: 2 },
        levels: [
          { itemStyle: { borderColor: '#1e293b', borderWidth: 4, gapWidth: 4 }, upperLabel: { show: false } },
          { itemStyle: { borderColor: '#1e293b', borderWidth: 2, gapWidth: 2 }, colorSaturation: [0.35, 0.6] },
        ],
        data: config.data.map(d => ({
          name: d.name, value: d.value, itemStyle: { color: d.color },
          children: d.children?.map(c => ({ name: c.name, value: c.value })),
        })),
      }],
    };
  }

  createBandwidthGauge(config: {
    value: number;
    max?: number;
    title?: string;
    unit?: string;
    zones?: [number, string][];
  }): EChartsCoreOption {
    const max = config.max ?? 40;
    const zones = config.zones ?? [[0.3, '#059669'], [0.7, '#0ea5e9'], [1, '#f87171']];
    return {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '85%',
        startAngle: 220, endAngle: -40,
        min: 0, max,
        splitNumber: 8,
        pointer: { icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z', length: '55%', width: 8, offsetCenter: [0, '-10%'], itemStyle: { color: '#38bdf8' } },
        axisLine: { lineStyle: { width: 18, color: zones } },
        axisTick: { distance: -22, length: 6, lineStyle: { color: '#94a3b8', width: 1 } },
        splitLine: { distance: -26, length: 14, lineStyle: { color: '#94a3b8', width: 2 } },
        axisLabel: { color: '#64748b', distance: -14, fontSize: 10, fontFamily: 'monospace' },
        detail: { valueAnimation: true, formatter: `{value} ${config.unit ?? 'Gbps'}`, color: '#e2e8f0', fontSize: 20, fontFamily: 'monospace', fontWeight: 'bold', offsetCenter: [0, '40%'] },
        title: { offsetCenter: [0, '60%'], fontSize: 12, color: '#64748b', fontFamily: 'monospace' },
        data: [{ value: config.value, name: config.title ?? 'Throughput' }],
      }],
    };
  }
}
