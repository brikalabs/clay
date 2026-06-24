'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@brika/clay/components/button';
import {
  Cropper,
  CropperInput,
  CropperViewport,
  CropperZoom,
} from '@brika/clay/components/cropper';
import { makeSampleImageFile } from './sample-image';
import { ApplyButton } from './shared';

// Created once at module scope; null on SSR runtimes that lack the File global.
const sampleFile = makeSampleImageFile();

/** Minimal usage: pre-loaded with a synthetic gradient image. Picking a new file or dropping one onto the viewport replaces the current image — no consumer state required. */
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

      <Cropper defaultImage={sampleFile ?? undefined}>
        <CropperInput size="sm" variant="outline">
          Choose photo
        </CropperInput>
        <CropperViewport className="mt-3" />
        <CropperZoom className="mt-2 w-72" />
        <div className="mt-2 flex justify-center">
          <ApplyButton onApply={onApply} />
        </div>
      </Cropper>
    </div>
  );
}
