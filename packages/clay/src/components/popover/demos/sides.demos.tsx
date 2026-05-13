'use client';

import { Button } from '@brika/clay/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@brika/clay/components/popover';
/** The side prop controls which edge of the trigger the popover appears on. */
export default function PopoverSidesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-36 text-center text-sm">
            Placed on the {side}.
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
