# Clay, architecture

This document describes how Clay is wired internally: the token registry,
the Tailwind v4 plugin, the per-component shorthand utility system, the
theming runtime, and the build flow. It is the engineering reference that
the user-facing [`README.md`](README.md) intentionally elides.

If you want to *use* Clay, read the README. If you want to extend it,
debug an unexpected emission, or understand why a class lands in the
output, read this file.

---

## Big picture

Clay is three things stacked in one package:

1. **A typed token registry**, every CSS variable Clay can address is a
   `TokenSpec` record in [`src/tokens/registry.ts`](src/tokens/registry.ts).
   The registry is the single source of truth; nothing in CSS or
   generated files duplicates it.
2. **A Tailwind v4 plugin** that walks the registry at compile time and
   contributes (a) `:root` defaults and dark-mode overrides, (b) typed
   `@property` registrations for animation/interpolation, (c) `theme.extend`
   bridges so slot tokens become real Tailwind utilities, and (d) one
   JIT-pruned shorthand utility per component.
3. **A small set of React components** in `src/components/<name>/` whose
   class strings are written directly against the tokens above.

Themes are runtime overrides of the same registry, a `ThemeConfig` is
flattened into a single `<style>` tag whose body is `:root { --token: …; }`.

The library ships zero generated files. Compile-time output is produced
by Tailwind reading the plugin; runtime output is produced by `applyTheme`.

```
authored                    compile-time                       runtime
────────                    ────────────                       ───────
tokens.ts ─────┐
               ├─► TOKEN_REGISTRY ─► tailwind.ts plugin ─► CSS bundle
defineComponent┘                          │                     │
                                          │                     ▼
themes/*.json ─────────────────────► applyTheme  ──────►  <style id="clay-theme">
                                                                │
                                          components/*.tsx ◄────┘
                                                  │
                                                  └► consumer DOM
```

---

## The token registry

Every CSS custom property Clay knows about is a `TokenSpec`:

```ts
interface TokenSpec {
  readonly name: string;             // 'button-padding-x'
  readonly layer: 'scalar' | 'role' | 'component';
  readonly category: TokenCategory;  // 'geometry' | 'color' | 'typography' | …
  readonly type?: TokenType;         // 'size' | 'color' | 'duration' | …
  readonly appliesTo?: string;       // 'button'  (component layer only)
  readonly defaultLight: string;     // '1rem'  or  'var(--spacing)*4'
  readonly defaultDark?: string;
  readonly description: string;
  readonly themePath?: string;       // 'components.button.paddingX'
  readonly tailwindNamespace?: TailwindNamespace; // routes to theme.extend
  readonly utilityAlias?: string;
  readonly lineHeight?: string;
}
```

There are three layers, each authored in its own file:

- **Layer 0, Scalars** (`src/tokens/scalars.ts`). The dial-pad: `--radius`,
  `--spacing`, `--font-sans`, `--motion-standard-duration`,
  `--ring-width`, `--text-base`. Every later layer ultimately rides on
  these.
- **Layer 1, Roles** (`src/tokens/roles/*.ts`). Semantic intent layered
  on top of scalars: `--primary`, `--background`, `--border`,
  `--radius-control`, `--shadow-overlay`, `--motion-instant-duration`.
  A role's `defaultLight` is typically a `var(--<scalar>)` chain.
- **Layer 2, Component** (`src/components/<name>/tokens.ts`). Per-component
  identity: `--button-padding-x`, `--card-shadow`, `--menu-item-gap`.
  Authored declaratively via `defineComponent`:

  ```ts
  // src/components/button/tokens.ts
  defineComponent('button', {
    radius:     { default: 'var(--radius-control)', alias: 'button', description: '…' },
    shadow:     { default: 'var(--shadow-surface)', alias: 'button', description: '…' },
    surface:    true,                                          // border + motion
    geometry:   { height: '2.25rem', paddingX: SPACING_4, paddingY: SPACING_2, gap: SPACING_2 },
    typography: { fontWeight: '500', fontSize: 'var(--text-body-md)' },
    slots: {
      'filled-container': { default: 'var(--primary)', description: '…' },
      'filled-label':     { default: 'var(--primary-foreground)', description: '…' },
      'outline-border':   { default: 'var(--border)', description: '…' },
      'outline-label':    { default: 'var(--foreground)', description: '…' },
    },
  });
  ```

  `defineComponent` expands those declarative keys into `TokenSpec[]`:
  `geometry: { height, paddingX, ... }` becomes four token specs whose
  names are `<component>-height`, `<component>-padding-x`, etc. The
  `surface` shortcut adds the border + motion families. Every per-token
  `defaultLight` is just a string, so role-cascading happens through CSS
  (`var(--button-shadow)` → `var(--shadow-surface)` → `var(--shadow-raised)`).

