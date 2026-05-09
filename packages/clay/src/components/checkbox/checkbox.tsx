'use client';

import { Check, Minus } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';

/**
 * Binary toggle built on Radix's `Checkbox` primitive. Supports controlled
 * usage (`checked` + `onCheckedChange`) and uncontrolled usage
 * (`defaultChecked`). Pass `checked="indeterminate"` to render the dash
 * glyph instead of the check mark.
 *
 * Sizing reads `--checkbox-size` at the default size and overrides via
 * `data-size`. The 1px resting border consumes `--checkbox-border-width`
 * so themes can thicken it without leaking into siblings.
 */
function Checkbox({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  /**
   * Preset edge length for the box.
   * - `sm`, `size-3.5`
   * - `default`, `size-4`
   * - `lg`, `size-5`
   */
  size?: 'sm' | 'default' | 'lg';
  /** Additional Tailwind / utility classes merged with the base recipe. */
  className?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size}
      className={cn(
        'checkbox peer corner-themed inline-flex shrink-0 items-center justify-center rounded-checkbox border-checkbox-unchecked-border bg-checkbox-unchecked-container shadow-surface outline-none transition-[color,background-color,border-color,box-shadow] focus-visible:ring-themed disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-checkbox-invalid-border aria-invalid:ring-checkbox-invalid-ring/20 data-[size=default]:size-checkbox-size data-[size=lg]:size-5 data-[size=sm]:size-3.5 data-[state=checked]:border-checkbox-checked-border data-[state=indeterminate]:border-checkbox-checked-border data-[state=checked]:bg-checkbox-checked-container data-[state=indeterminate]:bg-checkbox-checked-container data-[state=checked]:text-checkbox-checked-glyph data-[state=indeterminate]:text-checkbox-checked-glyph dark:aria-invalid:ring-checkbox-invalid-ring/40',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current [&>svg]:size-[80%] [&>svg]:shrink-0"
      >
        {props.checked === 'indeterminate' ? <Minus strokeWidth={3} /> : <Check strokeWidth={3} />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
