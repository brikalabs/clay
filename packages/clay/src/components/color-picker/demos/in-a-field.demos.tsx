import { Button } from '@brika/clay/components/button';
import {
  ColorPicker,
  ColorPickerSwatch,
} from '@brika/clay/components/color-picker';
import { Field, FieldLabel } from '@brika/clay/components/field';
import { Popover, PopoverContent, PopoverTrigger } from '@brika/clay/components/popover';
import { useState } from 'react';

/**
 * Inside a `<Field>` with a label, the form-pattern usage.
 * @title In a field
 */
export default function ColorPickerInFieldDemo() {
  const [color, setColor] = useState('#f59e0b');
  return (
    <Field>
      <FieldLabel>Brand color</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2 font-mono">
            <ColorPickerSwatch value={color} />
            {color}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" sideOffset={6}>
          <ColorPicker
            value={color}
            onChange={setColor}
            specialKeywords={[]}
            showContrast={false}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
