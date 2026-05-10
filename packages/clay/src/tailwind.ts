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
 * into CSS by default. They live as plain `ThemeConfig` JSON exports and
 * activate through the runtime path (`applyTheme(theme)` injects a `<style>`
 * tag, or `<ThemeScope theme>` scopes via inline-style). Consumers that
 * commit to a single non-default theme can also bake it at build time via
 * the plugin's `theme` option, see `ClayTailwindOptions` below.
 *
 * Usage from a consumer's CSS entry:
 *
 *   @import "tailwindcss";
 *   @plugin "@brika/clay/tailwind";              // default Clay theme
 *   @plugin "@brika/clay/tailwind" {             // bake "ocean" at build time
 *     theme: ocean;
 *   }
 *
 * Or via Clay's bundled stylesheet (`@import "@brika/clay/styles"`), which
 * pulls this plugin in for you.
 */

import { readFileSync } from 'node:fs';
import { isAbsolute, resolve as resolvePath } from 'node:path';

import plugin from 'tailwindcss/plugin';
import * as PRESETS from './themes/presets';
import { flattenTheme } from './themes/flatten';
import type { ThemeConfig } from './themes/types';
import { TOKEN_REGISTRY } from './tokens/registry';
import { SHORTHAND_INDEX } from './tokens/shorthands';
import type { ResolvedTokenSpec, TailwindNamespace, TokenType } from './tokens/types';

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
const MATCH_UTILITY_NAMESPACES: ReadonlyArray<{
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

const MATCH_UTILITY_BY_NAMESPACE: Partial<Record<TailwindNamespace, (typeof MATCH_UTILITY_NAMESPACES)[number]>> =
  Object.fromEntries(MATCH_UTILITY_NAMESPACES.map((cfg) => [cfg.ns, cfg]));

/**
 * Per CSS spec, `@property`'s `initial-value` must be a *computed* value,
 * `var()` references and other un-resolved relative values are rejected. Any
 * default that contains `var(` is therefore not registrable; the token still
 * lands in `:root` via `buildBaseRules()`, just without typed validation +
 * smooth-animation pairing.
 */
function isLiteral(value: string): boolean {
  return !value.includes('var(');
}

/**
 * Fast `var(--name)` reference scanner, faster than `String.matchAll(regex)`
 * because it avoids regex-engine overhead and the `RegExpExecArray`
 * allocation per match (~10x cheaper on the registry-sized walks). Calls
 * `consume(name)` for every reference found in `value`.
 *
 * Token names match `[a-z][a-z0-9-]*` per the registry's invariant; we trust
 * the registry to enforce that and just scan until the first non-name byte.
 */
function scanVarRefs(value: string, consume: (name: string) => void): void {
  const NEEDLE = 'var(--';
  let from = 0;
  while (true) {
    const at = value.indexOf(NEEDLE, from);
    if (at === -1) return;
    let end = at + NEEDLE.length;
    while (end < value.length) {
      const code = value.codePointAt(end);
      // a-z, 0-9, or `-`. Any other byte (or supplementary code point,
      // since registry names are ASCII-only) ends the name.
      const ok =
        code !== undefined &&
        ((code >= 0x61 && code <= 0x7a) ||
          (code >= 0x30 && code <= 0x39) ||
          code === 0x2d);
      if (!ok) break;
      end++;
    }
    if (end > at + NEEDLE.length) {
      consume(value.slice(at + NEEDLE.length, end));
    }
    from = end;
  }
}

interface BaseRules {
  readonly properties: Record<string, Record<string, string>>;
  readonly root: Record<string, string>;
  readonly dark: Record<string, string>;
}

interface PluginContributions {
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

type TypeInfoEntry = (typeof TYPE_INFO)[TokenType];

/**
 * Membership rule for a single token. See `buildContributions` doc comment
 * below for the full rationale. A component token with a `var(...)` chain
 * only lands in `:root` when something forces it: shorthand bundle, hand-
 * authored CSS, or another token's cascade reference (handled in pass 2).
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
 * Emit `@property` blocks for the token's main value and (optionally) its
 * line-height pairing. Only registrable types with literal defaults get
 * blocks, `var(...)` chains can't be the `initial-value` of an
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
 * `matchUtilities` value map. Component tokens use a fallback chain so the
 * utility renders even when the slot resolves through a `var(...)` chain
 * with no `:root` declaration of its own.
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
 *   - Component tokens with `var(...)` chain defaults: only if some other
 *     token's default references them, the shorthand bundle consumes
 *     them, OR they're flagged `consumedByCss`. Component tokens consumed
 *     exclusively through the auto-generated Tailwind utilities reach
 *     their value via the utility's `var(--name, <fallback>)` and don't
 *     need a `:root` declaration.
 */
function buildContributions(
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

/**
 * Public surface for tests, snapshot-style assertions, and benchmarks.
 * `buildContributions` is the only builder, every artifact reads off the
 * single fused walk. `scanVarRefs` is exported for benchmark suites that
 * compare the indexOf-based scanner against alternatives.
 */
export const __internal = {
  buildContributions,
  scanVarRefs,
} as const;

// One walk produces every artifact, ~3-5x cheaper than calling each
// builder separately. Module-load cost ~0.5ms over 559 tokens.
const contributions = buildContributions(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs);
const baseRules = contributions.base;
const themeExtend = contributions.themeExtend;
const matchValues = contributions.matchValues;

// Pre-build the shorthand-utility map once so the plugin handler doesn't
// allocate it on every Tailwind compile pass.
const shorthandUtilities: Record<string, () => Record<string, string>> = {};
for (const [name, declarations] of Object.entries(SHORTHAND_INDEX.rules)) {
  shorthandUtilities[name] = () => declarations;
}

/**
 * Options for the Clay Tailwind plugin. Pass these via Tailwind v4's
 * `@plugin "..." { ... }` block syntax, or by calling the exported plugin
 * with an options object from a JS-side Tailwind config.
 */
export interface ClayTailwindOptions {
  /**
   * Bake a non-default theme into the consumer's CSS at build time. Three
   * forms are accepted:
   *
   *   - **Preset name** (`"ocean"`, `"nord"`, ...): looks up one of the
   *     bundled `ThemeConfig` exports from `@brika/clay/themes`.
   *   - **JSON file path** (`"./themes/my-theme.json"`, absolute, or any
   *     string ending in `.json`): the file is loaded and parsed at build
   *     time, so consumers can author their own theme as a JSON document
   *     in their project. Relative paths resolve from `process.cwd()`.
   *   - **`ThemeConfig` object**: pass a config object directly, useful when
   *     wiring the plugin from a JS-side Tailwind config or generating
   *     themes at build time.
   *
   * The resolved theme's deltas are layered onto `:root` (and the dark-mode
   * equivalent) so the cascade matches what `applyTheme(theme)` would inject
   * at runtime, just produced statically with no `<style>` tag.
   *
   *   @plugin "@brika/clay/tailwind" {
   *     theme: ocean;
   *   }
   *
   *   @plugin "@brika/clay/tailwind" {
   *     theme: "./themes/my-brand.json";
   *   }
   *
   * Leave unset to ship the default Clay theme. The runtime
   * `applyTheme(theme)` path is unaffected by this option and remains the
   * right tool when consumers want to switch themes at runtime.
   */
  theme?: string | ThemeConfig;
}

/**
 * `option` is treated as a JSON-file path when it ends in `.json` or
 * starts with a path-ish prefix; everything else is interpreted as a
 * bundled-preset name. The two namespaces don't overlap (preset names
 * match `[a-z]+`), so a single string lets the CSS-first `@plugin`
 * options syntax express both authoring modes.
 */
function looksLikePath(option: string): boolean {
  return (
    option.endsWith('.json') ||
    option.startsWith('./') ||
    option.startsWith('../') ||
    isAbsolute(option)
  );
}

function loadThemeFromFile(filePath: string): ThemeConfig {
  const absolute = isAbsolute(filePath) ? filePath : resolvePath(process.cwd(), filePath);
  let contents: string;
  try {
    contents = readFileSync(absolute, 'utf8');
  } catch (cause) {
    throw new Error(
      `@brika/clay: failed to read theme file "${filePath}" (resolved to "${absolute}"): ${(cause as Error).message}`
    );
  }
  try {
    return JSON.parse(contents) as ThemeConfig;
  } catch (cause) {
    throw new Error(
      `@brika/clay: theme file "${absolute}" is not valid JSON: ${(cause as Error).message}`
    );
  }
}

/**
 * Resolve the `theme` option to a `ThemeConfig`. Strings are interpreted
 * as a JSON-file path or a bundled-preset name (via `looksLikePath`);
 * objects pass through unchanged. Throws on an unknown preset name or an
 * unreadable / malformed JSON file so misconfiguration fails fast at
 * build time.
 */
function resolveThemeOption(
  option: string | ThemeConfig | undefined
): ThemeConfig | undefined {
  if (!option) return undefined;
  if (typeof option !== 'string') return option;
  if (looksLikePath(option)) {
    return loadThemeFromFile(option);
  }
  const presets = PRESETS as unknown as Readonly<Record<string, ThemeConfig>>;
  const preset = presets[option];
  if (!preset) {
    const known = Object.keys(presets).sort((a, b) => a.localeCompare(b)).join(', ');
    throw new Error(
      `@brika/clay: unknown theme preset "${option}". Known presets: ${known}. Pass a path ending in ".json" (or starting with "./", "../", or "/") to load your own theme file.`
    );
  }
  return preset;
}

// Cascade-friendly selectors for the build-time theme bake. These match
// exactly what `renderThemeStyleSheet` (the runtime path) emits, so a
// later `applyTheme(other)` call still wins through later cascade order.
const BAKED_THEME_ROOT_SELECTOR = ':root';
const BAKED_THEME_DARK_SELECTOR = ':is(.dark, [data-mode="dark"]):root';

const clayTailwindPlugin: ReturnType<typeof plugin.withOptions<ClayTailwindOptions>> = plugin.withOptions(
  (options: ClayTailwindOptions = {}) => {
    const theme = resolveThemeOption(options.theme);
    const overrides = theme ? flattenTheme(theme) : null;
    const hasRootOverrides = overrides
      ? Object.keys(overrides.rootVars).length > 0
      : false;
    const hasDarkOverrides = overrides
      ? Object.keys(overrides.darkVars).length > 0
      : false;

    return ({ addBase, matchUtilities }) => {
      // Combine `:root` defaults with the bare `border` reset into a single
      // `addBase` call so Tailwind builds one base-layer AST node. The
      // border-color reset makes Tailwind v4's bare `border` utility
      // resolve to `var(--border)` instead of `currentColor`, without
      // this, components that use the bare `border` class render in the
      // inherited text color rather than the themed border token.
      //
      // Theme-option overrides are appended *after* the registry defaults so
      // the cascade resolves to the baked theme. Keys are inserted in order
      // so iteration matches CSS output order.
      const baseLayer: Record<string, Record<string, string>> = {
        ...baseRules.properties,
        '*, ::before, ::after': { 'border-color': 'var(--border)' },
        [ROOT_SELECTOR]: baseRules.root,
      };
      if (Object.keys(baseRules.dark).length > 0) {
        baseLayer[DARK_SELECTOR] = baseRules.dark;
      }
      if (overrides && hasRootOverrides) {
        baseLayer[BAKED_THEME_ROOT_SELECTOR] = overrides.rootVars;
      }
      if (overrides && hasDarkOverrides) {
        baseLayer[BAKED_THEME_DARK_SELECTOR] = overrides.darkVars;
      }
      addBase(baseLayer);
      // Per-component shorthand utilities (`.button`, `.badge`, ...). The JS
      // plugin API has two ways to emit utilities: `addUtilities` (always-emit,
      // no JIT) and `matchUtilities` (JIT-aware, emits only when the class name
      // appears in scanned source). We use the latter with a `DEFAULT`-only
      // value map so each entry behaves like a static utility but still
      // participates in v4's tree-shaking.
      matchUtilities(shorthandUtilities, { values: { DEFAULT: '' } });

      // Per-namespace token utilities (`border-w-<name>`, `leading-<name>`, ...)
      // for token types that don't fit cleanly into a `theme.extend` bucket.
      // Same JIT path as the shorthand bundle: classes are only emitted when
      // referenced from scanned source.
      for (const cfg of MATCH_UTILITY_NAMESPACES) {
        const values = matchValues[cfg.ns];
        if (!values) continue;
        matchUtilities(
          { [cfg.prefix]: (value: string) => ({ [cfg.cssProp]: value }) },
          { values }
        );
      }
    };
  },
  () => ({ theme: { extend: themeExtend } })
);

export default clayTailwindPlugin;
