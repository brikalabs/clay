import { Button } from '@brika/clay/components/button';
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@brika/clay/components/empty-state';
import { Inbox, Search } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Inbox-zero placeholder — icon, title, description, and optional action. */
export function EmptyStateDefaultDemo() {
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

/** Search-results placeholder — combine with a clear-search action to guide the user. */
export function EmptyStateWithActionDemo() {
  return (
    <EmptyState className="w-full max-w-md">
      <EmptyStateIcon>
        <Search />
      </EmptyStateIcon>
      <EmptyStateTitle>No results for "clay design system"</EmptyStateTitle>
      <EmptyStateDescription>
        Try adjusting your search terms or removing active filters.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button>Clear search</Button>
        <Button variant="outline">Browse all</Button>
      </EmptyStateActions>
    </EmptyState>
  );
}

/** Minimal empty state — title and description only, no icon or actions. */
export function EmptyStateSimpleDemo() {
  return (
    <EmptyState className="w-full max-w-md py-10">
      <EmptyStateTitle>No activity yet</EmptyStateTitle>
      <EmptyStateDescription>
        Actions and events will be logged here once work begins.
      </EmptyStateDescription>
    </EmptyState>
  );
}

export const demoMeta = defineDemos([
  [EmptyStateDefaultDemo, 'Default', { description: `Inbox-zero placeholder — icon, title, description, and optional action.` }],
  [EmptyStateWithActionDemo, 'With Action', { description: `Search-results placeholder — combine with a clear-search action to guide the user.` }],
  [EmptyStateSimpleDemo, 'Simple', { description: `Minimal empty state — title and description only, no icon or actions.` }],
]);
export const accessibility: readonly string[] = [
  `Icon inside \`EmptyStateIcon\` is \`aria-hidden\` — title and description carry all meaning.`,
  `Action buttons should have descriptive labels matching the specific task ("Clear search", not "Clear").`,
  `Empty states announced as a live region can help AT users know when a list becomes empty dynamically.`,
];
