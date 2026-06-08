'use client';

import {
  Dropzone,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
} from '@brika/clay/components/dropzone';
import { useState } from 'react';

/** Reject oversized files with `maxSize` and report them via `onReject`. */
export default function DropzoneMaxSizeDemo() {
  const [error, setError] = useState<string | null>(null);
  const maxSize = 1_000_000;

  return (
    <div className="w-full max-w-md space-y-2">
      <Dropzone
        aria-label="Upload a file under 1 MB"
        className="min-h-44"
        maxSize={maxSize}
        onDrop={() => setError(null)}
        onReject={(rejections) =>
          setError(`${rejections.map((r) => r.file.name).join(', ')} exceeds the 1 MB limit.`)
        }
      >
        <DropzoneIcon />
        <DropzoneTitle>Drag &amp; drop a file here</DropzoneTitle>
        <DropzoneDescription>Maximum file size: 1 MB</DropzoneDescription>
      </Dropzone>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
