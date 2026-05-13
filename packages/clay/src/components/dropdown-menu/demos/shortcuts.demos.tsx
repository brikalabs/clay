'use client';

import { Button } from '@brika/clay/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@brika/clay/components/dropdown-menu';
/** DropdownMenuShortcut renders right-aligned keyboard hints, purely visual, not functional. */
export default function DropdownMenuShortcutsDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem>
          Undo
          <DropdownMenuShortcut>Cmd+Z</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Redo
          <DropdownMenuShortcut>Cmd+Shift+Z</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Cut
          <DropdownMenuShortcut>Cmd+X</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Copy
          <DropdownMenuShortcut>Cmd+C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Paste
          <DropdownMenuShortcut>Cmd+V</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
