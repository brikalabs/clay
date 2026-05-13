'use client';

import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@brika/clay/components/context-menu';
/** ContextMenuCheckboxItem maintains a checked state for toggleable settings. */
export default function ContextMenuCheckboxDemo() {
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-24 w-48 cursor-context-menu items-center justify-center rounded-lg border border-dashed border-input text-muted-foreground text-sm">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuLabel>View options</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
          Show grid
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={snapToGrid} onCheckedChange={setSnapToGrid}>
          Snap to grid
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={showRulers} onCheckedChange={setShowRulers}>
          Show rulers
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
