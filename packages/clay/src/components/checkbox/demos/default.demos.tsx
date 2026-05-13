'use client';

import { Checkbox } from '@brika/clay/components/checkbox';

/** Uncontrolled checkbox pre-checked for visible state. */
export default function CheckboxDefaultDemo() {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <Checkbox defaultChecked />
      Accept terms and conditions
    </label>
  );
}
