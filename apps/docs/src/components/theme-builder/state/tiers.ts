/**
 * Curated token surface for the Foundation tab. The editor groups
 * consecutive entries sharing the same `groupId` under one accordion
 * section; render order matches the array.
 */

import type { ResolvedTokenSpec } from '@brika/clay/tokens';
import { TOKEN_REGISTRY, TOKENS_BY_NAME } from '@brika/clay/tokens';

const COLOR_BRAND_SURFACE: readonly string[] = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'accent',
  'accent-foreground',
  'muted',
  'muted-foreground',
  'border',
  'input',
  'ring',
];

const COLOR_FEEDBACK: readonly string[] = [
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
  'info',
  'info-foreground',
  'destructive',
  'destructive-foreground',
];

export interface BasicGroup {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly tokens: readonly ResolvedTokenSpec[];
}

function group(
  id: string,
  label: string,
  hint: string,
  names: readonly string[]
): BasicGroup {
  const tokens = names
    .map((n) => TOKENS_BY_NAME[n])
    .filter((t): t is ResolvedTokenSpec => t !== undefined);
  return { id, label, hint, tokens };
}

/**
 * Ordered groups shown on the Foundation tab. The brand/surface +
 * feedback color groups render with a side-by-side light/dark layout;
 * everything else uses single-column controls.
 */
export const BASIC_GROUPS: readonly BasicGroup[] = [
  group(
    'brand-surface',
    'Brand & surface colors',
    'Page, cards, popovers, and the primary/secondary roles.',
    COLOR_BRAND_SURFACE
  ),
  group(
    'feedback',
    'Feedback colors',
    'Success, warning, info, and destructive families.',
    COLOR_FEEDBACK
  ),
  group('geometry', 'Geometry', 'Base radius, spacing, type size, and font families.', [
    'radius',
    'spacing',
    'text-base',
    'font-sans',
    'font-mono',
    'backdrop-blur',
  ]),
  group('border', 'Border', 'Default border thickness and style.', [
    'border-width',
    'border-style',
  ]),
  group('motion', 'Motion', 'Base transition duration and easing.', [
    'motion-duration',
    'motion-easing',
  ]),
  group('focus', 'Focus ring', 'Focus ring width and offset.', ['ring-width', 'ring-offset']),
  // "More colors" — every other Layer-1 role color (sidebar, status,
  // data viz, tonal containers, surface scale). Built dynamically so
  // new role colors automatically appear without curating a list.
  buildSecondaryColorsGroup(),
];

function buildSecondaryColorsGroup(): BasicGroup {
  const known = new Set([...COLOR_BRAND_SURFACE, ...COLOR_FEEDBACK]);
  const tokens = TOKEN_REGISTRY.filter(
    (t) => t.layer === 'role' && t.category === 'color' && !known.has(t.name)
  );
  return {
    id: 'more-colors',
    label: 'More colors',
    hint: 'Sidebar, status, data viz, tonal containers, and surface scale.',
    tokens,
  };
}
