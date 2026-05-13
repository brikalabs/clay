'use client';

import { Checkbox } from '@brika/clay/components/checkbox';
import { useState } from 'react';

/** Controlled checkbox with external state displayed alongside. */
export default function CheckboxControlledDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
        Subscribe to product updates
      </label>
      <span className="font-mono text-clay-subtle text-xs">{checked ? 'checked' : 'unchecked'}</span>
    </div>
  );
}
