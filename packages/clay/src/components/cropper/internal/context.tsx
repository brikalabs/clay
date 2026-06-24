'use client';

import { createContext, use } from 'react';
import * as React from 'react';
import type { Transform } from './math';

// ---------------------------------------------------------------------------
// Context value shape
// ---------------------------------------------------------------------------

export interface CropperContextValue {
  /** Current zoom level (minZoom = fit, maxZoom = max). */
  zoom: number;
  /** Update zoom, clamped to [minZoom, maxZoom]. */
  setZoom: (zoom: number) => void;
  /** Current transform (internal; exposed for advanced consumers). */
  transform: Transform;
  /** Apply a partial transform patch. */
  update: (patch: Partial<Transform> | ((prev: Transform) => Partial<Transform>)) => void;
  /** Reset the transform to identity. */
  reset: () => void;
  /** On-screen stage size in px. */
  stageSize: number;
  /** The loaded HTMLImageElement (null until the file is decoded). */
  img: HTMLImageElement | null;
  /** True when an image is fully loaded and ready to crop. */
  hasImage: boolean;
  /** Crop shape, forwarded to CropperOverlay. */
  shape: 'circle' | 'rounded';
  /** Minimum zoom level. Defaults to 1. */
  minZoom: number;
  /** Maximum zoom level. Defaults to 3. */
  maxZoom: number;
  /** Ref to the canvas element, used by getCroppedBlob. */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Export the current crop as a Blob. Returns null if no image is loaded. */
  getCroppedBlob: (outputSize?: number, quality?: number) => Promise<Blob | null>;
  /**
   * Load a file into the cropper. Used by CropperInput (and CropperViewport
   * drag-drop) in uncontrolled mode. In controlled mode this is a no-op
   * because the consumer owns the `image` prop.
   */
  loadFile: (file: File) => void;
}

// ---------------------------------------------------------------------------
// Context + hooks
// ---------------------------------------------------------------------------

export const CropperContext = createContext<CropperContextValue | null>(null);

export function useCropper(): CropperContextValue {
  const ctx = use(CropperContext);
  if (ctx === null) throw new Error('useCropper must be used inside <Cropper>');
  return ctx;
}

/**
 * Returns `{ zoom, setZoom }` from the nearest CropperContext.
 * Wire directly to a Clay `<Slider min={1} max={3} step={0.01} value={zoom} onChange={setZoom} />`.
 */
export function useCropperZoom(): { zoom: number; setZoom: (zoom: number) => void } {
  const { zoom, setZoom } = useCropper();
  return { zoom, setZoom };
}

/**
 * Returns helpers for the rotation/flip toolbar.
 * `rotateLeft` / `rotateRight` step by 90 degrees; `flipH` / `flipV` toggle the flip flags;
 * `reset` returns to the identity transform.
 */
export function useCropperTransform(): {
  rotateLeft: () => void;
  rotateRight: () => void;
  flipH: () => void;
  flipV: () => void;
  flipHActive: boolean;
  flipVActive: boolean;
  reset: () => void;
} {
  const { transform, update, reset } = useCropper();
  return {
    rotateLeft: () => update({ rotation: (transform.rotation + 270) % 360 }),
    rotateRight: () => update({ rotation: (transform.rotation + 90) % 360 }),
    flipH: () => update({ flipH: !transform.flipH }),
    flipV: () => update({ flipV: !transform.flipV }),
    flipHActive: transform.flipH,
    flipVActive: transform.flipV,
    reset,
  };
}
