'use client';

import { Combobox } from '@brika/clay/components/combobox';
import { useState } from 'react';
import { defineDemos } from '../../component-registry';

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'svelte', label: 'Svelte' },
];

/** Uncontrolled combobox, picks a framework with typeahead search. */
export function ComboboxDefaultDemo() {
  return (
    <div className="w-72">
      <Combobox
        options={frameworks}
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
        emptyText="No framework found."
        fullWidth
      />
    </div>
  );
}

/** Controlled combobox, drives state with `useState` and reflects the current selection below the trigger. */
export function ComboboxControlledDemo() {
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

/** Combobox with `name="framework"` inside a `<form>`, the hidden input lets native form submission carry the value. */
export function ComboboxFormDemo() {
  return (
    <form
      className="flex w-72 flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const value = data.get('framework');
        globalThis.alert(`framework=${typeof value === 'string' ? value : ''}`);
      }}
    >
      <Combobox
        name="framework"
        options={frameworks}
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
        emptyText="No framework found."
        fullWidth
      />
      <button
        type="submit"
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium"
      >
        Submit
      </button>
    </form>
  );
}

export const demoMeta = defineDemos([
  [
    ComboboxDefaultDemo,
    'Default',
    { description: 'Uncontrolled combobox, picks a framework with typeahead search.' },
  ],
  [
    ComboboxControlledDemo,
    'Controlled',
    {
      description:
        'Controlled combobox, drives state with `useState` and reflects the current selection below the trigger.',
    },
  ],
  [
    ComboboxFormDemo,
    'Form',
    {
      description:
        'Combobox with `name="framework"` inside a `<form>`, the hidden input lets native form submission carry the value.',
    },
  ],
]);
