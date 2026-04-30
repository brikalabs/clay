'use client';

import {
  Command,
  CommandDialog,
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
  LayoutDashboard,
  Settings,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { defineDemos } from '../_registry';

/** Inline command palette with grouped items, icons, and keyboard shortcuts. */
export function CommandDefaultDemo() {
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

/** Modal command palette triggered by Cmd+K — the standard power-user pattern. */
export function CommandDialogDemo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <p className="text-muted-foreground text-sm">
        Press{' '}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>{' '}
        to open the command palette.
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => setOpen(false)}>
              <LayoutDashboard />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <FileText />
              Documents
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => setOpen(false)}>
              <User />
              Profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Settings />
              Settings
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

/** Three groups — Suggestions, Recent, and Settings — with icons on every item. */
export function CommandGroupsDemo() {
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
            Design review — yesterday
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

export const demoMeta = defineDemos([
  [CommandDefaultDemo, 'Default', { description: `Inline command palette with grouped items, icons, and keyboard shortcuts.` }],
  [CommandDialogDemo, 'Dialog', { description: `Modal command palette triggered by Cmd+K — the standard power-user pattern.` }],
  [CommandGroupsDemo, 'Groups', { description: `Three groups — Suggestions, Recent, and Settings — with icons on every item.` }],
]);
export const accessibility: readonly string[] = [
  `Arrow keys navigate list items; Enter activates the focused item.`,
  `The input is always focused while the list is visible — Tab closes the command palette.`,
  `Grouped items announce their group heading; \`CommandEmpty\` is announced when no results match.`,
  `Wrap in \`CommandDialog\` for modal use — adds focus trapping and Escape-to-close.`,
];
