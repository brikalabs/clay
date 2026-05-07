'use client';

import { Button } from '@brika/clay/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@brika/clay/components/collapsible';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Basic collapsible, trigger toggles content visibility, no controlled state needed. */
export function CollapsibleDefaultDemo() {
  return (
    <Collapsible className="w-full max-w-sm space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          Show team members
          <ChevronDownIcon className="size-4 shrink-0 text-clay-subtle" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-md border border-clay-hairline bg-clay-base p-3 text-clay-default text-sm">
        <ul className="space-y-1">
          <li>Alice, Engineering</li>
          <li>Bob, Design</li>
          <li>Carol, Product</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

/** Chevron rotates on open using `data-[state=open]`, wire it to the trigger via `group`. */
export function CollapsibleAnimatedDemo() {
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

/** Controlled collapsible, manage open state with `open` and `onOpenChange`. */
export function CollapsibleControlledDemo() {
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

export const demoMeta = defineDemos([
  [CollapsibleDefaultDemo, 'Default', { description: `Basic collapsible, trigger toggles content visibility, no controlled state needed.` }],
  [CollapsibleAnimatedDemo, 'Animated', { description: `Chevron rotates on open using \`data-[state=open]\`, wire it to the trigger via \`group\`.` }],
  [CollapsibleControlledDemo, 'Controlled', { description: `Controlled collapsible, manage open state with \`open\` and \`onOpenChange\`.` }],
]);
export const accessibility: readonly string[] = [
  `Trigger carries \`aria-expanded\` automatically, no extra markup needed.`,
  `Content carries \`aria-hidden\` when collapsed so AT skips it entirely.`,
  `Animate height via CSS \`overflow-hidden\` + transition, not \`display:none\`, to preserve AT semantics.`,
];
