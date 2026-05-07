import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, test } from 'bun:test';
import { compile } from 'tailwindcss';

import clayTailwindPlugin from '../tailwind';
import { SHORTHAND_INDEX } from '../tokens/shorthands';

// ─── Mock plugin context ─────────────────────────────────────────────────────

interface MatchUtilitiesCall {
  readonly utilities: Record<
    string,
    (value: string, modifier?: { modifier: string | null }) => unknown
  >;
  readonly options?: {
    readonly values?: Readonly<Record<string, string>>;
  };
}

interface AddBaseCall {
  readonly rules: Readonly<Record<string, unknown>>;
}

function runHandler(): {
  readonly matchUtilitiesCalls: readonly MatchUtilitiesCall[];
  readonly addBaseCalls: readonly AddBaseCall[];
} {
  const matchUtilitiesCalls: MatchUtilitiesCall[] = [];
  const addBaseCalls: AddBaseCall[] = [];
  // The mock blows up if the plugin reaches for a non-JIT-aware API,
  // that's the whole point: addUtilities/addComponents emit
  // unconditionally in v4, and we MUST avoid them for shorthand rules.
  const api: unknown = {
    addBase(rules: Record<string, unknown>) {
      addBaseCalls.push({ rules });
    },
    matchUtilities(
      utilities: MatchUtilitiesCall['utilities'],
      options?: MatchUtilitiesCall['options']
    ) {
      matchUtilitiesCalls.push({ utilities, options });
    },
    addUtilities() {
      throw new Error(
        'addUtilities() is not JIT-aware in Tailwind v4, the plugin must use matchUtilities() instead.'
      );
    },
    addComponents() {
      throw new Error(
        'addComponents() is not JIT-aware in Tailwind v4, the plugin must use matchUtilities() instead.'
      );
    },
  };
  (clayTailwindPlugin as { handler: (api: unknown) => void }).handler(api);
  return { matchUtilitiesCalls, addBaseCalls };
}

// ─── Plugin handler, direct invocation ──────────────────────────────────────

describe('clayTailwindPlugin handler', () => {
  test('uses matchUtilities (JIT-aware), never addUtilities or addComponents', () => {
    expect(() => runHandler()).not.toThrow();
  });

  test('registers exactly one matchUtilities batch with DEFAULT-only values', () => {
    const { matchUtilitiesCalls } = runHandler();
    expect(matchUtilitiesCalls).toHaveLength(1);
    expect(matchUtilitiesCalls[0].options).toEqual({ values: { DEFAULT: '' } });
  });

  test('registers a utility for every entry in SHORTHAND_INDEX.rules', () => {
    const { matchUtilitiesCalls } = runHandler();
    const cmp = (a: string, b: string) => a.localeCompare(b);
    const registered = Object.keys(matchUtilitiesCalls[0].utilities).toSorted(cmp);
    const expected = Object.keys(SHORTHAND_INDEX.rules).toSorted(cmp);
    expect(registered).toEqual(expected);
  });

  test("each utility's function returns its registry-bundled declarations", () => {
    const { matchUtilitiesCalls } = runHandler();
    const utilities = matchUtilitiesCalls[0].utilities;
    for (const [name, fn] of Object.entries(utilities)) {
      expect(fn('')).toEqual(SHORTHAND_INDEX.rules[name]);
    }
  });

  test('addBase is called for `:root` with literal-default and bundle-referenced tokens', () => {
    const { addBaseCalls } = runHandler();
    const rootCall = addBaseCalls.find(
      (c) => Object.keys(c.rules)[0] === ':root, [data-theme="clay"]'
    );
    if (!rootCall) {
      throw new Error('plugin did not call addBase for :root');
    }
    const rootRules = rootCall.rules[':root, [data-theme="clay"]'] as Record<string, string>;
    // Layer-0 scalar, always emitted.
    expect(rootRules['--radius']).toBeDefined();
    // Layer-2 token referenced by a shorthand bundle, must be emitted
    // so the bundle's `var(--button-padding-x)` actually resolves.
    expect(rootRules['--button-padding-x']).toBeDefined();
  });
});

// ─── End-to-end Tailwind v4 compile, true JIT pruning ───────────────────────

const HERE = dirname(new URL(import.meta.url).pathname);
const SRC = resolve(HERE, '..');
const TAILWIND_DIR = resolve(SRC, '../node_modules/tailwindcss');

async function loadStylesheet(id: string, base: string) {
  if (id === 'tailwindcss') {
    const path = resolve(TAILWIND_DIR, 'index.css');
    return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
  }
  if (id.startsWith('tailwindcss/')) {
    const path = resolve(TAILWIND_DIR, `${id.slice('tailwindcss/'.length)}.css`);
    return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
  }
  if (id.startsWith('./') || id.startsWith('../')) {
    const path = resolve(base, id);
    return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
  }
  throw new Error(`unsupported @import in test: ${id}`);
}

async function buildCss(candidates: readonly string[]): Promise<string> {
  // Minimal input, pulls Tailwind core + our plugin, nothing else.
  const input = `
    @import "tailwindcss";
    @plugin "./tailwind";
  `;
  const compiled = await compile(input, {
    base: SRC,
    loadModule: async (id, base, type) => {
      if (type === 'plugin') {
        return { module: clayTailwindPlugin, base };
      }
      throw new Error(`unexpected loadModule call: ${id} (${type})`);
    },
    loadStylesheet,
  });
  return compiled.build(candidates as string[]);
}

describe('Tailwind v4 compile(), JIT pruning of shorthand utilities', () => {
  test('a candidate that names a registered shorthand emits its rule', async () => {
    const css = await buildCss(['button']);
    expect(css).toContain('.button {');
    expect(css).toContain('--button-padding-x');
  });

  test('a candidate NOT in the source omits every other shorthand', async () => {
    const css = await buildCss(['button']);
    expect(css).not.toContain('.badge {');
    expect(css).not.toContain('.card {');
    expect(css).not.toContain('.tooltip {');
    expect(css).not.toContain('.dialog {');
  });

  test('multiple candidates each emit their own rule', async () => {
    const css = await buildCss(['button', 'badge', 'card']);
    expect(css).toContain('.button {');
    expect(css).toContain('.badge {');
    expect(css).toContain('.card {');
    expect(css).not.toContain('.tooltip {');
  });

  test('no candidates → no shorthand rules emitted', async () => {
    const css = await buildCss([]);
    for (const name of Object.keys(SHORTHAND_INDEX.rules)) {
      expect(css).not.toContain(`.${name} {`);
    }
  });

  test('shorthand class survives next to a Tailwind utility on the same element', async () => {
    // Models `<button class="button h-10">`. Both must end up in CSS;
    // cascade order ensures `h-10` wins for height.
    const css = await buildCss(['button', 'h-10']);
    expect(css).toContain('.button {');
    expect(css).toContain('.h-10 {');
  });
});
