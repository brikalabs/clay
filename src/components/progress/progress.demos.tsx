'use client';

import { Progress } from '@brika/clay/components/progress';
import { useEffect, useState } from 'react';
import { defineDemos } from '../_registry';

/** Basic determinate progress bar, pass `value` 0 to 100. */
export function ProgressDefaultDemo() {
  return (
    <div className="w-full max-w-xs">
      <Progress value={66} />
    </div>
  );
}

/** Progress bar that increments automatically to simulate a running task. */
export function ProgressAnimatedDemo() {
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

/** Progress with a percentage label, compose any text readout alongside the bar. */
export function ProgressLabelledDemo() {
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

export const demoMeta = defineDemos([
  [ProgressDefaultDemo, 'Default', { description: `Basic determinate progress bar, pass \`value\` 0 to 100.` }],
  [ProgressAnimatedDemo, 'Animated', { description: `Progress bar that increments automatically to simulate a running task.` }],
  [ProgressLabelledDemo, 'Labelled', { description: `Progress with a percentage label, compose any text readout alongside the bar.` }],
]);
export const accessibility: readonly string[] = [
  `Carries \`role="progressbar"\`, \`aria-valuenow\`, \`aria-valuemin\`, and \`aria-valuemax\` automatically.`,
  `Pair with a visible label or \`aria-label\` so AT announces what is progressing.`,
  `Indeterminate state should also carry an accessible description explaining the uncertainty.`,
];
