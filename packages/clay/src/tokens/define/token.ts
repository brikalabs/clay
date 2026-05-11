/**
 * Single-token builder used by every family helper + the slot
 * compiler. Wraps `inferTokenType` + the namespace alias table so the
 * family modules don't need to know about Tailwind-namespace routing.
 */

import { inferTokenType } from '../infer';
import type { TokenCategory, TokenSpec } from '../types';
import type { ComponentMeta } from './meta';
import { NAMESPACE_USES_BARE_ALIAS, TYPE_TO_NAMESPACE } from './type-info';

/**
 * Build a single component-layer `TokenSpec`. `themeProp` is the
 * camelCase entry under `components.<themeKey>` in `ThemeConfig` JSON;
 * `suffix` is the kebab-case tail of the CSS-var name (e.g.
 * `'padding-x'` → `--<comp>-padding-x`).
 */
export function token(
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
  // When a family token's suffix already names the type
  // (`card-duration`, `button-font-family`), aliasing the utility to
  // the bare component name keeps Tailwind classes readable:
  // `duration-card`, `font-button`. Slots with non-canonical suffixes
  // (`card-padding-x`) keep the full name to stay unique.
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
