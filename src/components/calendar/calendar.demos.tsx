'use client';

import { Calendar } from '@brika/clay/components/calendar';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { defineDemos } from '../_registry';

export function CalendarDefaultDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
    />
  );
}

export function CalendarRangeDemo() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      className="rounded-lg border"
    />
  );
}

export function CalendarRangeTwoMonthDemo() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      pagedNavigation
      selected={range}
      onSelect={setRange}
      className="rounded-lg border"
    />
  );
}

export const demoMeta = defineDemos([
  [CalendarDefaultDemo, 'Default'],
  [CalendarRangeDemo, 'Range'],
  [CalendarRangeTwoMonthDemo, 'Range Two Month'],
]);
