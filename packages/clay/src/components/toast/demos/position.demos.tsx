'use client';

import { Button } from '@brika/clay/components/button';
import { toast } from '@brika/clay/components/toast';

/** Configure Toaster position and display duration at the mount site. */
export default function ToastPositionDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.info('Positioned top-center', {
          description: 'Set position on the Toaster component, not per-call.',
        })
      }
    >
      Show info toast
    </Button>
  );
}
