'use client';

import { Calendar } from '@brika/clay/components/calendar';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
export default function CalendarRangeDemo() {
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
