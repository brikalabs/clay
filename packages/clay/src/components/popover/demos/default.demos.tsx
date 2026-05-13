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
/** Filter panel inside a popover, typical pattern for inline form controls. */
export default function PopoverDefaultDemo() {
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
