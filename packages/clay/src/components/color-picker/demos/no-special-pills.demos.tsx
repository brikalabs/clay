import { ColorPicker } from '@brika/clay/components/color-picker';
import { useState } from 'react';

/**
 * Without the special-keyword pills, useful when the slot must be a real color.
 * @title No special pills
 */
export default function ColorPickerNoSpecialDemo() {
  const [color, setColor] = useState('#a855f7');
  return <ColorPicker value={color} onChange={setColor} specialKeywords={[]} />;
}
