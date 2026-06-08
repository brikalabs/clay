'use client';

import { UploadCloud } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';

/** A file rejected during drop, with the reason it was filtered out. */
interface DropzoneRejection {
  readonly file: File;
  readonly reason: 'size';
}

interface DropzoneContextValue {
  readonly isDragActive: boolean;
  readonly disabled: boolean;
}

const DropzoneContext = React.createContext<DropzoneContextValue | null>(null);

function useDropzone(): DropzoneContextValue {
  const ctx = React.use(DropzoneContext);
  if (!ctx) {
    throw new Error('Dropzone subcomponents must be rendered inside <Dropzone>.');
  }
  return ctx;
}

interface DropzoneProps extends Omit<React.ComponentProps<'div'>, 'onDrop'> {
  /** Comma-separated list of accepted types, forwarded to the native input. */
  readonly accept?: string;
  /** Allow dropping or selecting more than one file. */
  readonly multiple?: boolean;
  /** Reject files larger than this many bytes. */
  readonly maxSize?: number;
  /** Disable dragging, clicking, and keyboard activation. */
  readonly disabled?: boolean;
  /** Fires with the accepted files from a drop or the picker. */
  readonly onDrop?: (files: File[]) => void;
  /** Fires with any files filtered out by `maxSize`. */
  readonly onReject?: (rejections: DropzoneRejection[]) => void;
}

function Dropzone({
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  onDrop,
  onReject,
  className,
  children,
  ...props
}: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragDepth = React.useRef(0);
  const [isDragActive, setDragActive] = React.useState(false);

  const processFiles = (list: FileList | null) => {
    if (!list || list.length === 0) {
      return;
    }
    const all = [...list];
    if (maxSize === undefined) {
      onDrop?.(all);
      return;
    }
    const accepted: File[] = [];
    const rejected: DropzoneRejection[] = [];
    for (const file of all) {
      if (file.size > maxSize) {
        rejected.push({ file, reason: 'size' });
      } else {
        accepted.push(file);
      }
    }
    if (accepted.length > 0) {
      onDrop?.(accepted);
    }
    if (rejected.length > 0) {
      onReject?.(rejected);
    }
  };

  const ctx = React.useMemo<DropzoneContextValue>(
    () => ({ isDragActive, disabled }),
    [isDragActive, disabled]
  );

  return (
    <DropzoneContext value={ctx}>
      {/** biome-ignore lint/a11y/useSemanticElements: a drag-and-drop surface is a custom button, not a native one. */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        data-slot="dropzone"
        data-drag-active={isDragActive || undefined}
        data-disabled={disabled || undefined}
        onClick={(event) => {
          if (event.target === inputRef.current) {
            return;
          }
          if (!disabled) {
            inputRef.current?.click();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!disabled) {
              inputRef.current?.click();
            }
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (disabled) {
            return;
          }
          dragDepth.current += 1;
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && event.dataTransfer) {
            event.dataTransfer.dropEffect = 'copy';
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setDragActive(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setDragActive(false);
          if (!disabled) {
            processFiles(event.dataTransfer.files);
          }
        }}
        className={cn(
          'dropzone corner-themed flex flex-col items-center justify-center rounded-dropzone border-2 border-dropzone-border border-dashed bg-dropzone-container text-center outline-none transition-colors',
          'hover:bg-dropzone-active-container/60 focus-visible:ring-themed',
          'data-[drag-active]:border-dropzone-active-border data-[drag-active]:bg-dropzone-active-container',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-60',
          className
        )}
        {...props}
      >
        {children}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          tabIndex={-1}
          className="sr-only"
          onChange={(event) => {
            processFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>
    </DropzoneContext>
  );
}

function DropzoneIcon({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dropzone-icon"
      aria-hidden
      className={cn(
        "mb-1 text-dropzone-icon [&_svg:not([class*='size-'])]:size-8",
        className
      )}
      {...props}
    >
      {children ?? <UploadCloud />}
    </div>
  );
}

function DropzoneTitle({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="dropzone-title"
      className={cn('font-medium text-dropzone-title text-sm', className)}
      {...props}
    />
  );
}

function DropzoneDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="dropzone-description"
      className={cn('mt-0.5 text-dropzone-description text-xs', className)}
      {...props}
    />
  );
}

export { Dropzone, DropzoneDescription, DropzoneIcon, DropzoneTitle, useDropzone };
export type { DropzoneRejection };
