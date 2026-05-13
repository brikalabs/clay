import { Toggle } from '@brika/clay/components/toggle';
import { Bold } from 'lucide-react';

/** A single toggle button that stays pressed until clicked again. */
export default function ToggleDefaultDemo() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold />
    </Toggle>
  );
}
