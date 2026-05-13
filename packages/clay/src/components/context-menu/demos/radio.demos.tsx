'use client';

import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@brika/clay/components/context-menu';
/** ContextMenuRadioGroup enforces a single active choice across a set of items. */
export default function ContextMenuRadioDemo() {
  const [density, setDensity] = useState('comfortable');

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-24 w-48 cursor-context-menu items-center justify-center rounded-lg border border-dashed border-input text-muted-foreground text-sm">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuLabel>Row density</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={density} onValueChange={setDensity}>
          <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
          <ContextMenuRadioItem value="comfortable">Comfortable</ContextMenuRadioItem>
          <ContextMenuRadioItem value="spacious">Spacious</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
