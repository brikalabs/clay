import { describe, expect, test } from 'bun:test';
import { extractDemoMeta, titleFromKebab } from '../extract-demo-meta';

describe('titleFromKebab', () => {
  test('capitalises each kebab segment', () => {
    expect(titleFromKebab('default')).toBe('Default');
    expect(titleFromKebab('code-editor')).toBe('Code Editor');
    expect(titleFromKebab('with-icon-and-action')).toBe('With Icon And Action');
  });

  test('drops empty segments from double hyphens', () => {
    expect(titleFromKebab('foo--bar')).toBe('Foo Bar');
  });
});

describe('extractDemoMeta', () => {
  test('returns description from a leading JSDoc with no tags', () => {
    const source = `
      import x from 'y';

      /** Currency field with dollar-sign prefix and currency code suffix. */
      export default function Demo() { return null; }
    `;
    expect(extractDemoMeta(source)).toEqual({
      description: 'Currency field with dollar-sign prefix and currency code suffix.',
    });
  });

  test('captures @title and strips it from the description', () => {
    const source = `
      /**
       * Six-digit one-time-password input with auto-advance.
       * @title OTP Placeholder
       */
      export default function Demo() {}
    `;
    expect(extractDemoMeta(source)).toEqual({
      title: 'OTP Placeholder',
      description: 'Six-digit one-time-password input with auto-advance.',
    });
  });

  test('preserves multi-line description and collapses leading stars', () => {
    const source = `
      /**
       * First sentence.
       *
       * Second paragraph with more detail.
       */
      export default function Demo() {}
    `;
    expect(extractDemoMeta(source).description).toBe('First sentence.\n\nSecond paragraph with more detail.');
  });

  test('ignores JSDoc on non-default exports', () => {
    const source = `
      /** Helper not used by docs. */
      export const helper = 1;

      export default function Demo() {}
    `;
    expect(extractDemoMeta(source)).toEqual({});
  });

  test('returns empty object when there is no JSDoc above default export', () => {
    const source = `export default function Demo() {}`;
    expect(extractDemoMeta(source)).toEqual({});
  });

  test('drops unknown tags from the description', () => {
    const source = `
      /**
       * Description text.
       * @internal yes
       * @title Custom
       */
      export default function Demo() {}
    `;
    expect(extractDemoMeta(source)).toEqual({
      title: 'Custom',
      description: 'Description text.',
    });
  });
});
