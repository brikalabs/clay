'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';

const toggleVariants = cva(
  "toggle corner-themed inline-flex shrink-0 items-center justify-center rounded-toggle border border-transparent text-sm outline-none transition-all hover:border-toggle-hover-border hover:bg-toggle-hover-container hover:text-toggle-hover-label hover:backdrop-blur-toggle focus-visible:ring-themed disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-toggle-active-border data-[state=on]:bg-toggle-active-container data-[state=on]:text-toggle-active-label data-[state=on]:backdrop-blur-toggle [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border-toggle-outline-border bg-transparent shadow-surface hover:bg-toggle-hover-container hover:text-toggle-hover-label',
      },
      size: {
        default: '',
        sm: 'h-8 px-2 text-xs',
        lg: 'h-10 px-4',
        icon: 'size-toggle-height',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Toggle({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    /** Visual style: `default` (transparent) or `outline` (bordered). */
    variant?: VariantProps<typeof toggleVariants>['variant'];
    /** Size preset: `default`, `sm`, `lg`, or `icon`. */
    size?: VariantProps<typeof toggleVariants>['size'];
  }) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
