'use client';

import * as React from 'react';
import { Button } from '@brika/clay/components/button';
import { useCropper } from '@brika/clay/components/cropper';

/**
 * Apply button shared across cropper demos. Reads getCroppedBlob and hasImage
 * from context; disabled when no image is loaded.
 */
export function ApplyButton({
  onApply,
  className,
  size = 'sm',
}: {
  readonly onApply: (blob: Blob) => void;
  readonly className?: string;
  readonly size?: React.ComponentProps<typeof Button>['size'];
}) {
  const { getCroppedBlob, hasImage } = useCropper();
  async function apply() {
    const blob = await getCroppedBlob();
    if (blob != null) onApply(blob);
  }
  return (
    <Button type="button" size={size} disabled={!hasImage} onClick={apply} className={className}>
      Apply
    </Button>
  );
}

/** Tailwind class for ghost icon buttons in the rotate/flip toolbar. */
export const toolbarBtn =
  'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';
