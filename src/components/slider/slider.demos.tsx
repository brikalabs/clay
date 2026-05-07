import { Slider, SliderValue } from '@brika/clay/components/slider';
import { useState } from 'react';
import { defineDemos } from '../_registry';

export function SliderDefaultDemo() {
  const [value, setValue] = useState(50);
  return (
    <div className="flex w-full max-w-xs items-center gap-2">
      <Slider value={value} onChange={setValue} min={0} max={100} step={1} className="flex-1" />
      <SliderValue value={value} onChange={setValue} min={0} max={100} step={1} unit="%" />
    </div>
  );
}

export function SliderStepDotsDemo() {
  const [value, setValue] = useState(4);
  return (
    <div className="w-full max-w-xs">
      <Slider value={value} onChange={setValue} min={0} max={10} step={1} ticks tickLabels />
    </div>
  );
}

export function SliderStepIntervalDemo() {
  const [value, setValue] = useState(6);
  return (
    <div className="w-full max-w-xs">
      <Slider value={value} onChange={setValue} min={0} max={20} step={1} ticks={2} tickLabels />
    </div>
  );
}

const PRESET_TICKS = [1, 3, 6, 12] as const;

export function SliderCustomTicksDemo() {
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

export const demoMeta = defineDemos([
  [SliderDefaultDemo, 'Default'],
  [SliderStepDotsDemo, 'Step Dots'],
  [SliderStepIntervalDemo, 'Step Interval'],
  [SliderCustomTicksDemo, 'Custom Ticks'],
]);
export const accessibility: readonly string[] = [
  `Built on a native \`<input type="range">\`, all keyboard and AT semantics are native.`,
  `Arrow keys adjust value by \`step\`; Home/End jump to \`min\`/\`max\`.`,
  `Always provide a visible label linked via \`htmlFor\` or wrapped \`<label>\`.`,
  `\`SliderValue\` pairing gives a numeric readout, include \`unit\` for percentage or currency.`,
];
