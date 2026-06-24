'use client';

import { useState } from 'react';
import { Rating } from '@brika/clay/components/rating';

/**
 * Interactive click-to-rate: a controlled Rating in input mode. Hover shows
 * a live preview; click commits. Keyboard: arrow keys, Home, End.
 */
export default function RatingInteractiveDemo() {
  const [value, setValue] = useState(3);
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Whole stars (step=1)</span>
        <Rating value={value} onValueChange={setValue} size="lg" aria-label="Rate this item" />
        <span className="text-xs tabular-nums text-muted-foreground">Selected: {value}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Half stars (step=0.5)</span>
        <Rating value={value} onValueChange={setValue} step={0.5} aria-label="Rate this item" />
        <span className="text-xs tabular-nums text-muted-foreground">Selected: {value}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Disabled</span>
        <Rating value={value} onValueChange={setValue} disabled aria-label="Rating disabled" />
      </div>
    </div>
  );
}
