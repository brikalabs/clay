/**
 * Pure helpers for parsing and serialising token-aware length/duration
 * expressions. Most Clay component defaults look like:
 *
 *   var(--radius)
 *   calc(var(--radius) - 0.25rem)
 *   calc(var(--spacing) * 2)
 *   max(0rem, calc(var(--radius) - 0.625rem))
 *
 * For round-tripping we recognise the first three forms (the most common
 * "scale a base scalar" pattern). Everything else falls back to free
 * text so unusual expressions survive intact.
 */

import { TOKEN_REGISTRY } from '@brika/clay/tokens';
import type { ResolvedTokenSpec } from '@brika/clay/tokens';

export interface ParsedExpression {
  /** CSS var token name (e.g. `'spacing'` for `var(--spacing)`). */
  readonly tokenName: string;
  /** Multiplier applied to the var, or 1 when the expression is bare `var(--x)`. */
  readonly multiplier: number;
}

const VAR_PATTERN = /^var\(--([a-z][a-z0-9-]*)\)$/i;
const CALC_MULT_PATTERN =
  /^calc\(\s*var\(--([a-z][a-z0-9-]*)\)\s*\*\s*(-?\d+(?:\.\d+)?)\s*\)$/i;
const CALC_DIV_PATTERN =
  /^calc\(\s*var\(--([a-z][a-z0-9-]*)\)\s*\/\s*(-?\d+(?:\.\d+)?)\s*\)$/i;

/**
 * Parse a value into a `ParsedExpression`, or null when it isn't one of
 * the recognised shapes. Whitespace tolerated.
 */
export function parseExpression(raw: string): ParsedExpression | null {
  const v = raw.trim();
  if (!v) return null;
  const bare = VAR_PATTERN.exec(v);
  if (bare) return { tokenName: bare[1], multiplier: 1 };
  const mult = CALC_MULT_PATTERN.exec(v);
  if (mult) return { tokenName: mult[1], multiplier: Number.parseFloat(mult[2]) };
  const div = CALC_DIV_PATTERN.exec(v);
  if (div) {
    const n = Number.parseFloat(div[2]);
    if (n !== 0) return { tokenName: div[1], multiplier: 1 / n };
  }
  return null;
}

/**
 * Serialise a parsed expression back to a CSS string. `multiplier === 1`
 * collapses to bare `var(--token)`; other values become a `calc(...)`.
 */
export function serialiseExpression({ tokenName, multiplier }: ParsedExpression): string {
  if (multiplier === 1) return `var(--${tokenName})`;
  // Trim trailing zeros for readability.
  const m = Number.parseFloat(multiplier.toFixed(4)).toString();
  return `calc(var(--${tokenName}) * ${m})`;
}

/**
 * Length-axis types are all CSS-interchangeable — a `size`-typed
 * padding can legitimately reference `var(--radius)` for a
 * "padding scales with corner radius" effect, and so on. Pool them.
 *
 * Duration stays its own bucket — multiplying a duration by a length
 * doesn't make sense.
 */
const LENGTH_TYPES: readonly string[] = [
  'size',
  'radius',
  'border-width',
  'font-size',
  'line-height',
  'letter-spacing',
  'blur',
];

const COMPATIBLE_TYPES: Readonly<Record<string, readonly string[]>> = {
  radius: LENGTH_TYPES,
  size: LENGTH_TYPES,
  'border-width': LENGTH_TYPES,
  'font-size': LENGTH_TYPES,
  'line-height': LENGTH_TYPES,
  'letter-spacing': LENGTH_TYPES,
  blur: LENGTH_TYPES,
  duration: ['duration'],
};

/**
 * Suggest token references compatible with the given target type.
 * Returns scalars + role tokens (the cleanly-named ones), excluding
 * component-layer tokens which are too noisy as references.
 *
 * NOTE: We don't filter on `themePath` here — many useful role
 * tokens (the radius scale, motion duration channels, typography
 * sizes) are derived via `calc()` from a base scalar and have no
 * direct theme override. Users can still REFERENCE them in their
 * own expressions, which is the picker's whole purpose.
 */
export function compatibleTokens(targetType: string): readonly ResolvedTokenSpec[] {
  const accepted = COMPATIBLE_TYPES[targetType];
  if (!accepted) return [];
  return TOKEN_REGISTRY.filter(
    (t) =>
      (t.layer === 'scalar' || t.layer === 'role') &&
      accepted.includes(t.type)
  );
}

/**
 * Resolve a CSS expression to its computed pixel value by writing it
 * onto a hidden DOM element and reading `getBoundingClientRect`.
 * Returns null when the expression is unparseable or DOM is unavailable
 * (SSR). The element inherits document-level styles so `var()` chains
 * resolve against whatever theme is currently applied.
 */
export function computePixels(expression: string): number | null {
  if (typeof document === 'undefined') return null;
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.contain = 'strict';
  probe.style.height = expression;
  probe.style.width = '0';
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();
  return Number.isFinite(px) ? px : null;
}

/**
 * Quick-pick multiplier chips. Covers the common "scale a base unit"
 * patterns Clay's defaults use ("padding-x = spacing × 4" etc.).
 */
export const MULTIPLIER_PRESETS: readonly number[] = [
  0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 6, 8,
];
