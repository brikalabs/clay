import { Spinner } from '@brika/clay/components/spinner';

/** All three sizes side by side, `sm` (0.875rem), `default` (1rem), and `lg` (1.25rem). */
export default function SpinnerSizesDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  );
}
