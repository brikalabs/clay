import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'OTP slot corner radius.',
  },
  surface: { borderWidth: '1px' },
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the input-otp slot surface. Set non-zero for a frosted-glass treatment.',
  },
  slots: {
    size: { default: '2.5rem', description: 'OTP slot width and height.' },
    container: {
      default: 'var(--input-container)',
      description: 'Background color of each OTP slot in its resting state.',
    },
    border: {
      default: 'var(--input-border)',
      description: 'Border color of each OTP slot in its resting state.',
    },
    label: {
      default: 'var(--foreground)',
      description: 'Foreground color of the entered character rendered inside an OTP slot.',
    },
    'focus-border': {
      default: 'var(--ring)',
      description: 'Border color of the active OTP slot (`data-active=true`).',
    },
    'focus-ring': {
      default: 'var(--ring)',
      description:
        'Color of the 3px focus halo painted around the active OTP slot. Rendered at 50% opacity to soften the outer glow.',
    },
    'invalid-ring': {
      default: 'var(--destructive)',
      description:
        'Single color driving the invalid state on an OTP slot: the border uses it directly while the surrounding ring uses it at 20% opacity.',
    },
    'placeholder-color': {
      default: 'var(--muted-foreground)',
      description:
        'Fill color of the placeholder dot rendered in an empty, non-focused OTP slot. Applied at 40% opacity in the rendered output.',
    },
    'caret-color': {
      default: 'var(--foreground)',
      description: 'Color of the blinking fake caret rendered inside the active OTP slot.',
    },
    'separator-color': {
      default: 'var(--muted-foreground)',
      description: 'Color of the minus icon used as a visual separator between OTP groups.',
    },
  },
  typography: { fontSize: 'var(--text-body-md)', fontWeight: '500' },
});
