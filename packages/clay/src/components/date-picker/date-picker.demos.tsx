'use client';

import { DatePicker, DateRangePicker } from '@brika/clay/components/date-picker';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { defineDemos } from '../../component-registry';

/** Uncontrolled trigger, opens a single-month calendar and shows the placeholder until a date is picked. */
export function DatePickerDefaultDemo() {
  return <DatePicker placeholder="Pick a date" />;
}

/** Controlled with `useState`, the parent owns the selected date and can read or reset it at any time. */
export function DatePickerControlledDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return <DatePicker value={date} onValueChange={setDate} />;
}

/** Pass any date-fns format string via `formatStr` to change how the trigger label renders. */
export function DatePickerCustomFormatDemo() {
  return <DatePicker formatStr="yyyy-MM-dd" placeholder="YYYY-MM-DD" />;
}

/** `DateRangePicker` selects a `from`/`to` pair and renders two months by default. */
export function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRange | undefined>();

  return <DateRangePicker value={range} onValueChange={setRange} />;
}

export const demoMeta = defineDemos([
  [DatePickerDefaultDemo, 'Default', { description: 'Uncontrolled trigger, opens a single-month calendar and shows the placeholder until a date is picked.' }],
  [DatePickerControlledDemo, 'Controlled', { description: 'Controlled with `useState`, the parent owns the selected date and can read or reset it at any time.' }],
  [DatePickerCustomFormatDemo, 'Custom Format', { description: 'Pass any date-fns format string via `formatStr` to change how the trigger label renders.' }],
  [DateRangePickerDemo, 'Range', { description: '`DateRangePicker` selects a `from`/`to` pair and renders two months by default.' }],
]);
