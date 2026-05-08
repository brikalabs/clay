/**
 * Tailwind v4 plugin, contributes everything Clay needs in one place.
 *
 * Reads the TypeScript token registry at compile time and emits, in one pass:
 *
 *   1. `@property --token { ... }` blocks for every registry default whose
 *      type maps to a CSS descriptor and whose value is literal (so custom
 *      themes get parse-time validation + animatable tokens).
 *   2. `:root, [data-theme="clay"] { --token: default; ... }` for every
 *      registry entry. Component tokens with `var(...)` chains land here
 *      too, the chain still resolves because the upstream tokens are also
 *      present at `:root`. This is what hand-authored CSS / Tailwind v4
 *      arbitrary classes (`gap-(--button-gap)`, `var(--button-padding-x)`)
 *      need to see.
 *   3. A dark-mode override block, tokens with a distinct `defaultDark`.
 *   4. `theme.extend.{colors,borderRadius,boxShadow,...}` so utilities like
 *      `bg-slider-fill`, `rounded-slider`, `shadow-slider-thumb`,
 *      `duration-card`, `ease-card` resolve through the same registry.
 *   5. Per-component shorthand utilities (`button`, `card`, ...) registered
 *      via `matchUtilities` so v4's JIT prunes the unused ones.
 *
 * Non-default built-in themes (`dracula`, `brutalist`, ...) are NOT baked
 * into CSS. They live as plain `ThemeConfig` JSON exports and activate
 * through the same runtime path as user-authored themes (`applyTheme(theme)`
 * injects a `<style>` tag, or `<ThemeScope theme>` scopes via inline-style).
 * This keeps the bundle small AND makes user-built custom themes a first-class
 * peer of the built-ins.
 *
 * Usage from a consumer's CSS entry:
 *
 *   @import "tailwindcss";
 *   @plugin "@brika/clay/tailwind";
 *
 * Or via Clay's bundled stylesheet (`@import "@brika/clay/styles"`), which
 * pulls this plugin in for you.
 */

import plugin from 'tailwindcss/plugin';
import { TOKEN_REGISTRY } from './tokens/registry';
import { SHORTHAND_INDEX } from './tokens/shorthands';
import type { ResolvedTokenSpec, TokenType } from './tokens/types';

// `:where(...)` collapses to specificity 0 so downstream consumers can
// override either the dark block or the bare `border` reset with their
// own simpler selectors, no `!important` ladder needed.
const DARK_SELECTOR =
  ':where(.dark, [data-mode="dark"]):root, :where(.dark, [data-mode="dark"])[data-theme="clay"]';

const ROOT_SELECTOR = ':root, [data-theme="clay"]';

/**
 * Per-`TokenType` metadata: the CSS `@property` `syntax` descriptor we can
 * register for it (when omitted the type isn't registrable, keyword unions
 * like `border-style` and shapes the spec doesn't describe like `<shadow>`),
 * and the `theme.extend` bucket the type maps to (when omitted the type
 * doesn't surface as a Tailwind utility through `theme.extend`).
 *
 * Single source of truth, adding a new `TokenType` means adding one row here.
 */
const TYPE_INFO: Readonly<
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

/**
 * Per CSS spec, `@property`'s `initial-value` must be a *computed* value,
 * `var()` references and other un-resolved relative values are rejected. Any
 * default that contains `var(` is therefore not registrable; the token still
 * lands in `:root` via `buildRoot()`, just without typed validation +
 * smooth-animation pairing.
 */
function isLiteral(value: string): boolean {
  return !value.includes('var(');
}

interface BaseRules {
  readonly properties: Record<string, Record<string, string>>;
  readonly root: Record<string, string>;
  readonly dark: Record<string, string>;
}

/**
 * Compute the set of token names that genuinely need a `:root` default,
 * derived deterministically from the registry alone (plus the precomputed
 * shorthand bundle):
 *
 *   - Layer-0 / Layer-1 tokens: always — they're the cascade roots.
 *   - Component tokens with literal defaults: always — concrete value.
 *   - Component tokens with `var(...)` chain defaults: only if some other
 *     token's default references them, the shorthand bundle (`button`,
 *     `card`, ...) consumes them, OR they're flagged `consumedByCss`
 *     (hand-authored `var(--name)` references in component .tsx / .css).
 *
 * Everything else (component tokens consumed exclusively through the
 * auto-generated Tailwind utilities like `bg-button-fill`) is reachable
 * through the utility's own `var(--name, <fallback>)` and so doesn't
 * need to land in `:root`. Skipping them trims a few KB of CSS without
 * changing rendered behaviour.
 */
