import { describe, expect, test } from 'bun:test';
import { TOKENS_BY_NAME } from '@brika/clay/tokens';
import { BASIC_GROUPS } from '../tiers';

describe('BASIC_GROUPS', () => {
  test('every basic-group token resolves in the registry', () => {
    for (const group of BASIC_GROUPS) {
      for (const token of group.tokens) {
        expect(TOKENS_BY_NAME[token.name]).toBe(token);
      }
    }
  });

  test('each group has at least one token', () => {
    for (const group of BASIC_GROUPS) {
      expect(group.tokens.length).toBeGreaterThan(0);
    }
  });
});
