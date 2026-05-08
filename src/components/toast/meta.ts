/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'toast',
  displayName: 'Toast',
  group: 'Feedback',
  description: 'Transient notification surface built on Sonner. Mount one <Toaster /> near the app root, then push notifications anywhere with the imperative toast() API.',
  externalDocs: [{ label: "Sonner", url: "https://sonner.emilkowal.ski" }],
  accessibility: [
    'Built on Sonner\'s `aria-live` region, announcements fire automatically.',
    'Auto-dismiss duration defaults to 4 s; override via `toast(msg, { duration })` for critical messages.',
    'Action buttons inside toasts should have descriptive `label` text.',
    'Respects `prefers-reduced-motion`, animations are skipped for users with motion sensitivity.',
  ],
};
