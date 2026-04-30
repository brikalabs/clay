'use client';

import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@brika/clay/components/context-menu';
import { defineDemos } from '../_registry';

/** Right-click (or long-press on mobile) the target area to open the menu. */
export function ContextMenuDefaultDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-24 w-48 cursor-context-menu items-center justify-center rounded-lg border border-dashed border-input text-muted-foreground text-sm">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>
          New file
          <ContextMenuShortcut>Cmd+N</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Rename
          <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Properties</ContextMenuItem>
            <ContextMenuItem>Compress</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/** ContextMenuCheckboxItem maintains a checked state for toggleable settings. */
export function ContextMenuCheckboxDemo() {
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

/** ContextMenuRadioGroup enforces a single active choice across a set of items. */
export function ContextMenuRadioDemo() {
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

export const demoMeta = defineDemos([
  [ContextMenuDefaultDemo, 'Default', { description: `Right-click (or long-press on mobile) the target area to open the menu.` }],
  [ContextMenuCheckboxDemo, 'Checkbox', { description: `ContextMenuCheckboxItem maintains a checked state for toggleable settings.` }],
  [ContextMenuRadioDemo, 'Radio', { description: `ContextMenuRadioGroup enforces a single active choice across a set of items.` }],
]);
export const accessibility: readonly string[] = [
  `Trigger carries \`aria-haspopup="menu"\` automatically.`,
  `Keyboard: Shift+F10 or the context-menu key opens the menu on the focused trigger.`,
  `Arrow keys navigate items; Enter/Space activate; Escape dismisses.`,
  `Destructive items should use \`variant="destructive"\` so the visual indication matches AT context.`,
];
