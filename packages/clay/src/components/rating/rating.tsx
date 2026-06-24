import { cva, type VariantProps } from 'class-variance-authority';
import { Star } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';

const ratingVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'gap-px [&>svg]:size-3',
      default: 'gap-px [&>svg]:size-3.5',
      lg: 'gap-0.5 [&>svg]:size-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Five-star rating display. Stars up to the rounded value are filled;
 * stars above it are shown as faint outlines.
 *
 * The star row is `aria-hidden` by default. Pair it with a
 * visually-hidden text node to expose the value to screen readers.
 */
function Rating({
  value,
  max = 5,
  size = 'default',
  className,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof ratingVariants> & {
    /** Numeric rating. Rounds to the nearest integer to determine filled stars. */
    readonly value: number;
    /** Total star count. Defaults to 5. */
    readonly max?: number;
  }) {
  const filled = Math.round(Math.max(0, Math.min(value, max)));

  return (
    <span
      data-slot="rating"
      aria-hidden="true"
      className={cn(ratingVariants({ size }), className)}
      {...props}
    >
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          className={cn(
            index < filled
              ? 'fill-rating-filled-color text-rating-filled-color'
              : 'fill-transparent text-rating-empty-color'
          )}
        />
      ))}
    </span>
  );
}

export { Rating, ratingVariants };
