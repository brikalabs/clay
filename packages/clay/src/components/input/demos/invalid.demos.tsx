import { Input } from '@brika/clay/components/input';

/** Validation error state, set aria-invalid to trigger the destructive border. */
export default function InputInvalidDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <Input aria-invalid="true" defaultValue="jane@" />
      <p className="text-destructive text-xs">Enter a valid email address.</p>
    </div>
  );
}
