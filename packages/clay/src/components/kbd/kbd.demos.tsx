import { Button } from '@brika/clay/components/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@brika/clay/components/input-group';
import { Kbd, KbdGroup } from '@brika/clay/components/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
import { CornerDownLeftIcon, SearchIcon } from 'lucide-react';
import { defineDemos } from '../../component-registry';

/** Single key cap, use for one-press hints like the Command symbol. */
export function KbdDefaultDemo() {
  return <Kbd>⌘</Kbd>;
}

/** `KbdGroup` aligns a chord and exposes it as a single ARIA group. */
export function KbdGroupDemo() {
  return (
    <KbdGroup aria-label="Open command palette">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  );
}

/** Kbd flows inline with body copy thanks to `align-middle` and `inline-flex`. */
export function KbdInTextDemo() {
  return (
    <p className="text-sm">
      Press <Kbd>⌘</Kbd>
      <Kbd>K</Kbd> to open the command palette.
    </p>
  );
}

/** Kbd is `pointer-events-none`, so a key cap inside a button doesn't swallow clicks. */
export function KbdInButtonDemo() {
  return (
    <Button variant="outline">
      Accept
      <Kbd>
        <CornerDownLeftIcon />
      </Kbd>
    </Button>
  );
}

/** Inside `TooltipContent`, Kbd auto-recolors to read against the inverted surface. */
export function KbdInTooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Print</Button>
        </TooltipTrigger>
        <TooltipContent>
          Print the document
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>P</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/** Drop a chord into an `InputGroupAddon` to advertise a search shortcut. */
export function KbdInInputDemo() {
  return (
    <InputGroup className="w-full max-w-xs">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search the docs..." />
      <InputGroupAddon align="inline-end">
        <KbdGroup aria-label="Search shortcut">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  );
}

export const demoMeta = defineDemos([
  [KbdDefaultDemo, 'Default', { description: 'Single key cap, use for one-press hints like the Command symbol.' }],
  [KbdGroupDemo, 'Group', { description: '`KbdGroup` aligns a chord and exposes it as a single ARIA group.' }],
  [KbdInTextDemo, 'In Text', { description: 'Kbd flows inline with body copy thanks to `align-middle` and `inline-flex`.' }],
  [KbdInButtonDemo, 'In Button', { description: 'Kbd is `pointer-events-none`, so a key cap inside a button doesn\'t swallow clicks.' }],
  [KbdInTooltipDemo, 'In Tooltip', { description: 'Inside `TooltipContent`, Kbd auto-recolors to read against the inverted surface.' }],
  [KbdInInputDemo, 'In Input', { description: 'Drop a chord into an `InputGroupAddon` to advertise a search shortcut.' }],
]);
