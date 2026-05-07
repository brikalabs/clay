---
name: clay-usage
description: How to use the Clay design system (@brika/clay) — its three-layer token model, theme application, and component import patterns. Trigger when @brika/clay appears in package.json, when imports from @brika/clay or @brika/clay/components/* are added or edited, or when the user asks how to theme, override tokens, or compose Clay components.
allowed-tools:
  - WebFetch
  - Read
  - Grep
---

# Clay design system — usage primer

Clay is a token-driven React component library: every visual property a
component cares about is exposed as a CSS custom property, and themes
override those properties at the root. Consumers don't subclass or
override component CSS — they retune tokens.

## Importing components

Two equivalent surfaces:

```ts
// Granular — preferred. Tree-shakes cleanly, surfaces the per-component
// type signature and tokens.
import { Button } from '@brika/clay/components/button';

// Barrel — convenient for prototyping or re-exporting from a local module.
import { Button } from '@brika/clay';
```

Per-component docs live at `https://clay.brika.dev/components/<slug>.md`
(LLM-friendly markdown). Use the `/clay-docs <name>` slash command to
pull a specific component's docs into context on demand instead of
guessing at props.

## Token model

Three layers — read upward, override downward.

1. **Scalars** (`src/tokens/scalars.ts`, `src/tokens/spacing.ts`): raw
   primitives. `SPACING_2`, color ramps, radius scales, motion
   durations. Components never reference these directly; themes rarely
   override them.
2. **Semantic roles** (`src/tokens/roles/*`): `--clay-canvas`,
   `--clay-elevated`, `--icon`, `--icon-muted`, `--radius-card`,
   `--shadow-surface`, etc. Components consume these. Themes override
   these to restyle the whole library.
3. **Component tokens** (`src/components/<slug>/tokens.ts`): per-component
   variables — `--button-height`, `--input-border-width`,
   `--card-backdrop-blur`. Reach for these only when a single component
   needs to diverge from its semantic-role default.

Hierarchy in practice: a `<Card>` reads `--radius-card`, which defaults
to `var(--radius-surface)` (semantic role), which a theme can pin to a
specific value or remap to another scalar.

## Theming

A theme is a `ThemeConfig` object — a partial overlay over the registry
defaults — applied at runtime:

```ts
import { applyTheme } from '@brika/clay/themes';
import { graphite } from '@brika/clay/themes/registry';

const cleanup = applyTheme(graphite, { mode: 'dark' });
// returns a teardown that removes the injected <style id="clay-theme">
```

To author a custom theme: use the registry-shape from `@brika/clay/themes`,
override only the role tokens you care about, and pass to `applyTheme`.
Component-level tokens are reachable through dotted paths (`button.height`,
`card.backdropBlur`) when you need finer-grained tuning.

## When to fetch live docs

If the user asks about a component you haven't seen recently, fetch its
docs page rather than reasoning from memory:

```
WebFetch https://clay.brika.dev/components/<slug>.md
```

Or hand the user the `/clay-docs <slug>` shortcut. The full component
catalogue is at `https://clay.brika.dev/llms.txt`.

## Common pitfalls

- **Don't override component CSS directly** with `className` to retheme.
  Override the relevant role token instead — your override survives
  upgrades; CSS rewrites don't.
- **`asChild` is everywhere.** Most Clay primitives accept `asChild` so
  you can compose with `<a>`, `<Link>`, or another primitive while
  keeping behavior and styling. Reach for it before reaching for
  `forwardRef` workarounds.
- **The `tokens` export is the source of truth.** When asked about
  what's themeable on a component, read `src/components/<slug>/tokens.ts`
  rather than grepping CSS — the registry there is what `applyTheme`
  actually consumes.
