/**
 * Single declarative entry point for registering a Clay component's
 * Layer-2 tokens. Component-author API is `defineComponent` /
 * `registerComponent` exported below; the helpers they compose from
 * live in `./define/*` so each module stays small and testable.
 *
 * Token names follow the `<name>-<slot>` convention. The `name`
 * argument becomes the kebab-case prefix on every emitted CSS variable
 * (`--<name>-radius`, `--<name>-padding-x`, …) and on the Tailwind
 * theme key (`components.<themeKey>.radius` in theme JSON).
 *
 * Default values are usually `var(...)` references that fall back
 * through Layer 1 roles (e.g. `--button-padding-x` falls back to
 * `calc(var(--spacing) * 4)`), so a theme that leaves a token blank
 * gets sensible behaviour without setting every entry.
 *
 * @example  Labeled interactive control (Button):
 *   defineComponent('button', {
 *     radius:  { default: 'var(--radius-control)', alias: 'button', description: 'Button corner radius.' },
 *     shadow:  { default: 'var(--shadow-surface)', alias: 'button', description: 'Resting elevation.' },
 *     surface: true,
 *     geometry:   { height: '2.25rem', paddingX: SPACING_4, paddingY: SPACING_2, gap: SPACING_2 },
 *     typography: { fontSize: 'var(--text-body-md)', fontWeight: '500' },
 *     slots: {
 *       'filled-container': { default: 'var(--primary)', description: 'Filled-variant background.' },
 *       'filled-label':     { default: 'var(--primary-foreground)', description: 'Filled-variant label.' },
 *     },
 *   });
 *
 * @example  Non-interactive surface (Card):
 *   defineComponent('card', {
 *     radius: { default: 'var(--radius-container)', alias: 'card', description: 'Card corner radius.' },
 *     shadow: { default: 'var(--shadow-raised)', alias: 'card', description: 'Card elevation.' },
 *     border: '1px',          // border-width + border-style tokens
 *     motion: true,           // duration + easing tokens
 *     backdropBlur: { default: '0px', description: 'Backdrop blur for translucent variants.' },
 *     geometry:   { paddingX: SPACING_6, paddingY: SPACING_6, gap: SPACING_4 },
 *     typography: { fontSize: 'var(--text-body-md)' },
 *     slots: {
 *       container: { default: 'var(--card)', description: 'Card background.' },
 *       label:     { default: 'var(--card-foreground)', description: 'Card text color.' },
 *     },
 *   });
 */

import type { ComponentMeta as PublicComponentMeta } from '../component-registry';
import { register } from './registry-state';
import type { TokenSpec } from './types';
import {
  borderTokens,
  type GeometryDefaults,
  geometryTokens,
  motionTokens,
  type TypographyDefaults,
  typographyTokens,
} from './define/families';
import { meta } from './define/meta';
import { type SlotInput, slotTokens } from './define/slots';

export type { SlotInput } from './define/slots';

/**
 * Declarative description of a single Clay component's tokens.
 *
 * Pass exactly one of these to `defineComponent`. Every option is
 * opt-in; the function only registers the families you list.
 */
export interface ComponentDefinition {
  /**
   * camelCase theme key used in `ThemeConfig` JSON
   * (`components.<themeKey>.<prop>`). Auto-derived from the
   * kebab-case `name` if omitted (e.g. `'switch-thumb'` →
   * `'switchThumb'`).
   */
  readonly themeKey?: string;

  // ─── Single-slot conventional tokens ─────────────────────────────
  /** Corner radius. Pair with the matching `rounded-<alias>` Tailwind utility. */
  readonly radius?: SlotInput;
  /** Resting drop shadow / elevation. */
  readonly shadow?: SlotInput;
  /** Backdrop-filter blur radius, for translucent surfaces (Card, Dialog, Popover, Sheet). */
  readonly backdropBlur?: SlotInput;

  // ─── Multi-token bundles ────────────────────────────────────────
  /**
   * Shortcut for `border + motion`, every interactive control
   * surface needs these. Pass `true` for a 0px resting border, or
   * `{ borderWidth: '1px' }` for a visible border on rest. When set,
   * the individual `border` / `motion` flags below are ignored.
   */
  readonly surface?: boolean | { readonly borderWidth: string };

  /**
   * Granular alternative to `surface` for non-interactive surfaces
   * (Card, Dialog content, Tooltip). Pass `true` for a `'0px'`
   * resting width or a string to set it explicitly.
   */
  readonly border?: boolean | string;
  /** Adds `--<name>-{duration,easing}`. */
  readonly motion?: boolean;

