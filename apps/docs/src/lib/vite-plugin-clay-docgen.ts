import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type AstComponentDoc, extractComponentDocs } from './clay-docgen-ast';
import { slugFromPath, slugToPascalCase } from './docgen-helpers';

/**
 * Walks `src/components/<slug>/<slug>.tsx` with a parser-only AST visitor
 * (see `clay-docgen-ast.ts`) and exposes the result as a virtual module
 * so the docs site can render per-component props tables without a
 * separate generation step.
 *
 * Cost model: parsing one entry file is ~10-30ms (TypeScript parser, no
 * type checker). A full cold parse of all entries is ~1s; the disk cache
 * keyed on a content hash skips even that on warm boot.
 */

export interface ClayDocgenPluginOptions {
  readonly dev: boolean;
}

interface ClayDocgenPlugin {
  readonly name: string;
  resolveId(source: string): string | null;
  load(id: string): string | null;
  configureServer?(server: ViteDevServer): void;
}

interface ViteDevServer {
  readonly watcher: { add(path: string): void };
  readonly moduleGraph: {
    getModuleById(id: string): unknown;
    invalidateModule(mod: unknown): void;
  };
  ws?: { send(payload: { type: 'full-reload' }): void };
}

const VIRTUAL_ID = 'virtual:clay-docgen';
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`;

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
 * Generic description fallback for props that recur across many Radix-based
 * primitives. Lets us document them once globally instead of asking every
 * component to repeat the same TSDoc.
 */
const COMMON_PROP_DESCRIPTIONS: Readonly<Record<string, string>> = {
  asChild:
    'When true, render the child element instead of the default DOM node and merge props. Lets you compose with `<a>`, `<Link>`, or another primitive while keeping behavior and styling.',
};

function listComponentSlugs(componentsDir: string): readonly string[] {
  return readdirSync(componentsDir).filter((entry) => {
    const full = resolve(componentsDir, entry);
    return statSync(full).isDirectory();
  });
}

function componentEntryFile(componentsDir: string, slug: string): string | null {
  const candidate = resolve(componentsDir, slug, `${slug}.tsx`);
  return existsSync(candidate) ? candidate : null;
}

// Walks the components tree and returns every `.ts`/`.tsx` file. Used to
// build the cache key — any source change under `components/` may
// affect parsed output (a renamed local interface, a new prop, a JSDoc
// edit), so the conservative key is the full content hash.
function listAllComponentSourceFiles(componentsDir: string): string[] {
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
  return out.sort();
}

// Bump when the cache file shape or generation logic changes so old
// entries don't get reused under a different code path.
const CACHE_VERSION = 2;

function hashSourceFiles(files: readonly string[]): string {
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

function normalizeDocs(docs: readonly AstComponentDoc[]): Record<string, ClayComponentDoc[]> {
  const bySlug: Record<string, ClayComponentDoc[]> = {};

  for (const doc of docs) {
    const slug = slugFromPath(doc.filePath);
    if (!slug) {
      continue;
    }
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

function parseEntries(entryFiles: readonly string[]): readonly AstComponentDoc[] {
  const out: AstComponentDoc[] = [];
  for (const file of entryFiles) {
    for (const doc of extractComponentDocs(file)) {
      out.push(doc);
    }
  }
  return out;
}

function log(message: string): void {
  // Match Astro/Vite's terminal style: timestamp prefix, colored tag.
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  // eslint-disable-next-line no-console -- intentional dev-server log
  console.log(`\x1b[90m${time}\x1b[0m \x1b[36m[clay-docgen]\x1b[0m ${message}`);
}

export function clayDocgenPlugin(_options: ClayDocgenPluginOptions): ClayDocgenPlugin {
  const here = dirname(fileURLToPath(import.meta.url));
  const claySrc = resolve(here, '../../../../packages/clay/src');
  const componentsDir = resolve(claySrc, 'components');
  const cacheDir = resolve(here, '../../node_modules/.cache/clay-docgen');
  const cacheFile = resolve(cacheDir, 'cache.json');

  const watchedFiles = new Set<string>();
  let cache: Record<string, ClayComponentDoc[]> | null = null;

  function readDiskCache(key: string): Record<string, ClayComponentDoc[]> | null {
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

  function writeDiskCache(key: string, docs: Record<string, ClayComponentDoc[]>): void {
    try {
      mkdirSync(cacheDir, { recursive: true });
      writeFileSync(cacheFile, JSON.stringify({ key, docs }));
    } catch (err) {
      log(`failed to write disk cache: ${(err as Error).message}`);
    }
  }

  function generate(): Record<string, ClayComponentDoc[]> {
    const slugs = listComponentSlugs(componentsDir);
    const entryFiles = slugs
      .map((slug) => componentEntryFile(componentsDir, slug))
      .filter((file): file is string => file !== null);
    for (const file of entryFiles) {
      watchedFiles.add(file);
    }

    const hashStart = performance.now();
    const allSources = listAllComponentSourceFiles(componentsDir);
    const key = hashSourceFiles(allSources);
    const hashMs = Math.round(performance.now() - hashStart);

    const cached = readDiskCache(key);
    if (cached) {
      const componentCount = Object.values(cached).reduce((acc, arr) => acc + arr.length, 0);
      log(`cache hit (${componentCount} components, hashed ${allSources.length} files in ${hashMs}ms)`);
      return cached;
    }

    log(`parsing ${entryFiles.length} component entries (cache miss)...`);
    const parseStart = performance.now();
    const docs = normalizeDocs(parseEntries(entryFiles));
    const parseMs = Math.round(performance.now() - parseStart);
    const componentCount = Object.values(docs).reduce((acc, arr) => acc + arr.length, 0);
    log(`parsed ${componentCount} components in ${parseMs}ms — writing disk cache`);
    writeDiskCache(key, docs);
    return docs;
  }

  function getDocs(): Record<string, ClayComponentDoc[]> {
    cache ??= generate();
    return cache;
  }

  // Re-parse a single component's entry file and patch the result into
  // the in-memory aggregate. Lets edits to one component skip the full
  // 64-file parse — typical edit-loop drops from ~10s to a few hundred ms.
  function reparseSlug(slug: string): boolean {
    if (!cache) {
      return false;
    }
    const entry = componentEntryFile(componentsDir, slug);
    if (!entry) {
      // Component folder/file was removed — drop its docs.
      if (cache[slug]) {
        delete cache[slug];
        persistCache();
        log(`removed slug "${slug}" from cache`);
      }
      return true;
    }
    const t = performance.now();
    const partial = normalizeDocs(parseEntries([entry]));
    // Merge: parsing one entry file may surface more than one display name
    // (e.g. <Card>, <CardHeader>) — they all share the slug derived from
    // the file path, so the result is keyed by slug just like the full run.
    if (partial[slug]) {
      cache[slug] = partial[slug];
    } else {
      // Entry compiled to no exported components — clear stale entries.
      delete cache[slug];
    }
    persistCache();
    log(`re-parsed "${slug}" in ${Math.round(performance.now() - t)}ms`);
    return true;
  }

  function persistCache(): void {
    if (!cache) {
      return;
    }
    const allSources = listAllComponentSourceFiles(componentsDir);
    const key = hashSourceFiles(allSources);
    writeDiskCache(key, cache);
  }

  // Cheap pre-walk: populates `watchedFiles` without parsing. Lets the
  // file watcher route entry-file changes correctly even before the
  // virtual module is first imported.
  function preWatchEntryFiles(): void {
    for (const slug of listComponentSlugs(componentsDir)) {
      const file = componentEntryFile(componentsDir, slug);
      if (file) {
        watchedFiles.add(file);
      }
    }
  }

  // `<slug>/<slug>.tsx` — the entry file the AST walker reads. Changes
  // to other files under `components/<slug>/` (helpers, demos, tokens)
  // may still affect output, but we can't isolate which slug is
  // affected, so those trigger a full reparse on next load.
  const ENTRY_FILE_RE = /^([^/]+)\/\1\.tsx$/;

  return {
    name: 'clay-docgen',
    resolveId(source: string): string | null {
      return source === VIRTUAL_ID ? RESOLVED_VIRTUAL_ID : null;
    },
    load(id: string): string | null {
      if (id !== RESOLVED_VIRTUAL_ID) {
        return null;
      }
      const docs = getDocs();
      return `export default ${JSON.stringify(docs)};\n`;
    },
    configureServer(server) {
      // No eager parse — defer until the virtual module is actually
      // imported. The watcher still needs to know which files matter,
      // so pre-walk just the entry list (cheap; no TS program).
      preWatchEntryFiles();
      log(`ready (lazy: ${watchedFiles.size} components registered, parse deferred)`);
      for (const file of watchedFiles) {
        server.watcher.add(file);
      }
      // The components directory lives outside the docs root, so Vite's
      // default watcher ignores it. Add it explicitly so changes to any
      // demos.tsx, meta.ts, tokens.ts, or new component folder reach
      // the dev server and trigger a reload.
      server.watcher.add(componentsDir);

      const onChange = (file: string) => {
        if (!file.startsWith(componentsDir)) {
          return;
        }
        if (!/\.(ts|tsx)$/.test(file)) {
          return;
        }
        const relative = file.slice(componentsDir.length + 1);
        const entryMatch = ENTRY_FILE_RE.exec(relative);

        // Fast path: entry file change with the aggregate already built.
        // Reparse just that slug and patch the in-memory map. Avoids the
        // ~10s full-reparse cost.
        if (entryMatch && cache) {
          reparseSlug(entryMatch[1]);
        } else if (cache) {
          // Non-entry source changed (or entry without a built cache):
          // we can't isolate the affected slug, so drop the full cache
          // and let the next load do a full reparse. Disk cache is
          // keyed by content hash, so it'll auto-invalidate too.
          cache = null;
          log(`invalidated by ${relative} (full reparse on next load)`);
        }

        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
        }
        // Demos / meta / tokens changes don't strictly invalidate the
        // virtual module, but the docs site composes them via
        // `import.meta.glob`, so a full reload is still needed.
        server.ws?.send({ type: 'full-reload' });
      };
      const watcher = server.watcher as unknown as {
        on(event: string, cb: (file: string) => void): void;
      };
      watcher.on('change', onChange);
      watcher.on('add', onChange);
      watcher.on('unlink', onChange);
    },
  };
}
