import { Button } from '@brika/clay/components/button';
import { Spinner } from '@brika/clay/components/spinner';
import { defineDemos } from '../../component-registry';

/** Bare spinner, decorative by default and marked `aria-hidden`. */
export function SpinnerDefaultDemo() {
  return <Spinner />;
}

/** All three sizes side by side, `sm` (0.875rem), `default` (1rem), and `lg` (1.25rem). */
export function SpinnerSizesDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  );
}

/** Pass `label` to wrap the spinner in a `role="status"` element with an sr-only string for screen readers. */
export function SpinnerWithLabelDemo() {
  return <Spinner label="Loading…" />;
}

/** Compose the spinner inside a disabled button to communicate an in-flight action. */
export function SpinnerInButtonDemo() {
  return (
    <Button disabled>
      <Spinner />
      Loading
    </Button>
  );
}

export const demoMeta = defineDemos([
  [SpinnerDefaultDemo, 'Default', { description: 'Bare spinner, decorative by default and marked `aria-hidden`.' }],
  [SpinnerSizesDemo, 'Sizes', { description: 'All three sizes side by side, `sm` (0.875rem), `default` (1rem), and `lg` (1.25rem).' }],
  [SpinnerWithLabelDemo, 'With Label', { description: 'Pass `label` to wrap the spinner in a `role="status"` element with an sr-only string for screen readers.' }],
  [SpinnerInButtonDemo, 'In Button', { description: 'Compose the spinner inside a disabled button to communicate an in-flight action.' }],
]);
