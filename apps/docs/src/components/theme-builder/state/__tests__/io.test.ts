import { describe, expect, test } from 'bun:test';
import { parseThemeJson } from '../io';

const VALID = {
  id: 'demo',
  name: 'Demo',
  description: 'Test theme.',
  accentSwatches: ['#000'],
  colors: { light: { primary: '#abc' } },
  geometry: { radius: '0.5rem' },
};

describe('parseThemeJson', () => {
  test('accepts a complete theme JSON', () => {
    const result = parseThemeJson(JSON.stringify(VALID));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.theme.id).toBe('demo');
      expect(result.theme.colors?.light?.primary).toBe('#abc');
    }
  });

  test('rejects malformed JSON', () => {
    const result = parseThemeJson('not json');
    expect(result.ok).toBe(false);
  });

  test('rejects missing required fields', () => {
    const result = parseThemeJson(JSON.stringify({ id: 'x' }));
    expect(result.ok).toBe(false);
  });

  test('rejects non-string accentSwatches entries', () => {
    const result = parseThemeJson(
      JSON.stringify({
        id: 'x',
        name: 'X',
        description: 'X',
        accentSwatches: ['#a', 1],
      })
    );
    expect(result.ok).toBe(false);
  });

  test('rejects non-string color values', () => {
    const result = parseThemeJson(
      JSON.stringify({
        id: 'x',
        name: 'X',
        description: 'X',
        accentSwatches: ['#a'],
        colors: { light: { primary: 42 } },
      })
    );
    expect(result.ok).toBe(false);
  });

  test('strips unknown root keys', () => {
    const result = parseThemeJson(
      JSON.stringify({
        ...VALID,
        unknownRoot: 'leak',
      })
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.theme).not.toHaveProperty('unknownRoot');
    }
  });

  test('accepts a theme with no optional sections', () => {
    const result = parseThemeJson(
      JSON.stringify({
        id: 'minimal',
        name: 'Minimal',
        description: 'Just identity.',
        accentSwatches: ['#000'],
      })
    );
    expect(result.ok).toBe(true);
  });
});
