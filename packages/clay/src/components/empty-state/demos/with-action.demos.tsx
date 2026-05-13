import { Button } from '@brika/clay/components/button';
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@brika/clay/components/empty-state';
import { Search } from 'lucide-react';

/** Search-results placeholder, combine with a clear-search action to guide the user. */
export default function EmptyStateWithActionDemo() {
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
