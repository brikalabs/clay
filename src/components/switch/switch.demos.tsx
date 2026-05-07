'use client';

import { Label } from '@brika/clay/components/label';
import { Switch } from '@brika/clay/components/switch';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Uncontrolled switch in its default on state. */
export function SwitchDefaultDemo() {
  return <Switch defaultChecked />;
}

/** Controlled switch with live state label next to it. */
export function SwitchControlledDemo() {
  const [on, setOn] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Switch checked={on} onCheckedChange={setOn} />
      <span className="font-mono text-clay-subtle text-xs">{on ? 'on' : 'off'}</span>
    </div>
  );
}

/** Switch paired with a Label, clicking the label text also toggles the switch. */
export function SwitchLabelDemo() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="dark-mode" />
      <Label htmlFor="dark-mode">Enable dark mode</Label>
    </div>
  );
}

/** Disabled switch states, both checked and unchecked. */
export function SwitchDisabledDemo() {
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

/** Settings row pattern, switch with a title and description label. */
export function SwitchSettingsRowDemo() {
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

export const demoMeta = defineDemos([
  [SwitchDefaultDemo, 'Default', { description: `Uncontrolled switch in its default on state.` }],
  [SwitchControlledDemo, 'Controlled', { description: `Controlled switch with live state label next to it.` }],
  [SwitchLabelDemo, 'Label', { description: `Switch paired with a Label, clicking the label text also toggles the switch.` }],
  [SwitchDisabledDemo, 'Disabled', { description: `Disabled switch states, both checked and unchecked.` }],
  [SwitchSettingsRowDemo, 'Settings Row', { description: `Settings row pattern, switch with a title and description label.` }],
]);
export const accessibility: readonly string[] = [
  `Carries \`role="switch"\` with \`aria-checked\`, AT announces "on" / "off" state.`,
  `Pair with a \`<Label>\`, clicking the label also toggles the switch.`,
  `Disabled switches carry \`aria-disabled\` and are removed from the tab order.`,
  `Use \`Switch\` for binary on/off settings; use \`Checkbox\` for multi-select form fields.`,
];
