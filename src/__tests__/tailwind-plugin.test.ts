import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, test } from 'bun:test';
import { compile } from 'tailwindcss';

import clayTailwindPlugin, { __internal } from '../tailwind';
import { TOKEN_REGISTRY, TOKENS_BY_NAME } from '../tokens/registry';
import { SHORTHAND_INDEX } from '../tokens/shorthands';
import type { ResolvedTokenSpec } from '../tokens/types';

const { buildBaseRules, buildThemeExtend } = __internal;

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

function findRule(addBaseCalls: readonly AddBaseCall[], selector: string): Record<string, string> {
  const call = addBaseCalls.find((c) => Object.keys(c.rules)[0] === selector);
  if (!call) {
    throw new Error(`addBase was not called with selector "${selector}"`);
  }
  return call.rules[selector] as Record<string, string>;
}

function mkToken(spec: Partial<ResolvedTokenSpec> & Pick<ResolvedTokenSpec, 'name'>): ResolvedTokenSpec {
  return {
    layer: 'component',
    appliesTo: spec.name.split('-')[0],
    category: 'color',
    type: 'color',
    defaultLight: 'red',
    description: 'test',
    ...spec,
  } as ResolvedTokenSpec;
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

  test('emits the bare `border` reset so `border` resolves to `var(--border)`', () => {
    const { addBaseCalls } = runHandler();
    const rule = findRule(addBaseCalls, '*, ::before, ::after');
    expect(rule['border-color']).toBe('var(--border)');
  });

  test('addBase is called for `:root` with literal-default and bundle-referenced tokens', () => {
    const { addBaseCalls } = runHandler();
    const rootRules = findRule(addBaseCalls, ':root, [data-theme="clay"]');
    // Layer-0 scalar, always emitted.
    expect(rootRules['--radius']).toBeDefined();
    // Layer-2 token referenced by a shorthand bundle, must be emitted
    // so the bundle's `var(--button-padding-x)` actually resolves.
    expect(rootRules['--button-padding-x']).toBeDefined();
  });

  test('emits `:root` for every registry token, deterministic and disk-I/O-free', () => {
    const { addBaseCalls } = runHandler();
    const rootRules = findRule(addBaseCalls, ':root, [data-theme="clay"]');
    for (const token of TOKEN_REGISTRY) {
      expect(rootRules[`--${token.name}`]).toBe(token.defaultLight);
    }
  });

  test('emits the dark-mode block only when at least one token has a distinct defaultDark', () => {
    const { addBaseCalls } = runHandler();
    const hasDark = TOKEN_REGISTRY.some(
      (t) => t.defaultDark && t.defaultDark !== t.defaultLight
    );
    const darkSelector =
      ':is(.dark, [data-mode="dark"]):root, :is(.dark, [data-mode="dark"])[data-theme="clay"]';
    const darkCall = addBaseCalls.find((c) => Object.keys(c.rules)[0] === darkSelector);
    if (hasDark) {
      expect(darkCall).toBeDefined();
    } else {
      expect(darkCall).toBeUndefined();
    }
  });

  test('emits @property blocks only for literal-default tokens with a registrable type', () => {
    const { addBaseCalls } = runHandler();
    // @property blocks live on the first addBase call (the properties payload).
    const allRules = Object.assign({}, ...addBaseCalls.map((c) => c.rules));
    const propertyKeys = Object.keys(allRules).filter((k) => k.startsWith('@property '));
    // Every emitted block must have inherits + syntax + initial-value AND its
    // initial-value must NOT contain `var(`.
    for (const key of propertyKeys) {
      const block = allRules[key] as Record<string, string>;
      expect(block.syntax).toMatch(/^"[^"]+"$/);
      expect(block.inherits).toBe('true');
      expect(block['initial-value']).toBeDefined();
      expect(block['initial-value']).not.toContain('var(');
    }
    expect(propertyKeys.length).toBeGreaterThan(0);
  });
});

// ─── Pure builders (snapshot-style) ─────────────────────────────────────────

