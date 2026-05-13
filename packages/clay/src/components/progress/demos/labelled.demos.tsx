'use client';

import { Progress } from '@brika/clay/components/progress';
import { useState } from 'react';

/** Progress with a percentage label, compose any text readout alongside the bar. */
export default function ProgressLabelledDemo() {
  const [value] = useState(42);

  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Indexing codebase</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
