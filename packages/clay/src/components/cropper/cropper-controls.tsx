'use client';

import * as React from 'react';

import { Button } from '../button/button';
import { Slider } from '../slider/slider';
import { useCropper, useCropperTransform } from './internal/context';

// ---------------------------------------------------------------------------
// CropperZoom — a Clay Slider pre-bound to the cropper's zoom context
// ---------------------------------------------------------------------------

// Slider props that CropperZoom exposes as optional (context provides defaults).
type CropperZoomProps = Omit<React.ComponentProps<typeof Slider>, 'value' | 'onChange' | 'min' | 'max' | 'step'> & {
  /** Minimum zoom value. Defaults to the cropper's `minZoom` (1). */
  min?: number;
  /** Maximum zoom value. Defaults to the cropper's `maxZoom` (3). */
  max?: number;
  /** Slider step. Defaults to 0.01. Override with e.g. `step={0.1}`. */
  step?: number;
};

/**
 * A Clay Slider pre-wired to the zoom state from the nearest CropperContext.
 * Drop it anywhere inside a `<Cropper>` to get zoom control without manually
 * calling useCropperZoom and threading props through a Slider.
 *
 * Defaults: `step={0.01}`, `min` from `<Cropper minZoom>` (default 1),
 * `max` from `<Cropper maxZoom>` (default 3). All can be overridden:
 * `<CropperZoom step={0.1} />` or `<CropperZoom max={5} />`.
 */
export function CropperZoom({
  min,
  max,
  step = 0.01,
  ...props
}: CropperZoomProps) {
  const { zoom, setZoom, minZoom, maxZoom } = useCropper();
  return (
    <Slider
      min={min ?? minZoom}
      max={max ?? maxZoom}
      step={step}
      {...props}
      value={zoom}
      onChange={setZoom}
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
export function CropperRotate({
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
export function CropperFlip({
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
export function CropperReset({
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
