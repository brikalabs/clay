'use client';

import { Checkbox } from '@brika/clay/components/checkbox';

/** Three size presets, sm, default, lg, side by side with labels. */
export default function CheckboxSizesDemo() {
  return (
    <div className="flex items-center gap-6">
      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox size="sm" defaultChecked />
        Small
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox size="default" defaultChecked />
        Default
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox size="lg" defaultChecked />
        Large
      </label>
    </div>
  );
}
