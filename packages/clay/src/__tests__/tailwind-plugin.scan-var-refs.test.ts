/**
 * Coverage for `scanVarRefs`, the fast `var(--name)` scanner the
 * plugin uses to detect cascade references (cheaper than `matchAll`).
 * Cross-validated against the regex baseline over the live registry.
 */

import { describe, expect, test } from 'bun:test';

import { TOKEN_REGISTRY } from '../tokens/registry';
import { scanVarRefs } from './tailwind-plugin.fixtures';

function collect(value: string): string[] {
  const out: string[] = [];
  scanVarRefs(value, (n) => out.push(n));
  return out;
}

describe('scanVarRefs (fast var(--name) scanner)', () => {
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
