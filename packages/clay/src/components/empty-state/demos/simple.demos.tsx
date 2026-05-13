import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from '@brika/clay/components/empty-state';
/** Minimal empty state, title and description only, no icon or actions. */
export default function EmptyStateSimpleDemo() {
  return (
    <EmptyState className="w-full max-w-md py-10">
      <EmptyStateTitle>No activity yet</EmptyStateTitle>
      <EmptyStateDescription>
        Actions and events will be logged here once work begins.
      </EmptyStateDescription>
    </EmptyState>
  );
}
