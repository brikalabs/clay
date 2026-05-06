import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { SHORTHAND_INDEX } from '../tokens/shorthands';

// Each shorthand class is its own single-member conflict group, so
// `cn('button', 'button')` collapses while different shorthands stay
// independent. Cross-conflict with raw Tailwind utilities is handled
// by the CSS layer order, not by twMerge.
const SHORTHAND_GROUPS = Object.fromEntries(
  Object.keys(SHORTHAND_INDEX.rules).map((cls) => [`clay-shorthand-${cls}`, [cls]])
);

const twMerge = extendTailwindMerge({
  extend: { classGroups: SHORTHAND_GROUPS },
});

/**
 * Merge Tailwind class names with conflict resolution. Combines `clsx`
 * with an extended `tailwind-merge` that knows about Clay's per-component
 * shorthand utilities, so a caller-supplied `className` safely overrides
 * internal defaults without duplicate utilities surviving.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
