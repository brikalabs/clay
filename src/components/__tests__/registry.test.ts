import { describe, expect, test } from 'bun:test';
import { defineDemos } from '../_registry';

function ExampleDemo() {
  return null;
}

function AnotherDemo() {
  return null;
}

describe('defineDemos', () => {
  test('returns one DemoInput per tuple, carrying the function reference verbatim', () => {
    const result = defineDemos([
      [ExampleDemo, 'Default'],
      [AnotherDemo, 'Variant', { description: 'with extras' }],
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ fn: ExampleDemo, title: 'Default', description: undefined });
    expect(result[1]).toEqual({ fn: AnotherDemo, title: 'Variant', description: 'with extras' });
  });

  test('returns an empty array for an empty input', () => {
    expect(defineDemos([])).toEqual([]);
  });

  test('preserves identity of the function reference (not its name)', () => {
    // The whole point of carrying `fn` instead of `fn.name` is that the docs
    // registry reverse-looks-up the export name from the module namespace,
    // bundler-mangled `fn.name` would have broken that lookup.
    const [entry] = defineDemos([[ExampleDemo, 'Default']]);
    expect(entry?.fn).toBe(ExampleDemo);
  });

  test('treats a missing extras object as no description', () => {
    const [entry] = defineDemos([[ExampleDemo, 'Default']]);
    expect(entry?.description).toBeUndefined();
  });
});
