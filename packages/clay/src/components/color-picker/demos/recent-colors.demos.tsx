import { Button } from '@brika/clay/components/button';
import { ColorPicker } from '@brika/clay/components/color-picker';
import { useState } from 'react';

/**
 * Recent-colors strip with a tiny in-memory store, plus a "Save" button.
 * @title Recent colors
 */
export default function ColorPickerRecentDemo() {
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
