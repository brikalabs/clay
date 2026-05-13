import { Toggle } from '@brika/clay/components/toggle';
import { Bold, Italic } from 'lucide-react';

/** Two variants: default (transparent background) and outline (bordered). */
export default function ToggleVariantsDemo() {
  return (
    <div className="flex gap-2">
      <Toggle variant="default" aria-label="Default">
        <Bold />
        Default
      </Toggle>
      <Toggle variant="outline" aria-label="Outline">
        <Italic />
        Outline
      </Toggle>
    </div>
  );
}
