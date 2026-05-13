'use client';

import { Switch } from '@brika/clay/components/switch';
import { useState } from 'react';

/** Settings row pattern, switch with a title and description label. */
export default function SwitchSettingsRowDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex w-full max-w-sm items-center justify-between gap-4 rounded-lg border border-clay-hairline px-4 py-3">
      <div>
        <p className="text-sm font-medium">Auto-save drafts</p>
        <p className="text-xs text-clay-subtle">Saves your work every 30 seconds.</p>
      </div>
      <Switch checked={enabled} onCheckedChange={setEnabled} />
    </div>
  );
}
