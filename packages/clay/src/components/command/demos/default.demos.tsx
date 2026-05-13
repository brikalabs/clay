'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@brika/clay/components/command';
import {
  Calculator,
  Calendar,
  FileText,
  Settings,
  User,
} from 'lucide-react';
/** Inline command palette with grouped items, icons, and keyboard shortcuts. */
export default function CommandDefaultDemo() {
  return (
    <Command className="rounded-lg border shadow-md w-72">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            Calendar
          </CommandItem>
          <CommandItem>
            <Calculator />
            Calculator
          </CommandItem>
          <CommandItem>
            <FileText />
            New document
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
