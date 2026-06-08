'use client';

import { Button } from '@brika/clay/components/button';
import {
  FileUpload,
  FileUploadItem,
  FileUploadItemContent,
  FileUploadItemName,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadItemRemove,
  FileUploadItemSize,
  FileUploadList,
  FileUploadTrigger,
} from '@brika/clay/components/file-upload';
import { FileText, Upload } from 'lucide-react';

const UPLOADS = [
  { id: 'a', name: 'build-artifacts.zip', size: 18_874_368, progress: 72 },
  { id: 'b', name: 'dataset.csv', size: 4_194_304, progress: 38 },
];

/** Show per-file upload progress with an inline progress bar. */
export default function FileUploadProgressDemo() {
  return (
    <FileUpload className="w-full max-w-md">
      <FileUploadTrigger asChild>
        <Button variant="outline">
          <Upload aria-hidden />
          Upload files
        </Button>
      </FileUploadTrigger>
      <FileUploadList>
        {UPLOADS.map((file) => (
          <FileUploadItem key={file.id}>
            <FileUploadItemPreview>
              <FileText aria-hidden />
            </FileUploadItemPreview>
            <FileUploadItemContent>
              <FileUploadItemName>{file.name}</FileUploadItemName>
              <FileUploadItemSize>
                {Math.round((file.size * file.progress) / 100 / 1024)} KB of{' '}
                {Math.round(file.size / 1024)} KB · {file.progress}%
              </FileUploadItemSize>
              <FileUploadItemProgress value={file.progress} />
            </FileUploadItemContent>
            <FileUploadItemRemove aria-label={`Cancel upload of ${file.name}`} />
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
