'use client';

import { Textarea } from '@brika/clay/components/textarea';

/** Validation error state, aria-invalid triggers the destructive border. */
export default function TextareaInvalidDemo() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-1">
      <Textarea aria-invalid="true" defaultValue="x" rows={3} />
      <p className="text-destructive text-xs">Description must be at least 20 characters.</p>
    </div>
  );
}