The aggregator [`src/tokens/registry.ts`](src/tokens/registry.ts) imports
all three layers and exposes:

- `TOKEN_REGISTRY: readonly ResolvedTokenSpec[]`, every spec, with
  `type` filled in from `inferTokenType` when omitted.
- `TOKENS_BY_NAME: Record<string, ResolvedTokenSpec>`, O(1) lookup.
- `tokensByType(type)`, for tooling that needs all colors / radii / etc.

---

## Tailwind v4 plugin, what `src/tailwind.ts` emits

The plugin is loaded by the consumer's CSS:

```css
@import "tailwindcss";
@plugin "@brika/clay/tailwind";
@import "@brika/clay/styles";
```

Internally, `clayTailwindPlugin` is a Tailwind v4 plugin
(`{ handler, config }`). It contributes four distinct things, only one of
which is JIT-pruned.

### 1. `@property` blocks (always-emit)

Tokens whose `type` maps to a CSS `@property` syntax descriptor and whose
`defaultLight` is a literal value (no `var()`) get a typed registration:

```css
@property --button-padding-x {
  syntax: "<length>";
  inherits: true;
  initial-value: 1rem;
}
```

The browser then type-checks values theme authors set against custom
properties (a malformed value falls back to `initial-value`) and
animations interpolate cleanly. Tokens whose default is a `var()` chain
are skipped, the CSS spec requires `initial-value` to be a *computed*
value, and `var()` resolves later.

### 2. `:root` defaults + dark-mode overrides (always-emit)

Every Layer-0 and Layer-1 token gets a `:root` declaration; the dark
block overrides any token whose `defaultDark` differs.

For Layer-2 tokens the rule is more subtle: literal defaults always emit,
but `var()`-chain defaults only emit if some downstream code reads them
directly. "Downstream" means either:

- Hand-authored CSS or TSX referencing `var(--token)` / `(--token)`,
  picked up by `readDirectVarReferences()` which greps the `src/styles`
  and `src/components/*/<name>.tsx` files.
- The auto-generated shorthand utility (see §3) which references
  `var(--token)` from inside its CSS-in-JS object.

The two reference sets are unioned at the top of the plugin:

```ts
const REFERENCED_COMPONENT_TOKENS: ReadonlySet<string> = new Set([
  ...readDirectVarReferences(),
  ...SHORTHAND_INDEX.tokenRefs,
]);
```

The point of this filter is that a Layer-2 token whose default is just
`var(--shadow-surface)` adds nothing if no one reads the var directly,
the same fallback chain is reachable via `theme.extend.boxShadow.button`,
which Tailwind's JIT only emits when a class like `shadow-button`
actually appears in source.

### 3. Per-component shorthand utility (JIT-pruned)

This is where Tailwind v4's behavior gets interesting. The plugin API
has three ways to emit utilities:

| API | Layer | JIT-pruned |
|---|---|---|
| `addBase` | base | ❌ always emits |
| `addComponents` | components | ❌ always emits |
| `addUtilities` | utilities | ❌ always emits |
| `matchUtilities` | utilities | ✅ scans source for the name |

The first three are convenient but **emit their content unconditionally**
in v4. The only way to get JIT pruning from the JS plugin is
`matchUtilities`, which Tailwind designs as a parametric utility
generator, `tab-2`, `tab-4`, etc., but accepts a `values: { DEFAULT: '' }`
option that makes each entry behave like a static utility while still
participating in the content-scanner pipeline.

