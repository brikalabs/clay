import { Button } from '@brika/clay/components/button';
import {
  ColorPicker,
  ColorPickerSwatch,
} from '@brika/clay/components/color-picker';
import { Field, FieldLabel } from '@brika/clay/components/field';
import { Popover, PopoverContent, PopoverTrigger } from '@brika/clay/components/popover';
import { useState } from 'react';
import { defineDemos } from '../../component-registry';

/** Default picker, full chrome, controlled. */
export function ColorPickerDefaultDemo() {
  const [color, setColor] = useState('#3b82f6');
  return <ColorPicker value={color} onChange={setColor} />;
}

/** Inside a popover, with a `<Button>` trigger that previews the value. */
export function ColorPickerInPopoverDemo() {
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

/** Inside a `<Field>` with a label, the form-pattern usage. */
export function ColorPickerInFieldDemo() {
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

/** Opaque picker, alpha controls and the alpha column are hidden. */
export function ColorPickerNoAlphaDemo() {
  const [color, setColor] = useState('#ef4444');
  return <ColorPicker value={color} onChange={setColor} showAlpha={false} />;
}

/** Without the special-keyword pills, useful when the slot must be a real color. */
export function ColorPickerNoSpecialDemo() {
  const [color, setColor] = useState('#a855f7');
  return <ColorPicker value={color} onChange={setColor} specialKeywords={[]} />;
}

/** Recent-colors strip with a tiny in-memory store, plus a "Save" button. */
export function ColorPickerRecentDemo() {
  const [color, setColor] = useState('#f97316');
  const [recent, setRecent] = useState<string[]>(['#0ea5e9', '#22c55e', '#facc15']);
  const save = () =>
    setRecent((prev) =>
      [color, ...prev.filter((v) => v.toLowerCase() !== color.toLowerCase())].slice(0, 12)
    );
  return (
    <div className="flex flex-col gap-3">
      <ColorPicker
        value={color}
        onChange={setColor}
        recentColors={recent}
        onAddRecent={(c) =>
          setRecent((prev) =>
            [c, ...prev.filter((v) => v.toLowerCase() !== c.toLowerCase())].slice(0, 12)
          )
        }
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={save}>
          Save to recents
        </Button>
      </div>
    </div>
  );
}

/** `currentColor` keyword, the trigger swatch picks up the surrounding text color. */
export function ColorPickerCurrentColorDemo() {
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

export const demoMeta = defineDemos([
  [ColorPickerDefaultDemo, 'Default', { description: 'Default picker, full chrome, controlled.' }],
  [ColorPickerInPopoverDemo, 'In a popover', { description: 'Inside a popover, with a `<Button>` trigger that previews the value.' }],
  [ColorPickerInFieldDemo, 'In a field', { description: 'Inside a `<Field>` with a label, the form-pattern usage.' }],
  [ColorPickerNoAlphaDemo, 'No alpha', { description: 'Opaque picker, alpha controls and the alpha column are hidden.' }],
  [ColorPickerNoSpecialDemo, 'No special pills', { description: 'Without the special-keyword pills, useful when the slot must be a real color.' }],
  [ColorPickerRecentDemo, 'Recent colors', { description: 'Recent-colors strip with a tiny in-memory store, plus a "Save" button.' }],
  [ColorPickerCurrentColorDemo, 'currentColor', { description: '`currentColor` keyword, the trigger swatch picks up the surrounding text color.' }],
]);
