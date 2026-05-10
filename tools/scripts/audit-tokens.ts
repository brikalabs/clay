/**
 * Token usage audit. For every Layer-2 component:
 *   - Lists registered tokens (by appliesTo).
 *   - Lists every reference in the component's TSX, both raw `var(--…)`
 *     and Tailwind utility-class shapes derived from `tailwindNamespace`
 *     (`bg-X`, `rounded-X`, `shadow-X`, `text-X`, `font-X`, `duration-X`,
 *     `ease-X`, `opacity-X`, `blur-X`, plus the spacing family
 *     `size-X`, `h-X`, `w-X`, `p?-X`, `m?-X`, `gap-X`, `top/right/bottom/left-X`,
 *     `inset-X`, `space-x/y-X`, `translate-x/y-X`).
 *   - Shorthand-bundle coverage (geom / typo / motion / border).
 *   - Flags:
 *       a) registered-but-unreferenced (dead, no shorthand, no raw ref,
 *          no namespaced utility match).
 *       b) referenced-but-unregistered (dangling, TSX uses a `--name`
 *          that the registry doesn't define).
 *
 * Usage: `bun run audit:tokens`
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TOKEN_REGISTRY } from '../../packages/clay/src/tokens/registry';
import { SHORTHAND_INDEX } from '../../packages/clay/src/tokens/shorthands';
import type { ResolvedTokenSpec, TailwindNamespace } from '../../packages/clay/src/tokens/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '..', '..');
const COMPONENTS_DIR = join(REPO_ROOT, 'packages/clay/src/components');

const VAR_REF_RE = /\((?:[a-z][\w-]*\s*:\s*)?--([a-z][a-z0-9-]*)/g;

const cmp = (a: string, b: string) => a.localeCompare(b);

function readComponentSource(folder: string): string {
  const parts: string[] = [];
  walk(folder);
  return parts.join('\n');

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const info = statSync(full);
      if (info.isDirectory()) {
        // Recurse so refactors that split a component into
        // `internal/`, `parts/`, `pieces/` etc. don't hide tokens.
        // The `__tests__` folder is excluded — test code references
        // tokens for assertion purposes, not consumption.
        if (entry === '__tests__') continue;
        walk(full);
        continue;
      }
      if (!entry.endsWith('.tsx') && !entry.endsWith('.ts')) continue;
      if (entry === 'tokens.ts' || entry === 'meta.ts' || entry === 'index.ts') continue;
      parts.push(readFileSync(full, 'utf8'));
    }
  }
}

function extractRawRefs(src: string): Set<string> {
  const found = new Set<string>();
  for (const m of src.matchAll(VAR_REF_RE)) {
    found.add(m[1]);
  }
  return found;
}

/**
 * Tailwind utility-class shape that consumes a token. Each namespace
 * maps to one or more class-name *roots*, we then check whether the
 * TSX contains `<root>-<utilityName>` as a Tailwind class fragment.
 */
const UTILITY_ROOTS: Partial<Record<TailwindNamespace, readonly string[]>> = {
  color: [
    'bg', 'text', 'fill', 'stroke',
    // border family: bare + each side / axis / logical
    'border', 'border-x', 'border-y', 'border-t', 'border-r', 'border-b', 'border-l',
    'border-s', 'border-e',
    // outline + ring (incl. ring-offset, which sets ring-offset-color in v4)
    'outline', 'ring', 'ring-offset', 'inset-ring',
    // gradients
    'from', 'to', 'via',
    // misc color slots
    'divide', 'divide-x', 'divide-y',
    'accent', 'caret', 'decoration', 'placeholder', 'shadow',
  ],
  radius: [
    'rounded', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l',
    'rounded-tl', 'rounded-tr', 'rounded-bl', 'rounded-br',
    'rounded-s', 'rounded-e', 'rounded-ss', 'rounded-se', 'rounded-es', 'rounded-ee',
  ],
  shadow: ['shadow', 'inset-shadow'],
  text: ['text'],
  font: ['font'],
  motion: ['duration', 'ease'],
  opacity: ['opacity'],
  blur: ['blur', 'backdrop-blur'],
  spacing: [
    // size / dims
    'size', 'h', 'w', 'min-h', 'min-w', 'max-h', 'max-w',
    // padding
    'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe',
    // margin
    'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me',
    // gap / space-between
    'gap', 'gap-x', 'gap-y', 'space-x', 'space-y',
    // inset
    'top', 'right', 'bottom', 'left', 'start', 'end',
    'inset', 'inset-x', 'inset-y',
    // transform / scroll
    'translate-x', 'translate-y',
    'scroll-m', 'scroll-mx', 'scroll-my', 'scroll-mt', 'scroll-mr', 'scroll-mb', 'scroll-ml',
    'scroll-p', 'scroll-px', 'scroll-py', 'scroll-pt', 'scroll-pr', 'scroll-pb', 'scroll-pl',
  ],
};

