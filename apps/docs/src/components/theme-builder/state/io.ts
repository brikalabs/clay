/**
 * Theme JSON file I/O. Two operations:
 *   - `downloadThemeJson(theme)` , trigger a browser download of the
 *      theme as a pretty-printed JSON file.
 *   - `parseThemeJson(text)`     , validate a candidate JSON string and
 *      return either the parsed `ThemeConfig` or an error message.
 *
 * The validator is intentionally loose: it asserts the four required
 * identity fields, ensures recognised section keys hold objects of
 * strings, and silently drops unknown roots. This matches Clay's runtime
 * behaviour, which silently no-ops on unknown theme entries rather than
 * throwing.
 */

import { renderThemeStyleSheet, type ThemeConfig } from '@brika/clay/themes';

export function downloadThemeJson(theme: ThemeConfig): void {
  if (typeof window === 'undefined') return;
  const json = JSON.stringify(theme, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeId = theme.id.replace(/[^a-z0-9_-]/gi, '_') || 'theme';
  anchor.href = url;
  anchor.download = `${safeId}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export type ParseResult =
  | { readonly ok: true; readonly theme: ThemeConfig }
  | { readonly ok: false; readonly error: string };

const SECTION_KEYS: readonly (keyof ThemeConfig)[] = [
  'colors',
  'geometry',
  'borders',
  'motion',
  'focus',
  'components',
  'effects',
];

export function parseThemeJson(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'File is not valid JSON.' };
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'Theme JSON must be an object.' };
  }
  const obj = raw as Record<string, unknown>;
  for (const required of ['id', 'name', 'description'] as const) {
    if (typeof obj[required] !== 'string' || (obj[required] as string).length === 0) {
      return { ok: false, error: `Missing required field: ${required}.` };
    }
  }
  if (!Array.isArray(obj.accentSwatches)) {
    return { ok: false, error: 'Missing or invalid field: accentSwatches.' };
  }
  for (const swatch of obj.accentSwatches) {
    if (typeof swatch !== 'string') {
      return { ok: false, error: 'accentSwatches must be an array of strings.' };
    }
  }

  if (obj.colors !== undefined && !isStringRecordPair(obj.colors, 'light', 'dark')) {
    return { ok: false, error: 'colors must be { light?, dark? } records of strings.' };
  }
  for (const key of ['geometry', 'borders', 'motion', 'focus'] as const) {
    if (obj[key] !== undefined && !isStringRecord(obj[key])) {
      return { ok: false, error: `${key} must be a record of strings.` };
    }
  }
  if (obj.components !== undefined) {
    if (!obj.components || typeof obj.components !== 'object' || Array.isArray(obj.components)) {
      return { ok: false, error: 'components must be a record of records.' };
    }
    for (const [comp, props] of Object.entries(obj.components as Record<string, unknown>)) {
      if (!isStringRecord(props)) {
        return { ok: false, error: `components.${comp} must be a record of strings.` };
      }
    }
  }
  if (obj.effects !== undefined && !Array.isArray(obj.effects)) {
    return { ok: false, error: 'effects must be an array of strings.' };
  }

  // Strip unknown roots so the returned object is a clean ThemeConfig.
  const cleaned: Record<string, unknown> = {
    id: obj.id,
    name: obj.name,
    description: obj.description,
    accentSwatches: obj.accentSwatches,
  };
  for (const key of SECTION_KEYS) {
    if (obj[key] !== undefined) cleaned[key] = obj[key];
  }
  return { ok: true, theme: cleaned as unknown as ThemeConfig };
}

function isStringRecord(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  for (const v of Object.values(value as Record<string, unknown>)) {
    if (typeof v !== 'string') return false;
  }
  return true;
}

function isStringRecordPair(value: unknown, ...keys: readonly string[]): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (!keys.includes(k)) return false;
    if (v === undefined) continue;
    if (!isStringRecord(v)) return false;
  }
  return true;
}

// ─── Export formatters ───────────────────────────────────────────────
//
// Three text formats consumers of @brika/clay typically paste into
// their app: a TS module, a CSS rule string, or the Tailwind plugin
// call. All three round-trip the same `ThemeConfig` JSON; the
// difference is the wrapping syntax around it.

/**
 * Emit a paste-ready TypeScript module that exports the theme as a
 * typed `ThemeConfig`. The caller's tsconfig must resolve the
 * `@brika/clay/themes` import (every Clay consumer's already does).
 */
export function toTypeScript(theme: ThemeConfig): string {
  const json = JSON.stringify(theme, null, 2);
  return `import type { ThemeConfig } from "@brika/clay/themes";

export const ${safeIdentifier(theme.id)}Theme = ${json} as const satisfies ThemeConfig;
`;
}

/**
 * Emit the same CSS body the Tailwind plugin bakes at build time:
 * a `:root { … }` block plus a dark-mode override block. Reuses the
 * canonical `renderThemeStyleSheet` so this stays in lockstep with
 * `applyTheme`'s runtime output.
 */
export function toCss(theme: ThemeConfig): string {
  return renderThemeStyleSheet(theme);
}

/**
 * Emit a paste-ready Tailwind plugin call. The user's `tailwind.config`
 * adds `clayPlugin` from `@brika/clay/tailwind`; the `theme` option
 * accepts a literal config object exactly like the JSON we ship.
 */
export function toTailwindCall(theme: ThemeConfig): string {
  const json = JSON.stringify(theme, null, 2);
  return `import { clayPlugin } from "@brika/clay/tailwind";

export default {
  plugins: [
    clayPlugin({
      theme: ${json},
    }),
  ],
};
`;
}

/** Sanitise a theme id for use as a JS identifier root. */
function safeIdentifier(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9]/g, '');
  if (cleaned.length === 0) return 'custom';
  return /^[0-9]/.test(cleaned) ? `_${cleaned}` : cleaned;
}
