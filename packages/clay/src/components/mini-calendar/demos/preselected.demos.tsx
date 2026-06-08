'use client';

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from '@brika/clay/components/mini-calendar';

/** Start with a date already chosen using `defaultValue` (uncontrolled). */
export default function MiniCalendarPreselectedDemo() {
  return (
    <MiniCalendar defaultValue={new Date()}>
      <MiniCalendarNavigation direction="prev" />
      <MiniCalendarDays>{(day) => <MiniCalendarDay date={day} />}</MiniCalendarDays>
      <MiniCalendarNavigation direction="next" />
    </MiniCalendar>
  );
}
