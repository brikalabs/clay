import { Skeleton } from '@brika/clay/components/skeleton';

/** Table row skeleton with columns of varying widths. */
export default function SkeletonTableDemo() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      {['row-a', 'row-b', 'row-c'].map((row) => (
        <div key={row} className="flex items-center gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}
