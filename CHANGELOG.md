# Changelog

All notable changes to `@brika/clay` are documented here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0](https://github.com/brikalabs/clay/compare/clay-v0.0.1...clay-v0.1.0) (2026-05-07)


### Features

* **clay:** brand identity, themes overhaul, effects system, agent-readable docs ([#15](https://github.com/brikalabs/clay/issues/15)) ([0b6819c](https://github.com/brikalabs/clay/commit/0b6819c83bc059af32f84871091ac2910401ac0a))
* **clay:** scaffold @brika/clay + Astro docs site ([#12](https://github.com/brikalabs/clay/issues/12)) ([75f8cd8](https://github.com/brikalabs/clay/commit/75f8cd8b280bdddc7febdae11e3d572b938fe516))
* co-locate demos, add 15 components, overhaul docs DX ([#6](https://github.com/brikalabs/clay/issues/6)) ([09f8176](https://github.com/brikalabs/clay/commit/09f81768a9b0bda378a146c1d1bbbb5ebd9e287d))
* **engine:** JIT-pruned per-component shorthand utilities ([#8](https://github.com/brikalabs/clay/issues/8)) ([e15da5c](https://github.com/brikalabs/clay/commit/e15da5c4b46599e2935ee7ccad6f4bec524fe2ec))
* expand per-component theming, add AlertClose, unify ToggleGroup frame ([#9](https://github.com/brikalabs/clay/issues/9)) ([11aea98](https://github.com/brikalabs/clay/commit/11aea98f3b276f6bfc03b00cec7964c250c6b103))


### Bug Fixes

* **docs:** preserve demo names through minification ([#10](https://github.com/brikalabs/clay/issues/10)) ([08dfa12](https://github.com/brikalabs/clay/commit/08dfa1258ceb034871698073514a6fe20dab9521))
* **docs:** repair stale demos/ imports and gate docs build in CI ([#7](https://github.com/brikalabs/clay/issues/7)) ([48a2f38](https://github.com/brikalabs/clay/commit/48a2f38f60f5c5850feb2f42bfb3da1cf1201055))

## 0.1.0 — 2026-04-27

Initial public release.

### Added

- 38 React 19 components (alert-dialog, avatar, badge, breadcrumb,
  button, button-group, card, chart, code-block, collapsible, dialog,
  dropdown-menu, empty-state, input, input-group, label, overflow-list,
  page-header, password-input, popover, progress, progress-display,
  scroll-area, section, section-label, select, separator, sheet,
  sidebar, skeleton, slider, switch, table, tabs, textarea, tooltip,
  brika-logo, plus the `cn` / `cssVars` / `useIsMobile` primitives).
- 17 first-party themes — 11 colour-only (default, ocean, forest,
  sunset, lavender, ruby, nord, solarized, candy, dracula, mono) and
  6 showcase themes (brutalist, editorial, terminal, skeuomorph, glass,
  comic).
- Three-layer token system (scalars / roles / per-component) driven by
  a single TypeScript registry.
- Tailwind v4 plugin at `@brika/clay/tailwind` that contributes tokens,
  dark-mode overrides, and per-component utilities.
- `applyTheme`, `themeToCssVars`, `renderThemeStyleSheet`, and
  `ThemeScope` helpers for runtime theme switching and scoped previews.
- Granular import paths (`@brika/clay/components/<name>`,
  `@brika/clay/themes`, `@brika/clay/tokens`, `@brika/clay/primitives`)
  with `"sideEffects": false` for tree-shaking.
- Build pipeline: tsup → `dist/` ESM + `.d.ts` + sourcemaps, with
  `'use client';` banner stamped on every component chunk.
