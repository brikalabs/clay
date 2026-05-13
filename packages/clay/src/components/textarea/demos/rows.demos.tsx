'use client';

import { Textarea } from '@brika/clay/components/textarea';

/** Fixed height using the rows attribute. */
export default function TextareaRowsDemo() {
  return (
    <div className="w-full max-w-sm">
      <Textarea rows={6} placeholder="Paste your content here (6 rows fixed)…" />
    </div>
  );
}
