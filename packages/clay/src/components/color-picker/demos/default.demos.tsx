import { ColorPicker } from '@brika/clay/components/color-picker';
import { useState } from 'react';

/** Default picker, full chrome, controlled. */
export default function ColorPickerDefaultDemo() {
  const [color, setColor] = useState('#3b82f6');
  return <ColorPicker value={color} onChange={setColor} />;
}
