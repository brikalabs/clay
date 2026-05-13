'use client';

import { Combobox } from '@brika/clay/components/combobox';
import { useState } from 'react';
const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'svelte', label: 'Svelte' },
];

/**
 * Controlled combobox, drives state with `useState` and reflects the current selection below the trigger.
 */
export default function ComboboxControlledDemo() {
  const [value, setValue] = useState('');
  const selected = frameworks.find((option) => option.value === value);
  return (
    <div className="flex w-72 flex-col gap-2">
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
        emptyText="No framework found."
        fullWidth
      />
      <p className="text-muted-foreground text-sm">
        Selected: {selected ? selected.label : 'none'}
      </p>
    </div>
  );
}
