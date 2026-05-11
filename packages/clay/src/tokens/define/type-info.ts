/**
 * Type-to-category and type-to-Tailwind-namespace routing tables used
 * by the family/token/slot helpers. Single source of truth.
 */

import type { TailwindNamespace, TokenCategory, TokenType } from '../types';

export const TYPE_TO_CATEGORY: Readonly<Record<TokenType, TokenCategory>> = {
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

export const TYPE_TO_NAMESPACE: Partial<Record<TokenType, TailwindNamespace>> = {
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

export const NAMESPACE_USES_BARE_ALIAS: ReadonlySet<TailwindNamespace | undefined> = new Set([
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
