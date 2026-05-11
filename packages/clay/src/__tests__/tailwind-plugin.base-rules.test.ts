/**
 * Coverage for `buildBaseRules` (a thin slice over the fused
 * `buildContributions` walk). Pins the `:root` / dark / @property
 * payloads against the live registry and a battery of synthetic
 * mkToken fixtures.
 */

import { describe, expect, test } from 'bun:test';

import { TOKEN_REGISTRY } from '../tokens/registry';
import { SHORTHAND_INDEX } from '../tokens/shorthands';
import { buildBaseRules, mkToken } from './tailwind-plugin.fixtures';

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

  test('literal lineHeight emits a paired `@property --token--line-height` block', () => {
    // None of the in-registry tokens carry a literal lineHeight (they all
    // use `calc(var(...))`), so the @property branch is exercised here
    // with a synthetic token.
    const { properties } = buildBaseRules([
      mkToken({
        name: 'text-lit',
        type: 'font-size',
        defaultLight: '1rem',
        lineHeight: '1.5',
      }),
    ]);
    expect(properties['@property --text-lit--line-height']).toEqual({
      syntax: '"<number>"',
      inherits: 'true',
      'initial-value': '1.5',
    });
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