function buildRootMembership(
  registry: readonly ResolvedTokenSpec[],
  shorthandRefs: ReadonlySet<string> = new Set()
): ReadonlySet<string> {
  const members = new Set<string>();
  for (const t of registry) {
    if (t.layer !== 'component' || !t.defaultLight.startsWith('var(') || t.consumedByCss) {
      members.add(t.name);
      continue;
    }
    if (shorthandRefs.has(t.name)) {
      members.add(t.name);
    }
  }
  // Walk every token's defaults, anything referenced via `var(--X)` from
  // another spec must also land in `:root` so the chain resolves.
  const REF = /var\(--([a-z][a-z0-9-]*)/g;
  for (const t of registry) {
    for (const value of [t.defaultLight, t.defaultDark]) {
      if (!value) continue;
      for (const match of value.matchAll(REF)) {
        members.add(match[1]);
      }
    }
  }
  return members;
}

/**
 * Walk the registry once, returning every `addBase` payload the plugin
 * needs. Pure, no side effects, easy to test.
 */
function buildBaseRules(
  registry: readonly ResolvedTokenSpec[],
  shorthandRefs: ReadonlySet<string> = new Set()
): BaseRules {
  const properties: Record<string, Record<string, string>> = {};
  const root: Record<string, string> = {};
  const dark: Record<string, string> = {};
  const rootMembers = buildRootMembership(registry, shorthandRefs);

  for (const token of registry) {
    const cssVar = `--${token.name}`;
    if (rootMembers.has(token.name)) {
      root[cssVar] = token.defaultLight;
    }
    if (token.defaultDark && token.defaultDark !== token.defaultLight) {
      dark[cssVar] = token.defaultDark;
    }

    // Tailwind v4's `text-*` utility consumes a paired `--text-*--line-height`
    // declaration so font-size and line-height resolve in one class.
    if (token.lineHeight) {
      root[`${cssVar}--line-height`] = token.lineHeight;
    }

    const syntax = TYPE_INFO[token.type].syntax;
    if (syntax && isLiteral(token.defaultLight)) {
      properties[`@property ${cssVar}`] = {
        syntax: `"${syntax}"`,
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

  return { properties, root, dark };
}

type ThemeExtend = Record<string, Record<string, string>>;

/**
 * Map every namespaced registry token into the v3-style `theme.extend`
 * config Tailwind v4 still consumes through its compat layer. This is what
 * turns `bg-slider-fill`, `rounded-slider`, `shadow-slider-thumb`,
 * `duration-card`, `ease-card`, etc. into real utilities.
 *
 * Component tokens get a `var(..., <fallback>)` so the utility still resolves
 * when a theme leaves the slot blank, the fallback is the registry default
 * (typically a Layer-1 role).
 */
function buildThemeExtend(registry: readonly ResolvedTokenSpec[]): ThemeExtend {
  const extend: ThemeExtend = {};
  for (const token of registry) {
    const ns = token.tailwindNamespace;
    if (!ns || ns === 'none') {
      continue;
    }
    // Tailwind's `borderWidth.DEFAULT` is what feeds the bare `border-1`
    // utility, the only `default` namespace consumer in the registry.
    if (ns === 'default' && token.name === 'border-width') {
      (extend.borderWidth ??= {}).DEFAULT = `var(--${token.name})`;
      continue;
    }
    const bucket = TYPE_INFO[token.type].bucket;
    if (!bucket) {
      continue;
    }
    const key = token.utilityAlias ?? token.name;
    const value =
      token.layer === 'component'
        ? `var(--${token.name}, ${token.defaultLight})`
        : `var(--${token.name})`;
    (extend[bucket] ??= {})[key] = value;
  }
  return extend;
}

/**
 * Public for tests, snapshot-style assertions and benchmarks. The two
 * builders are pure functions of the registry, calling them with the
 * live registry produces exactly what the plugin emits.
 */
export const __internal = {
  buildBaseRules,
  buildRootMembership,
  buildThemeExtend,
} as const;

const baseRules = buildBaseRules(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs);
const themeExtend = buildThemeExtend(TOKEN_REGISTRY);

// Pre-build the shorthand-utility map once so the plugin handler doesn't
// allocate it on every Tailwind compile pass.
const shorthandUtilities: Record<string, () => Record<string, string>> = {};
for (const [name, declarations] of Object.entries(SHORTHAND_INDEX.rules)) {
  shorthandUtilities[name] = () => declarations;
}

const clayTailwindPlugin: ReturnType<typeof plugin> = plugin(
  ({ addBase, matchUtilities }) => {
    // Combine `:root` defaults with the bare `border` reset into a single
    // `addBase` call so Tailwind builds one base-layer AST node. The
    // border-color reset makes Tailwind v4's bare `border` utility
    // resolve to `var(--border)` instead of `currentColor`, without
    // this, components that use the bare `border` class render in the
    // inherited text color rather than the themed border token.
    addBase({
      ...baseRules.properties,
      '*, ::before, ::after': { 'border-color': 'var(--border)' },
      [ROOT_SELECTOR]: baseRules.root,
      ...(Object.keys(baseRules.dark).length > 0 ? { [DARK_SELECTOR]: baseRules.dark } : {}),
    });
    // Per-component shorthand utilities (`.button`, `.badge`, ...). The JS
    // plugin API has two ways to emit utilities: `addUtilities` (always-emit,
    // no JIT) and `matchUtilities` (JIT-aware, emits only when the class name
    // appears in scanned source). We use the latter with a `DEFAULT`-only
    // value map so each entry behaves like a static utility but still
    // participates in v4's tree-shaking.
    matchUtilities(shorthandUtilities, { values: { DEFAULT: '' } });
  },
  { theme: { extend: themeExtend } }
);

export default clayTailwindPlugin;
