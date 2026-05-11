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

interface CodeBlockProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof codeBlockVariants> {
  /** Visual treatment; "subtle" drops the surrounding chrome. */
  variant?: VariantProps<typeof codeBlockVariants>['variant'];
}

export function CodeBlock({ className, variant, ...props }: Readonly<CodeBlockProps>) {
  const [state, setState] = React.useState({
    code: '',
    lineCount: 0,
    language: null as string | null,
    filename: null as string | null,
  });

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

  const contextValue = React.useMemo<CodeBlockContextValue>(
    () => ({ ...state, setCodeInfo, setLanguage, setFilename }),
    [state, setCodeInfo, setLanguage, setFilename]
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
