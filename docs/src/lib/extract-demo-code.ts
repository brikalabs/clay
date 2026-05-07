/**
 * Source-text helpers for extracting JSX from demo function bodies.
 *
 * Lives in its own module (rather than inline in `component-registry.ts`)
 * because the registry pulls in Vite-only `import.meta.glob` at module
 * load — extracting these means the helpers are testable under Bun
 * without spinning up a Vite environment.
 */

/** Strip the common leading whitespace from every non-empty line (like Python's textwrap.dedent). */
export function dedent(code: string): string {
  const lines = code.split('\n');
  const indent = lines
    .filter((l) => l.trim().length > 0)
    .reduce((min, l) => Math.min(min, l.length - l.trimStart().length), Infinity);
  if (indent === Infinity || indent === 0) return code;
  return lines.map((l) => l.slice(indent)).join('\n');
}

/** Walk balanced braces starting at the index of an opening `{`. Returns the index just past the matching `}`. */
function findMatchingBrace(source: string, openBraceIdx: number): number {
  let depth = 1;
  let i = openBraceIdx + 1;
  while (i < source.length && depth > 0) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') depth--;
    i++;
  }
  return i;
}

/** Body text between `function name (...) {` and its matching `}`, trimmed. Null if the function isn't found. */
function findFunctionBody(source: string, fnName: string): string | null {
  const fnIdx = source.indexOf(`function ${fnName}`);
  if (fnIdx === -1) return null;
  const braceIdx = source.indexOf('{', fnIdx);
  if (braceIdx === -1) return null;
  const closeIdx = findMatchingBrace(source, braceIdx);
  return source.slice(braceIdx + 1, closeIdx - 1).trim();
}

/** Contents of the last `return (...)` in `body`, with balanced parens. Null if no parenthesized return. */
function extractParenthesizedReturn(body: string): string | null {
  const lastReturnParen = body.lastIndexOf('return (');
  if (lastReturnParen === -1) return null;
  let depth = 0;
  let start = -1;
  for (let j = lastReturnParen + 7; j < body.length; j++) {
    if (body[j] === '(') {
      if (depth === 0) start = j + 1;
      depth++;
    } else if (body[j] === ')') {
      depth--;
      if (depth === 0) return body.slice(start, j);
    }
  }
  return null;
}

/** Last single-expression `return …;` in `body`, trailing semicolon stripped. Null if no plain return. */
function extractExpressionReturn(body: string): string | null {
  const lastReturn = body.lastIndexOf('return ');
  if (lastReturn === -1) return null;
  return body.slice(lastReturn + 7).replace(/;\s*$/, '');
}

/** Extract the JSX from the return statement of a named function in source text. */
export function extractDemoCode(source: string, fnName: string): string {
  const body = findFunctionBody(source, fnName);
  if (body === null) return '';
  const parenReturn = extractParenthesizedReturn(body);
  if (parenReturn !== null) return dedent(parenReturn);
  const exprReturn = extractExpressionReturn(body);
  if (exprReturn !== null) return dedent(exprReturn);
  return dedent(body);
}
