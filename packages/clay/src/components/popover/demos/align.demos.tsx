'use client';

import { Button } from '@brika/clay/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@brika/clay/components/popover';
/** The align prop pins the content to the start, center, or end of the trigger. */
export default function PopoverAlignDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {align}
            </Button>
          </PopoverTrigger>
          <PopoverContent align={align} className="w-36 text-center text-sm">
            Aligned to {align}.
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
