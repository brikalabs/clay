/**
 * Unit tests for `toStateRole`, the helper that maps a `StateEntry`
 * tuple to its full `TokenSpec`. The registry coverage already pins
 * the 5 single-word state names (hover / focus / pressed / selected /
 * disabled), so this file targets the multi-word camelCase branch
 * (`state-soft-press-opacity` → `state.softPressOpacity`) that the
 * dotted registry never exercises today.
 */

import { describe, expect, test } from 'bun:test';

import { toStateRole } from '../roles/state';

describe('toStateRole', () => {
  test('single-word state names map to flat themePath and trimmed alias', () => {
    const spec = toStateRole(['state-hover-opacity', '0.08', 'Hover.']);
    expect(spec.name).toBe('state-hover-opacity');
    expect(spec.layer).toBe('role');
    expect(spec.category).toBe('state');
    expect(spec.defaultLight).toBe('0.08');
    expect(spec.themePath).toBe('state.hoverOpacity');
    expect(spec.utilityAlias).toBe('state-hover');
    expect(spec.tailwindNamespace).toBe('opacity');
  });

  test('multi-word state names camelCase the inner hyphens', () => {
    // Exercises the `replaceAll(/-([a-z])/g, ...)` arrow callback that
    // the in-tree 5 single-word entries never reach.
    const spec = toStateRole([
      'state-soft-press-opacity',
      '0.04',
      'Subtle press hint for compact controls.',
    ]);
    expect(spec.themePath).toBe('state.softPressOpacity');
    expect(spec.utilityAlias).toBe('state-soft-press');
  });
});
