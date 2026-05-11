/**
 * Performance regression guards. These are intentionally generous
 * (6 ms / scanVarRefs-vs-regex / no-disk-I/O-at-module-load) so they
 * catch real regressions without flaking on CI noise.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'bun:test';

import { TOKEN_REGISTRY } from '../tokens/registry';
import { SHORTHAND_INDEX } from '../tokens/shorthands';
import {
  SRC,
  buildContributions,
  scanVarRefs,
} from './tailwind-plugin.fixtures';

describe('performance', () => {
  test('buildContributions (fused single pass) over the full registry runs under 6ms (typical: <2ms)', () => {
    // Threshold bumped from 3ms → 6ms as the registry grew past 50 components
    // and ~600 tokens. Typical local runs still finish in 1–2ms; the headroom
    // absorbs CI noise without masking a real regression. Optimise the implementation
    // before bumping again.
    for (let i = 0; i < 5; i++) buildContributions(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs);
    const start = performance.now();
    const ITERATIONS = 100;
    for (let i = 0; i < ITERATIONS; i++) {
      buildContributions(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs);
    }
    const avg = (performance.now() - start) / ITERATIONS;
    expect(avg).toBeLessThan(6);
  });

  test('scanVarRefs is faster than a regex matchAll on the same input', () => {
    // 559 tokens, average ~1-2 var() refs per default. Scanner avoids regex
    // engine + RegExpExecArray allocation.
    const REF = /var\(--([a-z][a-z0-9-]*)/g;
    const samples = TOKEN_REGISTRY.flatMap((t) =>
      t.defaultDark ? [t.defaultLight, t.defaultDark] : [t.defaultLight]
    );

    const ITERATIONS = 1000;
    // Warm both implementations.
    for (let i = 0; i < 10; i++) {
      for (const s of samples) {
        for (const _ of s.matchAll(REF)) {
          /* noop */
        }
      }
      for (const s of samples) {
        scanVarRefs(s, () => {});
      }
    }

    const t0 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      for (const s of samples) {
        for (const _ of s.matchAll(REF)) {
          /* noop */
        }
      }
    }
    const regexMs = performance.now() - t0;

    const t1 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      for (const s of samples) {
        scanVarRefs(s, () => {});
      }
    }
    const scannerMs = performance.now() - t1;

    expect(scannerMs).toBeLessThan(regexMs);
  });

  test('plugin does no disk I/O at module load (lazy theme-file load is permitted)', async () => {
    // The previous implementation walked `styles/` and `components/<name>/<name>.tsx`
    // synchronously at module load. The refactor removed that. The current
    // plugin only touches the disk when a consumer passes `theme: '<path>.json'`,
    // which happens at plugin-options time, not module load. This guard makes
    // sure no future change reintroduces eager I/O.
    const pluginEntry = readFileSync(resolve(SRC, 'tailwind.ts'), 'utf8');
    const themeOption = readFileSync(resolve(SRC, 'tailwind/theme-option.ts'), 'utf8');
    // Directory walks are forbidden entirely.
    expect(pluginEntry).not.toContain('readdirSync');
    expect(themeOption).not.toContain('readdirSync');
    // `readFileSync` may only appear inside `loadThemeFromFile`, which now
    // lives in `tailwind/theme-option.ts`. The plugin entry must not call
    // it at all.
    expect(pluginEntry).not.toContain('readFileSync(');
    const matches = [...themeOption.matchAll(/readFileSync\(/g)];
    expect(matches).toHaveLength(1);
    const fnStart = themeOption.indexOf('function loadThemeFromFile(');
    expect(fnStart).toBeGreaterThan(0);
    expect(matches[0].index).toBeGreaterThan(fnStart);
  });
});
