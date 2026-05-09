import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';

const badgeVariants = cva(
  'badge corner-themed inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-badge border border-transparent text-xs transition-[color,box-shadow] focus-visible:border-badge-focus-border focus-visible:ring-[3px] focus-visible:ring-badge-focus-ring/50 aria-invalid:border-badge-invalid-border aria-invalid:ring-badge-invalid-ring/20 dark:aria-invalid:ring-badge-invalid-ring/40 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'bg-badge-filled-container text-badge-filled-label [a&]:hover:bg-badge-filled-container/90',
        secondary:
          'bg-badge-secondary-container text-badge-secondary-label [a&]:hover:bg-badge-secondary-container/90',
        destructive:
          'bg-badge-destructive-container text-badge-destructive-label focus-visible:ring-badge-destructive-focus/20 dark:bg-badge-destructive-container/60 dark:focus-visible:ring-badge-destructive-focus/40 [a&]:hover:bg-badge-destructive-container/90',
        outline:
          'border-badge-outline-border text-badge-outline-label [a&]:hover:bg-badge-ghost-hover-container [a&]:hover:text-badge-ghost-hover-label',
        ghost:
          '[a&]:hover:bg-badge-ghost-hover-container [a&]:hover:text-badge-ghost-hover-label',
        link: 'text-badge-link-color underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    /** Visual treatment matching the Button variants (default, secondary, destructive, outline, etc.). */
    variant?: VariantProps<typeof badgeVariants>['variant'];
  }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(
        badgeVariants({
          variant,
        }),
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
