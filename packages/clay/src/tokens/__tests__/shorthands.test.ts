import { describe, expect, test } from 'bun:test';

import { cn } from '../../primitives/cn';
import { TOKEN_REGISTRY, TOKENS_BY_NAME } from '../registry';
import { buildShorthandIndex, SHORTHAND_INDEX } from '../shorthands';
import type { ResolvedTokenSpec } from '../types';

const { rules: SHORTHANDS, tokenRefs: TOKEN_REFS } = SHORTHAND_INDEX;

const ALLOWED_PROPERTIES = new Set([
  'height',
  'padding-inline',
  'padding-block',
  'gap',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'text-transform',
  'transition-duration',
  'transition-timing-function',
  'border-width',
  'border-style',
  'backdrop-filter',
]);

describe('buildShorthandIndex — registry walker', () => {
  test('emits a single .button rule with every per-component property', () => {
    const rule = SHORTHANDS['button'];
    expect(rule).toBeDefined();
    expect(rule['height']).toBe('var(--button-height)');
    expect(rule['padding-inline']).toBe('var(--button-padding-x)');
    expect(rule['padding-block']).toBe('var(--button-padding-y)');
    expect(rule['gap']).toBe('var(--button-gap)');
    expect(rule['transition-duration']).toBe('var(--button-duration)');
    expect(rule['transition-timing-function']).toBe('var(--button-easing)');
    expect(rule['border-width']).toBe('var(--button-border-width)');
    expect(rule['border-style']).toBe('var(--button-border-style)');
    expect(rule['font-weight']).toBe('var(--button-font-weight)');
  });

  test('wraps backdrop-blur with blur() and a 0px fallback', () => {
    const rule = SHORTHANDS['card'];
    expect(rule).toBeDefined();
    expect(rule['backdrop-filter']).toBe('blur(var(--card-backdrop-blur, 0px))');
  });

  test('returns plain class names without a leading dot', () => {
    for (const className of Object.keys(SHORTHANDS)) {
      expect(className.startsWith('.')).toBe(false);
    }
  });

  test('does not emit the old per-family classes', () => {
    for (const family of ['geom', 'typo', 'motion', 'border'] as const) {
      expect(SHORTHANDS[`button-${family}`]).toBeUndefined();
      expect(SHORTHANDS[`badge-${family}`]).toBeUndefined();
    }
  });

  test('skips components with no bundled tokens', () => {
    expect(SHORTHANDS['aspect-ratio']).toBeUndefined();
  });

  test('every emitted property is in the allowed set', () => {
    for (const declarations of Object.values(SHORTHANDS)) {
      for (const property of Object.keys(declarations)) {
        expect(ALLOWED_PROPERTIES.has(property)).toBe(true);
      }
    }
  });

  test('every var() reference points to a real registry token', () => {
    const varRef = /var\(--([a-z][a-z0-9-]*)/;
    for (const declarations of Object.values(SHORTHANDS)) {
      for (const value of Object.values(declarations)) {
        const match = varRef.exec(value);
        expect(match).not.toBeNull();
        if (match) {
          expect(TOKENS_BY_NAME[match[1]]).toBeDefined();
        }
      }
    }
  });

  test('a synthetic registry produces the documented shape', () => {
    const synthetic: readonly ResolvedTokenSpec[] = [
      mkToken('demo', 'demo-height', 'size', 'geometry'),
      mkToken('demo', 'demo-padding-x', 'size', 'geometry'),
      mkToken('demo', 'demo-padding-y', 'size', 'geometry'),
      mkToken('demo', 'demo-gap', 'size', 'geometry'),
      mkToken('demo', 'demo-duration', 'duration', 'motion'),
      mkToken('demo', 'demo-easing', 'easing', 'motion'),
      mkToken('demo', 'demo-border-width', 'border-width', 'border'),
      mkToken('demo', 'demo-border-style', 'border-style', 'border'),
      mkToken('demo', 'demo-font-weight', 'font-weight', 'typography'),
      mkToken('demo', 'demo-backdrop-blur', 'blur', 'elevation'),
      // Slot tokens with no recognized suffix — must NOT appear.
      mkToken('demo', 'demo-filled-container', 'color', 'color'),
      mkToken('demo', 'demo-radius', 'radius', 'geometry'),
      mkToken('demo', 'demo-shadow', 'shadow', 'elevation'),
    ];
    const { rules } = buildShorthandIndex(synthetic);

    expect(rules['demo']).toEqual({
      height: 'var(--demo-height)',
      'padding-inline': 'var(--demo-padding-x)',
      'padding-block': 'var(--demo-padding-y)',
      gap: 'var(--demo-gap)',
      'transition-duration': 'var(--demo-duration)',
      'transition-timing-function': 'var(--demo-easing)',
      'border-width': 'var(--demo-border-width)',
      'border-style': 'var(--demo-border-style)',
      'font-weight': 'var(--demo-font-weight)',
      'backdrop-filter': 'blur(var(--demo-backdrop-blur, 0px))',
    });
  });

  test('keys off appliesTo, not a name-prefix heuristic', () => {
    const synthetic: readonly ResolvedTokenSpec[] = [
      mkToken('a', 'a-height', 'size', 'geometry'),
      mkToken('a-b', 'a-b-height', 'size', 'geometry'),
    ];
    const { rules } = buildShorthandIndex(synthetic);
    expect(rules['a']).toEqual({ height: 'var(--a-height)' });
    expect(rules['a-b']).toEqual({ height: 'var(--a-b-height)' });
  });
});

describe('SHORTHAND_INDEX.tokenRefs — :root coverage', () => {
  test('every referenced token is a real registry token', () => {
    expect(TOKEN_REFS.size).toBeGreaterThan(0);
    for (const name of TOKEN_REFS) {
      expect(TOKENS_BY_NAME[name]).toBeDefined();
    }
  });

  test('contains the button geometry/motion/border tokens it bundles', () => {
    for (const name of [
      'button-height',
      'button-padding-x',
      'button-padding-y',
      'button-gap',
      'button-duration',
      'button-easing',
      'button-border-width',
      'button-border-style',
    ]) {
      expect(TOKEN_REFS.has(name)).toBe(true);
    }
  });

  test('does NOT contain slot tokens that are not part of any bundle', () => {
    expect(TOKEN_REFS.has('button-filled-container')).toBe(false);
    expect(TOKEN_REFS.has('button-radius')).toBe(false);
    expect(TOKEN_REFS.has('button-shadow')).toBe(false);
  });

  test('shares its set with the precomputed index used by the plugin', () => {
    const fresh = buildShorthandIndex(TOKEN_REGISTRY);
    const cmp = (a: string, b: string) => a.localeCompare(b);
    expect(Array.from(fresh.tokenRefs).sort(cmp)).toEqual(Array.from(TOKEN_REFS).sort(cmp));
    expect(Object.keys(fresh.rules).sort(cmp)).toEqual(Object.keys(SHORTHANDS).sort(cmp));
  });
});

describe('cn() / twMerge interaction — shorthand survives, overrides win', () => {
  test.each([
    ['button', 'h-10'],
    ['button', 'duration-300'],
    ['button', 'text-sm'],
    ['button', 'border-2'],
    ['card', 'backdrop-blur-md'],
  ])('keeps %s alongside %s — different layers, both survive', (shorthand, util) => {
    expect(cn(shorthand, util).split(' ')).toEqual([shorthand, util]);
  });

  test('deduplicates a repeated shorthand (twMerge group, last-wins)', () => {
    expect(cn('button', 'button')).toBe('button');
  });

  test('different component shorthands never collide', () => {
    expect(cn('button', 'badge').split(' ')).toEqual(['button', 'badge']);
  });

  test('caller className wins for conflicting Tailwind utilities', () => {
    const tokens = cn('button h-10 px-6', 'h-12 px-2').split(' ');
    expect(tokens).toContain('button');
    expect(tokens).toContain('h-12');
    expect(tokens).toContain('px-2');
    expect(tokens).not.toContain('h-10');
    expect(tokens).not.toContain('px-6');
  });
});

function mkToken(
  appliesTo: string,
  name: string,
  type: ResolvedTokenSpec['type'],
  category: ResolvedTokenSpec['category']
): ResolvedTokenSpec {
  return {
    name,
    appliesTo,
    layer: 'component',
    category,
    type,
    defaultLight: 'unset',
    description: '',
  };
}