function utilityClasses(token: ResolvedTokenSpec): readonly string[] {
  const ns = token.tailwindNamespace;
  if (!ns || ns === 'none' || ns === 'default') return [];
  const roots = UTILITY_ROOTS[ns];
  if (!roots) return [];
  const utilityName = token.utilityAlias ?? token.name;
  return roots.map((root) => `${root}-${utilityName}`);
}

// Include `!` in BOTH boundaries: Tailwind v4 accepts `rounded-toast!`
// (trailing important) and `!rounded-toast` (leading important). `/` on
// the right is the opacity-modifier (`bg-card/50`).
const CLASS_BOUNDARY_LEFT = String.raw`(^|[\s"'\`(\[:!])`;
const CLASS_BOUNDARY_RIGHT = String.raw`($|[\s"'\`)\]/!])`;

function refsViaUtility(src: string, token: ResolvedTokenSpec): boolean {
  // Spacing/translate utilities accept Tailwind's negative-value prefix
  // (`-space-x-foo`, `-mt-foo`), so allow an optional leading `-` after
  // the boundary for those namespaces.
  const allowNegative = token.tailwindNamespace === 'spacing';
  const negPrefix = allowNegative ? '-?' : '';
  for (const cls of utilityClasses(token)) {
    const re = new RegExp(
      `${CLASS_BOUNDARY_LEFT}${negPrefix}${escapeRegExp(cls)}${CLASS_BOUNDARY_RIGHT}`
    );
    if (re.test(src)) return true;
  }
  return false;
}

