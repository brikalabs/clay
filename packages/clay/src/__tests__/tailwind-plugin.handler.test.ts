/**
 * Coverage for the public `clayTailwindPlugin` handler. Mocks the
 * Tailwind plugin API and asserts on the calls the handler makes
 * (matchUtilities passes, addBase payloads, dark-mode selector, etc.).
 *
 * Companion files cover the pure builders (`buildBaseRules`,
 * `buildThemeExtend`, `buildRootMembership`), the var-scanner, the
 * end-to-end Tailwind v4 compile path, and the performance guard.
 */

import { describe, expect, test } from 'bun:test';

import { TOKEN_REGISTRY } from '../tokens/registry';
import { SHORTHAND_INDEX } from '../tokens/shorthands';
import { findRule, maybeFindRule, runHandler } from './tailwind-plugin.fixtures';

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
