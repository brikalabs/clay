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
// caller-provided `controlled` value when present. The setter always fires
// `onChange` so consumers can observe without owning state.
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
      if (!isControlled) {
        setUncontrolled(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [value, setValue];
}

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
}: {
  fill: number;
  interactive: boolean;
}) {
  const pct = `${Math.max(0, Math.min(1, fill)) * 100}%`;
  return (
    <span
      data-slot="rating-star"
      aria-hidden
      className={cn(
        'relative inline-flex shrink-0',
        interactive && 'transition-transform active:scale-90',
      )}
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
  /** Total star count. Defaults to 5. */
  readonly max?: number;
  /** Extra Tailwind classes appended to the root element. */
  readonly className?: string;
  /** Override the default aria-label ("Rated {value} out of {max}"). */
  readonly 'aria-label'?: string;
  /**
   * Shortcut to set the filled-star color without a CSS override. Accepts any
   * CSS color value (`"var(--primary)"`, `"#f00"`, `"oklch(60% 0.2 30)"`, etc.).
   * Sets `--rating-filled-color` inline on the root element; the token default
   * (`--warning`) still applies when this prop is omitted.
   */
  readonly color?: string;
  /**
   * Minimum increment for clicks, pointer moves, and keyboard steps.
   * Defaults to 1 (whole-star steps). Use 0.5 for half-star input, 0.25 for
   * quarter-star. Only meaningful in interactive mode.
   */
  readonly step?: number;
  /**
   * Force read-only display regardless of other props. Useful when you want to
   * pass a static `value` without accidentally enabling interaction.
   */
  readonly readOnly?: boolean;
  /** Disable all interaction while keeping the visual. Interactive mode only. */
  readonly disabled?: boolean;
}

/**
 * Controlled mode: the caller owns state via `value` + `onValueChange`.
 * The component is interactive when `onValueChange` is provided (unless
 * `readOnly` or `disabled` is set).
 */
interface RatingControlledProps extends RatingBaseProps {
  /** Current rating value (controlled). */
  readonly value: number;
  readonly defaultValue?: undefined;
  /**
   * Called with the new value when the user clicks or uses keyboard controls.
   * Providing this prop makes the component interactive.
   */
  readonly onValueChange?: (value: number) => void;
}

/**
 * Uncontrolled mode: the component holds its own state starting from
 * `defaultValue`. Always interactive (unless `readOnly` or `disabled`).
 */
interface RatingUncontrolledProps extends RatingBaseProps {
  readonly value?: undefined;
  /** Initial rating value on first render (uncontrolled). Defaults to 0. */
  readonly defaultValue?: number;
  /** Called with the new value whenever the user changes the rating. */
  readonly onValueChange?: (value: number) => void;
}

type RatingProps = RatingControlledProps | RatingUncontrolledProps;

// ---------------------------------------------------------------------------
// Rating
// ---------------------------------------------------------------------------

/**
 * Star rating that works as both a fractional DISPLAY and an interactive INPUT.
 *
 * **Read-only display** (`value` only, no `onValueChange`/`defaultValue`):
 *   Renders partial stars for non-integer values (3.75 fills the fourth star
 *   75%). Uses `role="img"` with a computed `aria-label` such as
 *   "Rated 3.75 out of 5". No rounding applied. Also forced by `readOnly`.
 *
 * **Uncontrolled input** (`defaultValue` or `onValueChange` provided):
 *   The component holds its own state. `defaultValue` sets the initial value
 *   (defaults to 0). `onValueChange` fires on every change for observation.
 *   `<Rating defaultValue={3.5} step={0.5} onValueChange={console.log} />`
 *
 * **Controlled input** (`value` + `onValueChange`):
 *   Caller owns state. `onValueChange` must update `value` for the UI to reflect
 *   changes. `<Rating value={v} onValueChange={setV} step={0.5} />`
 *
 * **Pointer interaction** (interactive modes):
 *   Moving the pointer over the star row computes the value from the cursor's
 *   horizontal position across the whole row (which star + fraction within it),
 *   snapped to `step`. The partial-fill rendering follows the cursor as a live
 *   preview. Click commits the previewed value.
 *
 * **Keyboard** (role=slider):
 *   ArrowRight/Up += step, ArrowLeft/Down -= step, Home = step (min), End = max.
 *
 * `disabled` renders the visual without any interaction, with reduced opacity.
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
    step = 1,
    readOnly,
    'aria-label': ariaLabel,
  },
  ref,
) {
  // Mode decision:
  // - Providing `defaultValue` (even 0 explicitly) or `onValueChange` with no
  //   `value` signals uncontrolled-interactive intent.
  // - Providing `value` + `onValueChange` is controlled-interactive.
  // - Providing only `value` (no `onValueChange`, no `defaultValue`) is
  //   read-only display.
  // - `readOnly` overrides everything to display.
  const isUncontrolled = controlledValue === undefined;
  const isInteractiveIntent =
    !readOnly &&
    !disabled &&
    (isUncontrolled || onValueChange !== undefined);

  const [committedValue, setCommittedValue] = useControllableState(
    controlledValue,
    defaultValue,
    onValueChange,
  );

  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const rowRef = React.useRef<HTMLSpanElement | null>(null);

  const isInteractive = isInteractiveIntent;

  // Hover preview takes over the displayed value in interactive mode.
  const displayValue = isInteractive && hoverValue !== null ? hoverValue : committedValue;

  // Snap `raw` to the nearest step within [step, max].
  function snap(raw: number): number {
    const snapped = Math.round(raw / step) * step;
    // Clamp to [step, max] so 0 is never a valid click target.
    return Math.max(step, Math.min(max, snapped));
  }

  /**
   * Compute the snapped value from a pointer event over the row.
   *
   * Algorithm:
   * 1. Measure the bounding rect of the row element.
   * 2. Compute `relativeX = clientX - rect.left`, clamped to [0, rect.width].
   * 3. `rawValue = (relativeX / rect.width) * max` gives a float in [0, max].
   * 4. `snap(rawValue)` rounds to the nearest `step` and clamps to [step, max].
   *
   * This means for step=0.5 on a 5-star row, moving the cursor to the midpoint
   * of the third star gives rawValue ≈ 2.5, snapped to 2.5 exactly.
   */
  function valueFromPointer(clientX: number): number {
    const row = rowRef.current;
    if (!row) return snap(max);
    const rect = row.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const raw = (relativeX / rect.width) * max;
    return snap(raw);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLSpanElement>) {
    if (!isInteractive) return;
    setHoverValue(valueFromPointer(event.clientX));
  }

  function handlePointerLeave() {
    if (!isInteractive) return;
    setHoverValue(null);
  }

  function handleClick(event: React.MouseEvent<HTMLSpanElement>) {
    if (!isInteractive) return;
    const clicked = valueFromPointer(event.clientX);
    setCommittedValue(clicked);
    // Clear hover so the committed value drives display immediately.
    setHoverValue(null);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    if (!isInteractive) return;
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(max, committedValue + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(step, committedValue - step);
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
    setCommittedValue(snap(next));
  }

  const defaultLabel = `Rated ${committedValue} out of ${max}`;

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
        'aria-valuenow': committedValue,
        'aria-label': ariaLabel ?? defaultLabel,
        onPointerMove: handlePointerMove,
        onPointerLeave: handlePointerLeave,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
      }
    : {
        role: 'img',
        'aria-label': ariaLabel ?? defaultLabel,
      };

  return (
    <span
      ref={(node) => {
        rowRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
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
      style={color ? cssVars({ 'rating-filled-color': color }) : undefined}
      {...interactiveRootProps}
    >
      {starFills.map((fill, index) => (
        <FractionalStar
          key={index}
          fill={fill}
          interactive={isInteractive}
        />
      ))}
    </span>
  );
});

export { Rating, ratingVariants };
