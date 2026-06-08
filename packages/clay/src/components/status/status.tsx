'use client';

import * as React from 'react';

import { cn } from '../../primitives/cn';

/** Semantic color tone of the indicator dot — maps to Clay's feedback roles. */
type StatusVariant = 'neutral' | 'success' | 'info' | 'warning' | 'destructive';

interface StatusProps extends React.ComponentProps<'span'> {
  /** Color tone of the indicator. Defaults to `neutral`. */
  readonly variant?: StatusVariant;
}

function Status({ variant = 'neutral', className, ...props }: StatusProps) {
  return (
    <span
      data-slot="status"
      data-variant={variant}
      className={cn(
        'group/status inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground text-xs',
        className
      )}
      {...props}
    />
  );
}

interface StatusIndicatorProps extends React.ComponentProps<'span'> {
  /** Render the soft pulsing ring behind the dot. Defaults to `true`. */
  readonly pulse?: boolean;
}

function StatusIndicator({ pulse = true, className, ...props }: StatusIndicatorProps) {
  // Tone follows the parent <Status variant>: the wrapper carries the color as
  // `currentColor`, and both dots paint with `bg-current`.
  return (
    <span
      data-slot="status-indicator"
      aria-hidden
      className={cn(
        'relative flex size-2 shrink-0 text-muted-foreground group-data-[variant=destructive]/status:text-destructive group-data-[variant=info]/status:text-info group-data-[variant=success]/status:text-success group-data-[variant=warning]/status:text-warning',
        className
      )}
      {...props}
    >
      {pulse ? (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
      ) : null}
      <span className="relative inline-flex size-2 rounded-full bg-current" />
    </span>
  );
}

function StatusLabel({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot="status-label" className={cn(className)} {...props} />;
}

export { Status, StatusIndicator, StatusLabel };
export type { StatusVariant };