  // ─── Sizing / typography (opt-in field-by-field) ────────────────
  /** Sizing tokens, `height`, `paddingX`, `paddingY`, `gap`. Only set fields become tokens. */
  readonly geometry?: GeometryDefaults;
  /**
   * Text tokens, `fontFamily`, `fontSize`, `fontWeight`,
   * `lineHeight`, `letterSpacing`, `textTransform`. Pass an object
   * (even an empty one) to opt into the full typography family;
   * omit to skip every typography token (e.g. Switch and Checkbox
   * have no text inside).
   */
  readonly typography?: TypographyDefaults;

  // ─── Arbitrary named slots ──────────────────────────────────────
  /**
   * Component-specific tokens, semantic colors
   * (`filled-container`), custom sizes (`track-width`,
   * `thumb-size`), anything that doesn't fit one of the conventional
   * families above.
   */
  readonly slots?: Readonly<Record<string, SlotInput>>;
}

function collectSlots(
  def: ComponentDefinition,
  m: ReturnType<typeof meta>
): Record<string, SlotInput> {
  const merged: Record<string, SlotInput> = { ...def.slots };
  // Conventional slots default their Tailwind alias to the component
  // name, so `card-backdrop-blur` is reachable as `backdrop-blur-card`
  // (not the verbose `backdrop-blur-card-backdrop-blur`). Explicit
  // `alias` on the input wins.
  if (def.radius) {
    merged.radius = { alias: m.name, ...def.radius };
  }
  if (def.shadow) {
    merged.shadow = { alias: m.name, ...def.shadow };
  }
  if (def.backdropBlur) {
    merged['backdrop-blur'] = { alias: m.name, ...def.backdropBlur };
  }
  return merged;
}

/**
 * Resolve `border` opt-in into a width string, or `null` if absent:
 *   `'1px'` → `'1px'` · `true` → `'0px'` · `false`/`undefined` → `null`
 */
function resolveBorderWidth(value: boolean | string | undefined): string | null {
  if (value === undefined || value === false) {
    return null;
  }
  return typeof value === 'string' ? value : '0px';
}

/**
 * Resolve the surface bundle (`surface` shortcut, plus the granular
 * `border` / `motion` flags) into the matching token sets.
 * `surface` wins over the granular flags.
 */
function bundleTokens(
  m: ReturnType<typeof meta>,
  def: ComponentDefinition
): TokenSpec[] {
  if (def.surface) {
    const surfaceWidth = typeof def.surface === 'object' ? def.surface.borderWidth : '0px';
    return [...borderTokens(m, surfaceWidth), ...motionTokens(m)];
  }
  const out: TokenSpec[] = [];
  const borderWidth = resolveBorderWidth(def.border);
  if (borderWidth !== null) {
    out.push(...borderTokens(m, borderWidth));
  }
  if (def.motion) {
    out.push(...motionTokens(m));
  }
  return out;
}

/**
 * Build every Layer-2 CSS-variable token a component needs, in one
 * declarative call. Pure, no side effects, callers
 * (`registerComponent`, tests) decide whether to push the result into
 * the registry.
 */
export function defineComponent(name: string, def: ComponentDefinition): readonly TokenSpec[] {
  const m = meta(name, def.themeKey);
  const slots = collectSlots(def, m);
  return [
    ...(Object.keys(slots).length > 0 ? slotTokens(m, slots) : []),
    ...bundleTokens(m, def),
    ...(def.geometry ? geometryTokens(m, def.geometry) : []),
    ...(def.typography ? typographyTokens(m, def.typography) : []),
  ];
}

/**
 * Build a component's tokens AND push them into the global Layer-2
 * registry in one call. Component `tokens.ts` files use this, the
 * top-level call IS the registration:
 *
 * ```ts
 * import { registerComponent } from '../../tokens/define';
 * import { meta } from './meta';
 *
 * registerComponent(meta, {
 *   radius: { default: 'var(--radius-control)', description: '…' },
 *   surface: true,
 * });
 * ```
 *
 * Pass the component's `meta` object (the kebab-case `name` is read
 * off it) for the conventional case. Pass a string for components
 * whose token namespace differs from the directory's meta name
 * (`'menu'` / `'menu-item'` inside `dropdown-menu/tokens.ts`) or for
 * namespace-only registrations that don't have a `meta.ts`.
 */
export function registerComponent(
  metaOrName: PublicComponentMeta | string,
  def: ComponentDefinition
): readonly TokenSpec[] {
  const name = typeof metaOrName === 'string' ? metaOrName : metaOrName.name;
  const tokens = defineComponent(name, def);
  register(tokens);
  return tokens;
}
