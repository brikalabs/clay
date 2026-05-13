import { Slider } from '@brika/clay/components/slider';
import { useState } from 'react';
export default function SliderStepDotsDemo() {
  const [value, setValue] = useState(4);
  return (
    <div className="w-full max-w-xs">
      <Slider value={value} onChange={setValue} min={0} max={10} step={1} ticks tickLabels />
    </div>
  );
}
