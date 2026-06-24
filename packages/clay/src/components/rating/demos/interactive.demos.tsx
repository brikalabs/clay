'use client';

import { useState } from 'react';
import { Rating } from '@brika/clay/components/rating';

/**
 * Interactive input modes: uncontrolled (component holds state) and
 * controlled (caller holds state). Move the pointer across the stars
 * for a live fractional preview; click to commit.
 *
 * Uncontrolled: `defaultValue` + optional `onValueChange` to observe.
 * No consumer state required -- just pass `defaultValue` and go.
 *
 * Controlled: `value` + `onValueChange` -- caller owns state.
 */
export default function RatingInteractiveDemo() {
  const [controlled, setControlled] = useState(3);
  const [observed, setObserved] = useState<number | null>(null);
  return (
    <div className="flex flex-col items-start gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          Uncontrolled — half stars (step=0.5, defaultValue=3.5)
        </span>
        <Rating
          defaultValue={3.5}
          step={0.5}
          size="lg"
          onValueChange={setObserved}
          aria-label="Rate this item"
        />
        <span className="text-xs tabular-nums text-muted-foreground">
          Last committed: {observed ?? '(not yet changed)'}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          Controlled — whole stars (step=1)
        </span>
        <Rating
          value={controlled}
          onValueChange={setControlled}
          size="lg"
          aria-label="Rate this item"
        />
        <span className="text-xs tabular-nums text-muted-foreground">value={controlled}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          Controlled — half stars (step=0.5), same state as above
        </span>
        <Rating
          value={controlled}
          onValueChange={setControlled}
          step={0.5}
          aria-label="Rate this item (half stars)"
        />
        <span className="text-xs tabular-nums text-muted-foreground">value={controlled}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Disabled</span>
        <Rating
          value={controlled}
          onValueChange={setControlled}
          disabled
          aria-label="Rating disabled"
        />
      </div>
    </div>
  );
}
