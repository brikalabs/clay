'use client';

import { Button } from '@brika/clay/components/button';
import { toast } from '@brika/clay/components/toast';
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
export default function ToastPromiseDemo() {
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
