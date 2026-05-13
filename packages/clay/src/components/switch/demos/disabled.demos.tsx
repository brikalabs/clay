'use client';

import { Label } from '@brika/clay/components/label';
import { Switch } from '@brika/clay/components/switch';

/** Disabled switch states, both checked and unchecked. */
export default function SwitchDisabledDemo() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <Switch disabled />
        <Label className="opacity-50">Disabled off</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch disabled defaultChecked />
        <Label className="opacity-50">Disabled on</Label>
      </div>
    </div>
  );
}
