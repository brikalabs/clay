/**
 * Per-component token grouping. Used by the "By component" tab to render
 * a focused editor for a single component (Slots / Geometry / Typography
 * / Border / State / Motion).
 *
 * Pure: filters TOKEN_REGISTRY by `appliesTo`. The registry's `appliesTo`
 * field already records the component's kebab-case name (matches the
 * docs' component-registry slug) so no name translation is needed.
 */

import type { ResolvedTokenSpec } from '@brika/clay/tokens';
import { TOKEN_REGISTRY } from '@brika/clay/tokens';

export interface ComponentTokenGroup {
  readonly id: string;
  readonly label: string;
  readonly tokens: readonly ResolvedTokenSpec[];
}

/**
 * Every component-layer token that targets the given component.
 * Sorted by name within the registry's natural order. Returns [] for
 * components that have no Layer-2 tokens.
 */
export function tokensFor(componentName: string): readonly ResolvedTokenSpec[] {
  return TOKEN_REGISTRY.filter(
    (t) => t.layer === 'component' && t.appliesTo === componentName
  );
}

/**
 * Quick token count for the picker chip — avoid materialising the full
 * filtered array when callers only need the number.
 */
export function tokenCountFor(componentName: string): number {
  let n = 0;
  for (const t of TOKEN_REGISTRY) {
    if (t.layer === 'component' && t.appliesTo === componentName) n++;
  }
  return n;
}

/**
 * Group a component's tokens by category for accordion rendering. Keeps
 * a stable display order and drops empty groups.
 */
export function groupComponentTokens(
  tokens: readonly ResolvedTokenSpec[]
): readonly ComponentTokenGroup[] {
  const buckets = new Map<string, ResolvedTokenSpec[]>();
  for (const t of tokens) {
    const arr = buckets.get(t.category) ?? [];
    arr.push(t);
    buckets.set(t.category, arr);
  }

  const ORDER: ReadonlyArray<readonly [string, string]> = [
    ['color', 'Slots'],
    ['geometry', 'Geometry'],
    ['typography', 'Typography'],
    ['border', 'Border'],
    ['elevation', 'Elevation'],
    ['focus', 'Focus'],
    ['motion', 'Motion'],
    ['state', 'State'],
  ];

  const out: ComponentTokenGroup[] = [];
  for (const [category, label] of ORDER) {
    const items = buckets.get(category);
    if (items && items.length > 0) {
      out.push({
        id: `${category}-group`,
        label,
        tokens: [...items].sort((a, b) => a.name.localeCompare(b.name)),
      });
    }
  }
  return out;
}

/**
 * Lookup table for slot names that don't match their component name.
 * Used by inspect mode to resolve `data-slot="<x>"` → owning component.
 *
 * Most components set `data-slot` to the component name directly (button,
 * card, alert). A handful of multi-part components use slot names like
 * `accordion-trigger` that don't resolve via simple kebab-prefix split.
 */
const SLOT_TO_COMPONENT: Readonly<Record<string, string>> = {
  'accordion-item': 'accordion',
  'accordion-trigger': 'accordion',
  'accordion-content': 'accordion',
  'accordion-header': 'accordion',
  'card-header': 'card',
  'card-title': 'card',
  'card-description': 'card',
  'card-content': 'card',
  'card-footer': 'card',
  'dialog-overlay': 'dialog',
  'dialog-content': 'dialog',
  'dialog-header': 'dialog',
  'dialog-footer': 'dialog',
  'dialog-title': 'dialog',
  'dialog-description': 'dialog',
  'dialog-close': 'dialog',
  'alert-icon': 'alert',
  'alert-title': 'alert',
  'alert-description': 'alert',
  'alert-close': 'alert',
  'select-trigger': 'select',
  'select-content': 'select',
  'select-item': 'select',
  'select-value': 'select',
  'select-group': 'select',
  'select-label': 'select',
  'select-separator': 'select',
  'tabs-list': 'tabs',
  'tabs-trigger': 'tabs',
  'tabs-content': 'tabs',
  'field-label': 'field',
  'field-description': 'field',
  'field-error': 'field',
  'field-group': 'field',
  'field-set': 'field',
  'field-legend': 'field',
  'radio-group-item': 'radio-group',
};

export function componentForSlot(slot: string): string {
  return SLOT_TO_COMPONENT[slot] ?? slot;
}

/**
 * Resolve a DOM element to its owning component name by walking up the
 * tree looking for the nearest `[data-slot]`. Returns null when no slot
 * ancestor exists.
 */
export function resolveComponentFromElement(el: Element | null): string | null {
  let cursor: Element | null = el;
  while (cursor) {
    if (cursor instanceof HTMLElement) {
      const slot = cursor.dataset.slot;
      if (slot) return componentForSlot(slot);
    }
    cursor = cursor.parentElement;
  }
  return null;
}
