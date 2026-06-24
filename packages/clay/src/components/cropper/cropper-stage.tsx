'use client';

import { type PointerEvent as ReactPointerEvent } from 'react';
import * as React from 'react';

import { cn } from '../../primitives/cn';
import { useCropper } from './internal/context';
import { paint } from './internal/math';

// ---------------------------------------------------------------------------
// CropperCanvas: the interactive pan/zoom canvas
// ---------------------------------------------------------------------------

/**
 * The interactive crop canvas. Handles pointer drag, scroll-to-zoom, and
 * draws the image with the current transform from CropperContext. Place this
 * inside a `<Cropper>`.
 */
export function CropperCanvas({ className, ...props }: Omit<React.ComponentProps<'div'>, 'children'>) {
  const { img, transform, update, stageSize, canvasRef, minZoom, maxZoom } = useCropper();
  const drag = React.useRef<{ x: number; y: number } | null>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);

  // Repaint whenever the loaded image or transform changes.
  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas === null || img === null) return;
    const ctx = canvas.getContext('2d');
    if (ctx !== null) paint(ctx, img, transform, stageSize, stageSize);
  }, [canvasRef, img, transform, stageSize]);
  React.useEffect(redraw, [redraw]);

  // Scroll-to-zoom as a NON-passive native listener so we can preventDefault the
  // page scroll (React's onWheel is passive and cannot) and stop it bubbling.
  React.useEffect(() => {
    const el = stageRef.current;
    if (el === null) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      update((prev) => ({
        zoom: Math.min(maxZoom, Math.max(minZoom, prev.zoom - event.deltaY * 0.001)),
      }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [update, minZoom, maxZoom]);

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
// CropperOverlay: the crop boundary ring drawn over CropperCanvas
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
export function CropperOverlay({
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
// CropperFallback: composable empty-state slot shown when no image is loaded
// ---------------------------------------------------------------------------

/**
 * Composable empty-state part that renders its `children` only when the
 * cropper has no image loaded (`hasImage === false`). When an image is loaded
 * it renders nothing, so it self-hides without any consumer logic.
 *
 * Modelled on `AvatarFallback`. Place it inside a `<CropperViewport>` to
 * provide a custom icon/text prompt shown on the blank stage:
 *
 * ```tsx
 * <CropperViewport>
 *   <CropperFallback>
 *     <ImageUp className="size-8" />
 *     <span>Drop a photo or click upload</span>
 *   </CropperFallback>
 * </CropperViewport>
 * ```
 *
 * Layout: absolutely positioned, inset-0, flex-centered so it fills the
 * viewport without shifting other children. `pointer-events-none` keeps the
 * drag-drop target on the viewport itself active regardless of fallback content.
 * The `--cropper-placeholder-color` token sets the default muted text/icon
 * color; override via `className`.
 */
export function CropperFallback({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { hasImage } = useCropper();
  if (hasImage) return null;
  return (
    <div
      data-slot="cropper-fallback"
      className={cn(
        'pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-(--cropper-placeholder-color)',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CropperViewport: canvas + overlay stacked in a positioned wrapper
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
 * The overlay ring is rendered only when an image is loaded, so the empty
 * stage shows only the background and any `<CropperFallback>` placed as a
 * child. Drag-and-drop is active in both states. Dropped files are forwarded
 * to the context `loadFile`, which fires `onImageChange` on the root
 * `<Cropper>` and, in uncontrolled mode, also updates internal state. In
 * controlled mode wire `onImageChange` on `<Cropper>` to handle the dropped
 * file. Non-image files are silently ignored. The drop-active visual is keyed
 * off the `--cropper-drop-active-ring` token.
 */
export function CropperViewport({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { loadFile, hasImage, stageSize } = useCropper();
  const dragDepth = React.useRef(0);
  const [isDragActive, setDragActive] = React.useState(false);

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
    // Route through loadFile so onImageChange always fires on the root Cropper,
    // and internal state is updated in uncontrolled mode.
    loadFile(file);
  }

  return (
    <div
      data-slot="cropper-viewport"
      data-drag-active={isDragActive || undefined}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      // overflow-hidden clips the 9999px CropperOverlay box-shadow to the stage bounds.
      className={cn(
        'relative inline-flex overflow-hidden rounded-2xl transition-[outline]',
        isDragActive && 'outline-2 outline-offset-2 outline-(--cropper-drop-active-ring)',
        className,
      )}
      style={{ width: stageSize, height: stageSize }}
    >
      <CropperCanvas {...props} />
      {/* Overlay ring only when an image is loaded; empty stage shows no ring. */}
      {hasImage && <CropperOverlay className="absolute inset-0" />}
      {/* Consumer's CropperFallback (or any other children) rendered last so
          they sit above the canvas in stacking order. */}
      {children}
    </div>
  );
}
