/**
 * Token families — geometry, border, motion, typography — each
 * declared as a small table of `FamilyField`s that the shared
 * `familyTokens` walker expands into `TokenSpec`s. New families add
 * one interface + one table + one wrapper function.
 */

import type { TokenCategory, TokenSpec } from '../types';
import type { ComponentMeta } from './meta';
import { token } from './token';

/**
 * One row in a token family's spec table. `key` is the user-facing
 * camelCase key on the input object (`paddingX`, `fontFamily`);
 * `suffix` is the kebab-case CSS-var tail (`padding-x`, `font-family`);
 * `category` and `describe` shape the registry entry.
 *
 * `whenOptional` controls the family's gating behaviour: "skip" omits
 * the token entirely when the input field is undefined; "fallback"
 * emits it with the fallback default (used by typography, where every
 * field always lives in the registry).
 */
export interface FamilyField<TInput extends object> {
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

export interface GeometryDefaults {
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

export function geometryTokens(m: ComponentMeta, defaults: GeometryDefaults = {}): TokenSpec[] {
  return familyTokens(m, defaults, GEOMETRY_FIELDS);
}

export interface BorderDefaults {
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

export function borderTokens(m: ComponentMeta, width = '0px'): TokenSpec[] {
  return familyTokens(m, { borderWidth: width }, BORDER_FIELDS);
}

export interface MotionDefaults {
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

export function motionTokens(m: ComponentMeta): TokenSpec[] {
  return familyTokens(m, {}, MOTION_FIELDS);
}

export interface TypographyDefaults {
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

export function typographyTokens(m: ComponentMeta, defaults: TypographyDefaults = {}): TokenSpec[] {
  return familyTokens(m, defaults, TYPOGRAPHY_FIELDS);
}
