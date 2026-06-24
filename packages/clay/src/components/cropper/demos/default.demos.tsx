'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@brika/clay/components/button';
import { Cropper, CropperViewport, CropperZoom } from '@brika/clay/components/cropper';
import { makeSampleImageFile } from './sample-image';
import { ApplyButton } from './shared';

/** Minimal controlled usage: a synthetic gradient image pre-loaded so the docs preview shows the circular crop mask over a real image. */
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
