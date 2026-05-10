import { TextFallback } from './_shared';
import type { TokenControlBaseProps } from './types';

/**
 * Free-text fallback. Used for token types we don't have a richer
 * control for yet (custom enums, line-height as a unitless ratio, etc.).
 */
export function TextControl(props: TokenControlBaseProps) {
  return <TextFallback {...props} />;
}
