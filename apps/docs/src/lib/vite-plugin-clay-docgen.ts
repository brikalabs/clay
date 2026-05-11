/**
 * Walks `src/components/<slug>/<slug>.tsx` with a parser-only AST visitor
 * (see `clay-docgen-ast.ts`) and exposes the result as a virtual module
 * so the docs site can render per-component props tables without a
 * separate generation step.
 *
 * Cost model: parsing one entry file is ~10-30ms (TypeScript parser,
 * no type checker). A full cold parse of all entries is ~1s; the disk
 * cache keyed on a content hash skips even that on warm boot.
 *
 * Cache plumbing + AST normalisation lives in `clay-docgen-cache.ts`
 * so each module stays small.
 */

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  type ClayComponentDoc,
  componentEntryFile,
  hashSourceFiles,
  listAllComponentSourceFiles,
  listComponentSlugs,
  normalizeDocs,
  parseEntries,
  readDiskCache,
  writeDiskCache,
} from './clay-docgen-cache';

export type { ClayComponentDoc, ClayPropDoc } from './clay-docgen-cache';

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

function log(message: string): void {
  // Match Astro/Vite's terminal style: timestamp prefix, colored tag.
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  // eslint-disable-next-line no-console -- intentional dev-server log
  console.log(`\x1b[90m${time}\x1b[0m \x1b[36m[clay-docgen]\x1b[0m ${message}`);
}

// `<slug>/<slug>.tsx` — the entry file the AST walker reads. Changes
// to other files under `components/<slug>/` (helpers, demos, tokens)
// may still affect output, but we can't isolate which slug is
// affected, so those trigger a full reparse on next load.
const ENTRY_FILE_RE = /^([^/]+)\/\1\.tsx$/;

export function clayDocgenPlugin(_options: ClayDocgenPluginOptions): ClayDocgenPlugin {
  const here = dirname(fileURLToPath(import.meta.url));
  const claySrc = resolve(here, '../../../../packages/clay/src');
  const componentsDir = resolve(claySrc, 'components');
  const cacheDir = resolve(here, '../../node_modules/.cache/clay-docgen');
  const cacheFile = resolve(cacheDir, 'cache.json');

  const watchedFiles = new Set<string>();
  let cache: Record<string, ClayComponentDoc[]> | null = null;

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

    const cached = readDiskCache(cacheFile, key);
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
    writeDiskCache(cacheDir, cacheFile, key, docs, log);
    return docs;
  }

  function getDocs(): Record<string, ClayComponentDoc[]> {
    cache ??= generate();
    return cache;
  }

  function persistCache(): void {
    if (!cache) return;
    const allSources = listAllComponentSourceFiles(componentsDir);
    const key = hashSourceFiles(allSources);
    writeDiskCache(cacheDir, cacheFile, key, cache, log);
  }

  /**
   * Re-parse a single component's entry file and patch the result into
   * the in-memory aggregate. Lets edits to one component skip the full
   * 64-file parse — typical edit-loop drops from ~10s to a few
   * hundred ms.
   */
  function reparseSlug(slug: string): boolean {
    if (!cache) return false;
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
    // Merge: parsing one entry file may surface more than one display
    // name (e.g. <Card>, <CardHeader>) — they all share the slug
    // derived from the file path, so the result is keyed by slug just
    // like the full run.
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

  return {
    name: 'clay-docgen',
    resolveId(source: string): string | null {
      return source === VIRTUAL_ID ? RESOLVED_VIRTUAL_ID : null;
    },
    load(id: string): string | null {
      if (id !== RESOLVED_VIRTUAL_ID) return null;
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
      // The components directory lives outside the docs root, so
      // Vite's default watcher ignores it. Add it explicitly so
      // changes to any demos.tsx, meta.ts, tokens.ts, or new component
      // folder reach the dev server and trigger a reload.
      server.watcher.add(componentsDir);

      const onChange = (file: string) => {
        if (!file.startsWith(componentsDir)) return;
        if (!/\.(ts|tsx)$/.test(file)) return;
        const relative = file.slice(componentsDir.length + 1);
        const entryMatch = ENTRY_FILE_RE.exec(relative);

        // Fast path: entry file change with the aggregate already
        // built. Reparse just that slug and patch the in-memory map.
        // Avoids the ~10s full-reparse cost.
        if (entryMatch && cache) {
          reparseSlug(entryMatch[1]);
        } else if (cache) {
          // Non-entry source changed (or entry without a built
          // cache): we can't isolate the affected slug, so drop the
          // full cache and let the next load do a full reparse. Disk
          // cache is keyed by content hash, so it'll auto-invalidate
          // too.
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
