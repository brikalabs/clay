/**
 * Paint a CSS color value over a checkerboard so alpha and translucent
 * `var(...)` chains are visible. Renders the literal color when `value`
 * is one of the special keywords (`currentColor` resolves to the
 * surrounding text color, `transparent` shows pure checkerboard,
 * `inherit` resolves wherever inheritance lands). Empty values fall
 * back to a 45° stripe pattern so unset slots are obvious.
 */

import { type ComponentProps, type CSSProperties } from 'react';
import { cn } from '../../primitives/cn';
import { isSpecialKeyword } from './color-utils';
import { checkerboardBg } from './internal/checkerboard';

export interface ColorPickerSwatchProps extends Omit<ComponentProps<'span'>, 'children'> {
  readonly value: string;
}

export function ColorPickerSwatch({
  value,
  className,
  style,
  ...rest
}: Readonly<ColorPickerSwatchProps>) {
  const v = value.trim();
  let resolvedStyle: CSSProperties;
  if (v.length === 0) {
    resolvedStyle = {
      backgroundImage:
        'repeating-linear-gradient(45deg, color-mix(in oklch, currentColor 20%, transparent) 0 4px, transparent 4px 8px)',
    };
  } else if (isSpecialKeyword(v) && v.toLowerCase() !== 'transparent') {
    resolvedStyle = { backgroundColor: v };
  } else {
    resolvedStyle = checkerboardBg(v);
  }
  return (
    <span
      data-slot="color-picker-swatch"
      aria-hidden
      className={cn(
        'inline-block aspect-square size-5 shrink-0 overflow-hidden rounded-control ring-1 ring-color-picker-border',
        className
      )}
      style={{ ...resolvedStyle, ...style }}
      {...rest}
    />
  );
}
