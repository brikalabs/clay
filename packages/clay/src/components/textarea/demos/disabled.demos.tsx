'use client';

import { Textarea } from '@brika/clay/components/textarea';

/** Disabled textarea blocks interaction and reduces opacity. */
export default function TextareaDisabledDemo() {
  return (
    <div className="w-full max-w-sm">
      <Textarea disabled defaultValue="This field is locked and cannot be edited." />
    </div>
  );
}
