import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '../../primitives/cn';
import {
  CodeBlockContext,
  type CodeBlockContextValue,
  codeBlockVariants,
} from './code-block-internals';

export { codeBlockVariants } from './code-block-internals';
export {
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockInfo,
  type CodeBlockInfoData,
  useCodeBlock,
} from './code-block-header';
export { CodeBlockContent } from './code-block-content';
export { CodeBlockPanel, CodeBlockTab, CodeBlockTabs } from './code-block-tabs';
export { CodeBlockSelect, CodeBlockSelectItem } from './code-block-select';

interface CodeBlockProps
  extends Omit<React.ComponentProps<'div'>, 'onChange'>,
    VariantProps<typeof codeBlockVariants> {
  /** Visual treatment; "subtle" drops the surrounding chrome. */
  variant?: VariantProps<typeof codeBlockVariants>['variant'];
  /** Active file value for multi-file blocks (controlled). Pair with `onValueChange`. */
  value?: string;
  /** Active file value on first render (uncontrolled). Required when using `CodeBlockTabs`. */
  defaultValue?: string;
  /** Fires with the newly selected file value when the active tab changes. */
  onValueChange?: (value: string) => void;
}

export function CodeBlock({
  className,
  variant,
  value,
  defaultValue,
  onValueChange,
  ...props
}: Readonly<CodeBlockProps>) {
  const [state, setState] = React.useState({
    code: '',
    lineCount: 0,
    language: null as string | null,
    filename: null as string | null,
  });
  const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue ?? null);

  const setCodeInfo = React.useCallback(
    (code: string, lineCount: number) => setState((prev) => ({ ...prev, code, lineCount })),
    []
  );
  const setLanguage = React.useCallback(
    (language: string | null) => setState((prev) => ({ ...prev, language })),
    []
  );
  const setFilename = React.useCallback(
    (filename: string | null) => setState((prev) => ({ ...prev, filename })),
    []
  );

  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;
  const setActiveValue = React.useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const contextValue = React.useMemo<CodeBlockContextValue>(
    () => ({ ...state, setCodeInfo, setLanguage, setFilename, activeValue, setActiveValue }),
    [state, setCodeInfo, setLanguage, setFilename, activeValue, setActiveValue]
  );

  return (
    <CodeBlockContext.Provider value={contextValue}>
      <div
        data-slot="code-block"
        className={cn(codeBlockVariants({ variant }), className)}
        {...props}
      />
    </CodeBlockContext.Provider>
  );
}
