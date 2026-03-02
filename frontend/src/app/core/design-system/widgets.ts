/**
 * Advanced widgets — single "catch" for consistent UX.
 * Use the same card class and registry so all widgets (charts, stat cards, KPI panels)
 * share one look and one data source.
 */

/** CSS class for any advanced widget container (chart panel, stat card, KPI card). */
export const ADVANCED_WIDGET_CARD_CLASS = 'advanced-widget-card';

/** Combines theme card with advanced-widget padding and radius. Use on p-card or div wrappers. */
export const ADVANCED_WIDGET_CARD_CLASSES = `${ADVANCED_WIDGET_CARD_CLASS} theme-card`;
