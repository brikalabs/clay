import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';

const buttonVariants = cva(
  "button corner-themed inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-button text-sm outline-none transition-all focus-visible:ring-themed disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-button-filled-container text-button-filled-label hover:bg-button-filled-container/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline:
          'border-button-outline-border bg-background text-button-outline-label shadow-button hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'has-[>svg]:px-3',
        // `size-N` loses to the `button` bundle's `height` because the
        // bundle sorts AFTER size-* in Tailwind v4's utilities layer,
        // use `h-N w-N` for icon variants and `py-0` everywhere fixed-
        // height variants want to defeat the bundle's `padding-block`.
        xs: "h-6 gap-1 rounded-button px-2 py-0 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1.5 rounded-button px-3 py-0 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-button px-6 py-0 has-[>svg]:px-4',
        icon: 'h-9 w-9 px-0 py-0',
        'icon-xs': "h-6 w-6 rounded-button px-0 py-0 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'h-8 w-8 px-0 py-0',
        'icon-lg': 'h-10 w-10 px-0 py-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Emphasis tier for the button. */
    variant?: VariantProps<typeof buttonVariants>['variant'];
    /** Text or icon-only sizing preset. */
    size?: VariantProps<typeof buttonVariants>['size'];
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
