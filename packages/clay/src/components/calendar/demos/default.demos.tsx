'use client';

import { Calendar } from '@brika/clay/components/calendar';
import { useState } from 'react';
export default function CalendarDefaultDemo() {
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
