import { Check, Copy } from 'lucide-react';
import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '../../primitives/cn';
import { Button } from '../button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
import {
  codeBlockHeaderVariants,
  useCodeBlockContext,
} from './code-block-internals';

interface CodeBlockHeaderProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof codeBlockHeaderVariants> {
  /** Header treatment; "flat" removes the divider. */
  variant?: VariantProps<typeof codeBlockHeaderVariants>['variant'];
}

export function CodeBlockHeader({
  className,
  variant,
  ...props
}: Readonly<CodeBlockHeaderProps>) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(codeBlockHeaderVariants({ variant }), className)}
      {...props}
    />
  );
}

/** Render-prop component that provides code-block data. */
export type CodeBlockInfoData = {
  code: string;
  lineCount: number;
  language: string | null;
  filename: string | null;
};

export function CodeBlockInfo({
  children,
}: Readonly<{
  children: (data: CodeBlockInfoData) => React.ReactNode;
}>) {
  const { code, lineCount, language, filename } = useCodeBlockContext('CodeBlockInfo');
  return (
    <>
      {children({ code, lineCount, language, filename })}
    </>
  );
}

/** Hook to access code block context data. */
export function useCodeBlock() {
  return useCodeBlockContext('useCodeBlock');
}

/** Actions container (right side of header). */
export function CodeBlockActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn('ml-auto flex items-center gap-1', className)}
      {...props}
    />
  );
}

interface CodeBlockCopyButtonProps extends React.ComponentProps<typeof Button> {
  /** The literal string copied to the clipboard. Falls back to the parent CodeBlock's code. */
  value?: string;
  /** Label flashed after a successful copy. */
  copiedLabel?: string;
  /** Label shown in the resting state. */
  copyLabel?: string;
  /** How long the "copied" state persists before reverting, in milliseconds. */
  resetDelayMs?: number;
}

export function CodeBlockCopyButton({
  className,
  variant = 'ghost',
  size = 'icon',
  onClick,
  value,
  copiedLabel = 'Copied',
  copyLabel = 'Copy code',
  resetDelayMs = 1500,
  ...props
}: Readonly<CodeBlockCopyButtonProps>) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const { code } = useCodeBlockContext('CodeBlockCopyButton');
  const copyValue = value ?? code;

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        globalThis.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !navigator?.clipboard || !copyValue) return;

    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      if (timeoutRef.current) {
        globalThis.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = globalThis.setTimeout(() => setCopied(false), resetDelayMs);
    } catch {
      // Ignore clipboard failures
    }
  };

  const label = copied ? copiedLabel : copyLabel;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-slot="code-block-copy"
          variant={variant}
          size={size}
          className={cn('size-8', className)}
          onClick={handleCopy}
          aria-label={props['aria-label'] ?? label}
          type="button"
          {...props}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
