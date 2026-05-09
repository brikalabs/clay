import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';

const spinnerVariants = cva('shrink-0 animate-spin text-spinner-color', {
  variants: {
    size: {
      sm: 'size-3.5',
      default: 'size-spinner-size',
      lg: 'size-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/** Concrete size values accepted by {@link Spinner}. */
export type SpinnerSize = NonNullable<VariantProps<typeof spinnerVariants>['size']>;

export interface SpinnerProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
  /**
   * Visual size of the spinner. Maps to Tailwind `size-*` utilities
   * (`sm` → 0.875rem, `default` → `--spinner-size` (1rem), `lg` →
   * 1.25rem). Defaults to `'default'`.
   */
  size?: SpinnerSize;
  /**
   * Optional accessible label announcing the loading state. When
   * provided, the spinner is wrapped in an `<output>` element with an
   * sr-only label so assistive tech announces it. When omitted, the
   * spinner is treated as decorative and marked `aria-hidden`.
   */
  label?: string;
  /**
   * Extra class names merged onto the rendered SVG. Use this to
   * override defaults or compose layout utilities, Clay merges with
   * `tailwind-merge` so the caller's classes win on conflict.
   */
  className?: string;
}

/**
 * Inline loading spinner built on top of `lucide-react`'s `Loader2Icon`
 * with Tailwind's `animate-spin` keyframes. Inherits the surrounding
 * text color via the `--spinner-color` slot (`currentColor` by
 * default), so themes can pin a specific accent or let the spinner
 * track the local text tone.
 *
 * Decorative by default, when no `label` is provided the icon is
 * marked `aria-hidden="true"`. Pass a `label` to render an `<output>`
 * wrapper with an sr-only string for screen readers.
 */
function Spinner({
  size = 'default',
  label,
  className,
  ...props
}: Readonly<SpinnerProps>) {
  if (label !== undefined) {
    return (
      <output data-slot="spinner" className="inline-flex items-center">
        <Loader2Icon
          aria-hidden="true"
          className={cn(spinnerVariants({ size }), className)}
          {...props}
        />
        <span className="sr-only">{label}</span>
      </output>
    );
  }

  return (
    <Loader2Icon
      data-slot="spinner"
      aria-hidden="true"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
