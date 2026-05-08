'use client';

import { Button } from '@brika/clay/components/button';
import { Input } from '@brika/clay/components/input';
import { Label } from '@brika/clay/components/label';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@brika/clay/components/popover';
import { defineDemos } from '../_registry';

/** Filter panel inside a popover — typical pattern for inline form controls. */
export function PopoverDefaultDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filter results</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Filter</PopoverTitle>
          <PopoverDescription>Narrow results by date range.</PopoverDescription>
        </PopoverHeader>
        <div className="mt-3 grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="pop-from">From</Label>
            <Input id="pop-from" type="date" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="pop-to">To</Label>
            <Input id="pop-to" type="date" />
          </div>
          <Button className="w-full">Apply filter</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** The side prop controls which edge of the trigger the popover appears on. */
export function PopoverSidesDemo() {
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

/** The align prop pins the content to the start, center, or end of the trigger. */
export function PopoverAlignDemo() {
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

export const demoMeta = defineDemos([
  [PopoverDefaultDemo, 'Default', { description: `Filter panel inside a popover — typical pattern for inline form controls.` }],
  [PopoverSidesDemo, 'Sides', { description: `The side prop controls which edge of the trigger the popover appears on.` }],
  [PopoverAlignDemo, 'Align', { description: `The align prop pins the content to the start, center, or end of the trigger.` }],
]);
export const accessibility: readonly string[] = [
  `Focus moves into the popover when it opens — Tab navigates within it.`,
  `Escape and clicking outside close the popover and return focus to the trigger.`,
  `Use \`Popover\` over \`HoverCard\` when content must be keyboard-reachable.`,
  `The trigger carries \`aria-expanded\` and \`aria-controls\` pointing to the panel.`,
];
