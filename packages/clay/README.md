<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/brikalabs/clay/main/assets/clay-ui-depth.svg">
    <img src="https://raw.githubusercontent.com/brikalabs/clay/main/assets/clay-ui-depth-dark.svg" alt="Clay" width="120" />
  </picture>
</p>

# @brika/clay

Brika Labs' React component library, token system, and first-party themes.

Clay provides the pressable raw material for every Brika surface:
primitives, components, tokens, and a curated set of built-in themes.
The package depends only on React 19 and Tailwind v4, no other Brika
packages, no monorepo glue.

- 56+ React 19 components built on Radix primitives
- Three-layer token system (scalars → roles → per-component) driven
  by a single TypeScript registry
- 19 first-party themes (color-only palettes plus showcase themes that
  exercise the full token surface)
- Tailwind v4 plugin that contributes tokens, dark-mode overrides, and
  per-component utilities in one pass
- Runtime *and* build-time theming, single-theme consumers can bake the
  theme into static CSS with no `<style>` injection

## Installation

```bash
npm install @brika/clay
# or
bun add @brika/clay
```

Peer requirements: `react@^19`, `react-dom@^19`, `tailwindcss@^4`.

## Quick start

Wire Tailwind v4 in your app's CSS entry point. The plugin contributes
all of Clay's tokens, dark-mode overrides, and per-component utilities:

```css
@import "tailwindcss";
@plugin "@brika/clay/tailwind";
@import "@brika/clay/styles";
```

Then import components from their granular paths for best
tree-shaking, or from the barrel for convenience:

```tsx
import { Button } from "@brika/clay/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@brika/clay/components/card";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello, Clay</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## Public entry points

| Import path | Contents |
|---|---|
| `@brika/clay` | Barrel, every component + primitive |
| `@brika/clay/components/<name>` | Single component (e.g. `button`, `dialog`, `tabs`) |
| `@brika/clay/primitives` | `cn`, `cssVars`, `useIsMobile` |
| `@brika/clay/themes` | `applyTheme`, `ThemeScope`, all 19 preset themes |
| `@brika/clay/themes/registry` | Full ordered preset list, opt-in for picker UIs |
| `@brika/clay/tokens` | `TOKEN_REGISTRY`, `TokenSpec`, type helpers |
| `@brika/clay/tailwind` | Tailwind v4 plugin |
| `@brika/clay/styles` | `clay.css`, utilities + components.css bridges |

## Themes

`ThemeConfig` is JSON-shaped, with optional sections per token category:

```json
{
  "id": "brutalist",
  "name": "Brutalist",
  "description": "Sharp corners, thick borders, monospace UI.",
  "accentSwatches": ["#000000", "#ffd400"],

  "colors":  { "light": { "primary": "#0a0a0a" }, "dark": { "primary": "#fafafa" } },
  "geometry": { "radius": "0px", "fontSans": "JetBrains Mono, monospace" },
  "borders":  { "width": "2px", "style": "solid" },
  "motion":   { "duration": "0ms" },
  "focus":    { "width": "3px", "offset": "3px" },

  "components": {
    "button": { "letterSpacing": "0.08em", "textTransform": "uppercase" },
    "card":   { "shadow": "none", "borderWidth": "2px" }
  }
}
```

Nineteen first-party themes ship today: thirteen color-only palettes
(default, brika, ocean, forest, sunset, lavender, ruby, nord, solarized,
candy, dracula, synthwave, mono) plus six showcase themes that exercise
the full token surface (**Brutalist**, **Editorial**, **Terminal**,
**Skeuomorph**, **Glass**, **Comic**).

### Runtime theming, `applyTheme`

```ts
import { applyTheme, brutalist } from "@brika/clay/themes";

