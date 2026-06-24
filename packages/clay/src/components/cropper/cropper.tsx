'use client';

import {
  type PointerEvent as ReactPointerEvent,
  createContext,
  use,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import * as React from 'react';

import { Slider } from '../slider/slider';
import { cn } from '../../primitives/cn';

// ---------------------------------------------------------------------------
// Pure math helpers — kept verbatim from the original image-crop implementation
// ---------------------------------------------------------------------------

const DEFAULT_STAGE = 288;
const DEFAULT_OUTPUT = 512;
const DEFAULT_QUALITY = 0.9;

type Transform = {
  zoom: number;
  x: number;
  y: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
};

const IDENTITY: Transform = { zoom: 1, x: 0, y: 0, rotation: 0, flipH: false, flipV: false };

/** Effective image dimensions after a 90-step rotation (axes swap at 90/270). */
function effective(img: HTMLImageElement, rotation: number): { w: number; h: number } {
  const swap = rotation % 180 !== 0;
  return { w: swap ? img.height : img.width, h: swap ? img.width : img.height };
}

/** The scale (image px -> stage px) that makes the image just cover the square stage. */
function coverScale(img: HTMLImageElement, rotation: number, stage: number): number {
  const { w, h } = effective(img, rotation);
  return Math.max(stage / w, stage / h);
}

/** Draw the transformed image into `ctx` for a canvas of side `size`. */
function paint(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  t: Transform,
  size: number,
  stage: number,
): void {
  const r = size / stage;
  const k = coverScale(img, t.rotation, stage) * t.zoom * r;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(size / 2 + t.x * r, size / 2 + t.y * r);
  ctx.rotate((t.rotation * Math.PI) / 180);
  ctx.scale((t.flipH ? -1 : 1) * k, (t.flipV ? -1 : 1) * k);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();
}

/** Keep the offset within bounds so the scaled image always covers the stage. */
function clampOffset(
  img: HTMLImageElement,
  t: Transform,
  stage: number,
): { x: number; y: number } {
  const { w, h } = effective(img, t.rotation);
  const scale = coverScale(img, t.rotation, stage) * t.zoom;
  const maxX = Math.max(0, (w * scale - stage) / 2);
  const maxY = Math.max(0, (h * scale - stage) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, t.x)),
    y: Math.min(maxY, Math.max(-maxY, t.y)),
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CropperContextValue {
  /** Current zoom level (1 = fit, 3 = max). */
  zoom: number;
  /** Update zoom. */
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
  /** Crop shape, forwarded to CropperOverlay. */
  shape: 'circle' | 'rounded';
  /** Ref to the canvas element, used by getCroppedBlob. */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Export the current crop as a Blob. Returns null if no image is loaded. */
  getCroppedBlob: (outputSize?: number, quality?: number) => Promise<Blob | null>;
}

const CropperContext = createContext<CropperContextValue | null>(null);

function useCropper(): CropperContextValue {
  const ctx = use(CropperContext);
  if (ctx === null) throw new Error('useCropper must be used inside <Cropper>');
  return ctx;
}

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
  /** The file to display in the cropper. Changing this resets the transform. */
  image: File | null;
  /** Mask shape rendered by CropperOverlay: `'circle'` or `'rounded'`. Defaults to `'circle'`. */
  shape?: 'circle' | 'rounded';
  /** On-screen stage size in px. Defaults to 288. */
  stageSize?: number;
  children: React.ReactNode;
}

/**
 * Root of the Cropper compound component. Manages pan/zoom/rotation state in
 * React context so child parts (CropperCanvas, CropperOverlay) and sibling
 * controls (Slider, Buttons) can read and drive the same state without prop
 * drilling. Mount your own Dialog, Slider, and action Buttons around this.
 */
const Cropper = React.forwardRef<CropperHandle, CropperProps>(function Cropper(
  { image, shape = 'circle', stageSize = DEFAULT_STAGE, children },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [transform, setTransform] = useState<Transform>(IDENTITY);

  // Load the picked file into an <img> and reset the transform.
  useEffect(() => {
    if (image === null) {
      setImg(null);
      setTransform(IDENTITY);
      return;
    }
    const url = URL.createObjectURL(image);
    const el = new Image();
    el.onload = () => {
      setImg(el);
      setTransform(IDENTITY);
    };
    el.src = url;
    return () => URL.revokeObjectURL(url);
  }, [image]);

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
    (zoom: number) => update({ zoom: Math.min(3, Math.max(1, zoom)) }),
    [update],
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

  const contextValue: CropperContextValue = {
    zoom: transform.zoom,
    setZoom,
    transform,
    update,
    reset,
    stageSize,
    img,
    shape,
    canvasRef,
    getCroppedBlob,
  };

  return <CropperContext value={contextValue}>{children}</CropperContext>;
});

