/**
 * DatePicker, a Button trigger + Popover-anchored Calendar.
 *
 * Composes Clay's `Popover` (Radix) and `Calendar` (react-day-picker) into
 * a single component so consumers get a controlled API and consistent
 * trigger styling without wiring the open state themselves.
 *
 *   <DatePicker value={date} onValueChange={setDate} />
 *   <DateRangePicker value={range} onValueChange={setRange} />
 */

'use client';

import { format, isSameDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { cn } from '../../primitives/cn';
import { Button } from '../button';
import { Calendar } from '../calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

const DEFAULT_FORMAT = 'PPP';

type DatePickerProps = {
  /** Controlled selected date. Pair with `onValueChange`. */
  value?: Date;
  /** Initial date for uncontrolled mode. */
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
  placeholder?: string;
  /** date-fns format string applied to the trigger label. Defaults to `PPP`. */
  formatStr?: string;
  /** Controlled open state for the popover. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
};

function DatePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = 'Pick a date',
  formatStr = DEFAULT_FORMAT,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled,
  className,
  id,
  'aria-label': ariaLabel,
}: Readonly<DatePickerProps>) {
  const isOpenControlled = openProp !== undefined;
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = isOpenControlled ? openProp : openState;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setOpenState(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange]
  );

  const isValueControlled = valueProp !== undefined;
  const [valueState, setValueState] = React.useState<Date | undefined>(defaultValue);
  const value = isValueControlled ? valueProp : valueState;

  const handleSelect = React.useCallback(
    (next: Date | undefined) => {
      if (!isValueControlled) setValueState(next);
      onValueChange?.(next);
      if (next) setOpen(false);
    },
    [isValueControlled, onValueChange, setOpen]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-picker-trigger"
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !value && 'text-date-picker-trigger-placeholder-color',
            className
          )}
        >
          <CalendarIcon className="text-date-picker-trigger-icon-color" aria-hidden />
          {value ? format(value, formatStr) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        data-slot="date-picker-content"
        align="start"
        className="w-auto p-0"
      >
        <Calendar mode="single" selected={value} onSelect={handleSelect} autoFocus />
      </PopoverContent>
    </Popover>
  );
}

type DateRangePickerProps = {
  /** Controlled selected range. Pair with `onValueChange`. */
  value?: DateRange;
  /** Initial range for uncontrolled mode. */
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange | undefined) => void;
  placeholder?: string;
  formatStr?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  numberOfMonths?: number;
  'aria-label'?: string;
};

function formatRangeLabel(range: DateRange | undefined, formatStr: string): string | null {
  if (!range?.from) return null;
  if (!range.to) return format(range.from, formatStr);
  return `${format(range.from, formatStr)} - ${format(range.to, formatStr)}`;
}

function DateRangePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = 'Pick a date range',
  formatStr = DEFAULT_FORMAT,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled,
  className,
  id,
  numberOfMonths = 2,
  'aria-label': ariaLabel,
}: Readonly<DateRangePickerProps>) {
  const isOpenControlled = openProp !== undefined;
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = isOpenControlled ? openProp : openState;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setOpenState(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange]
  );

  const isValueControlled = valueProp !== undefined;
  const [valueState, setValueState] = React.useState<DateRange | undefined>(defaultValue);
  const value = isValueControlled ? valueProp : valueState;

  const handleSelect = React.useCallback(
    (next: DateRange | undefined) => {
      if (!isValueControlled) setValueState(next);
      onValueChange?.(next);
      // react-day-picker's default range selection eagerly creates a
      // single-day range (`{from: date, to: date}`) on the first click,
      // so a naive `from && to` check would close the popover after one
      // click. Only auto-close when the second click actually extends
      // the range to a different day.
      if (next?.from && next?.to && !isSameDay(next.from, next.to)) {
        setOpen(false);
      }
    },
    [isValueControlled, onValueChange, setOpen]
  );

  const label = formatRangeLabel(value, formatStr);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-range-picker-trigger"
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !label && 'text-date-picker-trigger-placeholder-color',
            className
          )}
        >
          <CalendarIcon className="text-date-picker-trigger-icon-color" aria-hidden />
          {label ?? <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        data-slot="date-range-picker-content"
        align="start"
        className="w-auto p-0"
      >
        <Calendar
          mode="range"
          selected={value}
          onSelect={handleSelect}
          numberOfMonths={numberOfMonths}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker, DateRangePicker };
export type { DatePickerProps, DateRangePickerProps };
