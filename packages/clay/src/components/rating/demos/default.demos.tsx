import { Rating } from '@brika/clay/components/rating';

/** Default five-star rating at 3.75: the fourth star is 75% filled, no rounding. */
export default function RatingDefaultDemo() {
  return <Rating value={3.75} aria-label="3.75 out of 5 stars" />;
}