const cleanup = applyTheme(brutalist);
document.documentElement.setAttribute("data-mode", "dark");
cleanup();
```

`applyTheme` injects a single `<style id="clay-theme">` containing both
the `:root` light defaults and a `:is(.dark, [data-mode="dark"]):root`
block for dark overrides. Toggling the attribute afterwards costs
nothing, the dark block activates via CSS, no JS re-run.

For SSR, embed `renderThemeStyleSheet(theme)` in the document `<head>`
to avoid FOUC; `applyTheme` reuses the existing tag idempotently when
the client mounts.

### Build-time theming, plugin `theme` option

If you commit to one theme and don't need runtime switching, bake it
into the consumer's CSS at build time. The plugin layers the theme's
deltas onto `:root` exactly the way `applyTheme` would inject them at
runtime, just produced statically with no `<style>` tag and no JS:

```css
@import "tailwindcss";
@plugin "@brika/clay/tailwind" {
  theme: ocean;
}
@import "@brika/clay/styles";
```

The `theme` option accepts three forms:

| Form | Example | Resolved by |
|---|---|---|
| Preset name | `theme: ocean;` | Looked up in the bundled preset map |
| JSON file path | `theme: "./themes/my-brand.json";` | Loaded from disk at build time (relative to `process.cwd()`) |
| `ThemeConfig` object | `clayPlugin({ theme: customTheme })` | Pass-through, for JS-side config |

**Bring your own theme.** Author your theme as a JSON file in your
project, copy any preset (e.g. `node_modules/@brika/clay/dist/themes/presets/clay.json`)
as a starting point, and reference it via the path form above. The
runtime `applyTheme(...)` path remains available even when a theme is
baked at build time, switching to a different preset at runtime simply
overrides the baked one through later cascade order.

### Scoped themes, `ThemeScope`

Apply a theme to a subtree without inflating the rendered HTML:

```tsx
import { ocean, ThemeScope } from "@brika/clay/themes";

<ThemeScope theme={ocean} mode="light">
  <Button>Ocean button</Button>
</ThemeScope>
```

For zero-DOM theming, pass `asChild` and a single child element:

```tsx
<ThemeScope theme={ocean} asChild>
  <article className="prose">…</article>
</ThemeScope>
```

`ThemeScope` deduplicates the underlying `<style>` tag via React 19's
`href`-keyed stylesheet hoisting, fifty `ThemeScope`s of `dracula`
share one tag in `<head>`.

For inline preview vars (gallery cards, side-by-side comparisons) use
`themeToCssVars(theme, mode)`, it returns a React `style`-prop object
with every registry token pinned, which resists leaks from a globally
applied theme.

## Token system

Clay's CSS tokens are organised in three layers, all driven by a single
hand-authored TypeScript registry. The Tailwind plugin reads the
registry at compile time and emits `:root` defaults, dark-mode
overrides, and `theme.extend` entries; there are no generated CSS
files; the TypeScript registry is the single source of truth.

- **Layer 0, Scalars.** A handful of knobs (`--radius`, `--spacing`,
  `--font-sans`, `--motion-duration`, `--ring-width`, …). Themes set
  these to retune the whole library at once.
- **Layer 1, Roles.** Semantic colors (`--primary`, `--background`,
  `--border`), semantic radii (`--radius-control`, `--radius-surface`),
  semantic shadows (`--shadow-overlay`, `--shadow-modal`), motion
  channels, state-layer opacities.
- **Layer 2, Per-component.** Every component reads its own variables
  (`--button-padding-x`, `--card-shadow`, `--switch-thumb-size`) that
  fall back to a Layer 1 role. Themes override one component without
  touching the rest by writing to these.

The full reference is exported as TypeScript at `@brika/clay/tokens`
(`TOKEN_REGISTRY`, `TokenSpec`).

## Bundle considerations

- The `code-block` component pulls in `shiki` (~3 MB unminified) for
  syntax highlighting. If you don't import `code-block`, modern bundlers
  will tree-shake it out, the package's `sideEffects` array only marks
  CSS, token files, and the component register.
- Themes are JSON imports inlined into the build. The full theme surface
  adds ~25 KB minified across all 19 presets; importing one preset by
  name (`import { ocean } from "@brika/clay/themes"`) lets the bundler
  walk to a single JSON file.
- The barrel (`import { Button } from "@brika/clay"`) re-exports
  everything; for production bundles prefer the granular paths
  (`@brika/clay/components/button`).

## Links

- [GitHub](https://github.com/brikalabs/clay)
- [Documentation](https://clay.brika.dev)
- [Architecture reference](https://github.com/brikalabs/clay/blob/main/ARCHITECTURE.md)
- [Changelog](https://github.com/brikalabs/clay/blob/main/packages/clay/CHANGELOG.md)

## License

MIT &copy; Brika Labs. See [LICENSE](https://github.com/brikalabs/clay/blob/main/LICENSE).
