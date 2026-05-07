import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';

const alertVariants = cva(
  'corner-themed relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-alert border px-4 py-3 text-sm backdrop-blur-[var(--alert-backdrop-blur)] has-[>[data-slot=alert-icon]]:grid-cols-[1rem_1fr] has-[>[data-slot=alert-icon],>[data-slot=alert-close]]:gap-x-3',
  {
    variants: {
      variant: {
        default: 'border-border bg-background text-foreground',
        destructive:
          'bg-[color-mix(in_oklch,var(--destructive)_var(--alert-tint-bg-amount),var(--alert-tint-base))] border-[color-mix(in_oklch,var(--destructive)_var(--alert-tint-border-amount),var(--alert-tint-base))] text-foreground [--alert-accent:var(--destructive)]',
        info: 'bg-[color-mix(in_oklch,var(--data-1)_var(--alert-tint-bg-amount),var(--alert-tint-base))] border-[color-mix(in_oklch,var(--data-1)_var(--alert-tint-border-amount),var(--alert-tint-base))] text-foreground [--alert-accent:var(--data-1)]',
        warning:
          'bg-[color-mix(in_oklch,var(--data-2)_var(--alert-tint-bg-amount),var(--alert-tint-base))] border-[color-mix(in_oklch,var(--data-2)_var(--alert-tint-border-amount),var(--alert-tint-base))] text-foreground [--alert-accent:var(--data-2)]',
        success:
          'bg-[color-mix(in_oklch,var(--data-3)_var(--alert-tint-bg-amount),var(--alert-tint-base))] border-[color-mix(in_oklch,var(--data-3)_var(--alert-tint-border-amount),var(--alert-tint-base))] text-foreground [--alert-accent:var(--data-3)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface AlertProps extends React.ComponentProps<'div'>, VariantProps<typeof alertVariants> {
  /** Visual treatment: `default` (quiet), `destructive` (error tint), `info` / `warning` / `success` (semantic data colors). */
  variant?: VariantProps<typeof alertVariants>['variant'];
  /** Additional Tailwind / utility classes merged on top of the variant classes. */
  className?: string;
}

/**
 * Banner-style callout for messages, errors, and notices. Composes with
 * `AlertTitle`, `AlertDescription`, and optional `AlertIcon` slots. The
 * root carries `role="alert"` so assistive tech announces it on mount.
 */
function Alert({ className, variant = 'default', ...props }: Readonly<AlertProps>) {
  return (
    <div
      role="alert"
      data-slot="alert"
      data-variant={variant}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

interface AlertTitleProps extends React.ComponentProps<'div'> {
  /** Additional classes merged onto the title row. */
  className?: string;
}

/**
 * Headline row for an `Alert`. Rendered as a `<div>` styled like an h5,
 * with a stronger color when used inside a `destructive` alert.
 */
function AlertTitle({ className, ...props }: Readonly<AlertTitleProps>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        'group-data-[variant=destructive]/alert:text-destructive',
        className
      )}
      {...props}
    />
  );
}

interface AlertDescriptionProps extends React.ComponentProps<'div'> {
  /** Additional classes merged onto the description block. */
  className?: string;
}

/**
 * Body copy for an `Alert`. Uses muted-foreground by default so the title
 * stays the visual anchor.
 */
function AlertDescription({ className, ...props }: Readonly<AlertDescriptionProps>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  );
}

interface AlertIconProps extends React.ComponentProps<'div'> {
  /** Additional classes merged onto the icon slot. */
  className?: string;
}

/**
 * Optional icon slot, laid out at the start of the alert row. Pass any
 * SVG or lucide icon as the child; size defaults to 1rem square. The
 * glyph picks up the variant's `--alert-accent` color so it reads as a
 * semantic flag, falling back to the inherited text color on the
 * default (untinted) variant.
 */
function AlertIcon({ className, ...props }: Readonly<AlertIconProps>) {
  return (
    <div
      data-slot="alert-icon"
      aria-hidden="true"
      className={cn(
        'col-start-1 row-start-1 flex size-4 shrink-0 items-center justify-center self-start text-[var(--alert-accent,currentColor)] [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-px',
        className
      )}
      {...props}
    />
  );
}

interface AlertCloseProps extends React.ComponentProps<'button'> {
  /** Additional classes merged onto the close button. */
  className?: string;
}

/**
 * Trailing dismiss button for an `Alert`. Lives in the third grid column
 * so it sits at the top-right without the parent needing extra padding
 * or `relative` positioning. Defaults to a lucide `X` icon; pass a child
 * to override. The caller owns visibility, wire `onClick` to whatever
 * state controls whether the alert renders.
 */
function AlertClose({ children, className, ...props }: Readonly<AlertCloseProps>) {
  return (
    <button
      type="button"
      data-slot="alert-close"
      aria-label="Dismiss"
      className={cn(
        'col-start-3 row-start-1 flex size-5 shrink-0 items-center justify-center self-start rounded text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
        className
      )}
      {...props}
    >
      {children ?? <X aria-hidden className="size-4" />}
    </button>
  );
}

export { Alert, AlertClose, AlertDescription, AlertIcon, AlertTitle, alertVariants };
