'use client';

import { Textarea } from '@brika/clay/components/textarea';
import { useState } from 'react';

/** Controlled textarea showing a live character counter. */
export default function TextareaControlledDemo() {
  const MAX = 280;
  const [value, setValue] = useState('');
  return (
    <div className="w-full max-w-sm flex flex-col gap-1">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={MAX}
        placeholder="What's on your mind?"
        rows={4}
      />
      <p className="text-right text-xs text-muted-foreground">
        {value.length} / {MAX}
      </p>
    </div>
  );
}
