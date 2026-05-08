/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'slider',
  displayName: 'Slider',
  group: 'Forms',
  description: `Single-thumb numeric range track. Optional tick dots and labels mark \`step\` increments, custom intervals, or preset positions. Pair with \`<SliderValue>\` when you need a numeric readout.`,
  accessibility: [
    `Built on a native \`<input type="range">\`, all keyboard and AT semantics are native.`,
    `Arrow keys adjust value by \`step\`; Home/End jump to \`min\`/\`max\`.`,
    `Always provide a visible label linked via \`htmlFor\` or wrapped \`<label>\`.`,
    `\`SliderValue\` pairing gives a numeric readout, include \`unit\` for percentage or currency.`,
  ],
};
