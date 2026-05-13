'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@brika/clay/components/select';
/** Basic single-value select for picking a timezone. */
export default function SelectDefaultDemo() {
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
