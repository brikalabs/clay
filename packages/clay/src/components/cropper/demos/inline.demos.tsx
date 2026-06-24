'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@brika/clay/components/button';
import {
  Cropper,
  CropperInput,
  CropperViewport,
  CropperZoom,
  useCropper,
} from '@brika/clay/components/cropper';
import { makeSampleImageFile } from './sample-image';

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
// Inline demo — controlled, pre-loaded with a synthetic sample image
// ---------------------------------------------------------------------------

/**
 * Inline cropper: all parts mounted directly on the page without a Dialog.
 * Starts with a synthetic gradient image so the docs preview shows the
 * circular crop mask over a real image. Uses controlled mode so the initial
 * sample can be injected via the `image` prop.
 */
export default function CropperInlineDemo() {
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
        <div className="flex flex-col items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            Pick image
          </Button>
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
 * the viewport while a file is held over it. The empty-state placeholder
 * instructs the user to drop or use CropperInput.
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
          <CropperInput variant="outline" size="sm">
            Pick image
          </CropperInput>
          <CropperViewport />
          <CropperZoom className="w-72" />
          <ApplyButton onApply={onApply} />
        </div>
      </Cropper>

      <p className="text-xs text-muted-foreground">
        Drop an image onto the viewport, or use the button above
      </p>
    </div>
  );
}
