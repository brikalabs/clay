'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@brika/clay/components/select';
/** The entire select is disabled, no interaction possible. */
export default function SelectDisabledDemo() {
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
