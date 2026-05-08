/**
 * Layer 0, Scalars
 * One knob per concern. Themes set these; everything downstream cascades.
 *
 * Tabular `[name, category, defaultLight, themePath, description, ...]`
 * form expanded by a builder so per-token boilerplate stays in one
 * place. TS catches malformed entries at authoring time; no runtime
 * validation needed.
 */

import type { TailwindNamespace, TokenCategory, TokenSpec } from './types';

type ScalarEntry = readonly [
  name: string,
  category: TokenCategory,
  defaultLight: string,
  themePath: string,
  description: string,
  tailwindNamespace?: TailwindNamespace,
  utilityAlias?: string,
];

function toScalar([
  name,
  category,
  defaultLight,
  themePath,
  description,
  tailwindNamespace,
  utilityAlias,
]: ScalarEntry): TokenSpec {
  return {
    name,
    layer: 'scalar',
    category,
    defaultLight,
    description,
    themePath,
    ...(tailwindNamespace ? { tailwindNamespace } : {}),
    ...(utilityAlias ? { utilityAlias } : {}),
  };
}

const SCALAR_DEFS: readonly ScalarEntry[] = [
  ['radius', 'geometry', '0.75rem', 'geometry.radius', 'Base corner radius. Drives the entire semantic radius scale.'],
  ['spacing', 'geometry', '0.25rem', 'geometry.spacing', 'Base spacing step. Drives Tailwind p-/m-/gap-/size-* utilities.'],
  ['text-base', 'typography', '1rem', 'geometry.textBase', 'Reference font size. Rescales the entire typography scale.'],
  ['font-sans', 'typography', '"Inter", ui-sans-serif, system-ui, sans-serif', 'geometry.fontSans', 'Default UI typeface for body and controls.', 'font', 'sans'],
  ['font-mono', 'typography', '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace', 'geometry.fontMono', 'Monospace typeface for code and tabular content.', 'font', 'mono'],
  ['border-width', 'border', '1px', 'borders.width', 'Default border width. Honored by the bare `border` utility.', 'default', 'border-width'],
  ['ring-width', 'focus', '2px', 'focus.width', 'Default focus ring width. Used by the `ring-themed` utility.'],
  ['ring-offset', 'focus', '2px', 'focus.offset', 'Default focus ring offset. Used by `ring-themed`.'],
  ['motion-duration', 'motion', '220ms', 'motion.duration', 'Base transition duration. Derived motion channels scale from this.'],
  ['motion-easing', 'motion', 'cubic-bezier(0.16, 1, 0.3, 1)', 'motion.easing', 'Base transition easing. Used by the `ease-standard` utility.'],
  ['backdrop-blur', 'elevation', '8px', 'geometry.backdropBlur', 'Default backdrop blur. Honored by `backdrop-blur-theme`.', 'blur', 'theme'],
  ['glass-tint', 'color', 'transparent', 'glass.tint', 'Tint colour layered above blurred surfaces. Use rgba/oklch with alpha.'],
];

export const SCALARS: readonly TokenSpec[] = SCALAR_DEFS.map(toScalar);
