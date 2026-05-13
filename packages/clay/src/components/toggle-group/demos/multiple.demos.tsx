import { ToggleGroup, ToggleGroupItem } from '@brika/clay/components/toggle-group';
import { Bold, Italic, Underline } from 'lucide-react';

/** Multiple-selection formatting group, any combination can be active. */
export default function ToggleGroupMultipleDemo() {
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
