import { ToggleGroup, ToggleGroupItem } from '@brika/clay/components/toggle-group';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

/** Single-selection alignment picker, only one item active at a time. */
export default function ToggleGroupDefaultDemo() {
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
