import { Button } from '@brika/clay/components/button';
import {
  ColorPicker,
  ColorPickerSwatch,
} from '@brika/clay/components/color-picker';
import { useState } from 'react';

/**
 * `currentColor` keyword, the trigger swatch picks up the surrounding text color.
 * @title currentColor
 */
export default function ColorPickerCurrentColorDemo() {
  const [color, setColor] = useState('currentColor');
  return (
    <div className="flex items-start gap-4 text-blue-600 dark:text-blue-400">
      <Button variant="outline" className="gap-2 font-mono">
        <ColorPickerSwatch value={color} />
        {color}
      </Button>
      <ColorPicker value={color} onChange={setColor} />
    </div>
  );
}
