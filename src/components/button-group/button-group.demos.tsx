import { Button } from '@brika/clay/components/button';
import { ButtonGroup } from '@brika/clay/components/button-group';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Three related outline buttons joined in a shared frame. */
export function ButtonGroupDefaultDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Bold</Button>
      <Button variant="outline">Italic</Button>
      <Button variant="outline">Underline</Button>
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

/** Icon-only buttons for compact toolbars — every button needs an `aria-label`. */
export function ButtonGroupIconsDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Align left">
        <AlignLeft />
      </Button>
      <Button variant="outline" size="icon" aria-label="Align center">
        <AlignCenter />
      </Button>
      <Button variant="outline" size="icon" aria-label="Align right">
        <AlignRight />
      </Button>
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
  [ButtonGroupDefaultDemo, 'Default', { description: `Three related outline buttons joined in a shared frame.` }],
  [ButtonGroupFilledDemo, 'Filled', { description: `Filled default variant inside a group — good for primary action clusters.` }],
  [ButtonGroupIconsDemo, 'Icons', { description: `Icon-only buttons for compact toolbars — every button needs an \`aria-label\`.` }],
  [ButtonGroupVerticalDemo, 'Vertical', { description: `Vertical orientation stacks buttons top-to-bottom with shared dividers.` }],
]);
export const accessibility: readonly string[] = [
  `The wrapper carries \`role="group"\` — add \`aria-label\` when the group's purpose is not clear from context.`,
  `Each button inside the group keeps its individual focus ring and keyboard behavior.`,
  `Icon-only buttons inside the group still require \`aria-label\`.`,
];
