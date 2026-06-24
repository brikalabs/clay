import { Rating } from '@brika/clay/components/rating';

/** Default five-star rating at 3.6 (rounds to 4 filled stars). */
export default function RatingDefaultDemo() {
  return <Rating value={3.6} aria-label="4 out of 5 stars" />;
}
