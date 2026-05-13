/**
 * Convention-driven demo metadata extraction.
 *
 * Per-demo files (`<slug>/demos/<kebab>.demos.tsx`) follow a convention:
 *   - One `export default function …Demo() {}` per file.
 *   - An optional JSDoc block (`/** … *\/`) immediately above the default
 *     export carries the human-readable description shown in the docs.
 *   - An optional `@title …` tag inside that JSDoc overrides the auto-generated
 *     title for cases where the filename's Title-Case looks wrong
 *     ("Url" → "URL", "Otp" → "OTP").
 *
 * Everything is parsed from the raw source string. Doing it at the source level
 * (rather than via a runtime `meta` export) lets the docs registry stay zero-boilerplate
 * from the demo author's perspective.
 */

/** Parsed pieces extracted from a demo file's source. Missing fields are `undefined`. */
export interface DemoMeta {
  /** Override title taken from `@title …` inside the JSDoc, if present. */
  readonly title?: string;
  /** Free-form description text (JSDoc body minus tag lines), if any. */
  readonly description?: string;
}

/** Match a JSDoc block immediately preceding `export default`. */
const JSDOC_BEFORE_DEFAULT_EXPORT_RE = /\/\*\*([\s\S]*?)\*\/\s*export\s+default\b/;

/**
 * Strip JSDoc decoration from a captured block body.
 * Removes the leading `*` (and optional space) on every line, trims whitespace,
 * and collapses blank-only edges.
 */
function cleanJSDocBody(raw: string): string {
  return raw
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trimEnd())
    .join('\n')
    .trim();
}

/**
 * Parse the JSDoc immediately above `export default` in a demo source file.
 * Returns the description (tag lines removed) plus any recognised tags
 * (currently just `@title`).
 */
export function extractDemoMeta(source: string): DemoMeta {
  const match = JSDOC_BEFORE_DEFAULT_EXPORT_RE.exec(source);
  if (!match) return {};
  const body = cleanJSDocBody(match[1] ?? '');
  if (!body) return {};

  let title: string | undefined;
  const descriptionLines: string[] = [];

  for (const line of body.split('\n')) {
    const tagMatch = /^@(\w+)\s+(.*)$/.exec(line.trim());
    if (tagMatch) {
      const [, tag, value] = tagMatch;
      if (tag === 'title') title = value?.trim();
      // Unknown tags are silently dropped; they're not part of the description.
      continue;
    }
    descriptionLines.push(line);
  }

  const description = descriptionLines.join('\n').trim() || undefined;
  return { title, description };
}

/**
 * Convert a kebab-case demo filename to a Title-Case display string.
 * `code-editor` → `Code Editor`, `default` → `Default`, `with-icon` → `With Icon`.
 *
 * For filenames where Title-Case looks wrong (URL, OTP, JSON, …), authors
 * override via `@title …` inside the demo's JSDoc; see `extractDemoMeta`.
 */
export function titleFromKebab(kebab: string): string {
  return kebab
    .split('-')
    .filter((part) => part.length > 0)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}
