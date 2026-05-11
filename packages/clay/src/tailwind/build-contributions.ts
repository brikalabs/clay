/**
 * Single-pass walk over the registry that produces every artifact the
 * Tailwind plugin needs (`:root`, dark block, `@property` blocks,
 * `theme.extend`, per-namespace matchUtilities values, and the
 * `:root`-membership set).
 *
 * Extracted from `tailwind.ts` so it can be unit-tested directly and
 * the plugin entry stays compact.
 */

import type { ResolvedTokenSpec } from '../tokens/types';
import { scanVarRefs } from './scan-var-refs';
import {
  type PluginContributions,
  type TypeInfoEntry,
  MATCH_UTILITY_BY_NAMESPACE,
  TYPE_INFO,
  isLiteral,
} from './types';

/**
 * Membership rule for a single token. See `buildContributions` doc
 * comment for the full rationale. A component token with a `var(...)`
 * chain only lands in `:root` when something forces it: shorthand
 * bundle, hand-authored CSS, or another token's cascade reference
 * (handled in pass 2).
 */
function shouldEmitToRoot(
  token: ResolvedTokenSpec,
  shorthandRefs: ReadonlySet<string>
): boolean {
  if (token.layer !== 'component') return true;
  if (!token.defaultLight.startsWith('var(')) return true;
  if (token.consumedByCss) return true;
  return shorthandRefs.has(token.name);
}

/**
 * Emit `@property` blocks for the token's main value and (optionally)
 * its line-height pairing. Only registrable types with literal defaults
 * get blocks, `var(...)` chains can't be the `initial-value` of an
 * `@property`.
 */
function emitProperties(
  token: ResolvedTokenSpec,
  info: TypeInfoEntry,
  properties: Record<string, Record<string, string>>
): void {
  const cssVar = `--${token.name}`;
  if (info.syntax && isLiteral(token.defaultLight)) {
    properties[`@property ${cssVar}`] = {
      syntax: `"${info.syntax}"`,
      inherits: 'true',
      'initial-value': token.defaultLight,
    };
  }
  if (token.lineHeight && isLiteral(token.lineHeight)) {
    properties[`@property ${cssVar}--line-height`] = {
      syntax: '"<number>"',
      inherits: 'true',
      'initial-value': token.lineHeight,
    };
  }
}

/**
 * Place the token's `var(--name)` reference under the matching
 * `theme.extend` bucket (`colors`, `spacing`, `borderRadius`, ...).
 * The bare `border-width` token gets a `DEFAULT` slot so Tailwind's
 * unprefixed `border` utility resolves to it.
 */
function emitThemeExtend(
  token: ResolvedTokenSpec,
  info: TypeInfoEntry,
  themeExtend: Record<string, Record<string, string>>
): void {
  const ns = token.tailwindNamespace;
  if (!ns || ns === 'none') return;
  const cssVar = `--${token.name}`;
  if (ns === 'default' && token.name === 'border-width') {
    themeExtend.borderWidth ??= {};
    themeExtend.borderWidth.DEFAULT = `var(${cssVar})`;
    return;
  }
  if (!info.bucket) return;
  themeExtend[info.bucket] ??= {};
  const bucket = themeExtend[info.bucket];
  bucket[token.utilityAlias ?? token.name] =
    token.layer === 'component'
      ? `var(${cssVar}, ${token.defaultLight})`
      : `var(${cssVar})`;
}

/**
 * Place the token's resolved CSS value under the per-namespace
 * `matchUtilities` value map. Component tokens use a fallback chain so
 * the utility renders even when the slot resolves through a `var(...)`
 * chain with no `:root` declaration of its own.
 */
function emitMatchValue(
  token: ResolvedTokenSpec,
  matchValues: Record<string, Record<string, string>>
): void {
  const ns = token.tailwindNamespace;
  if (!ns || !MATCH_UTILITY_BY_NAMESPACE[ns]) return;
  const cssVar = `--${token.name}`;
  const utilityName = token.utilityAlias ?? token.name;
  matchValues[ns] ??= {};
  matchValues[ns][utilityName] =
    token.layer === 'component'
      ? `var(${cssVar}, ${token.defaultLight})`
      : `var(${cssVar})`;
}

/**
 * Single-pass walk over the registry that produces every artifact the
 * plugin needs. Replaces three separate walks (membership, base rules,
 * theme.extend) with one, on the live registry the combined cost is
 * ~5x cheaper than the sum of the previous calls.
 *
 * Membership rules (which tokens land in `:root`):
 *   - Layer-0 / Layer-1 tokens: always, they're the cascade roots.
 *   - Component tokens with literal defaults: always, concrete value.
 *   - Component tokens with `var(...)` chain defaults: only if some
 *     other token's default references them, the shorthand bundle
 *     consumes them, OR they're flagged `consumedByCss`. Component
 *     tokens consumed exclusively through the auto-generated Tailwind
 *     utilities reach their value via the utility's
 *     `var(--name, <fallback>)` and don't need a `:root` declaration.
 */
export function buildContributions(
  registry: readonly ResolvedTokenSpec[],
  shorthandRefs: ReadonlySet<string> = new Set()
): PluginContributions {
  const properties: Record<string, Record<string, string>> = {};
  const root: Record<string, string> = {};
  const dark: Record<string, string> = {};
  const themeExtend: Record<string, Record<string, string>> = {};
  const matchValues: Record<string, Record<string, string>> = {};
  const rootMembership = new Set<string>();

  // Pass 1: classify membership + emit theme.extend, properties, dark in one go.
  for (const token of registry) {
    if (shouldEmitToRoot(token, shorthandRefs)) {
      rootMembership.add(token.name);
    }

    const cssVar = `--${token.name}`;

    if (token.defaultDark && token.defaultDark !== token.defaultLight) {
      dark[cssVar] = token.defaultDark;
    }

    // Tailwind v4's `text-*` utility consumes a paired `--text-*--line-height`
    // declaration so font-size and line-height resolve in one class.
    if (token.lineHeight) {
      root[`${cssVar}--line-height`] = token.lineHeight;
    }

    const info = TYPE_INFO[token.type];
    emitProperties(token, info, properties);
    emitThemeExtend(token, info, themeExtend);
    emitMatchValue(token, matchValues);
  }

  // Pass 2: cascade scan, anything referenced from another spec's default
  // must land in `:root` so the chain resolves.
  for (const token of registry) {
    scanVarRefs(token.defaultLight, (n) => rootMembership.add(n));
    if (token.defaultDark) {
      scanVarRefs(token.defaultDark, (n) => rootMembership.add(n));
    }
  }

  // Pass 3: emit `:root` for every membership entry.
  for (const token of registry) {
    if (rootMembership.has(token.name)) {
      root[`--${token.name}`] = token.defaultLight;
    }
  }

  return { base: { properties, root, dark }, themeExtend, matchValues, rootMembership };
}
