'use client';

import { useState } from 'react';
import { Rating } from '@brika/clay/components/rating';

/**
 * Interactive input: whole-star selection via hover + click. Supports both
 * uncontrolled (`defaultValue`) and controlled (`value` + `onValueChange`)
 * modes. Keyboard: Arrow keys move between stars and commit the value.
 */
export default function RatingInteractiveDemo() {
  const [controlled, setControlled] = useState(3);
  const [observed, setObserved] = useState<number | null>(null);
  return (
    <div className="flex flex-col items-start gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          Uncontrolled (defaultValue=3)
        </span>
        <Rating
          defaultValue={3}
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
          Controlled (value={controlled})
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
        <span className="text-xs text-muted-foreground">Disabled</span>
        <Rating
          value={controlled}
          disabled
          aria-label="Rating disabled"
        />
      </div>
    </div>
  );
}
