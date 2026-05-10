import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, test } from 'bun:test';
import { compile } from 'tailwindcss';

import clayTailwindPlugin, {
  __internal,
  type ClayTailwindOptions,
} from '../tailwind';
import * as PRESETS from '../themes/presets';
import { flattenTheme } from '../themes/flatten';
import type { ThemeConfig } from '../themes/types';
import { TOKEN_REGISTRY, TOKENS_BY_NAME } from '../tokens/registry';
import { SHORTHAND_INDEX } from '../tokens/shorthands';
import type { ResolvedTokenSpec } from '../tokens/types';

const { buildContributions, scanVarRefs } = __internal;

// Convenience slices over the fused builder for tests that only care about
// one shard of the contribution shape.
function buildBaseRules(
  registry: readonly ResolvedTokenSpec[],
  shorthandRefs: ReadonlySet<string> = new Set()
) {
  return buildContributions(registry, shorthandRefs).base;
}

function buildThemeExtend(registry: readonly ResolvedTokenSpec[]) {
  return buildContributions(registry).themeExtend;
}

function buildRootMembership(
  registry: readonly ResolvedTokenSpec[],
  shorthandRefs: ReadonlySet<string> = new Set()
) {
  return buildContributions(registry, shorthandRefs).rootMembership;
}

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

function runHandler(options: ClayTailwindOptions = {}): {
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
  // `plugin.withOptions` returns an options-function: call it with the
  // options object to get back the `{ handler, config }` pair.
  const { handler } = (clayTailwindPlugin as unknown as (
    options: ClayTailwindOptions
  ) => { handler: (api: unknown) => void })(options);
  handler(api);
  return { matchUtilitiesCalls, addBaseCalls };
}

/**
 * Plugin merges every `addBase` payload into a single call now; the merged
 * rule object is the union, this helper looks the selector up across calls.
 */
function findRule(addBaseCalls: readonly AddBaseCall[], selector: string): Record<string, string> {
  for (const call of addBaseCalls) {
    if (selector in call.rules) {
      return call.rules[selector] as Record<string, string>;
    }
  }
  throw new Error(`addBase was not called with selector "${selector}"`);
}

