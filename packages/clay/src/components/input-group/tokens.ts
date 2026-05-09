/**
 * Layer-2 tokens for InputGroup.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the input-group surface. Set non-zero for a frosted-glass treatment.',
  },
  slots: {
    container: {
      default: 'var(--input-container)',
      description:
        'Background color of the InputGroup wrapper. Inherits the standalone Input container so themes that retune `--input-container` retune the group automatically.',
    },
    label: {
      default: 'var(--input-label)',
      description:
        'Default foreground color of text rendered inside the InputGroup wrapper. Mirrors `--input-label`.',
    },
    border: {
      default: 'var(--input-border)',
      description: 'Resting border color of the InputGroup wrapper. Mirrors `--input-border`.',
    },
    'focus-border': {
      default: 'var(--ring)',
      description:
        'Border color drawn on the wrapper when the inner control receives keyboard focus (`focus-visible`). Pairs with `focus-ring` to render the focus halo.',
    },
    'focus-ring': {
      default: 'var(--ring)',
      description:
        'Color of the 3px focus halo painted around the wrapper when the inner control is focus-visible. Rendered at 50% opacity to soften the outer glow.',
    },
    'invalid-ring': {
      default: 'var(--destructive)',
      description:
        'Single color driving the invalid state: the wrapper border uses it directly while the surrounding ring uses it at 20% (light) / 40% (dark) opacity.',
    },
    'addon-label': {
      default: 'var(--muted-foreground)',
      description:
        'Foreground color of inline addon content (icons, text, kbd) docked at the start or end of the group.',
    },
    'text-label': {
      default: 'var(--muted-foreground)',
      description:
        'Foreground color of `InputGroupText` spans rendered inside the group (helper labels, separators).',
    },
  },
});
