'use client';

import { Button } from '@brika/clay/components/button';
import { toast } from '@brika/clay/components/toast';

/** Semantic intent variants and inline action button. */
export default function ToastVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Deployment complete', {
            description: 'v2.4.1 is live on production.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning('High memory usage', {
            description: 'Your instance is using 89% of available RAM.',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Build failed', {
            description: 'TypeScript reported 3 errors in checkout.tsx.',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast('Update available', {
            description: 'Version 3.0.0 is ready to install.',
            action: { label: 'Install', onClick: () => undefined },
          })
        }
      >
        With action
      </Button>
    </div>
  );
}
