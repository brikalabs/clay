'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';

import { type VariantProps } from 'class-variance-authority';
import { Button, buttonVariants } from '../button/button';
import { useCropper } from './internal/context';

// ---------------------------------------------------------------------------
// CropperInput — file picker wired to context
// ---------------------------------------------------------------------------

/**
 * A file-picker trigger wired to the nearest CropperContext. Clicking it opens
 * the OS file browser (filtered to images). When the user picks a file it is
 * loaded into the cropper automatically — no consumer state required.
 *
 * In uncontrolled mode (default) the file is stored inside `<Cropper>`.
 * In controlled mode (when `image` is passed to `<Cropper>`) wire
 * `onImageChange` on the root `<Cropper>` so the picked file updates the
 * controlled image state; without it the pick fires `onImageChange` but the
 * displayed image will not change because the consumer owns `image`.
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
export function CropperInput({
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
  const inputRef = React.useRef<HTMLInputElement>(null);

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
export function CropperCancel({
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
export function CropperApply({
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
