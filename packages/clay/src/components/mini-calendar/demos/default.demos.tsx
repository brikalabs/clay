'use client';

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from '@brika/clay/components/mini-calendar';
import { useState } from 'react';

/** A five-day strip with prev/next navigation; selection is controlled. */
export default function MiniCalendarDefaultDemo() {
  const [date, setDate] = useState<Date>(() => new Date());

  return (
    <div className="space-y-3">
      <MiniCalendar value={date} onValueChange={setDate}>
        <MiniCalendarNavigation direction="prev" />
        <MiniCalendarDays>{(day) => <MiniCalendarDay date={day} />}</MiniCalendarDays>
        <MiniCalendarNavigation direction="next" />
      </MiniCalendar>
      <p className="text-clay-subtle text-xs">
        Selected:{' '}
        {date.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
