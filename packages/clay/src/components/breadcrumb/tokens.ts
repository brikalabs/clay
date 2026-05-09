/**
 * Layer-2 tokens for Breadcrumb. Routes the hardcoded role-token
 * colors (`text-muted-foreground`, `text-foreground`,
 * `hover:text-foreground`) through per-component slots so consumers
 * can recolor links, the current page, and the separator
 * independently while preserving default visuals.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'link-foreground': {
      default: 'var(--muted-foreground)',
      description: 'Resting text color of breadcrumb links and the surrounding list (inactive crumbs).',
    },
    'link-hover-foreground': {
      default: 'var(--foreground)',
      description: 'Text color of a breadcrumb link on hover.',
    },
    'page-foreground': {
      default: 'var(--foreground)',
      description: 'Text color of the current-page crumb (the last item, marked `aria-current="page"`).',
    },
    'separator-color': {
      default: 'var(--muted-foreground)',
      description: 'Color of the separator glyph between breadcrumb items.',
    },
  },
});
