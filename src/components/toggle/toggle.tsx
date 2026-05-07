'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';

const toggleVariants = cva(
  "toggle corner-themed inline-flex shrink-0 items-center justify-center rounded-toggle border border-transparent text-sm outline-none transition-all hover:border-border hover:bg-muted hover:text-muted-foreground hover:backdrop-blur-[var(--toggle-backdrop-blur)] focus-visible:ring-themed disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-border data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:backdrop-blur-[var(--toggle-backdrop-blur)] [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border-input bg-transparent shadow-surface hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: '',
        sm: 'h-8 px-2 text-xs',
        lg: 'h-10 px-4',
        icon: 'size-(--toggle-height)',
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
