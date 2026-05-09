/**
 * Single declarative entry point for registering a Clay component's
 * Layer-2 tokens. Component-author API is the `defineComponent` function
 * at the bottom; everything above it is the per-token-family expansion
 * machinery it composes from.
 *
 * Token names follow the `<name>-<slot>` convention. The `name` argument
 * becomes the kebab-case prefix on every emitted CSS variable
 * (`--<name>-radius`, `--<name>-padding-x`, …) and on the Tailwind theme
 * key (`components.<themeKey>.radius` in theme JSON).
 *
 * Default values are usually `var(...)` references that fall back through
 * Layer 1 roles (e.g. `--button-padding-x` falls back to
 * `calc(var(--spacing) * 4)`), so a theme that leaves a token blank gets
 * sensible behaviour without setting every entry.
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
 *
 * @example  Toggle without text (Switch, two namespaces):
 *   defineComponent('switch', {
 *     radius:  { default: '9999px', alias: 'switch', description: 'Track radius.' },
 *     surface: true,                     // border + focus + motion + state, no padding/typography
 *     slots: {
 *       'track-width':  { default: '2.5rem', description: 'Track width.' },
 *       'track-height': { default: '1.5rem', description: 'Track height.' },
 *     },
 *   });
 *   defineComponent('switch-thumb', {
 *     themeKey: 'switchThumb',
 *     radius:   { default: '9999px', alias: 'switch-thumb', description: 'Thumb radius.' },
 *     slots:    { size: { default: '1rem', description: 'Thumb diameter.' } },
 *   });
 */

import type { ComponentMeta as PublicComponentMeta } from '../component-registry';
import { inferTokenType, inferTokenTypeFromValue, inferTokenTypeStrict } from './infer';
import { register } from './registry-state';
import type { TailwindNamespace, TokenCategory, TokenSpec, TokenType } from './types';

// ─── Component meta ──────────────────────────────────────────────────────────

interface ComponentMeta {
  /** Component name as it appears in the registry (kebab-case, matches CSS). */
  readonly name: string;
  /** camelCase identifier used in `themePath` (`switchThumb` for `switch-thumb`). */
  readonly themeKey: string;
}

function meta(name: string, themeKey?: string): ComponentMeta {
  return {
    name,
    themeKey: themeKey ?? name.replaceAll(/-([a-z])/g, (_, c: string) => c.toUpperCase()),
  };
}

// ─── Token builder ───────────────────────────────────────────────────────────

/**
 * Build a single component-layer `TokenSpec`. `themeProp` is the camelCase
 * entry under `components.<themeKey>` in `ThemeConfig` JSON; `suffix` is the
 * kebab-case tail of the CSS-var name (e.g. `'padding-x'` → `--<comp>-padding-x`).
 */
function token(
  m: ComponentMeta,
  category: TokenCategory,
  suffix: string,
  themeProp: string,
  defaultLight: string,
  description: string
): TokenSpec {
  const name = `${m.name}-${suffix}`;
  const type = inferTokenType(name);
  const namespace = TYPE_TO_NAMESPACE[type];
  // When a family token's suffix already names the type (`card-duration`,
  // `button-font-family`), aliasing the utility to the bare component name
  // keeps Tailwind classes readable: `duration-card`, `font-button`. Slots
  // with non-canonical suffixes (`card-padding-x`) keep the full name to
  // stay unique.
  const alias = NAMESPACE_USES_BARE_ALIAS.has(namespace) ? m.name : undefined;
  return {
    name,
    layer: 'component',
    category,
    appliesTo: m.name,
    defaultLight,
    description,
    themePath: `components.${m.themeKey}.${themeProp}`,
    tailwindNamespace: namespace,
    utilityAlias: alias,
  };
}

const NAMESPACE_USES_BARE_ALIAS: ReadonlySet<TailwindNamespace | undefined> = new Set([
  'motion',
  'font',
  'text',
  'opacity',
  'border-w',
  'border-style',
  'font-weight',
  'leading',
  'tracking',
  'case',
  'corner',
]);

// ─── Token families ──────────────────────────────────────────────────────────
//
// Each helper returns an array of `TokenSpec`s for a coherent slice of the
// component surface. `defineComponent` (below) opts in/out per family.