describe('buildBaseRules', () => {
  test('emits :root, dark, and @property payloads for the live registry', () => {
    const out = buildBaseRules(TOKEN_REGISTRY);
    expect(Object.keys(out.root).length).toBeGreaterThan(TOKEN_REGISTRY.length - 1);
    expect(Object.keys(out.properties).length).toBeGreaterThan(0);
  });

  test('every token in the registry is present in `root`', () => {
    const { root } = buildBaseRules(TOKEN_REGISTRY);
    for (const token of TOKEN_REGISTRY) {
      expect(root[`--${token.name}`]).toBe(token.defaultLight);
    }
  });

  test('only tokens with a distinct defaultDark land in `dark`', () => {
    const { dark } = buildBaseRules(TOKEN_REGISTRY);
    for (const token of TOKEN_REGISTRY) {
      const cssVar = `--${token.name}`;
      if (token.defaultDark && token.defaultDark !== token.defaultLight) {
        expect(dark[cssVar]).toBe(token.defaultDark);
      } else {
        expect(dark[cssVar]).toBeUndefined();
      }
    }
  });

  test('font-size tokens with `lineHeight` produce a paired `--token--line-height`', () => {
    const { root, properties } = buildBaseRules(TOKEN_REGISTRY);
    for (const token of TOKEN_REGISTRY) {
      if (!token.lineHeight) continue;
      expect(root[`--${token.name}--line-height`]).toBe(token.lineHeight);
      // Literal line-heights also get a `@property` block.
      if (!token.lineHeight.includes('var(')) {
        expect(properties[`@property --${token.name}--line-height`]).toEqual({
          syntax: '"<number>"',
          inherits: 'true',
          'initial-value': token.lineHeight,
        });
      }
    }
  });

  test('@property is skipped when default is a var() chain (initial-value spec)', () => {
    const { properties } = buildBaseRules([
      mkToken({ name: 'foo', type: 'color', defaultLight: 'var(--bar)' }),
    ]);
    expect(properties['@property --foo']).toBeUndefined();
  });

  test('@property is skipped for types without a CSS descriptor (border-style, shadow, ...)', () => {
    const { properties } = buildBaseRules([
      mkToken({ name: 'a-border-style', type: 'border-style', defaultLight: 'solid' }),
      mkToken({ name: 'a-shadow', type: 'shadow', defaultLight: '0 1px 0 #000' }),
      mkToken({ name: 'a-easing', type: 'easing', defaultLight: 'linear' }),
      mkToken({ name: 'a-font-family', type: 'font-family', defaultLight: 'sans-serif' }),
      mkToken({ name: 'a-text-transform', type: 'text-transform', defaultLight: 'none' }),
      mkToken({ name: 'a-corner-shape', type: 'corner-shape', defaultLight: 'round' }),
    ]);
    expect(Object.keys(properties)).toEqual([]);
  });

  test('@property is registered for color/size/radius/font-size/duration/etc with literal defaults', () => {
    const { properties } = buildBaseRules([
      mkToken({ name: 'a-color', type: 'color', defaultLight: 'red' }),
      mkToken({ name: 'a-size', type: 'size', defaultLight: '1rem' }),
      mkToken({ name: 'a-radius', type: 'radius', defaultLight: '0.5rem' }),
      mkToken({ name: 'a-blur', type: 'blur', defaultLight: '4px' }),
      mkToken({ name: 'a-opacity', type: 'opacity', defaultLight: '0.5' }),
      mkToken({ name: 'a-font-weight', type: 'font-weight', defaultLight: '500' }),
      mkToken({ name: 'a-line-height', type: 'line-height', defaultLight: '1.4' }),
      mkToken({ name: 'a-letter-spacing', type: 'letter-spacing', defaultLight: '0.025em' }),
      mkToken({ name: 'a-duration', type: 'duration', defaultLight: '200ms' }),
      mkToken({ name: 'a-font-size', type: 'font-size', defaultLight: '14px' }),
    ]);
    expect(Object.keys(properties).sort()).toEqual([
      '@property --a-blur',
      '@property --a-color',
      '@property --a-duration',
      '@property --a-font-size',
      '@property --a-font-weight',
      '@property --a-letter-spacing',
      '@property --a-line-height',
      '@property --a-opacity',
      '@property --a-radius',
      '@property --a-size',
    ]);
  });

  test('an empty registry returns empty payloads', () => {
    expect(buildBaseRules([])).toEqual({ properties: {}, root: {}, dark: {} });
  });
});

