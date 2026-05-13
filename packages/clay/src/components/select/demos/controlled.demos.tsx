'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@brika/clay/components/select';
import { useState } from 'react';

/** Controlled select with an external state readout. */
export default function SelectControlledDemo() {
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
