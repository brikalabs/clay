/**
 * Unit tests for the token-type inferences.
 *
 * `inferTokenType` / `inferTokenTypeStrict` are exercised indirectly by
 * registry.test.ts (over every real token). This file targets the
 * **value-based** fallback `inferTokenTypeFromValue` directly so each
 * branch (length / color / border-style / duration / easing / opacity /
 * unknown) has a focused regression.
 */

import { describe, expect, test } from 'bun:test';

import {
  inferTokenType,
  inferTokenTypeFromValue,
  inferTokenTypeStrict,
} from '../infer';

describe('inferTokenTypeStrict', () => {
  test('exact rules win over suffix and prefix scans', () => {
    expect(inferTokenTypeStrict('radius')).toBe('radius');
    expect(inferTokenTypeStrict('spacing')).toBe('size');
    expect(inferTokenTypeStrict('motion-duration')).toBe('duration');
  });

  test('longest-suffix wins', () => {
    expect(inferTokenTypeStrict('button-border-width')).toBe('border-width');
    expect(inferTokenTypeStrict('button-shadow')).toBe('shadow');
  });

  test('prefix scan picks up role-level radius and shadow', () => {
    expect(inferTokenTypeStrict('radius-control')).toBe('radius');
    expect(inferTokenTypeStrict('shadow-overlay')).toBe('shadow');
  });

  test('returns null when nothing matches', () => {
    expect(inferTokenTypeStrict('foo-bar')).toBeNull();
  });
});

describe('inferTokenType', () => {
  test('falls back to "color" when no rule matches', () => {
    expect(inferTokenType('slider-fill')).toBe('color');
  });
});

describe('inferTokenTypeFromValue', () => {
  test('px values ≤ 4 are border-width', () => {
    expect(inferTokenTypeFromValue('1px')).toBe('border-width');
    expect(inferTokenTypeFromValue('4px')).toBe('border-width');
  });

  test('px values > 4 are size', () => {
    expect(inferTokenTypeFromValue('8px')).toBe('size');
    expect(inferTokenTypeFromValue('128px')).toBe('size');
  });

  test('other length units are size', () => {
    expect(inferTokenTypeFromValue('1.5rem')).toBe('size');
    expect(inferTokenTypeFromValue('100%')).toBe('size');
    expect(inferTokenTypeFromValue('50vh')).toBe('size');
  });

  test('color functions, hex, and named keywords are color', () => {
    expect(inferTokenTypeFromValue('oklch(0.7 0.1 250)')).toBe('color');
    expect(inferTokenTypeFromValue('rgb(255 0 0)')).toBe('color');
    expect(inferTokenTypeFromValue('#abc')).toBe('color');
    expect(inferTokenTypeFromValue('#abcdef')).toBe('color');
    expect(inferTokenTypeFromValue('transparent')).toBe('color');
    expect(inferTokenTypeFromValue('currentcolor')).toBe('color');
  });

  test('CSS border-style keywords are border-style', () => {
    expect(inferTokenTypeFromValue('solid')).toBe('border-style');
    expect(inferTokenTypeFromValue('dashed')).toBe('border-style');
    expect(inferTokenTypeFromValue('dotted')).toBe('border-style');
    expect(inferTokenTypeFromValue('none')).toBe('border-style');
  });

  test('time values are duration', () => {
    expect(inferTokenTypeFromValue('200ms')).toBe('duration');
    expect(inferTokenTypeFromValue('0.2s')).toBe('duration');
  });

  test('easing functions and keywords are easing', () => {
    expect(inferTokenTypeFromValue('cubic-bezier(0.4, 0, 0.2, 1)')).toBe('easing');
    expect(inferTokenTypeFromValue('linear')).toBe('easing');
    expect(inferTokenTypeFromValue('ease-in-out')).toBe('easing');
  });

  test('numerics in [0, 1] are opacity; out-of-range numerics return null', () => {
    expect(inferTokenTypeFromValue('0')).toBe('opacity');
    expect(inferTokenTypeFromValue('0.5')).toBe('opacity');
    expect(inferTokenTypeFromValue('1')).toBe('opacity');
    expect(inferTokenTypeFromValue('2')).toBeNull();
    expect(inferTokenTypeFromValue('17.5')).toBeNull();
  });

  test('unrecognized shapes return null', () => {
    expect(inferTokenTypeFromValue('whatever')).toBeNull();
    expect(inferTokenTypeFromValue('')).toBeNull();
  });

  test('values are trimmed before matching', () => {
    expect(inferTokenTypeFromValue('  solid  ')).toBe('border-style');
    expect(inferTokenTypeFromValue('  #abc  ')).toBe('color');
  });
});
