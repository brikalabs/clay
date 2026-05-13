'use client';

import { Button } from '@brika/clay/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@brika/clay/components/collapsible';
import { useState } from 'react';

/** Controlled collapsible, manage open state with `open` and `onOpenChange`. */
export default function CollapsibleControlledDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-clay-default text-sm font-medium">Filters</span>
        <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="sr-only">Toggle filters</CollapsibleTrigger>
        <CollapsibleContent className="rounded-md border border-clay-hairline bg-clay-base p-3 text-clay-default text-sm">
          <ul className="space-y-1">
            <li>Status: Active</li>
            <li>Date range: Last 30 days</li>
            <li>Owner: All</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
