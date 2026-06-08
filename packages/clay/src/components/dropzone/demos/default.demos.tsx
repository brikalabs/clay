'use client';

import {
  Dropzone,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
} from '@brika/clay/components/dropzone';
import {
  FileUploadItem,
  FileUploadItemContent,
  FileUploadItemName,
  FileUploadItemPreview,
  FileUploadItemRemove,
  FileUploadItemSize,
  FileUploadList,
} from '@brika/clay/components/file-upload';
import { FileText, ImageIcon } from 'lucide-react';
import { useState } from 'react';

/** Drag a file in or click to browse; the selection renders below. */
export default function DropzoneDefaultDemo() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="w-full max-w-md space-y-3">
      <Dropzone
        aria-label="Upload a file"
        className="min-h-44"
        onDrop={(files) => setFile(files[0] ?? null)}
      >
        <DropzoneIcon />
        <DropzoneTitle>Drag &amp; drop a file here</DropzoneTitle>
        <DropzoneDescription>or click to browse from your device</DropzoneDescription>
      </Dropzone>
      {file && (
        <FileUploadList>
          <FileUploadItem>
            <FileUploadItemPreview>
              {file.type.startsWith('image/') ? <ImageIcon aria-hidden /> : <FileText aria-hidden />}
            </FileUploadItemPreview>
            <FileUploadItemContent>
              <FileUploadItemName>{file.name}</FileUploadItemName>
              <FileUploadItemSize bytes={file.size} />
            </FileUploadItemContent>
            <FileUploadItemRemove onClick={() => setFile(null)} />
          </FileUploadItem>
        </FileUploadList>
      )}
    </div>
  );
}
