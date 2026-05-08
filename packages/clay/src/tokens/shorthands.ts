/**
 * Per-component shorthand utility derived from the token registry.
 *
 * Every component that registers Layer-2 tokens gets ONE Tailwind-ish
 * utility named after itself (`button`, `badge`, `card`, …). The class
 * fans out into every per-component-token CSS property, height,
 * padding, gap, font-*, transition-*, border-*, backdrop-filter, so
 * the consumer side is just `<button class="button">`, no inline
 * `h-(--button-height)` / `gap-(--button-gap)` plumbing.
 *
 * The Tailwind plugin registers these classes via `addComponents`,
 * which sits in the components layer; any utilities-layer override
 * (`h-10`, `font-mono`, …) wins through Tailwind v4's natural cascade.
 */

import { TOKEN_REGISTRY } from './registry';
import type { ResolvedTokenSpec, TokenCategory } from './types';

/**
 * Map of `<component>-<suffix>` tail → CSS property the bundle should
 * set. Token suffixes that aren't here (`filled-container`, `radius`,
 * `shadow`, `track-width`, …) stay accessible through their dedicated
 * Tailwind utilities (`bg-button-filled-container`, `rounded-button`,
 * `shadow-card`) or component-specific inline references.
 */
const SUFFIX_TO_PROPERTY: Readonly<Record<string, string>> = {
  height: 'height',
  'padding-x': 'padding-inline',
  'padding-y': 'padding-block',
  gap: 'gap',
  'font-family': 'font-family',
  'font-size': 'font-size',
  'font-weight': 'font-weight',
  'line-height': 'line-height',
  'letter-spacing': 'letter-spacing',
  'text-transform': 'text-transform',
  duration: 'transition-duration',
  easing: 'transition-timing-function',
  'border-width': 'border-width',
  'border-style': 'border-style',
};

const BUNDLED_CATEGORIES: ReadonlySet<TokenCategory> = new Set([
  'geometry',
  'typography',
  'motion',
  'border',
]);

interface SpecialSlot {
  readonly property: string;
  readonly value: (tokenName: string) => string;
}

/**
 * Slot-token suffixes that participate in the bundle but need a
 * non-trivial CSS value (a wrapper function, a fallback, …).
 */
const SPECIAL_SLOTS: Readonly<Record<string, SpecialSlot>> = {
  'backdrop-blur': {
    property: 'backdrop-filter',
    value: (name) => `blur(var(--${name}, 0px))`,
  },
};

export interface ShorthandIndex {
  /** Class name (without leading `.`) → CSS-in-JS declarations. */
  readonly rules: Readonly<Record<string, Readonly<Record<string, string>>>>;
  /** Every token name referenced by any rule above. */
  readonly tokenRefs: ReadonlySet<string>;
}

function buildIndex(registry: readonly ResolvedTokenSpec[]): ShorthandIndex {
  const rules: Record<string, Record<string, string>> = {};
  const tokenRefs = new Set<string>();

  for (const token of registry) {
    if (token.layer !== 'component' || !token.appliesTo) {
      continue;
    }
    // Identity check: token name must be exactly `<appliesTo>-<suffix>`.
    // Guards against accidental cross-component capture (e.g. `dialog-overlay-*`
    // does not belong to `dialog`).
    const prefix = `${token.appliesTo}-`;
    if (!token.name.startsWith(prefix)) {
      continue;
    }
    const suffix = token.name.slice(prefix.length);

    const special = SPECIAL_SLOTS[suffix];
    let property: string | undefined;
    let value: string;
    if (special) {
      property = special.property;
      value = special.value(token.name);
    } else if (BUNDLED_CATEGORIES.has(token.category)) {
      property = SUFFIX_TO_PROPERTY[suffix];
      value = `var(--${token.name})`;
    } else {
      continue;
    }
    if (!property) {
      continue;
    }

    const declarations = (rules[token.appliesTo] ??= {});
    declarations[property] = value;
    tokenRefs.add(token.name);
  }

  return { rules, tokenRefs };
}

/** Eagerly computed against the live `TOKEN_REGISTRY`. One pass, shared by every consumer. */
export const SHORTHAND_INDEX: ShorthandIndex = buildIndex(TOKEN_REGISTRY);

/** Pure form for tests that want to feed a synthetic registry. */
export function buildShorthandIndex(registry: readonly ResolvedTokenSpec[]): ShorthandIndex {
  return buildIndex(registry);
}
