'use client';

import { Label } from '@brika/clay/components/label';
import { RadioGroup, RadioGroupItem } from '@brika/clay/components/radio-group';

/** One item disabled independently while others remain interactive. */
export default function RadioGroupDisabledDemo() {
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
