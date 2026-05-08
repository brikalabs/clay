/**
 * Module-scoped accumulator for Layer-2 component tokens.
 *
 * Each component's `tokens.ts` calls `register(defineComponent(...))` at
 * module-load time. `./components.ts` is the side-effect-import barrel
 * that pulls every component's `tokens.ts` so the accumulator is fully
 * populated before `./registry.ts` snapshots it into `TOKEN_REGISTRY`.
 *
 * Why a mutable accumulator instead of a static array: removes the
 * destructure-and-spread duplication in the aggregator, components
 * self-register and the aggregator is just `import '...'` lines.
 */

import type { TokenSpec } from './types';

const COMPONENT_TOKENS: TokenSpec[] = [];

/**
 * Append a component's tokens to the registry. Call exactly once per
 * `defineComponent(...)` result, at module-load time. See
 * `src/components/button/tokens.ts` for the canonical pattern.
 */
export function register(tokens: readonly TokenSpec[]): void {
  COMPONENT_TOKENS.push(...tokens);
}

/**
 * Snapshot of registered component tokens. Callers must ensure every
 * `tokens.ts` has been imported (by importing `./components`) before
 * reading this, otherwise the result is partial.
 */
export function getComponentTokens(): readonly TokenSpec[] {
  return COMPONENT_TOKENS;
}
