import { Injectable } from '@angular/core';
import {
  ENTERPRISE_PAGE_SECTION,
  ENTERPRISE_SECTION,
  ENTERPRISE_SPACING,
  ENTERPRISE_COMPONENT,
  ENTERPRISE_RADIUS,
  ENTERPRISE_TRANSITION,
  ENTERPRISE_LAYOUT,
  ENTERPRISE_CONTAINER_INSET,
  CONTAINER_CLASS,
  CONTAINER_NARROW_CLASS,
  CONTAINER_WIDE_CLASS,
  SHELL,
} from '../design-system';

/**
 * Design system tokens exposed app-wide for templates.
 * Inject in components and use in templates: [ngClass]="ds.section.wrapper"
 */
@Injectable({ providedIn: 'root' })
export class DesignSystemService {
  /** Page section wrappers and containers (landing, dashboard sections) */
  readonly section = ENTERPRISE_PAGE_SECTION;
  /** Section vertical rhythm */
  readonly sectionRhythm = ENTERPRISE_SECTION;
  /** Spacing scale (gap, stack) */
  readonly spacing = ENTERPRISE_SPACING;
  /** Component-level (cards, forms, buttons) */
  readonly component = ENTERPRISE_COMPONENT;
  /** Border radius */
  readonly radius = ENTERPRISE_RADIUS;
  /** Transitions */
  readonly transition = ENTERPRISE_TRANSITION;
  /** Main layout (main area, card class, button group) */
  readonly layout = ENTERPRISE_LAYOUT;
  /** Container horizontal inset */
  readonly inset = ENTERPRISE_CONTAINER_INSET;
  /** Shell (nav height, main min-height) */
  readonly shell = SHELL;
  /** Legacy container classes (prefer section.container where possible) */
  readonly container = CONTAINER_CLASS;
  readonly containerNarrow = CONTAINER_NARROW_CLASS;
  readonly containerWide = CONTAINER_WIDE_CLASS;
}
