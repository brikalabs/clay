import { Skeleton } from '@brika/clay/components/skeleton';

/** Avatar + text skeleton for a user row or comment thread. */
export default function SkeletonCardDemo() {
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
