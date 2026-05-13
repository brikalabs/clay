'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@brika/clay/components/collapsible';
import { ChevronDownIcon } from 'lucide-react';

/** Chevron rotates on open using `data-[state=open]`, wire it to the trigger via `group`. */
export default function CollapsibleAnimatedDemo() {
  return (
    <Collapsible className="w-full max-w-sm space-y-2">
      <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md border border-clay-hairline bg-clay-elevated px-4 py-2 text-clay-default text-sm font-medium hover:bg-clay-control">
        Advanced options
        <ChevronDownIcon className="size-4 shrink-0 text-clay-subtle transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-md border border-clay-hairline bg-clay-base p-3 text-clay-default text-sm">
        <p>Enable debug mode, set environment variables, and configure timeouts here.</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
