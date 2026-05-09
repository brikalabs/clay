/**
 * Layer-2 tokens for Select.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Select trigger corner radius.',
  },
  surface: { borderWidth: '1px' },
  geometry: { height: '2.25rem', paddingX: SPACING_3, paddingY: SPACING_2, gap: SPACING_2 },
  typography: { fontSize: 'var(--text-body-md)' },
  slots: {
    'trigger-container': {
      default: 'var(--input-container)',
      description: 'Background of the select trigger in its resting state.',
    },
    'trigger-label': {
      default: 'var(--input-label)',
      description: 'Foreground color of the selected value rendered inside the trigger.',
    },
    'trigger-border': {
      default: 'var(--input-border)',
      description: 'Border color of the select trigger in its resting state.',
    },
    'trigger-placeholder': {
      default: 'var(--input-placeholder)',
      description: 'Foreground color of the placeholder shown when no value is selected.',
    },
    'trigger-hover-container': {
      default: 'var(--accent)',
      description: 'Background color of the select trigger on hover (dark theme only by default).',
    },
    'trigger-icon-color': {
      default: 'var(--muted-foreground)',
      description:
        'Default color of inline SVG icons inside the trigger (chevron, leading icon).',
    },
    'focus-ring': {
      default: 'var(--ring)',
      description: 'Color of the focus ring drawn around the trigger when focus-visible.',
    },
    'invalid-ring': {
      default: 'var(--destructive)',
      description:
        'Single color driving the invalid state: border uses it directly, ring uses it at 20% (light) / 40% (dark) opacity.',
    },
    'label-color': {
      default: 'var(--muted-foreground)',
      description: 'Foreground color of the SelectLabel section header inside the listbox.',
    },
  },
});
