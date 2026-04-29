# Contributing to Clay

Clay is Brika Labs' React component library. This guide covers everything you need to contribute.

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) v1.3 or later
- [Git](https://git-scm.com/)

### Setup

```bash
git clone https://github.com/brikalabs/clay.git
cd clay
bun install
```

### Development

```bash
# Build the library in watch mode
bun dev

# Run the docs site alongside
cd docs && bun dev
```

## Branching

Branch names are enforced by CI. Use one of these prefixes:

| Prefix | When to use |
|---|---|
| `feat/` | New component, token, or theme |
| `fix/` | Bug fix |
| `refactor/` | Code restructure without behaviour change |
| `perf/` | Performance improvement |
| `docs/` | Docs site changes only — will not trigger a release |
| `chore/` | Dependency bumps, config, tooling |
| `ci/` | CI workflow changes |
| `test/` | Test additions or fixes |

```bash
git checkout -b feat/tooltip-animation
git checkout -b fix/dark-mode-ring
git checkout -b docs/slider-examples   # won't publish to npm
```

## Pull requests

PR titles are enforced by CI and must follow [Conventional Commits](https://www.conventionalcommits.org/). The PR title becomes the commit message on `main` (squash merge) and drives the release pipeline.

```
feat: add Tooltip animation support
fix: correct focus ring in dark mode
feat!: rename applyTheme return type     ← ! = breaking change → major bump
docs: add Slider usage examples          ← no release triggered
chore: bump Radix to 1.5                 ← no release triggered
```

Use a scope when the change is scoped to one component:

```
feat(slider): add tick label formatting
fix(button): remove double focus ring on Safari
```

## Release process

Clay uses [release-please](https://github.com/googleapis/release-please) for fully automated releases. **You never manually edit the version or CHANGELOG.**

### How it works

```
merge a feat/fix PR to main
    ↓
release-please opens (or updates) a Release PR
    — bumps version in package.json
    — prepends a section to CHANGELOG.md

merge more PRs freely — the Release PR keeps updating
    ↓
when ready to ship, merge the Release PR
    ↓
release-please creates a git tag (e.g. v0.2.0)
    + a GitHub Release
    ↓
CI builds the library and publishes to npm
```

There is always **one** pending Release PR. Merging 10 feature PRs does not create 10 releases — they all batch into the next Release PR until you decide to ship.

### Version bump rules

| Commit type | Version bump |
|---|---|
| `feat:` | minor — `0.1.0 → 0.2.0` |
| `fix:` | patch — `0.1.0 → 0.1.1` |
| `feat!:` or `fix!:` (breaking) | major — `0.1.0 → 1.0.0` |
| `chore:`, `docs:`, `ci:`, `test:` | no release |

### Docs-only changes

PRs that only touch `docs/` skip the release pipeline entirely — they deploy the docs site without publishing a new npm version.

## Code style

- [Biome](https://biomejs.dev/) for linting and formatting — run `bunx biome check .` before pushing
- TypeScript strict mode — no `as` casts, no `any`
- Component props must be `Readonly<>`
- No Tailwind class strings extracted into shared constants — keep them inline per component

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Build library in watch mode |
| `bun run build` | Production build |
| `bun run typecheck` | Type-check with `tsgo` |
| `bun test` | Run tests |

## Reporting issues

Use the [GitHub issue tracker](https://github.com/brikalabs/clay/issues). Search before opening a new one.

## License

By contributing you agree your work will be licensed under the [MIT License](LICENSE).
