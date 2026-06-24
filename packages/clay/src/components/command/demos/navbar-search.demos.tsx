'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInputControl,
  CommandItem,
  CommandList,
} from '@brika/clay/components/command';
import {
  InputGroup,
  InputGroupAddon,
} from '@brika/clay/components/input-group';
import { Kbd } from '@brika/clay/components/kbd';
import { FileText, LayoutDashboard, Package, Search, User } from 'lucide-react';
import { useState } from 'react';

/**
 * Navbar-style search bar: CommandInputControl embedded in an InputGroup
 * for the focus halo, with CommandList rendered as an absolute dropdown
 * below. The Command palette mode and this detached mode are fully
 * independent parts of the same component tree.
 */
export default function CommandNavbarSearchDemo() {
  const [query, setQuery] = useState('');

  return (
    <div className="w-full max-w-sm">
      <Command shouldFilter={false} className="relative overflow-visible bg-transparent shadow-none">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Search className="size-4" />
          </InputGroupAddon>
          <CommandInputControl
            placeholder="Search..."
            value={query}
            onValueChange={setQuery}
          />
          <InputGroupAddon align="inline-end">
            <Kbd>K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        {query.length > 0 && (
          <CommandList className="absolute top-full left-0 z-50 mt-2 w-full rounded-input border border-input-group-border bg-popover text-popover-foreground shadow-overlay">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              <CommandItem onSelect={() => setQuery('')}>
                <LayoutDashboard />
                Dashboard
              </CommandItem>
              <CommandItem onSelect={() => setQuery('')}>
                <FileText />
                Documents
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Packages">
              <CommandItem onSelect={() => setQuery('')}>
                <Package />
                @brika/clay
              </CommandItem>
              <CommandItem onSelect={() => setQuery('')}>
                <User />
                Profile
              </CommandItem>
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}
