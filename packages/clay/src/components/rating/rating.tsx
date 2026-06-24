'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Star } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';

const ratingVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'gap-px [&_svg]:size-[var(--rating-star-size-sm)]',
      default: 'gap-px [&_svg]:size-[var(--rating-star-size)]',
      lg: 'gap-0.5 [&_svg]:size-[var(--rating-star-size-lg)]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

// ---------------------------------------------------------------------------
// FractionalStar
// ---------------------------------------------------------------------------

/**
 * Renders one star with `fill` fraction (0..1) of it filled.
 *
 * Technique: two Star icons are absolutely stacked. The empty-color icon
 * sits on the bottom. The filled-color icon is placed inside an
 * overflow-hidden wrapper whose width is set to `fill * 100%`, clipping
 * the filled layer to exactly that fraction without rounding.
 */
function FractionalStar({
  fill,
  interactive,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  fill: number;
  interactive: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const pct = `${Math.max(0, Math.min(1, fill)) * 100}%`;
  return (
    <span
      data-slot="rating-star"
      aria-hidden
      className={cn(
        'relative inline-flex shrink-0',
        interactive && 'cursor-pointer transition-transform active:scale-90',
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Empty star: always full-width underneath */}
      <Star
        className="fill-transparent"
        style={{ color: 'var(--rating-empty-color)' }}
      />
      {/* Filled star: clipped by percentage width */}
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: pct }}
      >
        <Star
          style={{ fill: 'var(--rating-filled-color)', color: 'var(--rating-filled-color)' }}
        />
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Rating prop types
// ---------------------------------------------------------------------------

interface RatingBaseProps extends VariantProps<typeof ratingVariants> {
  /** Numeric rating. Fractional values (e.g. 3.75) render partial stars with no rounding. */
  readonly value: number;
  /** Total star count. Defaults to 5. */
  readonly max?: number;
  /** Extra Tailwind classes appended to the root element. */
  readonly className?: string;
  /** Override the default aria-label ("Rated {value} out of {max}"). */
  readonly 'aria-label'?: string;
}

/** Display mode: no `onValueChange`, fully read-only. */
interface RatingDisplayProps extends RatingBaseProps {
  readonly onValueChange?: undefined;
  readonly disabled?: undefined;
  readonly step?: undefined;
}

/**
 * Interactive input mode: clicking a star commits that integer (or
 * step-snapped) value via `onValueChange`.
 */
interface RatingInputProps extends RatingBaseProps {
  /**
   * Called with the new value when the user clicks a star or uses
   * keyboard controls. Providing this prop switches the component from
   * display to input mode.
   */
  readonly onValueChange: (value: number) => void;
  /** Disable all interaction while keeping the visual. */
  readonly disabled?: boolean;
  /**
   * Minimum increment for clicks and keyboard steps. Defaults to 1
   * (whole-star steps). Use 0.5 for half-star input.
   */
  readonly step?: number;
}

type RatingProps = RatingDisplayProps | RatingInputProps;

// ---------------------------------------------------------------------------
// Rating
// ---------------------------------------------------------------------------

/**
 * Star rating that works as both a fractional DISPLAY and an interactive INPUT.
 *
 * **Display mode** (omit `onValueChange`):
 *   Renders partial stars for non-integer values (3.75 fills the fourth star
 *   75%). Uses `role="img"` with a computed `aria-label` such as
 *   "Rated 3.75 out of 5". No rounding applied.
 *
 * **Interactive input mode** (provide `onValueChange`):
 *   Uses `role="slider"` with `aria-valuemin/max/now`. Click a star to commit
 *   that value; hover shows a live preview. Keyboard: ArrowRight/Up adds one
 *   step, ArrowLeft/Down subtracts one step, Home sets the minimum, End sets
 *   the maximum. The `step` prop (default 1) controls the click and keyboard
 *   increment; set `step={0.5}` for half-star input.
 *
 *   `disabled` renders the visual without any interaction, with reduced opacity.
 */
const Rating = React.forwardRef<HTMLSpanElement, RatingProps>(function Rating(
  {
    value,
    max = 5,
    size = 'default',
    className,
    onValueChange,
    disabled,
    step = 1,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const isInteractive = onValueChange !== undefined && disabled !== true;
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  // Hover preview takes over the displayed value in interactive mode.
  const displayValue = isInteractive && hoverValue !== null ? hoverValue : value;

  // Snap `raw` to the nearest step within [step, max].
  function snap(raw: number): number {
    return Math.max(step, Math.min(max, Math.round(raw / step) * step));
  }

  function handleStarClick(starIndex: number) {
    if (!isInteractive) return;
    onValueChange(snap(starIndex));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    if (!isInteractive) return;
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(max, value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(step, value - step);
        break;
      case 'Home':
        next = step;
        break;
      case 'End':
        next = max;
        break;
      default:
        return;
    }
    event.preventDefault();
    onValueChange(snap(next));
  }

  const defaultLabel = `Rated ${value} out of ${max}`;

  // Per-star fill fraction derived from displayValue.
  const starFills = Array.from({ length: max }, (_, i) => {
    const starN = i + 1;
    if (displayValue >= starN) return 1;
    if (displayValue <= starN - 1) return 0;
    return displayValue - (starN - 1);
  });

  const interactiveRootProps: React.ComponentProps<'span'> = isInteractive
    ? {
        role: 'slider',
        tabIndex: 0,
        'aria-valuemin': 0,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-label': ariaLabel ?? defaultLabel,
        onKeyDown: handleKeyDown,
        onMouseLeave: () => setHoverValue(null),
      }
    : {
        role: 'img',
        'aria-label': ariaLabel ?? defaultLabel,
      };

  return (
    <span
      ref={ref}
      data-slot="rating"
      data-interactive={isInteractive || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        ratingVariants({ size }),
        isInteractive &&
          'cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      {...interactiveRootProps}
    >
      {starFills.map((fill, index) => (
        <FractionalStar
          key={index}
          fill={fill}
          interactive={isInteractive}
          onClick={() => handleStarClick(index + 1)}
          onMouseEnter={() => isInteractive && setHoverValue(snap(index + 1))}
        />
      ))}
    </span>
  );
});

export { Rating, ratingVariants };
