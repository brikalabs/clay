'use client';

import { DatePicker } from '@brika/clay/components/date-picker';

/**
 * Uncontrolled trigger, opens a single-month calendar and shows the placeholder until a date is picked.
 */
export default function DatePickerDefaultDemo() {
  return <DatePicker placeholder="Pick a date" />;
}
