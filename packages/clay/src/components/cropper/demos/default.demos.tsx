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
  type CropperHandle,
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

/** Shared ghost-icon styling for the crop toolbar buttons. */
const toolbarBtn =
  'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

// ---------------------------------------------------------------------------
// Basic demo — minimal composable usage
// ---------------------------------------------------------------------------

/**
 * Basic cropper: one file input, CropperViewport (canvas + overlay in one
 * part), CropperZoom (Slider pre-wired), and an Apply button via the ref.
 */
export default function CropperDefaultDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const cropperRef = useRef<CropperHandle>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    e.target.value = '';
  }

  async function apply() {
    const blob = await cropperRef.current?.getCroppedBlob();
    if (blob != null) setPreview(URL.createObjectURL(blob));
    setFile(null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <label>
        <Button asChild variant="outline" size="sm">
          <span>Pick image</span>
        </Button>
        <input type="file" accept="image/*" className="sr-only" onChange={pick} />
      </label>

      {preview != null && (
        <img src={preview} alt="Cropped result" className="size-20 rounded-full object-cover" />
      )}

      <Dialog open={file !== null} onOpenChange={(open) => { if (!open) setFile(null); }}>
        <DialogContent className="w-[380px] max-w-[calc(100vw-2rem)] gap-4">
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
            <DialogDescription>Drag to reposition, scroll or slide to zoom.</DialogDescription>
          </DialogHeader>

          <Cropper ref={cropperRef} image={file} shape="circle">
            <div className="flex justify-center">
              <CropperViewport />
            </div>
            <CropperZoom className="mt-2" />
          </Cropper>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setFile(null)} className="flex-1">Cancel</Button>
            <Button type="button" onClick={apply} className="flex-1">Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avatar-crop demo — complete realistic flow
// ---------------------------------------------------------------------------

/**
 * Avatar-crop system built entirely from composable Clay parts: Avatar trigger,
 * hidden file input, Dialog, CropperViewport, CropperZoom, toolbar buttons
 * (CropperRotate, CropperFlip, CropperReset), and Apply/Cancel footers.
 *
 * No monolithic AvatarUpload component. The result is shown in the Avatar.
 */
export function AvatarCropDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperHandle>(null);

  function openPicker() {
    fileRef.current?.click();
  }

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    e.target.value = '';
  }

  async function apply() {
    const blob = await cropperRef.current?.getCroppedBlob();
    if (blob != null) {
      if (avatarSrc != null) URL.revokeObjectURL(avatarSrc);
      setAvatarSrc(URL.createObjectURL(blob));
    }
    setFile(null);
  }

  function cancel() {
    setFile(null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Clickable Avatar acts as the trigger */}
      <button
        type="button"
        onClick={openPicker}
        className="cursor-pointer rounded-full ring-2 ring-offset-2 ring-offset-background ring-transparent transition hover:ring-primary focus-visible:outline-none focus-visible:ring-primary"
        aria-label="Change avatar"
      >
        <Avatar size="lg">
          {avatarSrc != null && <AvatarImage src={avatarSrc} alt="Your avatar" />}
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
      </button>
      <p className="text-xs text-muted-foreground">Click avatar to change</p>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={pick} />

      {/* Crop Dialog */}
      <Dialog open={file !== null} onOpenChange={(open) => { if (!open) cancel(); }}>
        <DialogContent className="w-[380px] max-w-[calc(100vw-2rem)] gap-4">
          <DialogHeader>
            <DialogTitle>Crop your avatar</DialogTitle>
            <DialogDescription>Drag to reposition, scroll or slide to zoom.</DialogDescription>
          </DialogHeader>

          <Cropper ref={cropperRef} image={file} shape="circle">
            {/* CropperViewport = CropperCanvas + CropperOverlay in one part */}
            <div className="flex justify-center">
              <CropperViewport />
            </div>

            {/* CropperZoom = Clay Slider pre-wired to zoom context */}
            <CropperZoom className="mt-2" />

            {/* Toolbar: rotate, flip, reset — each a small pre-wired button */}
            <div className="flex items-center justify-center gap-1 pt-1">
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
          </Cropper>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={cancel} className="flex-1">
              Cancel
            </Button>
            <Button type="button" onClick={apply} className="flex-1">
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
