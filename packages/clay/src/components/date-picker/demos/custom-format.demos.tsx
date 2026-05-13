'use client';

import { DatePicker } from '@brika/clay/components/date-picker';

/** Pass any date-fns format string via `formatStr` to change how the trigger label renders. */
export default function DatePickerCustomFormatDemo() {
  return <DatePicker formatStr="yyyy-MM-dd" placeholder="YYYY-MM-DD" />;
}
