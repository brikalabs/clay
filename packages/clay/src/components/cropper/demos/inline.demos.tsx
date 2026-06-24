'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@brika/clay/components/card';
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

/** Inline cropper mounted directly on the page, framed in a Card. Viewport, zoom slider, and apply button — no modal. Pick a new file with the button or drop one onto the viewport. */
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

      <Card>
        <CardContent className="flex flex-col items-center gap-3 pt-4">
          <Cropper defaultImage={sampleFile ?? undefined}>
            <CropperInput variant="outline" size="sm">
              Pick image
            </CropperInput>
            <CropperViewport className="mt-1" />
            <CropperZoom className="w-full" />
            <CropperApply onCrop={onCrop} className="w-full">Apply</CropperApply>
          </Cropper>
        </CardContent>
      </Card>
    </div>
  );
}
