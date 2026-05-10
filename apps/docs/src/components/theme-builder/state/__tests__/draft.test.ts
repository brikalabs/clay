import { describe, expect, test } from 'bun:test';
import type { ThemeConfig } from '@brika/clay/themes';
import {
  type ThemeIdentity,
  draftFromThemeConfig,
  setDraftValue,
  themeConfigFromDraft,
} from '../draft';

const IDENTITY: ThemeIdentity = {
  id: '__custom__',
  name: 'Custom',
  description: 'User-authored theme.',
  accentSwatches: ['#a', '#b', '#c', '#d'],
};

const FIXTURE: ThemeConfig = {
  id: '__custom__',
  name: 'Custom',
  description: 'User-authored theme.',
  accentSwatches: ['#a', '#b', '#c', '#d'],
  colors: {
    light: {
      primary: '#9b6b48',
      'card-foreground': '#2a241c',
    },
    dark: {
      primary: '#d9b18d',
    },
  },
  geometry: {
    radius: '0.5rem',
    fontSans: '"Inter", sans-serif',
  },
  borders: {
    width: '1px',
  },
  motion: {
    duration: '200ms',
  },
  focus: {
    width: '2px',
  },
  components: {
    button: { radius: '0.25rem' },
    'data-table': { gap: '0.125rem' },
  },
};

describe('themeConfigFromDraft / draftFromThemeConfig', () => {
  test('round-trips a populated theme', () => {
    const draft = draftFromThemeConfig(FIXTURE);
    const rebuilt = themeConfigFromDraft(draft, IDENTITY);
    const draft2 = draftFromThemeConfig(rebuilt);
    expect([...draft2.entries()].sort()).toEqual([...draft.entries()].sort());
  });

  test('produces minimal JSON for an empty draft', () => {
    const out = themeConfigFromDraft(new Map(), IDENTITY);
    expect(out).toEqual({
      id: '__custom__',
      name: 'Custom',
      description: 'User-authored theme.',
      accentSwatches: ['#a', '#b', '#c', '#d'],
    });
  });

  test('one set value produces exactly that override', () => {
    const draft = setDraftValue(new Map(), 'colors.light.primary', '#abc');
    const out = themeConfigFromDraft(draft, IDENTITY);
    expect(out.colors).toEqual({ light: { primary: '#abc' } });
    expect(out.geometry).toBeUndefined();
    expect(out.components).toBeUndefined();
  });

  test('component overrides nest correctly', () => {
    const draft = setDraftValue(new Map(), 'components.button.radius', '0.5rem');
    const out = themeConfigFromDraft(draft, IDENTITY);
    expect(out.components).toEqual({ button: { radius: '0.5rem' } });
  });

  test('drops empty subtrees', () => {
    const draft = new Map<string, string>();
    const out = themeConfigFromDraft(draft, IDENTITY);
    expect(out).not.toHaveProperty('colors');
    expect(out).not.toHaveProperty('borders');
  });

  test('draftFromThemeConfig walks colors.light + colors.dark', () => {
    const draft = draftFromThemeConfig(FIXTURE);
    expect(draft.get('colors.light.primary')).toBe('#9b6b48');
    expect(draft.get('colors.dark.primary')).toBe('#d9b18d');
    expect(draft.get('colors.light.card-foreground')).toBe('#2a241c');
  });

  test('draftFromThemeConfig walks all sections', () => {
    const draft = draftFromThemeConfig(FIXTURE);
    expect(draft.get('geometry.radius')).toBe('0.5rem');
    expect(draft.get('borders.width')).toBe('1px');
    expect(draft.get('motion.duration')).toBe('200ms');
    expect(draft.get('focus.width')).toBe('2px');
    expect(draft.get('components.button.radius')).toBe('0.25rem');
    expect(draft.get('components.data-table.gap')).toBe('0.125rem');
  });
});
