'use client';

import { Label } from '@brika/clay/components/label';
import { Switch } from '@brika/clay/components/switch';

/** Switch paired with a Label, clicking the label text also toggles the switch. */
export default function SwitchLabelDemo() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="dark-mode" />
      <Label htmlFor="dark-mode">Enable dark mode</Label>
    </div>
  );
}
