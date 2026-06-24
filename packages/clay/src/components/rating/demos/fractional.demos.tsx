import { Rating } from '@brika/clay/components/rating';

/**
 * Fractional display: the fourth star is 75% filled; no rounding is applied.
 * Stars use `--rating-filled-color` / `--rating-empty-color` tokens.
 */
export default function RatingFractionalDemo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Rating value={3.75} aria-label="3.75 out of 5 stars" size="lg" />
      <Rating value={2.3} aria-label="2.3 out of 5 stars" />
      <Rating value={0.5} aria-label="0.5 out of 5 stars" size="sm" />
    </div>
  );
}
