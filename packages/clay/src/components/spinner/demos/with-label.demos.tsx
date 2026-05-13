import { Spinner } from '@brika/clay/components/spinner';

/**
 * Pass `label` to wrap the spinner in a `role="status"` element with an sr-only string for screen readers.
 */
export default function SpinnerWithLabelDemo() {
  return <Spinner label="Loading…" />;
}
