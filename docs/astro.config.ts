import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import clayPackageJson from '../package.json' with { type: 'json' };
import { clayDocgenPlugin } from './src/lib/vite-plugin-clay-docgen.ts';

const here = dirname(fileURLToPath(import.meta.url));

function loadDotenv(filename: string): void {
  const path = resolve(here, filename);
  if (!existsSync(path)) {
    return;
  }
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match) {
      continue;
    }
    const [, key, raw] = match;
    if (process.env[key] !== undefined) {
      continue;
    }
    process.env[key] = raw.replaceAll(/^['"]|['"]$/g, '');
  }
}

loadDotenv('.env.local');
loadDotenv('.env');

const SITE = process.env.SITE;

function safeGit(args: string): string {
  try {
    return execSync(`git ${args}`, { cwd: here, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

const buildCommit = safeGit('rev-parse --short HEAD') || 'dev';
const buildDate = safeGit('log -1 --format=%cI') || new Date().toISOString();

const isDev = process.argv.includes('dev');

if (!SITE) {
  throw new Error('SITE env var is required (set in .env or your deploy environment)');
}

// Resolve all @brika/clay/* imports directly to source.
// bun installs the file:.. workspace dep respecting the `files` field
// (dist only), so node_modules/@brika/clay has no src/ or package.json.
// Vite aliases run in all environments (client + SSR) and bypass the
// broken package resolution entirely.
const claySrc = resolve(here, '../src');

function listComponentFolders(): readonly string[] {
  const componentsRoot = resolve(claySrc, 'components');
  return readdirSync(componentsRoot).filter((name) => {
    if (name.startsWith('_') || name.startsWith('.')) {
      return false;
    }
    const indexPath = resolve(componentsRoot, name, 'index.ts');
    return statSync(resolve(componentsRoot, name)).isDirectory() && existsSync(indexPath);
  });
}

// Mirrors the `exports` map in the root package.json. Order matters —
// more specific rules first. Each entry is either a string (matches an
// exact id, OR an id followed by `/` and the tail appends to
// `replacement`) or a RegExp. Subpath exports that point to a single
// file (`./styles` → `clay.css`) need RegExp because the same prefix
// also has a separate sub-tree mapping.
const claySubpathRegex = (subpath: string): RegExp =>
  new RegExp(`^@brika/clay/${subpath}/`);

const clayAliases = [
  { find: '@brika/clay/themes/registry', replacement: resolve(claySrc, 'themes/registry.ts') },
  { find: '@brika/clay/themes', replacement: resolve(claySrc, 'themes/index.ts') },
  { find: '@brika/clay/tokens', replacement: resolve(claySrc, 'tokens/index.ts') },
  { find: '@brika/clay/tailwind', replacement: resolve(claySrc, 'tailwind.ts') },
  // Per-component aliases — every folder under src/components. Strings,
  // because `@brika/clay/components/<name>` is consumed exactly (no tail).
  ...listComponentFolders().map((name) => ({
    find: `@brika/clay/components/${name}`,
    replacement: resolve(claySrc, `components/${name}/index.ts`),
  })),
  // Subpath sub-trees (regex strips the prefix; the rest of the id
  // appends to `replacement`). These MUST come before their bare
  // counterparts so e.g. `@brika/clay/styles/foo` hits the regex, not
  // the bare `@brika/clay/styles` rule below.
  { find: claySubpathRegex('assets'), replacement: `${resolve(claySrc, 'assets')}/` },
  { find: claySubpathRegex('primitives'), replacement: `${resolve(claySrc, 'primitives')}/` },
  { find: claySubpathRegex('styles'), replacement: `${resolve(claySrc, 'styles')}/` },
  // Bare subpath exports — the package's `./<x>` export points to a
  // specific file, not to a directory.
  { find: '@brika/clay/primitives', replacement: resolve(claySrc, 'primitives/index.ts') },
  { find: '@brika/clay/styles', replacement: resolve(claySrc, 'styles/clay.css') },
  // Catch-all root export.
  { find: '@brika/clay', replacement: resolve(claySrc, 'index.ts') },
];

export default defineConfig({
  site: SITE,
  integrations: [mdx(), react()],
  markdown: {
    shikiConfig: {
      themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' },
      defaultColor: false,
    },
  },
  vite: {
    resolve: {
      alias: clayAliases,
      // Force a single React copy so React hooks across docs <-> clay
      // share the same module instance during dev (otherwise component
      // hot-updates dispatch from a different React than the one the
      // docs app is rendering with, and HMR throws "invalid hook call").
      dedupe: ['react', 'react-dom'],
    },
    server: {
      fs: {
        // Clay source lives ONE LEVEL ABOVE the docs project. Vite's
        // default `fs.allow` is the docs root only, so reads of the
        // aliased `../src/**` files fail without this. Allow the whole
        // workspace root.
        allow: [resolve(here, '..')],
      },
    },
    optimizeDeps: {
      // The aliases route `@brika/clay*` to source files in `../src/`.
      // If Vite pre-bundled `@brika/clay` from `node_modules` it would
      // shadow the aliased source and HMR would never fire on edits.
      // Excluding stops the pre-bundle for both the bare specifier and
      // every subpath we serve.
      exclude: ['@brika/clay'],
    },
    define: {
      __CLAY_VERSION__: JSON.stringify(clayPackageJson.version),
      __BUILD_COMMIT__: JSON.stringify(buildCommit),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    plugins: [clayDocgenPlugin({ dev: isDev }), tailwindcss()],
  },
});
