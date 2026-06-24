'use client';

import * as React from 'react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@brika/clay/components/avatar';
import { Button } from '@brika/clay/components/button';
import {
  Cropper,
  CropperApply,
  CropperFlip,
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
import { FlipHorizontal2, FlipVertical2, RotateCcw, RotateCw, RotateCcwSquare, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * Avatar-upload flow: click the avatar to open the file browser, then crop in
 * a Dialog with a zoom slider, a bordered toolbar of rotate/flip/reset actions,
 * and Cancel / Apply footer buttons.
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

  function handleCancel() {
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

      <Cropper image={file} shape="circle">
        <Dialog open={file !== null} onOpenChange={(open) => { if (!open) handleCancel(); }}>
          <DialogContent className="w-[380px] max-w-[calc(100vw-2rem)] gap-4">
            <DialogHeader>
              <DialogTitle>Crop your photo</DialogTitle>
              <DialogDescription>Drag to reposition · scroll or slide to zoom</DialogDescription>
            </DialogHeader>

            <div className="flex justify-center">
              <CropperViewport />
            </div>

            {/* Zoom row: minus icon — slider — plus icon */}
            <div className="flex items-center gap-3">
              <ZoomOut className="size-4 shrink-0 text-muted-foreground" />
              <CropperZoom className="flex-1" />
              <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
            </div>

            {/* Toolbar: 5 bordered icon buttons for rotate, flip, reset */}
            <div className="flex items-center gap-2">
              <CropperRotate direction="left" variant="outline" size="icon-sm" aria-label="Rotate left" className="flex-1">
                <RotateCcw className="size-4" />
              </CropperRotate>
              <CropperRotate direction="right" variant="outline" size="icon-sm" aria-label="Rotate right" className="flex-1">
                <RotateCw className="size-4" />
              </CropperRotate>
              <CropperFlip axis="h" variant="outline" size="icon-sm" aria-label="Flip horizontal" className="flex-1">
                <FlipHorizontal2 className="size-4" />
              </CropperFlip>
              <CropperFlip axis="v" variant="outline" size="icon-sm" aria-label="Flip vertical" className="flex-1">
                <FlipVertical2 className="size-4" />
              </CropperFlip>
              <CropperReset variant="outline" size="icon-sm" aria-label="Reset" className="flex-1">
                <RotateCcwSquare className="size-4" />
              </CropperReset>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
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
