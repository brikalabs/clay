'use client';

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from '@brika/clay/components/mini-calendar';
import { useState } from 'react';

/** Weekday and day labels follow the `locale` prop via `Intl.DateTimeFormat`, shown here in French with `days={7}`. */
export default function MiniCalendarLocalizedDemo() {
  const [date, setDate] = useState<Date>(() => new Date());

  return (
    <MiniCalendar value={date} onValueChange={setDate} locale="fr-FR" days={7}>
      <MiniCalendarNavigation direction="prev" />
      <MiniCalendarDays>{(day) => <MiniCalendarDay date={day} />}</MiniCalendarDays>
      <MiniCalendarNavigation direction="next" />
    </MiniCalendar>
  );
}
