/**
 * Coverage for `buildThemeExtend`, the helper that lays tokens into
 * Tailwind v4 `theme.extend` buckets (`colors`, `spacing`, `boxShadow`,
 * …) keyed by tailwindNamespace + type.
 */

import { describe, expect, test } from 'bun:test';

import { TOKEN_REGISTRY, TOKENS_BY_NAME } from '../tokens/registry';
import { buildThemeExtend, mkToken } from './tailwind-plugin.fixtures';

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
