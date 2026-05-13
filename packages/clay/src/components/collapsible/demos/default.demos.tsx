'use client';

import { Button } from '@brika/clay/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@brika/clay/components/collapsible';
import { ChevronDownIcon } from 'lucide-react';

/** Basic collapsible, trigger toggles content visibility, no controlled state needed. */
export default function CollapsibleDefaultDemo() {
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
