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

import plugin from 'tailwindcss/plugin';

import { flattenTheme } from './themes/flatten';
import type { ThemeConfig } from './themes/types';
import { TOKEN_REGISTRY } from './tokens/registry';
import { SHORTHAND_INDEX } from './tokens/shorthands';
import { buildContributions } from './tailwind/build-contributions';
import { scanVarRefs } from './tailwind/scan-var-refs';
import { resolveThemeOption } from './tailwind/theme-option';
import {
  BAKED_THEME_DARK_SELECTOR,
  BAKED_THEME_ROOT_SELECTOR,
  DARK_SELECTOR,
  MATCH_UTILITY_NAMESPACES,
  ROOT_SELECTOR,
} from './tailwind/types';

/**
 * Public surface for tests, snapshot-style assertions, and benchmarks.
 * `buildContributions` is the only builder, every artifact reads off
 * the single fused walk. `scanVarRefs` is exported for benchmark
 * suites that compare the indexOf-based scanner against alternatives.
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

// Pre-build the shorthand-utility map once so the plugin handler
// doesn't allocate it on every Tailwind compile pass.
const shorthandUtilities: Record<string, () => Record<string, string>> = {};
for (const [name, declarations] of Object.entries(SHORTHAND_INDEX.rules)) {
  shorthandUtilities[name] = () => declarations;
}

/**
 * Options for the Clay Tailwind plugin. Pass these via Tailwind v4's
 * `@plugin "..." { ... }` block syntax, or by calling the exported
 * plugin with an options object from a JS-side Tailwind config.
 */
export interface ClayTailwindOptions {
  /**
   * Bake a non-default theme into the consumer's CSS at build time.
   * Three forms are accepted:
   *
   *   - **Preset name** (`"ocean"`, `"nord"`, ...): looks up one of the
   *     bundled `ThemeConfig` exports from `@brika/clay/themes`.
   *   - **JSON file path** (`"./themes/my-theme.json"`, absolute, or
   *     any string ending in `.json`): the file is loaded and parsed
   *     at build time, so consumers can author their own theme as a
   *     JSON document in their project. Relative paths resolve from
   *     `process.cwd()`.
   *   - **`ThemeConfig` object**: pass a config object directly,
   *     useful when wiring the plugin from a JS-side Tailwind config
   *     or generating themes at build time.
   *
   * The resolved theme's deltas are layered onto `:root` (and the
   * dark-mode equivalent) so the cascade matches what
   * `applyTheme(theme)` would inject at runtime, just produced
   * statically with no `<style>` tag.
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
   * `applyTheme(theme)` path is unaffected by this option and remains
   * the right tool when consumers want to switch themes at runtime.
   */
  theme?: string | ThemeConfig;
}

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
      // Combine `:root` defaults with the bare `border` reset into a
      // single `addBase` call so Tailwind builds one base-layer AST
      // node. The border-color reset makes Tailwind v4's bare
      // `border` utility resolve to `var(--border)` instead of
      // `currentColor`; without this, components that use the bare
      // `border` class render in the inherited text color rather than
      // the themed border token.
      //
      // Theme-option overrides are appended *after* the registry
      // defaults so the cascade resolves to the baked theme. Keys are
      // inserted in order so iteration matches CSS output order.
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
      // Per-component shorthand utilities (`.button`, `.badge`, ...).
      // The JS plugin API has two ways to emit utilities:
      // `addUtilities` (always-emit, no JIT) and `matchUtilities`
      // (JIT-aware, emits only when the class name appears in scanned
      // source). We use the latter with a `DEFAULT`-only value map so
      // each entry behaves like a static utility but still participates
      // in v4's tree-shaking.
      matchUtilities(shorthandUtilities, { values: { DEFAULT: '' } });

      // Per-namespace token utilities (`border-w-<name>`,
      // `leading-<name>`, ...) for token types that don't fit cleanly
      // into a `theme.extend` bucket. Same JIT path as the shorthand
      // bundle: classes are only emitted when referenced from scanned
      // source.
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
