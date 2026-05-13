'use client';

import { Label } from '@brika/clay/components/label';
import { RadioGroup, RadioGroupItem } from '@brika/clay/components/radio-group';
import { useState } from 'react';

/** Fully controlled radio group that shows the selected value. */
export default function RadioGroupControlledDemo() {
  const [value, setValue] = useState('medium');

  return (
    <div className="space-y-3">
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="low" id="priority-low" />
          <Label htmlFor="priority-low">Low priority</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="medium" id="priority-medium" />
          <Label htmlFor="priority-medium">Medium priority</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="high" id="priority-high" />
          <Label htmlFor="priority-high">High priority</Label>
        </div>
      </RadioGroup>
      <p className="font-mono text-clay-subtle text-xs">selected: {value}</p>
    </div>
  );
}