So the plugin builds one entry per component from `SHORTHAND_INDEX`
(see §[The shorthand engine](#the-shorthand-engine) below) and registers
them in a single `matchUtilities` call:

```ts
const shorthandUtilities = Object.fromEntries(
  Object.entries(SHORTHAND_INDEX.rules).map(([name, declarations]) => [
    name,
    () => declarations,
  ])
);
matchUtilities(shorthandUtilities, { values: { DEFAULT: '' } });
```

When the build sees `class="button"` in source, `.button` is emitted with
its bundled declarations (`height`, `padding-inline`, `transition-*`, etc.).
When the source contains no `button`, nothing emits.

The `src/__tests__/tailwind-plugin.test.ts` suite verifies this contract
two ways:

- A mock plugin api whose `addUtilities` and `addComponents` *throw*,
  the plugin must reach for `matchUtilities` only.
- Tailwind v4's `compile()` with curated candidate lists, asserting that
  asking for `['button']` emits `.button` but no other shorthand, and
  asking for `[]` emits no shorthand at all.

### 4. `theme.extend` bridges (JIT-pruned via Tailwind's normal path)

For tokens with a `tailwindNamespace`, the plugin maps each one into
`theme.extend.<bucket>` so it becomes a regular Tailwind utility:

| Namespace | Bucket | Generates |
|---|---|---|
| `color` | `colors` | `bg-X`, `text-X`, `border-X`, `ring-X`, … |
| `radius` | `borderRadius` | `rounded-X` |
| `shadow` | `boxShadow` | `shadow-X` |
| `text` | `fontSize` | `text-X` (font-size + line-height pair) |
| `font` | `fontFamily` | `font-X` |
| `motion` | `transitionDuration`/`Timing` | `duration-X`, `ease-X` |
| `opacity` | `opacity` | `opacity-X` and modifiers `bg-X/N` |
| `blur` | `blur` | `blur-X`, `backdrop-blur-X` |

The right-hand side is `var(--<token>, <fallback>)` for component-layer
tokens, so a theme that leaves the slot blank still resolves through the
declared role fallback.

---

## The shorthand engine

`src/tokens/shorthands.ts` is a pure registry walker that produces the
input to `matchUtilities`. For every component-layer token whose name
ends in a known suffix, it adds a CSS declaration to that component's
shorthand:

```ts
const SUFFIX_TO_PROPERTY: Readonly<Record<string, string>> = {
  height:           'height',
  'padding-x':      'padding-inline',
  'padding-y':      'padding-block',
  gap:              'gap',
  'font-family':    'font-family',
  'font-size':      'font-size',
  'font-weight':    'font-weight',
  'line-height':    'line-height',
  'letter-spacing': 'letter-spacing',
  'text-transform': 'text-transform',
  duration:         'transition-duration',
  easing:           'transition-timing-function',
  'border-width':   'border-width',
  'border-style':   'border-style',
};
```

Slot tokens whose value needs a wrapper (currently just
`<component>-backdrop-blur` → `backdrop-filter: blur(var(...))`) go
through a special-cases table. Suffixes outside both tables, slot
tokens like `filled-container`, `track-width`, `radius`, `shadow`, are
intentionally skipped; they're already accessible through their own
Tailwind utilities (`bg-button-filled-container`, `rounded-button`,
`shadow-card`).

The walker output is a single record:

```ts
SHORTHAND_INDEX.rules['button'] = {
  height:                       'var(--button-height)',
  'padding-inline':             'var(--button-padding-x)',
  'padding-block':              'var(--button-padding-y)',
  gap:                          'var(--button-gap)',
  'transition-duration':        'var(--button-duration)',
  'transition-timing-function': 'var(--button-easing)',
  'border-width':               'var(--button-border-width)',
  'border-style':               'var(--button-border-style)',
  'font-family':                'var(--button-font-family)',
  'font-size':                  'var(--button-font-size)',
  'font-weight':                'var(--button-font-weight)',
  'line-height':                'var(--button-line-height)',
  'letter-spacing':             'var(--button-letter-spacing)',
  'text-transform':             'var(--button-text-transform)',
};
```

Plus `SHORTHAND_INDEX.tokenRefs`, the union of every token name any
shorthand references, used to gate `:root` emission for var-chain
defaults.

The walker is shared by the Tailwind plugin (for `matchUtilities`) and
the [`cn()`](src/primitives/cn.ts) primitive (for tailwind-merge group
registration), so all three consumers see identical data.

### Why one class per component

An earlier iteration split each component into four classes,
`button-geom`, `button-typo`, `button-motion`, `button-border`, to
mirror the families inside `defineComponent`. In practice every consumer
either applied all four or none, the four-way split delivered no
override granularity that wasn't already covered by the Tailwind
utility above it (`h-10`, `font-mono`, `duration-300`, `border-2`), and
the migration verified that no existing component ever used just one
family. Collapsing to one `<component>` class per component dropped the
visible class-string surface to a single token without losing any
override path.

---

## Cascade and override behavior

Three layers participate in the consumer's CSS, in increasing precedence:

```
@layer theme       ← :root {} from addBase  +  theme presets
@layer base        ← Clay base styles
@layer utilities   ← Tailwind utilities (h-10, bg-red-500, …)
                     and matchUtilities output (.button, .badge, …)
```

`matchUtilities` lands in the utilities layer; so does `h-10`. Within
the utilities layer Tailwind v4 sorts by internal weight, built-in
single-property utilities like `h-10` end up sorted *after* multi-property
custom utilities like `.button`, so a consumer's `<button class="button h-10">`
gets `.button`'s height overridden by `h-10` via plain CSS source order.
No `tailwind-merge` cross-conflict rule is needed for that case.

Inside `cn()`, `tailwind-merge` is extended so each shorthand class is
its own single-member group, this collapses `cn('button', 'button')` to
one occurrence but lets `cn('button', 'badge')` keep both:

```ts
const SHORTHAND_GROUPS = Object.fromEntries(
  Object.keys(SHORTHAND_INDEX.rules).map((cls) => [`clay-shorthand-${cls}`, [cls]])
);

const twMerge = extendTailwindMerge({
  extend: { classGroups: SHORTHAND_GROUPS },
});
```

There is no cross-group conflict between shorthand and Tailwind
utilities, that's deliberate. Cross-conflict would force `tailwind-merge`
to drop `.button` whenever a single conflicting property arrived (e.g.
`h-10`), but `.button` sets ten other properties we still want; CSS
cascade is the right tool for this, not class deduplication.

---

## Theming runtime

A `ThemeConfig` is plain JSON (`src/themes/types.ts`):

```ts
interface ThemeConfig {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly accentSwatches?: readonly string[];
  readonly colors?:    { readonly light?: ColorOverrides; readonly dark?: ColorOverrides };
  readonly geometry?:  GeometryOverrides;
  readonly borders?:   BorderOverrides;
  readonly motion?:    MotionOverrides;
  readonly focus?:     FocusOverrides;
  readonly components?: ComponentOverrides;
}
```

`flattenTheme(theme, mode)` walks the JSON in registry order, every
section maps to a token via `themePath`, and produces a flat
`Record<cssVarName, value>` for `:root`. `renderThemeStyleSheet(theme)`
returns the CSS text of two blocks (`:root { … }` for light defaults,
`:is(.dark, [data-mode="dark"]):root { … }` for dark overrides).

Two runtimes consume the flattened output:

- **`applyTheme(theme)`** injects a single `<style id="clay-theme">` into
  the document head. Returns a cleanup function. Toggling
  `data-mode="dark"` on `<html>` afterwards is free, the dark block
  activates via CSS, no JS re-run.

- **`<ThemeScope theme={x}>`** scopes a theme to a subtree by inlining
  the same flattened vars on a wrapper. The default mode renders a
  `<div>` with `display: contents` (no layout box, vars still inherit);
  `asChild` writes the same vars onto a single child via Radix Slot for
  zero-DOM-impact theming. React 19's `href`-keyed stylesheet hoisting
  deduplicates, fifty `<ThemeScope theme={dracula}>`s share one `<style>`
  in `<head>`.

Themes never modify Layer-2 component tokens directly except through
the `components.<name>.<prop>` path. That way a theme can override
`--button-padding-x` without affecting the broader `--spacing` knob, and
vice versa.

---

## Build flow

The package is built by [`tsup.config.ts`](tsup.config.ts):

- One entry per public export in `package.json#exports`, every
  component compiles to `dist/components/<name>/index.js`, every
  primitive to `dist/primitives/<name>.js`, plus root, themes, tokens,
  and tailwind.
- ESM only, ES2022 target.
- `dts: false`, Tailwind v4 + the `@property` machinery does not need
  `.d.ts` for the registry, and tsup's DTS worker is slow on multi-entry
  setups. Types are emitted via `tsc --emitDeclarationOnly` in the same
  build script (see `package.json#scripts.build`).
- `onSuccess` copies `src/styles`, `src/themes/presets`, and `src/assets`
  to `dist/`. The `@source "../**/*.{ts,tsx,js}"` directive in
  `clay.css` is relative to the file, so it resolves to `dist/**` after
  publish, Tailwind scans the bundled JS for class strings, the same
  way it scans tsx in the workspace.

There is no codegen. The Tailwind plugin reads the registry every time
it runs (as a normal TypeScript module) and emits CSS through the
plugin API.

---

## Testing strategy

| File | What it asserts |
|---|---|
| `src/__tests__/smoke.test.ts` | Barrel exports the public API. |
| `src/tokens/__tests__/registry.test.ts` | Registry invariants, unique names, every component-layer token has `appliesTo`, every type maps to its declared category, etc. |
| `src/tokens/__tests__/define.test.ts` | `defineComponent` expansion semantics. |
| `src/tokens/__tests__/shorthands.test.ts` | The pure walker, synthetic registries and the live one, including edge cases like multi-segment `appliesTo` (`menu-item` vs `menu`). |
| `src/__tests__/tailwind-plugin.test.ts` | The plugin contract, that the handler reaches for `matchUtilities` only, registers a utility per `SHORTHAND_INDEX` entry, and that Tailwind v4's `compile()` actually JIT-prunes unused shorthands when given a curated candidate list. |
| `scripts/audit-tokens.ts` | Not a test, runnable script that cross-checks `TOKEN_REGISTRY` against TSX source for dangling refs and dead tokens. Run with `bun run scripts/audit-tokens.ts`. |

---

## File map

```
src/
├── components/<name>/
│   ├── <name>.tsx              ← uses `class="<name>"` for shorthand
│   ├── <name>.demos.tsx        ← docs site demos
│   ├── tokens.ts               ← defineComponent(...), the author surface
│   ├── meta.ts                 ← display name, group, externalDocs
│   └── index.ts                ← `export * from './<name>'`
├── primitives/
│   ├── cn.ts                   ← clsx + extended tailwind-merge
│   ├── cssVars.ts              ← stringly-typed → React style helper
│   ├── use-mobile.ts
│   └── with-slot.ts
├── styles/
│   ├── clay.css                ← @plugin + @import + @source, entry
│   ├── utilities.css           ← cross-cutting utilities (corner-themed, ring-themed, p-safe…)
│   ├── components.css          ← hand-authored bridge layer (small, will probably shrink further)
│   └── effects.css             ← scrollbars, accordion animations, etc.
├── themes/
│   ├── apply.ts                ← applyTheme, resetThemeVars, themeToCssVars
│   ├── flatten.ts              ← flattenTheme + renderThemeStyleSheet
│   ├── ThemeScope.tsx          ← scoped theme React component
│   ├── types.ts                ← ThemeConfig
│   ├── registry.ts             ← preset metadata
│   ├── presets/*.json          ← 17 first-party themes
│   └── index.ts
├── tokens/
│   ├── registry.ts             ← TOKEN_REGISTRY, TOKENS_BY_NAME
│   ├── types.ts                ← TokenSpec, TokenLayer, TokenCategory, …
│   ├── infer.ts                ← suffix → TokenType inference
│   ├── define.ts               ← defineComponent, declarative tokens.ts API
│   ├── scalars.ts              ← Layer 0
│   ├── roles/                  ← Layer 1 (one file per category)
│   ├── components.ts           ← Layer 2 aggregator
│   ├── orphan-components.ts    ← Layer 2 entries whose component folder doesn't exist yet
│   └── shorthands.ts           ← SHORTHAND_INDEX walker (consumed by plugin + cn)
├── tailwind.ts                 ← Tailwind v4 plugin
└── index.ts                    ← root barrel
```

---

## Adding a new component

1. Create `src/components/<name>/` with `tokens.ts`, `<name>.tsx`,
   `meta.ts`, `index.ts`.
2. In `tokens.ts` call `defineComponent('<name>', { … })` and re-export
   from [`src/tokens/components.ts`](src/tokens/components.ts).
3. Use the auto-generated `<name>` shorthand class in your TSX:

   ```tsx
   const myThingVariants = cva(
     '<name> corner-themed inline-flex items-center rounded-<name> …',
     { variants: { /* slot-driven variant strings */ } }
   );
   ```

4. Reference slot tokens via Tailwind utility namespaces (`bg-<name>-filled-container`,
   `text-<name>-filled-label`, `rounded-<name>`, `shadow-<name>`).
5. Run `bun run scripts/audit-tokens.ts` to confirm there are no
   dangling refs or dead tokens.
6. Run `bun test` and `bun run typecheck`.

A new component contributes zero CSS to consumers who don't import it,
its shorthand class is JIT-pruned by Tailwind's content scanner, and
its slot-token utilities only emit when something references them.

---

## Known constraints

- **`@property` requires literal defaults.** Tokens whose `defaultLight`
  is a `var()` chain don't get an `@property` block; their typed
  validation/animation pairing is sacrificed for the cascade. This is
  a CSS spec rule, not a Clay choice.
- **`matchUtilities` requires `values`.** The trick we use to make
  shorthand classes look static is `values: { DEFAULT: '' }`. There is
  no documented "static utility from JS plugin" alternative in v4, both
  `addUtilities` and `addComponents` are always-emit.
- **The audit script can't see consumer code.** `scripts/audit-tokens.ts`
  cross-checks Clay's own TSX. If a consumer references a token Clay
  doesn't ship, that's *their* dangling ref, not Clay's. The Tailwind
  scanner takes over once Clay is consumed downstream.
