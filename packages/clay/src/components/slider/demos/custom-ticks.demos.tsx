import { Slider } from '@brika/clay/components/slider';
import { useState } from 'react';
const PRESET_TICKS = [1, 3, 6, 12] as const;

export default function SliderCustomTicksDemo() {
  const [value, setValue] = useState(3);
  return (
    <div className="w-full max-w-xs">
      <Slider
        value={value}
        onChange={setValue}
        min={0}
        max={12}
        step={1}
        ticks={PRESET_TICKS}
        tickLabels={(t) => `${t}mo`}
      />
    </div>
  );
}
