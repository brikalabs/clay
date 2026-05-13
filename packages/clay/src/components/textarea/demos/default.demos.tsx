'use client';

import { Textarea } from '@brika/clay/components/textarea';

/** Multi-line text input in its default auto-sizing state. */
export default function TextareaDefaultDemo() {
  return (
    <div className="w-full max-w-sm">
      <Textarea placeholder="Tell us about your project…" />
    </div>
  );
}
