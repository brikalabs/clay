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
/** Options grouped by region using SelectGroup and SelectLabel. */
export default function SelectGroupedDemo() {
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
