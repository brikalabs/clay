import { Button } from '@brika/clay/components/button';
import {
  ColorPicker,
  ColorPickerSwatch,
} from '@brika/clay/components/color-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@brika/clay/components/popover';
import { useState } from 'react';

/**
 * Inside a popover, with a `<Button>` trigger that previews the value.
 * @title In a popover
 */
export default function ColorPickerInPopoverDemo() {
  const [color, setColor] = useState('#10b981');
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 font-mono">
          <ColorPickerSwatch value={color} />
          {color}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" sideOffset={6}>
        <ColorPicker value={color} onChange={setColor} />
      </PopoverContent>
    </Popover>
  );
}
