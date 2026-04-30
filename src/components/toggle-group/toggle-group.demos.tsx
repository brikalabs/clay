import { ToggleGroup, ToggleGroupItem } from '@brika/clay/components/toggle-group';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Single-selection alignment picker — only one item active at a time. */
export function ToggleGroupDefaultDemo() {
  return (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

/** Multiple-selection formatting group — any combination can be active. */
export function ToggleGroupMultipleDemo() {
  return (
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

/** Text-label items — suitable for view switchers and segmented controls. */
export function ToggleGroupTextDemo() {
  return (
    <ToggleGroup type="single" defaultValue="week" variant="outline">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  );
}

/** Individual items can be disabled while the rest remain interactive. */
export function ToggleGroupDisabledDemo() {
  return (
    <ToggleGroup type="single" defaultValue="viewer">
      <ToggleGroupItem value="viewer">Viewer</ToggleGroupItem>
      <ToggleGroupItem value="editor">Editor</ToggleGroupItem>
      <ToggleGroupItem value="admin" disabled>
        Admin
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export const demoMeta = defineDemos([
  [ToggleGroupDefaultDemo, 'Default', { description: `Single-selection alignment picker — only one item active at a time.` }],
  [ToggleGroupMultipleDemo, 'Multiple', { description: `Multiple-selection formatting group — any combination can be active.` }],
  [ToggleGroupTextDemo, 'Text', { description: `Text-label items — suitable for view switchers and segmented controls.` }],
  [ToggleGroupDisabledDemo, 'Disabled', { description: `Individual items can be disabled while the rest remain interactive.` }],
]);
export const accessibility: readonly string[] = [
  `Arrow keys navigate between items within the group; Space toggles the focused item.`,
  `\`type="single"\` enforces one active item at a time; \`type="multiple"\` allows combinations.`,
  `Icon-only items require \`aria-label\` on each \`ToggleGroupItem\`.`,
  `The group wrapper carries \`role="group"\` — add \`aria-label\` to describe the group's purpose.`,
];
