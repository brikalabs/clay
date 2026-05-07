'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@brika/clay/components/select';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Basic single-value select for picking a timezone. */
export function SelectDefaultDemo() {
  return (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="utc">UTC</SelectItem>
        <SelectItem value="america-new_york">America / New York</SelectItem>
        <SelectItem value="america-los_angeles">America / Los Angeles</SelectItem>
        <SelectItem value="europe-london">Europe / London</SelectItem>
        <SelectItem value="europe-paris">Europe / Paris</SelectItem>
        <SelectItem value="asia-tokyo">Asia / Tokyo</SelectItem>
      </SelectContent>
    </Select>
  );
}

/** Options grouped by region using SelectGroup and SelectLabel. */
export function SelectGroupedDemo() {
  return (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="america-new_york">New York (ET)</SelectItem>
          <SelectItem value="america-chicago">Chicago (CT)</SelectItem>
          <SelectItem value="america-los_angeles">Los Angeles (PT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="europe-london">London (GMT)</SelectItem>
          <SelectItem value="europe-paris">Paris (CET)</SelectItem>
          <SelectItem value="europe-helsinki">Helsinki (EET)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia / Pacific</SelectLabel>
          <SelectItem value="asia-tokyo">Tokyo (JST)</SelectItem>
          <SelectItem value="australia-sydney">Sydney (AEST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/** A single option marked disabled, users can see it but not select it. */
export function SelectDisabledOptionDemo() {
  return (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="starter">Starter</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="enterprise" disabled>
          Enterprise (contact sales)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

/** The entire select is disabled, no interaction possible. */
export function SelectDisabledDemo() {
  return (
    <Select disabled>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Unavailable" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
      </SelectContent>
    </Select>
  );
}

/** Controlled select with an external state readout. */
export function SelectControlledDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-3">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Pick a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="viewer">Viewer</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="owner">Owner</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-sm">
        Selected: <span className="font-medium text-foreground">{value || 'none'}</span>
      </p>
    </div>
  );
}

export const demoMeta = defineDemos([
  [SelectDefaultDemo, 'Default', { description: `Basic single-value select for picking a timezone.` }],
  [SelectGroupedDemo, 'Grouped', { description: `Options grouped by region using SelectGroup and SelectLabel.` }],
  [SelectDisabledOptionDemo, 'Disabled Option', { description: `A single option marked disabled, users can see it but not select it.` }],
  [SelectDisabledDemo, 'Disabled', { description: `The entire select is disabled, no interaction possible.` }],
  [SelectControlledDemo, 'Controlled', { description: `Controlled select with an external state readout.` }],
]);
export const accessibility: readonly string[] = [
  `Trigger carries \`role="combobox"\` and \`aria-expanded\`, no extra markup needed.`,
  `Arrow keys navigate options; Home/End jump to first/last; typing ahead filters.`,
  `Selected item receives \`aria-selected="true"\` and a visible check mark.`,
  `Disabled items carry \`aria-disabled="true"\` and are skipped by arrow navigation.`,
];
