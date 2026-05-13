'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@brika/clay/components/context-menu';
/** Right-click (or long-press on mobile) the target area to open the menu. */
export default function ContextMenuDefaultDemo() {
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
