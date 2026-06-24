'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Star } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';
import { cssVars } from '../../primitives/cssVars';

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
// useControllableState
// Mirrors the pattern from mini-calendar: uncontrolled by default, yields to
// caller-provided `controlled` value when present.
// ---------------------------------------------------------------------------

function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange: ((value: T) => void) | undefined,
): readonly [T, (next: T) => void] {
  const [uncontrolled, setUncontrolled] = React.useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : uncontrolled;
  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [value, setValue];
}

// ---------------------------------------------------------------------------
// FractionalStar
// Two Star icons absolutely stacked. The empty icon sits underneath; the
// filled icon is clipped to `fill * 100%` width so fractional values render
// without rounding.
// ---------------------------------------------------------------------------

function FractionalStar({ fill }: { fill: number }) {
  const pct = `${Math.max(0, Math.min(1, fill)) * 100}%`;
  return (
    <span data-slot="rating-star" aria-hidden className="relative inline-flex shrink-0">
      <Star className="fill-transparent" style={{ color: 'var(--rating-empty-color)' }} />
      <span className="absolute inset-0 overflow-hidden" style={{ width: pct }}>
        <Star style={{ fill: 'var(--rating-filled-color)', color: 'var(--rating-filled-color)' }} />
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Prop types
// ---------------------------------------------------------------------------

interface RatingBaseProps extends VariantProps<typeof ratingVariants> {
  /** Total star count. Defaults to 5. */
  readonly max?: number;
  /** Extra Tailwind classes appended to the root element. */
  readonly className?: string;
  /** Override the default aria-label. */
  readonly 'aria-label'?: string;
  /**
   * Sets `--rating-filled-color` inline. Accepts any CSS color value.
   * Defaults to the `--warning` token when omitted.
   */
  readonly color?: string;
  /** Force read-only display regardless of other props. */
  readonly readOnly?: boolean;
  /** Disable all interaction while keeping the visual. */
  readonly disabled?: boolean;
}

/** Controlled mode: caller owns state via `value` + `onValueChange`. */
interface RatingControlledProps extends RatingBaseProps {
  readonly value: number;
  readonly defaultValue?: undefined;
  readonly onValueChange?: (value: number) => void;
}

/** Uncontrolled mode: component holds its own state from `defaultValue`. */
interface RatingUncontrolledProps extends RatingBaseProps {
  readonly value?: undefined;
  /** Initial value (uncontrolled). Defaults to 0. */
  readonly defaultValue?: number;
  readonly onValueChange?: (value: number) => void;
}

type RatingProps = RatingControlledProps | RatingUncontrolledProps;

// ---------------------------------------------------------------------------
// Rating
// ---------------------------------------------------------------------------

/**
 * Star rating that works as both a fractional DISPLAY and an interactive INPUT.
 *
 * **Read-only display** (`value` only, no handler / `readOnly` set):
 *   Renders partial stars for non-integer values via a clip technique.
 *   Uses `role="img"` with a computed aria-label.
 *
 * **Interactive input** (`defaultValue` or `onValueChange` provided):
 *   Whole-star selection only. Each star is a focusable `<button>` inside a
 *   `role="radiogroup"`. Hover over star N previews N filled; click commits N.
 *   Arrow keys (Left/Right) move focus between stars and also commit.
 */
const Rating = React.forwardRef<HTMLSpanElement, RatingProps>(function Rating(
  {
    value: controlledValue,
    defaultValue = 0,
    max = 5,
    size = 'default',
    className,
    color,
    onValueChange,
    disabled,
    readOnly,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const isInteractive =
    !readOnly && !disabled && (controlledValue === undefined || onValueChange !== undefined);

  const [committedValue, setCommittedValue] = useControllableState(
    controlledValue,
    defaultValue,
    onValueChange,
  );

  // 1-based index of the star the pointer is over, or null.
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Hover preview overrides committed value in interactive mode.
  const displayValue = isInteractive && hoveredIndex !== null ? hoveredIndex : committedValue;

  const defaultLabel = `Rated ${committedValue} out of ${max}`;

  // Per-star fill fraction derived from displayValue (0..1 each).
  const starFills = Array.from({ length: max }, (_, i) => {
    const starN = i + 1;
    if (displayValue >= starN) return 1;
    if (displayValue <= starN - 1) return 0;
    return displayValue - (starN - 1);
  });

  const colorStyle = color ? cssVars({ 'rating-filled-color': color }) : undefined;

  // ---------------------------------------------------------------------------
  // READ-ONLY display
  // ---------------------------------------------------------------------------
  if (!isInteractive) {
    return (
      <span
        ref={ref}
        data-slot="rating"
        role="img"
        aria-label={ariaLabel ?? defaultLabel}
        className={cn(ratingVariants({ size }), disabled && 'opacity-50', className)}
        style={colorStyle}
      >
        {starFills.map((fill, i) => (
          <FractionalStar key={i} fill={fill} />
        ))}
      </span>
    );
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE input: radiogroup of star buttons
  // Roving tabIndex: the committed star (or star 1 if none) is the tab stop.
  // ---------------------------------------------------------------------------

  // The tab-stop is the committed star; fall back to the first star when value is 0.
  const tabStopIndex = committedValue > 0 ? committedValue : 1;

  function handleStarClick(index: number) {
    setCommittedValue(index);
    setHoveredIndex(null);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      setCommittedValue(Math.min(max, index + 1));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      setCommittedValue(Math.max(1, index - 1));
    }
  }

  return (
    <span
      ref={ref}
      data-slot="rating"
      data-interactive
      role="radiogroup"
      aria-label={ariaLabel ?? defaultLabel}
      className={cn(ratingVariants({ size }), 'w-fit', className)}
      style={colorStyle}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        return (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={committedValue === index}
            aria-label={`${index} out of ${max}`}
            tabIndex={index === tabStopIndex ? 0 : -1}
            className="relative inline-flex shrink-0 cursor-pointer touch-none select-none rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => handleStarClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <FractionalStar fill={starFills[i] ?? 0} />
          </button>
        );
      })}
    </span>
  );
});

export { Rating, ratingVariants };
