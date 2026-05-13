'use client';

import { Combobox } from '@brika/clay/components/combobox';
const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'svelte', label: 'Svelte' },
];

/**
 * Combobox with `name="framework"` inside a `<form>`, the hidden input lets native form submission carry the value.
 */
export default function ComboboxFormDemo() {
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
