import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'handle-size': { default: '1px', description: 'Resize handle thickness along the resize axis.' },
    'handle-color': { default: 'var(--border)', description: 'Resting handle color.' },
    'handle-hover': {
      default: 'var(--primary)',
      description: 'Hover-state handle color; applied at 40% opacity.',
    },
    'handle-ring': {
      default: 'var(--ring)',
      description: 'Focus ring color drawn around the handle when keyboard-focused.',
    },
    'grip-border': {
      default: 'var(--border)',
      description: 'Border color of the optional grip pill rendered when `withHandle` is set.',
    },
    'grip-container': {
      default: 'var(--background)',
      description: 'Background fill of the optional grip pill rendered when `withHandle` is set.',
    },
    'grip-icon': {
      default: 'var(--muted-foreground)',
      description: 'Icon color of the grip glyph drawn inside the optional grip pill.',
    },
  },
});
