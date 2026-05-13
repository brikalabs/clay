'use client';

import { Progress } from '@brika/clay/components/progress';
import { useEffect, useState } from 'react';

/** Progress bar that increments automatically to simulate a running task. */
export default function ProgressAnimatedDemo() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (value >= 100) return;
    const id = setTimeout(() => setValue((v) => Math.min(v + 2, 100)), 80);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Progress value={value} />
      <button
        className="self-start text-xs text-muted-foreground underline-offset-4 hover:underline"
        onClick={() => setValue(0)}
      >
        Restart
      </button>
    </div>
  );
}
