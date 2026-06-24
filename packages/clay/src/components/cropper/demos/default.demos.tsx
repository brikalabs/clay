'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@brika/clay/components/card';
import {
  Cropper,
  CropperApply,
  CropperCancel,
  CropperFallback,
  CropperFlip,
  CropperInput,
  CropperReset,
  CropperRotate,
  CropperViewport,
  CropperZoom,
} from '@brika/clay/components/cropper';
import {
  FlipHorizontal2,
  FlipVertical2,
  ImageUp,
  RotateCcw,
  RotateCcwSquare,
  RotateCw,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

/**
 * Comprehensive showcase of all Cropper features in uncontrolled mode, framed
 * in a Card. Includes: CropperViewport with a composable CropperFallback
 * empty state (drag-drop), a zoom row (ZoomOut + CropperZoom + ZoomIn), the
 * full toolbar (CropperRotate left/right, CropperFlip h/v, CropperReset, and
 * a CropperInput Upload icon button), and CropperApply + CropperCancel.
 * Starts empty; pick or drop a file to begin cropping.
 */
export default function CropperDefaultDemo() {
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
            <CropperViewport>
              <CropperFallback>
                <ImageUp className="size-8 opacity-60" />
                <span className="text-xs font-medium">Drop a photo or click upload</span>
              </CropperFallback>
            </CropperViewport>

            {/* Zoom row: minus icon — slider — plus icon */}
            <div className="flex w-full items-center gap-3">
              <ZoomOut className="size-4 shrink-0 text-muted-foreground" />
              <CropperZoom className="flex-1" />
              <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
            </div>

            {/* Toolbar: rotate, flip, reset, upload */}
            <div className="flex w-full items-center gap-2">
              <CropperRotate direction="left" aria-label="Rotate left" className="flex-1">
                <RotateCcw className="size-4" />
              </CropperRotate>
              <CropperRotate direction="right" aria-label="Rotate right" className="flex-1">
                <RotateCw className="size-4" />
              </CropperRotate>
              <CropperFlip axis="h" aria-label="Flip horizontal" className="flex-1">
                <FlipHorizontal2 className="size-4" />
              </CropperFlip>
              <CropperFlip axis="v" aria-label="Flip vertical" className="flex-1">
                <FlipVertical2 className="size-4" />
              </CropperFlip>
              <CropperReset aria-label="Reset" className="flex-1">
                <RotateCcwSquare className="size-4" />
              </CropperReset>
              <CropperInput variant="outline" size="icon-sm" aria-label="Upload image" className="flex-1">
                <Upload className="size-4" />
              </CropperInput>
            </div>

            {/* Action row */}
            <div className="flex w-full gap-2">
              <CropperCancel className="flex-1">Cancel</CropperCancel>
              <CropperApply onCrop={onCrop} className="flex-1">Apply</CropperApply>
            </div>
          </Cropper>
        </CardContent>
      </Card>
    </div>
  );
}
