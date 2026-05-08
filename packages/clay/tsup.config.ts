import { copyFileSync, cpSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig } from 'tsup';

const SRC = 'src';
const DIST = 'dist';
const REPO_ROOT = resolve(__dirname, '..', '..');

export default defineConfig({
  // Globs preserve the source layout in dist (e.g.
  // `src/components/button/index.ts` -> `dist/components/button/index.js`),
  // matching what `tsc --emitDeclarationOnly` produces for the .d.ts files.
  // If JS and DTS layouts diverged the package.json `exports` map wouldn't
  // be able to resolve types: TS sees `button.js`, infers types at
  // `button.d.ts`, doesn't find them, and skips the `index.d.ts` fallback.
  entry: [
    'src/index.ts',
    'src/tailwind.ts',
    'src/themes/{index,registry}.ts',
    'src/tokens/index.ts',
    'src/primitives/*.ts',
    'src/components/*/index.ts',
    '!src/**/_*',
    '!src/**/__tests__/**',
  ],
  format: 'esm',
  target: 'es2022',
  // DTS is emitted by `tsc -p tsconfig.build.json --emitDeclarationOnly`
  // (see package.json `build` script), which scales better than tsup's
  // worker for many-entry libraries.
  dts: false,
  sourcemap: true,
  clean: true,
  esbuildOptions(options) {
    // `'use client'` stamped on every chunk via esbuild's banner
    // (tsup's top-level `banner` only reaches entry chunks, not the
    // shared chunks emitted under `splitting`). If server-only entries
    // appear later, split into two `defineConfig` calls.
    options.banner = { js: "'use client';" };
    options.legalComments = 'none';
  },
  onSuccess: async () => {
    // Hand-authored CSS, the Tailwind plugin's `readFileSync` walk over
    // `dist/styles/` finds files at the same relative paths they had
    // under `src/`.
    cpSync(join(SRC, 'styles'), join(DIST, 'styles'), { recursive: true });
    // Theme preset JSON next to the bundled `themes.js` so the
    // `with { type: 'json' }` static imports keep resolving for any
    // consumer that prefers the source path. Json only, the co-located
    // `index.ts` is already inlined into themes.js.
    const presetsSrc = join(SRC, 'themes', 'presets');
    const presetsDst = join(DIST, 'themes', 'presets');
    mkdirSync(presetsDst, { recursive: true });
    for (const file of readdirSync(presetsSrc)) {
      if (file.endsWith('.json')) {
        copyFileSync(join(presetsSrc, file), join(presetsDst, file));
      }
    }
    // Brand SVGs are repo-level marketing artifacts (root `/assets/`).
    cpSync(join(REPO_ROOT, 'assets'), join(DIST, 'assets'), { recursive: true });
  },
});
