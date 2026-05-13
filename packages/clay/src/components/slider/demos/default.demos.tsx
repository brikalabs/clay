import { Slider, SliderValue } from '@brika/clay/components/slider';
import { useState } from 'react';
export default function SliderDefaultDemo() {
  const [value, setValue] = useState(50);
  return (
    <div className="flex w-full max-w-xs items-center gap-2">
      <Slider value={value} onChange={setValue} min={0} max={100} step={1} className="flex-1" />
      <SliderValue value={value} onChange={setValue} min={0} max={100} step={1} unit="%" />
    </div>
  );
}
