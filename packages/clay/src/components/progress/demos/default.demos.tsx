'use client';

import { Progress } from '@brika/clay/components/progress';

/** Basic determinate progress bar, pass `value` 0 to 100. */
export default function ProgressDefaultDemo() {
  return (
    <div className="w-full max-w-xs">
      <Progress value={66} />
    </div>
  );
}