function maybeFindRule(
  addBaseCalls: readonly AddBaseCall[],
  selector: string
): Record<string, string> | undefined {
  for (const call of addBaseCalls) {
    if (selector in call.rules) {
      return call.rules[selector] as Record<string, string>;
    }
  }
  return undefined;
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

  test('the first matchUtilities batch is the shorthand bundle, with DEFAULT-only values', () => {
    const { matchUtilitiesCalls } = runHandler();
    // Shape of the calls: [shorthand-bundle, ...per-namespace token utilities].
    // The shorthand bundle is the only DEFAULT-only batch; the rest pass a
    // per-namespace `values` map so JIT can match `border-w-card`, ...
    expect(matchUtilitiesCalls.length).toBeGreaterThanOrEqual(1);
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

  test('per-namespace token utilities (`border-w`, `leading`, ...) are JIT-aware via per-namespace `values` maps', () => {
    const { matchUtilitiesCalls } = runHandler();
    // Skip the first call (shorthand bundle, DEFAULT-only); the rest are the
    // per-namespace token utilities and each carries a non-empty `values` map.
    const tokenBatches = matchUtilitiesCalls.slice(1);
    expect(tokenBatches.length).toBeGreaterThan(0);
    for (const call of tokenBatches) {
      const utilityKeys = Object.keys(call.utilities);
      expect(utilityKeys).toHaveLength(1);
      const values = call.options?.values ?? {};
      expect(Object.keys(values).length).toBeGreaterThan(0);
      // Sanity-check: every value is a `var(--...)` reference (token-driven).
      for (const v of Object.values(values)) {
        expect(v).toMatch(/^var\(--/);
      }
      // And the utility function pipes the value into a single CSS declaration.
      const fn = call.utilities[utilityKeys[0]];
      const out = fn('var(--placeholder)') as Record<string, string>;
      expect(Object.keys(out)).toHaveLength(1);
      expect(Object.values(out)[0]).toBe('var(--placeholder)');
    }
  });

  test('component-layer tokens emit `var(--name, <fallback>)` for matchUtility values so blank slots still resolve', () => {
    const { matchUtilitiesCalls } = runHandler();
    const tokenBatches = matchUtilitiesCalls.slice(1);
    // Find the `border-w-` batch and look for the `card` entry, --card-border-width
    // is a Layer-2 token with a literal default, so its value must be the
    // `var(--card-border-width, <default>)` shape.
    const borderW = tokenBatches.find((c) => 'border-w' in c.utilities);
    expect(borderW).toBeDefined();
    if (borderW) {
      const cardValue = borderW.options?.values?.card;
      expect(cardValue).toBeDefined();
      expect(cardValue).toMatch(/^var\(--card-border-width, /);
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

  test('emits `:root` for every Layer-0/1 token AND every shorthand-bundle Layer-2 token', () => {
    const { addBaseCalls } = runHandler();
    const rootRules = findRule(addBaseCalls, ':root, [data-theme="clay"]');
    for (const token of TOKEN_REGISTRY) {
      // Scalars + roles always land in :root, they're concrete cascade roots.
      if (token.layer !== 'component') {
        expect(rootRules[`--${token.name}`]).toBe(token.defaultLight);
        continue;
      }
      // Component tokens with literal defaults always emit.
      if (!token.defaultLight.startsWith('var(')) {
        expect(rootRules[`--${token.name}`]).toBe(token.defaultLight);
      }
      // Component tokens consumed by a shorthand bundle must emit so the
      // bundle's `var(--button-padding-x)` actually resolves.
      if (SHORTHAND_INDEX.tokenRefs.has(token.name)) {
        expect(rootRules[`--${token.name}`]).toBe(token.defaultLight);
      }
      // Tokens flagged `consumedByCss` must always emit.
      if (token.consumedByCss) {
        expect(rootRules[`--${token.name}`]).toBe(token.defaultLight);
      }
    }
  });

  test('skips var-chain Layer-2 tokens that are reachable only through namespaced utility fallbacks', () => {
    const { addBaseCalls } = runHandler();
    const rootRules = findRule(addBaseCalls, ':root, [data-theme="clay"]');
    // Build the same membership set the plugin uses; tokens NOT in this set
    // and NOT cascade-referenced should be absent from `:root`.
    const referencedByCascade = new Set<string>();
    const ref = /var\(--([a-z][a-z0-9-]*)/g;
    for (const t of TOKEN_REGISTRY) {
      for (const v of [t.defaultLight, t.defaultDark]) {
        if (!v) continue;
        for (const m of v.matchAll(ref)) referencedByCascade.add(m[1]);
      }
    }
    let skipped = 0;
    for (const t of TOKEN_REGISTRY) {
      if (
        t.layer === 'component' &&
        t.defaultLight.startsWith('var(') &&
        !SHORTHAND_INDEX.tokenRefs.has(t.name) &&
        !referencedByCascade.has(t.name) &&
        !t.consumedByCss
      ) {
        expect(rootRules[`--${t.name}`]).toBeUndefined();
        skipped++;
      }
    }
    // We expect a non-trivial chunk to be filtered, this guards against a
    // future refactor that accidentally re-enables full emission.
    expect(skipped).toBeGreaterThan(20);
  });

  test('emits the dark-mode block only when at least one token has a distinct defaultDark', () => {
    const { addBaseCalls } = runHandler();
    const hasDark = TOKEN_REGISTRY.some(
      (t) => t.defaultDark && t.defaultDark !== t.defaultLight
    );
    const darkSelector =
      ':where(.dark, [data-mode="dark"]):root, :where(.dark, [data-mode="dark"])[data-theme="clay"]';
    const darkRule = maybeFindRule(addBaseCalls, darkSelector);
    if (hasDark) {
      expect(darkRule).toBeDefined();
    } else {
      expect(darkRule).toBeUndefined();
    }
  });

  test('uses zero-specificity `:where()` for the dark selector so consumers can override cleanly', () => {
    const { addBaseCalls } = runHandler();
    const darkRule = addBaseCalls
      .flatMap((c) => Object.keys(c.rules))
      .find((sel) => sel.includes('data-mode="dark"'));
    expect(darkRule).toBeDefined();
    if (darkRule) {
      expect(darkRule).toContain(':where(');
      expect(darkRule).not.toContain(':is(.dark');
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

// ─── Theme option (build-time bake) ─────────────────────────────────────────

describe('clayTailwindPlugin theme option', () => {
  const BAKED_ROOT = ':root';
  const BAKED_DARK = ':is(.dark, [data-mode="dark"]):root';

  test('default invocation emits no extra `:root` or runtime-style dark block', () => {
    const { addBaseCalls } = runHandler();
    expect(maybeFindRule(addBaseCalls, BAKED_ROOT)).toBeUndefined();
    expect(maybeFindRule(addBaseCalls, BAKED_DARK)).toBeUndefined();
  });

  test('preset name layers `flattenTheme(preset)` deltas onto :root after the registry defaults', () => {
    const { addBaseCalls } = runHandler({ theme: 'ocean' });
    const expected = flattenTheme(PRESETS.ocean as ThemeConfig);
    if (Object.keys(expected.rootVars).length === 0) {
      // Defensive guard, ocean always contributes overrides today.
      throw new Error('expected ocean to contribute root-var overrides');
    }
    const baked = findRule(addBaseCalls, BAKED_ROOT);
    for (const [k, v] of Object.entries(expected.rootVars)) {
      expect(baked[k]).toBe(v);
    }
    // Cascade order check: the registry-defaults block must precede the
    // baked overrides in the merged addBase payload so the override wins.
    const merged = Object.assign({}, ...addBaseCalls.map((c) => c.rules));
    const keys = Object.keys(merged);
    const registryIdx = keys.indexOf(':root, [data-theme="clay"]');
    const bakedIdx = keys.indexOf(BAKED_ROOT);
    expect(registryIdx).toBeGreaterThanOrEqual(0);
    expect(bakedIdx).toBeGreaterThan(registryIdx);
  });

  test('preset name with dark deltas emits the runtime-shaped dark selector', () => {
    const { addBaseCalls } = runHandler({ theme: 'ocean' });
    const expected = flattenTheme(PRESETS.ocean as ThemeConfig);
    if (Object.keys(expected.darkVars).length === 0) {
      // Theme has no dark deltas, plugin must NOT emit an empty block.
      expect(maybeFindRule(addBaseCalls, BAKED_DARK)).toBeUndefined();
      return;
    }
    const baked = findRule(addBaseCalls, BAKED_DARK);
    for (const [k, v] of Object.entries(expected.darkVars)) {
      expect(baked[k]).toBe(v);
    }
  });

  test('ThemeConfig object is accepted directly (JS-config flow)', () => {
    const inline: ThemeConfig = {
      name: 'inline-test',
      colors: { light: { primary: 'rebeccapurple' } },
    };
    const { addBaseCalls } = runHandler({ theme: inline });
    const baked = findRule(addBaseCalls, BAKED_ROOT);
    expect(baked['--primary']).toBe('rebeccapurple');
    // flatten emits the `--color-*` alias too, so both forms must land.
    expect(baked['--color-primary']).toBe('rebeccapurple');
  });

  test('JSON file path is loaded and parsed at build time', async () => {
    const { mkdtempSync, writeFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const { tmpdir } = await import('node:os');
    const dir = mkdtempSync(join(tmpdir(), 'clay-theme-'));
    const file = join(dir, 'my-theme.json');
    const config: ThemeConfig = {
      name: 'file-test',
      colors: { light: { primary: 'tomato' } },
    };
    writeFileSync(file, JSON.stringify(config), 'utf8');
    const { addBaseCalls } = runHandler({ theme: file });
    const baked = findRule(addBaseCalls, BAKED_ROOT);
    expect(baked['--primary']).toBe('tomato');
  });

  test('unknown preset name throws a list of valid names', () => {
    expect(() => runHandler({ theme: 'nope-not-a-preset' })).toThrow(/Known presets/);
  });

  test('unreadable JSON path throws a clear error mentioning the resolved path', () => {
    expect(() => runHandler({ theme: './does-not-exist.json' })).toThrow(
      /failed to read theme file/
    );
  });

  test('does not interfere with the matchUtilities passes (utility coverage unchanged)', () => {
    const baseline = runHandler();
    const themed = runHandler({ theme: 'ocean' });
    expect(themed.matchUtilitiesCalls.length).toBe(baseline.matchUtilitiesCalls.length);
  });
});

// ─── Pure builders (snapshot-style) ─────────────────────────────────────────

describe('buildBaseRules', () => {
  test('emits :root, dark, and @property payloads for the live registry', () => {
    const out = buildBaseRules(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs);
    // We filter out unreferenced var-chain Layer-2 tokens, so :root is
    // smaller than the full registry but still non-trivial.
    expect(Object.keys(out.root).length).toBeGreaterThan(0);
    expect(Object.keys(out.root).length).toBeLessThanOrEqual(TOKEN_REGISTRY.length + 32);
    expect(Object.keys(out.properties).length).toBeGreaterThan(0);
  });

  test('every Layer-0/1 + literal-default Layer-2 token is present in `root`', () => {
    const { root } = buildBaseRules(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs);
    for (const token of TOKEN_REGISTRY) {
      if (token.layer !== 'component' || !token.defaultLight.startsWith('var(')) {
        expect(root[`--${token.name}`]).toBe(token.defaultLight);
      }
    }
  });

  test('only tokens with a distinct defaultDark land in `dark`', () => {
    const { dark } = buildBaseRules(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs);
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
    const { root, properties } = buildBaseRules(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs);
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

  test('var-chain Layer-2 tokens are filtered from :root unless referenced', () => {
    const { root } = buildBaseRules(
      [
        mkToken({ name: 'unused-var', layer: 'component', appliesTo: 'unused', defaultLight: 'var(--primary)' }),
        mkToken({ name: 'unused-lit', layer: 'component', appliesTo: 'unused', defaultLight: 'red' }),
      ],
      new Set()
    );
    expect(root['--unused-lit']).toBe('red');
    expect(root['--unused-var']).toBeUndefined();
  });

  test('var-chain Layer-2 tokens land in :root when in the shorthand bundle', () => {
    const { root } = buildBaseRules(
      [mkToken({ name: 'btn-gap', layer: 'component', appliesTo: 'btn', defaultLight: 'var(--spacing)' })],
      new Set(['btn-gap'])
    );
    expect(root['--btn-gap']).toBe('var(--spacing)');
  });

  test('var-chain Layer-2 tokens land in :root when `consumedByCss` is set', () => {
    const { root } = buildBaseRules(
      [
        mkToken({
          name: 'tint',
          layer: 'component',
          appliesTo: 'a',
          defaultLight: 'var(--background)',
          consumedByCss: true,
        }),
      ],
      new Set()
    );
    expect(root['--tint']).toBe('var(--background)');
  });

  test('var-chain Layer-2 tokens land in :root when referenced by another spec default', () => {
    const { root } = buildBaseRules(
      [
        mkToken({ name: 'leaf', layer: 'component', appliesTo: 'a', defaultLight: 'var(--primary)' }),
        mkToken({ name: 'parent', layer: 'component', appliesTo: 'a', defaultLight: 'var(--leaf)' }),
      ],
      new Set()
    );
    expect(root['--leaf']).toBe('var(--primary)');
    expect(root['--parent']).toBeUndefined();
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
    expect(buildBaseRules([], new Set())).toEqual({ properties: {}, root: {}, dark: {} });
  });
});

describe('scanVarRefs (fast var(--name) scanner)', () => {
  function collect(value: string): string[] {
    const out: string[] = [];
    scanVarRefs(value, (n) => out.push(n));
    return out;
  }

  test('finds a single reference', () => {
    expect(collect('var(--primary)')).toEqual(['primary']);
  });

  test('finds multiple references in one expression', () => {
    expect(collect('color-mix(in oklch, var(--a) 50%, var(--b))')).toEqual(['a', 'b']);
  });

  test('finds nested references', () => {
    expect(collect('var(--a, var(--b))')).toEqual(['a', 'b']);
  });

  test('returns nothing for a literal value', () => {
    expect(collect('1px')).toEqual([]);
    expect(collect('oklch(0.5 0 0)')).toEqual([]);
  });

  test('returns nothing for an empty string', () => {
    expect(collect('')).toEqual([]);
  });

  test('handles names with digits and dashes', () => {
    expect(collect('var(--data-1) var(--brand-500)')).toEqual(['data-1', 'brand-500']);
  });

  test('does not match `var()` without the leading `--`', () => {
    expect(collect('var()')).toEqual([]);
    expect(collect('var(--)')).toEqual([]);
  });

  test('stops the name at the first non-name byte (`)`, `,`, ` `)', () => {
    expect(collect('var(--name)')).toEqual(['name']);
    expect(collect('var(--name, fallback)')).toEqual(['name']);
    expect(collect('var(--a) var(--b)')).toEqual(['a', 'b']);
  });

  test('matches the regex baseline across the live registry', () => {
    const REF = /var\(--([a-z][a-z0-9-]*)/g;
    for (const token of TOKEN_REGISTRY) {
      for (const value of [token.defaultLight, token.defaultDark]) {
        if (!value) continue;
        const regex = [...value.matchAll(REF)].map((m) => m[1]);
        const scanner = collect(value);
        expect(scanner).toEqual(regex);
      }
    }
  });
});

describe('buildContributions (fused single-pass walk)', () => {
  test('an empty registry returns empty payloads on every shard', () => {
    const out = buildContributions([], new Set());
    expect(out.base).toEqual({ properties: {}, root: {}, dark: {} });
    expect(out.themeExtend).toEqual({});
    expect([...out.rootMembership]).toEqual([]);
  });

  test('plugin module reads the same payloads the handler emits', () => {
    // Cross-check: the live plugin handler must emit exactly what
    // `buildContributions(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs)` returns.
    const expected = buildContributions(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs);
    const { addBaseCalls } = runHandler();
    const root = findRule(addBaseCalls, ':root, [data-theme="clay"]');
    expect(root).toEqual(expected.base.root);
  });
});

describe('buildRootMembership', () => {
  test('Layer-0 / Layer-1 tokens are unconditionally members', () => {
    const set = buildRootMembership(
      [
        mkToken({ name: 'r0', layer: 'scalar', appliesTo: undefined, defaultLight: 'var(--anything)' }),
        mkToken({ name: 'r1', layer: 'role', appliesTo: undefined, defaultLight: 'var(--anything)' }),
      ],
      new Set()
    );
    expect(set.has('r0')).toBe(true);
    expect(set.has('r1')).toBe(true);
  });

  test('a token referenced from another spec landing pulls the leaf into membership', () => {
    const set = buildRootMembership(
      [
        mkToken({ name: 'leaf', layer: 'component', appliesTo: 'a', defaultLight: 'var(--primary)' }),
        mkToken({ name: 'parent', layer: 'component', appliesTo: 'a', defaultLight: 'var(--leaf)' }),
      ],
      new Set()
    );
    expect(set.has('leaf')).toBe(true);
  });

  test('cascade scan picks up dark-mode references too', () => {
    const set = buildRootMembership(
      [
        mkToken({ name: 'leaf', layer: 'component', appliesTo: 'a', defaultLight: 'var(--primary)' }),
        mkToken({
          name: 'parent',
          layer: 'component',
          appliesTo: 'a',
          defaultLight: '#fff',
          defaultDark: 'var(--leaf)',
        }),
      ],
      new Set()
    );
    expect(set.has('leaf')).toBe(true);
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
// Tailwind lives at the workspace root in a hoisted node_modules layout.
// HERE = packages/clay/src/__tests__, so jump up four to reach the root.
const TAILWIND_DIR = resolve(HERE, '../../../../node_modules/tailwindcss');

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

  test('arbitrary `(--token)` shorthand utilities resolve because shorthand-bundle tokens land in :root', async () => {
    // Simulates a hand-authored class like `gap-(--button-gap)` in a .tsx file.
    const css = await buildCss(['gap-(--button-gap)']);
    expect(css).toContain('--button-gap');
    expect(css).toMatch(/gap:\s*var\(--button-gap\)/);
  });

  test('color-mix expressions over `consumedByCss` tokens resolve at the use site', async () => {
    // Models alert.tsx, where `var(--alert-tint-base)` appears inside a
    // `color-mix(...)` expression with no fallback. The token must live in
    // :root (which the `consumedByCss: true` flag forces) for the mix to
    // produce a valid color.
    const css = await buildCss([]);
    expect(css).toContain('--alert-tint-base');
  });

  test(':root block stays under 25 KB; filtering trims var-chain Layer-2 leaves', async () => {
    // Regression guard: if the filter accidentally regresses to "emit every
    // token", the :root payload jumps by ~3.5 KB. Capping at 25 KB leaves a
    // small buffer for new scalars/roles without rewarding token sprawl.
    const css = await buildCss([]);
    const rootBlock = css.match(/:root[^{]*\{[^}]*\}/);
    if (!rootBlock) {
      throw new Error('compiled CSS missing a :root block');
    }
    expect(rootBlock[0].length).toBeLessThan(25 * 1024);
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
    const path = resolve(SRC, 'tailwind.ts');
    const source = readFileSync(path, 'utf8');
    // Directory walks are forbidden entirely.
    expect(source).not.toContain('readdirSync');
    // `readFileSync` is allowed exactly once, inside `loadThemeFromFile`.
    const matches = [...source.matchAll(/readFileSync\(/g)];
    expect(matches).toHaveLength(1);
    const fnStart = source.indexOf('function loadThemeFromFile(');
    expect(fnStart).toBeGreaterThan(0);
    expect(matches[0].index).toBeGreaterThan(fnStart);
  });
});
