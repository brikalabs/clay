'use client';

import { Switch } from '@brika/clay/components/switch';
import { useState } from 'react';

/** Controlled switch with live state label next to it. */
export default function SwitchControlledDemo() {
  const [on, setOn] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Switch checked={on} onCheckedChange={setOn} />
      <span className="font-mono text-clay-subtle text-xs">{on ? 'on' : 'off'}</span>
    </div>
  );
}
