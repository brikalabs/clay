/**
 * Layer-2 tokens for Pagination. Routes resting, hover, and current-page
 * surfaces through per-component slots so consumers can recolor inactive
 * page links, the hover affordance, and the outlined "current page"
 * indicator independently while preserving default visuals.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'link-container': {
      default: 'var(--background)',
      description: 'Resting background of a page-link item (transparent-feeling against the page).',
    },
    'link-label': {
      default: 'var(--foreground)',
      description: 'Resting text/icon color of a page-link item, including the prev/next arrows.',
    },
    'link-hover-container': {
      default: 'var(--accent)',
      description: 'Background fill of a page-link item on hover or keyboard focus.',
    },
    'link-hover-label': {
      default: 'var(--accent-foreground)',
      description: 'Text/icon color of a page-link item on hover or keyboard focus.',
    },
    'link-active-container': {
      default: 'var(--background)',
      description: 'Background fill of the current-page link (kept neutral so the outline reads).',
    },
    'link-active-label': {
      default: 'var(--foreground)',
      description: 'Text color of the current-page link.',
    },
    'link-active-border': {
      default: 'var(--border)',
      description: 'Outline color drawn around the current-page link to mark `aria-current="page"`.',
    },
    'ellipsis-color': {
      default: 'var(--muted-foreground)',
      description: 'Color of the `...` truncation glyph between page-link clusters.',
    },
  },
});