// ---------------------------------------------------------------------------
// CropperCanvas — the interactive pan/zoom canvas
// ---------------------------------------------------------------------------

/**
 * The interactive crop canvas. Handles pointer drag, scroll-to-zoom, and
 * draws the image with the current transform from CropperContext. Place this
 * inside a `<Cropper>`.
 */
function CropperCanvas({ className, ...props }: Omit<React.ComponentProps<'div'>, 'children'>) {
  const { img, transform, update, stageSize, canvasRef } = useCropper();
  const drag = useRef<{ x: number; y: number } | null>(null);

  // Repaint whenever the loaded image or transform changes.
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas === null || img === null) return;
    const ctx = canvas.getContext('2d');
    if (ctx !== null) paint(ctx, img, transform, stageSize, stageSize);
  }, [canvasRef, img, transform, stageSize]);
  useEffect(redraw, [redraw]);

  function onPointerDown(event: ReactPointerEvent) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY };
  }
  function onPointerMove(event: ReactPointerEvent) {
    if (drag.current === null) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current = { x: event.clientX, y: event.clientY };
    update((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }
  function onPointerUp() {
    drag.current = null;
  }

  return (
    <div
      data-slot="cropper-canvas"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={(e) =>
        update((prev) => ({ zoom: Math.min(3, Math.max(1, prev.zoom - e.deltaY * 0.001)) }))
      }
      className={cn(
        'relative cursor-grab touch-none select-none overflow-hidden rounded-2xl bg-cropper-stage-bg active:cursor-grabbing',
        className,
      )}
      style={{ width: stageSize, height: stageSize }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        width={stageSize}
        height={stageSize}
        style={{ width: stageSize, height: stageSize }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CropperOverlay — the vignette mask drawn over CropperCanvas
// ---------------------------------------------------------------------------

/**
 * The crop mask overlay (vignette + border ring) drawn on top of CropperCanvas.
 * Shape is read from CropperContext; override by passing `shape` explicitly.
 * Typically rendered as an absolute sibling inside the same relative container
 * as CropperCanvas, or stacked via CSS.
 */
function CropperOverlay({
  shape: shapeProp,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  /** Override the shape from context. */
  shape?: 'circle' | 'rounded';
}) {
  const { shape: ctxShape } = useCropper();
  const shape = shapeProp ?? ctxShape;
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  return (
    <>
      <div
        data-slot="cropper-overlay"
        className={cn(
          'pointer-events-none absolute inset-0',
          shapeClass,
          'shadow-[0_0_0_9999px_var(--cropper-overlay-color)]',
          className,
        )}
        {...props}
      />
      <div
        data-slot="cropper-overlay-border"
        className={cn(
          'pointer-events-none absolute inset-0 border border-[color:var(--cropper-overlay-border)]',
          shapeClass,
        )}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// useCropperZoom — convenience hook for wiring a Slider
// ---------------------------------------------------------------------------

/**
 * Returns `{ zoom, setZoom }` from the nearest CropperContext.
 * Wire directly to a Clay `<Slider min={1} max={3} step={0.01} value={zoom} onChange={setZoom} />`.
 */
function useCropperZoom(): { zoom: number; setZoom: (zoom: number) => void } {
  const { zoom, setZoom } = useCropper();
  return { zoom, setZoom };
}

// ---------------------------------------------------------------------------
// useCropperTransform — convenience hook for rotation/flip toolbar buttons
// ---------------------------------------------------------------------------

/**
 * Returns helpers for the rotation/flip toolbar.
 * `rotateLeft` / `rotateRight` step by 90 degrees; `flipH` / `flipV` toggle the flip flags;
 * `reset` returns to the identity transform.
 */
function useCropperTransform(): {
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

// ---------------------------------------------------------------------------
// CropperViewport — canvas + overlay stacked in a positioned wrapper
// ---------------------------------------------------------------------------

/**
 * Convenience part that renders CropperCanvas and CropperOverlay stacked in a
 * relative wrapper. Drop this in instead of manually wrapping the two parts
 * in a positioned div. Accepts the same props as CropperCanvas; the overlay
 * shape is read from context.
 *
 * Use the lower-level `CropperCanvas` + `CropperOverlay` directly when you
 * need to place the overlay independently or apply a custom clip.
 *
 * Pass `onImageDrop` to accept drag-and-drop image files. When the user drops
 * an image file onto the viewport the callback fires with the `File` so the
 * consumer can set it as the controlled `image` prop on `<Cropper>`. Non-image
 * files are silently ignored. The drop-active visual is keyed off the
 * `--cropper-drop-active-ring` token.
 */
function CropperViewport({
  className,
  onImageDrop,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  /** Called with the dropped image File. Set it as the `image` prop on the parent `<Cropper>`. */
  readonly onImageDrop?: (file: File) => void;
}) {
  const dragDepth = useRef(0);
  const [isDragActive, setDragActive] = useState(false);

  function onDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!onImageDrop) return;
    dragDepth.current += 1;
    setDragActive(true);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (onImageDrop && event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragActive(false);
    }
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragActive(false);
    if (!onImageDrop) return;
    const file = [...event.dataTransfer.files].find((f) => f.type.startsWith('image/'));
    if (file) onImageDrop(file);
  }

  return (
    <div
      data-slot="cropper-viewport"
      data-drag-active={isDragActive || undefined}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'relative inline-flex rounded-2xl transition-[outline]',
        isDragActive && 'outline-2 outline-offset-2 outline-(--cropper-drop-active-ring)',
        className,
      )}
    >
      <CropperCanvas {...props} />
      <CropperOverlay className="absolute inset-0" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CropperZoom — a Clay Slider pre-bound to the cropper's zoom context
// ---------------------------------------------------------------------------

/**
 * A Clay Slider pre-wired to the zoom state from the nearest CropperContext.
 * Drop it anywhere inside a `<Cropper>` to get zoom control without manually
 * calling useCropperZoom and threading props through a Slider.
 *
 * Accepts `className` for layout; other Slider props are fixed to the crop
 * range (min=1, max=3, step=0.01).
 */
function CropperZoom({ className }: { className?: string }) {
  const { zoom, setZoom } = useCropper();
  return (
    <Slider
      min={1}
      max={3}
      step={0.01}
      value={zoom}
      onChange={setZoom}
      className={className}
    />
  );
}

// ---------------------------------------------------------------------------
// CropperRotate — toolbar buttons for 90-degree rotation steps
// ---------------------------------------------------------------------------

/**
 * A pair of rotate-left / rotate-right icon buttons wired to
 * useCropperTransform. Pass `direction="left"` (default) or `"right"`.
 * Renders a plain `<button>` so the consumer controls styling; add a Clay
 * Button wrapper via `asChild` if preferred.
 */
function CropperRotate({
  direction = 'left',
  children,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  /** Which direction to rotate. Defaults to `'left'`. */
  direction?: 'left' | 'right';
}) {
  const { rotateLeft, rotateRight } = useCropperTransform();
  const handleClick = direction === 'left' ? rotateLeft : rotateRight;
  return (
    <button
      type="button"
      data-slot="cropper-rotate"
      data-direction={direction}
      {...props}
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// CropperFlip — toggle button for horizontal / vertical flip
// ---------------------------------------------------------------------------

/**
 * A toggle button wired to the horizontal or vertical flip flag in context.
 * `data-active` is set when the flip is applied, so you can style the pressed
 * state via `data-[active=true]:...` Tailwind utilities.
 */
function CropperFlip({
  axis = 'h',
  children,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  /** Which axis to flip. Defaults to `'h'` (horizontal). */
  axis?: 'h' | 'v';
}) {
  const { flipH, flipV, flipHActive, flipVActive } = useCropperTransform();
  const active = axis === 'h' ? flipHActive : flipVActive;
  const handleClick = axis === 'h' ? flipH : flipV;
  return (
    <button
      type="button"
      data-slot="cropper-flip"
      data-axis={axis}
      data-active={active || undefined}
      {...props}
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// CropperReset — button that resets the transform to identity
// ---------------------------------------------------------------------------

/**
 * A button that calls `reset()` from CropperContext when clicked, returning
 * the image to its initial pan/zoom/rotation state.
 */
function CropperReset({ children, className, ...props }: React.ComponentProps<'button'>) {
  const { reset } = useCropper();
  return (
    <button
      type="button"
      data-slot="cropper-reset"
      {...props}
      onClick={reset}
      className={className}
    >
      {children}
    </button>
  );
}

export {
  Cropper,
  CropperCanvas,
  CropperOverlay,
  CropperViewport,
  CropperZoom,
  CropperRotate,
  CropperFlip,
  CropperReset,
  useCropper,
  useCropperZoom,
  useCropperTransform,
};
