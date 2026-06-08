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
  description:
    'Syntax-highlighted code with a copy button and optional line numbers. Switch between multiple files via a header tab bar or a dropdown (each with optional file-type icons), or drop the header entirely. Powered by Shiki.',
  badge: 'Updated',
  externalDocs: [{ label: "Shiki", url: "https://shiki.style" }],
  accessibility: [
    'Code blocks are non-interactive regions; Tab moves through the copy button, not character by character.',
    'Copy button carries `aria-label="Copy code"` and should announce success state via a live region.',
    'Multi-file blocks follow the WAI-ARIA tabs pattern (`role="tablist"`/`tab`/`tabpanel`); Left/Right arrows switch files.',
    'Syntax highlighting is visual only; AT reads the raw code text without colour cues.',
  ],
};
