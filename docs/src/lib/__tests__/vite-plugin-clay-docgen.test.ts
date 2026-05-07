import { describe, expect, test } from 'bun:test';
import { slugFromPath, slugToPascalCase } from '../vite-plugin-clay-docgen';

describe('slugFromPath', () => {
  test('extracts slug from a unix component path', () => {
    expect(
      slugFromPath('/repo/src/components/dropdown-menu/dropdown-menu.tsx')
    ).toBe('dropdown-menu');
  });

  test('extracts slug from a windows-style path', () => {
    expect(
      slugFromPath('C:\\repo\\src\\components\\dropdown-menu\\dropdown-menu.tsx')
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
