/**
 * Layer-2 tokens for Icon. Includes the bare `--icon` color token (no
 * slot suffix) which falls outside `defineComponent`'s `<name>-<slot>`
 * convention, appended hand-authored via `register` after the regular
 * slot tokens.
 */

import { registerComponent } from '../../tokens/define';
import { register } from '../../tokens/registry-state';

registerComponent('icon', {
  slots: {
    muted: { default: 'var(--muted-foreground)', description: 'Muted icon color.' },
    primary: {
      default: 'var(--primary)',
      description: 'Primary icon color (interactive accents).',
    },
  },
});

// `--icon` (no suffix), bare token for the default icon color. Falls
// outside the `<name>-<slot>` convention `defineComponent` enforces.
register([
  {
    name: 'icon',
    layer: 'component',
    category: 'color',
    appliesTo: 'icon',
    defaultLight: 'var(--foreground)',
    description: 'Default icon color.',
    themePath: 'components.icon.default',
    tailwindNamespace: 'color',
  },
]);
