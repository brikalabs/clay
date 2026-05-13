'use client';

import { Combobox } from '@brika/clay/components/combobox';
const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'svelte', label: 'Svelte' },
];

/** Uncontrolled combobox, picks a framework with typeahead search. */
export default function ComboboxDefaultDemo() {
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
