'use client';

import { Checkbox } from '@brika/clay/components/checkbox';
import { useState } from 'react';

/** Tri-state checkbox cycling through unchecked, indeterminate, and checked. */
export default function CheckboxIndeterminateDemo() {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={setChecked} />
      Select all items
    </label>
  );
}
