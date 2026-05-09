import { registerComponent } from '../../tokens/define';
import { SPACING_1, SPACING_2, SPACING_4 } from '../../tokens/spacing';
import { meta } from './meta';

// Calendar renders inside a `card`-shorthand surface, so the `surface`
// bundle (border + motion) and the `gap` geometry slot would never reach
// any element. Only the tokens actually consumed by `calendar.tsx`
// utility classes are registered.
registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Calendar day button corner radius.',
  },
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the calendar surface. Set non-zero for a frosted-glass treatment.',
  },
  geometry: { paddingX: SPACING_4, paddingY: SPACING_4 },
  slots: {
    'range-margin-y': {
      default: SPACING_1,
      description:
        'Vertical margin between the range highlight bar and the cell edges. Increase to leave more breathing room above and below the bar.',
      type: 'size',
    },
    'range-backdrop-blur': {
      default: '0px',
      description:
        'Backdrop blur applied to the range highlight bar. Set non-zero for a frosted-glass treatment on the bar itself, independent of the surface blur.',
    },
    'week-margin-y': {
      default: SPACING_2,
      description:
        'Vertical margin between week rows. Adds breathing room between rows independent of the bar height; useful when the range bar fills the full cell.',
      type: 'size',
    },
    'week-separator-width': {
      default: '1px',
      description:
        'Width of the horizontal divider drawn below each week row. Set to `0px` to hide the separator entirely.',
      type: 'border-width',
    },
    'week-separator-color': {
      default: 'var(--border)',
      description:
        'Color of the row separator drawn below each week. Inherits the theme border color by default; only visible when `week-separator-width` is non-zero.',
    },
    'range-bar': {
      default: 'color-mix(in oklch, var(--primary) 15%, transparent)',
      description: 'Background color of the range highlight bar between the start and end days.',
    },
    'range-bar-hover': {
      default: 'color-mix(in oklch, var(--primary) 20%, transparent)',
      description:
        'Hover background tint applied over the range bar on range_middle days. Should be slightly more opaque than `range-bar` to read as a hover state.',
    },
    'pill': {
      default: 'var(--primary)',
      description:
        'Background color of the solid day pill for single-day selections and range endpoints (start/end).',
    },
    'pill-foreground': {
      default: 'var(--primary-foreground)',
      description: 'Text color of the solid day pill.',
    },
    'today': {
      default: 'var(--accent)',
      description: 'Background color of the today indicator when the day is not selected.',
    },
    'today-foreground': {
      default: 'var(--accent-foreground)',
      description: 'Text color of the today indicator when the day is not selected.',
    },
    'day-hover': {
      default: 'var(--accent)',
      description:
        'Background color of a day on hover when it is neither today, selected, nor in a range middle.',
    },
    'day-hover-foreground': {
      default: 'var(--accent-foreground)',
      description: 'Text color of a day on hover.',
    },
    'weekday-foreground': {
      default: 'var(--muted-foreground)',
      description: 'Text color of the weekday-name header row (Su, Mo, Tu, …).',
    },
    'outside-foreground': {
      default: 'var(--muted-foreground)',
      description:
        'Text color of days that fall outside the visible month (the leading/trailing greyed-out dates).',
    },
    'surface-container': {
      default: 'var(--card)',
      description:
        'Background color of the calendar surface. Defaults to the theme `--card` so the calendar reads as a card-shorthand surface.',
    },
    'surface-label': {
      default: 'var(--card-foreground)',
      description:
        'Default text color of the calendar surface (caption, day numbers). Defaults to the theme `--card-foreground`.',
    },
    'surface-border': {
      default: 'var(--border)',
      description:
        'Border color drawn around the calendar surface. Defaults to the theme `--border`.',
    },
    'range-middle-foreground': {
      default: 'var(--foreground)',
      description:
        'Text color of day numbers inside a selected range (excluding the start/end pills). Defaults to the theme `--foreground`.',
    },
  },
});
