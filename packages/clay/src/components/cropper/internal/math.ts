/**
 * Pure geometry helpers for the Cropper. No React, no DOM side-effects.
 * Every function operates on an HTMLImageElement (for its natural dimensions)
 * and a Transform value, returning plain numbers or coordinates.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DEFAULT_STAGE = 288;
export const DEFAULT_OUTPUT = 512;
export const DEFAULT_QUALITY = 0.9;

// ---------------------------------------------------------------------------
// Transform type
// ---------------------------------------------------------------------------

export type Transform = {
  zoom: number;
  x: number;
  y: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
};

export const IDENTITY: Transform = { zoom: 1, x: 0, y: 0, rotation: 0, flipH: false, flipV: false };

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

/** Effective image dimensions after a 90-step rotation (axes swap at 90/270). */
export function effective(img: HTMLImageElement, rotation: number): { w: number; h: number } {
  const swap = rotation % 180 !== 0;
  return { w: swap ? img.height : img.width, h: swap ? img.width : img.height };
}

/** The scale (image px -> stage px) that makes the image just cover the square stage. */
export function coverScale(img: HTMLImageElement, rotation: number, stage: number): number {
  const { w, h } = effective(img, rotation);
  return Math.max(stage / w, stage / h);
}

/** Draw the transformed image into `ctx` for a canvas of side `size`. */
export function paint(
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
export function clampOffset(
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
