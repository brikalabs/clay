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
  Clock,
  FileText,
  Settings,
  User,
} from 'lucide-react';
/** Three groups, Suggestions, Recent, and Settings, with icons on every item. */
export default function CommandGroupsDemo() {
  return (
    <Command className="rounded-lg border shadow-md w-80">
      <CommandInput placeholder="Search or run a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            Open calendar
          </CommandItem>
          <CommandItem>
            <Calculator />
            Open calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent">
          <CommandItem>
            <Clock />
            Design review, yesterday
          </CommandItem>
          <CommandItem>
            <FileText />
            Q1 report draft
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            Account
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            Preferences
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