/**
 * One row in a token family's spec table. `key` is the user-facing camelCase
 * key on the input object (`paddingX`, `fontFamily`); `suffix` is the
 * kebab-case CSS-var tail (`padding-x`, `font-family`); `category` and
 * `describe` shape the registry entry.
 *
 * `whenOptional` controls the family's gating behaviour: "skip" omits the
 * token entirely when the input field is undefined; "fallback" emits it
 * with the fallback default (used by typography, where every field always
 * lives in the registry).
 */
interface FamilyField<TInput extends object> {
  readonly key: keyof TInput;
  readonly suffix: string;
  readonly category: TokenCategory;
  readonly fallback?: string;
  readonly describe: (name: string) => string;
  readonly whenOptional: 'skip' | 'fallback';
}

function familyTokens<TInput extends object>(
  m: ComponentMeta,
  defaults: TInput,
  fields: ReadonlyArray<FamilyField<TInput>>
): TokenSpec[] {
  const out: TokenSpec[] = [];
  for (const f of fields) {
    const value = defaults[f.key] as string | undefined;
    const resolved = value ?? (f.whenOptional === 'fallback' ? f.fallback : undefined);
    if (resolved === undefined) continue;
    out.push(token(m, f.category, f.suffix, String(f.key), resolved, f.describe(m.name)));
  }
  return out;
}

interface GeometryDefaults {
  readonly height?: string;
  readonly paddingX?: string;
  readonly paddingY?: string;
  readonly gap?: string;
}

const GEOMETRY_FIELDS: ReadonlyArray<FamilyField<GeometryDefaults>> = [
  { key: 'height', suffix: 'height', category: 'geometry', whenOptional: 'skip',
    describe: (n) => `Default ${n} height.` },
  { key: 'paddingX', suffix: 'padding-x', category: 'geometry', whenOptional: 'skip',
    describe: (n) => `Inline padding inside the ${n}.` },
  { key: 'paddingY', suffix: 'padding-y', category: 'geometry', whenOptional: 'skip',
    describe: (n) => `Block padding inside the ${n}.` },
  { key: 'gap', suffix: 'gap', category: 'geometry', whenOptional: 'skip',
    describe: (n) => `Gap between adjacent children inside the ${n}.` },
];

function geometryTokens(m: ComponentMeta, defaults: GeometryDefaults = {}): TokenSpec[] {
  return familyTokens(m, defaults, GEOMETRY_FIELDS);
}

interface BorderDefaults {
  readonly borderWidth: string;
  readonly borderStyle?: string;
}

const BORDER_FIELDS: ReadonlyArray<FamilyField<BorderDefaults>> = [
  { key: 'borderWidth', suffix: 'border-width', category: 'border', whenOptional: 'skip',
    describe: (n) => `Border width on the ${n}. Set non-zero for outline-style variants.` },
  { key: 'borderStyle', suffix: 'border-style', category: 'border', whenOptional: 'fallback',
    fallback: 'solid',
    describe: (n) => `Border style on the ${n} (\`solid\`, \`dashed\`, \`double\`, \`none\`).` },
];

function borderTokens(m: ComponentMeta, width = '0px'): TokenSpec[] {
  return familyTokens(m, { borderWidth: width }, BORDER_FIELDS);
}

interface MotionDefaults {
  readonly duration?: string;
  readonly easing?: string;
}

const MOTION_FIELDS: ReadonlyArray<FamilyField<MotionDefaults>> = [
  { key: 'duration', suffix: 'duration', category: 'motion', whenOptional: 'fallback',
    fallback: 'var(--motion-standard-duration)',
    describe: (n) => `Transition duration for ${n} state changes.` },
  { key: 'easing', suffix: 'easing', category: 'motion', whenOptional: 'fallback',
    fallback: 'var(--motion-standard-easing)',
    describe: (n) => `Transition easing for ${n} state changes.` },
];

function motionTokens(m: ComponentMeta): TokenSpec[] {
  return familyTokens(m, {}, MOTION_FIELDS);
}

