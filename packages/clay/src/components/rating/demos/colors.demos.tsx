import { Rating } from '@brika/clay/components/rating';

/**
 * Custom filled-star colors via the `color` prop. The prop sets
 * `--rating-filled-color` inline; the token default (`--warning`) still
 * applies when `color` is omitted.
 */
export default function RatingColorsDemo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <span className="w-28 text-xs text-muted-foreground">default (--warning)</span>
        <Rating value={4} aria-label="4 out of 5, default color" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-28 text-xs text-muted-foreground">var(--primary)</span>
        <Rating value={4} color="var(--primary)" aria-label="4 out of 5, primary color" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-28 text-xs text-muted-foreground">var(--destructive)</span>
        <Rating value={4} color="var(--destructive)" aria-label="4 out of 5, destructive color" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-28 text-xs text-muted-foreground">#10b981</span>
        <Rating value={4} color="#10b981" aria-label="4 out of 5, emerald color" />
      </div>
    </div>
  );
}
