import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '../../primitives/cn';
import {
  type CodeBlockThemes,
  type CodeToken,
  DEFAULT_THEMES,
  codeBlockContentVariants,
  codeBlockGutterVariants,
  getTokenStyle,
  tokenizeWithShiki,
  useCodeBlockContext,
  useMode,
} from './code-block-internals';

interface CodeBlockContentProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof codeBlockContentVariants> {
  /** Shiki language identifier (e.g. "tsx", "bash"). */
  language?: string | null;
  /** Optional filename label rendered in the header. */
  filename?: string | null;
  /**
   * Shiki theme pair. The light entry is used when the page is in
   * light mode, the dark entry under `data-mode="dark"` / `.dark`.
   * Defaults to the Catppuccin pair
   * (`catppuccin-latte` / `catppuccin-mocha`).
   */
  themes?: CodeBlockThemes;
  /** Toggles the line-number gutter. */
  showLineNumbers?: boolean;
  /** Starting number when line numbers are shown. */
  lineNumberStart?: number;
  /** Density preset; "default" or "sm". */
  size?: VariantProps<typeof codeBlockContentVariants>['size'];
}

export function CodeBlockContent({
  className,
  size,
  language: languageProp,
  filename: filenameProp,
  themes = DEFAULT_THEMES,
  showLineNumbers = true,
  lineNumberStart = 1,
  children,
  ...props
}: Readonly<CodeBlockContentProps>) {
  const { setCodeInfo, setLanguage, setFilename } = useCodeBlockContext('CodeBlockContent');
  const [highlightTokens, setHighlightTokens] = React.useState<CodeToken[][] | null>(null);
  const [foreground, setForeground] = React.useState<string | null>(null);
  const mode = useMode();
  const activeTheme = mode === 'dark' ? themes.dark : themes.light;

  const code = React.useMemo(() => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) {
      return children.filter((child) => typeof child === 'string').join('');
    }
    return '';
  }, [children]);

  const normalizedCode = React.useMemo(() => code.replace(/\n$/, ''), [code]);
  const lines = React.useMemo(() => normalizedCode.split('\n'), [normalizedCode]);

  // Set language and filename in context.
  React.useEffect(() => {
    setLanguage(languageProp ?? null);
  }, [languageProp, setLanguage]);

  React.useEffect(() => {
    setFilename(filenameProp ?? null);
  }, [filenameProp, setFilename]);

  React.useEffect(() => {
    if (!languageProp) {
      setHighlightTokens(null);
      setForeground(null);
      return;
    }

    let cancelled = false;
    tokenizeWithShiki(normalizedCode, languageProp, activeTheme).then((result) => {
      if (cancelled) return;
      setHighlightTokens(result?.tokens ?? null);
      setForeground(result?.foreground ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, [languageProp, normalizedCode, activeTheme]);

  React.useEffect(() => {
    setCodeInfo(normalizedCode, lines.length);
  }, [lines.length, normalizedCode, setCodeInfo]);

  const lineHeight = size === 'sm' ? 'h-5 leading-5' : 'h-6 leading-6';

  return (
    <div
      data-slot="code-block-content"
      className={cn(
        'grid min-w-0',
        showLineNumbers ? 'grid-cols-[auto_1fr]' : 'grid-cols-1',
        className
      )}
      {...props}
    >
      {showLineNumbers && (
        <div className={codeBlockGutterVariants({ size })} aria-hidden="true">
          {lines.map((_, i) => (
            <div key={`ln-${lineNumberStart + i}`} className={cn('text-right', lineHeight)}>
              {lineNumberStart + i}
            </div>
          ))}
        </div>
      )}
      <div className="min-w-0 overflow-x-auto">
        <pre className={codeBlockContentVariants({ size })}>
          <code
            data-slot="code-block-code"
            className="block font-mono"
            style={{ color: foreground ?? undefined }}
          >
            {lines.map((line, i) => {
              const tokens = highlightTokens?.[i];
              return (
                <span
                  key={`line-${lineNumberStart + i}`}
                  className={cn('block min-h-6 whitespace-pre', lineHeight)}
                >
                  {tokens?.length
                    ? tokens.map((token, j) => (
                        <span key={`${lineNumberStart + i}-${j}`} style={getTokenStyle(token)}>
                          {token.content}
                        </span>
                      ))
                    : line || ' '}
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
