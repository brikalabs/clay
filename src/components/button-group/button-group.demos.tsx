import { Button } from '@brika/clay/components/button';
import { ButtonGroup } from '@brika/clay/components/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@brika/clay/components/dropdown-menu';
import { Input } from '@brika/clay/components/input';
import { ChevronDown, ClipboardPaste, Copy, Scissors } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Three related action buttons joined in a shared frame — each click fires once, no selection state. */
export function ButtonGroupDefaultDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Reply</Button>
      <Button variant="outline">Reply all</Button>
      <Button variant="outline">Forward</Button>
    </ButtonGroup>
  );
}

/** Filled default variant inside a group — good for primary action clusters. */
export function ButtonGroupFilledDemo() {
  return (
    <ButtonGroup>
      <Button>Edit</Button>
      <Button>Preview</Button>
      <Button>Share</Button>
    </ButtonGroup>
  );
}

/** Icon-only action buttons for a compact toolbar — every button needs an `aria-label`. */
export function ButtonGroupIconsDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Cut">
        <Scissors />
      </Button>
      <Button variant="outline" size="icon" aria-label="Copy">
        <Copy />
      </Button>
      <Button variant="outline" size="icon" aria-label="Paste">
        <ClipboardPaste />
      </Button>
    </ButtonGroup>
  );
}

/** Input + trailing button — classic copy-URL pattern. The wrapper's `[&>input]:flex-1` rule lets the field stretch. */
export function ButtonGroupWithInputDemo() {
  return (
    <ButtonGroup className="w-full max-w-sm">
      <Input readOnly value="https://clay.brika.dev/share/abc123" />
      <Button variant="outline" size="icon" aria-label="Copy URL">
        <Copy />
      </Button>
    </ButtonGroup>
  );
}

/** Split button — primary action + dropdown chevron for related variants. */
export function ButtonGroupSplitDemo() {
  return (
    <ButtonGroup>
      <Button>Save changes</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" aria-label="More save options">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Save as draft</DropdownMenuItem>
          <DropdownMenuItem>Save and publish</DropdownMenuItem>
          <DropdownMenuItem>Save a copy</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

/** Vertical orientation stacks buttons top-to-bottom with shared dividers. */
export function ButtonGroupVerticalDemo() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">New file</Button>
      <Button variant="outline">Open folder</Button>
      <Button variant="outline">Recent</Button>
    </ButtonGroup>
  );
}

export const demoMeta = defineDemos([
  [ButtonGroupDefaultDemo, 'Default', { description: `Three related action buttons joined in a shared frame — each click fires once, no selection state.` }],
  [ButtonGroupFilledDemo, 'Filled', { description: `Filled default variant inside a group — good for primary action clusters.` }],
  [ButtonGroupIconsDemo, 'Icons', { description: `Icon-only action buttons for a compact toolbar — every button needs an \`aria-label\`.` }],
  [ButtonGroupWithInputDemo, 'With Input', { description: `Input + trailing button — classic copy-URL pattern.` }],
  [ButtonGroupSplitDemo, 'Split Button', { description: `Primary action plus a dropdown chevron for related variants.` }],
  [ButtonGroupVerticalDemo, 'Vertical', { description: `Vertical orientation stacks buttons top-to-bottom with shared dividers.` }],
]);
export const accessibility: readonly string[] = [
  `The wrapper carries \`role="group"\` — add \`aria-label\` when the group's purpose is not clear from context.`,
  `Each button inside the group keeps its individual focus ring and keyboard behavior.`,
  `Icon-only buttons inside the group still require \`aria-label\`.`,
];
