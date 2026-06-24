'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@brika/clay/components/avatar';
import { Button } from '@brika/clay/components/button';
import {
  Cropper,
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
import { FlipHorizontal2, FlipVertical2, RotateCcw, RotateCw, Undo2 } from 'lucide-react';
import { ApplyButton, toolbarBtn } from './shared';

/** Avatar-upload flow: click the avatar to open the file browser, then crop in a Dialog with zoom, rotate, flip, and reset controls. */
export default function CropperModalDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    e.target.value = '';
  }

  function handleApply(blob: Blob) {
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
              <DialogTitle>Crop your avatar</DialogTitle>
              <DialogDescription>Drag to reposition, scroll or slide to zoom.</DialogDescription>
            </DialogHeader>

            <div className="flex justify-center">
              <CropperViewport />
            </div>
            <CropperZoom className="mt-2" />

            <div className="flex items-center justify-center gap-1">
              <CropperRotate direction="left" aria-label="Rotate left" className={toolbarBtn}>
                <RotateCcw className="size-4" />
              </CropperRotate>
              <CropperRotate direction="right" aria-label="Rotate right" className={toolbarBtn}>
                <RotateCw className="size-4" />
              </CropperRotate>
              <CropperFlip axis="h" aria-label="Flip horizontal" className={toolbarBtn}>
                <FlipHorizontal2 className="size-4" />
              </CropperFlip>
              <CropperFlip axis="v" aria-label="Flip vertical" className={toolbarBtn}>
                <FlipVertical2 className="size-4" />
              </CropperFlip>
              <CropperReset aria-label="Reset" className={toolbarBtn}>
                <Undo2 className="size-4" />
              </CropperReset>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
              <ApplyButton onApply={handleApply} size="default" className="flex-1" />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Cropper>
    </div>
  );
}
