'use client';

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
import { ImagePlus } from 'lucide-react';

/**
 * Minimal inline Cropper (no modal) with a rounded crop shape: choose a file, drag to reposition, zoom, then apply.
 */
export default function CropperInlineDemo() {
  const [cover, setCover] = useState<string | null>(null);

  return (
    <Card className="w-fit">
      <CardContent className="flex flex-col gap-3 pt-4">
        {cover != null && (
          <img src={cover} alt="Cropped cover" className="h-14 w-full rounded-lg object-cover" />
        )}
        <Cropper shape="rounded">
          <CropperViewport>
            <CropperFallback>
              <ImagePlus className="size-7 opacity-60" />
            </CropperFallback>
          </CropperViewport>
          <CropperZoom className="w-full" />
          <div className="flex gap-2">
            <CropperInput variant="outline" size="sm">
              Choose file
            </CropperInput>
            <CropperApply onCrop={(blob) => setCover(URL.createObjectURL(blob))} className="flex-1">
              Apply
            </CropperApply>
          </div>
        </Cropper>
      </CardContent>
    </Card>
  );
}
