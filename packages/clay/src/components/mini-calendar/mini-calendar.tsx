'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';
import { Button } from '../button/button';

// ─── Date helpers (local-time, calendar-day granularity) ──────────────────

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Minimal controllable-state hook: controlled when `controlled` is defined, else internal. */
function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T
): readonly [T, (next: T) => void] {
  const [uncontrolled, setUncontrolled] = React.useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : uncontrolled;
  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
    },
    [isControlled]
  );
  return [value, setValue];
}

interface DateFormatters {
  /** Short weekday name, localized (e.g. "Mon", "lun."). */
  readonly weekday: Intl.DateTimeFormat;
  /** Day-of-month number, localized (e.g. "8", "٨"). */
  readonly day: Intl.DateTimeFormat;
  /** Full date for the accessible label (e.g. "Monday, June 8, 2026"). */
  readonly full: Intl.DateTimeFormat;
}

interface MiniCalendarContextValue {
  readonly selected: Date | undefined;
  readonly onSelect: (date: Date) => void;
  readonly startDate: Date;
  readonly days: number;
  readonly shift: (direction: 'prev' | 'next') => void;
  readonly formatters: DateFormatters;
}

const MiniCalendarContext = React.createContext<MiniCalendarContextValue | null>(null);

function useMiniCalendar(): MiniCalendarContextValue {
  const ctx = React.use(MiniCalendarContext);
  if (!ctx) {
    throw new Error('MiniCalendar subcomponents must be rendered inside <MiniCalendar>.');
  }
  return ctx;
}

interface MiniCalendarProps
  extends Omit<React.ComponentProps<'fieldset'>, 'onChange' | 'defaultValue'> {
  /** Selected date (controlled). Pair with `onValueChange`. */
  readonly value?: Date;
  /** Selected date on first render (uncontrolled). */
  readonly defaultValue?: Date;
  /** Fires with the newly selected date. */
  readonly onValueChange?: (date: Date) => void;
  /** Left-most visible date (controlled). Pair with `onStartDateChange`. */
  readonly startDate?: Date;
  /** Left-most visible date on first render (uncontrolled). */
  readonly defaultStartDate?: Date;
  /** Fires with the new range start when the user navigates. */
  readonly onStartDateChange?: (date: Date) => void;
  /** Number of days shown at once. Defaults to `5`. */
  readonly days?: number;
  /**
   * BCP 47 locale(s) used to format the weekday, day number, and accessible
   * label via `Intl.DateTimeFormat`. Defaults to the runtime's locale.
   */
  readonly locale?: Intl.LocalesArgument;
}

function MiniCalendar({
  value,
  defaultValue,
  onValueChange,
  startDate,
  defaultStartDate,
  onStartDateChange,
  days = 5,
  locale,
  className,
  children,
  ...props
}: Readonly<MiniCalendarProps>) {
  const [selected, setSelected] = useControllableState<Date | undefined>(value, defaultValue);
  const [defaultStart] = React.useState(() =>
    startOfDay(defaultStartDate ?? defaultValue ?? value ?? new Date())
  );
  const [start, setStart] = useControllableState<Date>(startDate, defaultStart);

  const onSelect = React.useCallback(
    (date: Date) => {
      setSelected(date);
      onValueChange?.(date);
    },
    [setSelected, onValueChange]
  );

  const shift = React.useCallback(
    (direction: 'prev' | 'next') => {
      const next = addDays(start, direction === 'next' ? days : -days);
      setStart(next);
      onStartDateChange?.(next);
    },
    [start, days, setStart, onStartDateChange]
  );

  const formatters = React.useMemo<DateFormatters>(
    () => ({
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
      day: new Intl.DateTimeFormat(locale, { day: 'numeric' }),
      full: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }),
    [locale]
  );

  const ctx = React.useMemo<MiniCalendarContextValue>(
    () => ({ selected, onSelect, startDate: start, days, shift, formatters }),
    [selected, onSelect, start, days, shift, formatters]
  );

  return (
    <MiniCalendarContext value={ctx}>
      {/* A <fieldset> carries an implicit role="group" for this set of day controls. */}
      <fieldset
        aria-label={props['aria-label'] ?? 'Mini calendar'}
        data-slot="mini-calendar"
        className={cn('m-0 inline-flex min-w-0 items-center gap-1 border-0 p-0', className)}
        {...props}
      >
        {children}
      </fieldset>
    </MiniCalendarContext>
  );
}

interface MiniCalendarNavigationProps extends React.ComponentProps<typeof Button> {
  /** Which way the strip moves when pressed. */
  readonly direction: 'prev' | 'next';
}

function MiniCalendarNavigation({
  direction,
  className,
  onClick,
  ...props
}: Readonly<MiniCalendarNavigationProps>) {
  const { shift } = useMiniCalendar();
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      data-slot="mini-calendar-nav"
      aria-label={direction === 'prev' ? 'Previous days' : 'Next days'}
      className={cn('shrink-0', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          shift(direction);
        }
      }}
      {...props}
    >
      <Icon aria-hidden />
    </Button>
  );
}

interface MiniCalendarDaysProps {
  /** Render prop invoked once per visible day. */
  readonly children: (date: Date) => React.ReactNode;
  readonly className?: string;
}

function MiniCalendarDays({ children, className }: Readonly<MiniCalendarDaysProps>) {
  const { startDate, days } = useMiniCalendar();
  const dates = Array.from({ length: days }, (_, index) => addDays(startDate, index));
  return (
    <div data-slot="mini-calendar-days" className={cn('flex items-center gap-1', className)}>
      {dates.map((date) => (
        <React.Fragment key={date.toISOString()}>{children(date)}</React.Fragment>
      ))}
    </div>
  );
}

interface MiniCalendarDayProps extends Omit<React.ComponentProps<'button'>, 'value'> {
  /** The date this cell represents. */
  readonly date: Date;
}

function MiniCalendarDay({ date, className, onClick, ...props }: Readonly<MiniCalendarDayProps>) {
  const { selected, onSelect, formatters } = useMiniCalendar();
  const isSelected = selected ? isSameDay(date, selected) : false;
  return (
    <button
      type="button"
      data-slot="mini-calendar-day"
      data-selected={isSelected || undefined}
      aria-pressed={isSelected}
      aria-label={formatters.full.format(date)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onSelect(date);
        }
      }}
      className={cn(
        'mini-calendar corner-themed flex min-w-12 flex-col items-center gap-0.5 rounded-mini-calendar px-2.5 py-1.5 outline-none transition-colors focus-visible:ring-themed',
        isSelected
          ? 'bg-mini-calendar-day-selected text-mini-calendar-day-selected-label'
          : 'hover:bg-mini-calendar-day-hover',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'font-medium text-[0.625rem] uppercase tracking-wide',
          isSelected ? 'text-mini-calendar-day-selected-label/80' : 'text-mini-calendar-weekday'
        )}
      >
        {formatters.weekday.format(date)}
      </span>
      <span className={cn('font-medium text-sm tabular-nums', !isSelected && 'text-mini-calendar-day-label')}>
        {formatters.day.format(date)}
      </span>
    </button>
  );
}

export { MiniCalendar, MiniCalendarDay, MiniCalendarDays, MiniCalendarNavigation };
