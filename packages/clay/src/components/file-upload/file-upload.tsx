'use client';

import { X } from 'lucide-react';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';
import { Button } from '../button/button';
import { Progress } from '../progress/progress';

/**
 * Format a byte count as a short human-readable string (`1.4 MB`).
 * Whole bytes render without a decimal; larger units show one place.
 */
function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  const unit = units[exponent] ?? 'B';
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${unit}`;
}

interface FileUploadContextValue {
  readonly openFileDialog: () => void;
  readonly disabled: boolean;
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null);

function useFileUpload(): FileUploadContextValue {
  const ctx = React.use(FileUploadContext);
  if (!ctx) {
    throw new Error('FileUpload subcomponents must be rendered inside <FileUpload>.');
  }
  return ctx;
}

interface FileUploadProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Comma-separated list of accepted types, forwarded to the native input. */
  readonly accept?: string;
  /** Allow selecting more than one file at a time. */
  readonly multiple?: boolean;
  /** Disable the trigger and the underlying input. */
  readonly disabled?: boolean;
  /** Fires with the chosen files whenever the picker resolves. */
  readonly onFilesSelected?: (files: File[]) => void;
}

function FileUpload({
  accept,
  multiple = false,
  disabled = false,
  onFilesSelected,
  className,
  children,
  ...props
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const openFileDialog = React.useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const ctx = React.useMemo<FileUploadContextValue>(
    () => ({ openFileDialog, disabled }),
    [openFileDialog, disabled]
  );

  return (
    <FileUploadContext value={ctx}>
      <div data-slot="file-upload" className={cn('flex flex-col gap-3', className)} {...props}>
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
            const files = event.target.files ? [...event.target.files] : [];
            if (files.length > 0) {
              onFilesSelected?.(files);
            }
            // Reset so re-selecting the same file fires `change` again.
            event.target.value = '';
          }}
        />
      </div>
    </FileUploadContext>
  );
}

interface FileUploadTriggerProps extends React.ComponentProps<'button'> {
  /** Render the trigger behavior onto your own child element (e.g. a Button). */
  readonly asChild?: boolean;
}

function FileUploadTrigger({ asChild = false, onClick, ...props }: FileUploadTriggerProps) {
  const { openFileDialog, disabled } = useFileUpload();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      openFileDialog();
    }
  };
  if (asChild) {
    return <Slot.Root data-slot="file-upload-trigger" onClick={handleClick} {...props} />;
  }
  return (
    <Button
      type="button"
      variant="outline"
      data-slot="file-upload-trigger"
      disabled={disabled}
      onClick={handleClick}
      {...props}
    />
  );
}

function FileUploadList({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="file-upload-list"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function FileUploadItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="file-upload-item"
      className={cn(
        'file-upload corner-themed flex items-center rounded-file-upload border-file-upload-item-border bg-file-upload-item-container',
        className
      )}
      {...props}
    />
  );
}

function FileUploadItemPreview({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="file-upload-item-preview"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-file-upload bg-file-upload-preview-bg text-file-upload-icon [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function FileUploadItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="file-upload-item-content"
      className={cn('flex min-w-0 flex-1 flex-col', className)}
      {...props}
    />
  );
}

function FileUploadItemName({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="file-upload-item-name"
      className={cn('truncate font-medium text-file-upload-name text-sm', className)}
      {...props}
    />
  );
}

interface FileUploadItemSizeProps extends React.ComponentProps<'p'> {
  /** Byte count, formatted via `formatFileSize` when no children are given. */
  readonly bytes?: number;
}

function FileUploadItemSize({ bytes, className, children, ...props }: FileUploadItemSizeProps) {
  return (
    <p
      data-slot="file-upload-item-size"
      className={cn('truncate text-file-upload-meta text-xs', className)}
      {...props}
    >
      {children ?? (bytes === undefined ? null : formatFileSize(bytes))}
    </p>
  );
}

function FileUploadItemProgress({
  className,
  ...props
}: React.ComponentProps<typeof Progress>) {
  return (
    <Progress
      data-slot="file-upload-item-progress"
      className={cn('mt-1.5 h-1.5', className)}
      {...props}
    />
  );
}

interface FileUploadItemRemoveProps extends React.ComponentProps<typeof Button> {
  readonly 'aria-label'?: string;
}

function FileUploadItemRemove({
  className,
  children,
  'aria-label': ariaLabel = 'Remove file',
  ...props
}: FileUploadItemRemoveProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      data-slot="file-upload-item-remove"
      aria-label={ariaLabel}
      className={cn('shrink-0 text-file-upload-meta', className)}
      {...props}
    >
      {children ?? <X aria-hidden />}
    </Button>
  );
}

export {
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
  formatFileSize,
};
