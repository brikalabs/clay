'use client';

import { Checkbox } from '@brika/clay/components/checkbox';
import { Label } from '@brika/clay/components/label';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Uncontrolled checkbox pre-checked for visible state. */
export function CheckboxDefaultDemo() {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <Checkbox defaultChecked />
      Accept terms and conditions
    </label>
  );
}

/** Three size presets, sm, default, lg, side by side with labels. */
export function CheckboxSizesDemo() {
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

/** Tri-state checkbox cycling through unchecked, indeterminate, and checked. */
export function CheckboxIndeterminateDemo() {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={setChecked} />
      Select all items
    </label>
  );
}

/** Controlled checkbox with external state displayed alongside. */
export function CheckboxControlledDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
        Subscribe to product updates
      </label>
      <span className="font-mono text-clay-subtle text-xs">{checked ? 'checked' : 'unchecked'}</span>
    </div>
  );
}

/** A realistic notification preferences group with independent checkboxes and labels. */
export function CheckboxFormGroupDemo() {
  const [prefs, setPrefs] = useState({ email: true, sms: false, push: true });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-sm font-medium">Notification preferences</legend>
      <div className="flex items-center gap-2">
        <Checkbox id="pref-email" checked={prefs.email} onCheckedChange={() => toggle('email')} />
        <Label htmlFor="pref-email">Email notifications</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="pref-sms" checked={prefs.sms} onCheckedChange={() => toggle('sms')} />
        <Label htmlFor="pref-sms">SMS alerts</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="pref-push" checked={prefs.push} onCheckedChange={() => toggle('push')} />
        <Label htmlFor="pref-push">Push notifications</Label>
      </div>
    </fieldset>
  );
}

export const demoMeta = defineDemos([
  [CheckboxDefaultDemo, 'Default', { description: `Uncontrolled checkbox pre-checked for visible state.` }],
  [CheckboxSizesDemo, 'Sizes', { description: `Three size presets, sm, default, lg, side by side with labels.` }],
  [CheckboxIndeterminateDemo, 'Indeterminate', { description: `Tri-state checkbox cycling through unchecked, indeterminate, and checked.` }],
  [CheckboxControlledDemo, 'Controlled', { description: `Controlled checkbox with external state displayed alongside.` }],
  [CheckboxFormGroupDemo, 'Form Group', { description: `A realistic notification preferences group with independent checkboxes and labels.` }],
]);
export const accessibility: readonly string[] = [
  `Built on Radix Checkbox, keyboard, focus, and ARIA state (\`aria-checked\`) are handled automatically.`,
  `Indeterminate state surfaces as \`checked="indeterminate"\`; AT announces "mixed".`,
  `Always pair with a visible label, wrap in \`<label>\` or use matching \`htmlFor\` / \`id\`.`,
  `Disabled checkboxes are removed from the tab order.`,
];
