import { Button } from '@brika/clay/components/button';
import { Spinner } from '@brika/clay/components/spinner';

/** Compose the spinner inside a disabled button to communicate an in-flight action. */
export default function SpinnerInButtonDemo() {
  return (
    <Button disabled>
      <Spinner />
      Loading
    </Button>
  );
}