interface TypographyDefaults {
  readonly fontFamily?: string;
  readonly fontSize?: string;
  readonly fontWeight?: string;
  readonly lineHeight?: string;
  readonly letterSpacing?: string;
  readonly textTransform?: string;
}

const TYPOGRAPHY_FIELDS: ReadonlyArray<FamilyField<TypographyDefaults>> = [
  { key: 'fontFamily', suffix: 'font-family', category: 'typography', whenOptional: 'fallback',
    fallback: 'var(--font-sans)', describe: (n) => `Typeface for ${n}.` },
  { key: 'fontSize', suffix: 'font-size', category: 'typography', whenOptional: 'fallback',
    fallback: 'var(--text-body-md)', describe: (n) => `Font size for ${n}.` },
  { key: 'fontWeight', suffix: 'font-weight', category: 'typography', whenOptional: 'fallback',
    fallback: '500', describe: (n) => `Font weight for ${n}.` },
  { key: 'lineHeight', suffix: 'line-height', category: 'typography', whenOptional: 'fallback',
    fallback: '1.25', describe: (n) => `Line height for ${n}.` },
  { key: 'letterSpacing', suffix: 'letter-spacing', category: 'typography', whenOptional: 'fallback',
    fallback: '0', describe: (n) => `Letter spacing for ${n}. Useful for caps labels.` },
  { key: 'textTransform', suffix: 'text-transform', category: 'typography', whenOptional: 'fallback',
    fallback: 'none',
    describe: (n) => `Text transform for ${n} (\`uppercase\`, \`lowercase\`, \`capitalize\`, \`none\`).` },
];

function typographyTokens(m: ComponentMeta, defaults: TypographyDefaults = {}): TokenSpec[] {
  return familyTokens(m, defaults, TYPOGRAPHY_FIELDS);
}

// ─── Slot tokens (radius / shadow / backdrop-blur / arbitrary slots) ────────

const TYPE_TO_CATEGORY: Readonly<Record<TokenType, TokenCategory>> = {
  color: 'color',
  size: 'geometry',
  radius: 'geometry',
  'border-width': 'border',
  'border-style': 'border',
  shadow: 'elevation',
  duration: 'motion',
  easing: 'motion',
  'font-family': 'typography',
  'font-size': 'typography',
  'font-weight': 'typography',
  'line-height': 'typography',
  'letter-spacing': 'typography',
  'text-transform': 'typography',
  'corner-shape': 'geometry',
  opacity: 'state',
  blur: 'elevation',
};

const TYPE_TO_NAMESPACE: Partial<Record<TokenType, TailwindNamespace>> = {
  color: 'color',
  radius: 'radius',
  shadow: 'shadow',
  size: 'spacing',
  blur: 'blur',
  duration: 'motion',
  easing: 'motion',
  opacity: 'opacity',
  'font-family': 'font',
  'font-size': 'text',
  'border-width': 'border-w',
  'border-style': 'border-style',
  'font-weight': 'font-weight',
  'line-height': 'leading',
  'letter-spacing': 'tracking',
  'text-transform': 'case',
  'corner-shape': 'corner',
};

/**
 * Compact authoring shape for a single component-layer token slot.
 *
 *   default     , required CSS expression for `defaultLight`.
 *   description , required one-sentence prose, surfaced in the docs site.
 *   defaultDark , set when the dark-mode value differs.
 *   type        , override the name-suffix-based type inference.
 *   category    , override the type-derived category.
 *   namespace   , Tailwind namespace; auto-set for color/radius/shadow,
 *                  pass `'none'` (or omit) to suppress.
 *   alias       , Tailwind utility short name (`rounded-<alias>` etc.).
 */
export interface SlotInput {
  readonly default: string;
  readonly description: string;
  readonly defaultDark?: string;
  readonly type?: TokenType;
  readonly category?: TokenCategory;
  readonly namespace?: TailwindNamespace;
  readonly alias?: string;
  /**
   * Set when the slot is referenced directly from hand-authored CSS or
   * className strings (e.g. inside a `color-mix(... var(--token) ...)`
   * expression). Forces the var-chain default into `:root` even when
   * registry-side cascade analysis would otherwise drop it. Slots only
   * consumed through the auto-generated Tailwind utilities (`bg-*`,
   * `rounded-*`, ...) do NOT need this flag.
   */
  readonly consumedByCss?: boolean;
}

