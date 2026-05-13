import { Toggle } from '@brika/clay/components/toggle';
import { Bold } from 'lucide-react';

/** Three size presets side by side. */
export default function ToggleSizesDemo() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" aria-label="Small bold">
        <Bold />
      </Toggle>
      <Toggle size="default" aria-label="Default bold">
        <Bold />
      </Toggle>
      <Toggle size="lg" aria-label="Large bold">
        <Bold />
      </Toggle>
    </div>
  );
}
