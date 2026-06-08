'use client';

import {
  Dropzone,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
} from '@brika/clay/components/dropzone';
import { ImageIcon } from 'lucide-react';

/** Restrict to images and accept multiple files with `accept` and `multiple`. */
export default function DropzoneImagesDemo() {
  return (
    <Dropzone
      aria-label="Upload images"
      accept="image/*"
      multiple
      className="min-h-44 w-full max-w-md"
    >
      <DropzoneIcon>
        <ImageIcon />
      </DropzoneIcon>
      <DropzoneTitle>Drop images to upload</DropzoneTitle>
      <DropzoneDescription>PNG, JPG or GIF · up to 10 files</DropzoneDescription>
    </Dropzone>
  );
}
