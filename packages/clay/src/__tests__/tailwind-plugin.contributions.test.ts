/**
 * Coverage for `buildContributions` (the fused single-pass walk that
 * produces every shard of the plugin's output) and the membership
 * helper that decides which Layer-2 tokens land in `:root`.
 */

import { describe, expect, test } from 'bun:test';

import { TOKEN_REGISTRY } from '../tokens/registry';
import { SHORTHAND_INDEX } from '../tokens/shorthands';
import {
  buildContributions,
  buildRootMembership,
  findRule,
  mkToken,
  runHandler,
} from './tailwind-plugin.fixtures';

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
