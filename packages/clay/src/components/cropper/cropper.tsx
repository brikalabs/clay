'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';

import { type CropperContextValue, CropperContext } from './internal/context';
import {
  DEFAULT_OUTPUT,
  DEFAULT_QUALITY,
  DEFAULT_STAGE,
  IDENTITY,
  type Transform,
  clampOffset,
  paint,
} from './internal/math';

// ---------------------------------------------------------------------------
// Imperative handle (ref API exposed by Cropper root)
// ---------------------------------------------------------------------------

/** Ref handle returned by `<Cropper ref={...}>`. */
export interface CropperHandle {
  /** Export the current crop as a Blob. Returns null if no image is loaded. */
  getCroppedBlob: (outputSize?: number, quality?: number) => Promise<Blob | null>;
  /** Reset pan/zoom/rotation to identity. */
  reset: () => void;
  /** Current zoom level. */
  zoom: number;
  /** Set zoom level programmatically. */
  setZoom: (zoom: number) => void;
}

// ---------------------------------------------------------------------------
// Cropper root
// ---------------------------------------------------------------------------

export interface CropperProps {
  /**
   * The file to display in the cropper (controlled mode). When omitted the
   * cropper manages its own file state internally (uncontrolled mode) and
   * `CropperInput` / drag-drop on `CropperViewport` load files without any
   * consumer state. Pass `image` when you need to control the loaded file
   * from outside (e.g. a Dialog that clears on cancel).
   */
  image?: File | null;
  /**
   * Seed file for uncontrolled mode. Only read once on mount; ignored when
   * `image` is provided (controlled mode). Use this to preload a sample image
   * in demos or to restore a previously saved file; subsequent picks and
   * drag-drops still work without any additional wiring.
   */
  defaultImage?: File | null;
  /**
   * Called whenever a new file is loaded via `CropperInput` pick or
   * drag-drop on `CropperViewport`, in both controlled and uncontrolled mode.
   *
   * In **controlled mode** (`image` prop provided) this is the primary wiring
   * point: wire `onImageChange={setFile}` so picks and drops actually replace
   * the displayed image (without it, controlled mode ignores new files because
   * the consumer owns `image`).
   *
   * In **uncontrolled mode** this is an optional notification callback; the
   * cropper already updates its internal state automatically.
   */
  onImageChange?: (file: File) => void;
  /** Mask shape rendered by CropperOverlay: `'circle'` or `'rounded'`. Defaults to `'circle'`. */
  shape?: 'circle' | 'rounded';
  /** On-screen stage size in px. Defaults to 288. */
  stageSize?: number;
  /**
   * Minimum zoom level. Defaults to 1 (image just covers the stage).
   * CropperZoom's Slider min defaults to this value.
   */
  minZoom?: number;
  /**
   * Maximum zoom level. Defaults to 3.
   * CropperZoom's Slider max defaults to this value.
   */
  maxZoom?: number;
  children: React.ReactNode;
}

/**
 * Root of the Cropper compound component. Manages pan/zoom/rotation state in
 * React context so child parts (CropperCanvas, CropperOverlay) and sibling
 * controls (Slider, Buttons) can read and drive the same state without prop
 * drilling. Mount your own Dialog, Slider, and action Buttons around this.
 *
 * Supports two modes:
 * - **Uncontrolled** (default): omit `image`. `CropperInput` and drag-drop on
 *   `CropperViewport` manage the file state internally. Zero consumer state needed.
 * - **Controlled**: pass `image` to own the loaded file from outside (e.g. a
 *   Dialog that resets on cancel).
 */
const Cropper = React.forwardRef<CropperHandle, CropperProps>(function Cropper(
  {
    image,
    defaultImage,
    onImageChange,
    shape = 'circle',
    stageSize = DEFAULT_STAGE,
    minZoom = 1,
    maxZoom = 3,
    children,
  },
  ref,
) {
  // Uncontrolled internal file state. Only used when `image` prop is omitted.
  // Seed from `defaultImage` once so demos can preload a sample without
  // switching to controlled mode (picks and drops still work unmodified).
  const [internalFile, setInternalFile] = useState<File | null>(() => defaultImage ?? null);
  // The effective file is the controlled `image` prop when provided, otherwise
  // the internally managed file.
  const isControlled = image !== undefined;
  const effectiveFile = isControlled ? image : internalFile;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [transform, setTransform] = useState<Transform>(IDENTITY);

  // Load the effective file into an <img> and reset the transform.
  useEffect(() => {
    if (effectiveFile == null) {
      setImg(null);
      setTransform(IDENTITY);
      return;
    }
    const url = URL.createObjectURL(effectiveFile);
    const el = new Image();
    el.onload = () => {
      setImg(el);
      setTransform(IDENTITY);
    };
    el.src = url;
    return () => URL.revokeObjectURL(url);
  }, [effectiveFile]);

  const update = useCallback(
    (patch: Partial<Transform> | ((prev: Transform) => Partial<Transform>)) => {
      setTransform((prev) => {
        const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
        return img === null ? next : { ...next, ...clampOffset(img, next, stageSize) };
      });
    },
    [img, stageSize],
  );

  const reset = useCallback(() => setTransform(IDENTITY), []);

  const setZoom = useCallback(
    (zoom: number) => update({ zoom: Math.min(maxZoom, Math.max(minZoom, zoom)) }),
    [update, minZoom, maxZoom],
  );

  const getCroppedBlob = useCallback(
    (outputSize = DEFAULT_OUTPUT, quality = DEFAULT_QUALITY): Promise<Blob | null> => {
      if (img === null) return Promise.resolve(null);
      const out = document.createElement('canvas');
      out.width = outputSize;
      out.height = outputSize;
      const ctx = out.getContext('2d');
      if (ctx === null) return Promise.resolve(null);
      paint(ctx, img, transform, outputSize, stageSize);
      return new Promise((resolve) => {
        out.toBlob((blob) => resolve(blob), 'image/webp', quality);
      });
    },
    [img, transform, stageSize],
  );

  useImperativeHandle(
    ref,
    () => ({ getCroppedBlob, reset, zoom: transform.zoom, setZoom }),
    [getCroppedBlob, reset, transform.zoom, setZoom],
  );

  // Always notify the consumer via onImageChange so both CropperInput picks and
  // drag-drop fire the same callback regardless of mode. Additionally, in
  // uncontrolled mode update internal state so the image renders without any
  // consumer wiring. In controlled mode the consumer owns `image`, so they must
  // wire onImageChange={setFile} to actually replace the displayed image.
  const loadFile = useCallback(
    (file: File) => {
      onImageChange?.(file);
      if (!isControlled) setInternalFile(file);
    },
    [isControlled, onImageChange],
  );

  const contextValue: CropperContextValue = {
    zoom: transform.zoom,
    setZoom,
    transform,
    update,
    reset,
    stageSize,
    img,
    hasImage: img !== null,
    shape,
    minZoom,
    maxZoom,
    canvasRef,
    getCroppedBlob,
    loadFile,
  };

  return <CropperContext value={contextValue}>{children}</CropperContext>;
});

export { Cropper };
