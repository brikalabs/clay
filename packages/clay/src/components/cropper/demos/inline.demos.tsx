'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Button } from '@brika/clay/components/button';
import {
  Cropper,
  CropperViewport,
  CropperZoom,
  type CropperHandle,
} from '@brika/clay/components/cropper';

// ---------------------------------------------------------------------------
// Inline demo — Cropper mounted directly on the page, no Dialog
// ---------------------------------------------------------------------------

/**
 * Inline cropper: CropperViewport and CropperZoom mounted directly on the
 * page without a Dialog wrapper. Demonstrates that the Cropper compound
 * component has no Dialog assumptions — it works as a plain page section.
 */
export default function CropperInlineDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const cropperRef = useRef<CropperHandle>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    e.target.value = '';
  }

  async function apply() {
    const blob = await cropperRef.current?.getCroppedBlob();
    if (blob != null) {
      if (preview != null) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(blob));
    }
    setFile(null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <label>
        <Button asChild variant="outline" size="sm">
          <span>Pick image</span>
        </Button>
        <input type="file" accept="image/*" className="sr-only" onChange={pick} />
      </label>

      {preview != null && (
        <img src={preview} alt="Cropped result" className="size-20 rounded-full object-cover" />
      )}

      {file != null && (
        <div className="flex flex-col items-center gap-3">
          <Cropper ref={cropperRef} image={file} shape="circle">
            <CropperViewport />
            <CropperZoom className="mt-2 w-72" />
          </Cropper>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={apply}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Drag-and-drop demo — drop an image onto CropperViewport to load it
// ---------------------------------------------------------------------------

/**
 * Inline cropper with drag-and-drop: drop an image file directly onto the
 * CropperViewport to load it. The `onImageDrop` callback is called with the
 * dropped `File`; the consumer sets it as the controlled `image` prop.
 * A themed ring (--cropper-drop-active-ring = var(--primary)) highlights the
 * viewport while a file is held over it.
 */
export function CropperDragDropDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const cropperRef = useRef<CropperHandle>(null);

  async function apply() {
    const blob = await cropperRef.current?.getCroppedBlob();
    if (blob != null) {
      if (preview != null) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(blob));
    }
    setFile(null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {preview != null && (
        <img src={preview} alt="Cropped result" className="size-20 rounded-full object-cover" />
      )}

      <Cropper ref={cropperRef} image={file} shape="circle">
        {/* onImageDrop fires with the File; we set it as the controlled `image` prop */}
        <CropperViewport onImageDrop={setFile} />
        <CropperZoom className="mt-2 w-72" />
      </Cropper>

      <p className="text-muted-foreground text-xs">
        {file == null ? 'Drop an image onto the viewport to load it' : 'Drag to reposition, scroll or slide to zoom'}
      </p>

      {file != null && (
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
            Clear
          </Button>
          <Button type="button" size="sm" onClick={apply}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
