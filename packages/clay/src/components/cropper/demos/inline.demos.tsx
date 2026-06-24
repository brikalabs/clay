'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Cropper, CropperInput, CropperViewport, CropperZoom } from '@brika/clay/components/cropper';
import { Button } from '@brika/clay/components/button';
import { makeSampleImageFile } from './sample-image';
import { ApplyButton } from './shared';

/** Inline cropper with all controls mounted directly on the page, pre-loaded with a synthetic gradient image. */
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

/** Drag-and-drop: drop an image file directly onto the viewport to load it in uncontrolled mode. */
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