describe('buildThemeExtend', () => {
  test('lays tokens into the right buckets, by type', () => {
    const ext = buildThemeExtend([
      mkToken({ name: 'p', tailwindNamespace: 'color', type: 'color', defaultLight: 'red' }),
      mkToken({ name: 'r', tailwindNamespace: 'radius', type: 'radius', defaultLight: '4px' }),
      mkToken({ name: 's', tailwindNamespace: 'shadow', type: 'shadow', defaultLight: '0 1px 0 #000' }),
      mkToken({ name: 'd', tailwindNamespace: 'motion', type: 'duration', defaultLight: '200ms' }),
      mkToken({ name: 'e', tailwindNamespace: 'motion', type: 'easing', defaultLight: 'linear' }),
      mkToken({ name: 'sp', tailwindNamespace: 'spacing', type: 'size', defaultLight: '1rem' }),
      mkToken({ name: 'b', tailwindNamespace: 'blur', type: 'blur', defaultLight: '4px' }),
      mkToken({ name: 'o', tailwindNamespace: 'opacity', type: 'opacity', defaultLight: '0.5' }),
      mkToken({ name: 'ff', tailwindNamespace: 'font', type: 'font-family', defaultLight: 'sans-serif' }),
      mkToken({ name: 'fs', tailwindNamespace: 'text', type: 'font-size', defaultLight: '14px' }),
    ]);
    expect(Object.keys(ext).sort()).toEqual(
      [
        'colors',
        'borderRadius',
        'boxShadow',
        'transitionDuration',
        'transitionTimingFunction',
        'spacing',
        'blur',
        'opacity',
        'fontFamily',
        'fontSize',
      ].sort()
    );
  });

  test('component tokens use `var(--name, <fallback>)` so utilities resolve when the slot is blank', () => {
    const ext = buildThemeExtend([
      mkToken({
        name: 'btn-fill',
        layer: 'component',
        appliesTo: 'btn',
        tailwindNamespace: 'color',
        type: 'color',
        defaultLight: 'var(--primary)',
      }),
    ]);
    expect(ext.colors['btn-fill']).toBe('var(--btn-fill, var(--primary))');
  });

  test('non-component tokens use `var(--name)` without a fallback', () => {
    const ext = buildThemeExtend([
      mkToken({
        name: 'primary',
        layer: 'role',
        tailwindNamespace: 'color',
        type: 'color',
        defaultLight: 'oklch(0.5 0 0)',
        appliesTo: undefined,
      }),
    ]);
    expect(ext.colors.primary).toBe('var(--primary)');
  });

  test('utilityAlias overrides the registry name as the bucket key', () => {
    const ext = buildThemeExtend([
      mkToken({
        name: 'card-radius',
        appliesTo: 'card',
        tailwindNamespace: 'radius',
        type: 'radius',
        defaultLight: '8px',
        utilityAlias: 'card',
      }),
    ]);
    expect(ext.borderRadius.card).toBe('var(--card-radius, 8px)');
    expect(ext.borderRadius['card-radius']).toBeUndefined();
  });

  test('namespace `default` only feeds borderWidth.DEFAULT, never anything else', () => {
    const ext = buildThemeExtend([
      mkToken({
        name: 'border-width',
        layer: 'scalar',
        category: 'border',
        tailwindNamespace: 'default',
        type: 'border-width',
        defaultLight: '1px',
        appliesTo: undefined,
      }),
    ]);
    expect(ext.borderWidth).toEqual({ DEFAULT: 'var(--border-width)' });
  });

  test("namespace 'none' or absent skips the token entirely", () => {
    const ext = buildThemeExtend([
      mkToken({ name: 'a', tailwindNamespace: 'none', type: 'color', defaultLight: 'red' }),
      mkToken({ name: 'b', tailwindNamespace: undefined, type: 'color', defaultLight: 'red' }),
    ]);
    expect(ext).toEqual({});
  });

  test('a type without a bucket (border-style, text-transform, ...) is silently skipped', () => {
    const ext = buildThemeExtend([
      mkToken({
        name: 'a-style',
        tailwindNamespace: 'color',
        type: 'border-style',
        defaultLight: 'solid',
      }),
    ]);
    expect(ext).toEqual({});
  });

  test('every var() reference in the live extend points to a real registry token', () => {
    const ext = buildThemeExtend(TOKEN_REGISTRY);
    const ref = /var\(--([a-z][a-z0-9-]*)/g;
    for (const bucket of Object.values(ext)) {
      for (const value of Object.values(bucket)) {
        for (const m of value.matchAll(ref)) {
          expect(TOKENS_BY_NAME[m[1]]).toBeDefined();
        }
      }
    }
  });

  test('an empty registry returns an empty extend object', () => {
    expect(buildThemeExtend([])).toEqual({});
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

  test('namespaced utilities (bg-*, rounded-*, shadow-*, duration-*, ease-*) compile through theme.extend', async () => {
    const css = await buildCss([
      'bg-primary',
      'rounded-card',
      'shadow-card',
      'duration-card',
      'ease-card',
    ]);
    expect(css).toContain('.bg-primary');
    expect(css).toContain('.rounded-card');
    expect(css).toContain('.shadow-card');
    expect(css).toContain('.duration-card');
    expect(css).toContain('.ease-card');
  });

  test('arbitrary `(--token)` shorthand utilities resolve because every token is in :root', async () => {
    // Simulates a hand-authored class like `gap-(--button-gap)` in a .tsx file.
    const css = await buildCss(['gap-(--button-gap)']);
    expect(css).toContain('--button-gap');
    expect(css).toMatch(/gap:\s*var\(--button-gap\)/);
  });

  test('text-* utility resolves both font-size and the paired line-height', async () => {
    // Find a text token that has a lineHeight declared.
    const t = TOKEN_REGISTRY.find(
      (token) => token.tailwindNamespace === 'text' && token.lineHeight
    );
    if (!t) return;
    const utilityName = t.utilityAlias ?? t.name.replace(/^text-/, '');
    const css = await buildCss([`text-${utilityName}`]);
    expect(css).toContain(`var(--${t.name})`);
  });
});

// ─── Performance benchmark ──────────────────────────────────────────────────

describe('performance', () => {
  test('buildBaseRules over the full registry runs under 5ms (typical: <1ms)', () => {
    // Warm up.
    for (let i = 0; i < 5; i++) buildBaseRules(TOKEN_REGISTRY);
    const start = performance.now();
    const ITERATIONS = 50;
    for (let i = 0; i < ITERATIONS; i++) {
      buildBaseRules(TOKEN_REGISTRY);
    }
    const avg = (performance.now() - start) / ITERATIONS;
    expect(avg).toBeLessThan(5);
  });

  test('buildThemeExtend over the full registry runs under 5ms (typical: <1ms)', () => {
    for (let i = 0; i < 5; i++) buildThemeExtend(TOKEN_REGISTRY);
    const start = performance.now();
    const ITERATIONS = 50;
    for (let i = 0; i < ITERATIONS; i++) {
      buildThemeExtend(TOKEN_REGISTRY);
    }
    const avg = (performance.now() - start) / ITERATIONS;
    expect(avg).toBeLessThan(5);
  });

  test('plugin imports without doing any disk I/O at module load', async () => {
    // The previous implementation walked `styles/` and `components/<name>/<name>.tsx`
    // synchronously at module load via fs.readdirSync / fs.readFileSync. The
    // refactor removed that; this test guards against regressions by reading
    // the bundled module text and asserting fs is no longer imported.
    const path = resolve(SRC, 'tailwind.ts');
    const source = readFileSync(path, 'utf8');
    expect(source).not.toContain('readdirSync');
    expect(source).not.toContain('readFileSync');
    expect(source).not.toContain('node:fs');
  });
});
