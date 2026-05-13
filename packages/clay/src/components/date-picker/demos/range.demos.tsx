'use client';

import { DateRangePicker } from '@brika/clay/components/date-picker';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

/** `DateRangePicker` selects a `from`/`to` pair and renders two months by default. */
export default function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRange | undefined>();

  return <DateRangePicker value={range} onValueChange={setRange} />;
}
