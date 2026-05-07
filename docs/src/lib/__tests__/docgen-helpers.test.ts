import { describe, expect, test } from 'bun:test';
import { isHookName, isInternalProp, slugFromPath, slugToPascalCase } from '../docgen-helpers';

describe('slugFromPath', () => {
  test('extracts slug from a unix component path', () => {
    expect(
      slugFromPath('/repo/src/components/dropdown-menu/dropdown-menu.tsx')
    ).toBe('dropdown-menu');
  });

  test('extracts slug from a windows-style path', () => {
    expect(
      slugFromPath(String.raw`C:\repo\src\components\dropdown-menu\dropdown-menu.tsx`)
    ).toBe('dropdown-menu');
  });

  test('returns null when the path is not under components/', () => {
    expect(slugFromPath('/repo/src/lib/foo.tsx')).toBeNull();
  });

  test('returns null when the file is not .tsx', () => {
    expect(slugFromPath('/repo/src/components/button/button.ts')).toBeNull();
  });

  test('handles single-letter slugs', () => {
    expect(slugFromPath('/repo/src/components/x/x.tsx')).toBe('x');
  });
});

describe('slugToPascalCase', () => {
  test('converts a kebab-case slug to PascalCase', () => {
    expect(slugToPascalCase('dropdown-menu')).toBe('DropdownMenu');
  });

  test('handles single-word slugs', () => {
    expect(slugToPascalCase('button')).toBe('Button');
  });

  test('handles multi-segment slugs', () => {
    expect(slugToPascalCase('alert-dialog-content')).toBe('AlertDialogContent');
  });

  test('returns empty string for empty input', () => {
    expect(slugToPascalCase('')).toBe('');
  });
});

describe('isHookName', () => {
  test('matches camelCase hooks', () => {
    expect(isHookName('useState')).toBe(true);
    expect(isHookName('useDeferredValue')).toBe(true);
  });

  test('rejects names that just start with "use"', () => {
    expect(isHookName('user')).toBe(false);
    expect(isHookName('use')).toBe(false);
    expect(isHookName('useless')).toBe(false);
  });

  test('rejects PascalCase component names', () => {
    expect(isHookName('Button')).toBe(false);
    expect(isHookName('UseProvider')).toBe(false);
  });
});

describe('isInternalProp', () => {
  test('matches Radix-injected scope props', () => {
    expect(isInternalProp('__scopeDialog')).toBe(true);
    expect(isInternalProp('__scope')).toBe(true);
  });

  test('rejects normal props', () => {
    expect(isInternalProp('asChild')).toBe(false);
    expect(isInternalProp('children')).toBe(false);
  });

  test('rejects single-underscore prefixes', () => {
    expect(isInternalProp('_private')).toBe(false);
  });
});
