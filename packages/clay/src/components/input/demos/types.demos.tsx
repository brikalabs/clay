import { Input } from '@brika/clay/components/input';

/** Native input types, email, number, and search all pass through unchanged. */
export default function InputTypesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Input type="email" placeholder="you@example.com" />
      <Input type="number" placeholder="42" />
      <Input type="search" placeholder="Search…" />
    </div>
  );
}
