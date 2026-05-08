/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'input-otp',
  displayName: 'Input OTP',
  group: 'Forms',
  description: 'An accessible one-time password input with individual character slots and paste support.',
  externalDocs: [{ label: "input-otp", url: "https://input-otp.rodz.dev" }],
  accessibility: [
    'Paste works out-of-the-box, pasting a code fills all slots.',
    'A single hidden `<input>` handles the value; each visible slot is a presentation of that input\'s characters.',
    'The active slot gets a focus ring matching the input\'s focus state.',
    'Numeric-only patterns should use `inputMode="numeric"` to bring up the numeric keyboard on mobile.',
  ],
};
