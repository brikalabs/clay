/**
 * Coverage for `extractComponentDocs` + the type / JSDoc / cva
 * walkers it composes from (`types.ts`, `jsdoc.ts`, `cva.ts`). Each
 * test writes a synthetic `.tsx` fixture into a per-suite temp dir
 * and asserts on the parsed `AstComponentDoc[]`.
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { extractComponentDocs } from '../ast';

let tmpRoot: string;

beforeAll(() => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'clay-docgen-ast-'));
});

afterAll(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

let fixtureCounter = 0;
function writeFixture(source: string): string {
  fixtureCounter += 1;
  const path = join(tmpRoot, `fx-${fixtureCounter}.tsx`);
  writeFileSync(path, source, 'utf8');
  return path;
}

describe('extractComponentDocs', () => {
  test('reads function-declaration components and their props from an inline type literal', () => {
    const path = writeFixture(`
      /** Card surface. */
      export function Card(props: { title: string; subtitle?: string }) {
        return null;
      }
    `);
    const docs = extractComponentDocs(path);
    expect(docs).toHaveLength(1);
    expect(docs[0].displayName).toBe('Card');
    expect(docs[0].description).toBe('Card surface.');
    expect(docs[0].props.map((p) => p.name)).toEqual(['title', 'subtitle']);
    expect(docs[0].props[0].required).toBe(true);
    expect(docs[0].props[1].required).toBe(false);
  });

  test('reads var-declared arrow-function components', () => {
    const path = writeFixture(`
      /** Pill. */
      export const Pill = (props: { count: number }) => null;
    `);
    const docs = extractComponentDocs(path);
    expect(docs).toHaveLength(1);
    expect(docs[0].displayName).toBe('Pill');
    expect(docs[0].props[0].name).toBe('count');
    expect(docs[0].props[0].type).toBe('number');
  });

  test('expands props referenced via local interface', () => {
    const path = writeFixture(`
      interface ButtonProps { variant: 'a' | 'b'; disabled?: boolean }
      export function Button(props: ButtonProps) { return null; }
    `);
    const docs = extractComponentDocs(path);
    expect(docs[0].props.map((p) => p.name).sort((a, b) => a.localeCompare(b))).toEqual(['disabled', 'variant']);
  });

  test('expands props referenced via local type alias', () => {
    const path = writeFixture(`
      type Props = { label: string };
      export function Badge(p: Props) { return null; }
    `);
    const docs = extractComponentDocs(path);
    expect(docs[0].props[0].name).toBe('label');
  });

  test('merges props across intersection types (last-write wins on type)', () => {
    const path = writeFixture(`
      interface A { foo: string }
      interface B { bar: number }
      export function Combo(p: A & B) { return null; }
    `);
    const docs = extractComponentDocs(path);
    expect(docs[0].props.map((p) => p.name).sort((a, b) => a.localeCompare(b))).toEqual(['bar', 'foo']);
  });

  test('drills through transparent wrappers (Readonly, Partial)', () => {
    const path = writeFixture(`
      interface Inner { a: string; b: number }
      export function Wrapped(p: Readonly<Partial<Inner>>) { return null; }
    `);
    const docs = extractComponentDocs(path);
    expect(docs[0].props.map((p) => p.name).sort((a, b) => a.localeCompare(b))).toEqual(['a', 'b']);
  });

  test('expands VariantProps<typeof X>[key] into the literal union from the cva index', () => {
    const path = writeFixture(`
      import { cva, type VariantProps } from 'class-variance-authority';
      const buttonVariants = cva('base', {
        variants: {
          variant: { default: '', destructive: '', ghost: '' },
          size: { sm: '', md: '', lg: '' },
        },
      });
      interface BProps {
        variant: VariantProps<typeof buttonVariants>['variant'];
        size?: VariantProps<typeof buttonVariants>['size'];
      }
      export function Button(p: BProps) { return null; }
    `);
    const docs = extractComponentDocs(path);
    const variant = docs[0].props.find((p) => p.name === 'variant');
    const size = docs[0].props.find((p) => p.name === 'size');
    expect(variant?.type).toBe("'default' | 'destructive' | 'ghost'");
    expect(size?.type).toBe("'sm' | 'md' | 'lg'");
  });

  test('records default values from destructured parameter initializers', () => {
    const path = writeFixture(`
      export function Toggle({ asChild = false, label }: { asChild?: boolean; label: string }) {
        return null;
      }
    `);
    const docs = extractComponentDocs(path);
    const asChild = docs[0].props.find((p) => p.name === 'asChild');
    const label = docs[0].props.find((p) => p.name === 'label');
    expect(asChild?.defaultValue).toBe('false');
    expect(label?.defaultValue).toBeNull();
  });

  test('filters out hooks (useFoo) and internal props (__foo)', () => {
    const path = writeFixture(`
      export function useThing() { return 1; }
      export function Thing(p: { realProp: string; __scopeRadix?: unknown }) {
        return null;
      }
    `);
    const docs = extractComponentDocs(path);
    expect(docs.map((d) => d.displayName)).toEqual(['Thing']);
    expect(docs[0].props.map((p) => p.name)).toEqual(['realProp']);
  });

  test('drops the React-built-in `key`, `ref`, and `children` props from the table', () => {
    const path = writeFixture(`
      export function Item(p: { key?: string; ref?: unknown; children: unknown; label: string }) {
        return null;
      }
    `);
    const docs = extractComponentDocs(path);
    expect(docs[0].props.map((p) => p.name)).toEqual(['label']);
  });

  test('extracts JSDoc descriptions from PropertySignature comments', () => {
    const path = writeFixture(`
      export function Note(p: {
        /** Primary text. */
        title: string;
        /** Tone preset. */
        tone?: 'info' | 'warn';
      }) { return null; }
    `);
    const docs = extractComponentDocs(path);
    expect(docs[0].props.find((p) => p.name === 'title')?.description).toBe('Primary text.');
    expect(docs[0].props.find((p) => p.name === 'tone')?.description).toBe('Tone preset.');
  });

  test('reads forwardRef<Element, Props>(...) second type argument as the props bag', () => {
    const path = writeFixture(`
      import * as React from 'react';
      interface FProps { label: string }
      export const Fwd = React.forwardRef<HTMLDivElement, FProps>((p, ref) => null);
    `);
    const docs = extractComponentDocs(path);
    expect(docs[0].displayName).toBe('Fwd');
    expect(docs[0].props[0].name).toBe('label');
  });

  test('surfaces components from HOC wrappers like `withSlot(X, "name")` with no AST props', () => {
    const path = writeFixture(`
      function withSlot(C: unknown, name: string) { return C; }
      const Inner = () => null;
      export const Slotted = withSlot(Inner, 'badge-leading');
    `);
    const docs = extractComponentDocs(path);
    expect(docs.map((d) => d.displayName)).toContain('Slotted');
    const slotted = docs.find((d) => d.displayName === 'Slotted');
    expect(slotted?.props).toEqual([]);
  });

  test('sorts props: required first, then alphabetical within each group', () => {
    const path = writeFixture(`
      export function Sorted(p: { z?: string; a: number; m: boolean; b?: number }) {
        return null;
      }
    `);
    const docs = extractComponentDocs(path);
    expect(docs[0].props.map((p) => p.name)).toEqual(['a', 'm', 'b', 'z']);
  });

  test('emits an empty `props` array when the parameter has no type annotation', () => {
    const path = writeFixture(`
      export function Naked(props) { return null; }
    `);
    const docs = extractComponentDocs(path);
    expect(docs[0].props).toEqual([]);
  });

  test('deduplicates re-declared component names within the same file', () => {
    const path = writeFixture(`
      export function Dup(p: { a: string }) { return null; }
      export const Dup2 = Dup;
    `);
    const docs = extractComponentDocs(path);
    // The first declaration wins; the second never registers because
    // its name is already seen by the dedupe pass. The aliasing
    // expression also doesn't surface a new component.
    expect(docs).toHaveLength(1);
  });

  test('returns an empty array for a file with no components', () => {
    const path = writeFixture(`
      export const NOT_COMPONENT = 42;
      function helper() { return null; }
    `);
    const docs = extractComponentDocs(path);
    expect(docs).toEqual([]);
  });

  test('falls back to leading /** ... */ comment when the parser does not attach JSDoc', () => {
    const path = writeFixture(`
      /** Free-floating doc comment. */
      const Header = (p: { title: string }) => null;
      export { Header };
    `);
    const docs = extractComponentDocs(path);
    // The fixture uses a variable declaration so JSDoc attaches via
    // either the VariableStatement node or via leading-comment scan.
    expect(docs).toHaveLength(1);
    expect(docs[0].description).toContain('Free-floating');
  });

  test('VariantProps reference whose cva variable is missing falls back to the raw type text', () => {
    const path = writeFixture(`
      import { type VariantProps } from 'class-variance-authority';
      declare const unknownVariants: never;
      interface P { v: VariantProps<typeof unknownVariants>['size'] }
      export function X(p: P) { return null; }
    `);
    const docs = extractComponentDocs(path);
    const v = docs[0].props.find((p) => p.name === 'v');
    expect(v?.type).toContain('VariantProps');
  });

  test('reads default values when the destructured param renames the prop (`{ asChild: x = false }`)', () => {
    const path = writeFixture(`
      export function Renamed({ asChild: x = true }: { asChild?: boolean }) {
        return null;
      }
    `);
    const docs = extractComponentDocs(path);
    // The source-side key is `asChild`; binding renames don't affect
    // the documented name.
    const asChild = docs[0].props.find((p) => p.name === 'asChild');
    expect(asChild?.defaultValue).toBe('true');
  });

  test('extracts JSDoc that contains inline `{@link X}` tags (array-shaped `comment` field)', () => {
    const path = writeFixture(`
      export function Linked(p: {
        /** See {@link other} for the full spec. */
        value: string;
      }) { return null; }
    `);
    const docs = extractComponentDocs(path);
    const value = docs[0].props.find((p) => p.name === 'value');
    expect(value?.description).toContain('full spec');
  });

  test('cva variants whose option keys are quoted string-literals are still indexed', () => {
    const path = writeFixture(`
      import { cva, type VariantProps } from 'class-variance-authority';
      const tone = cva('base', {
        variants: {
          mood: { 'soft-light': '', 'hard-dark': '' },
        },
      });
      export function Vibe(p: { mood: VariantProps<typeof tone>['mood'] }) { return null; }
    `);
    const docs = extractComponentDocs(path);
    expect(docs[0].props[0].type).toBe("'soft-light' | 'hard-dark'");
  });

  test('cva calls without a `variants` block are skipped from the index', () => {
    const path = writeFixture(`
      import { cva, type VariantProps } from 'class-variance-authority';
      const empty = cva('base', { defaultVariants: {} });
      export function E(p: { v: VariantProps<typeof empty>['size'] }) { return null; }
    `);
    const docs = extractComponentDocs(path);
    // No variants table → no expansion, raw type text retained.
    expect(docs[0].props[0].type).toContain('VariantProps');
  });
});
