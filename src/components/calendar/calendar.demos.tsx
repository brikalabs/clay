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

export const demoMeta = defineDemos([
  [CalendarDefaultDemo, 'Default'],
  [CalendarRangeDemo, 'Range'],
]);
export const accessibility: readonly string[] = [
  `Full keyboard navigation: arrow keys move between days, Enter/Space selects, Page Up/Down change months.`,
  `Screen readers announce the selected date and current month context.`,
  `Disabled dates carry \`aria-disabled\` and are skipped by arrow key navigation.`,
  `For range selection, AT announces the start and end dates as they are selected.`,
];