function slotTokens(m: ComponentMeta, entries: Readonly<Record<string, SlotInput>>): TokenSpec[] {
  return Object.entries(entries).map(([key, input]) => {
    const name = `${m.name}-${key}`;
    const type =
      input.type ?? inferTokenTypeStrict(name) ?? inferTokenTypeFromValue(input.default) ?? 'color';
    const category = input.category ?? TYPE_TO_CATEGORY[type];
    const namespace = input.namespace ?? TYPE_TO_NAMESPACE[type];
    const themeProp = key.replaceAll(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
    return {
      name,
      layer: 'component',
      appliesTo: m.name,
      type,
      category,
      defaultLight: input.default,
      defaultDark: input.defaultDark,
      description: input.description,
      themePath: `components.${m.themeKey}.${themeProp}`,
      tailwindNamespace: namespace,
      utilityAlias: input.alias,
      consumedByCss: input.consumedByCss,
    };
  });
}

// ─── Public authoring API ───────────────────────────────────────────────────

/**
 * Declarative description of a single Clay component's tokens.
 *
 * Pass exactly one of these to `defineComponent`. Every option is opt-in;
 * the function only registers the families you list.
 */
export interface ComponentDefinition {
  /**
   * camelCase theme key used in `ThemeConfig` JSON
   * (`components.<themeKey>.<prop>`). Auto-derived from the kebab-case
   * `name` if omitted (e.g. `'switch-thumb'` → `'switchThumb'`).
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
   * Shortcut for `border + motion`, every interactive control surface
   * needs these. Pass `true` for a 0px resting border, or
   * `{ borderWidth: '1px' }` for a visible border on rest. When set,
   * the individual `border` / `motion` flags below are ignored.
   */
  readonly surface?: boolean | { readonly borderWidth: string };

  /**
   * Granular alternative to `surface` for non-interactive surfaces
   * (Card, Dialog content, Tooltip). Pass `true` for a `'0px'` resting
   * width or a string to set it explicitly.
   */
  readonly border?: boolean | string;
  /** Adds `--<name>-{duration,easing}`. */
  readonly motion?: boolean;

  // ─── Sizing / typography (opt-in field-by-field) ────────────────
  /** Sizing tokens, `height`, `paddingX`, `paddingY`, `gap`. Only set fields become tokens. */
  readonly geometry?: GeometryDefaults;
  /**
   * Text tokens, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`,
   * `letterSpacing`, `textTransform`. Pass an object (even an empty one)
   * to opt into the full typography family; omit to skip every typography
   * token (e.g. Switch and Checkbox have no text inside).
   */
  readonly typography?: TypographyDefaults;

  // ─── Arbitrary named slots ──────────────────────────────────────
  /**
   * Component-specific tokens, semantic colors (`filled-container`),
   * custom sizes (`track-width`, `thumb-size`), anything that doesn't
   * fit one of the conventional families above.
   */
  readonly slots?: Readonly<Record<string, SlotInput>>;
}

function collectSlots(def: ComponentDefinition, m: ComponentMeta): Record<string, SlotInput> {
  const merged: Record<string, SlotInput> = { ...def.slots };
  // Conventional slots default their Tailwind alias to the component name,
  // so `card-backdrop-blur` is reachable as `backdrop-blur-card` (not the
  // verbose `backdrop-blur-card-backdrop-blur`). Explicit `alias` on the
  // input wins.
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
function bundleTokens(m: ComponentMeta, def: ComponentDefinition): TokenSpec[] {
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
 * declarative call. Pure, no side effects, callers (`registerComponent`,
 * tests) decide whether to push the result into the registry.
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
 * Pass the component's `meta` object (the kebab-case `name` is read off
 * it) for the conventional case. Pass a string for components whose token
 * namespace differs from the directory's meta name (`'menu'` /
 * `'menu-item'` inside `dropdown-menu/tokens.ts`) or for namespace-only
 * registrations that don't have a `meta.ts`.
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
