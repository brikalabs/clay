import { ColorPicker } from '@brika/clay/components/color-picker';
import { useState } from 'react';

/**
 * Opaque picker, alpha controls and the alpha column are hidden.
 * @title No alpha
 */
export default function ColorPickerNoAlphaDemo() {
  const [color, setColor] = useState('#ef4444');
  return <ColorPicker value={color} onChange={setColor} showAlpha={false} />;
}
