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
  readonly demosPath: string | null;
}

function listComponentFolders(): ComponentFolder[] {
  const out: ComponentFolder[] = [];
  for (const name of readdirSync(COMPONENTS_DIR)) {
    if (name.startsWith('_') || name.startsWith('.') || name === '__tests__') continue;
    const full = join(COMPONENTS_DIR, name);
    if (!statSync(full).isDirectory()) continue;
    const metaPath = join(full, 'meta.ts');
    const demosPath = join(full, `${name}.demos.tsx`);
    let demosExists = true;
    try {
      statSync(demosPath);
    } catch {
      demosExists = false;
    }
    out.push({ slug: name, metaPath, demosPath: demosExists ? demosPath : null });
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
      if (!folder.demosPath) continue;
      const src = readFileSync(folder.demosPath, 'utf8');
      expect(src).not.toMatch(/\bexport const accessibility\b/);
    }
  });

  test('every component that ships a *.demos.tsx also documents accessibility in meta.ts', () => {
    // The inverse invariant: an interactive component without an `accessibility`
    // array on its meta is almost certainly an oversight. Allowlist anything
    // genuinely non-interactive (e.g. brand glyphs).
    const ALLOW_NO_A11Y: ReadonlySet<string> = new Set([
      // Brand marks, no user interaction.
      'brika-logo',
      'clay-logo',
    ]);
    for (const folder of FOLDERS) {
      if (!folder.demosPath || ALLOW_NO_A11Y.has(folder.slug)) continue;
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
});
