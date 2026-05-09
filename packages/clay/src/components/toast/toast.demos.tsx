'use client';

import { Button } from '@brika/clay/components/button';
import { toast } from '@brika/clay/components/toast';
import { defineDemos } from '../../component-registry';

/** Trigger a basic notification, mount one Toaster near the app root first. */
export function ToastDefaultDemo() {
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

/** Semantic intent variants and inline action button. */
export function ToastVariantsDemo() {
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

// Counter-driven so the demo alternates between success and failure
// deterministically (every fourth attempt fails). Avoids `Math.random()`
// for predictable demo behaviour.
let uploadAttempt = 0;
function fakeUpload(): Promise<{ filename: string }> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      uploadAttempt += 1;
      if (uploadAttempt % 4 === 0) {
        reject(new Error('Network timeout'));
      } else {
        resolve({ filename: 'report-2026.pdf' });
      }
    }, 2000)
  );
}

/** toast.promise tracks an async operation through loading, success, and error states. */
export function ToastPromiseDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(fakeUpload(), {
          loading: 'Uploading file…',
          success: (data) => `${data.filename} uploaded successfully`,
          error: 'Upload failed. Check your connection and try again.',
        })
      }
    >
      Upload file
    </Button>
  );
}

/** Configure Toaster position and display duration at the mount site. */
export function ToastPositionDemo() {
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

export const demoMeta = defineDemos([
  [ToastDefaultDemo, 'Default', { description: 'Trigger a basic notification, mount one Toaster near the app root first.' }],
  [ToastVariantsDemo, 'Variants', { description: 'Semantic intent variants and inline action button.' }],
  [ToastPromiseDemo, 'Promise', { description: 'toast.promise tracks an async operation through loading, success, and error states.' }],
  [ToastPositionDemo, 'Position', { description: 'Configure Toaster position and display duration at the mount site.' }],
]);
