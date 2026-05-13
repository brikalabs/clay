import { Toggle } from '@brika/clay/components/toggle';
import { Bold, Italic, Underline } from 'lucide-react';

/** Multiple small icon toggles for a rich-text formatting toolbar. */
export default function ToggleFormattingDemo() {
  return (
    <div className="flex gap-1">
      <Toggle size="sm" aria-label="Bold">
        <Bold />
      </Toggle>
      <Toggle size="sm" aria-label="Italic">
        <Italic />
      </Toggle>
      <Toggle size="sm" aria-label="Underline">
        <Underline />
      </Toggle>
    </div>
  );
}
