'use client';

import { Label } from '@brika/clay/components/label';
import { RadioGroup, RadioGroupItem } from '@brika/clay/components/radio-group';

/** Horizontal layout using orientation="horizontal" and flex-row spacing. */
export default function RadioGroupHorizontalDemo() {
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
