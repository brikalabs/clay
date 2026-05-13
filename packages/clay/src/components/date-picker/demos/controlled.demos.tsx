'use client';

import { DatePicker } from '@brika/clay/components/date-picker';
import { useState } from 'react';

/** Controlled with `useState`, the parent owns the selected date and can read or reset it at any time. */
export default function DatePickerControlledDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return <DatePicker value={date} onValueChange={setDate} />;
}
