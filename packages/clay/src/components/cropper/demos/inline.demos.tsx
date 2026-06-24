'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@brika/clay/components/card';
import {
  Cropper,
  CropperApply,
  CropperFallback,
  CropperInput,
  CropperViewport,
  CropperZoom,
} from '@brika/clay/components/cropper';
import { ImageUp } from 'lucide-react';

/**
 * Cropper mounted inline in a Card (no modal): file picker button, drag-drop viewport with fallback, zoom slider, and apply button.
 */
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
          <Cropper>
            <CropperInput variant="outline" size="sm">
              Pick image
            </CropperInput>
            <CropperViewport className="mt-1">
              <CropperFallback>
                <ImageUp className="size-8 opacity-60" />
                <span className="text-xs font-medium">Drop a photo or click upload</span>
              </CropperFallback>
            </CropperViewport>
            <CropperZoom className="w-full" />
            <CropperApply onCrop={onCrop} className="w-full">Apply</CropperApply>
          </Cropper>
        </CardContent>
      </Card>
    </div>
  );
}
