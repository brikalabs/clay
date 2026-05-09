/**
 * Layer-2 tokens for Sidebar.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the sidebar surface. Set non-zero for a frosted-glass treatment.',
  },
  slots: {
    width: { default: '16rem', description: 'Sidebar width when expanded.' },
    'width-icon': {
      default: '3rem',
      description: 'Sidebar width when collapsed to icon-only mode.',
    },
    'width-mobile': {
      default: '18rem',
      description: 'Sidebar width when shown as a mobile sheet.',
    },
    'inset-container': {
      default: 'var(--background)',
      description:
        'Background of the `<SidebarInset>` main content panel that sits next to the sidebar.',
    },
    'input-container': {
      default: 'var(--background)',
      description:
        'Background of the `<SidebarInput>` text field nested inside a sidebar header / footer.',
    },
  },
});
