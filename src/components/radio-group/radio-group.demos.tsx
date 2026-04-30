'use client';

import { Label } from '@brika/clay/components/label';
import { RadioGroup, RadioGroupItem } from '@brika/clay/components/radio-group';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Vertical radio group with a default value pre-selected. */
export function RadioGroupDefaultDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  );
}

/** One item disabled independently while others remain interactive. */
export function RadioGroupDisabledDemo() {
  return (
    <RadioGroup defaultValue="monthly">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="monthly" id="plan-monthly" />
        <Label htmlFor="plan-monthly">Monthly billing</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="annual" id="plan-annual" />
        <Label htmlFor="plan-annual">Annual billing</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="enterprise" id="plan-enterprise" disabled />
        <Label htmlFor="plan-enterprise" className="opacity-50">Enterprise (contact sales)</Label>
      </div>
    </RadioGroup>
  );
}

/** Horizontal layout using orientation="horizontal" and flex-row spacing. */
export function RadioGroupHorizontalDemo() {
  return (
    <RadioGroup defaultValue="card" orientation="horizontal" className="flex flex-row gap-6">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="card" id="pay-card" />
        <Label htmlFor="pay-card">Credit card</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="bank" id="pay-bank" />
        <Label htmlFor="pay-bank">Bank transfer</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="crypto" id="pay-crypto" />
        <Label htmlFor="pay-crypto">Crypto</Label>
      </div>
    </RadioGroup>
  );
}

/** Fully controlled radio group that shows the selected value. */
export function RadioGroupControlledDemo() {
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

export const demoMeta = defineDemos([
  [RadioGroupDefaultDemo, 'Default', { description: `Vertical radio group with a default value pre-selected.` }],
  [RadioGroupDisabledDemo, 'Disabled', { description: `One item disabled independently while others remain interactive.` }],
  [RadioGroupHorizontalDemo, 'Horizontal', { description: `Horizontal layout using orientation="horizontal" and flex-row spacing.` }],
  [RadioGroupControlledDemo, 'Controlled', { description: `Fully controlled radio group that shows the selected value.` }],
]);
export const accessibility: readonly string[] = [
  `Arrow keys move selection within the group — Tab leaves the group entirely.`,
  `Always pair items with visible \`<Label htmlFor={id}>\` elements.`,
  `Disabled individual items carry \`aria-disabled\` and are skipped by arrow keys.`,
  `Use \`defaultValue\` for uncontrolled initial selection; \`value\` + \`onValueChange\` for controlled.`,
];
