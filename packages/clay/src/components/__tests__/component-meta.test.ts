/**
 * Cross-component invariants for the auto-discovered registry. These run
 * at the package level (not docs-site level) so contributors catch the
 * regressions before they propagate.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, test } from 'bun:test';

const HERE = dirname(new URL(import.meta.url).pathname);
const COMPONENTS_DIR = resolve(HERE, '..');

interface ComponentFolder {
  readonly slug: string;
  readonly metaPath: string;
  readonly demoFiles: readonly string[];
}

function listComponentFolders(): ComponentFolder[] {
  const out: ComponentFolder[] = [];
  for (const name of readdirSync(COMPONENTS_DIR)) {
    if (name.startsWith('_') || name.startsWith('.') || name === '__tests__') continue;
    const full = join(COMPONENTS_DIR, name);
    if (!statSync(full).isDirectory()) continue;
    const metaPath = join(full, 'meta.ts');
    const demosDir = join(full, 'demos');
    let demoFiles: readonly string[] = [];
    try {
      demoFiles = readdirSync(demosDir)
        .filter((entry) => entry.endsWith('.demos.tsx'))
        .map((entry) => join(demosDir, entry));
    } catch {
      // No demos/ folder — leave the list empty.
    }
    out.push({ slug: name, metaPath, demoFiles });
  }
  return out;
}

const FOLDERS = listComponentFolders();

describe('component meta + demos co-location', () => {
  test('every component folder ships a meta.ts', () => {
    for (const folder of FOLDERS) {
      const src = readFileSync(folder.metaPath, 'utf8');
      expect(src).toContain('export const meta');
    }
  });

  test('accessibility callouts live in meta.ts, never in *.demos.tsx', () => {
    // Static prose metadata belongs next to `description` in meta.ts so it
    // can be imported without pulling in React, icons, and demo helpers.
    // This regression guard fires if anyone re-introduces the old pattern.
    for (const folder of FOLDERS) {
      for (const demoPath of folder.demoFiles) {
        const src = readFileSync(demoPath, 'utf8');
        expect(src).not.toMatch(/\bexport const accessibility\b/);
      }
    }
  });

  test('every component that ships demos also documents accessibility in meta.ts', () => {
    // The inverse invariant: an interactive component without an `accessibility`
    // array on its meta is almost certainly an oversight. Allowlist anything
    // genuinely non-interactive (e.g. brand glyphs).
    const ALLOW_NO_A11Y: ReadonlySet<string> = new Set([
      // Brand marks, no user interaction.
      'brika-logo',
      'clay-logo',
    ]);
    for (const folder of FOLDERS) {
      if (folder.demoFiles.length === 0 || ALLOW_NO_A11Y.has(folder.slug)) continue;
      const meta = readFileSync(folder.metaPath, 'utf8');
      expect(meta).toMatch(/\baccessibility\s*:\s*\[/);
    }
  });

  test('every meta.ts compiles to a valid module (smoke check)', async () => {
    for (const folder of FOLDERS) {
      const mod = (await import(folder.metaPath)) as { meta?: { name?: string } };
      expect(mod.meta).toBeDefined();
      expect(mod.meta?.name).toBe(folder.slug);
    }
  });

  test('accessibility entries are single-quoted strings, not template literals', () => {
    // Template literals force authors to write `\\`aria-label\\`` for every
    // inline-code ref. Single-quoted strings let them write '`aria-label`'
    // unescaped. This guard fires when someone reintroduces the backtick form.
    for (const folder of FOLDERS) {
      const src = readFileSync(folder.metaPath, 'utf8');
      const block = /\baccessibility:\s*\[\n([\s\S]*?)\n\s*\],/.exec(src);
      if (!block) continue;
      const body = block[1];
      for (const rawLine of body.split('\n')) {
        const line = rawLine.trim();
        if (!line) continue;
        // Each entry should start with a single quote (or `"`); flag any
        // template literals so reviewers see the regression early.
        expect(line.startsWith('`')).toBe(false);
      }
    }
  });

  test('every demo file uses the convention: `export default function …Demo`', () => {
    // The zero-boilerplate convention: each `<slug>/demos/<kebab>.demos.tsx`
    // file exports exactly one demo as the default export, with no `demoMeta`
    // / `defineDemos` boilerplate. Title comes from the filename, description
    // from the leading JSDoc. This guard fires if anyone re-introduces the
    // old `export const demoMeta = defineDemos([...])` pattern.
    for (const folder of FOLDERS) {
      for (const demoPath of folder.demoFiles) {
        const src = readFileSync(demoPath, 'utf8');
        expect(src).toMatch(/\bexport\s+default\s+function\b/);
        expect(src).not.toMatch(/\bdefineDemos\b/);
        expect(src).not.toMatch(/\bexport\s+const\s+demoMeta\b/);
      }
    }
  });
});
