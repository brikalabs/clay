/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'code-block',
  displayName: 'Code Block',
  group: 'Data',
  description: 'Syntax-highlighted code with copy button. Powered by Shiki.',
  externalDocs: [{ label: "Shiki", url: "https://shiki.style" }],
  accessibility: [
    'Code blocks are non-interactive regions; Tab moves through the copy button, not character by character.',
    'Copy button carries `aria-label="Copy code"` and should announce success state via a live region.',
    'Syntax highlighting is visual only; AT reads the raw code text without colour cues.',
  ],
};
