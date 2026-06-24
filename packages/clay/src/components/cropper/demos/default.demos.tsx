'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@brika/clay/components/button';
import {
  Cropper,
  CropperViewport,
  CropperZoom,
  useCropper,
} from '@brika/clay/components/cropper';
import { makeSampleImageFile } from './sample-image';

// ---------------------------------------------------------------------------
// Apply button — reads getCroppedBlob from context, no ref needed
// ---------------------------------------------------------------------------

function ApplyButton({ onApply }: { readonly onApply: (blob: Blob) => void }) {
  const { getCroppedBlob } = useCropper();
  async function apply() {
    const blob = await getCroppedBlob();
    if (blob != null) onApply(blob);
  }
  return (
    <Button type="button" size="sm" onClick={apply}>
      Apply
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Default demo — controlled mode with a synthetic sample image pre-loaded
// ---------------------------------------------------------------------------

/**
 * Minimal usage: controlled `image` prop pre-loaded with a synthetic gradient
 * so the docs preview shows the circular crop mask over a real image.
 * The "Choose photo" button opens the OS file browser to replace it.
 */
export default function CropperDefaultDemo() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-load a synthetic sample so the docs preview is not empty.
  useEffect(() => {
    setFile(makeSampleImageFile());
  }, []);

  function onApply(blob: Blob) {
    if (preview != null) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(blob));
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {preview != null && (
        <img src={preview} alt="Cropped result" className="size-20 rounded-full object-cover" />
      )}

      {/* Hidden file input — the Button below triggers it */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          e.target.value = '';
        }}
      />

      <Cropper image={file}>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          Choose photo
        </Button>
        <CropperViewport className="mt-3" />
        <CropperZoom className="mt-2 w-72" />
        <div className="mt-2 flex justify-center">
          <ApplyButton onApply={onApply} />
        </div>
      </Cropper>
    </div>
  );
}
