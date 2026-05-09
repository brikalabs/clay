/**
 * Layer-2 tokens for SectionLabel.
 *
 * SectionLabel is a small uppercase group header with an optional left-side
 * icon whose color shifts by `tone`. The wrapper text and the default icon
 * tone share a single muted color slot; the destructive icon tone is exposed
 * separately so a theme can re-tint dangerous-action labels independently of
 * the muted body text. Status tones (`warning`, `success`, `info`) keep
 * their semantic root vars and are not routed here.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    color: {
      default: 'var(--muted-foreground)',
      description:
        'Foreground color of the section label text and the default-tone icon. Defaults to the muted role so the label reads as quiet metadata above a content group.',
    },
    'icon-destructive-color': {
      default: 'var(--destructive)',
      description:
        'Icon color used when `tone="destructive"` flags an error or dangerous-action label.',
    },
  },
});
