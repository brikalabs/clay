'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Cropper,
  CropperApply,
  CropperInput,
  CropperViewport,
  CropperZoom,
} from '@brika/clay/components/cropper';
import { makeSampleImageFile } from './sample-image';

// Created once at module scope; null on SSR runtimes that lack the File global.
const sampleFile = makeSampleImageFile();

/** Inline cropper with all controls mounted directly on the page, pre-loaded with a synthetic gradient image. Pick a new file with the button or drop one onto the viewport — both replace the current image without any consumer state. */
export default function CropperInlineDemo() {
  const [preview, setPreview] = useState<string | null>(null);

  function onCrop(blob: Blob) {
    if (preview != null) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(blob));
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {preview != null && (
        <img src={preview} alt="Cropped result" className="size-20 rounded-full object-cover" />
      )}

      <Cropper defaultImage={sampleFile ?? undefined}>
        <div className="flex flex-col items-center gap-3">
          <CropperInput variant="outline" size="sm">
            Pick image
          </CropperInput>
          <CropperViewport />
          <CropperZoom className="w-72" />
          <CropperApply onCrop={onCrop}>Apply</CropperApply>
        </div>
      </Cropper>
    </div>
  );
}

/** Drag-and-drop: drop an image file directly onto the viewport to load it in uncontrolled mode. */
export function CropperDragDropDemo() {
  const [preview, setPreview] = useState<string | null>(null);

  function onCrop(blob: Blob) {
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
          <CropperApply onCrop={onCrop}>Apply</CropperApply>
        </div>
      </Cropper>

      <p className="text-xs text-muted-foreground">
        Drop an image onto the viewport, or use the button above
      </p>
    </div>
  );
}
