import { Slider } from '@brika/clay/components/slider';
import { useState } from 'react';
export default function SliderStepIntervalDemo() {
  const [value, setValue] = useState(6);
  return (
    <div className="w-full max-w-xs">
      <Slider value={value} onChange={setValue} min={0} max={20} step={1} ticks={2} tickLabels />
    </div>
  );
}
