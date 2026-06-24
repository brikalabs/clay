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
import { Slot } from 'radix-ui';

import { type VariantProps } from 'class-variance-authority';
import { ImageIcon } from 'lucide-react';
import { Button, buttonVariants } from '../button/button';
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
  /** True when an image is fully loaded and ready to crop. */
  hasImage: boolean;
  /** Crop shape, forwarded to CropperOverlay. */
  shape: 'circle' | 'rounded';
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
   * in demos or to restore a previously saved file — subsequent picks and
   * drag-drops still work without any additional wiring.
   */
  defaultImage?: File | null;
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
 *
 * Supports two modes:
 * - **Uncontrolled** (default): omit `image`. `CropperInput` and drag-drop on
 *   `CropperViewport` manage the file state internally. Zero consumer state needed.
 * - **Controlled**: pass `image` to own the loaded file from outside (e.g. a
 *   Dialog that resets on cancel).
 */
const Cropper = React.forwardRef<CropperHandle, CropperProps>(function Cropper(
  { image, defaultImage, shape = 'circle', stageSize = DEFAULT_STAGE, children },
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

  // In uncontrolled mode, loadFile updates internal state. In controlled mode
  // the consumer owns the image prop, so this is a no-op (they wire their own
  // file handler, e.g. via CropperViewport's onImageDrop).
  const loadFile = useCallback(
    (file: File) => {
      if (!isControlled) setInternalFile(file);
    },
    [isControlled],
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
    canvasRef,
    getCroppedBlob,
    loadFile,
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
  const stageRef = useRef<HTMLDivElement>(null);

  // Repaint whenever the loaded image or transform changes.
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas === null || img === null) return;
    const ctx = canvas.getContext('2d');
    if (ctx !== null) paint(ctx, img, transform, stageSize, stageSize);
  }, [canvasRef, img, transform, stageSize]);
  useEffect(redraw, [redraw]);

  // Scroll-to-zoom as a NON-passive native listener so we can preventDefault the
  // page scroll (React's onWheel is passive and cannot) and stop it bubbling.
  useEffect(() => {
    const el = stageRef.current;
    if (el === null) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      update((prev) => ({ zoom: Math.min(3, Math.max(1, prev.zoom - event.deltaY * 0.001)) }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [update]);

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
      ref={stageRef}
      data-slot="cropper-canvas"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
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
// CropperOverlay — the crop boundary ring drawn over CropperCanvas
// ---------------------------------------------------------------------------

/**
 * The crop mask rendered on top of CropperCanvas. Dims the area OUTSIDE the
 * crop circle/rectangle via a large box-shadow (scrim), then draws a thin ring
 * on the inner edge of the crop area. Shape is read from CropperContext;
 * override by passing `shape` explicitly.
 *
 * The parent stage wrapper must be `overflow-hidden` so the 9999px box-shadow
 * is clipped to the stage bounds and does not bleed onto the page.
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
      {/* Scrim: large box-shadow dims everything outside the crop area */}
      <div
        data-slot="cropper-overlay-scrim"
        className={cn(
          'pointer-events-none absolute inset-0 shadow-[0_0_0_9999px_var(--cropper-overlay-color)]',
          shapeClass,
        )}
        {...props}
      />
      {/* Ring: thin border on the inner edge of the crop area */}
      <div
        data-slot="cropper-overlay-border"
        className={cn(
          'pointer-events-none absolute inset-0 border border-[color:var(--cropper-overlay-border)]',
          shapeClass,
          className,
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
 * Drag-and-drop is always active. In uncontrolled mode (no `image` prop on the
 * parent `<Cropper>`) dropped files are loaded automatically. In controlled mode
 * pass `onImageDrop` to handle the dropped `File` yourself. Non-image files are
 * silently ignored. The drop-active visual is keyed off the
 * `--cropper-drop-active-ring` token.
 */
function CropperViewport({
  className,
  onImageDrop,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  /**
   * Called with the dropped image File in controlled mode. In uncontrolled
   * mode you can omit this; the file is loaded into the cropper automatically.
   */
  readonly onImageDrop?: (file: File) => void;
}) {
  const { loadFile, img, stageSize } = useCropper();
  const dragDepth = useRef(0);
  const [isDragActive, setDragActive] = useState(false);

  function onDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current += 1;
    setDragActive(true);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.dataTransfer) {
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
    const file = [...event.dataTransfer.files].find((f) => f.type.startsWith('image/'));
    if (!file) return;
    // Consumer callback takes priority (controlled mode); fall back to context
    // loadFile (uncontrolled mode — no-op when controlled).
    if (onImageDrop) {
      onImageDrop(file);
    } else {
      loadFile(file);
    }
  }

  const wrapperClass = cn(
    // overflow-hidden clips the 9999px CropperOverlay box-shadow to the stage bounds.
    'relative inline-flex overflow-hidden rounded-2xl transition-[outline]',
    isDragActive && 'outline-2 outline-offset-2 outline-(--cropper-drop-active-ring)',
    className,
  );

  // When no image is loaded, render an intentional empty/placeholder state
  // instead of an empty canvas + circular overlay (which looks broken).
  if (img === null) {
    return (
      <div
        data-slot="cropper-viewport"
        data-drag-active={isDragActive || undefined}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          wrapperClass,
          'items-center justify-center bg-(--cropper-stage-bg)',
        )}
        style={{ width: stageSize, height: stageSize }}
      >
        <div
          data-slot="cropper-placeholder"
          className="flex flex-col items-center gap-2 text-(--cropper-placeholder-color)"
        >
          <ImageIcon className="size-10 opacity-60" />
          <span className="text-xs font-medium">Drop an image here</span>
          <span className="text-xs opacity-60">or choose a file</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot="cropper-viewport"
      data-drag-active={isDragActive || undefined}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={wrapperClass}
    >
      <CropperCanvas {...props} />
      <CropperOverlay className="absolute inset-0" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CropperInput — file picker wired to context
// ---------------------------------------------------------------------------

/**
 * A file-picker trigger wired to the nearest CropperContext. Clicking it opens
 * the OS file browser (filtered to images). When the user picks a file it is
 * loaded into the cropper automatically — no consumer state required.
 *
 * In uncontrolled mode (default) the file is stored inside `<Cropper>`.
 * In controlled mode (when `image` is passed to `<Cropper>`) the picked file
 * is still forwarded to the internal `loadFile` callback, which is a no-op for
 * the transform; consumers in controlled mode should also wire their own
 * `onChange` on the underlying `<input>` via the `asChild` pattern.
 *
 * Usage — default (renders a Clay Button):
 * ```tsx
 * <CropperInput>Choose photo</CropperInput>
 * ```
 *
 * Usage — custom trigger via `asChild`:
 * ```tsx
 * <CropperInput asChild>
 *   <Avatar size="lg"><AvatarFallback>AB</AvatarFallback></Avatar>
 * </CropperInput>
 * ```
 */
function CropperInput({
  asChild = false,
  children,
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /**
     * When true, merges the file-picker behaviour into the single child element
     * (Slot pattern). Useful when you want an Avatar or any other element to act
     * as the pick trigger.
     */
    asChild?: boolean;
  }) {
  const { loadFile } = useCropper();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    // Reset so the same file can be re-picked.
    e.target.value = '';
  }

  function openPicker() {
    inputRef.current?.click();
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
        tabIndex={-1}
        aria-hidden
      />
      {asChild ? (
        <Slot.Root
          data-slot="cropper-input"
          {...props}
          className={className}
          onClick={openPicker}
        >
          {children}
        </Slot.Root>
      ) : (
        <Button
          type="button"
          data-slot="cropper-input"
          variant={variant}
          size={size}
          {...props}
          className={className}
          onClick={openPicker}
        >
          {children}
        </Button>
      )}
    </>
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
 * A rotate-left / rotate-right icon button wired to the cropper transform.
 * Pass `direction="left"` (default) or `"right"`. Renders as a Clay ghost
 * icon button; pass `className` for additional layout overrides.
 */
function CropperRotate({
  direction = 'left',
  variant = 'outline',
  size = 'icon-sm',
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  /** Which direction to rotate. Defaults to `'left'`. */
  direction?: 'left' | 'right';
}) {
  const { rotateLeft, rotateRight } = useCropperTransform();
  const handleClick = direction === 'left' ? rotateLeft : rotateRight;
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      data-slot="cropper-rotate"
      data-direction={direction}
      {...props}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// CropperFlip — toggle button for horizontal / vertical flip
// ---------------------------------------------------------------------------

/**
 * A flip toggle button wired to the horizontal or vertical flip flag in
 * context. Renders as a Clay ghost icon button. `data-active` is set when
 * the flip is applied, so you can style the pressed state via
 * `data-[active=true]:...` Tailwind utilities.
 */
function CropperFlip({
  axis = 'h',
  variant = 'outline',
  size = 'icon-sm',
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  /** Which axis to flip. Defaults to `'h'` (horizontal). */
  axis?: 'h' | 'v';
}) {
  const { flipH, flipV, flipHActive, flipVActive } = useCropperTransform();
  const active = axis === 'h' ? flipHActive : flipVActive;
  const handleClick = axis === 'h' ? flipH : flipV;
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      data-slot="cropper-flip"
      data-axis={axis}
      data-active={active || undefined}
      {...props}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// CropperReset — button that resets the transform to identity
// ---------------------------------------------------------------------------

/**
 * A button that calls `reset()` from CropperContext when clicked, returning
 * the image to its initial pan/zoom/rotation state. Renders as a Clay ghost
 * icon button.
 */
function CropperReset({
  variant = 'outline',
  size = 'icon-sm',
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { reset } = useCropper();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      data-slot="cropper-reset"
      {...props}
      onClick={reset}
      className={className}
    >
      {children}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// CropperCancel — button that resets the transform and fires an optional callback
// ---------------------------------------------------------------------------

/**
 * A button that calls `reset()` from CropperContext (returning the image to its
 * initial transform) and fires an optional `onCancel` callback so the consumer
 * can close their Dialog or otherwise dismiss the cropper.
 *
 * Symmetric with `CropperApply`. Renders as a Clay `outline` Button by default;
 * pass `variant`, `size`, and `children` to customise. Supports `asChild` to
 * merge the behaviour into any custom trigger.
 *
 * Usage:
 * ```tsx
 * <CropperCancel onCancel={() => setOpen(false)}>Cancel</CropperCancel>
 * ```
 */
function CropperCancel({
  onCancel,
  asChild = false,
  children,
  className,
  variant = 'outline',
  size,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Called after the transform is reset, e.g. to close a Dialog. */
    onCancel?: () => void;
    /**
     * When true, merges the cancel behaviour into the single child element
     * (Slot pattern). The child receives the `onClick` prop.
     */
    asChild?: boolean;
  }) {
  const { reset } = useCropper();

  function handleClick() {
    reset();
    onCancel?.();
  }

  if (asChild) {
    return (
      <Slot.Root
        data-slot="cropper-cancel"
        {...props}
        className={className}
        onClick={handleClick}
      >
        {children}
      </Slot.Root>
    );
  }

  return (
    <Button
      type="button"
      data-slot="cropper-cancel"
      variant={variant}
      size={size}
      {...props}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// CropperApply — button that exports the crop and fires a callback
// ---------------------------------------------------------------------------

/**
 * A button that exports the current crop as a Blob and calls `onCrop` with it.
 * Disabled when no image is loaded. Renders as a Clay Button; pass `variant`,
 * `size`, and `children` to customise the appearance.
 *
 * Usage:
 * ```tsx
 * <CropperApply onCrop={(blob) => uploadBlob(blob)}>Save photo</CropperApply>
 * ```
 *
 * Use `asChild` to supply your own trigger element:
 * ```tsx
 * <CropperApply asChild onCrop={handleCrop}>
 *   <MyCustomButton />
 * </CropperApply>
 * ```
 */
function CropperApply({
  onCrop,
  asChild = false,
  children,
  className,
  variant,
  size,
  disabled,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Called with the cropped Blob after the user confirms. */
    onCrop?: (blob: Blob) => void;
    /**
     * When true, merges the apply behaviour into the single child element
     * (Slot pattern). The child receives `onClick` and `disabled` props.
     */
    asChild?: boolean;
  }) {
  const { getCroppedBlob, hasImage } = useCropper();

  async function handleClick() {
    const blob = await getCroppedBlob();
    if (blob != null) onCrop?.(blob);
  }

  if (asChild) {
    // Pass disabled and onClick through spread so Slot merges them onto the child.
    const slotProps = { ...props, 'data-slot': 'cropper-apply', disabled: disabled ?? !hasImage, className, onClick: handleClick };
    return (
      <Slot.Root {...slotProps}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <Button
      type="button"
      data-slot="cropper-apply"
      variant={variant}
      size={size}
      disabled={disabled ?? !hasImage}
      {...props}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

export {
  Cropper,
  CropperApply,
  CropperCancel,
  CropperCanvas,
  CropperInput,
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
