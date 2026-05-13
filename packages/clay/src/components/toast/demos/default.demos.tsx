'use client';

import { Button } from '@brika/clay/components/button';
import { toast } from '@brika/clay/components/toast';

/** Trigger a basic notification, mount one Toaster near the app root first. */
export default function ToastDefaultDemo() {
  return (
    <Button
      onClick={() =>
        toast('Changes saved', {
          description: 'Your project was saved successfully.',
        })
      }
    >
      Show toast
    </Button>
  );
}
