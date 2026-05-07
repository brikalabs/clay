import { describe, expect, test } from 'bun:test';
import { dedent, extractDemoCode } from '../extract-demo-code';

describe('dedent', () => {
  test('strips common leading whitespace', () => {
    const input = '    line one\n    line two\n      indented';
    expect(dedent(input)).toBe('line one\nline two\n  indented');
  });

  test('returns input unchanged when no shared indent', () => {
    const input = 'line one\n  line two';
    expect(dedent(input)).toBe('line one\n  line two');
  });

  test('returns input unchanged when empty', () => {
    expect(dedent('')).toBe('');
  });

  test('ignores empty lines when computing the shared indent', () => {
    const input = '    a\n\n    b';
    expect(dedent(input)).toBe('a\n\nb');
  });

  test('handles single-line input', () => {
    expect(dedent('  one line')).toBe('one line');
  });
});

describe('extractDemoCode', () => {
  test('returns the JSX inside the last `return (...)` block', () => {
    const source = `
      function Demo() {
        return (
          <div>hello</div>
        );
      }
    `;
    expect(extractDemoCode(source, 'Demo').trim()).toBe('<div>hello</div>');
  });

  test('handles balanced parentheses inside the JSX return', () => {
    const source = `
      function Demo() {
        return (
          <div onClick={() => doThing()}>
            {items.map((item) => <span key={item.id}>{item.label}</span>)}
          </div>
        );
      }
    `;
    expect(extractDemoCode(source, 'Demo')).toContain('items.map((item)');
    expect(extractDemoCode(source, 'Demo')).toContain('onClick');
  });

  test('falls back to single-expression returns', () => {
    const source = `
      function Demo() {
        return <div>plain</div>;
      }
    `;
    expect(extractDemoCode(source, 'Demo')).toBe('<div>plain</div>');
  });

  test('returns empty string when the function is not found', () => {
    const source = 'function Other() { return null; }';
    expect(extractDemoCode(source, 'Demo')).toBe('');
  });

  test('returns empty string when source is empty', () => {
    expect(extractDemoCode('', 'Demo')).toBe('');
  });

  test('walks nested braces inside the function body', () => {
    const source = `
      function Demo() {
        const obj = { a: { b: 1 } };
        if (obj.a.b) {
          return (
            <div>{obj.a.b}</div>
          );
        }
        return null;
      }
    `;
    expect(extractDemoCode(source, 'Demo').trim()).toBe('<div>{obj.a.b}</div>');
  });

  test('falls back to function body when no return statement', () => {
    const source = `
      function Demo() {
        const x = 1;
      }
    `;
    expect(extractDemoCode(source, 'Demo')).toContain('const x = 1');
  });

  test('uses the last return when the function has multiple', () => {
    const source = `
      function Demo() {
        if (cond) {
          return <div>early</div>;
        }
        return (
          <div>late</div>
        );
      }
    `;
    expect(extractDemoCode(source, 'Demo').trim()).toBe('<div>late</div>');
  });
});
