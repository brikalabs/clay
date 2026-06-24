import * as React from 'react';
import { useRef, useState } from 'react';
import { Button } from '@brika/clay/components/button';
import {
  Cropper,
  CropperCanvas,
  CropperOverlay,
  useCropperZoom,
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
import { Slider } from '@brika/clay/components/slider';
import { ZoomIn, ZoomOut } from 'lucide-react';

/** Zoom slider wired to the nearest Cropper via context. */
function CropZoomSlider() {
  const { zoom, setZoom } = useCropperZoom();
  return (
    <div className="flex items-center gap-3">
      <ZoomOut className="size-4 text-muted-foreground" />
      <Slider
        min={1}
        max={3}
        step={0.01}
        value={zoom}
        onChange={setZoom}
        className="flex-1"
      />
      <ZoomIn className="size-4 text-muted-foreground" />
    </div>
  );
}

/**
 * Avatar-upload flow built entirely from composable Clay parts:
 * Dialog + Cropper + Slider + Buttons. No AvatarUpload component required.
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
    if (blob !== undefined && blob !== null) {
      setPreview(URL.createObjectURL(blob));
    }
    setFile(null);
  }

  function cancel() {
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
      {preview !== null ? (
        <img
          src={preview}
          alt="Cropped preview"
          className="size-20 rounded-full object-cover"
        />
      ) : null}

      <Dialog open={file !== null} onOpenChange={(open) => { if (!open) cancel(); }}>
        <DialogContent className="w-[380px] max-w-[calc(100vw-2rem)] gap-4">
          <DialogHeader>
            <DialogTitle>Crop your avatar</DialogTitle>
            <DialogDescription>Drag to reposition, scroll or slide to zoom.</DialogDescription>
          </DialogHeader>

          <Cropper ref={cropperRef} image={file} shape="circle">
            <div className="flex justify-center">
              <div className="relative">
                <CropperCanvas />
                <CropperOverlay className="absolute inset-0" />
              </div>
            </div>
            <CropZoomSlider />
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
