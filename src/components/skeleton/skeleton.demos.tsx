import { Skeleton } from '@brika/clay/components/skeleton';
import { defineDemos } from '../_registry';

/** Single line skeleton, match width to expected text content. */
export function SkeletonDefaultDemo() {
  return <Skeleton className="h-4 w-48" />;
}

/** Avatar + text skeleton for a user row or comment thread. */
export function SkeletonCardDemo() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

/** Table row skeleton with columns of varying widths. */
export function SkeletonTableDemo() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

/** Article or blog post skeleton, heading plus body lines. */
export function SkeletonArticleDemo() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export const demoMeta = defineDemos([
  [SkeletonDefaultDemo, 'Default', { description: `Single line skeleton, match width to expected text content.` }],
  [SkeletonCardDemo, 'Card', { description: `Avatar + text skeleton for a user row or comment thread.` }],
  [SkeletonTableDemo, 'Table', { description: `Table row skeleton with columns of varying widths.` }],
  [SkeletonArticleDemo, 'Article', { description: `Article or blog post skeleton, heading plus body lines.` }],
]);
export const accessibility: readonly string[] = [
  `Mark skeleton containers with \`aria-hidden="true"\` and \`aria-busy="true"\` on the parent.`,
  `When content loads, remove the busy state and announce the result via a live region.`,
  `Do not use \`Skeleton\` inside elements that carry interactive roles.`,
];
