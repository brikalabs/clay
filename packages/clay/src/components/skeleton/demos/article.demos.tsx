import { Skeleton } from '@brika/clay/components/skeleton';

/** Article or blog post skeleton, heading plus body lines. */
export default function SkeletonArticleDemo() {
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
