'use client';

import { Button } from '@brika/clay/components/button';
import {
  FileUpload,
  FileUploadItem,
  FileUploadItemContent,
  FileUploadItemName,
  FileUploadItemPreview,
  FileUploadItemRemove,
  FileUploadItemSize,
  FileUploadList,
  FileUploadTrigger,
} from '@brika/clay/components/file-upload';
import { FileText, ImageIcon, Upload } from 'lucide-react';
import { useState } from 'react';

interface PickedFile {
  readonly id: string;
  readonly name: string;
  readonly size: number;
}

/** Pick files, then list each with its name, size, and a remove button. */
export default function FileUploadDefaultDemo() {
  const [files, setFiles] = useState<PickedFile[]>([
    { id: 'a', name: 'quarterly-report.pdf', size: 2_411_724 },
    { id: 'b', name: 'cover-photo.jpg', size: 845_120 },
  ]);

  return (
    <FileUpload
      className="w-full max-w-md"
      multiple
      onFilesSelected={(selected) =>
        setFiles((prev) => [
          ...prev,
          ...selected.map((file) => ({
            id: `${file.name}-${file.size}`,
            name: file.name,
            size: file.size,
          })),
        ])
      }
    >
      <FileUploadTrigger asChild>
        <Button variant="outline">
          <Upload aria-hidden />
          Choose files
        </Button>
      </FileUploadTrigger>
      {files.length > 0 && (
        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem key={file.id}>
              <FileUploadItemPreview>
                {file.name.endsWith('.jpg') ? <ImageIcon aria-hidden /> : <FileText aria-hidden />}
              </FileUploadItemPreview>
              <FileUploadItemContent>
                <FileUploadItemName>{file.name}</FileUploadItemName>
                <FileUploadItemSize bytes={file.size} />
              </FileUploadItemContent>
              <FileUploadItemRemove
                onClick={() => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
              />
            </FileUploadItem>
          ))}
        </FileUploadList>
      )}
    </FileUpload>
  );
}
