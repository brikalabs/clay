/**
 * Token usage audit. For every Layer-2 component:
 *   - Lists registered tokens (by appliesTo).
 *   - Lists every reference in the component's TSX, both raw `var(--…)`
 *     and Tailwind utility-class shapes derived from `tailwindNamespace`
 *     (`bg-X`, `rounded-X`, `shadow-X`, `text-X`, `font-X`, `duration-X`,
 *     `ease-X`, `opacity-X`, `blur-X`).
 *   - Shorthand-bundle coverage (geom / typo / motion / border).
 *   - Flags:
 *       a) registered-but-unreferenced (dead, no shorthand, no raw ref,
 *          no namespaced utility match).
 *       b) referenced-but-unregistered (dangling, TSX uses a `--name`
 *          that the registry doesn't define).
 *
 * Usage: `bun run scripts/audit-tokens.ts`
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TOKEN_REGISTRY } from '../src/tokens/registry';
import { SHORTHAND_INDEX } from '../src/tokens/shorthands';
import type { ResolvedTokenSpec, TailwindNamespace } from '../src/tokens/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const COMPONENTS_DIR = join(ROOT, 'src/components');

const VAR_REF_RE = /\((?:[a-z][\w-]*\s*:\s*)?--([a-z][a-z0-9-]*)/g;

const cmp = (a: string, b: string) => a.localeCompare(b);

function readComponentSource(folder: string): string {
  const parts: string[] = [];
  for (const entry of readdirSync(folder)) {
    if (!entry.endsWith('.tsx') && !entry.endsWith('.ts')) continue;
    if (entry === 'tokens.ts' || entry === 'meta.ts' || entry === 'index.ts') continue;
    parts.push(readFileSync(join(folder, entry), 'utf8'));
  }
  return parts.join('\n');
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
    'bg', 'text', 'border', 'outline', 'ring', 'fill', 'stroke',
    'from', 'to', 'via', 'divide', 'accent', 'caret', 'decoration',
    'placeholder', 'shadow',
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
};

function utilityClasses(token: ResolvedTokenSpec): readonly string[] {
  const ns = token.tailwindNamespace;
  if (!ns || ns === 'none' || ns === 'default') return [];
  const roots = UTILITY_ROOTS[ns];
  if (!roots) return [];
  const utilityName = token.utilityAlias ?? token.name;
  return roots.map((root) => `${root}-${utilityName}`);
}

// Include `!` in the right boundary for Tailwind v4 important modifier
// (`rounded-toast!`), `/` for the opacity-modifier (`bg-card/50`).
const CLASS_BOUNDARY_LEFT = String.raw`(^|[\s"'\`(\[:])`;
const CLASS_BOUNDARY_RIGHT = String.raw`($|[\s"'\`)\]/!])`;

function refsViaUtility(src: string, token: ResolvedTokenSpec): boolean {
  for (const cls of utilityClasses(token)) {
    const re = new RegExp(`${CLASS_BOUNDARY_LEFT}${escapeRegExp(cls)}${CLASS_BOUNDARY_RIGHT}`);
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
}

main();