function escapeRegExp(s: string): string {
  return s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

interface ComponentAudit {
  readonly component: string;
  readonly registered: readonly ResolvedTokenSpec[];
  readonly rawRefs: readonly string[];
  readonly dead: readonly string[];
  readonly dangling: readonly string[];
}

function appliesToForFolder(
  folder: string,
  allFolders: ReadonlySet<string>
): readonly string[] {
  // A folder owns `appliesTo: <folder>` exactly. It also owns
  // `appliesTo: <folder>-<sub>` ONLY when no sibling folder named
  // `<folder>-<sub>` exists, otherwise that sub-name is owned by the
  // sibling (e.g. `input-otp` lives next to `input`, so `input/` does
  // NOT claim `input-otp-*` tokens).
  const owned = new Set<string>();
  for (const t of TOKEN_REGISTRY) {
    if (t.layer !== 'component' || !t.appliesTo) continue;
    if (t.appliesTo === folder) {
      owned.add(t.appliesTo);
      continue;
    }
    if (!t.appliesTo.startsWith(`${folder}-`)) continue;
    if (allFolders.has(t.appliesTo)) continue;
    owned.add(t.appliesTo);
  }
  return Array.from(owned);
}

function bundledTokensFor(appliesTo: readonly string[], src: string): Set<string> {
  // The shorthand engine emits ONE class per component named exactly
  // after `appliesTo` (e.g. `.button`, `.menu-item`). A bundled token
  // only counts as "used" when the component's TSX actually applies
  // the matching class, otherwise themes have no surface to override.
  const bundled = new Set<string>();
  const varRef = /var\(--([a-z][a-z0-9-]*)/;
  for (const a of appliesTo) {
    const rule = SHORTHAND_INDEX.rules[a];
    if (!rule) continue;
    const re = new RegExp(`${CLASS_BOUNDARY_LEFT}${escapeRegExp(a)}${CLASS_BOUNDARY_RIGHT}`);
    if (!re.test(src)) continue;
    for (const decl of Object.values(rule)) {
      const m = varRef.exec(decl);
      if (m) bundled.add(m[1]);
    }
  }
  return bundled;
}

function auditComponent(folder: string, allFolders: ReadonlySet<string>): ComponentAudit {
  const appliesTo = appliesToForFolder(folder, allFolders);
  const registered = TOKEN_REGISTRY.filter(
    (t) => t.layer === 'component' && t.appliesTo && appliesTo.includes(t.appliesTo)
  );

  const src = readComponentSource(join(COMPONENTS_DIR, folder));
  const rawRefs = extractRawRefs(src);
  const ownRawRefs = Array.from(rawRefs).filter((name) =>
    appliesTo.some((a) => name === a || name.startsWith(`${a}-`))
  );

  const bundled = bundledTokensFor(appliesTo, src);

  const dead: string[] = [];
  for (const token of registered) {
    if (rawRefs.has(token.name)) continue;
    if (bundled.has(token.name)) continue;
    if (refsViaUtility(src, token)) continue;
    dead.push(token.name);
  }

  // Dangling = referenced in TSX but absent from the FULL registry
  // (any layer). A component is allowed to use roles (`--sidebar-border`)
  // and scalars (`--spacing`) without registering them under its own name.
  const allRegistered = new Set(TOKEN_REGISTRY.map((t) => t.name));
  const dangling = ownRawRefs.filter((n) => !allRegistered.has(n));

  return {
    component: folder,
    registered,
    rawRefs: ownRawRefs.toSorted(cmp),
    dead: dead.toSorted(cmp),
    dangling: dangling.toSorted(cmp),
  };
}

function main(): void {
  const folders = readdirSync(COMPONENTS_DIR).filter((entry) => {
    if (entry.startsWith('_') || entry.startsWith('.')) return false;
    return statSync(join(COMPONENTS_DIR, entry)).isDirectory();
  });

  const folderSet = new Set(folders);
  const audits = folders
    .map((f) => auditComponent(f, folderSet))
    .filter((a) => a.registered.length > 0);

  let totalDead = 0;
  let totalDangling = 0;
  const issues = audits.filter((a) => {
    if (a.dead.length === 0 && a.dangling.length === 0) return false;
    totalDead += a.dead.length;
    totalDangling += a.dangling.length;
    return true;
  });

  console.log('='.repeat(72));
  console.log('TOKEN AUDIT REPORT');
  console.log('='.repeat(72));
  console.log(`Components scanned: ${audits.length}`);
  console.log(`Components with issues: ${issues.length}`);
  console.log(`Dead tokens: ${totalDead}`);
  console.log(`Dangling refs: ${totalDangling}`);
  console.log();

  if (issues.length === 0) {
    console.log('All components are clean.');
    return;
  }

  for (const a of issues) {
    console.log('-'.repeat(72));
    console.log(`Component: ${a.component}  (registered: ${a.registered.length})`);
    if (a.dangling.length > 0) {
      console.log(`  ⚠ DANGLING (TSX → registry):`);
      for (const n of a.dangling) console.log(`      --${n}`);
    }
    if (a.dead.length > 0) {
      console.log(`  · dead (registered, not referenced anywhere):`);
      for (const n of a.dead) console.log(`      --${n}`);
    }
  }

  // Dangling refs are always a hard failure (TSX reads a token the
  // registry doesn't define). Dead tokens are also a failure: every
  // registered token emits :root defaults / @property blocks, so
  // registering one nothing reads is paying CSS bytes for nothing.
  if (totalDead > 0 || totalDangling > 0) {
    process.exit(1);
  }
}

main();
