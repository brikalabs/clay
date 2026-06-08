'use client';

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from '@brika/clay/components/mini-calendar';
import { useState } from 'react';

/** Show a full week at once by setting `days={7}`. */
export default function MiniCalendarSevenDaysDemo() {
  const [date, setDate] = useState<Date>(() => new Date());

  return (
    <MiniCalendar value={date} onValueChange={setDate} days={7}>
      <MiniCalendarNavigation direction="prev" />
      <MiniCalendarDays>{(day) => <MiniCalendarDay date={day} />}</MiniCalendarDays>
      <MiniCalendarNavigation direction="next" />
    </MiniCalendar>
  );
}
