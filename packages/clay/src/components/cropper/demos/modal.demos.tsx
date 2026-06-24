'use client';

import * as React from 'react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@brika/clay/components/avatar';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@brika/clay/components/dialog';
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
 * Avatar-upload flow: clicking the avatar opens the file browser, then the crop UI appears inside a Dialog composed from public Cropper parts with a full rotate/flip/zoom toolbar.
 */
export default function CropperModalDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    e.target.value = '';
  }

  function handleCrop(blob: Blob) {
    if (avatarSrc != null) URL.revokeObjectURL(avatarSrc);
    setAvatarSrc(URL.createObjectURL(blob));
    setFile(null);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={pick} />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-full ring-2 ring-offset-2 ring-offset-background ring-transparent transition hover:ring-primary focus-visible:outline-none focus-visible:ring-primary"
        aria-label="Change avatar"
      >
        <Avatar size="lg">
          {avatarSrc != null && <AvatarImage src={avatarSrc} alt="Your avatar" />}
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
      </button>
      <p className="text-xs text-muted-foreground">Click avatar to change</p>

      <Cropper image={file} onImageChange={setFile} shape="circle">
        <Dialog open={file !== null} onOpenChange={(open) => { if (!open) setFile(null); }}>
          <DialogContent className="w-[380px] max-w-[calc(100vw-2rem)] gap-4">
            <DialogHeader>
              <DialogTitle>Crop your photo</DialogTitle>
              <DialogDescription>Drag to reposition · scroll or slide to zoom</DialogDescription>
            </DialogHeader>

            <div className="flex justify-center">
              <CropperViewport>
                <CropperFallback>
                  <ImageUp className="size-8 opacity-60" />
                  <span className="text-xs font-medium">Drop a photo or click upload</span>
                </CropperFallback>
              </CropperViewport>
            </div>

            {/* Zoom row: minus icon, slider, plus icon */}
            <div className="flex items-center gap-3">
              <ZoomOut className="size-4 shrink-0 text-muted-foreground" />
              <CropperZoom className="flex-1" />
              <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
            </div>

            {/* Toolbar: bordered outline icon buttons for rotate, flip, reset, and upload */}
            <div className="flex items-center gap-2">
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
              <CropperInput variant="outline" size="icon-sm" aria-label="Replace image" className="flex-1">
                <Upload className="size-4" />
              </CropperInput>
            </div>

            <DialogFooter>
              <CropperCancel onCancel={() => setFile(null)} className="flex-1">
                Cancel
              </CropperCancel>
              <CropperApply onCrop={handleCrop} className="flex-1">
                Apply
              </CropperApply>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Cropper>
    </div>
  );
}
