'use client';

import { Badge } from '@brika/clay/components/badge';
import {
  OverflowList,
  OverflowListContent,
  OverflowListIndicator,
  OverflowListItem,
  useOverflowList,
} from '@brika/clay/components/overflow-list';
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
export default function OverflowListDefaultDemo() {
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
