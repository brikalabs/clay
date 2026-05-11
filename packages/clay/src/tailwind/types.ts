/**
 * Internal types + per-`TokenType` metadata + per-`TailwindNamespace`
 * routing tables for the Clay Tailwind plugin. Split out of
 * `tailwind.ts` so each module stays under 300 lines and the shapes
 * are reusable from the test split.
 */

import type { TailwindNamespace, TokenType } from '../tokens/types';

// `:where(...)` collapses to specificity 0 so downstream consumers can
// override either the dark block or the bare `border` reset with their
// own simpler selectors, no `!important` ladder needed.
export const DARK_SELECTOR =
  ':where(.dark, [data-mode="dark"]):root, :where(.dark, [data-mode="dark"])[data-theme="clay"]';

export const ROOT_SELECTOR = ':root, [data-theme="clay"]';

// Cascade-friendly selectors for the build-time theme bake. These match
// exactly what `renderThemeStyleSheet` (the runtime path) emits, so a
// later `applyTheme(other)` call still wins through later cascade order.
export const BAKED_THEME_ROOT_SELECTOR = ':root';
export const BAKED_THEME_DARK_SELECTOR = ':is(.dark, [data-mode="dark"]):root';

/**
 * Per-`TokenType` metadata: the CSS `@property` `syntax` descriptor we can
 * register for it (when omitted the type isn't registrable, keyword unions
 * like `border-style` and shapes the spec doesn't describe like `<shadow>`),
 * and the `theme.extend` bucket the type maps to (when omitted the type
 * doesn't surface as a Tailwind utility through `theme.extend`).
 *
 * Single source of truth, adding a new `TokenType` means adding one row here.
 */
export const TYPE_INFO: Readonly<
  Record<TokenType, { readonly syntax?: string; readonly bucket?: string }>
> = {
  color: { syntax: '<color>', bucket: 'colors' },
  size: { syntax: '<length>', bucket: 'spacing' },
  radius: { syntax: '<length>', bucket: 'borderRadius' },
  'border-width': { syntax: '<length>' },
  'border-style': {},
  shadow: { bucket: 'boxShadow' },
  duration: { syntax: '<time>', bucket: 'transitionDuration' },
  easing: { bucket: 'transitionTimingFunction' },
  'font-family': { bucket: 'fontFamily' },
  'font-size': { syntax: '<length>', bucket: 'fontSize' },
  'font-weight': { syntax: '<number>' },
  'line-height': { syntax: '<number>' },
  'letter-spacing': { syntax: '<length>' },
  'text-transform': {},
  'corner-shape': {},
  opacity: { syntax: '<number>', bucket: 'opacity' },
  blur: { syntax: '<length>', bucket: 'blur' },
};

export type TypeInfoEntry = (typeof TYPE_INFO)[TokenType];

/**
 * Per-token-type utilities registered through `matchUtilities` rather than
 * `theme.extend`. These types either lack a native Tailwind theme bucket
 * (`border-style`, `text-transform`, `corner-shape`) or own a bucket whose
 * derived prefix would collide with another namespace (`fontWeight` vs.
 * `fontFamily` both produce `font-<name>`). The `matchUtilities` path lets
 * us pin an explicit, unambiguous prefix per type.
 *
 * Order is the registration order in the plugin handler. Each entry maps a
 * `TailwindNamespace` to the utility prefix it generates and the CSS
 * declaration property the value flows into.
 */
export const MATCH_UTILITY_NAMESPACES: ReadonlyArray<{
  readonly ns: TailwindNamespace;
  readonly prefix: string;
  readonly cssProp: string;
}> = [
  { ns: 'border-w', prefix: 'border-w', cssProp: 'border-width' },
  { ns: 'border-style', prefix: 'border-style', cssProp: 'border-style' },
  { ns: 'font-weight', prefix: 'font-weight', cssProp: 'font-weight' },
  { ns: 'leading', prefix: 'leading', cssProp: 'line-height' },
  { ns: 'tracking', prefix: 'tracking', cssProp: 'letter-spacing' },
  { ns: 'case', prefix: 'case', cssProp: 'text-transform' },
  { ns: 'corner', prefix: 'corner', cssProp: 'corner-shape' },
];

export const MATCH_UTILITY_BY_NAMESPACE: Partial<
  Record<TailwindNamespace, (typeof MATCH_UTILITY_NAMESPACES)[number]>
> = Object.fromEntries(MATCH_UTILITY_NAMESPACES.map((cfg) => [cfg.ns, cfg]));

/**
 * Per CSS spec, `@property`'s `initial-value` must be a *computed* value,
 * `var()` references and other un-resolved relative values are rejected. Any
 * default that contains `var(` is therefore not registrable; the token still
 * lands in `:root` via `buildBaseRules()`, just without typed validation +
 * smooth-animation pairing.
 */
export function isLiteral(value: string): boolean {
  return !value.includes('var(');
}

export interface BaseRules {
  readonly properties: Record<string, Record<string, string>>;
  readonly root: Record<string, string>;
  readonly dark: Record<string, string>;
}

export interface PluginContributions {
  readonly base: BaseRules;
  readonly themeExtend: Record<string, Record<string, string>>;
  /**
   * Per-namespace value map for the `matchUtilities`-driven utility
   * families (`border-w-<name>`, `leading-<name>`, …). Outer key is the
   * `TailwindNamespace`, inner key is the utility name (token's
   * `utilityAlias` or full token name), inner value is the resolved CSS
   * value (`var(--name)` for non-component tokens, `var(--name, <fallback>)`
   * for component tokens so utilities still resolve when a slot is blank).
   */
  readonly matchValues: Record<string, Record<string, string>>;
  readonly rootMembership: ReadonlySet<string>;
}
