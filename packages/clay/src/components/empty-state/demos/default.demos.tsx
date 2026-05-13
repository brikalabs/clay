import { Button } from '@brika/clay/components/button';
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@brika/clay/components/empty-state';
import { Inbox } from 'lucide-react';

/** Inbox-zero placeholder, icon, title, description, and optional action. */
export default function EmptyStateDefaultDemo() {
  return (
    <EmptyState className="w-full max-w-md">
      <EmptyStateIcon>
        <Inbox />
      </EmptyStateIcon>
      <EmptyStateTitle>No messages yet</EmptyStateTitle>
      <EmptyStateDescription>
        You are all caught up. New messages will appear here.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button variant="outline">Refresh</Button>
      </EmptyStateActions>
    </EmptyState>
  );
}
