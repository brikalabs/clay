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
  const { getCroppedBlob, img } = useCropper();
  async function apply() {
    const blob = await getCroppedBlob();
    if (blob != null) onApply(blob);
  }
  return (
    <Button type="button" size="sm" disabled={img == null} onClick={apply}>
      Apply
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Inline demo — Cropper mounted directly on the page, no Dialog
// ---------------------------------------------------------------------------

/**
 * Inline cropper: all parts mounted directly on the page without a Dialog.
 * CropperInput loads the file; useCropper() in ApplyButton exports the blob.
 * No external useState, no ref.
 */
export default function CropperInlineDemo() {
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
        <div className="flex flex-col items-center gap-3">
          <CropperInput variant="outline" size="sm">
            Pick image
          </CropperInput>
          <CropperViewport />
          <CropperZoom className="w-72" />
          <ApplyButton onApply={onApply} />
        </div>
      </Cropper>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Drag-and-drop demo — drop an image onto CropperViewport to load it
// ---------------------------------------------------------------------------

/**
 * Drag-and-drop: drop an image file directly onto the viewport to load it.
 * In uncontrolled mode no onImageDrop prop is needed — the file is picked up
 * automatically. A primary-coloured ring (--cropper-drop-active-ring) highlights
 * the viewport while a file is held over it.
 */
export function CropperDragDropDemo() {
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
        <div className="flex flex-col items-center gap-3">
          {/* No onImageDrop needed — uncontrolled mode handles the drop */}
          <CropperViewport />
          <CropperZoom className="w-72" />
          <ApplyButton onApply={onApply} />
        </div>
      </Cropper>

      <p className="text-xs text-muted-foreground">
        Drop an image onto the viewport, or use CropperInput to pick one
      </p>
    </div>
  );
}
