import { Button } from '@brika/clay/components/button';
import { Loader2 } from 'lucide-react';

/** Disabled with a spinner, use while an async operation is in flight. */
export default function ButtonLoadingDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button disabled>
        <Loader2 className="animate-spin" />
        Saving…
      </Button>
      <Button variant="outline" disabled>
        <Loader2 className="animate-spin" />
        Loading
      </Button>
    </div>
  );
}
