/**
 * Public surface of the token registry. Imported by the Tailwind plugin
 * (in `@brika/clay/tailwind`), by the docs site to render the token table,
 * by `themes/` to type / flatten theme JSON at runtime, and by every
 * Layer-2 component `tokens.ts` for `defineComponent` + spacing scalars.
 */
export type { ComponentDefinition, SlotInput } from './define';
export { defineComponent } from './define';
export { inferTokenType, inferTokenTypeStrict, TOKEN_TYPE_HINT } from './infer';
export { TOKEN_REGISTRY, TOKENS_BY_NAME, tokensByType } from './registry';
export type { ShorthandIndex } from './shorthands';
export { buildShorthandIndex, SHORTHAND_INDEX } from './shorthands';
export {
  SPACING_1,
  SPACING_1_5,
  SPACING_2,
  SPACING_3,
  SPACING_4,
  SPACING_6,
} from './spacing';
export type {
  ResolvedTokenSpec,
  TailwindNamespace,
  TokenCategory,
  TokenLayer,
  TokenSpec,
  TokenType,
} from './types';
