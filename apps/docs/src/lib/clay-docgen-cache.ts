/**
 * Disk-cache + file-walker helpers used by the Vite docgen plugin.
 * Pulled out of `vite-plugin-clay-docgen.ts` so each module stays
 * under 300 lines.
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { type AstComponentDoc, extractComponentDocs } from './clay-docgen-ast';
import { slugFromPath, slugToPascalCase } from './docgen-helpers';

export interface ClayPropDoc {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  readonly defaultValue: string | null;
  readonly description: string;
}

export interface ClayComponentDoc {
  readonly displayName: string;
  readonly description: string;
  readonly props: readonly ClayPropDoc[];
}

/**
 * Generic description fallback for props that recur across many
 * Radix-based primitives. Lets us document them once globally instead
 * of asking every component to repeat the same TSDoc.
 */
const COMMON_PROP_DESCRIPTIONS: Readonly<Record<string, string>> = {
  asChild:
    'When true, render the child element instead of the default DOM node and merge props. Lets you compose with `<a>`, `<Link>`, or another primitive while keeping behavior and styling.',
};

// Bump when the cache file shape or generation logic changes so old
// entries don't get reused under a different code path.
const CACHE_VERSION = 2;

export function listComponentSlugs(componentsDir: string): readonly string[] {
  return readdirSync(componentsDir).filter((entry) => {
    const full = resolve(componentsDir, entry);
    return statSync(full).isDirectory();
  });
}

export function componentEntryFile(componentsDir: string, slug: string): string | null {
  const candidate = resolve(componentsDir, slug, `${slug}.tsx`);
  return existsSync(candidate) ? candidate : null;
}

/**
 * Walk the components tree and return every `.ts`/`.tsx` file. Used
 * to build the cache key — any source change under `components/` may
 * affect parsed output (a renamed local interface, a new prop, a
 * JSDoc edit), so the conservative key is the full content hash.
 */
export function listAllComponentSourceFiles(componentsDir: string): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith('.') || entry === 'node_modules') {
        continue;
      }
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (/\.tsx?$/.test(entry)) {
        out.push(full);
      }
    }
  };
  walk(componentsDir);
  return out.sort((a, b) => a.localeCompare(b));
}

export function hashSourceFiles(files: readonly string[]): string {
  const h = createHash('sha256');
  h.update(`v${CACHE_VERSION}\0`);
  for (const file of files) {
    h.update(file);
    h.update('\0');
    h.update(readFileSync(file));
    h.update('\0');
  }
  return h.digest('hex');
}

export function normalizeDocs(
  docs: readonly AstComponentDoc[]
): Record<string, ClayComponentDoc[]> {
  const bySlug: Record<string, ClayComponentDoc[]> = {};

  for (const doc of docs) {
    const slug = slugFromPath(doc.filePath);
    if (!slug) continue;
    const props = doc.props.map<ClayPropDoc>((prop) => ({
      name: prop.name,
      type: prop.type,
      required: prop.required,
      defaultValue: prop.defaultValue,
      description: prop.description || (COMMON_PROP_DESCRIPTIONS[prop.name] ?? ''),
    }));
    bySlug[slug] ??= [];
    bySlug[slug].push({
      displayName: doc.displayName,
      description: doc.description,
      props,
    });
  }

  // Within each slug, sort: primary component first, then alphabetical.
  for (const slug of Object.keys(bySlug)) {
    const primary = slugToPascalCase(slug);
    bySlug[slug].sort((a, b) => {
      if (a.displayName === primary) return -1;
      if (b.displayName === primary) return 1;
      return a.displayName.localeCompare(b.displayName);
    });
  }

  return bySlug;
}

export function parseEntries(entryFiles: readonly string[]): readonly AstComponentDoc[] {
  const out: AstComponentDoc[] = [];
  for (const file of entryFiles) {
    for (const doc of extractComponentDocs(file)) {
      out.push(doc);
    }
  }
  return out;
}

export function readDiskCache(
  cacheFile: string,
  key: string
): Record<string, ClayComponentDoc[]> | null {
  try {
    const raw = readFileSync(cacheFile, 'utf8');
    const parsed = JSON.parse(raw) as {
      key?: string;
      docs?: Record<string, ClayComponentDoc[]>;
    };
    if (parsed.key === key && parsed.docs) {
      return parsed.docs;
    }
  } catch {
    // No cache yet, or invalid JSON — fall through to fresh parse.
  }
  return null;
}

export function writeDiskCache(
  cacheDir: string,
  cacheFile: string,
  key: string,
  docs: Record<string, ClayComponentDoc[]>,
  onError: (message: string) => void
): void {
  try {
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(cacheFile, JSON.stringify({ key, docs }));
  } catch (err) {
    onError(`failed to write disk cache: ${(err as Error).message}`);
  }
}
