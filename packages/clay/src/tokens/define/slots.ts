/**
 * Arbitrary-slot tokens. `radius`, `shadow`, `backdrop-blur`, and any
 * component-specific named slot (`filled-container`, `track-width`,
 * …) flow through the same `SlotInput` shape and `slotTokens` walker.
 */

import { inferTokenTypeFromValue, inferTokenTypeStrict } from '../infer';
import type { TailwindNamespace, TokenCategory, TokenSpec, TokenType } from '../types';
import type { ComponentMeta } from './meta';
import { TYPE_TO_CATEGORY, TYPE_TO_NAMESPACE } from './type-info';

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

export function slotTokens(
  m: ComponentMeta,
  entries: Readonly<Record<string, SlotInput>>
): TokenSpec[] {
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
