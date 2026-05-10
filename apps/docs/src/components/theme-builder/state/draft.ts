/**
 * Bridge between the editor's flat `Draft` (what the UI mutates) and the
 * persisted `ThemeConfig` (what flattenTheme + applyTheme consume).
 *
 * The Draft is a sparse Map keyed on a fully-qualified path inside the
 * ThemeConfig tree:
 *
 *   "colors.light.<kebab-name>"     // role colors, light variant
 *   "colors.dark.<kebab-name>"      // role colors, dark variant
 *   "geometry.<camelProp>"          // scalars walked into geometry
 *   "borders.<camelProp>"           // border-width, border-style
 *   "motion.<camelProp>"            // motion-duration, motion-easing
 *   "focus.<camelProp>"             // ring-width, ring-offset
 *   "components.<themeKey>.<prop>"  // per-component overrides
 *
 * Only dirty entries are present; the editor reads defaults from the token
 * registry on demand via `effectiveValue()`.
 */

import type { ResolvedTokenSpec, TokenLayer } from '@brika/clay/tokens';
import { TOKENS_BY_NAME } from '@brika/clay/tokens';
import type { ThemeConfig, ThemeMode } from '@brika/clay/themes';

export type Draft = ReadonlyMap<string, string>;

export interface ThemeIdentity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly accentSwatches: readonly string[];
}

const REACHABLE_ROOTS = new Set(['colors', 'geometry', 'borders', 'motion', 'focus', 'components']);

/**
 * Compute the Draft key for a token in a given mode, or null when the
 * token has no overridable theme path (state.*, glass.*, derived role
 * tokens with no themePath).
 */
export function tokenDraftKey(token: ResolvedTokenSpec, mode: ThemeMode): string | null {
  if (token.category === 'color') {
    // The flatten function reads literal keys under `colors.{light,dark}`,
    // and existing presets store the kebab token name as the key. The
    // registry's themePath uses camelCase here, which is misleading; ignore
    // it and build the path from the (already kebab) token name.
    return `colors.${mode}.${token.name}`;
  }
  const path = token.themePath;
  if (!path) return null;
  const root = path.split('.', 1)[0];
  if (!REACHABLE_ROOTS.has(root)) return null;
  if (root === 'colors') {
    // Defensive: any non-`color`-category token whose themePath claims
    // colors.* is still mode-specific.
    return `colors.${mode}.${path.slice('colors.'.length)}`;
  }
  return path;
}

/**
 * The default value for a token in a given mode. Falls back to defaultLight
 * when defaultDark isn't set.
 */
export function tokenDefault(token: ResolvedTokenSpec, mode: ThemeMode): string {
  if (mode === 'dark' && token.defaultDark) return token.defaultDark;
  return token.defaultLight;
}

/**
 * The current value of a token, draft override taking precedence.
 */
export function effectiveValue(
  draft: Draft,
  token: ResolvedTokenSpec,
  mode: ThemeMode
): string {
  const key = tokenDraftKey(token, mode);
  if (key !== null) {
    const v = draft.get(key);
    if (v !== undefined) return v;
  }
  return tokenDefault(token, mode);
}

export function isDirty(draft: Draft, key: string): boolean {
  return draft.has(key);
}

export function setDraftValue(draft: Draft, key: string, value: string): Draft {
  const next = new Map(draft);
  next.set(key, value);
  return next;
}

export function resetDraftValue(draft: Draft, key: string): Draft {
  if (!draft.has(key)) return draft;
  const next = new Map(draft);
  next.delete(key);
  return next;
}

export function clearDraft(): Draft {
  return new Map();
}

/**
 * Project a Draft into a ThemeConfig. Empty subtrees are dropped so the
 * serialized JSON stays minimal.
 */
export function themeConfigFromDraft(draft: Draft, identity: ThemeIdentity): ThemeConfig {
  type AnyObj = Record<string, unknown>;
  const root: AnyObj = {
    id: identity.id,
    name: identity.name,
    description: identity.description,
    accentSwatches: [...identity.accentSwatches],
  };
  for (const [key, value] of draft) {
    const segments = key.split('.');
    if (segments.length < 2) continue;
    let cursor: AnyObj = root;
    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i];
      const existing = cursor[seg];
      if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
        cursor = existing as AnyObj;
      } else {
        const fresh: AnyObj = {};
        cursor[seg] = fresh;
        cursor = fresh;
      }
    }
    cursor[segments[segments.length - 1]] = value;
  }
  return root as unknown as ThemeConfig;
}

/**
 * Inverse of `themeConfigFromDraft`: walk a ThemeConfig and produce a flat
 * draft Map. Only the editable subtrees are read — identity fields, theme
 * effects, and unknown roots are ignored.
 */
export function draftFromThemeConfig(theme: ThemeConfig): Draft {
  const out = new Map<string, string>();
  const colors = theme.colors;
  if (colors) {
    if (colors.light) writeRecord(out, 'colors.light', colors.light);
    if (colors.dark) writeRecord(out, 'colors.dark', colors.dark);
  }
  if (theme.geometry) writeRecord(out, 'geometry', theme.geometry as Record<string, unknown>);
  if (theme.borders) writeRecord(out, 'borders', theme.borders as Record<string, unknown>);
  if (theme.motion) writeRecord(out, 'motion', theme.motion as Record<string, unknown>);
  if (theme.focus) writeRecord(out, 'focus', theme.focus as Record<string, unknown>);
  if (theme.components) {
    for (const [comp, props] of Object.entries(theme.components)) {
      writeRecord(out, `components.${comp}`, props as Record<string, unknown>);
    }
  }
  return out;
}

function writeRecord(
  out: Map<string, string>,
  prefix: string,
  source: Readonly<Record<string, unknown>>
): void {
  for (const [k, v] of Object.entries(source)) {
    if (typeof v === 'string' && v.length > 0) out.set(`${prefix}.${k}`, v);
  }
}

/**
 * Pick four representative role colors (primary, success, warning,
 * destructive — light mode) so the swatch strip on the ThemePicker entry
 * stays meaningful as the user edits.
 */
const SWATCH_TOKENS: readonly string[] = ['primary', 'success', 'warning', 'destructive'];

export function deriveAccentSwatches(draft: Draft): readonly string[] {
  return SWATCH_TOKENS.map((name) => {
    const token = TOKENS_BY_NAME[name];
    if (!token) return '#888888';
    return effectiveValue(draft, token, 'light');
  });
}

/**
 * Group every token in the registry by `category` (or by component name
 * when `layer === 'component'`). Used by the Advanced tab to render
 * accordions.
 */
export interface TokenGroup {
  readonly id: string;
  readonly label: string;
  readonly layer: TokenLayer;
  readonly tokens: readonly ResolvedTokenSpec[];
}
