'use client';

import { useState } from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import { Button } from '@brika/clay/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@brika/clay/components/dropdown-menu';
import { defineDemos } from '../_registry';

/** Action menu with icons, grouped items, a separator, and a destructive item. */
export function DropdownMenuDefaultDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** DropdownMenuCheckboxItem toggles boolean view preferences and persists checked state. */
export function DropdownMenuCheckboxDemo() {
  const [statusBar, setStatusBar] = useState(true);
  const [activityBar, setActivityBar] = useState(false);
  const [panel, setPanel] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Toggle panels</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
          Status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={activityBar} onCheckedChange={setActivityBar}>
          Activity bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={panel} onCheckedChange={setPanel}>
          Bottom panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** DropdownMenuRadioGroup enforces a single active selection across a set of items. */
export function DropdownMenuRadioDemo() {
  const [position, setPosition] = useState('bottom');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Panel position</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** DropdownMenuShortcut renders right-aligned keyboard hints — purely visual, not functional. */
export function DropdownMenuShortcutsDemo() {
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

export const demoMeta = defineDemos([
  [DropdownMenuDefaultDemo, 'Default', { description: `Action menu with icons, grouped items, a separator, and a destructive item.` }],
  [DropdownMenuCheckboxDemo, 'Checkbox', { description: `DropdownMenuCheckboxItem toggles boolean view preferences and persists checked state.` }],
  [DropdownMenuRadioDemo, 'Radio', { description: `DropdownMenuRadioGroup enforces a single active selection across a set of items.` }],
  [DropdownMenuShortcutsDemo, 'Shortcuts', { description: `DropdownMenuShortcut renders right-aligned keyboard hints — purely visual, not functional.` }],
]);
export const accessibility: readonly string[] = [
  `Arrow keys navigate items; Enter/Space activate; Escape closes and returns focus to the trigger.`,
  `Checkbox items carry \`aria-checked\`; radio items carry \`aria-checked\` within a \`role="group"\`.`,
  `\`DropdownMenuShortcut\` renders keyboard hints — these are visual only and not announced by AT.`,
  `Destructive items should use \`variant="destructive"\` to make intent clear visually and in context.`,
];
