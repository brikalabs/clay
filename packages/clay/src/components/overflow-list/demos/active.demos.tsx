'use client';

import { Badge } from '@brika/clay/components/badge';
import {
  OverflowList,
  OverflowListContent,
  OverflowListIndicator,
  OverflowListItem,
  useOverflowList,
} from '@brika/clay/components/overflow-list';
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
export default function OverflowListActiveDemo() {
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
              className={visible.some((v) => v.id === env.id) ? '' : 'invisible'}
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
