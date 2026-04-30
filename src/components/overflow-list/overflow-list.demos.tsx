'use client';

import { Badge } from '@brika/clay/components/badge';
import {
  OverflowList,
  OverflowListContent,
  OverflowListIndicator,
  OverflowListItem,
  useOverflowList,
} from '@brika/clay/components/overflow-list';
import { defineDemos } from '../_registry';

const TAGS = [
  'production',
  'staging',
  'eu-west-1',
  'us-east-1',
  'ap-southeast-2',
  'cdn',
  'edge',
  'preview',
];

/** Tags that overflow the container collapse into a "+N more" badge. Resize the window to see it adapt. */
export function OverflowListDefaultDemo() {
  const { containerRef, visible, overflow } = useOverflowList({
    items: TAGS,
    getKey: (t) => t,
  });

  return (
    <OverflowList className="w-full max-w-sm">
      <OverflowListContent ref={containerRef}>
        {TAGS.map((tag) => (
          <OverflowListItem key={tag} itemId={tag}>
            <Badge variant={visible.includes(tag) ? 'outline' : 'secondary'}>{tag}</Badge>
          </OverflowListItem>
        ))}
      </OverflowListContent>
      <OverflowListIndicator active={overflow.length > 0}>
        <Badge>+{overflow.length} more</Badge>
      </OverflowListIndicator>
    </OverflowList>
  );
}

const ENVIRONMENTS = [
  { id: 'production', label: 'production' },
  { id: 'staging', label: 'staging' },
  { id: 'preview-1', label: 'preview-1' },
  { id: 'preview-2', label: 'preview-2' },
  { id: 'review-app', label: 'review-app' },
  { id: 'nightly', label: 'nightly' },
  { id: 'canary', label: 'canary' },
];

/** The active item is always kept visible even when it would otherwise be hidden. */
export function OverflowListActiveDemo() {
  const { containerRef, visible, overflow } = useOverflowList({
    items: ENVIRONMENTS,
    getKey: (e) => e.id,
    activeKey: 'nightly',
  });

  return (
    <OverflowList className="w-full max-w-xs">
      <OverflowListContent ref={containerRef}>
        {ENVIRONMENTS.map((env) => (
          <OverflowListItem key={env.id} itemId={env.id}>
            <Badge
              variant={env.id === 'nightly' ? 'default' : 'outline'}
              className={visible.find((v) => v.id === env.id) ? '' : 'invisible'}
            >
              {env.label}
            </Badge>
          </OverflowListItem>
        ))}
      </OverflowListContent>
      <OverflowListIndicator active={overflow.length > 0}>
        <Badge variant="secondary">+{overflow.length}</Badge>
      </OverflowListIndicator>
    </OverflowList>
  );
}

export const demoMeta = defineDemos([
  [OverflowListDefaultDemo, 'Default', { description: `Tags that overflow the container collapse into a "+N more" badge. Resize the window to see it adapt.` }],
  [OverflowListActiveDemo, 'Active', { description: `The active item is always kept visible even when it would otherwise be hidden.` }],
]);
export const accessibility: readonly string[] = [
  `Hidden items remain in the DOM — the indicator communicates the count to all users.`,
  `The \`activeKey\` item is always visible; this preserves context for the current selection.`,
  `Consider wrapping the indicator in a \`Popover\` or \`Tooltip\` to reveal hidden items on demand.`,
];
