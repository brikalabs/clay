'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@brika/clay/components/button';
import {
  Cropper,
  CropperInput,
  CropperViewport,
  CropperZoom,
  useCropper,
} from '@brika/clay/components/cropper';

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
// Default demo — the minimal usage: CropperInput + viewport + zoom + apply
// ---------------------------------------------------------------------------

/**
 * Minimal composable usage: no external state, no ref.
 * CropperInput wires the file picker to the cropper automatically.
 * The Apply button reads getCroppedBlob from useCropper().
 */
export default function CropperDefaultDemo() {
  const [preview, setPreview] = useState<string | null>(null);

  function onApply(blob: Blob) {
    if (preview != null) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(blob));
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {preview != null && (
        <img src={preview} alt="Cropped result" className="size-20 rounded-full object-cover" />
      )}

      <Cropper>
        <CropperInput>Choose photo</CropperInput>
        <CropperViewport className="mt-3" />
        <CropperZoom className="mt-2 w-72" />
        <div className="mt-2 flex justify-center">
          <ApplyButton onApply={onApply} />
        </div>
      </Cropper>
    </div>
  );
}
