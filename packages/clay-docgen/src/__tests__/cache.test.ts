/**
 * Coverage for the cache + filesystem helpers in `cache.ts`:
 *   - `listComponentSlugs` / `componentEntryFile`
 *   - `listAllComponentSourceFiles` (recursive walker)
 *   - `hashSourceFiles` (stable content-hash)
 *   - `normalizeDocs` (slug bucketing + primary-first sort)
 *   - `readDiskCache` / `writeDiskCache` (round-trip + miss + invalid)
 *   - `parseEntries` (runs the AST parser over a list of files)
 *
 * Each test builds a synthetic component tree under a temp dir so
 * the assertions are hermetic.
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  type AstComponentDoc,
  type ClayComponentDoc,
  componentEntryFile,
  hashSourceFiles,
  listAllComponentSourceFiles,
  listComponentSlugs,
  normalizeDocs,
  parseEntries,
  readDiskCache,
  writeDiskCache,
} from '../cache';

let tmpRoot: string;
let componentsDir: string;

beforeAll(() => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'clay-docgen-cache-'));
  componentsDir = join(tmpRoot, 'components');
  mkdirSync(componentsDir, { recursive: true });

  // Fixture component tree:
  //   components/
  //     button/      button.tsx (entry) + button.demos.tsx + tokens.ts
  //     dropdown-menu/  dropdown-menu.tsx (entry)
  //     .hidden/      ignored
  //     no-entry/     (no <slug>.tsx — listComponentSlugs still
  //                    includes it, componentEntryFile returns null)
  for (const [slug, files] of [
    ['button', { 'button.tsx': 'export function Button(p:{label:string}){return null}', 'button.demos.tsx': '', 'tokens.ts': '' }],
    ['dropdown-menu', { 'dropdown-menu.tsx': 'export function DropdownMenu(p:{open?:boolean}){return null}' }],
    ['.hidden', { 'whatever.ts': '' }],
    ['no-entry', { 'helper.ts': '' }],
  ] as const) {
    const dir = join(componentsDir, slug);
    mkdirSync(dir, { recursive: true });
    for (const [name, content] of Object.entries(files)) {
      writeFileSync(join(dir, name), content as string, 'utf8');
    }
  }
});

afterAll(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe('listComponentSlugs', () => {
  test('returns every directory entry under componentsDir (including hidden ones, callers filter)', () => {
    const slugs = listComponentSlugs(componentsDir).toSorted((a, b) => a.localeCompare(b));
    expect(slugs).toEqual(['.hidden', 'button', 'dropdown-menu', 'no-entry']);
  });
});

describe('componentEntryFile', () => {
  test('returns the absolute path when <slug>/<slug>.tsx exists', () => {
    expect(componentEntryFile(componentsDir, 'button')).toBe(
      join(componentsDir, 'button', 'button.tsx')
    );
  });

  test('returns null when the entry file is missing', () => {
    expect(componentEntryFile(componentsDir, 'no-entry')).toBeNull();
  });
});

describe('listAllComponentSourceFiles', () => {
  test('walks recursively, skips dotfiles/node_modules, returns sorted .ts(x) files', () => {
    const files = listAllComponentSourceFiles(componentsDir);
    const rel = files.map((f) => f.slice(componentsDir.length + 1));
    // .hidden/* and any non-ts(x) files are excluded.
    expect(rel.toSorted((a, b) => a.localeCompare(b))).toEqual([
      'button/button.demos.tsx',
      'button/button.tsx',
      'button/tokens.ts',
      'dropdown-menu/dropdown-menu.tsx',
      'no-entry/helper.ts',
    ]);
  });
});

describe('hashSourceFiles', () => {
  test('produces a stable hex digest for the same input', () => {
    const files = listAllComponentSourceFiles(componentsDir);
    expect(hashSourceFiles(files)).toBe(hashSourceFiles(files));
  });

  test('changes when any source file content changes', () => {
    const files = listAllComponentSourceFiles(componentsDir);
    const a = hashSourceFiles(files);
    writeFileSync(join(componentsDir, 'button', 'tokens.ts'), '// touched\n', 'utf8');
    const b = hashSourceFiles(files);
    expect(b).not.toBe(a);
  });
});

function mkAst(filePath: string, displayName: string): AstComponentDoc {
  return {
    filePath,
    displayName,
    description: `${displayName} description`,
    props: [
      {
        name: 'asChild',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: '',
      },
    ],
  };
}

describe('normalizeDocs', () => {
  test('groups docs by slug derived from the file path', () => {
    const docs = normalizeDocs([
      mkAst(join(componentsDir, 'button', 'button.tsx'), 'Button'),
      mkAst(join(componentsDir, 'dropdown-menu', 'dropdown-menu.tsx'), 'DropdownMenu'),
    ]);
    expect(Object.keys(docs).sort((a, b) => a.localeCompare(b))).toEqual(['button', 'dropdown-menu']);
  });

  test('drops docs whose file path does not match the components/<slug>/<slug>.tsx shape', () => {
    const docs = normalizeDocs([
      mkAst('/elsewhere/Random.tsx', 'Random'),
    ]);
    expect(docs).toEqual({});
  });

  test('sorts each slug bucket with the slug-matching display name first', () => {
    const docs = normalizeDocs([
      mkAst(join(componentsDir, 'dropdown-menu', 'dropdown-menu.tsx'), 'DropdownMenuItem'),
      mkAst(join(componentsDir, 'dropdown-menu', 'dropdown-menu.tsx'), 'DropdownMenu'),
      mkAst(join(componentsDir, 'dropdown-menu', 'dropdown-menu.tsx'), 'DropdownMenuLabel'),
    ]);
    expect(docs['dropdown-menu'].map((d) => d.displayName)).toEqual([
      'DropdownMenu',
      'DropdownMenuItem',
      'DropdownMenuLabel',
    ]);
  });

  test('back-fills empty prop descriptions with the common-prop catalogue', () => {
    // `asChild` is in COMMON_PROP_DESCRIPTIONS, so its empty
    // description is replaced with the shared sentence.
    const docs = normalizeDocs([
      mkAst(join(componentsDir, 'button', 'button.tsx'), 'Button'),
    ]);
    expect(docs.button[0].props[0].description).toContain('render the child element');
  });

  test('preserves explicit prop descriptions when present', () => {
    const docs = normalizeDocs([
      {
        filePath: join(componentsDir, 'button', 'button.tsx'),
        displayName: 'Button',
        description: '',
        props: [
          {
            name: 'asChild',
            type: 'boolean',
            required: false,
            defaultValue: null,
            description: 'Explicit override.',
          },
        ],
      },
    ]);
    expect(docs.button[0].props[0].description).toBe('Explicit override.');
  });

  test('non-primary display names with no slug-match collation fall back to alphabetical order', () => {
    const docs = normalizeDocs([
      mkAst(join(componentsDir, 'button', 'button.tsx'), 'ButtonSecondary'),
      mkAst(join(componentsDir, 'button', 'button.tsx'), 'ButtonGroup'),
    ]);
    expect(docs.button.map((d) => d.displayName)).toEqual(['ButtonGroup', 'ButtonSecondary']);
  });
});

describe('readDiskCache / writeDiskCache', () => {
  test('round-trips the docs payload when the key matches', () => {
    const cacheDir = mkdtempSync(join(tmpdir(), 'clay-docgen-cache-rw-'));
    const cacheFile = join(cacheDir, 'cache.json');
    const docs: Record<string, ClayComponentDoc[]> = {
      button: [{ displayName: 'Button', description: '', props: [] }],
    };
    writeDiskCache(cacheDir, cacheFile, 'key-1', docs, () => {});
    expect(readDiskCache(cacheFile, 'key-1')).toEqual(docs);
    rmSync(cacheDir, { recursive: true, force: true });
  });

  test('returns null when the cache file is missing', () => {
    expect(readDiskCache(join(tmpRoot, 'nope.json'), 'k')).toBeNull();
  });

  test('returns null when the stored key does not match', () => {
    const cacheDir = mkdtempSync(join(tmpdir(), 'clay-docgen-cache-miss-'));
    const cacheFile = join(cacheDir, 'cache.json');
    writeDiskCache(cacheDir, cacheFile, 'old-key', { x: [] }, () => {});
    expect(readDiskCache(cacheFile, 'new-key')).toBeNull();
    rmSync(cacheDir, { recursive: true, force: true });
  });

  test('returns null when the cache file is malformed JSON', () => {
    const cacheDir = mkdtempSync(join(tmpdir(), 'clay-docgen-cache-bad-'));
    const cacheFile = join(cacheDir, 'cache.json');
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(cacheFile, 'not-json{', 'utf8');
    expect(readDiskCache(cacheFile, 'k')).toBeNull();
    rmSync(cacheDir, { recursive: true, force: true });
  });

  test('writeDiskCache reports failures through the onError callback without throwing', () => {
    const messages: string[] = [];
    // `/` is not writable on most CI images and triggers the catch
    // branch. We don't care about the exact errno text — just that
    // the helper swallows it and forwards a message.
    writeDiskCache('/__nonwritable__/clay-docgen', '/__nonwritable__/clay-docgen/cache.json', 'k', {}, (m) => {
      messages.push(m);
    });
    expect(messages.length).toBe(1);
    expect(messages[0]).toMatch(/failed to write disk cache/);
  });
});

describe('parseEntries', () => {
  test('runs the AST parser over every entry file and flattens the result', () => {
    const entries = [
      join(componentsDir, 'button', 'button.tsx'),
      join(componentsDir, 'dropdown-menu', 'dropdown-menu.tsx'),
    ];
    const docs = parseEntries(entries);
    expect(docs.map((d) => d.displayName).sort((a, b) => a.localeCompare(b))).toEqual(['Button', 'DropdownMenu']);
  });
});
