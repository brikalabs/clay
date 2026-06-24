import { Rating } from '@brika/clay/components/rating';

/**
 * All three size variants (`sm`, `default`, `lg`) shown at the same 3.75 value for easy comparison.
 */
export default function RatingSizesDemo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <span className="w-14 text-xs text-muted-foreground">sm</span>
        <Rating value={3.75} size="sm" aria-label="3.75 out of 5 (small)" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-14 text-xs text-muted-foreground">default</span>
        <Rating value={3.75} aria-label="3.75 out of 5 (default)" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-14 text-xs text-muted-foreground">lg</span>
        <Rating value={3.75} size="lg" aria-label="3.75 out of 5 (large)" />
      </div>
    </div>
  );
}
